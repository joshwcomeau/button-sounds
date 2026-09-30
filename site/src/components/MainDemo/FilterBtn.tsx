import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import { range } from '@/utils';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import { useSoundSettings } from '@/components/SoundSettingsProvider';

const MAIN_RADIUS = 5;
const OUTER_MATCHED_RADIUS = 10;

interface Props extends React.ComponentProps<'button'> {
  isFirst: boolean;
  isLast: boolean;
  filterId: string;
  Icon: any;
  isSelected: boolean;
  handleClick: (filterId: string) => void;
}

function FilterBtn({
  isFirst,
  isLast,
  filterId,
  Icon,
  isSelected,
  handleClick,
  children,
  ...delegated
}: Props) {
  console.log('Icon', Icon);
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  const { usingLofi } = useSoundSettings();
  useButtonSounds(
    wrapperRef,
    isSelected ? 'guitar-toggle-off' : 'guitar-toggle-on',
    {
      lofi: usingLofi,
      pitchVariation: 0.1,
    },
  );

  const brRadius = isFirst ? OUTER_MATCHED_RADIUS : MAIN_RADIUS;
  const blRadius = isLast ? OUTER_MATCHED_RADIUS : MAIN_RADIUS;

  return (
    <Wrapper
      ref={wrapperRef}
      data-is-selected={isSelected}
      onClick={() => handleClick(filterId)}
      style={{
        borderRadius: `${MAIN_RADIUS}px ${MAIN_RADIUS}px ${blRadius}px ${brRadius}px`,
      }}
      {...delegated}
    >
      <BevelEdge side="top" color="var(--top-edge)" radius={MAIN_RADIUS} />
      <BevelEdge
        side="bottom"
        color="var(--bottom-edge)"
        leftRadius={brRadius}
        rightRadius={blRadius}
      />
      <ActiveIndicator>
        {range(12).map((index) => (
          <Cell key={index} style={{ '--delay': `${index * 15}ms` }} />
        ))}
      </ActiveIndicator>
      <IconWrapper>
        <Icon
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(2px)',
            opacity: isSelected ? 0.5 : 0,
            transition: `opacity ${TRANSITION_DURATION}ms`,
          }}
          size={16}
          fill="hsl(45deg 100% 50% / 0.5)"
          stroke="hsl(45deg 100% 50% / 0.5)"
        />
        <Icon size={16} style={{ position: 'relative' }} />
      </IconWrapper>
      <Overlay />
    </Wrapper>
  );
}

const TRANSITION_DURATION = 220;

const Wrapper = styled.button`
  --top-edge: var(--color-gray-600);
  --bottom-edge: var(--color-gray-200);
  position: relative;
  display: grid;
  place-content: center;
  width: 2.5rem;
  aspect-ratio: 1 / 1;
  border: none;
  background: transparent;
  cursor: pointer;
  border: 1px solid var(--color-gray-250);
  border-radius: 5px;
  corner-shape: bevel;
  color: var(--color-gray-900);

  &:first-child {
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-bottom-right-radius: 10px;
  }

  &:active {
    --top-edge: var(--color-gray-200);
    --bottom-edge: var(--color-gray-600);
    background: black;
  }

  &[data-is-selected='true'] {
    color: hsl(50deg 100% 75%);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: -1px;
  background: linear-gradient(
    to bottom,
    hsl(45deg 100% 50% / 0.25),
    hsl(45deg 100% 50% / 0)
  );
  border-radius: inherit;
  corner-shape: bevel;
  opacity: 0;
  transition:
    opacity ${TRANSITION_DURATION}ms,
    clip-path ${TRANSITION_DURATION}ms ${TRANSITION_DURATION}ms;
  clip-path: polygon(0 0, 0% 0, 0% 100%, 0 100%);

  ${Wrapper}[data-is-selected='true'] & {
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition:
      opacity ${TRANSITION_DURATION}ms 16ms,
      clip-path ${TRANSITION_DURATION + 60}ms 16ms;
  }
`;

const IconWrapper = styled.div`
  transform: translateY(3px);

  ${Wrapper}:active & {
    opacity: 0.75;
    transform: translateY(4px);
  }
`;

const ActiveIndicator = styled.span`
  position: absolute;
  inset: 3px;
  bottom: unset;
  display: flex;
  gap: 1px;
  width: fit-content;
  height: 6px;
  border-radius: 2px 2px 0 0;
  corner-shape: bevel;
  /* Trim corners */
  overflow: hidden;

  ${Wrapper}:active & {
    transform: translateY(1px);
  }
`;
const Cell = styled.span`
  position: relative;
  width: 1.5px;
  background: hsl(0deg 0% 100% / 0.1);
  border-radius: 1px;
  corner-shape: bevel;
  transition: background 400ms;

  ${Wrapper}[data-is-selected='true'] & {
    background: hsl(45deg 100% 60%);
    transition: background ${TRANSITION_DURATION}ms var(--delay);
  }

  &::after {
    /* content: ''; */
    position: absolute;
    inset: 0;
    background: hsl(45deg 100% 50% / 0.5);
    border-radius: inherit;
    corner-shape: bevel;
    filter: blur(3px);
  }
`;

export default FilterBtn;
