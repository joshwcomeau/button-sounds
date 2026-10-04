import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge';
import Divider from '@/components/Divider';

const OUTER_RADIUS = 16;
const PADDING = 2;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  radius?: number;
  topRadius?: number;
  bottomRadius?: number;
}

function RaisedContainer({
  title,
  children,
  radius = OUTER_RADIUS,
  topRadius = radius,
  bottomRadius = radius,
  style = {},
  ...props
}: Props) {
  const innerRadius = radius - PADDING;
  const topInnerRadius = topRadius - PADDING;
  const bottomInnerRadius = bottomRadius - PADDING;
  return (
    <OuterWrapper
      style={{
        ...style,
        borderRadius: `${topRadius}px ${topRadius}px ${bottomRadius}px ${bottomRadius}px`,
      }}
      {...props}
    >
      <BevelEdge side="top" color="black" radius={topRadius} />
      <BevelEdge
        side="bottom"
        color="var(--color-gray-300)"
        radius={bottomRadius}
      />
      <Wrapper
        style={{
          borderRadius: `${topInnerRadius}px ${topInnerRadius}px ${bottomInnerRadius}px ${bottomInnerRadius}px`,
        }}
      >
        <BevelEdge
          side="top"
          color="var(--color-gray-400)"
          radius={topInnerRadius}
        />
        <BevelEdge
          side="bottom"
          color="var(--color-gray-200)"
          radius={bottomInnerRadius}
        />
        {title && (
          <>
            <Label>{title}</Label>
            <StyledDivider />
          </>
        )}
        {children}
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  position: relative;
  padding: ${PADDING}px;
  border: 1px solid var(--color-gray-200);
  corner-shape: bevel;
  background: var(--color-background);
`;

const Wrapper = styled.div`
  /*
  NOTE: In SoundSelectSidebar, have a styled(RaisedContainer) that sets 'contain: size', so that it doesn't cause the whole demo wrapper to grow/shrink. In order for the stuff within to fill the available space, I needed to make the styled OuterWrapper a flex column, so I then needed this inner wrapper to have flex: 1.
  AFAIK there are no other situations where I set the parent OuterWrapper to use Flexbox, but if this winds up causing problems, I'll need to refactor. I can either:
  1. Add an 'innerWrapperProps' prop that applies styles here
  2. Add a 'variant' prop that sets 'data-variant' on the parent and, in this chunk of styles, applies the SoundSelectSidebar-specific styles (flex: 1).
*/
  flex: 1;
  position: relative;
  /* NOTE: Needed in SoundSelectSidebar to ensure that the list doesn't overflow. */
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  background: linear-gradient(
    to bottom,
    var(--color-gray-100),
    hsl(210deg 19% 8%) 4rem
  );
  border: 1px solid var(--color-gray-200);
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
  color: var(--color-gray-1000);
  text-align: center;
  text-shadow: 0px 0px 8px var(--color-background);
  font-family: var(--font-segment);
  font-weight: 900;
`;

const StyledDivider = styled(Divider)`
  margin-inline: 8px;
  width: auto;
  color: var(--color-gray-500);
`;

export default RaisedContainer;
