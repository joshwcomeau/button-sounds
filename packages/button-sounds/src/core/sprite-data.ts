type SpriteMap = Record<string, [number, number]>;

// Sprite offsets for each sound, keyed by name. Every sound’s .mp3 contains multiple samples: down1, down2, … for presses and up1, up2, … for releases. Offsets are [startMs, durationMs].
//
// Add a name here (with a matching <name>.mp3 in audio/ → assets/) to make it selectable; the SoundName type and SOUND_NAMES update automatically.
export const SPRITE_DATA = {
  'uhk-soft': {
    down1: [1000, 200],
    up1: [1300, 200],
    down2: [2000, 200],
    up2: [2300, 200],
    down3: [3000, 200],
    up3: [3300, 200],
    down4: [4000, 200],
    up4: [4300, 200],
    down5: [5000, 200],
    up5: [5300, 200],
    down6: [6000, 200],
    up6: [6300, 200],
  },
} satisfies Record<string, SpriteMap>;

// The name of a sound that has authored sprite data.
export type SoundName = keyof typeof SPRITE_DATA;

// Every selectable sound name.
export const SOUND_NAMES = Object.keys(SPRITE_DATA) as SoundName[];

// The name used when none is specified.
export const DEFAULT_NAME: SoundName = 'uhk-soft';
