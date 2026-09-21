// Converts the raw .wav master recordings into .mp3 files that the package ships. The raw .wav files live in `packages/button-sounds/audio/` (kept out of the npm package — see the `files` field in the package's package.json), and the generated .mp3 files are written into `packages/button-sounds/assets/` (which IS published, and is what the jsDelivr CDN serves).
// Existing .mp3 files are deleted first, so removing or editing a .wav master never leaves a stale .mp3 behind.
//
// Requires ffmpeg on your PATH. Can be installed with Homebrew (on macOS).
// Run it via: `pnpm convert-audio`

import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const INPUT_DIR = join(repoRoot, 'packages/button-sounds/audio');
const OUTPUT_DIR = join(repoRoot, 'packages/button-sounds/assets');
const BITRATE = '192k';

mkdirSync(OUTPUT_DIR, { recursive: true });

// 1. Remove any previously-generated mp3s.
const existingMp3s = readdirSync(OUTPUT_DIR).filter((file) =>
  file.toLowerCase().endsWith('.mp3'),
);
for (const file of existingMp3s) {
  rmSync(join(OUTPUT_DIR, file));
}
if (existingMp3s.length > 0) {
  console.log(`[convert-audio] removed ${existingMp3s.length} existing mp3(s)`);
}

// 2. Convert each .wav master to an .mp3.
const wavs = readdirSync(INPUT_DIR)
  .filter((file) => file.toLowerCase().endsWith('.wav'))
  .sort();

if (wavs.length === 0) {
  console.warn(`[convert-audio] no .wav files found in ${INPUT_DIR}`);
  process.exit(0);
}

for (const wav of wavs) {
  const input = join(INPUT_DIR, wav);
  const output = join(OUTPUT_DIR, basename(wav).replace(/\.wav$/i, '.mp3'));
  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      input,
      '-c:a',
      'libmp3lame',
      '-b:a',
      BITRATE,
      output,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );
  console.log(`[convert-audio] ${wav} → ${basename(output)}`);
}

console.log(`[convert-audio] done: converted ${wavs.length} file(s)`);
