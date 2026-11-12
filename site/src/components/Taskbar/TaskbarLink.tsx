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
    <Wrapper href={href}>
      <BevelEdge side="top" color="var(--color-gray-600)" radius={4} />
      <BevelEdge side="bottom" color="var(--color-gray-75)" radius={4} />
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.a`
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
`;

export default TaskbarLink;
