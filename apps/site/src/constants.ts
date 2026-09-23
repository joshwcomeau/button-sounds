// The published package loads sounds from the jsDelivr CDN by default. This demo isn’t published, so it self-hosts: `pnpm dev` copies the sounds into public/sounds, and we point the library there.
export const SOUNDS_PATH = '/sounds';
