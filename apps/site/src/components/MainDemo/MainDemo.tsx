import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES, SPRITE_DATA, type SoundName } from 'button-sounds';
import { useImperativeButtonSounds } from 'button-sounds/react';

import { SOUND_DATA } from '@/data';
import FancyButton from '@/components/FancyButton/FancyButton';
import SampleSelector from '@/components/SampleSelector';

import Sidebar from './Sidebar';
import { useSoundResourceLoading } from './useSoundResourceLoading';

function getSampleIds(name: SoundName, prefix: 'down' | 'up'): string[] {
  const spriteMap = SPRITE_DATA[name];
  if (!spriteMap) {
    return [];
  }

  return Object.keys(spriteMap)
    .filter((id) => id.startsWith(prefix))
    .sort(
      (a, b) =>
        Number(a.match(/\d+$/)?.[0] ?? 0) - Number(b.match(/\d+$/)?.[0] ?? 0),
    );
}

function pickSampleIndex(ids: string[]): number | undefined {
  if (ids.length === 0) {
    return undefined;
  }
  return Math.floor(Math.random() * ids.length);
}

function MainDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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

  const name = (selectedSoundName ?? SOUND_NAMES[0]) as SoundName;
  const { press, release } = useImperativeButtonSounds(name);
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
          console.log(currentVal, SOUND_NAMES.indexOf(currentVal));
          return newVal ? newVal : SOUND_NAMES[0];
        });
      }
    }
    wrapper.addEventListener('keydown', handleKeyDown);
    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSoundName]);

  const soundData = SOUND_DATA[name];

  return (
    <Border>
      <Wrapper ref={wrapperRef}>
        <Sidebar
          selectedSoundName={selectedSoundName}
          setSelectedSoundName={setSelectedSoundName}
        />
        <Main>
          <Title>{soundData?.title}</Title>

          <ButtonArea>
            <FancyButton
              onPointerDown={() => {
                const index = pickSampleIndex(getSampleIds(name, 'down'));
                if (index == null) {
                  return;
                }
                setLastDownIndex(index);
                press({ sampleIndex: index });
              }}
              onPointerUp={() => {
                const index = pickSampleIndex(getSampleIds(name, 'up'));
                if (index == null) {
                  return;
                }
                setLastUpIndex(index);
                release({ sampleIndex: index });
              }}
            />
            {loadingStatus === 'loading' && (
              <LoadingLabel>Loading</LoadingLabel>
            )}
          </ButtonArea>

          {soundData?.description}

          <SampleReadout>
            <SampleSelector
              label="Press #"
              numOfSamples={getSampleIds(name, 'down').length}
              selectedSampleIndex={selectedDownIndex}
              lastPlayedSampleIndex={lastDownIndex}
              onSelectSampleManually={setSelectedDownIndex}
            />
            <SampleSelector
              label="Release #"
              numOfSamples={getSampleIds(name, 'up').length}
              selectedSampleIndex={selectedUpIndex}
              lastPlayedSampleIndex={lastUpIndex}
              onSelectSampleManually={setSelectedUpIndex}
            />
          </SampleReadout>
        </Main>
      </Wrapper>
    </Border>
  );
}

const Border = styled.div`
  background: var(--color-gray-800);
  padding: 2px;
  border-radius: 4px;
`;
const Wrapper = styled.div`
  display: flex;
  background: var(--color-gray-75);
  padding: 6px;
  border-radius: 16px;
  corner-shape: bevel;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  p {
    text-align: center;
  }
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
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

const SampleReadout = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 0;
`;

export default MainDemo;
