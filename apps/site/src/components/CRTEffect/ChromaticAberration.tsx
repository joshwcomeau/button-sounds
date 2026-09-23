import * as React from 'react';
import styled from 'styled-components';

import { normalize } from '@/utils';

interface Props {
  strength: number;
}

// Isolate each color channel, slide red one pixel left and blue one pixel right, then screen them back together so high-contrast edges pick up chromatic aberration.
const RED_CHANNEL = '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0';
const GREEN_CHANNEL = '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0';
const BLUE_CHANNEL = '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0';

function ChromaticAberration({ strength }: Props) {
  const filterId = React.useId().replace(/:/g, '');
  const mixRatio = normalize(strength, 0, 1, 0, 0.5);

  return (
    <>
      <FilterDefs aria-hidden="true">
        <filter
          id={filterId}
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={RED_CHANNEL}
            result="red"
          />
          <feOffset in="red" dx={-1} dy={0} result="redShifted" />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={GREEN_CHANNEL}
            result="green"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={BLUE_CHANNEL}
            result="blue"
          />
          <feOffset in="blue" dx={1} dy={0} result="blueShifted" />
          <feBlend
            in="redShifted"
            in2="green"
            mode="screen"
            result="redGreen"
          />
          <feBlend
            in="redGreen"
            in2="blueShifted"
            mode="screen"
            result="aberrated"
          />
          <feComposite
            in="aberrated"
            in2="SourceGraphic"
            operator="arithmetic"
            k1={0}
            k2={mixRatio}
            k3={1 - mixRatio}
            k4={0}
          />
        </filter>
      </FilterDefs>
      <Overlay style={{ '--chromatic-filter': `url(#${filterId})` }} />
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: var(--chromatic-filter);
  pointer-events: none;
`;

const FilterDefs = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

export default ChromaticAberration;
