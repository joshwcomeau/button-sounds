// All of the sounds in this project share the same sprite map. The only difference is that different sounds have a different # of included samples.
// Here’s how to read this map: the first number is the timestamp for the start of the sample, in milliseconds. The second number is the duration, in milliseconds. For example, if I wanted to play the "up3" sample, I would need to start playback at 0:03.200 and run it for 790ms.

type SpriteMap = Record<string, [number, number]>;

const SHARED_SPRITE_MAP = {
  down1: [1000, 190],
  up1: [1200, 790],
  down2: [2000, 190],
  up2: [2200, 790],
  down3: [3000, 190],
  up3: [3200, 790],
  down4: [4000, 190],
  up4: [4200, 790],
  down5: [5000, 190],
  up5: [5200, 790],
  down6: [6000, 190],
  up6: [6200, 790],
  down7: [7000, 190],
  up7: [7200, 790],
  down8: [8000, 190],
  up8: [8200, 790],
} satisfies SpriteMap;

// Each sound has between 4-8 pairs of samples. We’ll pluck the correct number of up/down pairs based on the number provided.
function getSubsetOfData(numOfSamples: number): SpriteMap {
  return Object.fromEntries(
    Object.entries(SHARED_SPRITE_MAP).slice(
      0,
      // Multiplied by 2 since each sample has both up + down:
      numOfSamples * 2,
    ),
  ) satisfies SpriteMap;
}

export const SPRITE_DATA = {
  'hi75-soft': getSubsetOfData(7),
  'hi75-medium': getSubsetOfData(8),
  'hi75-hard': getSubsetOfData(6),
  'hi75-space': getSubsetOfData(6),
  'hi75-knob': getSubsetOfData(8),
  'low-thumps': getSubsetOfData(6),
  'ps4-clicky': getSubsetOfData(7),
  'ps4-double': getSubsetOfData(8),
  'ps4-dull': getSubsetOfData(7),
  'ps4-paddle': getSubsetOfData(6),
  'ps4-snappy': getSubsetOfData(8),
  'halo-soft': getSubsetOfData(6),
  'halo-hard': getSubsetOfData(6),
  'halo-space': getSubsetOfData(7),
  'halo-shift': getSubsetOfData(7),
  'uhk-soft': getSubsetOfData(6),
  'uhk-medium': getSubsetOfData(7),
  'uhk-space': getSubsetOfData(4),
  'raddy-low': getSubsetOfData(5),
  'raddy-medium': getSubsetOfData(6),
  'raddy-high': getSubsetOfData(6),
  'carson-microflip': getSubsetOfData(5),
  'heated-blanket': getSubsetOfData(7),
  'asus-kbd-soft': getSubsetOfData(8),
  'asus-kbd-medium': getSubsetOfData(6),
  'asus-kbd-hard': getSubsetOfData(5),
  'asus-kbd-space': getSubsetOfData(6),
  'asus-mouse': getSubsetOfData(7),
  'rival-3': getSubsetOfData(7),
  'rival-3-middle': getSubsetOfData(6),
  'ergo-mx': getSubsetOfData(6),
  'mx-master-3': getSubsetOfData(4),
  'kvm-switch': getSubsetOfData(5),
  'led-blacklight': getSubsetOfData(4),
  'treadmill-sharp': getSubsetOfData(4),
  'treadmill-pitched': getSubsetOfData(4),
  'treadmill-flinty': getSubsetOfData(4),
  'camera-latch': getSubsetOfData(5),
  'sd-standard': getSubsetOfData(7),
  'sd-squelchy': getSubsetOfData(6),
  'sd-resonant': getSubsetOfData(6),
  'sd-distorted': getSubsetOfData(5),
  'sd-metallic': getSubsetOfData(7),
  'sd-clicky': getSubsetOfData(4),
  iidx: getSubsetOfData(4),
  'popper-dice': getSubsetOfData(5),
  'popper-empty': getSubsetOfData(5),
  'guitar-toggle-on': getSubsetOfData(6),
  'guitar-toggle-off': getSubsetOfData(6),
  'tonal-on': getSubsetOfData(4),
  'tonal-off': getSubsetOfData(4),
  'synth-on': getSubsetOfData(8),
  'synth-off': getSubsetOfData(8),
  'lock-closed': getSubsetOfData(5),
  'lock-open': getSubsetOfData(6),
} satisfies Record<string, SpriteMap>;

// The name of a sound that has authored sprite data.
export type SoundName = keyof typeof SPRITE_DATA;

// Every selectable sound name.
export const SOUND_NAMES = Object.keys(SPRITE_DATA) as SoundName[];
// The name used when none is specified.
export const DEFAULT_NAME: SoundName = 'uhk-soft';
