import * as React from 'react';
import styled from 'styled-components';

import { clamp, range } from '@/utils';

interface Props extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'min' | 'max' | 'step' | 'onChange'
> {
  label: React.ReactNode;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step,
  className,
  style,
  id,
  ...delegated
}: Props) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const tickCount = getTickCount(min, max, step);
  const span = max - min;
  const ratio = span === 0 ? 0 : clamp((value - min) / span, 0, 1);

  return (
    <Wrapper className={className} style={style}>
      <Header>
        <Label htmlFor={inputId}>{label}</Label>
        <Value aria-hidden="true">{formatValue(value, step)}</Value>
      </Header>
      <Track
        style={{
          '--ratio': ratio,
          '--tick-last': Math.max(tickCount - 1, 1),
        }}
      >
        <Ticks aria-hidden="true">
          {range(tickCount).map((index) => (
            <Tick key={index} style={{ '--tick-index': index }}>
              <TickLine data-side="above" />
              <TickLine data-side="below" />
            </Tick>
          ))}
        </Ticks>
        <RangeInput
          {...delegated}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.valueAsNumber);
          }}
        />
      </Track>
    </Wrapper>
  );
}

function formatValue(value: number, step: number) {
  const decimals = decimalPlaces(step);
  return String(Number(value.toFixed(decimals)));
}

function decimalPlaces(step: number) {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

// Round so float error in `(max - min) / step` doesn’t drop or duplicate the final tick. Possible values include both endpoints, so the count is one more than the number of steps.
function getTickCount(min: number, max: number, step: number) {
  if (!(step > 0) || !(max > min)) {
    return 1;
  }

  return Math.round((max - min) / step) + 1;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  color: var(--color-gray-900);
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 0;
  font-size: 0.875rem;
`;

const Value = styled.span`
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
`;

const Track = styled.div`
  --thumb-width: 12px;
  --thumb-height: 28px;
  --track-height: 2px;
  --tick-thickness: 1px;
  --tick-length: 8px;
  --tick-gap: 3px;
  --track-color: var(--color-gray-300);
  --fill-color: var(--color-gray-800);
  --thumb-color: var(--color-gray-900);
  --tick-color: var(--color-gray-400);
  /* Same inset the native thumb uses, so the fill meets the thumb’s center instead of the raw value percentage. */
  --fill-end: calc(
    var(--thumb-width) / 2 + var(--ratio) * (100% - var(--thumb-width))
  );

  display: grid;
  width: 100%;
  min-width: 0;
`;

const Ticks = styled.div`
  grid-area: 1 / 1;
  position: relative;
  height: var(--thumb-height);
  min-width: 0;
  pointer-events: none;
`;

const Tick = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--tick-thickness);
  /* The thumb is centered on each value, so it sits half its width in from either end. Match that inset or the marks drift away from the handle. */
  left: calc(
    var(--thumb-width) / 2 + (var(--tick-index) / var(--tick-last)) *
      (100% - var(--thumb-width))
  );
  transform: translateX(-50%);
`;

const TickLine = styled.span`
  position: absolute;
  left: 0;
  width: 100%;
  height: var(--tick-length);
  background: var(--tick-color);
  border-radius: 1px;
  corner-shape: bevel;

  &[data-side='above'] {
    bottom: calc(50% + var(--track-height) / 2 + var(--tick-gap));
  }

  &[data-side='below'] {
    top: calc(50% + var(--track-height) / 2 + var(--tick-gap));
  }
`;

const RangeInput = styled.input`
  grid-area: 1 / 1;
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  min-width: 0;
  height: var(--thumb-height);
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  font-size: 0;
  line-height: 0;
  cursor: pointer;
  z-index: 1;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px dotted var(--color-gray-500);
    outline-offset: 4px;
  }

  /* WebKit doesn’t ship a progress pseudo-element, so the filled portion is a gradient painted on the track. Firefox has ::-moz-range-progress instead, and it’s missing some of the bevel styling — that’s an acceptable gap. */
  &::-webkit-slider-runnable-track {
    height: var(--track-height);
    border-radius: 2px;
    corner-shape: bevel;
    background: linear-gradient(
      to right,
      var(--fill-color) var(--fill-end),
      var(--track-color) var(--fill-end)
    );
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    width: var(--thumb-width);
    height: var(--thumb-height);
    /* Chrome pins the thumb to the top of the track. Shift it up so the portrait handle straddles the 2px line. */
    margin-top: calc((var(--track-height) - var(--thumb-height)) / 2);
    background: var(--thumb-color);
    border: 2px solid var(--color-background);
    border-radius: 3px;
    corner-shape: bevel;
    cursor: grab;
  }

  &:active::-webkit-slider-thumb {
    cursor: grabbing;
  }

  &::-moz-range-track {
    height: var(--track-height);
    background: var(--track-color);
    border: none;
    border-radius: 2px;
    corner-shape: bevel;
  }

  &::-moz-range-progress {
    height: var(--track-height);
    background: var(--fill-color);
    border: none;
    border-radius: 2px;
    corner-shape: bevel;
  }

  &::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--thumb-width);
    height: var(--thumb-height);
    background: var(--thumb-color);
    border: 2px solid var(--color-background);
    border-radius: 3px;
    corner-shape: bevel;
    cursor: grab;
  }
`;

export default Slider;
