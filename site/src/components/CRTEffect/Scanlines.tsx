import styled from 'styled-components';

import { normalize } from '@/utils';
import useDevicePixelRatio from '@/hooks/use-device-pixel-ratio';

interface Props {
  strength: number;
  lineHeight?: number;
  gapHeight?: number;
}

function Scanlines({ strength, lineHeight = 1, gapHeight = 1 }: Props) {
  const dpr = useDevicePixelRatio();

  // Huh, so TIL: Android phones sometimes have fractional device pixel ratios! My Nothing Phone 4A has a DPR of 2.75. As a result, my 1px scanlines were asymmetrical and a bit glitchy, as it tried to map the integer software pixels onto non-integer hardware pixels.
  // So, we'll scale up the scanlines based on the DPR of the device:
  const snap = (cssPx: number) => Math.max(1, Math.round(cssPx * dpr)) / dpr;

  return (
    <Stripes
      style={{
        opacity: normalize(strength, 0, 1, 0, 0.3),
        '--line-height': `${snap(lineHeight)}px`,
        '--gap-height': `${snap(gapHeight)}px`,
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
    hsl(210deg 15% 6% / 1) 0px var(--line-height),
    hsl(210deg 15% 50% / 0.75) var(--line-height)
      calc(var(--line-height) + var(--gap-height))
  );
  mix-blend-mode: hard-light;
  pointer-events: none;
`;

export default Scanlines;
