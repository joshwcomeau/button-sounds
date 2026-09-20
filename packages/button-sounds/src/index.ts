import { playVariant } from './core';
import type { ButtonSfxOptions } from './core';

export type { ButtonSfxOptions, SoundVariant } from './core';

/**
 * Play the "press" sound. Call this from a `pointerdown` / `mousedown`
 * handler.
 *
 * @example
 * button.addEventListener('pointerdown', () => handlePress());
 */
export function handlePress(options?: ButtonSfxOptions): void {
  playVariant('press', options);
}

/**
 * Play the "release" sound. Call this from a `pointerup` / `mouseup` handler.
 *
 * @example
 * button.addEventListener('pointerup', () => handleRelease());
 */
export function handleRelease(options?: ButtonSfxOptions): void {
  playVariant('release', options);
}
