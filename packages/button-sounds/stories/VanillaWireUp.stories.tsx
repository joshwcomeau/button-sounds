import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { wireUp } from '../src/index';
import { defaultSoundArgs, soundArgTypes, type SoundStoryArgs } from './shared';

function WireUpDemo({ name, volume, lofi, pitchVariation }: SoundStoryArgs) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    return wireUp(element, name, { volume, lofi, pitchVariation });
  }, [name, volume, lofi, pitchVariation]);

  return (
    <button type="button" className="story-button" ref={ref}>
      wireUp
    </button>
  );
}

const meta = {
  title: 'Vanilla/wireUp',
  component: WireUpDemo,
  args: defaultSoundArgs,
  argTypes: soundArgTypes,
} satisfies Meta<typeof WireUpDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WireUp: Story = {};
