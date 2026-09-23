import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES } from 'button-sounds';

import { range } from '@/utils';

import BevelEdge from '@/components/BevelEdge';
import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';

interface Props {
  selectedSoundName: string | undefined;
  setSelectedSoundName: (name: string | undefined) => void;
}

function SoundSelectSidebar({
  selectedSoundName,
  setSelectedSoundName,
}: Props) {
  return (
    <Wrapper title="Select Sound">
      <List>
        {SOUND_NAMES.map((name) => {
          const isSelected = selectedSoundName === name;
          return (
            <ListItem key={name}>
              <Button
                data-is-selected={isSelected}
                onClick={() => setSelectedSoundName(name)}
              >
                <BevelEdge side="top" color="var(--top-edge)" radius={5} />
                <BevelEdge
                  side="bottom"
                  color="var(--bottom-edge)"
                  radius={5}
                />

                <Name>{name}</Name>
                <ActiveIndicator>
                  {range(10).map((index) => (
                    <Cell key={index} />
                  ))}
                </ActiveIndicator>
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
}

const Wrapper = styled(RaisedContainer)`
  width: 14rem;
  contain: size;
`;

const List = styled.ul`
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

const Button = styled.button`
  --top-edge: var(--color-gray-500);
  --bottom-edge: transparent;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 2rem;
  padding-left: 0.75rem;
  background: var(--color-gray-75);
  border: 1px solid var(--color-gray-100);
  border-radius: 5px;
  corner-shape: bevel;
  cursor: pointer;

  &[data-is-selected='true'],
  &:active {
    --top-edge: transparent;
    --bottom-edge: var(--color-gray-500);
    background-color: var(--color-background);
  }
`;

const Name = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--color-gray-900);

  ${Button}[data-is-selected='true'] &, ${Button}:active & {
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
  border-radius: 0 2px 2px 0;
  corner-shape: bevel;
  /* Trim corners */
  overflow: hidden;
`;
const Cell = styled.span`
  height: 1px;
  background: var(--color-gray-200);
  border-radius: 1px;
  corner-shape: bevel;

  ${Button}[data-is-selected='true'] & {
    background: hsl(45deg 100% 50%);
  }
`;

export default SoundSelectSidebar;
