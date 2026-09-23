import type { Meta, StoryObj } from '@storybook/react-vite';
import { useImperativeButtonSounds } from '../src/react';
import { defaultSoundArgs, soundArgTypes, type SoundStoryArgs } from './shared';

function UseImperativeButtonSoundsDemo({ name, volume, lofi }: SoundStoryArgs) {
  const { press, release } = useImperativeButtonSounds(name, {
    volume,
    lofi,
  });

  return (
    <button
      type="button"
      className="story-button"
      onPointerDown={press}
      onPointerUp={release}
    >
      useImperativeButtonSounds
    </button>
  );
}

const meta = {
  title: 'React/useImperativeButtonSounds',
  component: UseImperativeButtonSoundsDemo,
  args: defaultSoundArgs,
  argTypes: {
    name: soundArgTypes.name,
    volume: soundArgTypes.volume,
    lofi: soundArgTypes.lofi,
    pitchVariation: { table: { disable: true } },
  },
} satisfies Meta<typeof UseImperativeButtonSoundsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UseImperativeButtonSounds: Story = {};
