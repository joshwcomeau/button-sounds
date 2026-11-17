// A media player heavily inspired by Winamp that exists to play the background music I created for this site.
// NOTE: I did not build this in a generic/reusable way, since I know I only have 1 song, but if I ever want to add more music or use this in other projects, it'd be a good idea to pass all the song data in through props.
// ALSO: It's not responsive. It requires at least 25rem (400px for most people) to display correctly.
import * as React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

import { TASKBAR_HEIGHT } from '@/constants';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

import {
  useBGMState,
  useBGMSetters,
} from '@/components/BGMProvider/BGMProvider';
import BevelEdge from '@/components/BevelEdge';
import VisuallyHidden from '@/components/VisuallyHidden';

import MediaBtn from './MediaBtn';
import MediaPlayerSmallSlider from './MediaPlayerSmallSlider';
import MediaPlayerScrubber from './MediaPlayerScrubber';

const TITLE = 'Actuator Jam – Josh W. Comeau (1:17)';
// The trailing space keeps the end of one loop from butting up against the start of the next.
const SCROLLING_TITLE = `${TITLE} *** `;
const SCROLL_INTERVAL_MS = 250;
const START_PAUSE_MS = 2000;
const KEYBOARD_ADJUSTMENT_DISPLAY_MS = 1000;
// Most corners use the same radius, but the top-right corner is special; it has a deep cut within the inner element to accommodate the close button.
const OUTER_RADIUS = 8;
const TOP_RIGHT_CUTOUT_RADIUS = 28;

type Slider = 'volume' | 'panning';

interface Props {
  handleClose: () => void;
}

function MediaPlayer({ handleClose }: Props) {
  const { volume, panning, timestamp, duration } = useBGMState();
  const { play, pause, stop, rewind, seek, setVolume, setPanning } =
    useBGMSetters();

  const [draggingSlider, setDraggingSlider] = React.useState<Slider | null>(
    null,
  );
  const [keyboardAdjustedSlider, setKeyboardAdjustedSlider] =
    React.useState<Slider | null>(null);
  const keyboardTimeoutRef = React.useRef<number | undefined>(undefined);

  const displayedSlider = draggingSlider ?? keyboardAdjustedSlider;

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
    <OuterWrapper>
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

        <TopSection>
          <ArtWrapper>
            <AlbumArt
              src="/images/actuator-jam-album-art.jpg"
              alt="Album art - a complex machine with lots of buttons and switches and knobs, lit in purple and pink"
            />
          </ArtWrapper>
          <TrackInfo>
            <Title>
              {displayedSlider === 'volume' && (
                <TitleText>Volume: {Math.round(volume * 100)}%</TitleText>
              )}
              {displayedSlider === 'panning' && (
                <TitleText>Balance: {getBalanceLabel(panning)}</TitleText>
              )}
              {!displayedSlider && <ScrollingTitle />}
            </Title>
            <Specs>
              <Spec>
                <NumInset>192</NumInset> kbps
              </Spec>
              <Spec>
                <NumInset>44.1</NumInset> kHz
              </Spec>
              <FinalSpec>
                <Mono>Mono</Mono>
                <Stereo>Stereo</Stereo>
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
        <ScrubberWrapper>
          <MediaPlayerScrubber
            aria-label="Playback position"
            aria-valuetext={`${formatTime(timestamp)} of ${formatTime(duration)}`}
            value={timestamp}
            min={0}
            max={duration}
            onCommit={seek}
          />
        </ScrubberWrapper>
        <BottomSection>
          <Buttons>
            <MediaBtn icon="rewind" onClick={rewind} />
            <MediaBtn icon="play" onClick={play} />
            <MediaBtn icon="pause" onClick={pause} />
            <MediaBtn icon="stop" onClick={stop} />
          </Buttons>
        </BottomSection>
      </Wrapper>
      <CloseButton onClick={handleClose}>
        <X size={12} strokeWidth={3} />
      </CloseButton>
    </OuterWrapper>
  );
}

function formatTime(seconds: number) {
  const wholeSeconds = Math.floor(seconds);
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

function ScrollingTitle() {
  const [offset, setOffset] = React.useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const delay = offset === 0 ? START_PAUSE_MS : SCROLL_INTERVAL_MS;

    const timeoutId = window.setTimeout(() => {
      setOffset((current) => (current + 1) % SCROLLING_TITLE.length);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [offset, prefersReducedMotion]);

  // Each tick moves the first character to the end.
  const start = prefersReducedMotion ? 0 : offset;
  const text = SCROLLING_TITLE.slice(start) + SCROLLING_TITLE.slice(0, start);

  return (
    <>
      <TitleText aria-hidden="true">{text}</TitleText>
      <VisuallyHidden>{TITLE}</VisuallyHidden>
    </>
  );
}

const OuterWrapper = styled.div`
  --outer-radius: ${OUTER_RADIUS}px;
  --w-green: hsl(140deg 100% 50%);
  --w-green-700: hsl(136deg 80% 30%);
  --w-green-900: hsl(133deg 80% 10%);
  --w-gray-500: hsl(240deg 10% 52%);
  --w-gray-600: hsl(240deg 7% 45%);
  --w-gray-700: hsl(240deg 5% 40%);
  --w-gray-900: hsl(240deg 5% 20%);
  --w-primary-500: hsl(240deg 25% 30%);
  --w-primary-600: hsl(240deg 25% 20%);
  --w-primary-700: hsl(240deg 25% 14%);
  --w-primary-900: hsl(240deg 25% 8%);
  position: fixed;
  position-anchor: --media-player-anchor;
  position-area: top span-left;
  width: 25rem;
  bottom: 10px;
  background: var(--w-primary-900);
  padding: 4px;
  border: 1px solid var(--w-gray-900);
  border-radius: var(--outer-radius) 2px var(--outer-radius) var(--outer-radius);
  corner-shape: bevel;

  @supports (color: oklch(0.7 0.2 260)) {
    --w-green: oklch(0.85 0.37 145);
    --w-green-700: oklch(0.65 0.28 140);
  }

  @supports not (position-area: top) {
    right: 1rem;
    bottom: ${TASKBAR_HEIGHT}rem;
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
  corner-shape: bevel;
  padding: 8px;
  font-size: 0.75rem;
`;

const Inset = styled.div`
  position: relative;
  background: var(--color-background);
  border-radius: 1px;
  padding-inline: 8px;
  color: var(--w-green);

  /* Annoyingly, a Chrome bug means that bottom/top borders overlap in a weird way unless we move them to child elements */

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 1px solid var(--w-primary-700);
    border-radius: inherit;
    pointer-events: none;
  }

  &::before {
    border-top: 1px solid var(--w-primary-700);
  }

  &::after {
    border-bottom: 1px solid var(--w-gray-500);
  }
`;

const NumInset = styled(Inset)`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--font-segment);
`;

const TopSection = styled.div`
  display: flex;
  gap: 6px;
`;

const ArtWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 64px;
  border-radius: 4px;
  corner-shape: bevel;
  /* Trim corners */
  overflow: hidden;

  &::after {
    --shadow-opacity: 0.325;
    content: '';
    position: absolute;
    inset: 0;
    box-shadow:
      inset 0px 0px 2px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 8px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 16px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 32px hsl(0deg 0% 0% / var(--shadow-opacity));
  }
`;

const AlbumArt = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Clipping happens here rather than on Title, since overflow is clipped at the padding edge, which would let text spill into Title’s right padding */
const TitleText = styled.span`
  display: block;
  /* "pre" rather than "nowrap" so that spaces rotated to the start/end aren’t collapsed */
  white-space: pre;
  overflow: hidden;
  margin-right: 10px;
`;

const Specs = styled.div`
  display: flex;
  gap: 16px;
`;

const Spec = styled.div`
  display: flex;
  gap: 4px;
`;

const FinalSpec = styled(Spec)`
  margin-left: auto;
  font-size: 0.625rem;
  gap: 8px;
`;

const Mono = styled.div`
  color: var(--color-gray-700);
`;
const Stereo = styled.div`
  color: var(--w-green);
  font-weight: 700;
  text-shadow:
    0px 0px 2px var(--w-green-900),
    0px 0px 3px var(--w-green-700);
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
`;

const Buttons = styled.div`
  display: flex;
  /* Buttons slide down by 2px when active, and we want to hide the bottom edges when this happens, to produce the illusion that they’re sliding into their cavity */
  overflow: hidden;
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
  cursor: pointer;
`;

export default MediaPlayer;
