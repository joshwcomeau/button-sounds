import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  // Serve the package’s mp3s at /sounds so stories can self-host instead of hitting the unpublished CDN.
  staticDirs: [{ from: '../assets', to: '/sounds' }],
};

export default config;
