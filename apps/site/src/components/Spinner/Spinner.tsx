import React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: string | number;
  opacity?: number;
  speed?: number;
  strokeWidth?: number;
}

const Spinner = ({
  color = 'currentColor',
  size = '24px',
  opacity = 1,
  speed = 1000,
  strokeWidth = 2,
  ...delegated
}: Props) => {
  return (
    <Wrapper
      style={{ opacity, width: size, height: size, '--speed': `${speed}ms` }}
      {...delegated}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  display: block;
  animation: spin var(--speed) linear infinite;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default Spinner;
