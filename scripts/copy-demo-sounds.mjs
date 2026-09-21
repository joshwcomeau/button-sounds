// Copies the package's .mp3 sounds into the demo site's static folder so the site can play them locally via baseUrl: '/sounds/'. This mirrors what `npx button-sounds copy ./public/sounds` does for real consumers — the demo self-hosts rather than depending on the (unpublished) CDN version.

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(repoRoot, 'packages/button-sounds/assets');
const destDir = join(repoRoot, 'apps/site/public/sounds');

const mp3s = readdirSync(assetsDir).filter((file) =>
  file.toLowerCase().endsWith('.mp3'),
);

mkdirSync(destDir, { recursive: true });
for (const file of mp3s) {
  copyFileSync(join(assetsDir, file), join(destDir, file));
}

console.log(`[copy-demo-sounds] copied ${mp3s.length} sound(s) → ${destDir}`);
