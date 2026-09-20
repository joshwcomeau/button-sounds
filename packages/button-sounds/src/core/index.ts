import type { ButtonSfxOptions, SoundVariant } from './types';

export type { ButtonSfxOptions, SoundVariant } from './types';

/**
 * Internal: play a given sound variant.
 *
 * This is intentionally a typed no-op for now so the public API can stabilize
 * ahead of the real playback engine. Actual sprite playback (loading the
 * recorded audio, honoring reduced-motion, throttling, etc.) lands in a
 * follow-up.
 */
export function playVariant(
  variant: SoundVariant,
  options: ButtonSfxOptions = {},
): void {
  const { muted = false } = options;
  if (muted) return;

  // TODO: play the `variant` sprite from the recorded audio.
  void variant;
}
