import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

function TaskbarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Wrapper
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
    >
      <BevelEdge side="top" color="var(--top-border-color)" radius={4} />
      <BevelEdge side="bottom" color="var(--bottom-border-color)" radius={4} />
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.a`
  --top-border-color: var(--color-gray-600);
  --bottom-border-color: var(--color-gray-75);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 2rem;
  background: var(--color-gray-250);
  border-radius: 4px;
  border: 1px solid var(--color-gray-200);
  corner-shape: bevel;

  &:active {
    --top-border-color: var(--color-gray-50);
    --bottom-border-color: var(--color-gray-400);
    background: var(--color-gray-100);
    transform: translateY(2px);
  }
`;

export default TaskbarLink;
