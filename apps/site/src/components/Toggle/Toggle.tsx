import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge';

const OUTER_RADIUS = 6;
const INSET = 2;
const INNER_RADIUS = OUTER_RADIUS - INSET;
const BORDER = 1;

interface Props extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value'
> {
  label?: React.ReactNode;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

function Toggle({
  label,
  checked,
  setChecked,
  className,
  style,
  id,
  ...delegated
}: Props) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <Wrapper className={className} style={style}>
      {label != null && <Caption htmlFor={inputId}>{label}</Caption>}
      <Track>
        <Input
          {...delegated}
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            setChecked(event.currentTarget.checked);
          }}
        />
        <BevelEdge side="top" color="black" radius={OUTER_RADIUS} />
        <BevelEdge
          side="bottom"
          color="var(--color-gray-300)"
          radius={OUTER_RADIUS}
        />
        <Well>
          <Thumb data-checked={checked} aria-hidden="true">
            <BevelEdge
              side="top"
              color="var(--color-gray-400)"
              radius={INNER_RADIUS}
            />
            <BevelEdge
              side="bottom"
              color="var(--color-gray-200)"
              radius={INNER_RADIUS}
            />
            <Face></Face>
          </Thumb>
        </Well>
      </Track>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;

  &:has(:disabled) {
    opacity: 0.5;
  }
`;

const Caption = styled.label`
  font-weight: bold;
  min-width: 0;
  font-size: 0.875rem;
  color: var(--color-gray-900);
  cursor: pointer;

  ${Wrapper}:has(:disabled) & {
    cursor: not-allowed;
  }
`;

const Track = styled.div`
  --slide-duration: 280ms;
  --slide-easing: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  flex: none;
  width: 5rem;
  height: 1.625rem;
  padding: ${INSET}px;
  border: 1px solid var(--color-gray-200);
  border-radius: ${OUTER_RADIUS}px;
  corner-shape: bevel;
  background: var(--color-background);

  &:has(:focus-visible) {
    outline: 2px dotted var(--color-gray-500);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    --slide-duration: 0ms;
  }
`;

const Input = styled.input`
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Well = styled.span`
  position: relative;
  display: block;
  height: 100%;
  border-radius: ${INNER_RADIUS}px;
  corner-shape: bevel;
`;

const Legend = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
`;

const Thumb = styled.span`
  position: relative;
  z-index: 1;
  display: block;
  width: 50%;
  height: 100%;
  border: ${BORDER}px solid var(--color-gray-200);
  border-radius: ${INNER_RADIUS}px;
  corner-shape: bevel;
  background: var(--color-background);
  transition:
    transform var(--slide-duration) var(--slide-easing),
    translate 90ms ease;

  &[data-checked='true'] {
    transform: translateX(100%);
  }

  ${Track}:active & {
    translate: 0 1px;
  }

  ${Track}:has(:disabled):active & {
    translate: 0 0;
  }
`;

const Face = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: calc(${INNER_RADIUS}px - 1px);
  corner-shape: inherit;
  background: var(--color-gray-100);
  /* Keep the top sheen from blending out through the platform into the recess. */
  isolation: isolate;
  transition: background var(--slide-duration) var(--slide-easing);

  ${Thumb}[data-checked='true'] & {
    background: var(--color-gray-400);
  }

  &::before {
    --glow-inset: 2px;
    content: '';
    position: absolute;
    top: var(--glow-inset);
    left: var(--glow-inset);
    right: var(--glow-inset);
    height: 5px;
    background: white;
    border-radius: 4px 4px 50% 50%;
    corner-shape: bevel;
    filter: blur(2px);
    opacity: 0.1;
    mix-blend-mode: hard-light;
    pointer-events: none;
    transition: opacity var(--slide-duration) var(--slide-easing);
  }

  ${Thumb}[data-checked='true'] &::before {
    opacity: 0.5;
  }
`;

// The plate holds both words at the full width of the track. It travels opposite the thumb, so each word stays parked on its side while the raised platform slides over it.
const Plate = styled.span`
  position: absolute;
  z-index: 1;
  top: -${BORDER}px;
  left: -${BORDER}px;
  display: flex;
  display: none;
  /* The face is the thumb’s content box, inset by its border. Stretch back over that border so these words sit on the same pixels as the legend underneath. */
  width: calc(200% + ${BORDER * 4}px);
  height: calc(100% + ${BORDER * 2}px);
  transition: transform var(--slide-duration) var(--slide-easing);

  ${Thumb}[data-checked='true'] & {
    transform: translateX(-50%);
  }
`;

const Word = styled.span`
  flex: 1 0 0;
  display: grid;
  place-items: center;
  min-width: 0;
  font-family: var(--font-segment);
  font-weight: 900;
  font-size: 0.625rem;
  line-height: 1;
  letter-spacing: 0.04em;
  user-select: none;
  color: var(--color-gray-600);

  ${Plate} &[data-state='off'] {
    color: var(--color-gray-1000);
  }

  ${Plate} &[data-state='on'] {
    color: var(--color-primary);
  }
`;

export default Toggle;
