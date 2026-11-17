import * as React from 'react';
import { Howl } from 'howler';

const INITIAL_VOLUME = 0.25;

const bgm = new Howl({
  src: ['/sounds/actuator.mp3'],
  loop: true,
  volume: INITIAL_VOLUME,
});

const bgmIntro = new Howl({
  src: ['/sounds/actuator-intro.mp3'],
  volume: INITIAL_VOLUME,
});

// Calling `play()` without an ID starts a new, overlapping instance, so we hold onto the first one and reuse it.
let soundId: number | undefined;
// Set while a fade-out is in progress. Calling it abandons the fade and restores the sound’s volume, so the next `play()` isn’t silent.
let cancelFadeOut: (() => void) | null = null;

const TIMESTAMP_POLL_INTERVAL_MS = 500;

// With a single argument, Howler treats anything that isn’t a known sound ID as a seek position, so we can’t pass `soundId` through when it’s undefined.
function getPlaybackPosition() {
  return soundId === undefined ? 0 : bgm.seek(soundId);
}

interface BGMContextType {
  isPlaying: boolean;
  volume: number;
  panning: number;
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
  seek: (timestamp: number) => void;
  setVolume: (value: number) => void;
  setPanning: (value: number) => void;
}

const BGMContext = React.createContext<BGMContextType>({
  isPlaying: false,
  volume: INITIAL_VOLUME,
  // -1 (full left) to 1 (full right)
  panning: 0,
  timestamp: 0,
  duration: 0,
});
const BGMSetterContext = React.createContext<BGMContextSetter>({
  play: () => {},
  pause: () => {},
  stop: () => {},
  stopWithFade: () => {},
  rewind: () => {},
  seek: () => {},
  setVolume: () => {},
  setPanning: () => {},
});

function BGMProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, rawSetVolume] = React.useState(bgm.volume());
  const [panning, rawSetPanning] = React.useState(0);
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

  // Pressing play while already playing restarts the song.
  const play = React.useCallback(() => {
    if (isPlayingRef.current && soundId !== undefined) {
      bgm.seek(0, soundId);
      setTimestamp(0);
      return;
    }

    cancelFadeOut?.();
    const isFirstPlay = soundId === undefined;
    soundId = bgm.play(soundId);
    if (isFirstPlay && timestampRef.current > 0) {
      bgm.seek(timestampRef.current, soundId);
    }
    setIsPlaying(true);
  }, []);

  // Pressing pause while not playing resumes from the current position.
  const pause = React.useCallback(() => {
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
    cancelFadeOut?.();
    bgm.stop(soundId);
    setTimestamp(0);
    setIsPlaying(false);
  }, []);

  const stopWithFade = React.useCallback(
    (duration: number) => {
      const id = soundId;
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

  const setVolume = React.useCallback((value: number) => {
    // Changing the volume would interrupt a fade-out, so finish the stop right away.
    if (cancelFadeOut) {
      cancelFadeOut();
      bgm.stop(soundId);
    }
    bgm.volume(value);
    rawSetVolume(value);
  }, []);

  const setPanning = React.useCallback((value: number) => {
    bgm.stereo(value);
    rawSetPanning(value);
  }, []);

  const value = React.useMemo(
    () => ({
      isPlaying,
      volume,
      panning,
      timestamp,
      duration,
    }),
    [isPlaying, volume, panning, timestamp, duration],
  );

  const setters = React.useMemo(
    () => ({
      play,
      pause,
      stop,
      stopWithFade,
      rewind,
      seek,
      setVolume,
      setPanning,
    }),
    [play, pause, stop, stopWithFade, rewind, seek, setVolume, setPanning],
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
