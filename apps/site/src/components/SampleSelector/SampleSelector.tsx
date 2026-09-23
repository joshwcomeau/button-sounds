import * as React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import { range } from '@/utils';

import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';

interface Props {
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
}: Props) {
  return (
    <Wrapper title={label}>
      <Samples>
        {range(numOfSamples).map((index) => {
          const isLocked = selectedSampleIndex === index;
          return (
            <SampleButton
              key={index}
              num={index + 1}
              isLastPlayed={lastPlayedSampleIndex === index}
              isLocked={isLocked}
              handleClick={() => {
                const action =
                  selectedSampleIndex === index ? 'deselect' : 'select';
                const nextValue = action === 'select' ? index : undefined;
                onSelectSampleManually(nextValue);
              }}
            />
          );
        })}
      </Samples>
    </Wrapper>
  );
}

interface SampleButtonProps {
  num: number;
  isLastPlayed: boolean;
  isLocked: boolean;
  handleClick: () => void;
}

function SampleButton({
  num,
  isLastPlayed,
  isLocked,
  handleClick,
}: SampleButtonProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(btnRef, isLocked ? 'synth-off' : 'synth-on');

  // const { press: handlePressLock, release: handleReleaseLock } = useImperativeButtonSounds(btnRef, 'synth-on');
  // const { press: handlePressUnlock, release: handleReleaseUnlock } = useImperativeButtonSounds(btnRef, 'synth-off');
  return (
    <Sample
      ref={btnRef}
      data-is-last-played={isLastPlayed}
      data-is-locked={isLocked}
      onClick={handleClick}
    >
      {/*
        Border as a separate elem for two reasons:
        1. So that I can animate it separately
        2. To avoid overwriting the focus outline

        <Locked> label moved within to prevent weird clipping issues during hover/active transitions.
      */}
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

const Samples = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 16px;
`;

const Sample = styled.button`
  --easing: var(--bezier-overshoot-smooth);
  --duration: 1200ms;
  position: relative;
  width: 2.5rem;
  aspect-ratio: 1 / 1;
  border: none;
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
