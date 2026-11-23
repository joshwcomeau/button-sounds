// A Winamp-style spectrum analyzer. Rather than tapping into Howler’s audio graph, we decode the song ourselves and analyze whichever slice of it is currently playing, so the spectrum itself isn’t affected by the volume slider or the intro. Drawn bar height still follows the volume slider below 40%.
import * as React from 'react';
import { Howler } from 'howler';

import {
  INTRO_DURATION_MS,
  useBGMState,
  useBGMSetters,
} from '@/components/BGMProvider/BGMProvider';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';
import useRequestAnimationFrameLoop from '@/hooks/use-request-animation-frame';

const SONG_SRC = '/sounds/actuator.mp3';

const BAR_WIDTH = 3;
const BAR_GAP = 1;
const NUM_OF_BARS = 15;
const CANVAS_WIDTH = NUM_OF_BARS * BAR_WIDTH + (NUM_OF_BARS - 1) * BAR_GAP;
const CANVAS_HEIGHT = 16;

// Must be a power of 2, for the FFT. Smaller sizes react faster but can’t tell the lowest bands apart.
const FFT_SIZE = 4096;
const MIN_FREQ = 50;
const MAX_FREQ = 16000;
// Band levels are mapped from this range onto the full height of the canvas.
const MIN_DB = -65;
const MAX_DB = -35;
// Music has much less energy in the highs than the lows, so without compensation the right-hand bars would barely move.
const TILT_DB_PER_OCTAVE = 3;
const TILT_REFERENCE_FREQ = 1000;
// How much of the canvas height a bar can fall per second. Bars rise instantly.
const DECAY_PER_SECOND = 2.5;
// At this volume and above, bars are drawn at their analyzed height. Below it they shrink linearly.
const FULL_HEIGHT_VOLUME = 0.5;
// Keeps a long gap between frames (e.g. a backgrounded tab) from being treated as one giant step.
const MAX_FRAME_SECONDS = 0.1;
// Reduced motion still shows the spectrum, but only as a once-per-second snapshot.
const REDUCED_MOTION_INTERVAL_MS = 1000;

// During the intro, a wave rises and falls through the bars from left to right, leaving each one resting at 2px until the song takes over.
const INTRO_WAVE_DURATION_MS = INTRO_DURATION_MS - 400;
const INTRO_PULSE_MS = 600;
const INTRO_STAGGER_MS =
  (INTRO_WAVE_DURATION_MS - INTRO_PULSE_MS) / (NUM_OF_BARS - 1);
const INTRO_REST_LEVEL = 2 / CANVAS_HEIGHT;

const GRADIENT_STOPS: Array<[number, string]> = [
  [0, 'hsl(140deg 100% 45%)'],
  [0.55, 'hsl(85deg 100% 50%)'],
  [1, 'hsl(30deg 100% 55%)'],
];

interface DecodedSong {
  samples: Float32Array;
  sampleRate: number;
  // The inclusive range of FFT bins that make up each bar.
  bands: Array<[number, number]>;
}

const hannWindow = new Float32Array(FFT_SIZE).map(
  (_, i) => 0.5 * (1 - Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1))),
);
const twiddleReal = new Float32Array(FFT_SIZE / 2).map((_, i) =>
  Math.cos((-2 * Math.PI * i) / FFT_SIZE),
);
const twiddleImag = new Float32Array(FFT_SIZE / 2).map((_, i) =>
  Math.sin((-2 * Math.PI * i) / FFT_SIZE),
);

// Reused every frame, to avoid allocating while animating.
const real = new Float32Array(FFT_SIZE);
const imag = new Float32Array(FFT_SIZE);

function FrequencyVisualizer() {
  const { isPlaying, hasCompletedIntro, introStartCount, volume } =
    useBGMState();
  const { getPlaybackPosition } = useBGMSetters();
  const prefersReducedMotion = usePrefersReducedMotion();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const songRef = React.useRef<DecodedSong | null>(null);
  const levelsRef = React.useRef(new Float32Array(NUM_OF_BARS));
  const lastFrameTimeRef = React.useRef<number | null>(null);
  const introRef = React.useRef<{ count: number; startTime: number } | null>(
    null,
  );

  const isActive = isPlaying && hasCompletedIntro;
  const isIntroPlaying = isPlaying && !hasCompletedIntro;

  // After the song (or intro) stops, we keep animating until the bars have fallen back to zero.
  const [isSettling, setIsSettling] = React.useState(false);
  const [wasPlaying, setWasPlaying] = React.useState(isPlaying);
  if (isPlaying !== wasPlaying) {
    setWasPlaying(isPlaying);
    setIsSettling(!isPlaying);
  }

  React.useEffect(() => {
    let isCancelled = false;

    async function loadSong() {
      const response = await fetch(SONG_SRC);
      const arrayBuffer = await response.arrayBuffer();
      // Howler creates its context as soon as the first Howl exists, which BGMProvider does on import.
      const audioBuffer = await Howler.ctx.decodeAudioData(arrayBuffer);

      if (isCancelled) {
        return;
      }

      songRef.current = {
        samples: mixToMono(audioBuffer),
        sampleRate: audioBuffer.sampleRate,
        bands: getBands(audioBuffer.sampleRate),
      };
    }

    loadSong().catch((error: unknown) => {
      console.error(
        'Unable to load the song for the frequency visualizer',
        error,
      );
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useRequestAnimationFrameLoop(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Checked every frame, so the backing store stays in sync if the pixel ratio changes (e.g. the window moves to another monitor) or the dimensions change during hot reloading.
    const dpr = window.devicePixelRatio || 1;
    if (
      !contextRef.current ||
      canvas.width !== Math.round(CANVAS_WIDTH * dpr) ||
      canvas.height !== Math.round(CANVAS_HEIGHT * dpr)
    ) {
      contextRef.current = setUpCanvas(canvas, dpr);
    }
    const context = contextRef.current;
    if (!context) {
      return;
    }

    const now = performance.now();
    if (
      prefersReducedMotion &&
      lastFrameTimeRef.current !== null &&
      now - lastFrameTimeRef.current < REDUCED_MOTION_INTERVAL_MS
    ) {
      return;
    }

    const maxFrameSeconds = prefersReducedMotion
      ? REDUCED_MOTION_INTERVAL_MS / 1000
      : MAX_FRAME_SECONDS;
    const elapsedSeconds =
      lastFrameTimeRef.current === null
        ? 0
        : Math.min((now - lastFrameTimeRef.current) / 1000, maxFrameSeconds);
    lastFrameTimeRef.current = now;

    const levels = levelsRef.current;
    const volumeScale = Math.min(volume / FULL_HEIGHT_VOLUME, 1);

    // Rewinding during the intro bumps the count, which restarts the wave.
    if (isIntroPlaying && introRef.current?.count !== introStartCount) {
      introRef.current = { count: introStartCount, startTime: now };
    } else if (!isIntroPlaying && introRef.current) {
      introRef.current = null;
      // The bars snap straight to the song’s levels, rather than falling from their resting height.
      if (isActive) {
        levels.fill(0);
      }
    }
    const introElapsedMs = introRef.current
      ? now - introRef.current.startTime
      : null;

    const song = songRef.current;
    const targets =
      isActive && song ? analyze(song, getPlaybackPosition()) : null;

    let hasEnergy = false;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < NUM_OF_BARS; i++) {
      let level: number;
      if (introElapsedMs !== null) {
        level = getIntroLevel(i, introElapsedMs);
      } else {
        const fallen = Math.max(
          (levels[i] ?? 0) - DECAY_PER_SECOND * elapsedSeconds,
          0,
        );
        level = Math.max(targets?.[i] ?? 0, fallen);
      }
      levels[i] = level;
      if (level > 0) {
        hasEnergy = true;
      }

      // Whole pixels keep the bars crisp.
      const height = Math.round(level * volumeScale * CANVAS_HEIGHT);
      context.fillRect(
        i * (BAR_WIDTH + BAR_GAP),
        CANVAS_HEIGHT - height,
        BAR_WIDTH,
        height,
      );
    }

    if (!isPlaying && !hasEnergy) {
      lastFrameTimeRef.current = null;
      setIsSettling(false);
    }
  }, isPlaying || isSettling);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      aria-hidden="true"
    />
  );
}

// Each bar sweeps up to full height and back down, settling at its resting height once the wave has passed.
function getIntroLevel(barIndex: number, elapsedMs: number) {
  const progress = (elapsedMs - barIndex * INTRO_STAGGER_MS) / INTRO_PULSE_MS;
  if (progress <= 0) {
    return 0;
  }
  if (progress >= 1) {
    return INTRO_REST_LEVEL;
  }

  const wave = Math.sin(Math.PI * progress);
  return progress < 0.5
    ? wave
    : INTRO_REST_LEVEL + (1 - INTRO_REST_LEVEL) * wave;
}

// Resizing a canvas resets its context state, so the scale and gradient are applied after.
function setUpCanvas(canvas: HTMLCanvasElement, dpr: number) {
  canvas.width = Math.round(CANVAS_WIDTH * dpr);
  canvas.height = Math.round(CANVAS_HEIGHT * dpr);

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  context.scale(dpr, dpr);

  // A single gradient spans the whole canvas, so short bars only show the green end.
  const gradient = context.createLinearGradient(0, CANVAS_HEIGHT, 0, 0);
  for (const [offset, color] of GRADIENT_STOPS) {
    gradient.addColorStop(offset, color);
  }
  context.fillStyle = gradient;

  return context;
}

function mixToMono(audioBuffer: AudioBuffer) {
  const mono = new Float32Array(audioBuffer.length);
  const channelCount = audioBuffer.numberOfChannels;

  for (let channel = 0; channel < channelCount; channel++) {
    audioBuffer.getChannelData(channel).forEach((value, i) => {
      mono[i] = (mono[i] ?? 0) + value / channelCount;
    });
  }

  return mono;
}

// Bands are spaced logarithmically, since that’s how we perceive pitch.
function getBands(sampleRate: number): Array<[number, number]> {
  const binWidth = sampleRate / FFT_SIZE;
  const ratio = MAX_FREQ / MIN_FREQ;

  return Array.from({ length: NUM_OF_BARS }, (_, i) => {
    const low = MIN_FREQ * ratio ** (i / NUM_OF_BARS);
    const high = MIN_FREQ * ratio ** ((i + 1) / NUM_OF_BARS);
    const lowBin = Math.round(low / binWidth);
    // The lowest bands are narrower than a single bin, so each band gets at least one.
    const highBin = Math.max(lowBin, Math.round(high / binWidth) - 1);
    return [lowBin, Math.min(highBin, FFT_SIZE / 2 - 1)];
  });
}

// Returns the level of each band, from 0 to 1, for the audio at `position` seconds.
function analyze(song: DecodedSong, position: number) {
  const { samples, sampleRate, bands } = song;
  const start = Math.floor(position * sampleRate);

  for (let i = 0; i < FFT_SIZE; i++) {
    real[i] = (samples[start + i] ?? 0) * (hannWindow[i] ?? 0);
    imag[i] = 0;
  }

  fft(real, imag);

  const binWidth = sampleRate / FFT_SIZE;
  return bands.map(([lowBin, highBin]) => {
    let maxMagnitude = 0;
    for (let bin = lowBin; bin <= highBin; bin++) {
      const magnitude = Math.hypot(real[bin] ?? 0, imag[bin] ?? 0) / FFT_SIZE;
      maxMagnitude = Math.max(maxMagnitude, magnitude);
    }

    const centerFreq = ((lowBin + highBin) / 2) * binWidth;
    const tilt =
      TILT_DB_PER_OCTAVE * Math.log2(centerFreq / TILT_REFERENCE_FREQ);
    const db = 20 * Math.log10(maxMagnitude || Number.EPSILON) + tilt;
    return Math.min(Math.max((db - MIN_DB) / (MAX_DB - MIN_DB), 0), 1);
  });
}

// An in-place, iterative radix-2 Cooley–Tukey FFT.
function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;

  // Reorder the input into bit-reversed order.
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;

    if (i < j) {
      [re[i], re[j]] = [re[j] ?? 0, re[i] ?? 0];
      [im[i], im[j]] = [im[j] ?? 0, im[i] ?? 0];
    }
  }

  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const twiddleStep = n / size;

    for (let blockStart = 0; blockStart < n; blockStart += size) {
      for (let k = 0; k < half; k++) {
        const wr = twiddleReal[k * twiddleStep] ?? 0;
        const wi = twiddleImag[k * twiddleStep] ?? 0;
        const a = blockStart + k;
        const b = a + half;
        const aRe = re[a] ?? 0;
        const aIm = im[a] ?? 0;
        const bRe = re[b] ?? 0;
        const bIm = im[b] ?? 0;
        const tr = bRe * wr - bIm * wi;
        const ti = bRe * wi + bIm * wr;
        re[a] = aRe + tr;
        im[a] = aIm + ti;
        re[b] = aRe - tr;
        im[b] = aIm - ti;
      }
    }
  }
}

export default FrequencyVisualizer;
