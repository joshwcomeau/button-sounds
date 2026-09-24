import * as React from 'react';
import styled from 'styled-components';

function Divider(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 100 4" preserveAspectRatio="none" {...props}>
      <BottomLine d="M 0,2 L 100,2" />
      <TopLine d="M 0,2 L 100,2" />
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 4px;
  fill: none;
  overflow: visible;
  vector-effect: non-scaling-stroke;
`;

const Path = styled.path`
  stroke-linecap: round;
  stroke-dasharray: 1, 3;
`;

const BottomLine = styled(Path)`
  stroke: var(--color-background);
  stroke-width: 3;
`;

const TopLine = styled(Path)`
  stroke: currentColor;
  stroke-width: 2;
`;

export default Divider;
