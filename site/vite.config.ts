import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Serve a different favicon on localhost so that I can easily tell whether a tab is development vs. production:
function devFavicon(): Plugin {
  return {
    name: 'dev-favicon',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace('href="/favicon.png"', 'href="/favicon-dev-new.png"');
    },
  };
}

export default defineConfig({
  plugins: [
    devFavicon(),
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
