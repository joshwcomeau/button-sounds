import * as React from 'react';
import styled from 'styled-components';
import { useImperativeButtonSounds } from 'button-sounds/react';

import Slider from '@/components/Slider';
import Toggle from '@/components/Toggle';
import InfoTooltip from '@/components/InfoTooltip';

import RaisedContainer from '../RaisedContainer/RaisedContainer';

interface Props {
  usingLofi: boolean;
  setUsingLofi: React.Dispatch<React.SetStateAction<boolean>>;
  pitchVariation: number;
  setPitchVariation: React.Dispatch<React.SetStateAction<number>>;
}

function ExtraParams({
  usingLofi,
  setUsingLofi,
  pitchVariation,
  setPitchVariation,
}: Props) {
  const { press: handlePressLofi, release: handleReleaseLofi } =
    useImperativeButtonSounds(usingLofi ? 'synth-off' : 'synth-on', {
      lofi: usingLofi,
    });
  return (
    <Wrapper title="Config">
      <Slot>
        <Slider
          label={
            <InfoTooltip
              content={
                pitchVariation > 0 ? (
                  <p>
                    A common trick in game dev is to slightly adjust the
                    playback speed of a sound each time it’s triggered. The
                    current value ensures that the speed will fluctuate between{' '}
                    {1 - pitchVariation} and {1 + pitchVariation}.
                  </p>
                ) : (
                  <p>
                    A common trick in game dev is to slightly adjust the
                    playback speed of a sound each time it’s triggered, to make
                    it sound less repetitive. Drag this slider to the right to
                    enable this effect.
                  </p>
                )
              }
            >
              Random Pitch
            </InfoTooltip>
          }
          value={pitchVariation}
          setValue={setPitchVariation}
          min={0}
          max={0.5}
          step={0.05}
        />
      </Slot>
      <Slot>
        <Toggle
          label={
            <InfoTooltip
              content={
                <p>
                  This parameter reduces the bit rate and sample rate of the
                  sound, giving it a bit of NES crunch. The full library
                  provides fine-grained control over both settings.
                </p>
              }
            >
              Lofi
            </InfoTooltip>
          }
          checked={usingLofi}
          setChecked={setUsingLofi}
          onPointerDown={handlePressLofi}
          onPointerUp={handleReleaseLofi}
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
