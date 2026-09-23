import * as React from 'react';
import styled from 'styled-components';

import Slider from '@/components/Slider/Slider';
import Screw from '@/components/Screw/Screw';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  crtStrength: number;
  setCrtStrength: (strength: number) => void;
}

const screwStyles = { opacity: 0.5 };

function CRTControls({ crtStrength, setCrtStrength, ...delegated }: Props) {
  const sliderId = React.useId().replace(/:/g, '-');

  return (
    <Wrapper {...delegated}>
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

const Wrapper = styled.div`
  --color-outline: hsl(210deg 15% 26%);
  position: fixed;
  top: 0;
  right: 3rem;
  display: flex;
  align-items: flex-start;

  @media (max-width: 57rem) {
    left: 0;
    right: 0;
    margin-inline: auto;
    width: fit-content;
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
`;

const Main = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: black;
  border-radius: 0 0 16px 16px;
  corner-shape: bevel;
  border: 3px solid var(--color-outline);
  border-top: none;

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
`;

const InnerEdge = styled.div`
  position: absolute;
  inset: 1px;
  top: 0;
  border: 1px solid var(--color-gray-75);
  border-top: none;
  border-radius: 0 0 14px 14px;
  corner-shape: inherit;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  font-family: var(--font-segment);
`;

export default CRTControls;
