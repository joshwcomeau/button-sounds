// Shh! This is a secret easter egg 😄

import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import useSound from 'use-sound';
import { useButtonSounds } from 'button-sounds/react';

import { range, sampleOne } from '@/utils';

type SpriteMap = Record<string, [number, number]>;
type ButtonStatus = 'idle' | 'correct' | 'error';

const CORRECT_SEQUENCE = [2, 0, 3, 1];

const BUTTON_NOTES = [
  { down: 'd#', up: 'f' },
  { down: 'b', up: 'b#' },
  { down: 'g0', up: 'c' },
  { down: 'g', up: 'g#' },
] as const;

const SPRITE_DATA: SpriteMap = {
  c: [0, 999],
  'd#': [1000, 999],
  f: [2000, 999],
  g: [3000, 999],
  'g#': [4000, 999],
  b: [5000, 999],
  'b#': [6000, 999],
  g0: [7000, 999],
  error1: [8000, 900],
  error2: [9000, 900],
  error3: [10000, 900],
  cancel: [11000, 1000],
};

const IDLE_STATUSES: ButtonStatus[] = ['idle', 'idle', 'idle', 'idle'];
const ERROR_STATUSES: ButtonStatus[] = ['error', 'error', 'error', 'error'];

interface Props {
  hasWon: boolean;
  onComplete: () => void;
}

function CodedLights({ hasWon, onComplete }: Props) {
  const [play] = useSound('/sounds/easter-egg-notes.mp3?v=4', {
    sprite: SPRITE_DATA,
  });
  const [statuses, setStatuses] = React.useState<ButtonStatus[]>(IDLE_STATUSES);

  const stepRef = React.useRef(0);
  const isCompleteRef = React.useRef(false);
  const errorTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (errorTimeoutRef.current !== null) {
        window.clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  function handlePointerDown(index: number) {
    if (isCompleteRef.current) {
      return;
    }

    // Clear away any still-fading-out error lights
    setStatuses((currentStatuses) =>
      currentStatuses.map((status) => (status === 'error' ? 'idle' : status)),
    );

    const notes = BUTTON_NOTES[index];
    if (!notes) {
      return;
    }

    play({ id: notes.down });
  }

  function handleClick(index: number) {
    if (isCompleteRef.current) {
      return;
    }

    const expected = CORRECT_SEQUENCE[stepRef.current];
    const lastCorrect = CORRECT_SEQUENCE[stepRef.current - 1];
    const notes = BUTTON_NOTES[index];

    if (stepRef.current > 0 && index === lastCorrect) {
      play({ id: 'cancel' });
      stepRef.current -= 1;

      setStatuses((currentStatuses) => {
        const nextStatuses = [...currentStatuses];
        nextStatuses[index] = 'idle';
        return nextStatuses;
      });

      return;
    }

    if (index === expected && notes) {
      play({ id: notes.up });

      setStatuses((currentStatuses) => {
        const nextStatuses = [...currentStatuses];
        nextStatuses[index] = 'correct';
        return nextStatuses;
      });

      stepRef.current += 1;

      if (stepRef.current >= CORRECT_SEQUENCE.length) {
        isCompleteRef.current = true;
        onComplete();
      }

      return;
    }

    const errorId =
      stepRef.current >= 2 ? 'error3' : sampleOne(['error1', 'error2']);
    play({ id: errorId });
    stepRef.current = 0;

    if (errorTimeoutRef.current !== null) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    setStatuses(ERROR_STATUSES);
  }

  return (
    <Wrapper>
      <DiamondsWrapper>
        {range(0, 4).map((index) => (
          <ButtonWrapper key={index} style={{ '--index': index }}>
            <DiamondButton
              type="button"
              onPointerDown={() => handlePointerDown(index)}
              onClick={() => handleClick(index)}
              data-has-won={hasWon}
            >
              <DecorativeDiamond data-status={statuses[index]}>
                <TopEdge />
                <BottomEdge />
              </DecorativeDiamond>
            </DiamondButton>
          </ButtonWrapper>
        ))}
      </DiamondsWrapper>
      <EngineWrapper>
        <Engine />
      </EngineWrapper>
    </Wrapper>
  );
}

interface DiamondButtonProps extends React.ComponentProps<'button'> {}

function DiamondButton({ children, ...delegated }: DiamondButtonProps) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  useButtonSounds(btnRef, 'synth-on', {
    volume: 0.15,
  });

  return (
    <Button ref={btnRef} {...delegated}>
      {children}
    </Button>
  );
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* We want to hide the bottom outline from Engine, which sits right against the bottom of the container: */
  overflow: hidden;
`;

const DiamondsWrapper = styled.div`
  position: absolute;
  left: 15.5px;
  top: 0;
  bottom: 0;
  margin-block: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  width: 20px;
  height: 20px;
  aspect-ratio: 1 / 1;
`;

const oscillateUpDown = keyframes`
  from {
    transform: translateY(-5%);
  }
  to {
    transform: translateY(5%);
  }
`;

const growShrink = keyframes`
  from {
    scale: 0.9;
  }
  to {
    scale: 1.2;
  }
`;

const Button = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  corner-shape: bevel;
  cursor: pointer;
  padding: 0;

  &[data-has-won='true'] {
    animation: ${growShrink} 600ms infinite alternate ease-in-out;
    animation-delay: calc(-10000ms + var(--index) * 200ms);
  }

  /* Expander on mobile */
  &::after {
    content: '';
    position: absolute;
    inset: -5px -3px;
  }
`;

const errorLights = keyframes`
  from {
    background: hsl(355deg 100% 60%);
    border-color: hsl(355deg 100% 26%);
  }
`;
const errorGlow = keyframes`
  from {
    opacity: 1;
    background: hsl(355deg 100% 50%);
  }
`;

const DecorativeDiamond = styled.span`
  --bw: 2px;
  --t: 300ms;
  position: relative;
  width: 13px;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: 2px solid var(--color-gray-400);
  background: var(--color-gray-100);
  transition:
    background var(--t),
    border-color var(--t);
  border-radius: inherit;
  corner-shape: bevel;

  /* Soft outer light, cast from the LED on the surrounding area */
  &::before {
    inset: -2px;
    corner-shape: inherit;
    filter: blur(4px);
    mix-blend-mode: soft-light;
  }
  /* White-hot center of the fake LED */
  &::after {
    inset: 3px;
    filter: blur(1px);
    mix-blend-mode: hard-light;
    background: white;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    opacity: 0;
    transition: opacity calc(var(--t) * 1.5);
  }

  ${Button}:active & {
    width: 10px;
  }
  &[data-status='correct'] {
    background: hsl(145deg 100% 60%);
    border-color: hsl(145deg 100% 30%);

    &::before {
      opacity: 1;
      background: hsl(145deg 100% 50%);
    }
    &::after {
      animation: fadeFromOpaque var(--t) backwards;
    }
  }

  &[data-status='error'] {
    animation: ${errorLights} var(--t) backwards;
    animation-delay: 200ms;

    &::before {
      animation: ${errorGlow} var(--t) backwards;
      mix-blend-mode: hard-light;
    }
    &::after {
      animation: fadeFromOpaque var(--t) backwards;
    }
  }
`;

const Edge = styled.span`
  --r: 50%;
  position: absolute;
  inset: calc(var(--bw) * -1);
  opacity: 0.25;
  corner-shape: bevel;
`;
const TopEdge = styled(Edge)`
  border-radius: var(--r) var(--r) 0 0;
  border-top: 1px solid white;
`;
const BottomEdge = styled(Edge)`
  border-radius: 0 0 var(--r) var(--r);
  border-bottom: 1px solid black;
`;

const EngineWrapper = styled.div`
  position: absolute;
  right: 17px;
  bottom: 0px;
  width: 98px;
  height: 16px;
`;

const Engine = styled.div`
  height: 100%;
  border: 3px solid var(--color-gray-250);
  border-top-width: 2px;
  background: var(--color-gray-50);
  outline: 2px solid var(--color-gray-100);
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  transform: skewX(-45deg);

  &::after {
    --stripe-width: 3px;
    content: '';
    position: absolute;
    inset: 2px;
    image-rendering: pixelated;
    background: repeating-linear-gradient(
      to right,
      var(--color-gray-400) 0px var(--stripe-width),
      transparent 2px calc(var(--stripe-width) * 2),
      var(--color-gray-250) calc(var(--stripe-width) * 2)
        calc(var(--stripe-width) * 3),
      transparent calc(var(--stripe-width) * 3) calc(var(--stripe-width) * 4)
    );
  }
`;

export default CodedLights;
