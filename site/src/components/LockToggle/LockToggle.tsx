import * as React from 'react';
import styled from 'styled-components';

import LockIcon from '@/components/LockIcon';
import { useButtonSounds } from 'button-sounds/react';

interface Props {
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
}

function LockToggle({ isLocked, setIsLocked }: Props) {
  const [isPressing, setIsPressing] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(buttonRef, isLocked ? 'lock-open' : 'lock-closed', {
    volume: 0.5,
  });

  return (
    <Wrapper
      ref={buttonRef}
      type="button"
      onClick={() => setIsLocked(!isLocked)}
      onPointerDown={() => setIsPressing(true)}
      onPointerUp={() => setIsPressing(false)}
      onPointerLeave={() => setIsPressing(false)}
    >
      <IconWrapper>
        <LockIcon isLocked={isLocked} isPressing={isPressing} />
      </IconWrapper>
      <Label>{isLocked ? 'Locked' : 'Unlocked'}</Label>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 8rem;
  padding-inline: 0.5rem;
  border: 2px solid var(--color-gray-300);
  background: transparent;
  border-radius: 4px;
  corner-shape: bevel;
`;

const IconWrapper = styled.span`
  display: block;
`;

const Label = styled.span`
  flex: 1;
  display: block;
  text-align: center;
`;

const Icon = styled.span`
  display: block;
`;

export default LockToggle;
