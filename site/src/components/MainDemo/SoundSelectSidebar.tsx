import * as React from 'react';
import styled from 'styled-components';
import type { SoundName } from 'button-sounds';
import { Keyboard, Mouse, Gamepad, ToggleRight, Shapes } from 'lucide-react';

import useResizeObserver from '@/hooks/use-resize-observer';

import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

import type { SortOrder } from './MainDemo.helpers';
import SoundSelectBtn from './SoundSelectBtn';
import FilterBtn from './FilterBtn';
import UpDownBtn from './UpDownBtn';
import SortBtn from './SortBtn';

const FILTER_TYPES = [
  { id: 'keyboard', icon: Keyboard },
  { id: 'mouse', icon: Mouse },
  { id: 'gamepad', icon: Gamepad },
  { id: 'toggle', icon: ToggleRight },
  { id: 'misc', icon: Shapes },
];

interface Props extends React.ComponentProps<'div'> {
  selectedSoundName: SoundName | undefined;
  setSelectedSoundName: (name: SoundName) => void;
  relevantSounds: Array<SoundName>;
  selectedFilter: string | null;
  sortOrder: SortOrder;
  triggerPress: () => void;
  triggerRelease: () => void;
  handleSortOrderClick: (order: SortOrder) => void;
  handleFilterClick: (filterId: string) => void;
  handleIncrementSound: () => void;
  handleDecrementSound: () => void;
}

function SoundSelectSidebar({
  selectedSoundName,
  setSelectedSoundName,
  relevantSounds,
  selectedFilter,
  sortOrder,
  triggerPress,
  triggerRelease,
  handleSortOrderClick,
  handleFilterClick,
  handleIncrementSound,
  handleDecrementSound,
  ...delegated
}: Props) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = React.useState(false);

  // I have scroll-indicating gradients at the top/bottom of the sound list, and they animate smoothly using animation-timeline (aside from Firefox). The trouble is that sometimes, when filtering, all of the sounds fit within the container, so there's no overflow to scroll through.
  // This tracks whether the list is scrollable or not, so that we can hide the gradients when all of the sounds fit in the container.
  // NOTE: In the future, I can use @container scroll-state for this! But it's not available in Safari yet, so we need to do it in JS.
  useResizeObserver(listRef, () => {
    const scrollList = listRef.current;
    if (!scrollList) {
      return;
    }

    const nextCanScroll = scrollList.scrollHeight - scrollList.clientHeight > 1;
    setCanScroll((current) =>
      current === nextCanScroll ? current : nextCanScroll,
    );
  });

  return (
    <Wrapper title="Select Sound" {...delegated}>
      <UpBtn direction="up" handleClick={handleIncrementSound} />
      <DownBtn direction="down" handleClick={handleDecrementSound} />

      <ListFrame>
        <List ref={listRef} data-can-scroll={canScroll}>
          <EdgeFade data-edge="top" aria-hidden="true" />
          {/*
            There's 50+ sounds and it's a lot to tab through for keyboard users. This focusable button allows them to skip to the next section
          */}
          <SkipContent
            onClick={() => {
              const filterButtons =
                document.querySelectorAll('[data-filter-btn]');
              if (filterButtons.length > 0) {
                (filterButtons[0] as HTMLElement).focus();
              }
            }}
          >
            Skip to filters
          </SkipContent>
          {relevantSounds.map((name) => {
            const isSelected = selectedSoundName === name;
            return (
              <ListItem key={name}>
                <SoundSelectBtn
                  name={name}
                  isSelected={isSelected}
                  triggerPress={triggerPress}
                  triggerRelease={triggerRelease}
                  setSelectedSoundName={setSelectedSoundName}
                />
              </ListItem>
            );
          })}
          <EdgeFade data-edge="bottom" aria-hidden="true" />
        </List>
      </ListFrame>
      <Divider />
      <BottomHeader>
        <FilterName>{selectedFilter ?? 'Filter'}</FilterName>
        <BottomHeaderEdge />
        <Actions>
          <SortBtnWrapper>
            <BevelEdge side="top" radius={8} color="var(--color-gray-400)" />
            <SortBtn
              sortOrder={sortOrder}
              handleSortOrderClick={handleSortOrderClick}
            />
          </SortBtnWrapper>
        </Actions>
      </BottomHeader>
      <Filters>
        {FILTER_TYPES.map((filter, index) => (
          <FilterBtn
            key={filter.id}
            isFirst={index === 0}
            isLast={index === FILTER_TYPES.length - 1}
            filterId={filter.id}
            Icon={filter.icon}
            isSelected={selectedFilter === filter.id}
            handleClick={handleFilterClick}
          />
        ))}
      </Filters>
    </Wrapper>
  );
}

function BottomHeaderEdge() {
  const FILET_X = 6;
  const FILET_Y = 3;
  const strokeD = `
    M 0,0
    L ${FILET_X},${FILET_Y}
    L ${32 - FILET_X},${32 - FILET_Y}
    L 32,32
  `;
  const fillD = `
    ${strokeD}
    L 0,32
    Z
  `;
  return (
    <EdgeSvg viewBox="0 0 32 32" preserveAspectRatio="none">
      {/* There's a weird half-pixel underline that we need to cover */}
      <rect x={0} y={32} width={32} height={1} fill="var(--color-gray-50)" />
      <FillPath d={fillD} />
      <StrokePath d={strokeD} />
    </EdgeSvg>
  );
}

const Wrapper = styled(RaisedContainer)`
  display: flex;
  flex-direction: column;
  min-width: 14rem;
  contain: size;
  min-height: 28rem;
`;

const ListFrame = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const List = styled.ul`
  --list-gap: 2px;
  --list-padding: 4px;

  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  list-style: none;
  padding: var(--list-padding);
  margin: 0;
  gap: var(--list-gap);
  scroll-timeline-name: --sound-list;
  scroll-timeline-axis: block;
`;

const SkipContent = styled.button`
  position: absolute;
  z-index: 2;
  top: 4px;
  left: 0;
  right: 0;
  width: fit-content;
  margin: auto;
  background: white;
  color: black;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-align: center;
  opacity: 0;
  pointer-events: none;

  &:focus-visible {
    opacity: 1;
  }
`;

const EdgeFade = styled.li`
  --fade-size: 100px;

  position: sticky;
  z-index: 1;
  flex: none;
  height: var(--fade-size);
  pointer-events: none;
  /* Browsers without scroll timelines, including Firefox, keep the fades hidden. */
  opacity: 0;

  &[data-edge='top'] {
    /* Sticky insets are inside the padding, so a negative offset covers the padding the rows scroll through. */
    top: calc(-1 * var(--list-padding));
    /* Pull the following rows back up so the fade overlays them instead of occupying a slot. */
    margin-bottom: calc(-1 * (var(--fade-size) + var(--list-gap)));
    background: linear-gradient(to bottom, black, transparent);
  }

  &[data-edge='bottom'] {
    bottom: calc(-1 * var(--list-padding));
    margin-top: calc(-1 * (var(--fade-size) + var(--list-gap)));
    background: linear-gradient(to top, black, transparent);
  }

  @supports (animation-timeline: scroll()) {
    /* The scroll animations fade toward this opacity. fadeFromTransparent and fadeToTransparent only set one keyframe. */
    opacity: 0.5;

    &[data-edge='top'] {
      animation: fadeFromTransparent linear both;
      animation-timeline: --sound-list;
      animation-range: 0px 150px;
    }

    &[data-edge='bottom'] {
      animation: fadeToTransparent linear both;
      animation-timeline: --sound-list;
      animation-range: calc(100% - 150px) 100%;
    }

    ${List}[data-can-scroll='false'] & {
      animation: none;
      opacity: 0;
    }
  }
`;

const ListItem = styled.li`
  position: relative;
  margin: 0;
  padding: 1px;
  border-radius: 4px;
  corner-shape: bevel;
  background: black;
`;

const UpBtn = styled(UpDownBtn)`
  position: absolute;
  top: 8px;
  left: 6px;
`;

const DownBtn = styled(UpDownBtn)`
  position: absolute;
  top: 8px;
  right: 6px;
`;

const Divider = styled.div`
  border-top: 1px solid var(--color-gray-300);
  background: var(--color-gray-75);
  height: 2px;
`;

const BottomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  text-transform: capitalize;
  font-weight: 700;
  font-family: var(--font-segment);
  background: var(--color-gray-75);
`;
const FilterName = styled.span`
  border-top: 1px solid var(--color-gray-300);
  padding: 8px;
  padding-bottom: 0;
  flex: 1;
  background: var(--color-gray-50);
`;
const Actions = styled.div`
  display: flex;
  align-items: flex-end;
  height: 2rem;
  padding-left: 8px;
  padding-right: 4px;
  gap: 2px;
  border-bottom: 1px solid var(--color-gray-300);
  background: var(--color-gray-75);
`;

const SortBtnWrapper = styled.div`
  position: relative;
  /* This tab sticks up into the list, above the bottom scroll fade. */
  z-index: 2;
  padding: 5px;
  background: inherit;
  border-radius: 8px 8px 0 0;
  corner-shape: bevel;
`;

const Filters = styled.div`
  padding: 8px;
  display: flex;
  gap: 4px;
`;

const EdgeSvg = styled.svg`
  display: block;
  width: 32px;
  height: 31px;
  fill: none;
  overflow: visible;
`;

const FillPath = styled.path`
  fill: var(--color-gray-50);
`;
const StrokePath = styled.path`
  stroke: var(--color-gray-300);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export default SoundSelectSidebar;
