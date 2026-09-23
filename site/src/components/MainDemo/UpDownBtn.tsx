import React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { useSoundSettings } from '@/components/SoundSettingsProvider';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  direction: 'up' | 'down';
  handleClick: () => void;
}

function UpDownBtn({ direction, handleClick, ...props }: Props) {
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  const Icon = direction === 'up' ? ArrowUp : ArrowDown;

  const { usingLofi } = useSoundSettings();

  useButtonSounds(wrapperRef, 'sd-standard', {
    lofi: usingLofi,
    pitchVariation: 0.1,
    volume: 0.2,
  });

  return (
    <Wrapper
      ref={wrapperRef}
      onClick={handleClick}
      data-direction={direction}
      {...props}
    >
      <Border>
        <IconWrapper>
          <Icon size={16} />
        </IconWrapper>
      </Border>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --r: 4px;
  --big-r: 10px;
  --focus-offset: 2px;

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
  border-radius: 4px;
  corner-shape: bevel;
  opacity: 0.75;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
    transition: opacity 100ms;
  }
  &:focus-visible {
    opacity: 1;
  }

  &[data-direction='up'] {
    border-top-left-radius: var(--big-r);
  }
  &[data-direction='down'] {
    border-top-right-radius: var(--big-r);
  }

  /* Touch area expander for mobile */
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
`;

const Border = styled.span`
  position: absolute;
  inset: 0;
  border: 1px solid var(--color-gray-300);
  border-radius: inherit;
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
    border-color: var(--color-gray-500);
    transition: none;
  }
`;

const IconWrapper = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-gray-800);
  transition: color 300ms;

  ${Wrapper}:hover & {
    color: white;
    transition: color 100ms;
  }

  ${Wrapper}:active & {
    transform: translateY(-2px);
  }
  ${Wrapper}[data-direction='down']:active & {
    transform: translateY(2px);
  }
`;

export default UpDownBtn;
