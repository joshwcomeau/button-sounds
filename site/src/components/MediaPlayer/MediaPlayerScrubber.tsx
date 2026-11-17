// A slider inspired by Winamp’s main position/seek bar.
// The native thumb is invisible but kept at the same size as our custom handle, so that the handle’s position lines up exactly with where the browser thinks the thumb is.
import * as React from 'react';
import styled from 'styled-components';

import { clampedNormalize } from '@/utils';

const HANDLE_WIDTH = 29;
const HANDLE_HEIGHT = 10;
const TRACK_HEIGHT = 10;

// Must be controlled, since the handle’s position is derived from `value`.
type Props = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'value' | 'defaultValue' | 'min' | 'max'
> & {
  value: number;
  min?: number;
  max?: number;
};

function MediaPlayerScrubber({
  value,
  min = 0,
  max = 100,
  // If we wrap this element (eg. `styled(MediaPlayerScrubber)`), we'll want the generated className to apply to the parent Wrapper, not the input that should receive all other standard props.
  className,
  ...delegated
}: Props) {
  const progress = min === max ? 0 : clampedNormalize(value, min, max);

  return (
    <Wrapper
      className={className}
      style={{
        '--progress': progress,
      }}
    >
      <Track />
      <Input type="range" value={value} min={min} max={max} {...delegated} />
      <Handle>
        <Grip />
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
  background: hsl(240deg 25% 14%);
  border: 1px solid;
  border-color: hsl(240deg 25% 6%) hsl(240deg 10% 42%) hsl(240deg 10% 42%)
    hsl(240deg 25% 6%);
  border-radius: 1px;
  box-shadow: inset 0px 1px 2px hsl(0deg 0% 0% / 0.5);
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
  --handle-bg: hsl(45deg 55% 72%);
  --grip-border: hsl(40deg 45% 38%);
  --grip-highlight: hsl(50deg 80% 90%);
  position: absolute;
  top: 0;
  left: calc(var(--progress) * (100% - ${HANDLE_WIDTH}px));
  width: ${HANDLE_WIDTH}px;
  height: ${HANDLE_HEIGHT}px;
  display: grid;
  place-items: center;
  background: var(--handle-bg);
  border: 1px solid hsl(35deg 50% 18%);
  border-radius: 2px;
  box-shadow: inset 0px 1px 0px hsl(50deg 80% 90% / 0.6);
  pointer-events: none;
`;

const Grip = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border: 1px solid var(--grip-border);
  border-radius: 1px;
  box-shadow:
    1px 1px 0px var(--grip-highlight),
    inset 1px 1px 0px var(--grip-highlight);
`;

const Wrapper = styled.div`
  position: relative;
  isolation: isolate;

  &:has(input:active) ${Handle} {
    --handle-bg: hsl(45deg 70% 82%);
    --grip-border: hsl(40deg 50% 45%);
    --grip-highlight: hsl(50deg 90% 96%);
  }

  &:has(input:focus-visible) ${Handle} {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export default MediaPlayerScrubber;
