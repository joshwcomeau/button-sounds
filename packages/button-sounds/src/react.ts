import { useMemo } from 'react';
import type { PointerEventHandler } from 'react';
import useSound from 'use-sound';
import {
  PLACEHOLDER_SPRITE_MAP,
  PLACEHOLDER_SPRITE_SRC,
} from './assets/placeholder-sprite';
import type { ButtonSfxOptions } from './core';

export type { ButtonSfxOptions, SoundVariant } from './core';

export interface UseButtonSfxResult {
  /** Spread onto a button (or any element) to wire up press/release SFX. */
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
}

/**
 * React hook that returns event handlers for playing press/release sounds.
 * Built on [`use-sound`](https://github.com/joshwcomeau/use-sound).
 *
 * @example
 * function MyButton() {
 *   const sfx = useButtonSfx();
 *   return <button {...sfx}>Click me</button>;
 * }
 */
export function useButtonSfx(
  options: ButtonSfxOptions = {},
): UseButtonSfxResult {
  const { volume = 1, muted = false } = options;

  // TODO: swap the placeholder sprite for the real recorded audio once the
  // sprite-distribution strategy is finalized.
  const [play] = useSound(PLACEHOLDER_SPRITE_SRC, {
    volume,
    soundEnabled: !muted,
    sprite: PLACEHOLDER_SPRITE_MAP,
    format: ['wav'],
  });

  return useMemo<UseButtonSfxResult>(
    () => ({
      onPointerDown: () => play({ id: 'press' }),
      onPointerUp: () => play({ id: 'release' }),
    }),
    [play],
  );
}
