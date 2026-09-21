import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsdown';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts', 'src/cli.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  // Bake the published version into the default CDN URL (see resolve-url.ts).
  define: {
    __BUTTON_SOUNDS_VERSION__: JSON.stringify(pkg.version),
  },
});
