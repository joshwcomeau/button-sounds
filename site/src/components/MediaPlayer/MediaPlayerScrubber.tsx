// A slider inspired by Winamp’s main position/seek bar.
// The input is uncontrolled so that dragging only moves the thumb; the new position is reported through `onCommit` once the user lets go (the native `change` event, which React’s `onChange` doesn’t expose).
import * as React from 'react';
import styled, { css } from 'styled-components';

const HANDLE_WIDTH = 29;
const HANDLE_HEIGHT = 10;
const TRACK_HEIGHT = 10;

type Props = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'onChange'
> & {
  value: number;
  min?: number;
  max?: number;
  onCommit: (value: number) => void;
};

function MediaPlayerScrubber({
  value,
  min = 0,
  max = 100,
  onCommit,
  onPointerDown,
  ...delegated
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isHeldRef = React.useRef(false);

  // While the thumb is held, `value` keeps ticking along with playback, and applying it would yank the thumb out from under the cursor.
  React.useEffect(() => {
    const input = inputRef.current;
    if (input && !isHeldRef.current) {
      input.value = String(value);
    }
  }, [value, min, max]);

  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const handleChange = () => {
      onCommit(Number(input.value));
    };

    // The pointer can be released outside the slider, so we listen on the window.
    function handleRelease() {
      isHeldRef.current = false;
    }

    input.addEventListener('change', handleChange);
    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);

    return () => {
      input.removeEventListener('change', handleChange);
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
    };
  }, [onCommit]);

  return (
    <Input
      ref={inputRef}
      type="range"
      defaultValue={value}
      min={min}
      max={max}
      onPointerDown={(ev) => {
        isHeldRef.current = true;
        onPointerDown?.(ev);
      }}
      {...delegated}
    />
  );
}

// Layered inset shadows draw the beveled edges, from the outermost 1px ring inward. Earlier shadows paint on top, which decides who wins at the corners. The engraved grip in the middle is drawn with background gradients.
const thumbStyles = css`
  width: ${HANDLE_WIDTH}px;
  height: ${HANDLE_HEIGHT}px;
  border: none;
  border-radius: 0;
  background:
    linear-gradient(
        hsl(0deg 0% 96%) 0 1px,
        hsl(42deg 44% 31%) 1px 2px,
        hsl(44deg 29% 54%) 2px
      )
      4px 3px / ${HANDLE_WIDTH - 8}px 3px no-repeat,
    linear-gradient(hsl(48deg 60% 87%), hsl(48deg 60% 87%)) 3px 2px /
      ${HANDLE_WIDTH - 6}px 5px no-repeat,
    hsl(44deg 29% 54%);
  box-shadow:
    inset 1px 0px 0px hsl(240deg 6% 42%),
    inset -1px 0px 0px hsl(0deg 60% 2%),
    inset 0px -1px 0px hsl(0deg 60% 2%),
    inset 2px 0px 0px hsl(46deg 40% 74%),
    inset 0px 1px 0px hsl(46deg 40% 74%),
    inset -2px 0px 0px hsl(44deg 34% 40%),
    inset 0px -2px 0px hsl(44deg 34% 40%),
    inset 3px 0px 0px hsl(42deg 38% 36%),
    inset 0px 2px 0px hsl(42deg 38% 36%);
`;

const trackStyles = css`
  height: ${TRACK_HEIGHT}px;
  background: hsl(240deg 21% 24%);
  box-shadow:
    inset 0px 2px 0px hsl(240deg 22% 15%),
    inset 1px 0px 0px hsl(240deg 22% 15%),
    inset 0px -1px 0px hsl(240deg 8% 50%),
    inset -1px 0px 0px hsl(240deg 8% 50%);
`;

const Input = styled.input`
  display: block;
  width: 100%;
  height: ${TRACK_HEIGHT}px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: grab;
  outline: none;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-slider-runnable-track {
    ${trackStyles}
  }

  &::-moz-range-track {
    ${trackStyles}
  }

  &::-webkit-slider-thumb {
    appearance: none;
    ${thumbStyles}
  }

  &::-moz-range-thumb {
    ${thumbStyles}
  }

  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &:focus-visible::-moz-range-thumb {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export default MediaPlayerScrubber;
