import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import PatternDither from '@/components/BackgroundPatterns/PatternDither';

type Language = 'javascript';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  lang: Language;
  children: React.ReactNode;
}

function Snippet({ lang, children, ...props }: Props) {
  return (
    <OuterBorder {...props}>
      <PatternDither
        patternId="d"
        pixelScale={1}
        gradient={{
          from: 'var(--color-gray-100)',
          to: 'var(--color-gray-200)',
          angle: 45,
        }}
        style={{ opacity: 0.45 }}
      />
      <BevelEdge
        side="top"
        color="var(--color-gray-200)"
        radius={OUTER_RADIUS}
      />
      <BevelEdge
        side="bottom"
        color="var(--color-gray-50)"
        radius={OUTER_RADIUS}
      />
      <InnerBorder>
        <BevelEdge
          side="top"
          color="var(--color-gray-100)"
          radius={INNER_RADIUS}
        />
        <BevelEdge
          side="bottom"
          color="var(--color-gray-300)"
          radius={INNER_RADIUS}
        />
        <Wrapper>
          <Pre>
            <Code className={`language-${lang}`}>{children}</Code>
          </Pre>
        </Wrapper>
      </InnerBorder>
    </OuterBorder>
  );
}

const CODE_PADDING = 32;
const OUTER_RADIUS = 16;
const OUTER_PADDING = 8;
const INNER_PADDING = 2;
const INNER_RADIUS = OUTER_RADIUS - INNER_PADDING;

const OuterBorder = styled.div`
  position: relative;
  margin-inline: calc(${CODE_PADDING + INNER_PADDING}px * -1);
  margin-block: 1rem 2rem;
  border: 1px solid var(--color-gray-75);
  border-radius: ${OUTER_RADIUS}px;
  padding: ${OUTER_PADDING}px;
  corner-shape: bevel;
  background: var(--color-background);
  --selection-bg: black;
  /* Trim PatternDither corners */
  overflow: hidden;

  @media (max-width: 42.5rem) {
    max-width: 100%;
    contain: inline-size;
    margin-inline: 0;
  }
`;

const InnerBorder = styled.div`
  position: relative;
  border: 1px solid var(--color-gray-200);
  border-radius: ${INNER_RADIUS}px;
  padding: ${INNER_PADDING}px;
  corner-shape: bevel;
  background: var(--color-background);
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-200);
  border-radius: ${INNER_RADIUS - 2}px;
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
    opacity: 0.1;
    mix-blend-mode: hard-light;
  }
`;

const Pre = styled.pre`
  border-radius: ${INNER_RADIUS - 2}px;
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
