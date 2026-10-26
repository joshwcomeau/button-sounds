import * as React from 'react';
import styled from 'styled-components';

import useRequestAnimationFrameLoop from '@/hooks/use-request-animation-frame';

const PLAYHEAD_WIDTH = 2;

interface Props {
  startedAt: number;
  duration: number;
}

function Playhead({ startedAt, duration }: Props) {
  const [now, setNow] = React.useState(() => performance.now());

  const elapsed = Math.max(0, now - startedAt);
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;
  const isRunning = duration > 0 && progress < 1;

  // We're handling the animation in JS, which means we need to re-render the playhead on every frame while it's playing. I pulled this logic into its own component so that the cost of each render is negligible.
  useRequestAnimationFrameLoop(() => {
    setNow(performance.now());
  }, isRunning);

  return <Wrapper style={{ '--progress': progress }} />;
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${PLAYHEAD_WIDTH}px;
  left: calc(var(--progress) * (100% - ${PLAYHEAD_WIDTH}px));
  background: hsl(210deg 15% 95%);

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export default Playhead;
