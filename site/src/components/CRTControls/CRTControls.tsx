import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { SUPERHEADER_HEIGHT, BANNER_SHOW_ANIMATION } from '@/constants';

import Slider from '@/components/Slider/Slider';
import Screw from '@/components/Screw/Screw';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  crtStrength: number;
  setCrtStrength: (strength: number) => void;
  shiftBelowSaleBanner: boolean;
}

const screwStyles = { opacity: 0.5 };

function CRTControls({
  crtStrength,
  setCrtStrength,
  shiftBelowSaleBanner,
  ...delegated
}: Props) {
  const sliderId = React.useId().replace(/:/g, '-');

  return (
    <Wrapper {...delegated} data-shifted-down={shiftBelowSaleBanner}>
      <ScrewWrapper data-side="left">
        <Screw style={screwStyles} />
      </ScrewWrapper>
      <Main>
        <InnerEdge>
          <BevelEdge side="bottom" color="var(--color-gray-250)" radius={14} />
        </InnerEdge>
        <Label htmlFor={sliderId}>CRT</Label>
        <Slider
          id={sliderId}
          value={crtStrength}
          setValue={setCrtStrength}
          min={0}
          max={1}
          step={0.1}
          // When focusing, I want the dotted focus outline to follow the diagonal edge of the bottom-right corner
          inputStyles={
            {
              borderRadius: '0 0 8px 0',
              cornerShape: 'bevel',
            } as React.CSSProperties
          }
        />
      </Main>
      <ScrewWrapper data-side="right">
        <Screw style={screwStyles} />
      </ScrewWrapper>
    </Wrapper>
  );
}

const slideDownDuringSale = keyframes`
  from {
    transform: translateY(-${SUPERHEADER_HEIGHT}rem);
  }
`;
const Wrapper = styled.div`
  --color-outline: var(--color-gray-200);
  position: fixed;
  top: 0;
  right: 3rem;
  display: flex;
  align-items: flex-start;

  /*
    The controls are intended to be anchored to the top of the viewport, as though stuck to the browser UI itself. Unfortunately, iOS Safari threw out decades of precedent when they moved the address bar to the bottom, and decided to allow the page to remain visible above the top of the viewport.
    As a result, it weirdly feels like these controls are anchored to nothing, so we'll need to hide the anchoring screws (below) and make it seem like it's meant to be floating.
  */
  @media (max-width: 57rem) {
    top: 8px;
    left: 0;
    right: 0;
    margin-inline: auto;
    width: fit-content;
  }

  &[data-shifted-down='true'] {
    top: ${`calc(${SUPERHEADER_HEIGHT}rem - 2px)`};

    animation: ${slideDownDuringSale} ${BANNER_SHOW_ANIMATION.duration}ms
      ${BANNER_SHOW_ANIMATION.curve} both;
    animation-delay: ${BANNER_SHOW_ANIMATION.delay}ms;
  }
`;

const ScrewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 16px;
  height: 14px;
  padding-top: 2px;
  background: var(--color-outline);
  corner-shape: bevel;
  --inline-inset: 2px;
  --corner-radius: 8px;

  &[data-side='left'] {
    border-radius: 0 0 0 var(--corner-radius);
    justify-content: flex-end;
    padding-right: var(--inline-inset);
  }
  &[data-side='right'] {
    border-radius: 0 0 var(--corner-radius) 0;
    justify-content: flex-start;
    padding-left: var(--inline-inset);
  }

  @media (max-width: 57rem) {
    display: none;
  }
`;

const Main = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 3px solid var(--color-outline);
  border-top: none;
  background: black;
  border-radius: 0 0 16px 16px;
  corner-shape: bevel;
  /* Trim the soft glow */
  overflow: hidden;

  /* Soft white glow along the top, giving it a glassy effect */
  &::before {
    --inset: 0px;
    content: '';
    position: absolute;
    top: var(--inset);
    left: var(--inset);
    right: var(--inset);
    height: 10px;
    background: hsl(210deg 30% 85%);
    border-radius: 12px 12px 50% 50%;
    corner-shape: bevel;
    filter: blur(6px);
    opacity: 0.2;
    mix-blend-mode: hard-light;
  }

  @media (max-width: 57rem) {
    border-top: 3px solid var(--color-outline);
    border-radius: 4px 4px 16px 16px;
  }
`;

const InnerEdge = styled.div`
  position: absolute;
  inset: 1px;
  top: 0;
  border: 1px solid var(--color-gray-75);
  border-top: none;
  border-radius: 0 0 14px 14px;
  corner-shape: inherit;

  @media (max-width: 57rem) {
    top: 1px;
    border-top: 1px solid var(--color-gray-75);
    border-radius: 2px 2px 14px 14px;
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  font-family: var(--font-segment);
`;

export default CRTControls;
