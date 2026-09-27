import styled from 'styled-components';
import type { SoundName } from 'button-sounds';

import { SOUND_DATA } from '@/data';

import BevelEdge from '@/components/BevelEdge';
import OuterCorner from '@/components/OuterCorner';

interface Props {
  name: SoundName;
}

const TOP_RADIUS = 8;
const MAIN_RADIUS = 16;

function SoundInfo({ name }: Props) {
  const soundData = SOUND_DATA[name];

  if (!soundData) {
    return 'TODO';
  }

  return (
    <Wrapper>
      <Title>
        About This Sound
        <BevelEdge
          side="top"
          color="var(--color-gray-700)"
          radius={TOP_RADIUS}
        />
        <StyledOuterCorner
          corner="top-right"
          borderRadius={TOP_RADIUS}
          borderWidth={1}
          borderColor="var(--color-gray-700)"
        />
      </Title>
      <Main>{soundData.description}</Main>
      <StyledMainTopEdge
        side="top"
        color="var(--color-gray-700)"
        ignoreSide="left"
        radius={MAIN_RADIUS}
      />
      <BevelEdge side="bottom" color="black" radius={MAIN_RADIUS} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  margin-top: 32px;
  border: 1px solid var(--color-gray-250);
  border-radius: 0px ${MAIN_RADIUS}px ${MAIN_RADIUS}px ${MAIN_RADIUS}px;
  corner-shape: bevel;
  background: var(--color-gray-200);
`;

const Title = styled.h3`
  position: absolute;
  top: 0px;
  left: -1px;
  width: 13rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-gray-1000);
  transform: translateY(-100%);
  background: inherit;
  border: 1px solid var(--color-gray-250);
  border-bottom: none;
  border-radius: ${TOP_RADIUS}px ${TOP_RADIUS}px 0 0;
  corner-shape: bevel;
`;
const StyledOuterCorner = styled(OuterCorner)`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateX(100%);
`;

const Main = styled.div`
  p {
    padding: 16px;
    font-size: 0.875rem;
    text-align: left;

    a {
      font-weight: 700;
      color: hsl(45deg 100% 60%);
    }
  }
`;

const StyledMainTopEdge = styled(BevelEdge)`
  left: calc(13rem + 5px);
`;

export default SoundInfo;
