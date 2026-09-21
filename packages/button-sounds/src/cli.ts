#!/usr/bin/env node
// `button-sounds copy <dir>` — copies the packaged .mp3 sound files out of node_modules into a directory you choose (e.g. your app's static folder), so you can self-host them instead of loading from the default CDN.
//
//   npx button-sounds copy ./public/sounds
//
// Then point the library at them: ButtonSounds.setPath('/sounds').

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function fail(message: string): never {
  console.error(message);
  console.error('\nUsage: button-sounds copy <directory>');
  process.exit(1);
}

const [command, target] = process.argv.slice(2);

if (command !== 'copy') {
  fail(command ? `Unknown command: ${command}` : 'No command given.');
}
if (!target) {
  fail('Missing target directory.');
}

// This file is published as dist/cli.mjs; the sound files sit in ../assets.
const assetsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const destDir = resolve(process.cwd(), target);

const mp3s = readdirSync(assetsDir).filter((file) =>
  file.toLowerCase().endsWith('.mp3'),
);

mkdirSync(destDir, { recursive: true });
for (const file of mp3s) {
  copyFileSync(join(assetsDir, file), join(destDir, file));
}

console.log(`Copied ${mp3s.length} sound file(s) → ${destDir}`);
