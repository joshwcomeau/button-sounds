import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES, type SoundName } from 'button-sounds';
import { useImperativeButtonSounds } from 'button-sounds/react';

import useSyncedRef from '@/hooks/use-synced-ref';
import { SOUND_DATA } from '@/data';
import { random, sampleIndex } from '@/utils';

import FancyButton from '@/components/FancyButton/FancyButton';
import SampleSelector from '@/components/SampleSelector';
import Screw from '@/components/Screw';
import Spinner from '@/components/Spinner/Spinner';
import { useSoundSettings } from '@/components/SoundSettingsProvider';

import { getSampleIds } from './MainDemo.helpers';
import SoundSelectSidebar from './SoundSelectSidebar';
import ExtraParams from './ExtraParams';
import SoundInfo from './SoundInfo';
import { useSoundResourceLoading } from './useSoundResourceLoading';

function MainDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [selectedSoundName, setSelectedSoundName] = React.useState<SoundName>(
    SOUND_NAMES[0] || 'hi75-soft',
  );
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
  const { usingLofi, pitchVariation } = useSoundSettings();

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
        setSelectedSoundName(nextRelevantSounds[0] as SoundName);
      }
      setSelectedFilter(newFilter);
    },
    [selectedSoundName, selectedFilter],
  );

  const selectedSoundNameRef = useSyncedRef(selectedSoundName);

  const { press, release } = useImperativeButtonSounds(selectedSoundName, {
    lofi: usingLofi,
    lofiOptions: { bits: 4, downsample: 0.15 },
  });
  const loadingStatus = useSoundResourceLoading(selectedSoundName);

  const handleIncrementSound = React.useCallback(() => {
    const currentIndex = relevantSounds.indexOf(selectedSoundName);
    const nextIndex =
      (currentIndex - 1 + relevantSounds.length) % relevantSounds.length;
    setSelectedSoundName(relevantSounds[nextIndex] as SoundName);

    // Ensure the button is visible within its scroll container
    const button = document.querySelector<HTMLButtonElement>(
      `[data-button-id="${relevantSounds[nextIndex]}"]`,
    );
    button?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [relevantSounds, selectedSoundName]);

  const handleDecrementSound = React.useCallback(() => {
    const currentIndex = relevantSounds.indexOf(selectedSoundName);
    const nextIndex = (currentIndex + 1) % relevantSounds.length;
    setSelectedSoundName(relevantSounds[nextIndex] as SoundName);
    const button = document.querySelector<HTMLButtonElement>(
      `[data-button-id="${relevantSounds[nextIndex]}"]`,
    );
    button?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [relevantSounds, selectedSoundName]);

  React.useEffect(() => {
    setLastDownIndex(undefined);
    setLastUpIndex(undefined);
  }, [selectedSoundName]);

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

    function playPress() {
      let index = selectedDownIndex;
      if (typeof index !== 'number') {
        index = sampleIndex(getSampleIds(selectedSoundName, 'down')) || 0;
      }

      const playbackRate =
        1 + random(-pitchVariation, pitchVariation, { rounded: false });

      press({ sampleIndex: index, playbackRate });

      setLastDownIndex(index);
    }

    function playRelease() {
      let index = selectedUpIndex;
      if (typeof index !== 'number') {
        index = sampleIndex(getSampleIds(selectedSoundName, 'up')) || 0;
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

    function handlePointerDown() {
      playPress();

      function handlePointerUp() {
        playRelease();
      }

      window.addEventListener('pointerup', handlePointerUp, { once: true });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      // Holding Enter or Space repeats keydown. The press sound should only play for the initial press.
      if (event.repeat) {
        return;
      }

      playPress();

      function handleKeyUp(upEvent: KeyboardEvent) {
        if (upEvent.key !== event.key) {
          return;
        }

        playRelease();
        window.removeEventListener('keyup', handleKeyUp);
      }

      window.addEventListener('keyup', handleKeyUp);
    }

    btn.addEventListener('pointerdown', handlePointerDown);
    btn.addEventListener('keydown', handleKeyDown);

    return () => {
      btn.removeEventListener('pointerdown', handlePointerDown);
      btn.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSoundName, selectedDownIndex, selectedUpIndex, pitchVariation]);

  return (
    <Border>
      <Wrapper ref={wrapperRef}>
        <Title>Sound Playground</Title>
        <StyledSoundSelectSidebar
          selectedSoundName={selectedSoundName}
          setSelectedSoundName={setSelectedSoundName}
          relevantSounds={relevantSounds}
          selectedFilter={selectedFilter}
          handleFilterClick={handleFilterClick}
          handleIncrementSound={handleIncrementSound}
          handleDecrementSound={handleDecrementSound}
        />
        <ButtonArea>
          <ButtonWrapper>
            <FancyButton
              disabled={loadingStatus === 'loading'}
              ref={buttonRef}
            />
          </ButtonWrapper>
          {loadingStatus === 'loading' && <StyledSpinner />}
        </ButtonArea>

        <StyledSoundInfo name={selectedSoundName} />

        <ConfigSidebar>
          <ConfigGrid>
            <SampleSelector
              label="Press Sample"
              numOfSamples={getSampleIds(selectedSoundName, 'down').length}
              selectedSampleIndex={selectedDownIndex}
              lastPlayedSampleIndex={lastDownIndex}
              onSelectSampleManually={setSelectedDownIndex}
              style={{ gridArea: 'press-sample' }}
            />
            <SampleSelector
              label="Release Sample"
              numOfSamples={getSampleIds(selectedSoundName, 'up').length}
              selectedSampleIndex={selectedUpIndex}
              lastPlayedSampleIndex={lastUpIndex}
              onSelectSampleManually={setSelectedUpIndex}
              style={{ gridArea: 'release-sample' }}
            />
            <ExtraParams style={{ gridArea: 'extra-params' }} />
          </ConfigGrid>
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
  display: grid;
  grid-template-columns: 14rem 1fr 14rem;
  grid-template-areas:
    'sound-sidebar button config-sidebar'
    'sound-sidebar sound-info config-sidebar';
  gap: 1rem;
  background: var(--color-gray-75);
  padding: var(--container-padding);
  border-radius: 18px;
  corner-shape: bevel;
  isolation: isolate;

  @media (max-width: 55rem) {
    grid-template-columns: 10fr 15fr;
    grid-template-areas:
      'sound-sidebar button'
      'sound-sidebar sound-info'
      'config-sidebar config-sidebar';
  }

  @media (max-width: 42rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'button'
      'sound-info'
      'sound-sidebar'
      'config-sidebar';
  }
`;

const Title = styled.h3`
  --height: 3rem;
  --bw: 5px;
  --hh: calc(var(--height) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
  top: calc(var(--hh) * -1 + 4px);
  left: 0;
  right: 0;
  width: fit-content;
  height: var(--height);
  margin-inline: auto;
  padding-inline: 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: black;
  background: var(--color-gray-800);
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

  /* On smaller screens, the center-aligned title overlaps the SoundSelectSidebar in a pretty unpleasant way, so let's lift it up totally above the border. */
  @media (max-width: 55rem) {
    border-radius: var(--hh) var(--hh) 0 0;
    top: calc(var(--height) * -1);
    border-bottom: none;
  }
`;

const StyledSoundSelectSidebar = styled(SoundSelectSidebar)`
  grid-area: sound-sidebar;
`;

const ButtonArea = styled.div`
  grid-area: button;
  justify-self: center;
  margin-top: 3rem;
  position: relative;
`;

const ButtonWrapper = styled.div`
  --pad: 64px;
  position: relative;
  --stripe-width: 24px;
  --grad: repeating-linear-gradient(
    45deg,
    transparent 0px var(--stripe-width),
    var(--color-gray-200) var(--stripe-width) calc(var(--stripe-width) * 2)
  );
  padding: var(--pad);
  /* border: 1px solid var(--color-gray-250); */
  outline: 2px solid var(--color-gray-250);
  outline-offset: 2px;
  border-radius: calc(var(--pad) / 4);
  corner-shape: bevel;
  background: var(--grad);

  &::before {
    content: '';
    position: absolute;
    inset: calc(var(--pad) / 2);
    background: var(--color-gray-75);
    border-radius: 24px;
    corner-shape: bevel;
  }

  @media (max-width: 29rem) {
    --pad: 12vw;
  }
  @media (max-width: 25rem) {
    --pad: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const StyledSpinner = styled(Spinner)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin-inline: auto;
`;

const StyledSoundInfo = styled(SoundInfo)`
  grid-area: sound-info;
`;

const ConfigSidebar = styled.div`
  grid-area: config-sidebar;
  container-type: inline-size;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'press-sample'
    'release-sample'
    'extra-params';
  gap: 1rem;

  @container (min-width: 30rem) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'press-sample release-sample'
      'extra-params extra-params';
  }
  @container (min-width: 39rem) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'press-sample release-sample extra-params';
  }
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
