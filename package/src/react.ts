import * as React from 'react';
import type { RefObject } from 'react';
import { load, press, release, wireUp } from './index';
import type { SoundName, TriggerOptions, WireUpOptions } from './index';

export type {
  SoundName,
  SoundVariant,
  TriggerOptions,
  WireUpOptions,
} from './index';

// Callable as `press({ volume: 0.5 })`, or passed straight to a React pointer handler (`onPointerDown={press}`).
export type ButtonSoundTrigger = ((options?: TriggerOptions) => void) &
  React.PointerEventHandler;

export interface UseImperativeButtonSoundsResult {
  press: ButtonSoundTrigger;
  release: ButtonSoundTrigger;
}

// This is the main high-level API; it accepts a ref node for a button (or, I guess, any other DOM node) and automatically wires it up for presses and releases. Delegates to the `wireUp` method from the library, which preloads the sound immediately. If `name` changes, the new file is loaded and the element is rewired.
export function useButtonSounds<T extends HTMLElement>(
  ref: RefObject<T | null>,
  name: SoundName,
  options: WireUpOptions = {},
): void {
  const { volume, pitchVariation, lofi, lofiOptions } = options;
  const pitchKey = Array.isArray(pitchVariation)
    ? pitchVariation.join(',')
    : pitchVariation;
  const lofiBits = lofiOptions?.bits;
  const lofiDownsample = lofiOptions?.downsample;

  React.useEffect(() => {
    // Preload even when the ref isn’t attached yet. wireUp loads again once the element is available; a given name is only fetched once.
    load(name);

    const element = ref.current;
    if (!element) {
      return;
    }

    return wireUp(element, name, {
      volume,
      pitchVariation,
      lofi,
      lofiOptions,
    });
  }, [ref, name, volume, pitchKey, lofi, lofiBits, lofiDownsample]);
}

// Pointer handlers pass an event as the first argument. Ignore that so `onPointerDown={press}` still works, while `press({ volume: 0.5 })` overrides the hook defaults.
function resolveTriggerOptions(
  defaults: TriggerOptions,
  override?: TriggerOptions | React.SyntheticEvent | Event,
): TriggerOptions {
  if (
    override == null ||
    typeof override !== 'object' ||
    override instanceof Event ||
    'nativeEvent' in override
  ) {
    return defaults;
  }
  return { ...defaults, ...override };
}

// Alternatively, if the consumer wants more control, there’s also this lower-level API which provides press/release functions. Hook-level TriggerOptions are the defaults; each press/release call can override them.
// The named sound is preloaded when the component mounts, and a different file is loaded whenever `name` changes.
export function useImperativeButtonSounds(
  name: SoundName,
  options: TriggerOptions = {},
): UseImperativeButtonSoundsResult {
  const latestRef = React.useRef({ name, options });
  latestRef.current = { name, options };

  React.useEffect(() => {
    load(name);
  }, [name]);

  const pressSound = React.useCallback<ButtonSoundTrigger>((override) => {
    const { name: currentName, options: currentOptions } = latestRef.current;
    press(currentName, resolveTriggerOptions(currentOptions, override));
  }, []);

  const releaseSound = React.useCallback<ButtonSoundTrigger>((override) => {
    const { name: currentName, options: currentOptions } = latestRef.current;
    release(currentName, resolveTriggerOptions(currentOptions, override));
  }, []);

  return { press: pressSound, release: releaseSound };
}
