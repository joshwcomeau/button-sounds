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
import VisuallyHidden from '@/components/VisuallyHidden';

import MediaPlayerSmallSlider from './MediaPlayerSmallSlider';

const TITLE = 'Actuator Jam – Josh W. Comeau (1:17)';
// The trailing space keeps the end of one loop from butting up against the start of the next.
const SCROLLING_TITLE = `${TITLE} *** `;
const SCROLL_INTERVAL_MS = 250;
const START_PAUSE_MS = 2000;

interface Props {
  handleClose: () => void;
}

function MediaPlayer({ handleClose }: Props) {
  const { volume } = useBGMState();
  const { setVolume } = useBGMSetters();
  return (
    <OuterWrapper>
      <Wrapper>
        <TopSection>
          <ArtWrapper>
            <AlbumArt
              src="/images/actuator-jam-album-art.jpg"
              alt="Album art - a complex machine with lots of buttons and switches and knobs, lit in purple and pink"
            />
          </ArtWrapper>
          <TrackInfo>
            <ScrollingTitle />
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
              <MediaPlayerSmallSlider
                value={volume}
                onChange={(ev) => setVolume(ev.target.value)}
              />
            </TopSliders>
          </TrackInfo>
        </TopSection>
      </Wrapper>
      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>
    </OuterWrapper>
  );
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
    <Title>
      <TitleText aria-hidden="true">{text}</TitleText>
      <VisuallyHidden>{TITLE}</VisuallyHidden>
    </Title>
  );
}

const OuterWrapper = styled.div`
  --outer-radius: 16px;
  --w-green: hsl(140deg 100% 50%);
  --w-gray-500: hsl(240deg 10% 50%);
  --w-primary-500: hsl(240deg 25% 30%);
  --w-primary-600: hsl(240deg 25% 20%);
  --w-primary-700: hsl(240deg 25% 14%);
  --w-primary-900: hsl(240deg 25% 8%);
  position: fixed;
  position-anchor: --media-player-anchor;
  position-area: top span-left;
  /* Slight reduction from 25rem so that the ScrollingTitle never cuts off a letter, it fits perfectly */
  width: 24.625rem;
  bottom: 6px;
  background: var(--color-gray-300);
  padding: 4px;
  border-radius: var(--outer-radius);
  corner-shape: bevel;

  @supports (color: oklch(0.7 0.2 260)) {
    --w-green: oklch(0.85 0.37 145.62);
  }

  @supports not (position-area: top) {
    right: 1rem;
    bottom: ${TASKBAR_HEIGHT}rem;
  }
`;

const Wrapper = styled.div`
  background: var(--color-gray-100);
  border-radius: calc(var(--outer-radius) - 2px);
  corner-shape: bevel;
  padding: 8px;
  font-size: 0.75rem;
`;

const Inset = styled.div`
  background: var(--color-background);
  border: 1px solid var(--color-gray-200);
  border-bottom: 1px solid var(--color-gray-300);
  border-top: 1px solid black;
  border-radius: 1px;
  padding-inline: 8px;
  color: var(--w-green);
`;

const NumInset = styled(Inset)`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--font-segment);
`;

const TopSection = styled.div`
  display: flex;
  gap: 4px;
`;

const ArtWrapper = styled.div`
  position: relative;
  width: 100px;
  aspect-ratio: 1 / 1;
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
  gap: 4px;
  flex: 1;
  /* Let the title be narrower than its text, so it can clip instead of stretching the layout */
  min-width: 0;
`;

const Title = styled(Inset)`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

/* Clipping happens here rather than on Title, since overflow is clipped at the padding edge, which would let text spill into Title’s right padding */
const TitleText = styled.span`
  display: block;
  /* "pre" rather than "nowrap" so that spaces rotated to the start/end aren’t collapsed */
  white-space: pre;
  overflow: hidden;
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
`;

const Mono = styled.div`
  color: var(--color-gray-700);
`;
const Stereo = styled.div`
  color: var(--w-green);
  font-weight: 700;
  text-shadow: 0px 0px 1px var(--w-green);
`;

const TopSliders = styled.div`
  display: flex;
  gap: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

export default MediaPlayer;
