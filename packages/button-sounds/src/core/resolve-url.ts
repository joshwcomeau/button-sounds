// Resolves the URL a sound’s audio file is loaded from.
//
// By default, files are served from the free jsDelivr CDN, pinned to this package's exact published version — so you don't have to host anything, and the audio always matches the installed code. The version is injected at build time (see `define` in tsdown.config.ts); when running unbundled (e.g. tests) it falls back to `latest`.
//
// Consumers who prefer to self-host (privacy, offline, or avoiding a runtime third-party request) can pass their own baseUrl — see the copy CLI.

declare const __BUTTON_SOUNDS_VERSION__: string | undefined;

const VERSION =
  typeof __BUTTON_SOUNDS_VERSION__ !== 'undefined'
    ? __BUTTON_SOUNDS_VERSION__
    : 'latest';

// Default location sound files are loaded from: the jsDelivr CDN.
export const DEFAULT_BASE_URL = `https://cdn.jsdelivr.net/npm/button-sounds@${VERSION}/assets/`;

// Build the URL for a sound’s .mp3 file. `name` is the sound name (e.g. 'uhk-soft'). `baseUrl` is where sounds are hosted, defaulting to DEFAULT_BASE_URL (jsDelivr); pass your own to self-host — for example '/sounds/' after copying the files into your static dir.
export function resolveSoundUrl(
  name: string,
  baseUrl: string = DEFAULT_BASE_URL,
): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${name}.mp3`;
}
