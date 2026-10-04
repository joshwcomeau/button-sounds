import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import PatternStripes from './PatternStripes';

const meta = {
  component: PatternStripes,
  tags: ['ai-generated'],
  args: {
    lineWidth: 2,
    lineGap: 3,
    angle: 45,
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
} satisfies Meta<typeof PatternStripes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg?.tagName.toLowerCase()).toBe('svg');
  },
};

export const SteepAngle: Story = {
  args: {
    angle: 75,
    lineWidth: 3,
    lineGap: 4,
  },
};

export const WithGradient: Story = {
  args: {
    gradient: {
      from: 'hsl(0deg 0% 100% / 0.5)',
      to: 'transparent',
      angle: 20,
    },
  },
};
