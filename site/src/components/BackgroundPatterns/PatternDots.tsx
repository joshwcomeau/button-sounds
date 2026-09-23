import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.SVGProps<SVGSVGElement> {
  spacing?: number;
  radius?: number;
}

function PatternDots({ spacing = 10, radius = 1, ...props }: Props) {
  const reactId = React.useId();
  const svgPatternId = `dots-pattern-${reactId}`;

  return (
    <Svg {...props}>
      <defs>
        <pattern
          id={svgPatternId}
          patternUnits="userSpaceOnUse"
          width={spacing}
          height={spacing}
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={radius}
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${svgPatternId})`}
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

export default PatternDots;
