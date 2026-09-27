import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props extends React.ComponentProps<'button'> {
  filterId: string;
  Icon: any;
  isSelected: boolean;
  handleClick: (filterId: string) => void;
}

function FilterBtn({
  filterId,
  Icon,
  isSelected,
  handleClick,
  children,
  ...delegated
}: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  useButtonSounds(
    wrapperRef,
    isSelected ? 'guitar-toggle-off' : 'guitar-toggle-on',
    {
      pitchVariation: 0.1,
    },
  );

  return (
    <Wrapper
      ref={wrapperRef}
      data-is-selected={isSelected}
      onClick={() => handleClick(filterId)}
      {...delegated}
    >
      <Icon size={16} />
    </Wrapper>
  );
}

const Wrapper = styled.button`
  display: grid;
  place-content: center;
  width: 2.5rem;
  aspect-ratio: 1 / 1;
  border: none;
  background: transparent;
  cursor: pointer;
  border: 1px solid var(--color-gray-300);
  border-radius: 5px;
  corner-shape: bevel;

  &:first-child {
    border-bottom-left-radius: 10px;
  }
  &:last-child {
    border-bottom-right-radius: 10px;
  }
`;

export default FilterBtn;
