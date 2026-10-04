import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import PatternDither from './PatternDither';

const meta = {
  component: PatternDither,
  tags: ['ai-generated'],
  args: {
    patternId: 'b',
    pixelScale: 2,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: 200,
          height: 120,
          color: 'var(--color-gray-500)',
          background: 'var(--color-gray-100)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PatternDither>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg?.tagName.toLowerCase()).toBe('svg');
  },
};

export const PatternA: Story = {
  args: {
    patternId: 'a',
    pixelScale: 3,
  },
};

export const WithGradient: Story = {
  args: {
    patternId: 'b',
    pixelScale: 2,
    gradient: {
      from: 'white',
      to: 'transparent',
      angle: 90,
    },
  },
};
