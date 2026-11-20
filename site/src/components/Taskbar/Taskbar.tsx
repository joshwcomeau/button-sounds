import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import {
  GITHUB_URL,
  NPM_URL,
  TASKBAR_HEIGHT,
  QUARTER_NOTE_MS,
} from '@/constants';
import { useBGMSetters, useBGMState } from '@/components/BGMProvider';
import useBGMSyncedAnimation from '@/hooks/use-bgm-synced-animation';

import MediaPlayer from '@/components/MediaPlayer/MediaPlayer';

import SystemTray from './SystemTray';
import TaskbarLink from './TaskbarLink';

const GH_ANIMATION_DURATION_MS = QUARTER_NOTE_MS * 2;
const NPM_BOUNCE_MS = QUARTER_NOTE_MS;

function Taskbar() {
  const { closeMediaPlayer } = useBGMSetters();
  const { isMediaPlayerOpen, isPlaying, hasCompletedIntro } = useBGMState();
  const ghLogoRef = React.useRef<HTMLImageElement>(null);
  const npmLogoRef = React.useRef<HTMLImageElement>(null);

  // Seeking to the song’s position keeps the tilt on beats 2 and 4 through seeks and loops.
  useBGMSyncedAnimation(ghLogoRef);
  useBGMSyncedAnimation(npmLogoRef);

  const animateIcons = isPlaying && hasCompletedIntro;

  return (
    <>
      <OuterWrapper>
        <Wrapper>
          <Links>
            <TaskbarLink href={GITHUB_URL}>
              <GHLogo
                ref={ghLogoRef}
                src="/images/github-logo.svg"
                alt="GitHub"
                draggable={false}
                data-is-rocking={animateIcons}
              />
            </TaskbarLink>
            <TaskbarLink href={NPM_URL}>
              <NPMLogo
                src="/images/npm-logo.svg"
                alt="NPM"
                draggable={false}
                data-is-bouncing={animateIcons}
              />
            </TaskbarLink>
          </Links>
          <SystemTray />
        </Wrapper>
      </OuterWrapper>

      {isMediaPlayerOpen && <MediaPlayer handleClose={closeMediaPlayer} />}
    </>
  );
}

const OuterWrapper = styled.div`
  --bg: var(--color-gray-100);
  position: fixed;
  /* Argh, I hate using z-index! But I can't see a way around it here. We need <MediaPlayer> to come after <OuterWrapper> in the DOM structure so that the anchor name is established, but I also need the media player to sit behind the taskbar, so that it pops up from underneath. */
  z-index: 1;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: ${TASKBAR_HEIGHT}rem;
  background: var(--bg);
  border-radius: 4px 4px 0 0;
  corner-shape: bevel;
  outline: 1px solid var(--color-gray-300);
`;

const Wrapper = styled.div`
  width: 67.5rem;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1rem;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 2.5rem;
`;

const Logo = styled.img`
  display: block;
`;

const ghRock = keyframes`
  0% {
    rotate: -30deg;
  }
  17%, 40% {
    rotate: 0deg;
  }
  50% {
    rotate: 30deg;
  }
  67%, 85% {
    rotate: 0deg;
  }
  100% {
    rotate: -30deg;
  }
`;

const GHLogo = styled(Logo)`
  width: 1.5rem;
  height: 1.5rem;
  transform-origin: center;
  animation-play-state: paused;

  @media (prefers-reduced-motion: no-preference) {
    &[data-is-rocking='true'] {
      animation: ${ghRock} ${GH_ANIMATION_DURATION_MS}ms ease-in-out infinite;
      animation-play-state: running;
    }
  }
`;

const npmBounce = keyframes`
  0% {
    translate: 0 2px;
  }
  35% {
    translate: 0 0;
  }
  80% {
    translate: 0 0;
  }
  90% {
    translate: 0 2px;
  }
  100% {
    translate: 0 2px;
  }
`;

const NPMLogo = styled(Logo)`
  width: 2rem;

  @media (prefers-reduced-motion: no-preference) {
    &[data-is-bouncing='true'] {
      animation: ${npmBounce} ${NPM_BOUNCE_MS}ms ease-out infinite;
    }
  }
`;

export default Taskbar;
