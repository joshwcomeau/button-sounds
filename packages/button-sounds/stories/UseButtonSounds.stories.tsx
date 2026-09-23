import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useButtonSounds } from '../src/react';
import { defaultSoundArgs, soundArgTypes, type SoundStoryArgs } from './shared';

function UseButtonSoundsDemo({
  name,
  volume,
  lofi,
  pitchVariation,
}: SoundStoryArgs) {
  const ref = useRef<HTMLButtonElement>(null);
  useButtonSounds(ref, name, { volume, lofi, pitchVariation });

  return (
    <button type="button" className="story-button" ref={ref}>
      useButtonSounds
    </button>
  );
}

const meta = {
  title: 'React/useButtonSounds',
  component: UseButtonSoundsDemo,
  args: defaultSoundArgs,
  argTypes: soundArgTypes,
} satisfies Meta<typeof UseButtonSoundsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UseButtonSounds: Story = {};
