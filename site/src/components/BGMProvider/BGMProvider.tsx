import * as React from 'react';
import { Howl } from 'howler';

// Load the sounds ASAP
const bgm = new Howl({
  src: ['/sounds/actuator.mp3'],
  loop: true,
  volume: 0.25,
});

interface BGMContextType {
  isPlaying: boolean;
  volume: number;
  panning: number;
}
interface BGMContextSetter {
  setIsPlaying: (value: boolean) => void;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setPanning: React.Dispatch<React.SetStateAction<number>>;
}

const BGMContext = React.createContext<BGMContextType>({
  isPlaying: false,
  volume: 0.25,
  // -1 (full left) to 1 (full right)
  panning: 0,
});
const BGMSetterContext = React.createContext<BGMContextSetter>({
  setIsPlaying: () => {},
  setVolume: () => {},
  setPanning: () => {},
});

function BGMProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, rawSetIsPlaying] = React.useState(false);
  const [volume, rawSetVolume] = React.useState(bgm.volume());
  const [panning, rawSetPanning] = React.useState(0);

  const setIsPlaying = React.useCallback((value: boolean) => {
    if (value) {
      bgm.play();
    } else {
      bgm.stop();
    }
    rawSetIsPlaying(value);
  }, []);

  const value = React.useMemo(
    () => ({
      isPlaying,
      volume,
      panning,
    }),
    [isPlaying, volume, panning],
  );

  const setters = React.useMemo(
    () => ({
      setIsPlaying,
      // TODO: Implement these
      setVolume: rawSetVolume,
      setPanning: rawSetPanning,
    }),
    [setIsPlaying],
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
