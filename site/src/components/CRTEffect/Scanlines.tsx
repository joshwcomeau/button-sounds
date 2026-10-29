import styled from 'styled-components';

import { normalize } from '@/utils';

interface Props {
  strength: number;
  lineHeight?: number;
  gapHeight?: number;
}

function Scanlines({ strength }: Props) {
  return (
    <Stripes
      style={{
        opacity: normalize(strength, 0, 1, 0, 0.3),
      }}
    />
  );
}

const Stripes = styled.div`
  --line-height: 1px;
  --gap-height: 1px;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    hsl(210deg 15% 6% / 1) 0px var(--line-height),
    hsl(210deg 15% 50% / 0.75) var(--line-height)
      calc(var(--line-height) + var(--gap-height))
  );
  mix-blend-mode: hard-light;
  pointer-events: none;

  /* On Android Chrome, the lines get a bit glitchy, and even on iOS Safari, the lines are so tiny that it's hard to make them out. Double the size on smaller screens: */
  @media (max-width: 32rem) {
    --line-height: 2px;
    --gap-height: 2px;
  }
`;

export default Scanlines;
