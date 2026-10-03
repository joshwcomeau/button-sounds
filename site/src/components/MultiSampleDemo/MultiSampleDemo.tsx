import * as React from 'react';
import styled from 'styled-components';
import {
  useButtonSounds,
  useImperativeButtonSounds,
} from 'button-sounds/react';
import { Play } from 'lucide-react';

import { random } from '@/utils';

// TODO: Create a screenshot and use that instead to avoid recalculating unnecessarily
import Waveform from '@/components/Waveform/Waveform';
import IconButton from '@/components/IconButton/IconButton';
import RaisedContainer from '@/components/RaisedContainer/RaisedContainer';
import LockIcon from '@/components/LockIcon/LockIcon';

function MultiSampleDemo() {
  const [isLocked, setIsLocked] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(buttonRef, isLocked ? 'lock-open' : 'lock-closed', {
    volume: 0.5,
  });

  const { press, release } = useImperativeButtonSounds('uhk-soft', {});

  const handlePointerDown = React.useCallback(() => {
    const sampleIndex = isLocked ? 0 : random(0, 3);
    press({ sampleIndex });
  }, [isLocked, press]);

  const handlePointerUp = React.useCallback(() => {
    const sampleIndex = isLocked ? 0 : random(0, 3);
    release({ sampleIndex });
  }, [isLocked, release]);

  return (
    <Wrapper>
      <Header>
        <Title>uhk-soft.mp3</Title>
        <StyledIconButton
          ref={buttonRef}
          color={isLocked ? 'hsl(355deg 100% 50%)' : 'hsl(325deg 100% 50% / 0)'}
          icon={<LockIcon isLocked={isLocked} />}
          onClick={() => setIsLocked(!isLocked)}
        >
          <span style={{ flex: 1, textAlign: 'center' }}>
            {isLocked ? 'Locked' : 'Unlocked'}
          </span>
        </StyledIconButton>
      </Header>
      <WaveformWrapper radius={8}>
        <Waveform />
      </WaveformWrapper>
      <Actions>
        <StyledIconButton
          color="hsl(155deg 100% 30%)"
          icon={<Play size={16} strokeWidth={3} />}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <span style={{ flex: 1, textAlign: 'center' }}>Trigger</span>
        </StyledIconButton>
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  margin-inline: -1rem;
  background: var(--color-gray-50);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.125rem;
  font-weight: 400;
  font-family: var(--font-segment);
`;

const WaveformWrapper = styled(RaisedContainer)``;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StyledIconButton = styled(IconButton)`
  width: 11rem;
  --face-gap: 0;
`;

export default MultiSampleDemo;
