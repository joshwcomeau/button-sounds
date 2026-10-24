import * as React from 'react';
import styled from 'styled-components';
import {
  useButtonSounds,
  useImperativeButtonSounds,
} from 'button-sounds/react';
import { Play } from 'lucide-react';

import { random } from '@/utils';

// TODO: Create a screenshot and use that instead to avoid recalculating unnecessarily
import PatternDither from '@/components/BackgroundPatterns/PatternDither';
import BevelEdge from '@/components/BevelEdge/BevelEdge';
import OuterCorner from '@/components/OuterCorner/OuterCorner';
import Waveform from '@/components/Waveform/Waveform';
import WaveformHighlighter, {
  type ActiveWaveformData,
} from '@/components/WaveformHighlighter/WaveformHighlighter';
import IconButton from '@/components/IconButton/IconButton';
import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';
import LockToggle from '@/components/LockToggle/LockToggle';
import { SPRITE_SRC } from '@/components/ButtonShapes/ButtonShapes';

const WAVEFORM_DATA = {
  down1: [100, 200],
  up1: [300, 400],
  down2: [700, 200],
  up2: [900, 400],
  down3: [1300, 200],
  up3: [1500, 400],
  down4: [1900, 200],
  up4: [2100, 200],
} satisfies Record<string, [number, number]>;

const WAVEFORM_DURATION = 2300;

function MultiSampleDemo(props: React.HTMLAttributes<HTMLDivElement>) {
  const [isLocked, setIsLocked] = React.useState(true);
  const [activeWaveformData, setActiveWaveformData] =
    React.useState<ActiveWaveformData | null>(null);

  const { press, release } = useImperativeButtonSounds('uhk-soft', {});

  const handlePointerDown = React.useCallback(() => {
    const sampleIndex = isLocked ? 0 : random(0, 4);
    press({ sampleIndex });
    setActiveWaveformData({
      variant: 'press',
      sampleIndex,
      timestamp: performance.now(),
    });
  }, [isLocked, press]);

  const handlePointerUp = React.useCallback(() => {
    const sampleIndex = isLocked ? 0 : random(0, 4);
    release({ sampleIndex });
    setActiveWaveformData({
      variant: 'release',
      sampleIndex,
      timestamp: performance.now(),
    });
  }, [isLocked, release]);

  return (
    <Container {...props}>
      <LockWrapper>
        <LockImg src={SPRITE_SRC} alt="" />
      </LockWrapper>
      <Wrapper>
        <StyledBackgroundPattern patternId="f" />
        <BevelEdge side="top" color="var(--color-gray-300)" radius={16} />
        <BevelEdge side="bottom" color="var(--color-gray-75)" radius={16} />
        <Header>
          <HeaderLeftCorner
            corner="bottom-right"
            borderRadius={16}
            borderWidth={1}
            borderColor="var(--color-gray-300)"
          />
          <HeaderRightCorner
            corner="bottom-left"
            borderRadius={16}
            borderWidth={1}
            borderColor="var(--color-gray-300)"
          />
          <TitleWrapper>
            <Subtitle>Sample</Subtitle>
            <Title>uhk-soft.mp3</Title>
          </TitleWrapper>
          <LockToggle isLocked={isLocked} setIsLocked={setIsLocked} />
        </Header>
        <WaveformWrapper>
          <StyledRaisedContainer topRadius={8} bottomRadius={8}>
            <WaveformHighlighter
              waveformData={WAVEFORM_DATA}
              waveformDuration={WAVEFORM_DURATION}
              activeWaveformData={activeWaveformData}
              barFrequency={100}
            >
              <Waveform />
            </WaveformHighlighter>
          </StyledRaisedContainer>
        </WaveformWrapper>
        <Actions>
          <TriggerWrapper>
            <OuterCorner
              corner="bottom-left"
              borderRadius={6}
              borderWidth={1}
              borderColor="var(--color-gray-300)"
              style={{ left: -6, top: 0 }}
            />
            <OuterCorner
              corner="bottom-right"
              borderRadius={6}
              borderWidth={1}
              borderColor="var(--color-gray-300)"
              style={{ right: -6, top: 0 }}
            />
            <StyledIconButton
              color="hsl(155deg 100% 30%)"
              icon={<Play size={16} strokeWidth={3} />}
              onPointerDown={(event) => {
                handlePointerDown();

                window.addEventListener('pointerup', handlePointerUp, {
                  once: true,
                });
              }}
              onKeyDown={(event) => {
                if (event.repeat) {
                  return;
                }
                if (event.key === 'Enter' || event.key === ' ') {
                  handlePointerDown();

                  event.preventDefault();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handlePointerUp();
                  event.preventDefault();
                }
              }}
            >
              <span style={{ flex: 1, textAlign: 'center' }}>Trigger</span>
            </StyledIconButton>
          </TriggerWrapper>
        </Actions>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const LockWrapper = styled.div`
  position: absolute;
  top: 48px;
  right: -64px;
  width: 170px;
  height: 220px;
  transform-origin: top left;
  transform: translate(50%, -50%) scale(0.5);

  @media (max-width: 46.875rem) {
    display: none;
  }
`;
const LockImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: none;
  object-position: -604px 0px;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 0.5rem;
  padding-top: 0;
  margin-inline: -1rem;
  border: 1px solid var(--color-gray-200);
  background: hsl(210deg 15% 18% / 0.75);
  border-radius: 16px;
  corner-shape: bevel;
  outline: 3px solid var(--color-background);

  @media (max-width: 41rem) {
    margin-inline: 0;
  }
`;

const StyledBackgroundPattern = styled(PatternDither)`
  opacity: 0.2;
  mix-blend-mode: overlay;
  border-radius: inherit;
  corner-shape: bevel;
`;

const Header = styled.div`
  --r: 16px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-gray-200);
  margin-inline: -1rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem 0.5rem;
  border-bottom: 1px solid var(--color-gray-300);
  border-radius: var(--r) var(--r) 0 0;
  corner-shape: bevel;
`;

const HeaderLeftCorner = styled(OuterCorner)`
  left: 0;
  bottom: 0;
  transform: translateY(100%);
`;
const HeaderRightCorner = styled(OuterCorner)`
  right: 0;
  bottom: 0;
  transform: translateY(100%);
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const Subtitle = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 0.875rem;
  font-weight: 700;
`;

const WaveformWrapper = styled.div`
  background: var(--color-background);
  border-radius: 8px;
  corner-shape: bevel;
`;

const StyledRaisedContainer = styled(RaisedContainer)`
  border-radius: 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

const TriggerWrapper = styled.div`
  --r: 11px;
  position: relative;
  border: 1px solid var(--color-gray-300);
  border-top: none;
  background: var(--color-background);
  padding: 4px;
  padding-top: 2px;
  transform: translateY(-1px);
  border-radius: 0 0 var(--r) var(--r);
  corner-shape: bevel;
`;

const StyledIconButton = styled(IconButton)`
  width: 11rem;
  --face-gap: 0;
`;

export default MultiSampleDemo;
