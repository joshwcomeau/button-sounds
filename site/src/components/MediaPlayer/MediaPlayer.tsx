// A media player heavily inspired by Winamp that exists to play the background music I created for this site.
// NOTE: I did not build this in a generic/reusable way, since I know I only have 1 song, but if I ever want to add more music or use this in other projects, it'd be a good idea to pass all the song data in through props.
// ALSO: It's not responsive. It requires at least 25rem (400px for most people) to display correctly.
import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';
import { useButtonSounds } from 'button-sounds/react';

import { TASKBAR_HEIGHT } from '@/constants';
import useKeybindings from '@/hooks/use-keybindings';

import {
  INTRO_DURATION_MS,
  useBGMState,
  useBGMSetters,
  type ChannelMode,
} from '@/components/BGMProvider/BGMProvider';
import BevelEdge from '@/components/BevelEdge';
import ClimbingNumber from '@/components/ClimbingNumber';

import AlbumArt from './AlbumArt';
import FrequencyVisualizer from './FrequencyVisualizer';
import MediaBtn from './MediaBtn';
import MediaPlayerSmallSlider from './MediaPlayerSmallSlider';
import MediaPlayerScrubber from './MediaPlayerScrubber';
import ScrollingTitle, { TitleText, type IntroStatus } from './ScrollingTitle';
import Scanlines from './Scanlines';

const KEYBOARD_ADJUSTMENT_DISPLAY_MS = 1000;
const KBPS = 192;
const KHZ = 44.1;
// kbps finishes a bit before the song starts, while kHz finishes right as it takes over from the intro.
const KBPS_CLIMB_DELAY_MS = 700;
const KBPS_CLIMB_DURATION_MS = INTRO_DURATION_MS - KBPS_CLIMB_DELAY_MS - 800;
const KHZ_CLIMB_DELAY_MS = 1000;
const KHZ_CLIMB_DURATION_MS = INTRO_DURATION_MS - KHZ_CLIMB_DELAY_MS - 400;
const TIME_FADE_DURATION_MS = 300;
const TIME_FADE_DELAY_MS = INTRO_DURATION_MS - TIME_FADE_DURATION_MS;
// Most corners use the same radius, but the top-right corner is special; it has a deep cut within the inner element to accommodate the close button.
const OUTER_RADIUS = 8;
const TOP_RIGHT_CUTOUT_RADIUS = 28;
const CHANNEL_MODE_TRANSITION_MS = 300;
const CHANNEL_MODES: Array<{ value: ChannelMode; label: string }> = [
  { value: 'mono', label: 'Mono' },
  { value: 'stereo', label: 'Stereo' },
];

type Slider = 'volume' | 'panning';

interface Props {
  handleClose: () => void;
}

function MediaPlayer({ handleClose }: Props) {
  const {
    isPlaying,
    hasCompletedIntro,
    introStartCount,
    volume,
    panning,
    channelMode,
    timestamp,
    duration,
  } = useBGMState();
  const {
    play,
    pause,
    stopWithFade,
    rewind,
    fastForward,
    eject,
    seek,
    setVolume,
    setPanning,
    setChannelMode,
  } = useBGMSetters();
  const playBtnRef = React.useRef<HTMLButtonElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(closeBtnRef, 'synth-off', {
    volume: 0.35,
    pitchVariation: 0.1,
  });

  const channelModeInputName = React.useId();

  const [draggingSlider, setDraggingSlider] = React.useState<Slider | null>(
    null,
  );
  const [keyboardAdjustedSlider, setKeyboardAdjustedSlider] =
    React.useState<Slider | null>(null);
  const keyboardTimeoutRef = React.useRef<number | undefined>(undefined);

  const displayedSlider = draggingSlider ?? keyboardAdjustedSlider;

  const introStatus: IntroStatus = hasCompletedIntro
    ? 'completed'
    : isPlaying
      ? 'playing'
      : 'waiting';

  useKeybindings({
    Escape: handleClose,
  });

  React.useEffect(() => {
    const playBtn = playBtnRef.current;
    if (!playBtn) {
      return;
    }

    const previouslyFocused = document.activeElement;

    playBtn.focus();

    return () => {
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, []);

  // The pointer can be released outside the slider, so we listen on the window.
  React.useEffect(() => {
    if (!draggingSlider) {
      return;
    }

    function handleRelease() {
      setDraggingSlider(null);
    }

    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);

    return () => {
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
    };
  }, [draggingSlider]);

  React.useEffect(() => {
    return () => {
      window.clearTimeout(keyboardTimeoutRef.current);
    };
  }, []);

  function handleSliderAdjustment(slider: Slider) {
    // Pointer changes are covered by the dragging state, so anything else came from the keyboard.
    if (draggingSlider) {
      return;
    }

    setKeyboardAdjustedSlider(slider);
    window.clearTimeout(keyboardTimeoutRef.current);
    keyboardTimeoutRef.current = window.setTimeout(() => {
      setKeyboardAdjustedSlider(null);
    }, KEYBOARD_ADJUSTMENT_DISPLAY_MS);
  }

  return (
    <Container>
      <BorderWrapper>
        <BevelEdge
          side="top"
          color="var(--w-gray-700)"
          leftRadius={OUTER_RADIUS}
          rightRadius={2}
        />
        <Wrapper>
          <BevelEdge
            side="top"
            color="var(--w-gray-600)"
            leftRadius={OUTER_RADIUS - 2}
            rightRadius={TOP_RIGHT_CUTOUT_RADIUS}
          />
          <BevelEdge
            side="bottom"
            color="var(--w-primary-900)"
            radius={OUTER_RADIUS - 2}
          />

          <TopSection>
            <AlbumArt
              introStatus={introStatus}
              introStartCount={introStartCount}
            />
            <TrackInfo>
              <Title>
                {displayedSlider === 'volume' && (
                  <TitleText>Volume: {Math.round(volume * 100)}%</TitleText>
                )}
                {displayedSlider === 'panning' && (
                  <TitleText>Balance: {getBalanceLabel(panning)}</TitleText>
                )}
                {!displayedSlider && (
                  <ScrollingTitle
                    key={introStartCount}
                    introStatus={introStatus}
                  />
                )}
              </Title>
              <Specs>
                <Spec>
                  <NumInset
                    data-intro-status={introStatus}
                    style={{
                      '--climb-delay': `${KBPS_CLIMB_DELAY_MS}ms`,
                      '--climb-duration': `${KBPS_CLIMB_DURATION_MS}ms`,
                    }}
                  >
                    <KbpsOpticalShift>
                      {introStatus === 'waiting' && '--'}
                      {introStatus === 'playing' && (
                        <ClimbingNumber
                          key={introStartCount}
                          from={0}
                          to={KBPS}
                          delay={KBPS_CLIMB_DELAY_MS}
                          duration={KBPS_CLIMB_DURATION_MS}
                          decimalPlaces={0}
                          placeholder="--"
                        />
                      )}
                      {introStatus === 'completed' && KBPS}
                    </KbpsOpticalShift>
                  </NumInset>
                  kbps
                </Spec>
                <Spec>
                  <NumInset
                    data-intro-status={introStatus}
                    style={{
                      '--climb-delay': `${KHZ_CLIMB_DELAY_MS}ms`,
                      '--climb-duration': `${KHZ_CLIMB_DURATION_MS}ms`,
                    }}
                  >
                    {introStatus === 'waiting' && '--'}
                    {introStatus === 'playing' && (
                      <ClimbingNumber
                        key={introStartCount}
                        from={0}
                        to={KHZ}
                        delay={KHZ_CLIMB_DELAY_MS}
                        duration={KHZ_CLIMB_DURATION_MS}
                        decimalPlaces={1}
                        placeholder="--"
                      />
                    )}
                    {introStatus === 'completed' && KHZ}
                  </NumInset>
                  kHz
                </Spec>
                <FinalSpec role="radiogroup" aria-label="Channels">
                  {CHANNEL_MODES.map(({ value, label }) => (
                    <ChannelModeOption
                      key={`${value}-${introStartCount}`}
                      data-intro-status={introStatus}
                    >
                      <ChannelModeInput
                        type="radio"
                        name={channelModeInputName}
                        value={value}
                        checked={channelMode === value}
                        // Switching mid-intro would interrupt the glow-in animation, so this only unlocks once the song has started.
                        disabled={introStatus !== 'completed'}
                        onChange={() => {
                          setChannelMode(value);
                        }}
                      />
                      {label}
                    </ChannelModeOption>
                  ))}
                </FinalSpec>
              </Specs>
              <TopSliders>
                <VolumeSlider
                  aria-label="Volume"
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onPointerDown={() => setDraggingSlider('volume')}
                  onChange={(ev) => {
                    setVolume(Number(ev.target.value));
                    handleSliderAdjustment('volume');
                  }}
                />
                <PanSlider
                  aria-label="Stereo panning"
                  value={panning}
                  min={-1}
                  max={1}
                  step={0.1}
                  onPointerDown={() => setDraggingSlider('panning')}
                  onChange={(ev) => {
                    setPanning(Number(ev.target.value));
                    handleSliderAdjustment('panning');
                  }}
                />
              </TopSliders>
            </TrackInfo>
          </TopSection>
          <Divider />
          <ScrubberWrapper>
            <MediaPlayerScrubber
              aria-label="Playback position"
              aria-valuetext={`${formatTime(timestamp)} of ${formatTime(duration)}`}
              value={timestamp}
              min={0}
              max={duration}
              // Loaded songs stay seekable while paused or stopped. The intro and eject are what take the scrubber offline.
              disabled={!hasCompletedIntro}
              onCommit={seek}
            />
          </ScrubberWrapper>
          <Divider />
          <BottomSection>
            <Buttons>
              <ButtonShaft />
              <ButtonRow>
                <MediaBtn icon="rewind" onClick={rewind} />
                <MediaBtn icon="play" onClick={play} ref={playBtnRef} />
                <MediaBtn icon="pause" onClick={pause} />
                <MediaBtn icon="stop" onClick={() => stopWithFade(100)} />
                <MediaBtn icon="fast-forward" onClick={fastForward} />
              </ButtonRow>
            </Buttons>
            <EjectBtnWrapper>
              <ButtonShaft />
              <ButtonRow>
                <MediaBtn icon="eject" onClick={eject} />
              </ButtonRow>
            </EjectBtnWrapper>
            <VisualizerInset>
              <FrequencyVisualizer />
              <Scanlines opacity={0.25} />
            </VisualizerInset>
            <TimeDisplay data-intro-status={introStatus}>
              <span key={introStartCount}>{formatTime(timestamp)}</span>
            </TimeDisplay>
          </BottomSection>
          <Footer>
            <Stripes />
          </Footer>
        </Wrapper>
        <CloseButton onClick={handleClose} ref={closeBtnRef}>
          <X size={12} strokeWidth={3} />
        </CloseButton>
      </BorderWrapper>
    </Container>
  );
}

function formatTime(seconds: number) {
  const wholeSeconds = Math.round(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  return `${minutes}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

function getBalanceLabel(panning: number) {
  const percentage = Math.round(Math.abs(panning) * 100);

  if (percentage === 0) {
    return 'center';
  }

  return `${percentage}% ${panning < 0 ? 'left' : 'right'}`;
}

const slideUp = keyframes`
  from {
    transform: translateY(20%);
  }
  to {
    transform: translateY(0);
  }
`;

// Starts out matching an unselected option. The shadows are transparent rather than absent, so they can interpolate.
const channelModeGlowIn = keyframes`
  from {
    color: var(--color-gray-700);
    font-weight: 400;
    text-shadow:
      0px 0px 2px transparent,
      0px 0px 3px transparent;
  }
`;

const Container = styled.div`
  --outer-radius: ${OUTER_RADIUS}px;
  position: fixed;
  position-anchor: --media-player-anchor;
  position-area: top span-left;
  bottom: 10px;
  border-radius: var(--outer-radius) 2px var(--outer-radius) var(--outer-radius);
  corner-shape: bevel;

  @supports not (position-area: top) {
    right: 1rem;
    bottom: ${TASKBAR_HEIGHT}rem;
  }
`;

const BorderWrapper = styled.div`
  --w-green: hsl(140deg 100% 50%);
  --w-green-700: hsl(136deg 80% 30%);
  --w-green-900: hsl(133deg 80% 10%);
  --w-gray-500: hsl(240deg 10% 52%);
  --w-gray-600: hsl(240deg 7% 45%);
  --w-gray-700: hsl(240deg 5% 40%);
  --w-gray-900: hsl(240deg 5% 20%);
  --w-primary-100: hsl(240deg 35% 70%);
  --w-primary-300: hsl(240deg 25% 40%);
  --w-primary-500: hsl(240deg 25% 30%);
  --w-primary-600: hsl(240deg 25% 20%);
  --w-primary-700: hsl(240deg 25% 14%);
  --w-primary-900: hsl(240deg 25% 8%);
  --shadow-opacity: 0.35;
  width: 23rem;
  background: var(--w-primary-900);
  padding: 4px;
  border: 1px solid var(--w-gray-900);
  border-radius: inherit;
  corner-shape: inherit;
  will-change: transform;
  animation: ${slideUp} 850ms cubic-bezier(0.098, 0.974, 0.04, 0.977);
  box-shadow:
    0px 0px 2px hsl(210deg 15% 6% / var(--shadow-opacity)),
    0px 0px 4px hsl(210deg 15% 6% / var(--shadow-opacity)),
    0px 0px 8px hsl(210deg 15% 6% / var(--shadow-opacity)),
    0px 0px 16px hsl(210deg 15% 6% / var(--shadow-opacity));

  @supports (color: oklch(0.7 0.2 260)) {
    --w-green: oklch(0.85 0.37 145);
    --w-green-700: oklch(0.65 0.28 140);
  }
`;

const Wrapper = styled.div`
  --r: calc(var(--outer-radius) - 2px);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(
    0deg,
    var(--w-primary-600),
    var(--w-primary-500),
    var(--w-primary-600)
  );
  border-radius: var(--r) ${TOP_RIGHT_CUTOUT_RADIUS - 1}px var(--r) var(--r);
  border: 1px solid var(--w-primary-700);
  corner-shape: bevel;
  padding: 8px;
  font-size: 0.75rem;
`;

const Inset = styled.div`
  --selection-color: black;
  --selection-bg: var(--w-green);

  position: relative;
  background: hsl(210deg 15% 9%);
  border-radius: 4px;
  corner-shape: bevel;
  padding-inline: 8px;
  color: var(--w-green);
  text-shadow:
    0px 0px 2px var(--w-green-900),
    0px 0px 3px var(--w-green-700);

  /* Annoyingly, a Chrome bug means that bottom/top borders overlap in a weird way unless we move them to child elements */

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    corner-shape: inherit;
    pointer-events: none;
  }

  &::before {
    border-top: 1px solid black;
  }

  &::after {
    border-bottom: 1px solid var(--w-gray-500);
  }
`;

const NumInset = styled(Inset)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5625rem;
  font-weight: 700;
  font-family: var(--font-segment-digits);
  font-variant-numeric: tabular-nums;
  /* Keeps the specs row from shifting while the numbers climb during the intro */
  min-width: calc(3ch + 16px);

  &[data-intro-status='waiting'] {
    color: var(--color-primary);
  }

  &[data-intro-status='playing'] {
    transition: color var(--climb-duration) linear var(--climb-delay);
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 6px;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  /* Let the title be narrower than its text, so it can clip instead of stretching the layout */
  min-width: 0;
`;

const Title = styled(Inset)`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0 16px 0 0;
  corner-shape: bevel;
  overflow: hidden;
  margin-right: 8px;
`;

const Specs = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`;

const Spec = styled.div`
  display: flex;
  gap: 4px;
`;

// The kbps displays as "192", and since the dseg font is monospace, "1" has a bunch of empty space on the left (empty segments!). So, it winds up looking off-center. Fix that by reducing left spacing by 2px
const KbpsOpticalShift = styled.span`
  display: block;
  margin-left: -2px;
`;

const FinalSpec = styled(Spec)`
  margin-left: auto;
  font-size: 0.625rem;
  gap: 8px;
`;

// Nothing is lit while the player is off, the same as the specs beside it.
const ChannelModeOption = styled.label`
  position: relative;
  color: var(--color-gray-700);
  font-weight: 400;
  text-shadow:
    0px 0px 2px transparent,
    0px 0px 3px transparent;
  transition-property: color, font-weight, text-shadow;
  transition-duration: ${CHANNEL_MODE_TRANSITION_MS}ms;

  &:has(:checked):not([data-intro-status='waiting']) {
    color: var(--w-green);
    font-weight: 700;
    text-shadow:
      0px 0px 2px var(--w-green-900),
      0px 0px 3px var(--w-green-700);
  }

  &[data-intro-status='playing']:has(:checked) {
    animation: ${channelModeGlowIn} ${INTRO_DURATION_MS}ms linear backwards;
  }

  &:has(:focus-visible) {
    outline: var(--focus-dot-size, 2px) dotted white;
    outline-offset: 2px;
  }
`;

const ChannelModeInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  appearance: none;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }
`;

const TopSliders = styled.div`
  display: flex;
  gap: 8px;
`;

const VolumeSlider = styled(MediaPlayerSmallSlider)`
  flex: 2;
`;
const PanSlider = styled(MediaPlayerSmallSlider)`
  flex: 1;
`;

const ScrubberWrapper = styled.div``;

const BottomSection = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const Buttons = styled.div`
  --corner-radius: 5px;
  position: relative;
  border-bottom: 1px solid var(--w-primary-100);
  border-radius: var(--corner-radius);
  corner-shape: bevel;
  /* Buttons slide down by 2px when active, and we want to hide the bottom edges when this happens, to produce the illusion that they’re sliding into their cavity */
  overflow: hidden;
  /* Allow the buttons to peek over the top without being clipped */
  padding-top: 4px;
  margin-top: -4px;
  /* The buttons use z-index so that the focus outline always sits above its siblings. Ensure that the z-index doesn't 'leak' beyond this element: */
  isolation: isolate;
`;

const ButtonShaft = styled.div`
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  corner-shape: inherit;
  background: linear-gradient(
    to bottom,
    var(--w-primary-600) 0px,
    var(--color-background) 7px
  );
`;

const EjectBtnWrapper = styled(Buttons)`
  margin-right: auto;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1px;
  padding: 1px;
`;

const VisualizerInset = styled(Inset)`
  position: relative;
  display: flex;
  align-items: center;
  height: 1.5rem;
  padding-inline: 4px;
  margin-left: auto;
`;

const TimeDisplay = styled(Inset)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  height: 1.5rem;
  min-width: 3rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-rendering: geometricPrecision;
  font-family: var(--font-segment-digits);

  &[data-intro-status='waiting'] > span {
    opacity: 0;
  }

  /* Finishes 200ms before the song takes over from the intro */
  &[data-intro-status='playing'] > span {
    animation: fadeFromTransparent ${TIME_FADE_DURATION_MS}ms
      ${TIME_FADE_DELAY_MS}ms backwards;
  }
`;

const Divider = styled.div`
  height: 2px;
  background: var(--w-gray-500);
  border-top: 1px solid var(--w-primary-700);
  margin-inline: -8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 3px 3px 3px 16px;
  corner-shape: bevel;

  &:focus-visible {
    outline-offset: 2px;
  }

  /* The clickable area is a bit tiny for this button, so we extend ti with a pseudo-element */

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
  }

  /* On browsers that support bevels, there's plenty of space for the "X". But on other browsers, the rounded corner doesn't leave much room, so we'll pull the close button up beyond the edge */
  @supports not (corner-shape: bevel) {
    transform: translateY(-100%);
  }
`;

const Footer = styled.div`
  margin: -8px;
  margin-top: 0;
  border-top: 1px solid var(--w-gray-700);
  padding: 4px;
`;

const Stripes = styled.div`
  height: 16px;
  border-radius: 0 0 4px 4px;
  corner-shape: bevel;
  background: repeating-linear-gradient(
    -45deg,
    var(--w-primary-500) 0px 2px,
    transparent 2px 4px
  );
`;

export default MediaPlayer;
