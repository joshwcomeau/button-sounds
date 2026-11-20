// A slider inspired by Winamp’s volume/balance sliders.
// The native thumb is invisible but kept at the same size as our custom handle, so that the handle’s position lines up exactly with where the browser thinks the thumb is.
import * as React from 'react';
import styled from 'styled-components';
import useSound from 'use-sound';

import { clampedNormalize, normalize, sampleOne } from '@/utils';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

const HANDLE_WIDTH = 22;
const HANDLE_HEIGHT = 12;
const HANDLE_RADIUS = 4;
const TRACK_HEIGHT = 8;
const TICK_SPRITE: Record<string, [number, number]> = {
  a: [88, 40],
  b: [140, 40],
  c: [182, 40],
  d: [224, 40],
  e: [294, 40],
  f: [352, 40],
};
const TICK_IDS = Object.keys(TICK_SPRITE);

// Must be controlled, since the handle’s position is derived from `value`.
type Props = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'value' | 'defaultValue' | 'min' | 'max'
> & {
  value: number;
  min?: number;
  max?: number;
};

function MediaPlayerSmallSlider({
  value,
  min = 0,
  max = 100,
  // If we wrap this element (eg. `styled(MediaPlayerSmallSlider)`), we'll want the generated className to apply to the parent Wrapper, not the input that should receive all other standard props.
  className,
  onChange,
  ...delegated
}: Props) {
  const [playTick] = useSound('/sounds/tick-sprite.mp3', {
    sprite: TICK_SPRITE,
    volume: 0.25,
    interrupt: true,
  });

  const progress = min === max ? 0 : clampedNormalize(value, min, max);

  // Shifts from green at 0 to red at ±1, so that a -1 to 1 slider is red at both ends and green in the middle.
  const intensity = clampedNormalize(Math.abs(value), 0, 1);
  const hue = normalize(intensity, 0, 1, 120, 0);
  const lightness = normalize(intensity, 0, 1, 30, 48);

  return (
    <Wrapper
      className={className}
      style={{
        '--progress': progress,
        '--track-color': `hsl(${hue}deg 100% ${lightness}%)`,
      }}
    >
      <Track />
      <Input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          playTick({ id: sampleOne(TICK_IDS) });
          onChange?.(event);
        }}
        {...delegated}
      />
      <Handle>
        <BevelEdge
          side="top"
          color="var(--bevel-edge-top)"
          radius={HANDLE_RADIUS}
        />
        <BevelEdge
          side="bottom"
          color="var(--bevel-edge-bottom)"
          radius={HANDLE_RADIUS}
        />
        <Stripe />
        <Stripe />
        <Stripe />
      </Handle>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  isolation: isolate;
`;

const Track = styled.div`
  position: absolute;
  inset-inline: 0;
  top: 50%;
  transform: translateY(-50%);
  height: ${TRACK_HEIGHT}px;
  background: var(--track-color);
  border: 1px solid hsl(240deg 25% 8%);
  border-radius: 100px;
  corner-shape: bevel;
  box-shadow:
    inset 0px 1px 0px hsl(0deg 0% 100% / 0.35),
    inset 0px -1px 0px hsl(0deg 0% 0% / 0.3);
  pointer-events: none;
`;

const Input = styled.input`
  position: relative;
  display: block;
  width: 100%;
  height: ${HANDLE_HEIGHT}px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  border-radius: 4px;
  corner-shape: bevel;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: ${HANDLE_WIDTH}px;
    height: ${HANDLE_HEIGHT}px;
    opacity: 0;
    cursor: grabbing;
  }

  &::-moz-range-thumb {
    width: ${HANDLE_WIDTH}px;
    height: ${HANDLE_HEIGHT}px;
    border: none;
    opacity: 0;
    cursor: grabbing;
  }

  &:active::-webkit-slider-thumb {
    cursor: grabbing;
  }
  &:active::-moz-range-thumb {
    cursor: grabbing;
  }
`;

const Handle = styled.div`
  --handle-bg: hsl(240deg 8% 78%);
  --stripe-color: hsl(240deg 15% 5%);
  --bevel-edge-top: hsl(240deg 100% 96%);
  --bevel-edge-bottom: hsl(240deg 15% 40%);
  position: absolute;
  top: 0;
  left: calc(var(--progress) * (100% - ${HANDLE_WIDTH}px));
  width: ${HANDLE_WIDTH}px;
  height: ${HANDLE_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  background: var(--handle-bg);
  border: 1px solid hsl(240deg 15% 70%);
  border-radius: 4px;
  corner-shape: bevel;
  box-shadow: 0px 0px 0px 1px hsl(240deg 25% 8%);
  pointer-events: none;

  ${Wrapper}:has(input:active) & {
    --handle-bg: hsl(240deg 18% 28%);
    --stripe-color: hsl(240deg 15% 12%);
    --bevel-edge-top: hsl(240deg 40% 60%);
    border-color: hsl(240deg 8% 65%) hsl(240deg 15% 18%) hsl(240deg 15% 18%)
      hsl(240deg 8% 65%);
  }
`;

const Stripe = styled.div`
  width: 2px;
  height: 6px;
  background: var(--stripe-color);
  box-shadow: 1px 0px 0px hsl(0deg 0% 100% / 0.6);
`;

export default MediaPlayerSmallSlider;
