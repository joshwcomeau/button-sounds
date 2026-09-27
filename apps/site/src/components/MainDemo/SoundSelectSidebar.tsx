import styled from 'styled-components';
import type { SoundName } from 'button-sounds';
import { Keyboard, Mouse, Gamepad, ToggleRight, Shapes } from 'lucide-react';

import { range } from '@/utils';

import BevelEdge from '@/components/BevelEdge';
import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';

import SoundSelectBtn from './SoundSelectBtn';
import FilterBtn from './FilterBtn';

const FILTER_TYPES = [
  { id: 'keyboard', icon: Keyboard },
  { id: 'mouse', icon: Mouse },
  { id: 'gamepad', icon: Gamepad },
  { id: 'toggle', icon: ToggleRight },
  { id: 'misc', icon: Shapes },
];

interface Props {
  selectedSoundName: string | undefined;
  setSelectedSoundName: (name: string | undefined) => void;
  relevantSounds: SoundName[];
  selectedFilter: string | null;
  handleFilterClick: (filterId: string) => void;
}

function SoundSelectSidebar({
  selectedSoundName,
  setSelectedSoundName,
  relevantSounds,
  selectedFilter,
  handleFilterClick,
}: Props) {
  return (
    <Wrapper title="Select Sound">
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
      <Filters>
        {FILTER_TYPES.map((filter) => (
          <FilterBtn
            key={filter.id}
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

const Wrapper = styled(RaisedContainer)`
  display: flex;
  flex-direction: column;
  width: 14rem;
  contain: size;
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
  border-block: 1px solid var(--color-gray-300);
`;

const ListItem = styled.li`
  position: relative;
  margin: 0;
  padding: 1px;
  border-radius: 4px;
  corner-shape: bevel;
  background: black;
`;

const Filters = styled.div`
  padding: 8px;
  display: flex;
  gap: 4px;
`;

export default SoundSelectSidebar;
