import * as React from 'react';
import styled from 'styled-components';

import Slider from '@/components/Slider';

import RaisedContainer from '../RaisedContainer/RaisedContainer';

interface Props {
  usingLofi: boolean;
  setUsingLofi: React.Dispatch<React.SetStateAction<boolean>>;
  pitchVariation: number;
  setPitchVariation: React.Dispatch<React.SetStateAction<number>>;
}

function ExtraParams({ pitchVariation, setPitchVariation }: Props) {
  return (
    <Wrapper title="Config">
      <Slot>
        <Slider
          label="Pitch variation"
          value={pitchVariation}
          setValue={setPitchVariation}
          min={0}
          max={0.5}
          step={0.05}
        />
      </Slot>
    </Wrapper>
  );
}

const Wrapper = styled(RaisedContainer)``;

const Slot = styled.div`
  padding: 16px 12px;
`;

export default ExtraParams;
