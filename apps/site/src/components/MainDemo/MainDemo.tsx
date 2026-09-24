import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES, SPRITE_DATA, type SoundName } from 'button-sounds';
import { useImperativeButtonSounds } from 'button-sounds/react';

import { random, sampleIndex } from '@/utils';
import FancyButton from '@/components/FancyButton/FancyButton';
import SampleSelector from '@/components/SampleSelector';
import Screw from '@/components/Screw';

import { getSampleIds, pickSampleIndex } from './MainDemo.helpers';
import SoundSelectSidebar from './SoundSelectSidebar';
import ExtraParams from './ExtraParams';
import InfoTable from './InfoTable';
import { useSoundResourceLoading } from './useSoundResourceLoading';

function MainDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [selectedSoundName, setSelectedSoundName] = React.useState<
    string | undefined
  >(SOUND_NAMES[0]);
  const [lastDownIndex, setLastDownIndex] = React.useState<
    number | undefined
  >();
  const [lastUpIndex, setLastUpIndex] = React.useState<number | undefined>();
  const [selectedDownIndex, setSelectedDownIndex] = React.useState<
    number | undefined
  >();
  const [selectedUpIndex, setSelectedUpIndex] = React.useState<
    number | undefined
  >();
  const [usingLofi, setUsingLofi] = React.useState(false);
  const [pitchVariation, setPitchVariation] = React.useState(0.2);

  const name = (selectedSoundName ?? SOUND_NAMES[0]) as SoundName;
  const { press, release } = useImperativeButtonSounds(name, {
    lofi: usingLofi,
    lofiOptions: { bits: 4, downsample: 0.1 },
  });
  const loadingStatus = useSoundResourceLoading(name);

  React.useEffect(() => {
    setLastDownIndex(undefined);
    setLastUpIndex(undefined);
  }, [name]);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedSoundName((currentVal: any) => {
          if (!currentVal) {
            return SOUND_NAMES[0];
          }
          const newVal = SOUND_NAMES[SOUND_NAMES.indexOf(currentVal) - 1];
          return newVal ? newVal : SOUND_NAMES[SOUND_NAMES.length - 1];
        });
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedSoundName((currentVal: any) => {
          if (!currentVal) {
            return SOUND_NAMES[0];
          }
          const newVal = SOUND_NAMES[SOUND_NAMES.indexOf(currentVal) + 1];
          return newVal ? newVal : SOUND_NAMES[0];
        });
      }
    }
    wrapper.addEventListener('keydown', handleKeyDown);
    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSoundName]);

  React.useEffect(() => {
    const btn = buttonRef.current;

    if (!btn) {
      return;
    }

    function handlePointerDown() {
      let index = selectedDownIndex;
      if (typeof index !== 'number') {
        index = sampleIndex(getSampleIds(name, 'down')) || 0;
      }

      const playbackRate =
        1 + random(-pitchVariation, pitchVariation, { rounded: false });

      press({ sampleIndex: index, playbackRate });

      setLastDownIndex(index);

      function handlePointerUp() {
        let index = selectedUpIndex;
        if (typeof index !== 'number') {
          index = sampleIndex(getSampleIds(name, 'up')) || 0;
        }

        const playbackRate =
          1 + random(-pitchVariation, pitchVariation, { rounded: false });

        release({ sampleIndex: index, playbackRate });

        setLastUpIndex(index);
        setLastDownIndex(undefined);
        window.setTimeout(() => {
          setLastUpIndex(undefined);
        }, 260);
      }

      window.addEventListener('pointerup', handlePointerUp, { once: true });
    }

    btn.addEventListener('pointerdown', handlePointerDown);

    return () => {
      btn.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [name, selectedDownIndex, selectedUpIndex, pitchVariation]);

  return (
    <Border>
      <Wrapper ref={wrapperRef}>
        <SoundSelectSidebar
          selectedSoundName={selectedSoundName}
          setSelectedSoundName={setSelectedSoundName}
        />
        <Main>
          <Title>Sound Playground</Title>

          <ButtonArea>
            <FancyButton ref={buttonRef} />
            {loadingStatus === 'loading' && (
              <LoadingLabel>Loading</LoadingLabel>
            )}
          </ButtonArea>

          <InfoTable name={name} />
        </Main>
        <ConfigSidebar>
          <SampleSelector
            label="Press Sample"
            numOfSamples={getSampleIds(name, 'down').length}
            selectedSampleIndex={selectedDownIndex}
            lastPlayedSampleIndex={lastDownIndex}
            onSelectSampleManually={setSelectedDownIndex}
          />
          <SampleSelector
            label="Release Sample"
            numOfSamples={getSampleIds(name, 'up').length}
            selectedSampleIndex={selectedUpIndex}
            lastPlayedSampleIndex={lastUpIndex}
            onSelectSampleManually={setSelectedUpIndex}
          />
          <ExtraParams
            usingLofi={usingLofi}
            setUsingLofi={setUsingLofi}
            pitchVariation={pitchVariation}
            setPitchVariation={setPitchVariation}
          />
        </ConfigSidebar>
      </Wrapper>
      <TLScrew />
      <TRScrew />
      <BLScrew />
      <BRScrew />
    </Border>
  );
}

const Border = styled.div`
  --main-border-width: 4px;
  position: relative;
  background: var(--color-gray-800);
  padding: var(--main-border-width);
  border-radius: 6px;
  --sc: hsl(from var(--color-background) h s l / 0.125);
  box-shadow:
    0px 1px 2px var(--sc),
    0px 4px 8px var(--sc),
    0px 8px 16px var(--sc),
    0px 16px 32px var(--sc);

  @supports (corner-shape: squircle) {
    border-radius: 10px;
    corner-shape: squircle;
  }
`;
const Wrapper = styled.div`
  --container-padding: 6px;
  display: flex;
  background: var(--color-gray-75);
  padding: var(--container-padding);
  border-radius: 18px;
  corner-shape: bevel;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  padding-top: 0;

  p {
    text-align: center;
  }
`;

const Title = styled.h3`
  --main-border-adjustment: calc(var(--main-border-width) / 2);
  --height: 3rem;
  --bw: 5px;
  --hh: calc(var(--height) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--height);
  margin-inline: auto;
  margin-top: calc(var(--container-padding) * -1);
  padding-inline: 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: black;
  background: var(--color-gray-800);
  transform: translateY(-50%);
  border-bottom: 5px solid black;
  corner-shape: bevel;
  /*
    Ok this is pretty complicated.
  */
  --nr: calc(var(--hh) - 4.5px);
  --bottom-radius: calc(var(--nr) + 5px);
  border-radius: var(--nr) var(--nr) var(--nr) var(--nr) / var(--nr) var(--nr)
    var(--hh) var(--hh);
`;

const ButtonArea = styled.div`
  align-self: center;
  position: relative;
`;

const LoadingLabel = styled.p`
  position: absolute;
  left: calc(100% + 1rem);
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  white-space: nowrap;
`;

const ConfigSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledScrew = styled(Screw)`
  position: absolute;

  @supports not (corner-shape: bevel) {
    display: none;
  }
`;

const TLScrew = styled(StyledScrew)`
  top: 2.5px;
  left: 2.5px;
`;
const TRScrew = styled(StyledScrew)`
  top: 2.5px;
  right: 2.5px;
`;
const BLScrew = styled(StyledScrew)`
  bottom: 2.5px;
  left: 2.5px;
`;
const BRScrew = styled(StyledScrew)`
  bottom: 2.5px;
  right: 2.5px;
`;

export default MainDemo;
