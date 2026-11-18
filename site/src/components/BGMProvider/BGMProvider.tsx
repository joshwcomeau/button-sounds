import * as React from 'react';
import { Howl } from 'howler';

import { applyChannelMode, type ChannelMode } from './BGMProvider.helpers';

export type { ChannelMode };

// UI volume, from 0 to 1. Howler receives `scaleVolume(INITIAL_VOLUME)`.
const INITIAL_VOLUME = 0.25;
export const INTRO_DURATION_MS = 2400;

// The Howler volume used when the UI volume is at 100%.
const MAX_VOLUME = 0.7;
// Higher values give more control over the quiet end of the slider. 1 would be linear.
const VOLUME_CURVE_EXPONENT = 1.5;

// Perceived loudness isn’t linear with amplitude, so a power curve makes the slider feel more even.
function scaleVolume(uiVolume: number) {
  const clamped = Math.min(Math.max(uiVolume, 0), 1);
  return MAX_VOLUME * clamped ** VOLUME_CURVE_EXPONENT;
}

const bgm = new Howl({
  src: ['/sounds/actuator.mp3'],
  loop: true,
  volume: scaleVolume(INITIAL_VOLUME),
});

const bgmIntro = new Howl({
  src: ['/sounds/actuator-intro.mp3'],
  volume: scaleVolume(INITIAL_VOLUME),
});

// Calling `play()` without an ID starts a new, overlapping instance, so we hold onto the first one and reuse it.
let soundId: number | undefined;
let introSoundId: number | undefined;
// Set while a fade-out is in progress. Calling it abandons the fade and restores the sound’s volume, so the next `play()` isn’t silent.
let cancelFadeOut: (() => void) | null = null;

const TIMESTAMP_POLL_INTERVAL_MS = 500;
// This is the point we jump to with the "Fast forward" button. Honestly this button doesn't really make sense in this context, with only 1 song, but it looks wrong without it. If I ever add new songs, this'll be useful.
const FAST_FORWARD_TIMESTAMP = 76;
const EJECT_FADE_DURATION_MS = 250;

// With a single argument, Howler treats anything that isn’t a known sound ID as a seek position, so we can’t pass `soundId` through when it’s undefined.
function getPlaybackPosition() {
  return soundId === undefined ? 0 : bgm.seek(soundId);
}

let channelMode: ChannelMode = 'stereo';

interface BGMContextType {
  // True during the intro as well as the song.
  isPlaying: boolean;
  // Until this is true, play/stop/rewind control the intro, and the song itself hasn’t started.
  hasCompletedIntro: boolean;
  // Increments every time the intro starts from the beginning, so that intro animations can be restarted by using it as a `key`.
  introStartCount: number;
  volume: number;
  panning: number;
  channelMode: ChannelMode;
  // Seconds into the song
  timestamp: number;
  // Seconds. 0 until the file has loaded.
  duration: number;
}
interface BGMContextSetter {
  play: () => void;
  pause: () => void;
  stop: () => void;
  stopWithFade: (duration: number) => void;
  rewind: () => void;
  fastForward: () => void;
  eject: () => void;
  seek: (timestamp: number) => void;
  setVolume: (value: number) => void;
  setPanning: (value: number) => void;
  setChannelMode: (value: ChannelMode) => void;
  // Reads the exact position straight from Howler, for the frequency visualizer, which needs more accurate info than `timestamp`
  getPlaybackPosition: () => number;
}

const BGMContext = React.createContext<BGMContextType>({
  isPlaying: false,
  hasCompletedIntro: false,
  introStartCount: 0,
  volume: INITIAL_VOLUME,
  // -1 (full left) to 1 (full right)
  panning: 0,
  channelMode: 'stereo',
  timestamp: 0,
  duration: 0,
});
const BGMSetterContext = React.createContext<BGMContextSetter>({
  play: () => {},
  pause: () => {},
  stop: () => {},
  stopWithFade: () => {},
  rewind: () => {},
  fastForward: () => {},
  eject: () => {},
  seek: () => {},
  setVolume: () => {},
  setPanning: () => {},
  setChannelMode: () => {},
  getPlaybackPosition: () => 0,
});

function BGMProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = React.useState(false);
  const [introStartCount, setIntroStartCount] = React.useState(0);
  const [volume, rawSetVolume] = React.useState(INITIAL_VOLUME);
  const [panning, rawSetPanning] = React.useState(0);
  const [channelModeState, rawSetChannelMode] =
    React.useState<ChannelMode>(channelMode);
  const [timestamp, setTimestamp] = React.useState(0);
  const [duration, setDuration] = React.useState(bgm.duration());

  // Lets the first `play()` honor a position the user scrubbed to before any sound instance existed.
  const timestampRef = React.useRef(timestamp);
  React.useEffect(() => {
    timestampRef.current = timestamp;
  }, [timestamp]);

  // Lets `play`/`pause` act as toggles without being recreated on every change. This tracks our state rather than `bgm.playing()`, so a song that’s fading out counts as stopped.
  const isPlayingRef = React.useRef(isPlaying);
  React.useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const hasCompletedIntroRef = React.useRef(hasCompletedIntro);
  React.useEffect(() => {
    hasCompletedIntroRef.current = hasCompletedIntro;
  }, [hasCompletedIntro]);

  React.useEffect(() => {
    function handleIntroEnd() {
      soundId = bgm.play(soundId);
      applyChannelMode(bgm, soundId, channelMode);
      setTimestamp(0);
      setHasCompletedIntro(true);
    }

    bgmIntro.on('end', handleIntroEnd);

    return () => {
      bgmIntro.off('end', handleIntroEnd);
    };
  }, []);

  React.useEffect(() => {
    if (bgm.state() === 'loaded') {
      return;
    }

    function handleLoad() {
      setDuration(bgm.duration());
    }

    bgm.once('load', handleLoad);

    return () => {
      bgm.off('load', handleLoad);
    };
  }, []);

  // With `loop: true`, Howler fires `end` every time the song wraps around.
  React.useEffect(() => {
    function handleLoop() {
      setTimestamp(0);
    }

    bgm.on('end', handleLoop);

    return () => {
      bgm.off('end', handleLoop);
    };
  }, []);

  React.useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimestamp(getPlaybackPosition());
    }, TIMESTAMP_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Pressing play while already playing restarts the song (or the intro).
  const play = React.useCallback(() => {
    if (!hasCompletedIntroRef.current) {
      if (introSoundId !== undefined && bgmIntro.playing(introSoundId)) {
        bgmIntro.seek(0, introSoundId);
      } else {
        introSoundId = bgmIntro.play(introSoundId);
        applyChannelMode(bgmIntro, introSoundId, channelMode);
      }
      setIntroStartCount((count) => count + 1);
      setIsPlaying(true);
      return;
    }

    if (isPlayingRef.current && soundId !== undefined) {
      bgm.seek(0, soundId);
      setTimestamp(0);
      return;
    }

    cancelFadeOut?.();
    const isFirstPlay = soundId === undefined;
    soundId = bgm.play(soundId);
    applyChannelMode(bgm, soundId, channelMode);
    if (isFirstPlay && timestampRef.current > 0) {
      bgm.seek(timestampRef.current, soundId);
    }
    setIsPlaying(true);
  }, []);

  const pause = React.useCallback(() => {
    // The intro cannot be paused; it would be too complicated, given the sequence of enter animations that trigger in the media player. It can be stopped, which restarts everything.
    if (!hasCompletedIntroRef.current) {
      return;
    }

    if (!isPlayingRef.current) {
      play();
      return;
    }

    cancelFadeOut?.();
    bgm.pause(soundId);
    setTimestamp(getPlaybackPosition());
    setIsPlaying(false);
  }, [play]);

  const stop = React.useCallback(() => {
    if (!hasCompletedIntroRef.current) {
      if (introSoundId !== undefined) {
        bgmIntro.stop(introSoundId);
      }
      setIsPlaying(false);
      return;
    }

    cancelFadeOut?.();
    bgm.stop(soundId);
    setTimestamp(0);
    setIsPlaying(false);
  }, []);

  const stopWithFade = React.useCallback(
    (duration: number) => {
      const id = soundId;
      // This includes the intro, which doesn’t fade; it’s short enough that cutting it off is fine.
      if (id === undefined || !bgm.playing(id)) {
        stop();
        return;
      }

      cancelFadeOut?.();

      const handleFadeEnd = () => {
        cancelFadeOut = null;
        bgm.stop(id);
        bgm.volume(bgm.volume(), id);
        setTimestamp(0);
      };

      cancelFadeOut = () => {
        cancelFadeOut = null;
        bgm.off('fade', handleFadeEnd, id);
        // Setting the volume also halts Howler’s in-progress fade.
        bgm.volume(bgm.volume(), id);
      };

      bgm.once('fade', handleFadeEnd, id);
      bgm.fade(bgm.volume(), 0, duration, id);
      setIsPlaying(false);
    },
    [stop],
  );

  const rewind = React.useCallback(() => {
    if (!hasCompletedIntroRef.current) {
      if (introSoundId !== undefined && bgmIntro.playing(introSoundId)) {
        bgmIntro.seek(0, introSoundId);
        setIntroStartCount((count) => count + 1);
      }
      return;
    }

    if (soundId !== undefined) {
      bgm.seek(0, soundId);
    }
    setTimestamp(0);
  }, []);

  const seek = React.useCallback((value: number) => {
    if (soundId !== undefined) {
      bgm.seek(value, soundId);
    }
    setTimestamp(value);
  }, []);

  const fastForward = React.useCallback(() => {
    if (!hasCompletedIntroRef.current) {
      return;
    }

    seek(FAST_FORWARD_TIMESTAMP);
  }, [seek]);

  // Stops everything so that the next `play()` starts with the intro, without the song still playing underneath it.
  const eject = React.useCallback(() => {
    stopWithFade(EJECT_FADE_DURATION_MS);
    setHasCompletedIntro(false);
  }, [stopWithFade]);

  const setVolume = React.useCallback((value: number) => {
    // Changing the volume would interrupt a fade-out, so finish the stop right away.
    if (cancelFadeOut) {
      cancelFadeOut();
      bgm.stop(soundId);
    }
    const scaledVolume = scaleVolume(value);
    bgm.volume(scaledVolume);
    bgmIntro.volume(scaledVolume);
    rawSetVolume(value);
  }, []);

  const setPanning = React.useCallback((value: number) => {
    // Weirdly, Howler uses the opposite of what I'd expect? -1 is full *right* instead of full left
    const howlerValue = value * -1;
    bgm.stereo(howlerValue);
    bgmIntro.stereo(howlerValue);
    rawSetPanning(value);
  }, []);

  const setChannelMode = React.useCallback((value: ChannelMode) => {
    channelMode = value;
    applyChannelMode(bgm, soundId, channelMode);
    applyChannelMode(bgmIntro, introSoundId, channelMode);
    rawSetChannelMode(value);
  }, []);

  const value = React.useMemo(
    () => ({
      isPlaying,
      hasCompletedIntro,
      introStartCount,
      volume,
      panning,
      channelMode: channelModeState,
      timestamp,
      duration,
    }),
    [
      isPlaying,
      hasCompletedIntro,
      introStartCount,
      volume,
      panning,
      channelModeState,
      timestamp,
      duration,
    ],
  );

  const setters = React.useMemo(
    () => ({
      play,
      pause,
      stop,
      stopWithFade,
      rewind,
      fastForward,
      eject,
      seek,
      setVolume,
      setPanning,
      setChannelMode,
      getPlaybackPosition,
    }),
    [
      play,
      pause,
      stop,
      stopWithFade,
      rewind,
      fastForward,
      eject,
      seek,
      setVolume,
      setPanning,
      setChannelMode,
    ],
  );

  return (
    <BGMContext.Provider value={value}>
      <BGMSetterContext.Provider value={setters}>
        {children}
      </BGMSetterContext.Provider>
    </BGMContext.Provider>
  );
}

export function useBGMState() {
  return React.useContext(BGMContext);
}

export function useBGMSetters() {
  return React.useContext(BGMSetterContext);
}

export default BGMProvider;
