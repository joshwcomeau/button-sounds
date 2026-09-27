import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES, SPRITE_DATA, type SoundName } from 'button-sounds';
import { useImperativeButtonSounds } from 'button-sounds/react';

import useSyncedRef from '@/hooks/use-synced-ref';
import { SOUND_DATA } from '@/data';
import { random, sampleIndex } from '@/utils';

import FancyButton from '@/components/FancyButton/FancyButton';
import SampleSelector from '@/components/SampleSelector';
import Screw from '@/components/Screw';
import Spinner from '@/components/Spinner/Spinner';

import { getSampleIds } from './MainDemo.helpers';
import SoundSelectSidebar from './SoundSelectSidebar';
import ExtraParams from './ExtraParams';
import SoundInfo from './SoundInfo';
import { useSoundResourceLoading } from './useSoundResourceLoading';

function MainDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [selectedSoundName, setSelectedSoundName] = React.useState<
    string | undefined
  >(SOUND_NAMES[0]);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    null,
  );
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

  const relevantSounds = React.useMemo(() => {
    if (!selectedFilter) {
      return SOUND_NAMES;
    }
    return SOUND_NAMES.filter((name) => {
      return SOUND_DATA[name].category === selectedFilter;
    });
  }, [selectedFilter]);

  const handleFilterClick = React.useCallback(
    (newFilter: string) => {
      if (newFilter === selectedFilter) {
        setSelectedFilter(null);
        return;
      }
      const nextRelevantSounds = SOUND_NAMES.filter((name) => {
        return SOUND_DATA[name].category === newFilter;
      });

      // If the currently-selected sound is not part of the newly filtered group, select the first sound in that group
      const isCurrentSoundInGroup = nextRelevantSounds.some(
        (soundName) => soundName === selectedSoundName,
      );
      if (!isCurrentSoundInGroup) {
        setSelectedSoundName(nextRelevantSounds[0]);
      }
      setSelectedFilter(newFilter);
    },
    [selectedSoundName, selectedFilter],
  );

  const selectedSoundNameRef = useSyncedRef(selectedSoundName);

  const name = (selectedSoundName ?? SOUND_NAMES[0]) as SoundName;
  const { press, release } = useImperativeButtonSounds(name, {
    lofi: usingLofi,
    lofiOptions: { bits: 4, downsample: 0.15 },
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
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        return;
      }

      const selectedSoundName =
        selectedSoundNameRef.current || relevantSounds[0];

      event.preventDefault();

      const direction = event.key === 'ArrowUp' ? -1 : 1;
      const currentIndex = relevantSounds.indexOf(
        selectedSoundName as SoundName,
      );
      // JS remainder keeps the sign of the dividend, so stepping backward from 0 would otherwise land on -1.
      const nextIndex =
        (currentIndex + direction + relevantSounds.length) %
        relevantSounds.length;
      const nextSoundName = relevantSounds[nextIndex];

      const btn = document.querySelector<HTMLButtonElement>(
        `[data-button-id="${nextSoundName}"]`,
      );

      btn?.focus?.();

      setSelectedSoundName(nextSoundName);
    }

    wrapper.addEventListener('keydown', handleKeyDown);
    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
    };
  }, [relevantSounds, selectedSoundNameRef]);

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
          relevantSounds={relevantSounds}
          selectedFilter={selectedFilter}
          handleFilterClick={handleFilterClick}
        />
        <Main>
          <Title>Sound Playground</Title>

          <ButtonArea>
            <ButtonWrapper>
              <FancyButton
                disabled={loadingStatus === 'loading'}
                ref={buttonRef}
              />
            </ButtonWrapper>
            {loadingStatus === 'loading' && <StyledSpinner />}
          </ButtonArea>

          <SoundInfo name={name} />
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
`;

const Title = styled.h3`
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
    I want to create a fake shadow using a bottom border; it looks better than real box-shadow since it follows the taper of the beveled edge nicely. The problem is that this nameplate overlaps the pseudo-border created by Border, and the black shadow shouldn't show over that edge.
    First, we create "Adjusted Radius", --ar, which is 50% of the element's height minus 4.5px. This WOULD produce a 9px flat vertical edge on the left/right.
    But then, we use the long-form border-radius syntax to change the angle of the bottom bevels. By using 50% of the height (--hh, unadjusted), we both shift the angle so that it still feels like a 90-degree bevel (ignoring the border sliver), and it also causes the plateau to become smaller and higher.
    Note that otherwise, this element would be 2px too low, since the 'transform: translateY(-50%)' above doesn't adjust to overlap Border's pseudo-border.
  */
  --ar: calc(var(--hh) - 4.5px);
  /* prettier-ignore */
  border-radius:
    var(--ar) var(--ar) var(--ar) var(--ar) /
    var(--ar) var(--ar) var(--hh) var(--hh);
`;

const ButtonArea = styled.div`
  align-self: center;
  position: relative;
  padding-bottom: 32px;
`;

const ButtonWrapper = styled.div`
  position: relative;
  --stripe-width: 24px;
  --grad: repeating-linear-gradient(
    45deg,
    transparent 0px var(--stripe-width),
    var(--color-gray-200) var(--stripe-width) calc(var(--stripe-width) * 2)
  );
  padding: 64px;
  /* border: 1px solid var(--color-gray-250); */
  outline: 2px solid var(--color-gray-250);
  outline-offset: 2px;
  border-radius: 40px;
  corner-shape: bevel;
  background: var(--grad);

  &::before {
    content: '';
    position: absolute;
    inset: 32px;
    background: var(--color-gray-75);
    border-radius: 24px;
    corner-shape: bevel;
  }
`;

const StyledSpinner = styled(Spinner)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin-inline: auto;
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
