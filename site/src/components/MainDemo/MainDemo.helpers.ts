import { SPRITE_DATA, type SoundName } from 'button-sounds';

export type SortOrder = 'default' | 'alphabetical' | 'shuffle';

// Capture all relevant sample IDs for a given sound name.
// Eg. ['down1', 'down2', 'down3', 'down4']
export function getSampleIds(name: SoundName, prefix: 'down' | 'up'): string[] {
  const spriteMap = SPRITE_DATA[name];
  if (!spriteMap) {
    return [];
  }

  return Object.keys(spriteMap)
    .filter((id) => id.startsWith(prefix))
    .sort(
      (a, b) =>
        Number(a.match(/\d+$/)?.[0] ?? 0) - Number(b.match(/\d+$/)?.[0] ?? 0),
    );
}
