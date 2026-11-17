// A slider inspired by Winamp’s main position/seek bar.
// The input is uncontrolled so that dragging only moves the thumb; the new position is reported through `onCommit` once the user lets go (the native `change` event, which React’s `onChange` doesn’t expose).
import * as React from 'react';
import styled, { css } from 'styled-components';

const HANDLE_WIDTH = 36;
const HANDLE_HEIGHT = 15;
const TRACK_HEIGHT = 15;

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
  // So, annoyingly, React doesn't expose the native `onchange` range behaviour, which is to wait until the user drops the handle before firing. In this case, that's what we want; it's jarring if the song is constantly jumping to a new spot while the user drags the handle, we want to wait until it's released to jump to the new timestamp.
  // So, our solution is a bit complex. We use an uncontrolled input and manage things via effects.
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isHeldRef = React.useRef(false);

  // Since this is an uncontrolled input, it doesn't automatically update when `value` changes. We manage it here, as long as the input isn't currently being dragged. This is to prevent the thumb from continuing to tick along even if the user is interacting with it.
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

// The thumb artwork was designed at 10px tall. Every measurement below is expressed in pixels of that original design, and scaled to match the actual `HANDLE_HEIGHT`.
const THUMB_DESIGN_HEIGHT = 10;
const THUMB_SCALE = HANDLE_HEIGHT / THUMB_DESIGN_HEIGHT;
const u = (designPx: number) => `${designPx * THUMB_SCALE}px`;

// Winamp's thumb is actually kinda complex-looking, and since this is a native `<input>` element, we can't solve it with child or pseudo-elements. Instead, we'll reconstruct it through gradients and inset shadows.
const thumbStyles = css`
  width: ${HANDLE_WIDTH}px;
  height: ${HANDLE_HEIGHT}px;
  border: none;
  border-radius: 0;
  transition: opacity 300ms;
  /* prettier-ignore */
  background:
    linear-gradient(
      hsl(0deg 0% 96%) 0 ${u(1)},
      hsl(42deg 44% 31%) ${u(1)} ${u(2)},
      hsl(44deg 29% 54%) ${u(2)}
    ) ${u(4)} ${u(3)} /
      calc(${HANDLE_WIDTH}px - ${u(8)}) ${u(3)} no-repeat,
    linear-gradient(
      hsl(48deg 60% 87%),
      hsl(48deg 60% 87%)
    ) ${u(3)} ${u(2)} /
      calc(${HANDLE_WIDTH}px - ${u(6)}) ${u(5)} no-repeat,
    hsl(44deg 29% 54%);
  box-shadow:
    inset ${u(1)} 0px 0px hsl(240deg 6% 42%),
    inset ${u(-1)} 0px 0px hsl(0deg 60% 2%),
    inset 0px ${u(-1)} 0px hsl(0deg 60% 2%),
    inset ${u(2)} 0px 0px hsl(46deg 40% 74%),
    inset 0px ${u(1)} 0px hsl(46deg 40% 74%),
    inset ${u(-2)} 0px 0px hsl(44deg 34% 40%),
    inset 0px ${u(-2)} 0px hsl(44deg 34% 40%),
    inset ${u(3)} 0px 0px hsl(42deg 38% 36%),
    inset 0px ${u(2)} 0px hsl(42deg 38% 36%);
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

  &:disabled {
    cursor: default;
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

  &:disabled::-webkit-slider-thumb {
    opacity: 0;
  }

  &:disabled::-moz-range-thumb {
    opacity: 0;
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
