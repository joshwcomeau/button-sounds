import * as React from 'react';
import styled from 'styled-components';
import { SOUND_NAMES, type SoundName } from 'button-sounds';
import { useImperativeButtonSounds } from 'button-sounds/react';

import useSyncedRef from '@/hooks/use-synced-ref';
import { SOUND_DATA } from '@/data';
import { random, sampleIndex, seededShuffle } from '@/utils';

import FancyButton, { type Action } from '@/components/FancyButton/FancyButton';
import PatternDither from '@/components/BackgroundPatterns/PatternDither';
import SampleSelector from '@/components/SampleSelector';
import Screw from '@/components/Screw';
import Spinner from '@/components/Spinner/Spinner';
import CodedLights from '@/components/CodedLights/CodedLights';
import { useSoundSettings } from '@/components/SoundSettingsProvider';

import { getSampleIds } from './MainDemo.helpers';
import SoundSelectSidebar from './SoundSelectSidebar';
import ExtraParams from './ExtraParams';
import SoundInfo from './SoundInfo';
import Explanation from './Explanation';
import { useSoundResourceLoading } from './useSoundResourceLoading';

import type { SortOrder } from './MainDemo.helpers';

// Three.js is hefty, so we only fetch it once someone starts playing the minigame.
const loadCelebratoryShader = () => import('@/components/CelebratoryShader');
const CelebratoryShader = React.lazy(loadCelebratoryShader);

function orderSounds(
  sounds: readonly SoundName[],
  sortOrder: SortOrder,
  shuffleKey: number,
) {
  if (sortOrder === 'alphabetical') {
    return [...sounds].sort((a, b) => a.localeCompare(b));
  }

  if (sortOrder === 'shuffle') {
    const included = new Set(sounds);
    return seededShuffle(SOUND_NAMES, shuffleKey).filter((name) =>
      included.has(name),
    );
  }

  const defaultIndex = new Map(SOUND_NAMES.map((name, index) => [name, index]));
  return [...sounds].sort(
    (a, b) => (defaultIndex.get(a) ?? 0) - (defaultIndex.get(b) ?? 0),
  );
}

function MainDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [selectedSoundName, setSelectedSoundName] = React.useState<SoundName>(
    SOUND_NAMES[0] || 'hi75-soft',
  );
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    null,
  );
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('default');
  const [shuffleKey, setShuffleKey] = React.useState(() =>
    Math.floor(Math.random() * 100000),
  );
  const [relevantSounds, setRelevantSounds] = React.useState<SoundName[]>(
    () => [...SOUND_NAMES],
  );

  const [buttonAction, setButtonAction] = React.useState<Action | null>(null);
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
  const [hasWonMinigame, setHasWonMinigame] = React.useState(false);
  const [isCelebrating, setIsCelebrating] = React.useState(false);
  // Bumped on restore, and used as the CodedLights key, so that the minigame remounts fresh and can be won again.
  const [minigameRound, setMinigameRound] = React.useState(0);
  const { usingLofi, pitchVariation } = useSoundSettings();

  const hasWonMinigameRef = useSyncedRef(hasWonMinigame);
  const wasShowingPrizeRef = React.useRef(false);

  const handleRestore = React.useCallback(() => {
    setHasWonMinigame(false);
    setIsCelebrating(false);
    setMinigameRound((currentRound) => currentRound + 1);
  }, []);

  const handleCelebrationComplete = React.useCallback(() => {
    setIsCelebrating(false);
  }, []);

  React.useEffect(() => {
    if (hasWonMinigame) {
      wasShowingPrizeRef.current = true;
      return;
    }

    // The restore button is about to unmount, so hand focus back to the big button rather than letting it fall to <body>.
    if (wasShowingPrizeRef.current) {
      wasShowingPrizeRef.current = false;
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [hasWonMinigame]);

  const handleFilterClick = React.useCallback(
    (newFilter: string) => {
      const nextFilter = newFilter === selectedFilter ? null : newFilter;
      setSelectedFilter(nextFilter);

      setRelevantSounds((currentSounds) => {
        // Filter the current list so an active sort stays put. If that list is already another category, it won’t contain the sounds we need, so start from the full catalog and apply the current sort.
        const canFilterCurrentList =
          nextFilter !== null &&
          (selectedFilter === null ||
            currentSounds.some(
              (name) => SOUND_DATA[name].category === nextFilter,
            ));

        if (canFilterCurrentList) {
          return currentSounds.filter(
            (name) => SOUND_DATA[name].category === nextFilter,
          );
        }

        return orderSounds(
          nextFilter
            ? SOUND_NAMES.filter(
                (name) => SOUND_DATA[name].category === nextFilter,
              )
            : SOUND_NAMES,
          sortOrder,
          shuffleKey,
        );
      });
    },
    [selectedFilter, sortOrder, shuffleKey],
  );

  const handleSortOrderClick = React.useCallback(
    (nextSortOrder: SortOrder) => {
      const nextShuffleKey =
        nextSortOrder === 'shuffle'
          ? Math.floor(Math.random() * 100000)
          : shuffleKey;

      if (nextSortOrder === 'shuffle') {
        setShuffleKey(nextShuffleKey);
      }

      setSortOrder(nextSortOrder);
      setRelevantSounds((currentSounds) => {
        return orderSounds(currentSounds, nextSortOrder, nextShuffleKey);
      });
    },
    [shuffleKey],
  );

  React.useEffect(() => {
    const firstSound = relevantSounds[0];
    if (firstSound) {
      setSelectedSoundName(firstSound);
    }
  }, [relevantSounds]);

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
      console.log(event.key);
      if (
        event.key !== 'ArrowUp' &&
        event.key !== 'ArrowDown' &&
        event.key !== 'w' &&
        event.key !== 's'
      ) {
        return;
      }

      // The sound list is hidden while the prize is showing.
      if (hasWonMinigameRef.current) {
        return;
      }

      const selectedSoundName =
        selectedSoundNameRef.current || relevantSounds[0];

      event.preventDefault();

      const direction = event.key === 'ArrowUp' || event.key === 'w' ? -1 : 1;
      const currentIndex = relevantSounds.indexOf(
        selectedSoundName as SoundName,
      );
      // JS remainder keeps the sign of the dividend, so stepping backward from 0 would otherwise land on -1.
      const nextIndex =
        (currentIndex + direction + relevantSounds.length) %
        relevantSounds.length;
      const nextSoundName = relevantSounds[nextIndex];

      if (!nextSoundName) {
        // Should be impossible
        return;
      }

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
  }, [relevantSounds, selectedSoundNameRef, hasWonMinigameRef]);

  const triggerPress = React.useCallback(() => {
    let index = selectedDownIndex;
    if (typeof index !== 'number') {
      index = sampleIndex(getSampleIds(selectedSoundName, 'down')) || 0;
    }

    const playbackRate =
      1 + random(-pitchVariation, pitchVariation, { rounded: false });

    press({ sampleIndex: index, playbackRate });

    setLastDownIndex(index);
    setButtonAction('pressing');
  }, [selectedDownIndex, selectedSoundName, pitchVariation, press]);

  const triggerRelease = React.useCallback(() => {
    let index = selectedUpIndex;
    if (typeof index !== 'number') {
      index = sampleIndex(getSampleIds(selectedSoundName, 'up')) || 0;
    }

    const playbackRate =
      1 + random(-pitchVariation, pitchVariation, { rounded: false });

    release({ sampleIndex: index, playbackRate });

    setLastUpIndex(index);
    setLastDownIndex(undefined);
    setButtonAction('releasing');
    window.setTimeout(() => {
      setLastUpIndex(undefined);
    }, 260);
  }, [selectedUpIndex, selectedSoundName, pitchVariation, release]);

  React.useEffect(() => {
    const btn = buttonRef.current;

    if (!btn) {
      return;
    }

    function handlePointerDown() {
      triggerPress();

      function handlePointerUp() {
        triggerRelease();
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

      triggerPress();

      function handleKeyUp(upEvent: KeyboardEvent) {
        if (upEvent.key !== event.key) {
          return;
        }

        triggerRelease();
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
  }, [triggerPress, triggerRelease]);

  return (
    <Container ref={wrapperRef}>
      <TitleOutline aria-hidden="true">Sound Playground</TitleOutline>
      <Border>
        <Wrapper data-has-won-minigame={hasWonMinigame}>
          <StyledBackgroundPattern patternId="c" />

          <Title>Sound Playground</Title>
          <StyledSoundSelectSidebar
            inert={hasWonMinigame}
            selectedSoundName={selectedSoundName}
            setSelectedSoundName={setSelectedSoundName}
            relevantSounds={relevantSounds}
            selectedFilter={selectedFilter}
            sortOrder={sortOrder}
            triggerPress={triggerPress}
            triggerRelease={triggerRelease}
            handleSortOrderClick={handleSortOrderClick}
            handleFilterClick={handleFilterClick}
            handleIncrementSound={handleIncrementSound}
            handleDecrementSound={handleDecrementSound}
          />
          <ButtonArea>
            <ButtonWrapper>
              <FancyButton
                // While retracted, the mascot lives inside the button, so we don't want it faded by the disabled styles.
                disabled={loadingStatus === 'loading' && !hasWonMinigame}
                ref={buttonRef}
                buttonAction={buttonAction}
                setButtonAction={setButtonAction}
                isRetracted={hasWonMinigame}
              />
            </ButtonWrapper>
            {loadingStatus === 'loading' && !hasWonMinigame && (
              <StyledSpinner />
            )}
          </ButtonArea>

          <StyledSoundInfo
            name={selectedSoundName}
            hasWonMinigame={hasWonMinigame}
            onRestore={handleRestore}
          >
            <CodedLights
              key={minigameRound}
              hasWon={hasWonMinigame}
              onComplete={() => {
                setHasWonMinigame(true);
                setIsCelebrating(true);
              }}
              onInteract={loadCelebratoryShader}
            />
          </StyledSoundInfo>

          {isCelebrating && (
            <React.Suspense fallback={null}>
              <CelebratoryShader
                key={minigameRound}
                onComplete={handleCelebrationComplete}
              />
            </React.Suspense>
          )}

          <ConfigSidebar inert={hasWonMinigame}>
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
      <Explanation isVisible={!hasWonMinigame} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Border = styled.div`
  --main-border-width: 4px;
  position: relative;
  background: var(--color-gray-800);
  padding: var(--main-border-width);
  border-radius: 4px;
  corner-shape: bevel;
  --sc: hsl(from var(--color-background) h s l / 0.125);
  box-shadow:
    0px 1px 2px var(--sc),
    0px 4px 8px var(--sc),
    0px 8px 16px var(--sc),
    0px 16px 32px var(--sc);
  outline: 3px solid var(--color-background);
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
  reading-flow: grid-rows;
  /* When the minigame is won, the sidebars slide out past the edges. Only clip horizontally, since the Title sticks up above the top edge. */
  overflow-x: clip;
  --ease-in: cubic-bezier(0.6, 0, 0.6, 1);
  --ease-out: cubic-bezier(0.17, 0.84, 0.44, 1);

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
      'sound-sidebar'
      'sound-info'
      'config-sidebar';
  }

  /* On smaller screens, the sidebars are removed entirely while the prize is showing, so collapse down to only the areas that remain. */
  @media (max-width: 55rem) {
    &[data-has-won-minigame='true'] {
      grid-template-columns: 1fr;
      grid-template-areas:
        'button'
        'sound-info';
    }
  }
`;

const StyledBackgroundPattern = styled(PatternDither)`
  opacity: 0.08;
`;

const Title = styled.h3`
  --height: 3rem;
  --bw: 5px;
  --hh: calc(var(--height) / 2);
  --selection-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
  top: calc(var(--hh) * -1 + 2px);
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
  corner-shape: bevel;
  border-radius: calc(var(--hh));

  /* On smaller screens, the center-aligned title overlaps the SoundSelectSidebar in a pretty unpleasant way, so let's lift it up totally above the border. */
  @media (max-width: 55rem) {
    border-radius: var(--hh) var(--hh) 0 0;
    top: calc(var(--height) * -1);
    border-bottom: none;
  }
`;

const TitleOutline = styled(Title)`
  outline: 3px solid var(--color-background);
  z-index: 0;
`;

/*
  The prize choreography is all CSS transitions. Rules under [data-has-won-minigame='true'] hold the timing for the win sequence (sidebars slide out → button sinks → Josh pops up, with the latter two handled inside FancyButton), while the base rules hold the timing for the restore sequence, which plays in reverse.
  Visibility is transitioned alongside translate so that it flips to hidden only once the slide-out finishes, and flips to visible as soon as the slide-in starts.
*/
const StyledSoundSelectSidebar = styled(SoundSelectSidebar)`
  grid-area: sound-sidebar;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      translate 600ms var(--ease-out) 500ms,
      visibility 600ms 500ms;
  }

  ${Wrapper}[data-has-won-minigame='true'] & {
    translate: calc(-100% - 2rem) 0;
    visibility: hidden;

    @media (prefers-reduced-motion: no-preference) {
      transition:
        translate 500ms var(--ease-in),
        visibility 500ms;
    }
  }

  @media (max-width: 55rem) {
    ${Wrapper}[data-has-won-minigame='true'] & {
      display: none;
    }
  }
`;

const ButtonArea = styled.div`
  grid-area: button;
  justify-self: center;
  margin-top: 3rem;
  position: relative;

  @media (max-width: 28rem) {
    width: calc(100% - 8px);
  }

  @media (max-width: 42rem) {
    margin-bottom: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  --pad: 64px;
  --stripe-width: 24px;
  --grad: repeating-linear-gradient(
    45deg,
    transparent 0px var(--stripe-width),
    var(--color-gray-200) var(--stripe-width) calc(var(--stripe-width) * 2)
  );
  position: relative;
  display: flex;
  justify-content: center;
  padding: var(--pad);
  outline: 2px solid var(--color-gray-250);
  outline-offset: 2px;
  border-radius: calc(var(--pad) / 4);
  corner-shape: bevel;
  background: var(--grad), var(--color-gray-75);

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

  @media (prefers-reduced-motion: no-preference) {
    transition:
      translate 600ms var(--ease-out) 500ms,
      visibility 600ms 500ms;
  }

  ${Wrapper}[data-has-won-minigame='true'] & {
    translate: calc(100% + 2rem) 0;
    visibility: hidden;

    @media (prefers-reduced-motion: no-preference) {
      transition:
        translate 500ms var(--ease-in),
        visibility 500ms;
    }
  }

  @media (max-width: 55rem) {
    ${Wrapper}[data-has-won-minigame='true'] & {
      display: none;
    }
  }
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'press-sample'
    'release-sample'
    'extra-params';
  gap: 1rem;

  @container (min-width: 23.5rem) {
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
  --inset: 4px;
  position: absolute;

  @supports not (corner-shape: bevel) {
    display: none;
  }
`;

const TLScrew = styled(StyledScrew)`
  top: var(--inset);
  left: var(--inset);
`;
const TRScrew = styled(StyledScrew)`
  top: var(--inset);
  right: var(--inset);
`;
const BLScrew = styled(StyledScrew)`
  bottom: var(--inset);
  left: var(--inset);
`;
const BRScrew = styled(StyledScrew)`
  bottom: var(--inset);
  right: var(--inset);
`;

export default MainDemo;
