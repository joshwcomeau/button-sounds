import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/react.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  // Keeps the package.json "exports" map in sync with the build outputs,
  // including the `button-sounds/react` subpath.
  exports: true,
  clean: true,
  sourcemap: true,
});
