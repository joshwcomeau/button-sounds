import React from 'react';
import styled from 'styled-components';
import { ArrowUpDown, ArrowDownAZ, Shuffle } from 'lucide-react';
import { useButtonSounds } from 'button-sounds/react';

import { useSoundSettings } from '@/components/SoundSettingsProvider';
import VisuallyHidden from '@/components/VisuallyHidden/VisuallyHidden';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

import type { SortOrder } from './MainDemo.helpers';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  sortOrder: SortOrder;
  handleSortOrderClick: (order: SortOrder) => void;
}

const SORT_ORDERS = ['default', 'alphabetical', 'shuffle'];

const SORT_LABELS = {
  default: 'Default sort order chosen by Josh',
  alphabetical: 'Alphabetical, A to Z',
  shuffle: 'Randomly shuffled order',
};

const MAIN_RADIUS = 5;

function SortBtn({ sortOrder, handleSortOrderClick, ...delegated }: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);

  const { usingLofi } = useSoundSettings();

  useButtonSounds(wrapperRef, 'sd-standard', {
    lofi: usingLofi,
    pitchVariation: 0.1,
    volume: 0.2,
  });

  const Icon =
    sortOrder === 'default'
      ? ArrowUpDown
      : sortOrder === 'alphabetical'
        ? ArrowDownAZ
        : Shuffle;

  return (
    <Wrapper
      ref={wrapperRef}
      onClick={() => {
        const nextIndex = SORT_ORDERS.indexOf(sortOrder) + 1;
        if (nextIndex >= SORT_ORDERS.length) {
          handleSortOrderClick('default');
        } else {
          handleSortOrderClick(SORT_ORDERS[nextIndex] as SortOrder);
        }
      }}
      {...delegated}
    >
      <BevelEdge side="top" color="var(--top-edge)" radius={MAIN_RADIUS} />
      <BevelEdge
        side="bottom"
        color="var(--bottom-edge)"
        radius={MAIN_RADIUS}
      />
      <IconWrapper>
        <Icon
          size={16}
          style={{
            transform: sortOrder === 'shuffle' ? 'rotate(90deg)' : undefined,
          }}
        />
      </IconWrapper>
      <VisuallyHidden>Sort: {SORT_LABELS[sortOrder]}</VisuallyHidden>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --top-edge: var(--color-gray-600);
  --bottom-edge: var(--color-gray-50);
  --focus-offset: 2px;
  position: relative;
  display: grid;
  place-content: center;
  width: calc(2rem - 2px);
  aspect-ratio: 1 / 1;
  padding: 0;
  background: linear-gradient(
    to top,
    var(--color-gray-100),
    var(--color-gray-200)
  );
  border: none;
  border-inline: 1px solid var(--color-gray-200);
  border-radius: 4px;
  corner-shape: bevel;
  cursor: pointer;

  /* Touch area expander for mobile */
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
  }

  &:active {
    --top-edge: black;
    --bottom-edge: var(--color-gray-300);
    /* HACK: I really wanted something between 50 and 75 */
    background: hsl(210deg 18% 13%);
  }
`;

const IconWrapper = styled.div`
  ${Wrapper}:active & {
    opacity: 0.75;
    transform: translateY(1px);
  }
`;

export default SortBtn;
