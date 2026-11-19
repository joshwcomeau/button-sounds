import * as React from 'react';
import {
  EighthNote,
  HalfNote,
  EighthNotes,
  type LucideIcon,
} from 'lucide-react';
import styled, { keyframes } from 'styled-components';

import { useBGMState } from '@/components/BGMProvider';
import useInterval from '@/hooks/use-interval';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';
import useRandomInterval from '@/hooks/use-random-interval';
import {
  convertDegreesToRadians,
  convertPolarToCartesian,
  random,
  sampleOne,
} from '@/utils';

// eslint-disable-next-line
const NOTE_ICONS: Array<LucideIcon> = [EighthNote, HalfNote, EighthNotes];
const NOTE_SIZE = 12;

const SPAWN_DELAY_MIN_MS = 400;
const SPAWN_DELAY_MAX_MS = 1000;
const ANGLE_MIN_DEGREES = -135;
const ANGLE_MAX_DEGREES = -45;
const DISTANCE_MIN_PX = 10;
const DISTANCE_MAX_PX = 30;
// Originally, each particle was given a random angle, but true randomness leads to clumpy results, where 3-4 notes in a row might all wind up in the same general spot. It feels unbalanced. So instead, we imagine an invisible arm sweeping from -135deg to -45deg, back and forth, firing the particle in that direction. This guarantees a relatively-even spread while still feeling random.
const ANGLE_SWEEP_ONE_WAY_MS = 2000;
// We do the same thing for distance, for the same reasons. To prevent a pattern from forming, I picked an especially random value:
const DISTANCE_SWEEP_ONE_WAY_MS = 3456;
const START_DISTANCE = 12;
const TRAVEL_DURATION_MIN_MS = 1200;
const TRAVEL_DURATION_MAX_MS = 1600;
const FADE_AFTER_TRAVEL_MS = 100;
const CLEANUP_INTERVAL_MS = 5000;
const ROCK_DURATION_MIN_MS = 300;
const ROCK_DURATION_MAX_MS = 300;

interface Particle {
  id: number;
  createdAt: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  travelDuration: number;
  rockDuration: number;
  Icon: LucideIcon;
}

let nextParticleId = 0;

function getSweepProgress(now: number, oneWayMs: number): number {
  const cycleMs = oneWayMs * 2;
  const phase = (now % cycleMs) / oneWayMs;

  return phase <= 1 ? phase : 2 - phase;
}

function getSweepAngle(now: number): number {
  const progress = getSweepProgress(now, ANGLE_SWEEP_ONE_WAY_MS);

  return ANGLE_MIN_DEGREES + progress * (ANGLE_MAX_DEGREES - ANGLE_MIN_DEGREES);
}

function getSweepDistance(now: number): number {
  const progress = getSweepProgress(now, DISTANCE_SWEEP_ONE_WAY_MS);

  return DISTANCE_MIN_PX + progress * (DISTANCE_MAX_PX - DISTANCE_MIN_PX);
}

function createParticle(): Particle {
  const now = Date.now();
  const angle = getSweepAngle(now);
  const distance = getSweepDistance(now);

  const [startX, startY] = convertPolarToCartesian([
    convertDegreesToRadians(angle),
    START_DISTANCE,
  ]);
  const [endX, endY] = convertPolarToCartesian([
    convertDegreesToRadians(angle),
    START_DISTANCE + distance,
  ]);

  return {
    id: nextParticleId++,
    createdAt: now,
    startX,
    startY,
    endX,
    endY,
    travelDuration: random(TRAVEL_DURATION_MIN_MS, TRAVEL_DURATION_MAX_MS),
    rockDuration: random(ROCK_DURATION_MIN_MS, ROCK_DURATION_MAX_MS),
    Icon: sampleOne(NOTE_ICONS),
  };
}

function NoteParticles() {
  const { isPlaying } = useBGMState();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = React.useState<Array<Particle>>([]);

  const shouldEmit = isPlaying && !prefersReducedMotion;

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
