import * as React from 'react';
import styled, { keyframes } from 'styled-components';

type Mood = 'happy' | 'vhappy';

const JOSH_SPRITESHEET_SRC = '/images/josh-spritesheet-dumpling.webp';

const AVATAR_DATA: Record<
  Mood,
  { x: number; y: number; angle: number; alt: string }
> = {
  happy: {
    x: 0,
    y: 16,
    angle: 0,
    alt: 'A very handsome fella with swoopy hair',
  },
  vhappy: {
    x: 25,
    y: 8,
    angle: 0,
    alt: 'A very handsome fella with a dopey grin',
  },
};

function TaughtByJosh() {
  const [mood, setMood] = React.useState<Mood>('happy');
  const [hasLoadedImage, setHasLoadedImage] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = JOSH_SPRITESHEET_SRC;
    img.onload = () => {
      setHasLoadedImage(true);
    };
  }, []);

  return (
    <Wrapper>
      <KeyboardFocusRing data-kbd-focus-ring />

      {hasLoadedImage && (
        <Author>
          <AvatarButton
            onFocus={() => {
              if (mood === 'happy') {
                setMood('vhappy');
              }
            }}
            onBlur={() => {
              if (mood === 'vhappy') {
                setMood('happy');
              }
            }}
          >
            <AvatarWrapper>
              <AvatarClipper>
                <AvatarPlunger>
                  <Avatar
                    src={JOSH_SPRITESHEET_SRC}
                    alt={AVATAR_DATA[mood].alt}
                    style={{
                      objectPosition: `${AVATAR_DATA[mood].x}% 0`,
                      transform: `translateY(${AVATAR_DATA[mood].y}%) rotate(${AVATAR_DATA[mood].angle}deg)`,
                    }}
                  />
                </AvatarPlunger>
              </AvatarClipper>
            </AvatarWrapper>
          </AvatarButton>
          <div>
            A project by{' '}
            <JoshLink
              draggable={false}
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.joshwcomeau.com/"
              onMouseEnter={() => {
                if (mood === 'happy') {
                  setMood('vhappy');
                }
              }}
              onMouseLeave={() => {
                if (mood === 'vhappy') {
                  setMood('happy');
                }
              }}
            >
              Josh W. Comeau
            </JoshLink>
          </div>
        </Author>
      )}
    </Wrapper>
  );
}

const ROW_HEIGHT = 3.75;

const Wrapper = styled.div`
  --spring: cubic-bezier(0.17, 0.67, 0.36, 0.99);
  --enter-delay: 200ms;
  @supports (animation: linear(0, 1)) {
    /* prettier-ignore */
    --spring: linear(0, 0.012 0.9%, 0.049 2%, 0.409 9.3%, 0.513 11.9%, 0.606 14.7%, 0.691 17.9%, 0.762 21.3%, 0.82 25%, 0.868 29.1%, 0.907 33.6%, 0.937 38.7%, 0.976 51.3%, 0.994 68.8%, 1);
  }

  position: relative;
  height: ${ROW_HEIGHT}rem;
  transition: opacity 400ms var(--spring) 400ms;
  animation: fadeFromTransparent 500ms var(--spring) var(--enter-delay)
    backwards;
  isolation: isolate;

  &[data-selected-tool='wand']:hover,
  &[data-selected-tool='wand']:focus-visible {
    border-radius: 1000px;
    outline: 3px dashed hsl(50deg 100% 50%);
    outline-offset: 16px !important;
  }

  @media (max-width: 25rem) {
    margin-bottom: 2rem;
  }
`;

const KeyboardFocusRing = styled.div`
  opacity: 0;
  position: absolute;
  inset: 0;
  border-radius: 1000px;
  outline-offset: 12px !important;
  pointer-events: none;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  color: var(--color-gray-700);
  font-size: 1rem;

  @media (max-width: 25rem) {
    flex-direction: column;
  }
`;

const JoshLink = styled.a`
  display: inline-block;
  font-weight: 600;
  color: white;
  text-decoration: none;
`;

const AvatarButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  outline: none;
`;

const AvatarWrapper = styled.span`
  --inset-by: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: ${ROW_HEIGHT}rem;
  height: ${ROW_HEIGHT}rem;
  border-radius: 50%;
  outline: 1px solid var(--color-gray-300);
  outline-offset: var(--inset-by);

  /* Fill in the circle created by the offset outline, so that when dragging this fella around, the avatar background is opaque */
  &::before {
    content: '';
    position: absolute;
    inset: calc(var(--inset-by) * -1);
    background-color: var(--color-background);
    border-radius: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    left: calc(var(--inset-by) * -1);
    bottom: calc(var(--inset-by) * -1);
    right: calc(var(--inset-by) * -1);
    height: calc(50% + var(--inset-by));
    border: var(--inset-by) solid var(--color-background);
    border-top: 0;
    border-radius: 0 0 1000px 1000px;
  }
`;

const AvatarPlunger = styled.span`
  transform-origin: 50% 95%;
  display: block;
`;

const AvatarClipper = styled.span`
  position: relative;
  width: calc(100% + 5px);
  margin-left: 0px;
  /* Needs to be “min-height” for Safari */
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  overflow: clip;
  border-radius: 0 0 1000px 1000px;
`;

const riseIn = keyframes`
  from {
    transform: translateY(50%);
  }
`;

const Avatar = styled.img`
  display: block;
  width: 75px;
  min-width: 75px;
  height: 110px;
  object-fit: cover;
  object-position: 100% 0;
  transition: opacity 800ms var(--spring) 200ms;
  animation: ${riseIn} 1000ms calc(var(--enter-delay) - 100ms) var(--spring)
    backwards;

  pointer-events: none;
  transform-origin: 50% 75%;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      transform 500ms var(--spring),
      opacity 800ms var(--spring) 200ms;
  }
`;

export default React.memo(TaughtByJosh);
