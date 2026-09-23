import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  side: 'top' | 'bottom';
  color: string;
  radius: number;
  borderWidth: number;
}

function BevelEdge({ side, color, radius = 8, borderWidth = 1 }: Props) {
  const Component = side === 'top' ? TopEdge : BottomEdge;
  return (
    <Component
      style={{
        '--border-color': color,
        '--bevel-radius': `${radius}px`,
        '--border-width': `${borderWidth}px`,
      }}
    />
  );
}

// NOTE: These are simpler alternatives to BevelEdge. I should probably move this code into that component and use it.
const TopEdge = styled.div`
  position: absolute;
  top: calc(var(--border-width) * -1);
  left: calc(var(--bevel-radius) - var(--border-width));
  right: calc(var(--bevel-radius) - var(--border-width));
  height: var(--bevel-radius);
  border-top: var(--border-width) solid var(--border-color);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: var(--bevel-radius);
    aspect-ratio: 1 / 1;
    corner-shape: bevel;
    background: inherit;
  }

  &::before {
    left: 0;
    border-top-left-radius: var(--bevel-radius);
    border-top: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
    transform: translate(-100%, calc(var(--border-width) * -1));
  }
  &::after {
    right: 0;
    border-top-right-radius: var(--bevel-radius);
    border-top: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
    transform: translate(100%, calc(var(--border-width) * -1));
  }
`;
const BottomEdge = styled.div`
  position: absolute;
  bottom: calc(var(--border-width) * -1);
  left: calc(var(--bevel-radius) - var(--border-width));
  right: calc(var(--bevel-radius) - var(--border-width));
  height: var(--bevel-radius);
  border-bottom: var(--border-width) solid var(--border-color);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: var(--bevel-radius);
    aspect-ratio: 1 / 1;
    corner-shape: bevel;
    background: inherit;
  }

  &::before {
    left: 0;
    border-bottom-left-radius: var(--bevel-radius);
    border-bottom: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
    transform: translate(-100%, var(--border-width));
  }
  &::after {
    right: 0;
    border-bottom-right-radius: var(--bevel-radius);
    border-bottom: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
    transform: translate(100%, var(--border-width));
  }
`;

export default BevelEdge;
