import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { useSoundSettings } from '@/components/SoundSettingsProvider';

interface Props {
  direction: 'up' | 'down';
  handleClick: () => void;
}

function UpDownBtn({ direction, handleClick }: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  const Icon = direction === 'up' ? ArrowUp : ArrowDown;

  const { usingLofi } = useSoundSettings();
  useButtonSounds(wrapperRef, 'sd-standard', {
    lofi: usingLofi,
    pitchVariation: 0.1,
    volume: 0.2,
  });

  return (
    <Wrapper ref={wrapperRef} onClick={handleClick} data-direction={direction}>
      <Border>
        <Icon size={16} />
      </Border>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  position: relative;
  width: calc(2rem - 4px);
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  transform: translateY(-3.5px);
  background: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-300);
`;

const Border = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-gray-300);
  border-top: none;
  border-radius: 0 0 6px 6px;
  corner-shape: bevel;
  outline: 2px solid transparent;
  outline-offset: 1px;
  transform-origin: 50% 0%;
  /* Hide Locked as it slides in and out */
  overflow: hidden;
  transition:
    outline-color 400ms,
    border-color 600ms,
    color 500ms;

  ${Wrapper}:hover & {
    border-color: var(--color-gray-800);
    transition: none;
  }
  ${Wrapper}:active & {
    transform: translateY(-2px);
  }
  ${Wrapper}[data-direction='down']:active & {
    transform: translateY(2px);
  }
`;

export default UpDownBtn;
