import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '../BevelEdge';

type Language = 'javascript';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  lang: Language;
  children: React.ReactNode;
}

function Snippet({ lang, children, ...props }: Props) {
  return (
    <OuterWrapper {...props}>
      <BevelEdge
        side="top"
        color="var(--color-gray-100)"
        radius={OUTER_RADIUS}
      />
      <BevelEdge
        side="bottom"
        color="var(--color-gray-300)"
        radius={OUTER_RADIUS}
      />
      <Wrapper>
        <Pre>
          <Code className={`language-${lang}`}>{children}</Code>
        </Pre>
      </Wrapper>
    </OuterWrapper>
  );
}

const CODE_PADDING = 32;
const OUTER_RADIUS = 16;
const PADDING = 2;
const INNER_RADIUS = OUTER_RADIUS - PADDING;

const OuterWrapper = styled.div`
  position: relative;
  padding: ${PADDING}px;
  margin-inline: calc(${CODE_PADDING + PADDING}px * -1);
  margin-block: 1rem 2rem;
  border: 1px solid var(--color-gray-200);
  border-radius: ${OUTER_RADIUS}px;
  outline: 8px solid var(--color-background);
  corner-shape: bevel;
  background: var(--color-background);
  --selection-bg: black;

  @media (max-width: 42.5rem) {
    max-width: 100%;
    contain: inline-size;
    margin-inline: 0;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
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

const Pre = styled.pre`
  border-radius: ${INNER_RADIUS}px;
  corner-shape: bevel;
  font-size: 0.875rem;
  padding: ${CODE_PADDING}px;
  overflow-x: auto;

  @media (max-width: 42.5rem) {
    padding: 1rem;
  }
`;

const Code = styled.code``;

export default Snippet;
