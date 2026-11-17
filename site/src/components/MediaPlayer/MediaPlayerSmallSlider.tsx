// A slider inspired by Winamp’s volume/balance sliders.
// The native thumb is invisible but kept at the same size as our custom handle, so that the handle’s position lines up exactly with where the browser thinks the thumb is.
import * as React from 'react';
import styled from 'styled-components';

import { clampedNormalize, normalize } from '@/utils';

const HANDLE_WIDTH = 22;
const HANDLE_HEIGHT = 12;
const TRACK_HEIGHT = 8;

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
  ...delegated
}: Props) {
  const progress = min === max ? 0 : clampedNormalize(value, min, max);

  // Shifts from green at the minimum to red at the maximum.
  const hue = normalize(progress, 0, 1, 120, 0);
  const lightness = normalize(progress, 0, 1, 30, 48);

  return (
    <Wrapper
      style={{
        '--progress': progress,
        '--track-color': `hsl(${hue}deg 100% ${lightness}%)`,
      }}
    >
      <Track />
      <Input type="range" value={value} min={min} max={max} {...delegated} />
      <Handle>
        <Stripe />
        <Stripe />
        <Stripe />
      </Handle>
    </Wrapper>
  );
}

const Track = styled.div`
  position: absolute;
  inset-inline: 0;
  top: 50%;
  transform: translateY(-50%);
  height: ${TRACK_HEIGHT}px;
  background: var(--track-color);
  border: 1px solid hsl(240deg 25% 8%);
  border-radius: 2px;
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
  cursor: grab;
  outline: none;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: ${HANDLE_WIDTH}px;
    height: ${HANDLE_HEIGHT}px;
    opacity: 0;
  }

  &::-moz-range-thumb {
    width: ${HANDLE_WIDTH}px;
    height: ${HANDLE_HEIGHT}px;
    border: none;
    opacity: 0;
  }
`;

const Handle = styled.div`
  --handle-bg: hsl(240deg 8% 78%);
  --stripe-color: hsl(240deg 15% 25%);
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
  border: 1px solid;
  border-color: hsl(0deg 0% 100%) hsl(240deg 15% 30%) hsl(240deg 15% 30%)
    hsl(0deg 0% 100%);
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px hsl(240deg 25% 8%);
  pointer-events: none;
`;

const Stripe = styled.div`
  width: 2px;
  height: 6px;
  background: var(--stripe-color);
  box-shadow: 1px 0px 0px hsl(0deg 0% 100% / 0.6);
`;

const Wrapper = styled.div`
  position: relative;
  isolation: isolate;

  &:has(input:active) ${Handle} {
    --handle-bg: hsl(240deg 8% 48%);
    --stripe-color: hsl(240deg 15% 12%);
    border-color: hsl(240deg 8% 65%) hsl(240deg 15% 18%) hsl(240deg 15% 18%)
      hsl(240deg 8% 65%);
  }

  &:has(input:focus-visible) ${Handle} {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export default MediaPlayerSmallSlider;
