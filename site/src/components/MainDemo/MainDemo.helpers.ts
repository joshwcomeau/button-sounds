import { SPRITE_DATA, type SoundName } from 'button-sounds';

export type SortOrder = 'default' | 'alphabetical' | 'shuffle';

// Capture all relevant sample IDs for a given sound name.
// Eg. ['down1', 'down2', 'down3', 'down4']
export function getSampleIds(
  name: SoundName,
  prefix: 'down' | 'up',
): Array<string> {
  return Object.keys(SPRITE_DATA[name])
    .filter((id) => id.startsWith(prefix))
    .sort(
      (a, b) =>
        Number(/\d+$/.exec(a)?.[0] ?? 0) - Number(/\d+$/.exec(b)?.[0] ?? 0),
    );
}
