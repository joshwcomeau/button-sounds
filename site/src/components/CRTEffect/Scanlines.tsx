import styled from 'styled-components';

import { normalize } from '@/utils';

interface Props {
  strength: number;
  lineHeight?: number;
  gapHeight?: number;
}

function Scanlines({ strength, lineHeight = 1, gapHeight = 1 }: Props) {
  return (
    <Stripes
      style={{
        '--line-height': `${lineHeight}px`,
        '--gap-height': `${gapHeight}px`,
        opacity: normalize(strength, 0, 1, 0, 0.2),
      }}
    />
  );
}

const Stripes = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    hsl(210deg 15% 6% / 0.5) 0px var(--line-height),
    hsl(210deg 15% 90% / 0.5) var(--line-height)
      calc(var(--line-height) + var(--gap-height))
  );
  mix-blend-mode: hard-light;
  pointer-events: none;
`;

export default Scanlines;
