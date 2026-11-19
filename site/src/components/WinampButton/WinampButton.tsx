import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { useBGMSetters, useBGMState } from '@/components/BGMProvider';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';
import useRequestAnimationFrameLoop from '@/hooks/use-request-animation-frame';

import NoteParticles from './NoteParticles';

const BPM = 100;
const QUARTER_NOTE_MS = (60 / BPM) * 1000;
const BOUNCE_DURATION_MS = QUARTER_NOTE_MS * 2;

function WinampButton({ ...delegated }: React.ComponentProps<'button'>) {
  const { toggleMediaPlayer, getPlaybackPosition } = useBGMSetters();
  const { isPlaying, hasCompletedIntro } = useBGMState();
  const prefersReducedMotion = usePrefersReducedMotion();

  const id = React.useId().replace(/:/g, '');
  const maskId = `stroke-mask-${id}`;
  const svgRef = React.useRef<SVGSVGElement>(null);

  const isBouncing = isPlaying && hasCompletedIntro && !prefersReducedMotion;

  const syncBounce = React.useCallback(() => {
    const animation = svgRef.current
      ?.getAnimations()
      .find((entry) => entry instanceof CSSAnimation);

    if (!animation) {
      return;
    }

    // The keyframes stay paused. Seeking them to the song’s position each frame keeps the squash and stretch on the beat through seeks and loops.
    const positionMs = getPlaybackPosition() * 1000;
    if (!Number.isFinite(positionMs)) {
      return;
    }

    animation.currentTime = positionMs % BOUNCE_DURATION_MS;
  }, [getPlaybackPosition]);

  React.useLayoutEffect(() => {
    if (isBouncing) {
      syncBounce();
    }
  }, [isBouncing, syncBounce]);

  useRequestAnimationFrameLoop(syncBounce, isBouncing);

  return (
    <Wrapper {...delegated} onClick={toggleMediaPlayer}>
      <NoteParticles />
      <Diamond />
      <Svg
        ref={svgRef}
        data-is-bouncing={isBouncing || undefined}
        fill="none"
        viewBox="0 0 32 32"
      >
        <path
          fill="#C80"
          d="M27.544 3.217 8.125 14.427a.25.25 0 0 0-.125.217v3.606c0 .138.112.25.25.25h1.646a.25.25 0 0 1 .177.427l-6.5 6.5a.25.25 0 0 0-.073.177v4.932c0 .2.221.318.388.209l20-13.17a.25.25 0 0 0 .112-.21V13.7a.25.25 0 0 0-.193-.244l-1.868-.434a.25.25 0 0 1-.12-.42l6.027-6.028a.25.25 0 0 0 .073-.177V3.433a.25.25 0 0 0-.375-.216"
        />
        <path fill="#FFD558" d="M14.5 14.5H8L28 3l-9.5 9 5.5 1.5-20.5 12z" />
        <mask
          id={maskId}
          width="27"
          height="30"
          x="2.5"
          y="2"
          fill="#000"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M2.5 2h27v30h-27z" />
          <path d="M27.544 3.217 8.125 14.427a.25.25 0 0 0-.125.217v3.606c0 .138.112.25.25.25h1.646a.25.25 0 0 1 .177.427l-6.5 6.5a.25.25 0 0 0-.073.177v4.932c0 .2.221.318.388.209l20-13.17a.25.25 0 0 0 .112-.21V13.7a.25.25 0 0 0-.193-.244l-1.868-.434a.25.25 0 0 1-.12-.42l6.027-6.028a.25.25 0 0 0 .073-.177V3.433a.25.25 0 0 0-.375-.216" />
        </mask>
        <path
          stroke="#000"
          strokeWidth="2"
          d="M8.125 14.428 27.544 3.217a.25.25 0 0 1 .375.216v2.963a.25.25 0 0 1-.073.177l-6.028 6.028a.25.25 0 0 0 .12.42l1.869.434a.25.25 0 0 1 .193.244v3.666a.25.25 0 0 1-.113.21l-20 13.17a.25.25 0 0 1-.387-.209v-4.932a.25.25 0 0 1 .073-.177l6.5-6.5a.25.25 0 0 0-.177-.427H8.25a.25.25 0 0 1-.25-.25v-3.606a.25.25 0 0 1 .125-.216Z"
          mask={`url(#${maskId})`}
        />
      </Svg>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  position: relative;
  width: 1.5rem;
  aspect-ratio: 1;
  display: grid;
  place-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 0;
  color: var(--color-primary);
  corner-shape: bevel;
  cursor: pointer;
  anchor-name: --media-player-anchor;

  &:focus-visible {
    outline-offset: 0px;
  }

  &:hover {
    border-color: var(--color-gray-300);
  }

  /* I'm being a bit lazy here… there's no real reason that the media player and background music can't exist on mobile (aside from Safari's frequent refusal to play audio), but I don't feel like doing the work to make the Winamp clone responsive. */
  @media (max-width: 410px) {
    display: none;
  }
`;

const Diamond = styled.div`
  position: absolute;
  inset: 0;
  width: 12px;
  height: 12px;
  margin: auto;
  transform: rotate(45deg);
  transform-origin: center;
  background: var(--color-gray-800);
`;

const bounce = keyframes`
  0% {
    transform: scaleY(0.7);
  }
  10% {
    transform: scaleY(1);
  }
  40% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.28);
  }
  60% {
    transform: scaleY(1);
  }
  90% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0.7);
  }
`;

const Svg = styled.svg`
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  transform-box: fill-box;
  transform-origin: center;
  overflow: visible;

  &[data-is-bouncing] {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${bounce} ${BOUNCE_DURATION_MS}ms ease-in-out infinite;
      animation-play-state: paused;
    }
  }
`;

export default WinampButton;
