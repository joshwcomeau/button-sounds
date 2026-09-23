import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { load, press, release } from '../src/index';
import { defaultSoundArgs, soundArgTypes, type SoundStoryArgs } from './shared';

function PressReleaseDemo({ name, volume, lofi }: SoundStoryArgs) {
  useEffect(() => {
    load(name);
  }, [name]);

  return (
    <button
      type="button"
      className="story-button"
      onPointerDown={() => press(name, { volume, lofi })}
      onPointerUp={() => release(name, { volume, lofi })}
    >
      Press / release
    </button>
  );
}

const meta = {
  title: 'Vanilla/press & release',
  component: PressReleaseDemo,
  args: defaultSoundArgs,
  argTypes: {
    name: soundArgTypes.name,
    volume: soundArgTypes.volume,
    lofi: soundArgTypes.lofi,
    pitchVariation: { table: { disable: true } },
  },
} satisfies Meta<typeof PressReleaseDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PressRelease: Story = {};
