import styled from 'styled-components';
import type { SoundName } from 'button-sounds';
import { Keyboard, Mouse, Gamepad, ToggleRight, Shapes } from 'lucide-react';

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
  relevantSounds: SoundName[];
  selectedFilter: string | null;
  sortOrder: SortOrder;
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
  handleSortOrderClick,
  handleFilterClick,
  handleIncrementSound,
  handleDecrementSound,
  ...delegated
}: Props) {
  return (
    <Wrapper title="Select Sound" {...delegated}>
      <UpBtn direction="up" handleClick={handleIncrementSound} />
      <DownBtn direction="down" handleClick={handleDecrementSound} />

      <List>
        {relevantSounds.map((name) => {
          const isSelected = selectedSoundName === name;
          return (
            <ListItem key={name}>
              <SoundSelectBtn
                name={name}
                isSelected={isSelected}
                setSelectedSoundName={setSelectedSoundName}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <BottomHeader>
        <FilterName>{selectedFilter || 'Filter'}</FilterName>
        <BottomHeaderEdge />
        <Actions>
          <SortBtnWrapper>
            <BevelEdge side="top" radius={8} color="var(--color-gray-400)" />
            <SortBtn
              sortOrder={sortOrder}
              handleSortOrderClick={handleSortOrderClick}
              style={{
                // Optical alignment
                transform: 'translateY(-1px)',
              }}
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

const List = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  list-style: none;
  padding: 4px;
  margin: 0;
  gap: 2px;
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
