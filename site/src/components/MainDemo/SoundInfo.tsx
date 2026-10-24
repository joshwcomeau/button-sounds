import styled from 'styled-components';
import type { SoundName } from 'button-sounds';

import { SOUND_DATA } from '@/data';

import BevelEdge from '@/components/BevelEdge';
import OuterCorner from '@/components/OuterCorner';
import PatternDither from '@/components/BackgroundPatterns/PatternDither';
import FadeOnChange from '@/components/FadeOnChange/FadeOnChange';

import PrizeContent from './PrizeContent';

interface Props extends React.ComponentProps<'div'> {
  name: SoundName;
  hasWonMinigame: boolean;
  onRestore: () => void;
  // Rendered within the decorative strip along the bottom edge.
  children?: React.ReactNode;
}

const TRANSITION_DELAY = 250;

const TOP_RADIUS = 8;
const MAIN_RADIUS = 16;

function SoundInfo({
  name,
  hasWonMinigame,
  onRestore,
  children,
  style = {},
  ...delegated
}: Props) {
  const soundData = SOUND_DATA[name];

  return (
    <Wrapper
      style={{
        ...style,
        '--title-width': hasWonMinigame ? '15.5rem' : '12.5rem',
        // When going from the won state back to the original state, the title shrinks, but it takes 250ms for the title content to change (thanks to FadeOnChange). If we start transitioning the width immediately, it briefly causes the title to split onto two lines.
        '--title-width-transition-delay': hasWonMinigame
          ? '0ms'
          : `${TRANSITION_DELAY}ms`,
      }}
      {...delegated}
    >
      <Title>
        <FadeOnChange changeKey={hasWonMinigame} duration={TRANSITION_DELAY}>
          {hasWonMinigame ? 'You cracked the code!' : 'About This Sound'}
        </FadeOnChange>
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
      <Main>
        <Panel data-is-shown={!hasWonMinigame} inert={hasWonMinigame}>
          {soundData.description}
        </Panel>
        <Panel data-is-shown={hasWonMinigame} inert={!hasWonMinigame}>
          <PrizeContent isShown={hasWonMinigame} onRestore={onRestore} />
        </Panel>
      </Main>
      <StyledMainTopEdge
        side="top"
        color="var(--color-gray-700)"
        ignoreSide="left"
        radius={MAIN_RADIUS}
      />
      <BevelEdge side="bottom" color="black" radius={MAIN_RADIUS} />
      <BottomDecoration>
        <StyledPattern patternId="b" />
        {children}
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
  width: var(--title-width);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-1000);
  transform: translateY(-100%);
  background: inherit;
  border: 1px solid var(--color-gray-250);
  border-bottom: none;
  border-radius: ${TOP_RADIUS}px ${TOP_RADIUS}px 0 0;
  corner-shape: bevel;
  transition: width 200ms ease var(--title-width-transition-delay);
  /* Just in case there's a sync issue with the title transition, don't allow it to split onto two lines. */
  white-space: nowrap;
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

/*
  Both panels are always rendered, so that the swap can transition smoothly between their heights: the outgoing panel collapses from "auto" to 0 while the incoming panel grows from 0 to "auto". This relies on "interpolate-size: allow-keywords", set globally in reset.css. Browsers without it will snap to the new height instead.
  The sequence: the outgoing panel fades out, then the heights transition, then the incoming panel fades in.
  We use visibility rather than "display: none" for the hidden panel. Animating display would require @starting-style, which would also apply on page load and cause the initial description to grow in.
*/
const Panel = styled.div`
  --fade-duration: 200ms;
  --resize-duration: 400ms;
  height: 0;
  overflow: clip;
  opacity: 0;
  visibility: hidden;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity var(--fade-duration),
      height var(--resize-duration) var(--fade-duration),
      visibility 0ms calc(var(--fade-duration) + var(--resize-duration));
  }

  &[data-is-shown='true'] {
    height: auto;
    opacity: 1;
    visibility: visible;

    @media (prefers-reduced-motion: no-preference) {
      transition:
        height var(--resize-duration) var(--fade-duration),
        opacity var(--fade-duration)
          calc(var(--fade-duration) + var(--resize-duration));
    }
  }
`;

const StyledMainTopEdge = styled(BevelEdge)`
  left: calc(var(--title-width) + 5px);
  transition: left 200ms ease var(--title-width-transition-delay);
`;

const BottomDecoration = styled.div`
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: 0;
  height: 24px;
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

export default SoundInfo;
