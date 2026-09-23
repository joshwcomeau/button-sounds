import type { Preview } from '@storybook/react-vite';
import { setPath } from '../src/index';
import './preview.css';

setPath('/sounds');

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
