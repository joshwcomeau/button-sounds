import { setPath, trigger } from './core/player';
import type { SoundName } from './core/sprite-data';
import type { TriggerOptions, WireUpOptions } from './core/types';
import { random } from './utils';

export type {
  SoundName,
  SoundVariant,
  TriggerOptions,
  WireUpOptions,
  LofiOptions,
} from './core';
export {
  SOUND_NAMES,
  DEFAULT_NAME,
  DEFAULT_LOFI_OPTIONS,
  resolveSoundUrl,
  DEFAULT_BASE_URL,
} from './core';

// Play a “press” sound. Call from a pointerdown handler.
// Example: button.addEventListener('pointerdown', () => press('uhk-soft'));
export function press(name: SoundName, options?: TriggerOptions): void {
  trigger('press', name, options);
}

// Play a “release” sound. Call from a pointerup handler.
// Example: button.addEventListener('pointerup', () => release('uhk-soft'));
export function release(name: SoundName, options?: TriggerOptions): void {
  trigger('release', name, options);
}

// Resolve a pitchVariation setting into a concrete playbackRate.
function pitchToRate(
  pitchVariation: WireUpOptions['pitchVariation'],
): number | undefined {
  if (pitchVariation == null) return undefined;
  const [min, max] = Array.isArray(pitchVariation)
    ? pitchVariation
    : [1 - pitchVariation, 1 + pitchVariation];
  return random(min, max, { rounded: false });
}

// Wire press/release sounds onto an element. Plays a press sound on pointerdown, then plays a release sound on the next pointerup — listening on window (via { once: true }) so the release still fires even if the pointer has moved off the element.
// Returns a cleanup function that removes the listeners.
// Example:
// const unwire = wireUp(button, 'uhk-soft', { pitchVariation: 0.3 });
// later: unwire();
export function wireUp(
  element: HTMLElement,
  name: SoundName,
  options: WireUpOptions = {},
): () => void {
  const { volume, pitchVariation, lofi, lofiOptions } = options;
  const pendingReleases = new Set<() => void>();

  const handlePointerDown = (): void => {
    press(name, {
      volume,
      playbackRate: pitchToRate(pitchVariation),
      lofi,
      lofiOptions,
    });

    const handlePointerUp = (): void => {
      pendingReleases.delete(handlePointerUp);
      release(name, {
        volume,
        playbackRate: pitchToRate(pitchVariation),
        lofi,
        lofiOptions,
      });
    };
    pendingReleases.add(handlePointerUp);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  };

  element.addEventListener('pointerdown', handlePointerDown);

  return () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    for (const handler of pendingReleases) {
      window.removeEventListener('pointerup', handler);
    }
    pendingReleases.clear();
  };
}

// The vanilla API, as a single namespace object.
const ButtonSounds = { setPath, press, release, wireUp };

// press, release, and wireUp are already exported inline above; setPath is re-exported here from ./core/player.
export { setPath };
export default ButtonSounds;
