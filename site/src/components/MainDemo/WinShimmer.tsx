import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { MAIN_RADIUS, TITLE_HEIGHT, TOP_RADIUS } from './SoundInfo.constants';

const SHIMMER_DELAY = 4100;
const SHIMMER_DURATION = 3600;
const SHIMMER_FADE_OUT_DURATION = 200;

function WinShimmer({ isActive }: { isActive: boolean }) {
  const [runId, setRunId] = React.useState(0);
  const [isRendered, setIsRendered] = React.useState(false);
  const [prevIsActive, setPrevIsActive] = React.useState(isActive);

  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    if (isActive) {
      setIsRendered(true);
      setRunId((id) => id + 1);
    }
  }

  if (!isRendered) {
    return null;
  }

  return (
    <ShimmerWrapper
      style={{ opacity: isActive ? 1 : 0 }}
      onTransitionEnd={(event) => {
        if (
          event.target !== event.currentTarget ||
          event.propertyName !== 'opacity' ||
          isActive
        ) {
          return;
        }
        setIsRendered(false);
      }}
    >
      <Shimmer key={runId} />
    </ShimmerWrapper>
  );
}

const slideThrough = keyframes`
  from {
    transform: translateX(-55%);
  }
  to {
    transform: translateX(55%);
  }
`;

const ShimmerWrapper = styled.div`
  position: absolute;
  /* Extend up to cover the title tab, which sits above the main box. */
  top: -${TITLE_HEIGHT}px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: clip;
  pointer-events: none;
  mix-blend-mode: overlay;
  transition: opacity ${SHIMMER_FADE_OUT_DURATION}ms ease;
  /*
    Clip to the exact silhouette of the box, traced clockwise as 12 straight lines starting from the title tab's top-left bevel:
      1-3:  the tab's two beveled top corners (TOP_RADIUS)
      4-5:  down the tab's right edge, then the small *outer* bevel where the tab meets the wider main panel
      6-11: across the main panel's top and down to its three beveled corners (MAIN_RADIUS)

    The tab's left edge lines up with the main panel's, so the left side is one straight run (line 12, closed implicitly). "--title-width" is inherited from the Wrapper, so the top edge tracks the tab as it resizes.
  */
  clip-path: shape(
    from 0px ${TOP_RADIUS}px,
    line to ${TOP_RADIUS}px 0px,
    line to calc(var(--title-width) - ${TOP_RADIUS}px) 0px,
    line to var(--title-width) ${TOP_RADIUS}px,
    line to var(--title-width) ${TITLE_HEIGHT - TOP_RADIUS}px,
    line to calc(var(--title-width) + ${TOP_RADIUS}px) ${TITLE_HEIGHT}px,
    line to calc(100% - ${MAIN_RADIUS}px) ${TITLE_HEIGHT}px,
    line to 100% ${TITLE_HEIGHT + MAIN_RADIUS}px,
    line to 100% calc(100% - ${MAIN_RADIUS}px),
    line to calc(100% - ${MAIN_RADIUS}px) 100%,
    line to ${MAIN_RADIUS}px 100%,
    line to 0px calc(100% - ${MAIN_RADIUS}px),
    close
  );

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Shimmer = styled.div`
  position: absolute;
  top: 0;
  left: -50%;
  /* I want the stripe to be nice and wide, and not cut off at each end, so it needs to be wider than the parent container */
  width: 200%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 42%,
    hsl(0deg 0% 100% / 0.4) 50%,
    transparent 58%
  );
  animation: ${slideThrough} ${SHIMMER_DURATION}ms ease-in-out
    ${SHIMMER_DELAY}ms both;
`;

export default WinShimmer;
