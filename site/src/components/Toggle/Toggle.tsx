import * as React from 'react';
import styled from 'styled-components';
import { load, press, release, type SoundName } from 'button-sounds';
import type { WireUpOptions } from 'button-sounds/react';

import BevelEdge from '@/components/BevelEdge';
import { useSoundSettings } from '@/components/SoundSettingsProvider';
import { random } from '@/utils';

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
  soundOptions?: WireUpOptions;
}

function getPlaybackRate(pitchVariation: WireUpOptions['pitchVariation']) {
  if (pitchVariation == null) {
    return undefined;
  }
  const [min, max] = Array.isArray(pitchVariation)
    ? pitchVariation
    : [1 - pitchVariation, 1 + pitchVariation];
  return random(min, max, { rounded: false });
}

function Toggle({
  label,
  checked,
  setChecked,
  className,
  style,
  id,
  soundOptions = {},
  ...delegated
}: Props) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const { usingLofi } = useSoundSettings();
  const soundOptionsRef = React.useRef<WireUpOptions>({});
  React.useLayoutEffect(() => {
    soundOptionsRef.current = {
      lofi: usingLofi,
      pitchVariation: 0.05,
      volume: 0.3,
      ...soundOptions,
    };
  });

  React.useEffect(() => {
    load('synth-on');
    load('synth-off');
  }, []);

  function playSound(trigger: typeof press, name: SoundName) {
    const { pitchVariation, ...options } = soundOptionsRef.current;
    trigger(name, {
      ...options,
      playbackRate: getPlaybackRate(pitchVariation),
    });
  }

  function handlePointerDown() {
    // Toggling flips `checked`, which flips the sound name. Capture it now so the release belongs to the same sound as the press.
    const name: SoundName = checked ? 'synth-off' : 'synth-on';
    playSound(press, name);

    window.addEventListener(
      'pointerup',
      () => {
        // The click that toggles the input fires *after* pointerup. Waiting a tick lets that change (and React’s re-render) land first, so that when this toggle controls a sound setting like lofi, the release already reflects the new value.
        window.setTimeout(() => playSound(release, name));
      },
      { once: true },
    );
  }

  return (
    <Wrapper
      className={className}
      style={style}
      onPointerDown={handlePointerDown}
    >
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
              color="var(--top-edge)"
              radius={INNER_RADIUS}
            />
            <BevelEdge
              side="bottom"
              color="var(--bottom-edge)"
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
    outline: var(--focus-dot-size, 2px) dotted white;
    outline-offset: 2px;
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

  &:focus-visible {
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

const Thumb = styled.span`
  --top-edge: var(--color-gray-400);
  --bottom-edge: var(--color-gray-200);
  --face-bg: var(--color-gray-100);
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
    --face-bg: var(--color-gray-400);
    transform: translateX(100%);
  }

  ${Track}:not(:has(:disabled)):active & {
    --top-edge: var(--color-gray-100);
    --bottom-edge: var(--color-gray-300);
    translate: 0 1px;
  }

  ${Track}:not(:has(:disabled)):active   &[data-checked='true'] {
    --top-edge: var(--color-gray-100);
    --bottom-edge: var(--color-gray-700);
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
  background: var(--face-bg);
  /* Keep the top sheen from blending out through the platform into the recess. */
  isolation: isolate;
  transition: background var(--slide-duration) var(--slide-easing);

  ${Track}:not(:has(:disabled)):active & {
    background: color-mix(in srgb, var(--face-bg), var(--color-background) 20%);
    transition-duration: 90ms;
    transition-timing-function: ease;
  }

  &::before {
    --glow-inset: 2px;
    content: '';
    position: absolute;
    top: var(--glow-inset);
    bottom: auto;
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

  ${Track}:not(:has(:disabled)):active &::before {
    top: auto;
    bottom: var(--glow-inset);
    border-radius: 50% 50% 4px 4px;
    opacity: 0.01;
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

export default Toggle;
