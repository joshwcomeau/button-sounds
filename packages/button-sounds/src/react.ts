import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { press, release, wireUp } from './index';
import type { SoundName, TriggerOptions, WireUpOptions } from './index';

export type { SoundName, SoundVariant, TriggerOptions, WireUpOptions } from './index';

export interface UseButtonSoundsOptions extends WireUpOptions {
  // When true, listeners are not attached and no sound plays. Wire this to a user “mute” / sound preference. Defaults to false.
  muted?: boolean;
}

export interface UseImperativeButtonSoundsOptions extends TriggerOptions {
  // When true, press() / release() become no-ops. Defaults to false.
  muted?: boolean;
}

export interface UseImperativeButtonSoundsResult {
  press: () => void;
  release: () => void;
}

// Attach press/release sounds to a DOM element via a React ref. Wraps `wireUp`, so a press plays on pointerdown and a release plays on the next pointerup (listened for on window, so it still fires if the pointer has moved off the element). Cleans up on unmount or when the sound / options change.
// Example:
// function HighLevelExample() {
//   const buttonRef = React.useRef<HTMLButtonElement>(null);
//   useButtonSounds(buttonRef, 'uhk-soft', { pitchVariation: 0.25 });
//   return <button ref={buttonRef} />;
// }
export function useButtonSounds<T extends HTMLElement>(
  ref: RefObject<T | null>,
  name: SoundName,
  options: UseButtonSoundsOptions = {},
): void {
  const { muted = false, volume, pitchVariation, lofi, lofiOptions } = options;
  const pitchKey = Array.isArray(pitchVariation)
    ? pitchVariation.join(',')
    : pitchVariation;
  const lofiBits = lofiOptions?.bits;
  const lofiDownsample = lofiOptions?.downsample;

  useEffect(() => {
    const element = ref.current;
    if (!element || muted) return;
    return wireUp(element, name, { volume, pitchVariation, lofi, lofiOptions });
  }, [ref, name, muted, volume, pitchKey, lofi, lofiBits, lofiDownsample]);
}

// Lower-level hook that returns `press` / `release` callbacks, wrapping the vanilla functions of the same name. Bind them to pointer handlers (or anything else) yourself.
// Example:
// function LowLevelExample() {
//   const { press, release } = useImperativeButtonSounds('uhk-soft', { sampleIndex: 2 });
//   return <button onPointerDown={press} onPointerUp={release} />;
// }
export function useImperativeButtonSounds(
  name: SoundName,
  options: UseImperativeButtonSoundsOptions = {},
): UseImperativeButtonSoundsResult {
  const latestRef = useRef({ name, options });
  latestRef.current = { name, options };

  const pressSound = useCallback(() => {
    const { name: currentName, options: currentOptions } = latestRef.current;
    const { muted, ...triggerOptions } = currentOptions;
    if (muted) return;
    press(currentName, triggerOptions);
  }, []);

  const releaseSound = useCallback(() => {
    const { name: currentName, options: currentOptions } = latestRef.current;
    const { muted, ...triggerOptions } = currentOptions;
    if (muted) return;
    release(currentName, triggerOptions);
  }, []);

  return { press: pressSound, release: releaseSound };
}
