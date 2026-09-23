import { SPRITE_DATA, type SoundName } from 'button-sounds';

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

export function pickSampleIndex(ids: string[]): number | undefined {
  if (ids.length === 0) {
    return undefined;
  }
  return Math.floor(Math.random() * ids.length);
}
