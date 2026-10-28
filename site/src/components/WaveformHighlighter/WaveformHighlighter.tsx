import * as React from 'react';
import styled from 'styled-components';

import { range } from '@/utils';

import Playhead from './Playhead';

const FADE_DURATION = 250;

export interface ActiveWaveformData {
  variant: 'press' | 'release';
  sampleIndex: number;
  timestamp: number;
}

interface Props {
  children: React.ReactNode;
  waveformData: Record<string, [number, number]>;
  waveformDuration: number;
  activeWaveformData: ActiveWaveformData | null;
  barFrequency: number;
}

function WaveformHighlighter({
  children,
  waveformData,
  waveformDuration,
  activeWaveformData,
  barFrequency,
}: Props) {
  const [finishedTimestamp, setFinishedTimestamp] = React.useState<
    number | null
  >(null);

  const sprite = getSprite(waveformData, activeWaveformData);
  const duration = sprite?.[1] ?? 0;
  const hasFinished =
    !sprite || finishedTimestamp === activeWaveformData?.timestamp;

  const timestamp = activeWaveformData?.timestamp;
  React.useEffect(() => {
    if (typeof timestamp !== 'number' || !sprite) {
      return;
    }

    const endsAt = timestamp + duration + FADE_DURATION;
    const timeoutId = window.setTimeout(
      () => setFinishedTimestamp(timestamp),
      Math.max(0, endsAt - performance.now()),
    );

    return () => window.clearTimeout(timeoutId);
  }, [timestamp, sprite, duration]);

  const left = sprite ? (sprite[0] / waveformDuration) * 100 : 0;
  const width = sprite ? (duration / waveformDuration) * 100 : 0;

  const numOfBars = Math.floor(waveformDuration / barFrequency);
  const barWidth = 100 / numOfBars;
  const activeSpriteId =
    activeWaveformData && !hasFinished
      ? getSpriteId(activeWaveformData)
      : undefined;
  const spriteIdByBarIndex = new Map(
    Object.entries(waveformData).map(([spriteId, [start]]) => [
      Math.round((start / waveformDuration) * numOfBars),
      spriteId,
    ]),
  );

  return (
    <Wrapper>
      {children}
      <Bars>
        {range(numOfBars).map((index) => {
          const spriteId = spriteIdByBarIndex.get(index);

          return (
            <Bar
              key={index}
              style={{ width: `${barWidth}%` }}
              data-solid={!!spriteId}
            >
              {spriteId && (
                <Label data-is-active={spriteId === activeSpriteId}>
                  {spriteId}
                </Label>
              )}
            </Bar>
          );
        })}
      </Bars>
      {activeWaveformData && sprite && !hasFinished && (
        <Overlay
          key={activeWaveformData.timestamp}
          style={{
            '--left': `${left}%`,
            '--width': `${width}%`,
            '--fade-delay': `${duration}ms`,
          }}
        >
          <Region>
            <Playhead
              startedAt={activeWaveformData.timestamp}
              duration={duration}
            />
          </Region>
        </Overlay>
      )}
    </Wrapper>
  );
}

function getSpriteId(activeWaveformData: ActiveWaveformData) {
  const prefix = activeWaveformData.variant === 'press' ? 'down' : 'up';
  return `${prefix}${activeWaveformData.sampleIndex + 1}`;
}

function getSprite(
  waveformData: Record<string, [number, number]>,
  activeWaveformData: ActiveWaveformData | null,
) {
  if (!activeWaveformData) {
    return undefined;
  }

  const spriteId = getSpriteId(activeWaveformData);
  return waveformData[spriteId];
}

const Wrapper = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation:
    fadeFromTransparent 100ms,
    fadeToTransparent ${FADE_DURATION}ms linear var(--fade-delay) forwards;
`;

const Region = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--left);
  width: var(--width);
  background: hsl(210deg 30% 70% / 0.2);
`;

const Label = styled.span`
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  padding: 2px;
  color: var(--color-gray-300);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  pointer-events: none;
  transition: color 300ms;
  background: var(--color-background);

  &[data-is-active='true'] {
    transition: color 100ms;
    color: white;
  }

  /* Sadly, the labels don't fit nicely on mobile, since everything gets compressed. Hide them altogether, unless the region is active */
  @media (max-width: 33rem) {
    &[data-is-active='false'] {
      display: none;
    }
  }
`;

const Bars = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
`;

const Bar = styled.div`
  position: relative;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 1px dashed var(--color-gray-200);
    transform: translateX(-1px);
  }

  &[data-solid='true']::before {
    border-left-color: var(--color-gray-500);
  }
`;

export default WaveformHighlighter;
