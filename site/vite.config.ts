import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const buttonSoundsPackage = JSON.parse(
  readFileSync(new URL('../package/package.json', import.meta.url), 'utf8'),
) as { version: string };

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
  define: {
    // In tsdown.config.ts, we inject the button version into the URL, so that different versions can reference different MP3 filenames. I was running into an issue on localhost with outdated filenames, and this appears to be the fix:
    __BUTTON_SOUNDS_VERSION__: JSON.stringify(buttonSoundsPackage.version),
  },
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
  build: {
    // I was running into an issue where the syntax highlighting wasn’t working in production. This is because microlighter, the syntax-highlighter I’m using, uses dynamic `import()` statements and Vite doesn’t know that it should include them.
    // Honestly I don’t fully understand why such a complex regex is reuqired for this, and there’s undoubtedly a simpler fix, but this is what Claude suggested and it works. 🤷
    dynamicImportVarsOptions: {
      exclude: [
        /node_modules\/(?!\.pnpm\/microlighter@[^/]+\/node_modules\/microlighter\/|microlighter\/)/,
      ],
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      // So, I'm using pnpm workspaces in this project which *should* rely on the locally-defined package (workspace:* in site/package.json). When I make changes to the package files, however, they aren't immediately reflected on localhost. We solve this by bundling those files directly:
      {
        find: /^button-sounds\/react$/,
        replacement: fileURLToPath(
          new URL('../package/src/react.ts', import.meta.url),
        ),
      },
      {
        find: /^button-sounds$/,
        replacement: fileURLToPath(
          new URL('../package/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
});
