import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  as?: React.ElementType;
  duration?: number;
  offset?: number;
  stagger?: number;
}

function BouncyLetters({
  children,
  as: Wrapper = 'span',
  duration = 3000,
  stagger = 300,
  offset = 2,
  ...delegated
}: Props) {
  return (
    <Wrapper {...delegated}>
      {children.split('').map((letter, index) => (
        <Letter
          key={index}
          style={{
            '--bounce-duration': `${duration}ms`,
            '--bounce-delay': `${index * -stagger}ms`,
            '--glow-delay': `${index * stagger * 1.5}ms`,
            '--offset': `${offset}px`,
          }}
        >
          {letter}
        </Letter>
      ))}
    </Wrapper>
  );
}

const glow = keyframes`
  0% {
    color: inherit
  }
  20% {
    color: var(--glow-color);
  }
  100% {
    color: inherit;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(calc(var(--offset) * -1));
  }
  50% {
    transform: translateY(calc(var(--offset)));
  }
`;

const Letter = styled.span`
  --glow-color: hsl(150deg 100% 70%);
  --c: cubic-bezier(0.5, 0, 0.5, 1);
  display: inline-block;

  @supports (color: oklch(0.86 0.28 153.82)) {
    --glow-color: oklch(0.86 0.28 153.82);
  }

  @media (prefers-reduced-motion: no-preference) {
    animation:
      ${bounce} var(--bounce-duration) var(--c) infinite,
      ${glow} 2000ms infinite;
    animation-delay: var(--bounce-delay), var(--glow-delay);
  }
`;

export default BouncyLetters;
