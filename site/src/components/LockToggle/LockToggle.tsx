import * as React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import LockIcon from '@/components/LockIcon';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

interface Props {
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
}

function LockToggle({ isLocked, setIsLocked }: Props) {
  const [isPressing, setIsPressing] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(buttonRef, isLocked ? 'lock-open' : 'lock-closed', {
    volume: 0.25,
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
      <InnerBorder>
        <BevelEdge side="top" color="var(--top-color)" radius={5} />
        <BevelEdge side="bottom" color="var(--bottom-color)" radius={5} />
        <Content
          style={{
            color: isLocked ? 'hsl(350deg 100% 68%)' : 'white',
          }}
        >
          <IconWrapper>
            <LockIcon isLocked={isLocked} isPressing={isPressing} />
          </IconWrapper>
          <Label>{isLocked ? 'Unlock' : 'Lock'}</Label>
          <LockedGradient data-is-visible={isLocked} />
        </Content>
      </InnerBorder>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --top-color: var(--color-gray-300);
  --bottom-color: var(--color-gray-75);
  padding: 0;
  margin: 0;
  border: 2px solid var(--color-gray-50);
  border-radius: 6px;
  corner-shape: bevel;
  background: linear-gradient(
    to top,
    var(--color-gray-200),
    var(--color-gray-250)
  );
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;

  &:active {
    --top-color: var(--color-gray-50);
    --bottom-color: var(--color-gray-200);
    background: linear-gradient(
      to bottom,
      var(--color-gray-100),
      var(--color-gray-200)
    );
  }
`;

// Separate nested element to prevent BevelEdge from overlapping the parent's border, which is meant to feel like a moat around the button, not actually its edge.
const InnerBorder = styled.span`
  position: relative;
  display: block;
  border: 1px solid var(--color-gray-100);
  border-radius: 5px;
  corner-shape: bevel;
  /* Hide locked gradient which overflows */
  overflow: hidden;
`;

const Content = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 9rem;
  padding: 0.5rem 1rem;
  transition: color 160ms;

  ${Wrapper}:active & {
    transform: translateY(2px);
  }
`;

const IconWrapper = styled.span`
  display: block;
  /* Optical alignment */
  transform: translateY(-2px);
`;

const Label = styled.span`
  flex: 1;
  display: block;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const LockedGradient = styled.span`
  --stripe-width: 10px;
  position: absolute;
  inset: -1px;
  right: -100%;
  background: repeating-linear-gradient(
    45deg,
    black 0px var(--stripe-width),
    transparent var(--stripe-width) calc(var(--stripe-width) * 2)
  );
  border-radius: 5px;
  corner-shape: bevel;
  opacity: 0;
  transition: opacity 300ms;

  &[data-is-visible='true'] {
    opacity: 0.1;
    transition:
      transform 200ms,
      opacity 300ms;
  }

  @media (prefers-reduced-motion: no-preference) {
    transform: translateX(-20%);
    transition:
      transform 200ms,
      opacity 600ms;

    &[data-is-visible='true'] {
      opacity: 0.1;
      transform: translateX(0);
      transition:
        transform 200ms,
        opacity 300ms;
    }
  }
`;

export default LockToggle;
