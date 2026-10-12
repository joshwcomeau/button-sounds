import * as React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  as?: React.ElementType;
  duration?: number;
  stagger?: number;
}

function BouncyLetters({
  children,
  as = 'span',
  duration = 3000,
  stagger = 300,
  offset = 3,
  ...delegated
}: Props) {
  return (
    <Wrapper as={as} {...delegated}>
      {children.split('').map((letter, index) => (
        <Letter
          key={index}
          style={{
            '--duration': `${duration}ms`,
            '--delay': `${index * -stagger}ms`,
            '--offset': `${offset}`,
          }}
        >
          {letter}
        </Letter>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.span``;

const bounce = keyframes`
  0%, 100% { transform: translateY(calc(var(--offset) * -1px)); }
  50% { transform: translateY(var(--offset)); }
`;

const Letter = styled.span`
  display: inline-block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${bounce} var(--duration) cubic-bezier(0.5, 0, 0.5, 1) infinite;
    animation-delay: var(--delay);
  }
`;

export default BouncyLetters;
