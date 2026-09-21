import type { SoundVariant } from './types';
import { sampleOne } from '../utils';

type SpriteMap = Record<string, [number, number]>;

const trailingNumber = (id: string): number =>
  Number(id.match(/\d+$/)?.[0] ?? 0);

// The sprite sample ids for a given variant, ordered by their trailing number (down1, down2, … for a press; up1, up2, … for a release).
export function getVariantIds(
  spriteMap: SpriteMap,
  variant: SoundVariant,
): string[] {
  const prefix = variant === 'press' ? 'down' : 'up';
  return Object.keys(spriteMap)
    .filter((id) => id.startsWith(prefix))
    .sort((a, b) => trailingNumber(a) - trailingNumber(b));
}

// Choose which sample to play. Random by default; pass sampleIndex to pick a specific one (0-based, wraps around). Returns undefined if the sound has no samples for the variant.
export function pickSampleId(
  spriteMap: SpriteMap,
  variant: SoundVariant,
  sampleIndex?: number,
): string | undefined {
  const ids = getVariantIds(spriteMap, variant);
  if (ids.length === 0) return undefined;

  if (typeof sampleIndex === 'number') {
    // Wrap so any integer maps to a valid sample.
    const wrapped = ((sampleIndex % ids.length) + ids.length) % ids.length;
    return ids[wrapped];
  }

  return sampleOne(ids);
}
