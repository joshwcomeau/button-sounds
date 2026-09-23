import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import PatternDots from './PatternDots';

const meta = {
  component: PatternDots,
  tags: ['ai-generated'],
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
} satisfies Meta<typeof PatternDots>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg?.tagName.toLowerCase()).toBe('svg');
  },
};

export const Dense: Story = {
  args: {
    spacing: 6,
    radius: 1.5,
  },
};

export const Sparse: Story = {
  args: {
    spacing: 16,
    radius: 2,
  },
};
