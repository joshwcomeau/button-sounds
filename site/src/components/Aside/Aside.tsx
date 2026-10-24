import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

function Aside({ title, children, ...props }: Props) {
  return (
    <Wrapper {...props}>
      <BevelEdge
        side="top"
        color="var(--top-outer-edge)"
        leftRadius={16}
        rightRadius={60}
      />
      <BevelEdge side="bottom" color="var(--bottom-outer-edge)" radius={16} />
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
}

export const Wrapper = styled.aside`
  --top-outer-edge: var(--color-gray-400);
  --bottom-outer-edge: var(--color-gray-75);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--color-gray-200);
  padding: 16px;
  margin-inline: -2rem;
  border-radius: 16px 60px 16px 16px;
  corner-shape: bevel;
  border: 1px solid var(--color-gray-100);
  margin-top: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 50rem) {
    margin-inline: 0;
  }
`;

const Title = styled.p`
  font-size: 1rem;
  font-weight: 600;
  padding-left: 1rem;
`;

const Content = styled.div`
  padding: 16px;
  background: var(--color-gray-75);
  border-radius: 8px;
  corner-shape: bevel;
  box-shadow: inset 1px 2px 2px var(--color-background);

  p {
    font-size: 0.875rem;

    &:not(:last-child) {
      margin-bottom: 0.75em;
    }
  }
`;

export default Aside;
