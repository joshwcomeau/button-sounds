import * as React from 'react';
import styled from 'styled-components';

import useResizeObserver from '@/hooks/use-resize-observer';

const DIAMOND_SIZE = 5;
const IDEAL_GAP = 2;
const STROKE_WIDTH = 2;
// Room around each diamond for its stroke. With mitered 90° corners, the stroke pokes out ~0.71px past each vertex, so half the stroke width isn’t enough.
const MARGIN = STROKE_WIDTH;
const HEIGHT = 4;

function Divider(props: React.SVGProps<SVGSVGElement>) {
  const reactId = React.useId();
  const svgPatternId = `divider-pattern-${reactId}`;

  const ref = React.useRef<SVGSVGElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);

  useResizeObserver(ref, ([entry]) => {
    if (entry) {
      setWidth(entry.contentRect.width);
    }
  });

  // Stretch the gaps so that the first diamond starts at the left edge and the last one ends at the right edge. Rounding down means the gap is never smaller than IDEAL_GAP.
  const idealTileWidth = DIAMOND_SIZE + IDEAL_GAP;
  let tileWidth = idealTileWidth;
  if (width !== null && width > DIAMOND_SIZE) {
    const numOfGaps = Math.max(
      1,
      Math.floor((width - DIAMOND_SIZE) / idealTileWidth),
    );
    tileWidth = (width - DIAMOND_SIZE) / numOfGaps;
  }

  const half = DIAMOND_SIZE / 2;
  const center = MARGIN + half;
  const diamondPath = `
    M ${center},${MARGIN}
    L ${center + half},${center}
    L ${center},${center + half}
    L ${center - half},${center}
    Z
  `;

  const patternY = HEIGHT / 2 - center;

  return (
    <Svg ref={ref} {...props}>
      <defs>
        <pattern
          id={svgPatternId}
          patternUnits="userSpaceOnUse"
          x={-MARGIN}
          y={patternY}
          width={tileWidth}
          height={DIAMOND_SIZE + MARGIN * 2}
        >
          <Diamond d={diamondPath} />
        </pattern>
      </defs>
      {width !== null && (
        <rect
          x={-MARGIN}
          y={patternY}
          width={width + MARGIN * 2}
          height={DIAMOND_SIZE + MARGIN * 2}
          fill={`url(#${svgPatternId})`}
        />
      )}
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: ${HEIGHT}px;
  overflow: visible;
`;

const Diamond = styled.path`
  fill: currentColor;
  stroke: var(--color-background);
  stroke-width: ${STROKE_WIDTH};
  paint-order: stroke;
`;

export default Divider;
