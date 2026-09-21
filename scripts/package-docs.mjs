// Syncs the repo-root README.md and LICENSE into a package directory so the exact same docs are published to npm as are shown on GitHub. There is only one canonical copy of each file (at the repo root) to maintain; the package copies are generated at publish time (prepack) and removed afterwards (postpack), and are git-ignored.
//
// Usage (run from the package directory, e.g. via a prepack script):
//   node ../../scripts/package-docs.mjs copy
//   node ../../scripts/package-docs.mjs clean

import { copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILES = ['README.md', 'LICENSE'];

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageDir = process.cwd();
const mode = process.argv[2];

if (mode === 'copy') {
  for (const file of FILES) {
    copyFileSync(join(repoRoot, file), join(packageDir, file));
    console.log(`[package-docs] copied ${file} → ${packageDir}`);
  }
} else if (mode === 'clean') {
  for (const file of FILES) {
    rmSync(join(packageDir, file), { force: true });
    console.log(`[package-docs] removed ${file} from ${packageDir}`);
  }
} else {
  console.error('[package-docs] expected mode "copy" or "clean"');
  process.exit(1);
}
