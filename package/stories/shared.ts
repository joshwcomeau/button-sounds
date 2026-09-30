import { SOUND_NAMES, DEFAULT_NAME } from '../src/index';
import type { SoundName } from '../src/index';

export interface SoundStoryArgs {
  name: SoundName;
  volume: number;
  lofi: boolean;
  pitchVariation: number;
}

export const soundArgTypes = {
  name: {
    control: 'select' as const,
    options: SOUND_NAMES,
  },
  volume: {
    control: { type: 'range' as const, min: 0, max: 1, step: 0.05 },
  },
  lofi: {
    control: 'boolean' as const,
  },
  pitchVariation: {
    control: { type: 'range' as const, min: 0, max: 0.5, step: 0.05 },
  },
};

export const defaultSoundArgs: SoundStoryArgs = {
  name: DEFAULT_NAME,
  volume: 1,
  lofi: false,
  pitchVariation: 0.25,
};
