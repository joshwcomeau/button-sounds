import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    // React Compiler has to run before other Babel plugins so it sees the original source.
    babel({
      presets: [reactCompilerPreset()],
    }),
    babel({
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            fileName: true,
          },
        ],
      ],
    }),
  ],
  // The syntax highlighter lazy-loads the grammars, and Vite's dependency optimizer breaks this, so we need to exclude it.
  optimizeDeps: {
    exclude: ['microlighter'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
