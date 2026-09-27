import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import { range } from '@/utils';

interface Props extends React.ComponentProps<'button'> {
  name: string;
  isSelected: boolean;
  setSelectedSoundName: (name: string) => void;
}

function SoundSelectBtn({
  name,
  isSelected,
  setSelectedSoundName,
  ...delegated
}: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  useButtonSounds(wrapperRef, 'carson-microflip', {
    pitchVariation: 0.1,
  });
  return (
    <Wrapper
      ref={wrapperRef}
      data-is-selected={isSelected}
      data-button-id={name}
      onClick={() => setSelectedSoundName(name)}
      {...delegated}
    >
      <BevelEdge side="top" color="var(--top-edge)" radius={5} />
      <BevelEdge side="bottom" color="var(--bottom-edge)" radius={5} />

      <LeftEdge />

      <ActiveIndicator>
        {range(10).map((index) => (
          <Cell key={index} style={{ '--delay': `${index * 10}ms` }} />
        ))}
      </ActiveIndicator>
      <Name>{name}</Name>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --top-edge: var(--color-gray-500);
  --bottom-edge: transparent;
  --from-color: var(--color-gray-75);
  --to-color: var(--color-gray-75);
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 2rem;
  padding-right: 0.75rem;
  background:
    linear-gradient(to right, var(--from-color), var(--to-color)),
    var(--color-background);
  border: 1px solid var(--color-gray-100);
  border-radius: 5px;
  corner-shape: bevel;
  cursor: pointer;

  @property --from-color {
    syntax: '<color>';
    inherits: false;
    initial-value: var(--color-gray-75);
  }

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 2px dotted var(--color-gray-700);
    outline-offset: 2px;
  }

  &[data-is-selected='true'],
  &:active {
    --top-edge: transparent;
    --bottom-edge: var(--color-gray-500);
    --from-color: var(--color-background);
    --to-color: var(--color-background);
  }

  &[data-is-selected='true'] {
    --from-color: hsl(50deg 100% 50% / 0.15);
    transition: --from-color 400ms;
  }
`;

const Name = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--color-gray-900);

  ${Wrapper}[data-is-selected='true'] &, ${Wrapper}:active & {
    color: white;
    transform: translateY(1px);
  }
`;

const ActiveIndicator = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 6px;
  height: fit-content;
  border-radius: 2px 0 0 2px;
  corner-shape: bevel;
  /* Trim corners */
  overflow: hidden;

  ${Wrapper}[data-is-selected='true'] & {
    --shadow: hsl(45deg 100% 50% / 0.5);
    --shadow-dampener: hsl(210deg 15% 6% / 0.5);
    background: hsl(45deg 100% 50% / 0.5);
    box-shadow:
      -1px 0px 2px 0px var(--shadow-dampener),
      1px 0px 2px 0px var(--shadow-dampener),
      0px 0px 4px 0px var(--shadow),
      0px 0px 4px 0px var(--shadow),
      0px 0px 8px 0px var(--shadow),
      0px 0px 16px 0px var(--shadow);
  }
`;
const Cell = styled.span`
  height: 1px;
  background: var(--color-gray-200);
  border-radius: 1px;
  corner-shape: bevel;
  transition: background 400ms;

  ${Wrapper}[data-is-selected='true'] & {
    background: hsl(45deg 100% 60%);
    transition: background 200ms var(--delay);
  }
`;

const LeftEdge = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-gray-200);
  border-radius: 0 2px 2px 0;
  corner-shape: bevel;
`;

export default SoundSelectBtn;
