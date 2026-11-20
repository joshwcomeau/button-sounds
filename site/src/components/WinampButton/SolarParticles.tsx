import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import useInterval from '@/hooks/use-interval';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

const SPAWN_INTERVAL_MS = 5000;
const EXPAND_DURATION_MS = 1500;
const CLEANUP_INTERVAL_MS = 60 * 1000;

interface Particle {
  id: number;
  createdAt: number;
}

let nextParticleId = 0;

function createParticle(): Particle {
  return {
    id: nextParticleId++,
    createdAt: Date.now(),
  };
}

function SolarParticles({ enabled }: { enabled: boolean }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particles, setParticles] = React.useState<Array<Particle>>([]);

  const shouldEmit = enabled && !prefersReducedMotion;

  useInterval(
    () => {
      setParticles((currentParticles) => [
        ...currentParticles,
        createParticle(),
      ]);
    },
    shouldEmit ? SPAWN_INTERVAL_MS : null,
  );

  // Each circle is gone after 1.5s, but sweeping on that cadence would re-render in lockstep with the animation. Once a minute is plenty.
  useInterval(() => {
    const now = Date.now();

    setParticles((currentParticles) => {
      const liveParticles = currentParticles.filter((particle) => {
        return now < particle.createdAt + EXPAND_DURATION_MS;
      });

      if (liveParticles.length === currentParticles.length) {
        return currentParticles;
      }

      return liveParticles;
    });
  }, CLEANUP_INTERVAL_MS);

  return (
    <Wrapper>
      {particles.map((particle) => (
        <Circle key={particle.id} />
      ))}
    </Wrapper>
  );
}

const expand = keyframes`
  0% {
    scale: 0.25;
    opacity: 0.5;
  }
  100% {
    scale: 5;
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Circle = styled.div`
  position: absolute;
  inset: 0;
  width: 16px;
  height: 16px;
  margin: auto;
  border-radius: 50%;
  filter: blur(3px);
  background: white;
  animation: ${expand} ${EXPAND_DURATION_MS}ms ease-out forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0;
  }
`;

export default SolarParticles;
