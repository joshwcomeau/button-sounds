import * as React from 'react';
import styled from 'styled-components';

import { angleToGradientCoords } from './BackgroundPatterns.helpers';

const PATTERNS = {
  a: {
    size: 3,
    pixels: [[0, 0]],
  },
  b: {
    size: 4,
    pixels: [
      [0, 0],
      [2, 2],
    ],
  },
  c: {
    size: 8,
    pixels: [
      [0, 0],
      [4, 4],
    ],
  },
  d: {
    size: 4,
    pixels: [
      [0, 0],
      [1, 1],
      [2, 0],
      [0, 2],
      [2, 2],
    ],
  },
  e: {
    size: 3,
    pixels: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
  },
  f: {
    size: 4,
    pixels: [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [0, 2],
      [1, 2],
      [2, 3],
      [3, 3],
    ],
  },
};

interface Props extends React.SVGProps<SVGSVGElement> {
  patternId: keyof typeof PATTERNS;
  pixelScale?: number;
  gradient?: {
    from: string;
    to?: string;
    angle?: number;
  };
  color?: string;
}

function PatternDither({
  patternId,
  pixelScale = 1,
  gradient,
  color,
  style = {},
  ...props
}: Props) {
  const reactId = React.useId();
  const pattern = PATTERNS[patternId];

  if (!pattern) {
    throw new Error(`Pattern ${patternId} not found`);
  }

  const svgPatternId = `dither-pattern-${patternId}-${reactId}`;
  const maskId = `dither-mask-${reactId}`;
  const gradientId = `dither-gradient-${reactId}`;
  const tileSize = pattern.size * pixelScale;
  const hasGradient = gradient != null;
  const coords = angleToGradientCoords(gradient?.angle ?? 0);

  return (
    <Svg {...props} style={{ color, ...style }}>
      <defs>
        <pattern
          id={svgPatternId}
          patternUnits="userSpaceOnUse"
          width={tileSize}
          height={tileSize}
          viewBox={`0 0 ${pattern.size} ${pattern.size}`}
        >
          {pattern.pixels.map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="white"
            />
          ))}
        </pattern>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${svgPatternId})`} />
        </mask>
        {hasGradient && (
          <linearGradient
            id={gradientId}
            gradientUnits="objectBoundingBox"
            x1={coords.x1}
            y1={coords.y1}
            x2={coords.x2}
            y2={coords.y2}
          >
            <stop offset="0%" stopColor={gradient?.from} />
            <stop offset="100%" stopColor={gradient?.to ?? 'transparent'} />
          </linearGradient>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={hasGradient ? `url(#${gradientId})` : 'currentColor'}
        mask={`url(#${maskId})`}
        shapeRendering="crispEdges"
      />
    </Svg>
  );
}

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export default PatternDither;
