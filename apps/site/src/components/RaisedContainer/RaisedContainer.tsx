import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge';

const OUTER_RADIUS = 16;
const PADDING = 2;
const INNER_RADIUS = OUTER_RADIUS - PADDING;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

function RaisedContainer({ title, children, ...props }: Props) {
  return (
    <OuterWrapper {...props}>
      <BevelEdge side="top" color="black" radius={OUTER_RADIUS} />
      <BevelEdge
        side="bottom"
        color="var(--color-gray-300)"
        radius={OUTER_RADIUS}
      />
      <Wrapper>
        <BevelEdge
          side="top"
          color="var(--color-gray-400)"
          radius={INNER_RADIUS}
        />
        <BevelEdge
          side="bottom"
          color="var(--color-gray-200)"
          radius={INNER_RADIUS}
        />
        {title && <Label>{title}</Label>}
        {children}
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  position: relative;
  padding: 2px;
  border: 1px solid var(--color-gray-200);
  border-radius: ${OUTER_RADIUS}px;
  corner-shape: bevel;
  background: var(--color-background);
`;

const Wrapper = styled.div`
  position: relative;
  /* NOTE: Needed in SoundSelectSidebar to ensure that the list doesn't overflow. */
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  border: 1px solid var(--color-gray-200);
  border-radius: ${INNER_RADIUS}px;
  corner-shape: inherit;
  /* Hide the ::before glow effect that otherwise spills over */
  /* NOTE: If I wind up having some instance that needs to overflow, I can always move the ::before to a separate elem within a <Clipper> */
  overflow: hidden;

  &::before {
    --inset: 4px;
    content: '';
    position: absolute;
    top: var(--inset);
    left: var(--inset);
    right: var(--inset);
    height: 20px;
    background: white;
    border-radius: 12px 12px 50% 50%;
    corner-shape: bevel;
    filter: blur(6px);
    opacity: 0.2;
    mix-blend-mode: hard-light;
  }
`;

const Label = styled.label`
  position: relative;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 12px;
  margin-inline: 4px;
  border-bottom: 2px dashed var(--color-gray-800);
  color: var(--color-gray-800);
  text-align: center;
  text-shadow: 0px 0px 8px var(--color-background);
  font-family: var(--font-segment);
  font-weight: 900;
`;

export default RaisedContainer;
