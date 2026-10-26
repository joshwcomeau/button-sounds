import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/dist/',
    '**/storybook-static/',
    '**/node_modules/',
    'package/audio/',
    'package/assets/',
  ]),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // I prefer TypeScript `Array<T>` syntax to `T[]`, and this rule ensures it stays consistent.
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true },
      ],
      // Conflicts with `no-non-null-assertion`: it would rewrite `x as T` to `x!`.
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['scripts/**', 'package/src/cli.ts', '**/*.config.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/test/**'],
    rules: {
      // Mocks and stubs are often intentionally empty.
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
