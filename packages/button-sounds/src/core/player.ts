import type { Howl } from 'howler';
import { applyLofi, prepareLofi, resolveLofiOptions } from './lofi';
import { resolveSoundUrl } from './resolve-url';
import { SPRITE_DATA } from './sprite-data';
import type { SoundName } from './sprite-data';
import type { SoundVariant, TriggerOptions } from './types';
import { pickSampleId } from './variants';

// Playback engine, built on howler (loaded lazily on first use — load(), wireUp(), or playback — so this module is safe to import during SSR). Shared by the vanilla API and the React hooks.

let currentPath: string | undefined;

// Override where sound files load from (defaults to the jsDelivr CDN).
export function setPath(path: string): void {
  currentPath = path;
}

// The current base path, or undefined when using the default CDN.
export function getPath(): string | undefined {
  return currentPath;
}

// Start downloading a sound’s audio file so the first press or release isn’t waiting on the network. Safe to call more than once; each name is only fetched once for the current setPath.
// Example: load('uhk-soft');
export function load(name: SoundName): void {
  if (!SPRITE_DATA[name]) {
    console.warn(`[button-sounds] Unknown sound name: "${name}"`);
    return;
  }

  // Sound is progressive enhancement — a failed fetch (offline, CDN hiccup) should not surface as an unhandled rejection.
  void loadHowl(name).catch(() => {});
}

const howlCache = new Map<string, Promise<Howl>>();

function loadHowl(name: SoundName): Promise<Howl> {
  const key = `${name}::${currentPath ?? ''}`;
  let howl = howlCache.get(key);

  if (!howl) {
    howl = import('howler').then(
      ({ Howl }) =>
        new Howl({
          src: [resolveSoundUrl(name, currentPath)],
          sprite: SPRITE_DATA[name],
          format: ['mp3'],
          html5: false,
        }),
    );
    howlCache.set(key, howl);
  }
  return howl;
}

// Play a sample of the given variant from a named sound.
export function trigger(
  variant: SoundVariant,
  name: SoundName,
  options: TriggerOptions = {},
): void {
  const spriteMap = SPRITE_DATA[name];
  if (!spriteMap) {
    console.warn(`[button-sounds] Unknown sound name: "${name}"`);
    return;
  }

  const { sampleIndex, volume, playbackRate, lofi, lofiOptions } = options;
  const id = pickSampleId(spriteMap, variant, sampleIndex);
  if (!id) return;

  const resolvedLofi = lofi ? resolveLofiOptions(lofiOptions) : null;

  void loadHowl(name)
    .then(async (howl) => {
      // The bitcrusher is an AudioWorklet, so it has to be registered on Howler.ctx before we start playback — otherwise the first few milliseconds of a click would play clean.
      let ctx: AudioContext | undefined;
      if (resolvedLofi) {
        const { Howler } = await import('howler');
        ctx = Howler.ctx;
        await prepareLofi(ctx);
      }

      const soundId = howl.play(id);
      if (typeof volume === 'number') {
        howl.volume(volume, soundId);
      }
      if (typeof playbackRate === 'number') {
        howl.rate(playbackRate, soundId);
      }
      if (resolvedLofi && ctx) {
        applyLofi(ctx, howl, soundId, resolvedLofi);
      }
    })
    // Sound is progressive enhancement — never let a load/playback failure (offline, CDN hiccup, autoplay policy) surface as an unhandled rejection.
    .catch(() => {});
}
