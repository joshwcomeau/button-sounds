import * as React from 'react';
import styled from 'styled-components';

export type OuterCornerName =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  corner: OuterCornerName;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
}

function OuterCorner({
  corner,
  borderRadius,
  borderWidth,
  borderColor,
  style,
  ...props
}: Props) {
  return (
    <Wrapper
      {...props}
      aria-hidden="true"
      data-corner={corner}
      style={{
        '--border-radius': `${borderRadius}px`,
        '--border-width': `${borderWidth}px`,
        '--border-color': borderColor,
        ...style,
      }}
    />
  );
}

const Wrapper = styled.div`
  position: absolute;
  width: var(--border-radius);
  height: var(--border-radius);
  background: inherit;
  corner-shape: bevel;
  pointer-events: none;

  &[data-corner='top-left'] {
    border-top-left-radius: var(--border-radius);
    border-top: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
  }

  &[data-corner='top-right'] {
    border-top-right-radius: var(--border-radius);
    border-top: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
  }

  &[data-corner='bottom-left'] {
    border-bottom-left-radius: var(--border-radius);
    border-bottom: var(--border-width) solid var(--border-color);
    border-left: var(--border-width) solid var(--border-color);
  }

  &[data-corner='bottom-right'] {
    border-bottom-right-radius: var(--border-radius);
    border-bottom: var(--border-width) solid var(--border-color);
    border-right: var(--border-width) solid var(--border-color);
  }
`;

export default OuterCorner;
