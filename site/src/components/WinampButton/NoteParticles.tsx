import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { useBGMState } from '@/components/BGMProvider';
import useInterval from '@/hooks/use-interval';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';
import useRandomInterval from '@/hooks/use-random-interval';

import { createParticle, type Particle } from './NoteParticles.helpers';

const NOTE_SIZE = 12;
const SPAWN_DELAY_MIN_MS = 400;
const SPAWN_DELAY_MAX_MS = 1000;
const FADE_AFTER_TRAVEL_MS = 100;
const CLEANUP_INTERVAL_MS = 5000;

function NoteParticles() {
  const { isPlaying, hasCompletedIntro } = useBGMState();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = React.useState<Array<Particle>>([]);

  const shouldEmit = isPlaying && hasCompletedIntro && !prefersReducedMotion;

  useRandomInterval(
    () => {
      const particle = createParticle();
      setParticles((currentParticles) => [...currentParticles, particle]);
    },
    shouldEmit ? SPAWN_DELAY_MIN_MS : null,
    shouldEmit ? SPAWN_DELAY_MAX_MS : null,
  );

  useInterval(() => {
    const now = Date.now();

    setParticles((currentParticles) => {
      const liveParticles = currentParticles.filter((particle) => {
        const animationEndsAt =
          particle.createdAt + particle.travelDuration + FADE_AFTER_TRAVEL_MS;
        return now < animationEndsAt;
      });

      if (liveParticles.length === currentParticles.length) {
        return currentParticles;
      }

      return liveParticles;
    });
  }, CLEANUP_INTERVAL_MS);

  return (
    <Wrapper>
      {particles.map((particle) => {
        const { Icon } = particle;
        const fadeDelay = particle.travelDuration / 2;
        const fadeDuration = fadeDelay + FADE_AFTER_TRAVEL_MS;

        return (
          <Travel
            key={particle.id}
            style={{
              '--start-x': `${particle.startX}px`,
              '--start-y': `${particle.startY}px`,
              '--end-x': `${particle.endX}px`,
              '--end-y': `${particle.endY}px`,
              '--travel-duration': `${particle.travelDuration}ms`,
              '--fade-delay': `${fadeDelay}ms`,
              '--fade-duration': `${fadeDuration}ms`,
            }}
          >
            <Rocker style={{ animationDuration: `${particle.rockDuration}ms` }}>
              <Icon
                size={NOTE_SIZE}
                strokeWidth={9}
                stroke="var(--color-background)"
              />
              <Icon size={NOTE_SIZE} strokeWidth={3} />
            </Rocker>
          </Travel>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  color: hsl(45deg 100% 80%);
`;

const rock = keyframes`
  from {
    transform: rotate(-40deg);
  }
  to {
    transform: rotate(40deg);
  }
`;

const travel = keyframes`
  from {
    transform: translate(var(--start-x), var(--start-y));
  }
  to {
    transform: translate(var(--end-x), var(--end-y));
  }
`;

const Travel = styled.div`
  position: absolute;
  inset: 0;
  width: max-content;
  height: max-content;
  margin: auto;
  animation:
    ${travel} var(--travel-duration) cubic-bezier(0.257, 0.851, 0.04, 0.977)
      forwards,
    fadeToTransparent var(--fade-duration) ease var(--fade-delay) forwards;
`;

const Rocker = styled.div`
  display: grid;
  animation: ${rock} ease-in-out infinite alternate;

  & > svg {
    overflow: visible;
  }

  & > * {
    grid-area: 1 / 1;
  }
`;

export default NoteParticles;
