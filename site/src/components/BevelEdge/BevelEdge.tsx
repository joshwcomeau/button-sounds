import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  side: 'top' | 'bottom';
  color: string;
  radius?: number;
  leftRadius?: number;
  rightRadius?: number;
  borderWidth?: number;
  ignoreSide?: 'left' | 'right';
}

function BevelEdge({
  side,
  color,
  radius = 8,
  leftRadius = radius,
  rightRadius = radius,
  borderWidth = 1,
  ignoreSide,
  style = {},
  ...rest
}: Props) {
  const Component = side === 'top' ? TopEdge : BottomEdge;
  return (
    <Component
      style={{
        ...style,
        '--border-color': color,
        '--bevel-radius-left': `${leftRadius}px`,
        '--bevel-radius-right': `${rightRadius}px`,
        '--border-width': `${borderWidth}px`,
      }}
      data-ignore-side={ignoreSide}
      {...rest}
    />
  );
}

// NOTE: These are simpler alternatives to BevelEdge. I should probably move this code into that component and use it.
const TopEdge = styled.span`
  position: absolute;
  top: calc(var(--border-width) * -1);
  left: calc(var(--bevel-radius-left) - var(--border-width));
  right: calc(var(--bevel-radius-right) - var(--border-width));
  height: max(var(--bevel-radius-left), var(--bevel-radius-right));
  border-top: var(--border-width) solid var(--border-color);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    aspect-ratio: 1 / 1;
    corner-shape: bevel;
    background: inherit;
  }

  &::before {
    left: 0;
    width: var(--bevel-radius-left);
    border-top-left-radius: var(--bevel-radius-left);
    border-top: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
    transform: translate(-100%, calc(var(--border-width) * -1));
  }
  &::after {
    right: 0;
    width: var(--bevel-radius-right);
    border-top-right-radius: var(--bevel-radius-right);
    border-top: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
    transform: translate(100%, calc(var(--border-width) * -1));
  }

  &[data-ignore-side='left'] {
    &::before {
      display: none;
    }
  }
  &[data-ignore-side='right'] {
    &::after {
      display: none;
    }
  }
`;
const BottomEdge = styled.span`
  position: absolute;
  bottom: calc(var(--border-width) * -1);
  left: calc(var(--bevel-radius-left) - var(--border-width));
  right: calc(var(--bevel-radius-right) - var(--border-width));
  height: max(var(--bevel-radius-left), var(--bevel-radius-right));
  border-bottom: var(--border-width) solid var(--border-color);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    aspect-ratio: 1 / 1;
    corner-shape: bevel;
    background: inherit;
  }

  &::before {
    left: 0;
    width: var(--bevel-radius-left);
    border-bottom-left-radius: var(--bevel-radius-left);
    border-bottom: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
    transform: translate(-100%, var(--border-width));
  }
  &::after {
    right: 0;
    width: var(--bevel-radius-right);
    border-bottom-right-radius: var(--bevel-radius-right);
    border-bottom: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
    transform: translate(100%, var(--border-width));
  }
  &[data-ignore-side='left'] {
    &::before {
      display: none;
    }
  }
  &[data-ignore-side='right'] {
    &::after {
      display: none;
    }
  }
`;

export default BevelEdge;
