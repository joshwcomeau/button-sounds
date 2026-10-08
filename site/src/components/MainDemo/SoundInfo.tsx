import styled from 'styled-components';
import type { SoundName } from 'button-sounds';

import { SOUND_DATA } from '@/data';

import BevelEdge from '@/components/BevelEdge';
import OuterCorner from '@/components/OuterCorner';
import PatternDither from '@/components/BackgroundPatterns/PatternDither';

interface Props extends React.ComponentProps<'div'> {
  name: SoundName;
}

const TOP_RADIUS = 8;
const MAIN_RADIUS = 16;

function SoundInfo({ name, ...delegated }: Props) {
  const soundData = SOUND_DATA[name];

  return (
    <Wrapper {...delegated}>
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
      <BottomDecoration>
        <StyledPattern patternId="b" />
        <SlantedThingy />
      </BottomDecoration>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  margin-top: 3rem;
  padding-bottom: 1rem;
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
  padding-bottom: 16px;
  p {
    padding: 16px;
    padding-bottom: 0;
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

const BottomDecoration = styled.div`
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: 0;
  height: 24px;
  overflow: hidden;
  /* opacity: 0.5; */
  border-top: 1px solid var(--color-gray-300);
  border-inline: 1px solid var(--color-gray-50);
  border-radius: 0 0 ${MAIN_RADIUS}px ${MAIN_RADIUS}px;
  corner-shape: bevel;

  color: var(--color-gray-500);
  background: var(--color-gray-100);
`;

const StyledPattern = styled(PatternDither)`
  --inset: 3px;
  --r: calc(${MAIN_RADIUS}px - var(--inset));
  position: absolute;
  inset: var(--inset);
  width: calc(100% - 2 * var(--inset));
  height: calc(100% - 2 * var(--inset));
  border-radius: 0 0 var(--r) var(--r);
  corner-shape: bevel;
  color: var(--color-gray-250);
`;

const SlantedThingy = styled.div`
  position: absolute;
  right: 17px;
  bottom: 0px;
  width: 98px;
  height: 16px;
  border: 3px solid var(--color-gray-250);
  border-top-width: 2px;
  background: var(--color-gray-50);
  outline: 2px solid var(--color-gray-100);
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  transform: skewX(-45deg);

  &::after {
    --stripe-width: 3px;
    content: '';
    position: absolute;
    inset: 2px;
    image-rendering: pixelated;
    background: repeating-linear-gradient(
      to right,
      var(--color-gray-400) 0px var(--stripe-width),
      transparent 2px calc(var(--stripe-width) * 2),
      var(--color-gray-250) calc(var(--stripe-width) * 2)
        calc(var(--stripe-width) * 3),
      transparent calc(var(--stripe-width) * 3) calc(var(--stripe-width) * 4)
    );
  }
`;

export default SoundInfo;
