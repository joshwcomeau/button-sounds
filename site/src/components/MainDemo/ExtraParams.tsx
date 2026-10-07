import styled from 'styled-components';

import LabeledSlider from '@/components/LabeledSlider';
import Toggle from '@/components/Toggle';
import InfoTooltip from '@/components/InfoTooltip';
import { useSoundSettings } from '@/components/SoundSettingsProvider';

import RaisedContainer from '../RaisedContainer/RaisedContainer';

function ExtraParams(props: React.HTMLAttributes<HTMLDivElement>) {
  const { usingLofi, setUsingLofi, pitchVariation, setPitchVariation } =
    useSoundSettings();

  return (
    <Wrapper title="Config" {...props}>
      <Slot>
        <LabeledSlider
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
                    playback speed of a sound each time it’s triggered so that
                    it isn’t too monotonous. Drag this slider to the right to
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
          max={0.4}
          step={0.02}
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
