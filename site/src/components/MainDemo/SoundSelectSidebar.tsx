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

const FADE_SCROLL_DISTANCE = 150;
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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // NOTE: I have scroll-indicating gradients at the top/bottom of the container which fade in/out based on scroll distance. Originally, I used a scroll timeline for this, but there was a bug in Safari causing the entire browser to crash when filtering the list (https://bugs.webkit.org/show_bug.cgi?id=328938). So, I migrated to a JS approach for now, which has the bonus of working in Firefox.
  // The old approach is in commit 62823f95c9970ad34bbd4f7af769182ad7697552. The bug is fixed in Safari Nightly, and so maybe in a few months I can revert to that JS-free approach. Hopefully by then, @scroll-state will also be widely available and we can skip all JS-related stuff!
  const updateScrollFades = React.useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const maxScroll =
      scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const canScroll = maxScroll > 1;
    const top = canScroll
      ? Math.min(1, scrollContainer.scrollTop / FADE_SCROLL_DISTANCE)
      : 0;
    const bottom = canScroll
      ? Math.min(
          1,
          (maxScroll - scrollContainer.scrollTop) / FADE_SCROLL_DISTANCE,
        )
      : 0;

    // `top` and `bottom` are normalized between 0 and 1 over the FADE_SCROLL_DISTANCE. We'll round to 2 decimal places and set it as a CSS variable, used in the styles below.
    scrollContainer.style.setProperty('--fade-top', top.toFixed(2));
    scrollContainer.style.setProperty('--fade-bottom', bottom.toFixed(2));
  }, []);

  useResizeObserver(scrollContainerRef, updateScrollFades);

  // Filtering doesn’t resize the container, so ResizeObserver misses it. Measure after the new rows commit, before paint, so a short list doesn’t flash the fades.
  React.useLayoutEffect(() => {
    updateScrollFades();
  }, [relevantSounds, updateScrollFades]);

  return (
    <Wrapper title="Select Sound" {...delegated}>
      <UpBtn direction="up" handleClick={handleIncrementSound} />
      <DownBtn direction="down" handleClick={handleDecrementSound} />

      <ListFrame>
        <ListScrollContainer
          ref={scrollContainerRef}
          onScroll={updateScrollFades}
        >
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
          <List>
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
          </List>
          <EdgeFade data-edge="bottom" aria-hidden="true" />
        </ListScrollContainer>
      </ListFrame>
      <Divider />
      <BottomHeader>
        <FilterName>{selectedFilter ?? 'Filter'}</FilterName>
        <BottomHeaderEdge />
        <Actions>
          <SortBtnWrapper>
            <BevelEdge
              side="top"
              radius={8}
              color="var(--color-gray-400)"
              showEvenWhenUnsupported
            />
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
  /* Safari was flickering on mobile. This seems to fix it. */
  isolation: isolate;
  will-change: transform;
`;

const ListScrollContainer = styled.div`
  --list-gap: 2px;
  --list-padding: 4px;

  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--list-padding);
  gap: var(--list-gap);
  --fade-top: 0;
  --fade-bottom: 0;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: var(--list-gap);
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

const EdgeFade = styled.div`
  --fade-size: 100px;

  position: sticky;
  z-index: 1;
  flex: none;
  height: var(--fade-size);
  pointer-events: none;

  &[data-edge='top'] {
    /* Sticky insets are inside the padding, so a negative offset covers the padding the rows scroll through. */
    top: calc(-1 * var(--list-padding));
    /* Pull the following rows back up so the fade overlays them instead of occupying a slot. */
    margin-bottom: calc(-1 * (var(--fade-size) + var(--list-gap)));
    background: linear-gradient(to bottom, black, transparent);
    /* --fade-top and --fade-bottom are normalized from 0 to 1, to two decimal places. Cut that opacity in half so that it fades from 0 to 0.5 as the scroll distance increases. I never want it to be *that* opaque. */
    opacity: calc(var(--fade-top) * 0.5);
  }

  &[data-edge='bottom'] {
    bottom: calc(-1 * var(--list-padding));
    margin-top: calc(-1 * (var(--fade-size) + var(--list-gap)));
    background: linear-gradient(to top, black, transparent);
    opacity: calc(var(--fade-bottom) * 0.5);
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
  background: var(--color-gray-50);
`;

const EdgeSvg = styled.svg`
  display: block;
  width: 1rem;
  height: 1.9375rem;
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
