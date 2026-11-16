import * as React from 'react';
import styled from 'styled-components';

const DIAMOND_SIZE = 5;
const GAP = 2;
const STROKE_WIDTH = 2;
// Room above/below each diamond for its stroke. With mitered 90° corners, the stroke pokes out ~0.71× its width past each vertex, so half the stroke width isn’t enough.
const MARGIN = STROKE_WIDTH;
const HEIGHT = 4;

const TILE_WIDTH = DIAMOND_SIZE + GAP;
const TILE_HEIGHT = DIAMOND_SIZE + MARGIN * 2;
const PATTERN_X = -GAP / 2;
const PATTERN_Y = HEIGHT / 2 - TILE_HEIGHT / 2;

const half = DIAMOND_SIZE / 2;
const centerX = TILE_WIDTH / 2;
const centerY = TILE_HEIGHT / 2;
const DIAMOND_PATH = `
  M ${centerX},${centerY - half}
  L ${centerX + half},${centerY}
  L ${centerX},${centerY + half}
  L ${centerX - half},${centerY}
  Z
`;

function Divider(props: React.SVGProps<SVGSVGElement>) {
  const reactId = React.useId();
  const svgPatternId = `divider-pattern-${reactId}`;

  return (
    <Svg {...props}>
      <defs>
        <pattern
          id={svgPatternId}
          patternUnits="userSpaceOnUse"
          x={PATTERN_X}
          y={PATTERN_Y}
          width={TILE_WIDTH}
          height={TILE_HEIGHT}
        >
          <Diamond d={DIAMOND_PATH} />
        </pattern>
      </defs>
      <Rect
        x={PATTERN_X}
        y={PATTERN_Y}
        height={TILE_HEIGHT}
        fill={`url(#${svgPatternId})`}
      />
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: ${HEIGHT}px;
  overflow: visible;
`;

const Rect = styled.rect`
  width: calc(100% + ${GAP}px);
`;

const Diamond = styled.path`
  fill: currentColor;
  stroke: var(--color-background);
  stroke-width: ${STROKE_WIDTH};
  paint-order: stroke;
`;

export default Divider;
