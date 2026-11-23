// Copies the package's .mp3 sounds into the demo site's static folder so the site can play them locally via baseUrl: '/button-sounds/'. This mirrors what `npx button-sounds copy ./public/sounds` does for real consumers — the demo self-hosts rather than depending on the CDN version.

import { copyFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(repoRoot, 'package/assets');
const destDir = join(repoRoot, 'site/public/button-sounds');

const mp3s = readdirSync(assetsDir).filter((file) =>
  file.toLowerCase().endsWith('.mp3'),
);

mkdirSync(destDir, { recursive: true });

// Remove any outdated files. This can happen if I rename things (like when I renamed the PS4 sounds to PS5 sounds since it was actually a PS5 controller).
const keep = new Set(mp3s);
for (const existing of readdirSync(destDir)) {
  if (existing.toLowerCase().endsWith('.mp3') && !keep.has(existing)) {
    unlinkSync(join(destDir, existing));
  }
}

for (const file of mp3s) {
  copyFileSync(join(assetsDir, file), join(destDir, file));
}

console.log(`[copy-demo-sounds] copied ${mp3s.length} sound(s) → ${destDir}`);
