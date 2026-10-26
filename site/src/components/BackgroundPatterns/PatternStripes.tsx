import * as React from 'react';
import styled from 'styled-components';

import { angleToGradientCoords } from './BackgroundPatterns.helpers';

interface Props extends React.SVGProps<SVGSVGElement> {
  lineWidth: number;
  lineGap?: number;
  angle?: number;
  gradient?: {
    from: string;
    to?: string;
    fromOffset?: string;
    toOffset?: string;
    angle?: number;
  };
  color?: string;
}

function PatternStripes({
  lineWidth,
  lineGap = lineWidth,
  angle = 45,
  gradient,
  color,
  style = {},
  ...props
}: Props) {
  const reactId = React.useId();

  const svgPatternId = `stripes-pattern-${reactId}`;
  const maskId = `stripes-mask-${reactId}`;
  const gradientId = `stripes-gradient-${reactId}`;
  const period = lineWidth + lineGap;
  const hasGradient = gradient != null;
  const coords = angleToGradientCoords(gradient?.angle ?? 0);

  // Base tile paints horizontal stripes (CSS gradient angle 0deg). `patternTransform` then rotates them to match CSS `repeating-linear-gradient` angles — SVG’s clockwise rotation lines up with CSS’s clockwise-from-north convention, so 45deg yields top-left→bottom-right bands.
  return (
    <Svg {...props} style={{ color, ...style }}>
      <defs>
        <pattern
          id={svgPatternId}
          patternUnits="userSpaceOnUse"
          width={period}
          height={period}
          patternTransform={`rotate(${angle})`}
        >
          <rect x={0} y={0} width={period} height={lineWidth} fill="white" />
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
            <stop
              offset={gradient.fromOffset ?? '0%'}
              stopColor={gradient.from}
            />
            <stop
              offset={gradient.toOffset ?? '100%'}
              stopColor={gradient.to ?? 'transparent'}
            />
          </linearGradient>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="currentColor"
        mask={`url(#${maskId})`}
        shapeRendering="crispEdges"
      />
      {hasGradient && (
        <GradientRect
          width="100%"
          height="100%"
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
          shapeRendering="crispEdges"
        />
      )}
    </Svg>
  );
}

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const GradientRect = styled.rect`
  mix-blend-mode: soft-light;
`;

export default PatternStripes;
