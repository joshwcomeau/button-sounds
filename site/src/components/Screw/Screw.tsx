import * as React from 'react';
import styled from 'styled-components';

function Screw(props: React.ComponentProps<'div'>) {
  return (
    <Wrapper {...props}>
      <Svg viewBox="0 0 16 16">
        <path
          d={`
            M 8,0
            L 8,16
            M 0,8
            L 16,8
          `}
        />
      </Svg>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  background: white;
  width: 8px;
  padding: 2px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  box-shadow: 0px 1px 0px hsl(0deg 0% 0% / 0.25);
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--color-background);
  stroke-width: 4px;
  stroke-linecap: round;
  overflow: visible;
  transform: rotate(45deg);
  opacity: 0.75;
`;

export default Screw;
