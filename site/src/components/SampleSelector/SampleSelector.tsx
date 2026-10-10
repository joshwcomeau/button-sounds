import * as React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import { range } from '@/utils';

import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';
import { useSoundSettings } from '@/components/SoundSettingsProvider';
import VisuallyHidden from '@/components/VisuallyHidden';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  numOfSamples: number;
  lastPlayedSampleIndex: number | undefined;
  selectedSampleIndex: number | undefined;
  onSelectSampleManually: (sampleIndex: number | undefined) => void;
}

function SampleSelector({
  label,
  numOfSamples,
  lastPlayedSampleIndex,
  selectedSampleIndex,
  onSelectSampleManually,
  ...props
}: Props) {
  const groupName = React.useId();

  return (
    <Wrapper title={label} {...props}>
      <Group>
        <VisuallyHidden as="legend">{label}</VisuallyHidden>
        <Samples>
          {range(8).map((index) => {
            const isLocked = selectedSampleIndex === index;
            const hasSample = index < numOfSamples;

            if (!hasSample) {
              return <Placeholder key={index} />;
            }

            return (
              <SampleButton
                key={index}
                name={groupName}
                num={index + 1}
                isLastPlayed={lastPlayedSampleIndex === index}
                isLocked={isLocked}
                onSelect={() => onSelectSampleManually(index)}
                onDeselect={() => onSelectSampleManually(undefined)}
              />
            );
          })}
        </Samples>
      </Group>
    </Wrapper>
  );
}

interface SampleButtonProps {
  name: string;
  num: number;
  isLastPlayed: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

function SampleButton({
  name,
  num,
  isLastPlayed,
  isLocked,
  onSelect,
  onDeselect,
}: SampleButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { usingLofi } = useSoundSettings();

  useButtonSounds(inputRef, isLocked ? 'synth-off' : 'synth-on', {
    lofi: usingLofi,
    pitchVariation: 0.05,
    volume: 0.3,
  });

  return (
    <Sample data-is-last-played={isLastPlayed} data-is-locked={isLocked}>
      {/*
        Border as a separate elem for two reasons:
        1. So that I can animate it separately
        2. To avoid overwriting the focus outline

        <Locked> label moved within to prevent weird clipping issues during hover/active transitions.
      */}
      <Radio
        ref={inputRef}
        type="radio"
        name={name}
        value={num}
        checked={isLocked}
        onChange={onSelect}
        onClick={(event) => {
          // Native radios stay checked once selected. Clicking the active sample still clears it.
          if (!isLocked) {
            return;
          }
          event.preventDefault();
          onDeselect();
        }}
        onKeyDown={(event) => {
          if (!isLocked) {
            return;
          }
          if (event.key === 'Enter' || event.key === ' ') {
            onDeselect();
            event.preventDefault();
          }
        }}
      />
      <SampleBorder>
        <Locked aria-hidden={!isLocked}>Locked</Locked>
      </SampleBorder>

      <Num>{num}</Num>
      <Clipper></Clipper>
    </Sample>
  );
}

const Wrapper = styled(RaisedContainer)`
  display: flex;
  flex-direction: column;
  font-family: var(--font-segment);
  font-weight: 900;
`;

const Group = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  min-inline-size: 0;
`;

const Samples = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  gap: 4px;
  padding: 16px;
  width: 100%;
  max-width: 14rem;
  margin-inline: auto;
`;

// const SIZE = 2.5;

const Sample = styled.label`
  --easing: var(--bezier-overshoot-smooth);
  --duration: 1200ms;
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: transparent;
  border-radius: 6px;
  corner-shape: bevel;
  font-size: 1.25rem;
  cursor: pointer;
  user-select: none;
  transition: color 500ms;

  &[data-is-last-played='true'] {
    --locked-color: hsl(45deg 100% 65%);
    color: var(--locked-color);
    background: hsl(from var(--locked-color) h s l / 0.25);
  }

  &[data-is-locked='true'] {
    --locked-color: hsl(175deg 100% 55%);
    color: var(--locked-color);
  }
`;

const Radio = styled.input`
  position: absolute;
  z-index: 1;
  inset: 0;
  margin: 0;
  appearance: none;
  background: transparent;
  border: none;
  border-radius: inherit;
  corner-shape: inherit;
  cursor: pointer;
  --focus-offset: 1px;
`;

const SampleBorder = styled.span`
  position: absolute;
  inset: 0;
  border: 2px solid var(--color-gray-300);
  border-radius: 6px;
  corner-shape: bevel;
  outline: 2px solid transparent;
  outline-offset: 1px;
  /* Hide Locked as it slides in and out */
  overflow: hidden;
  transition:
    outline-color 400ms,
    border-color 600ms,
    color 500ms;

  ${Sample}:hover & {
    border-color: var(--color-gray-800);
    transition: none;
  }
  ${Sample}:active & {
    /* Decrease by exactly 2px, assuming 1rem = 16px */
    transform: scale(0.92);
  }
  ${Sample}[data-is-locked='true'] & {
    border-color: var(--locked-color);
    transition: outline-color 0ms;
  }

  ${Sample}[data-is-last-played='true'] & {
    border-color: var(--locked-color);
    outline-color: var(--locked-color);
    transition: outline-color 0ms;
  }
`;

const Placeholder = styled.div`
  --stripe-width: 4px;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: repeating-linear-gradient(
    45deg,
    transparent 0px var(--stripe-width),
    var(--color-gray-75) var(--stripe-width) calc(var(--stripe-width) * 2)
  );
  border: 2px solid var(--color-gray-100);
  border-radius: 6px;
  corner-shape: bevel;
`;

const Num = styled.span`
  display: block;
  transition: transform var(--duration) var(--easing);

  ${Sample}[data-is-locked='true'] & {
    transform: translateY(-0.25rem);
  }
`;

const Clipper = styled.div`
  position: absolute;
  inset: 1px;
`;

const Locked = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  font-size: 0.425rem;
  font-weight: 900;
  font-family: var(--font-default);
  text-transform: uppercase;
  line-height: 1.1;
  background: var(--locked-color);
  color: black;
  padding-top: 2px;
  border-radius: 4px;
  corner-shape: bevel;
  letter-spacing: -0.25px;
  text-align: center;
  transform: translateY(100%);
  transition:
    transform var(--duration) var(--easing),
    background 500ms;

  ${Sample}[data-is-locked='true'] & {
    transform: translateY(0%);
    transition: transform var(--duration) var(--easing);
  }
`;

export default SampleSelector;
