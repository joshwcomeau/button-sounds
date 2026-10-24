import * as React from 'react';
import styled from 'styled-components';

import { range } from '@/utils';
import useRequestAnimationFrameLoop from '@/hooks/use-request-animation-frame';

const FADE_DURATION = 250;
const PLAYHEAD_WIDTH = 2;

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
  const [now, setNow] = React.useState(() => performance.now());

  const sprite = getSprite(waveformData, activeWaveformData);
  const elapsed = activeWaveformData
    ? Math.max(0, now - activeWaveformData.timestamp)
    : 0;
  const duration = sprite?.[1] ?? 0;
  const fadeElapsed = elapsed - duration;
  const hasFinished = !sprite || fadeElapsed >= FADE_DURATION;
  const isRunning = Boolean(activeWaveformData) && !hasFinished;

  useRequestAnimationFrameLoop(() => {
    setNow(performance.now());
  }, isRunning);

  React.useEffect(() => {
    if (activeWaveformData) {
      setNow(performance.now());
    }
  }, [activeWaveformData]);

  const left = sprite ? (sprite[0] / waveformDuration) * 100 : 0;
  const width = sprite ? (duration / waveformDuration) * 100 : 0;
  const playheadProgress = duration > 0 ? Math.min(1, elapsed / duration) : 0;
  const opacity =
    fadeElapsed <= 0 ? 1 : Math.max(0, 1 - fadeElapsed / FADE_DURATION);

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
            '--playhead-progress': playheadProgress,
            '--opacity': opacity,
          }}
        >
          <Region>
            <Playhead />
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
  opacity: var(--opacity);
  animation: fadeFromTransparent 100ms;
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

const Playhead = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${PLAYHEAD_WIDTH}px;
  left: calc(var(--playhead-progress) * (100% - ${PLAYHEAD_WIDTH}px));
  background: hsl(210deg 15% 95%);

  @media (prefers-reduced-motion: reduce) {
    display: none;
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
