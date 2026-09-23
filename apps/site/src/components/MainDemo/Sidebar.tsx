import * as React from 'react';
import styled from 'styled-components';

import { SOUND_NAMES } from 'button-sounds';

interface Props {
  selectedSoundName: string | undefined;
  setSelectedSoundName: (name: string | undefined) => void;
}

function Sidebar({ selectedSoundName, setSelectedSoundName }: Props) {
  return (
    <Wrapper>
      <SidebarHeading>Select Sound</SidebarHeading>
      <List>
        {SOUND_NAMES.map((name) => (
          <li key={name}>
            <Button
              data-is-selected={selectedSoundName === name}
              onClick={() => setSelectedSoundName(name)}
            >
              {name}
            </Button>
          </li>
        ))}
      </List>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 12.5rem;
  padding: 2px;
  border: 1px solid var(--color-gray-300);
  border-radius: 12px;
  corner-shape: bevel;
`;

const SidebarHeading = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  padding-block: 4px;
  background-color: var(--color-gray-100);
  border-radius: 10px;
  corner-shape: bevel;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  border: none;
  cursor: pointer;

  &[data-is-selected='true'] {
    background-color: #000;
    color: #fff;
  }
`;

export default Sidebar;
