import * as React from 'react';
import styled, { keyframes } from 'styled-components';

// prettier-ignore
export type Action =
  | 'hovering'
  | 'pressing'
  | 'releasing'
  | 'leaving'
  | 'releasing-elsewhere';

const DURATIONS_BY_ACTION: Record<Action, number> = {
  hovering: 300,
  pressing: 0,
  releasing: 75,
  leaving: 300,
  'releasing-elsewhere': 300,
};

interface Props extends React.ComponentProps<'button'> {
  buttonAction: Action | null;
  setButtonAction: React.Dispatch<React.SetStateAction<Action | null>>;
  // When true, the button sinks down into its housing, and the mascot rises up out of it.
  isRetracted?: boolean;
}

function FancyButton({
  buttonAction,
  setButtonAction,
  isRetracted = false,
  ...props
}: Props) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const actionRef = React.useRef<Action | null>(null);
  React.useEffect(() => {
    actionRef.current = buttonAction;
  }, [buttonAction]);

  const handleMouseUp = React.useCallback(
    (ev: MouseEvent) => {
      const releasedWithinButton = wrapperRef.current?.contains(
        ev.target as Node,
      );
      setButtonAction(
        releasedWithinButton ? 'releasing' : 'releasing-elsewhere',
      );
    },
    [setButtonAction],
  );

  const handleMouseEnter = React.useCallback(() => {
    setButtonAction('hovering');

    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp, setButtonAction]);

  const handleMouseLeave = React.useCallback(() => {
    const action = actionRef.current;

    if (action !== 'pressing') {
      setButtonAction('leaving');
    }
  }, [setButtonAction]);

  const handleMouseDown = React.useCallback(() => {
    setButtonAction('pressing');
  }, [setButtonAction]);

  const handleKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLButtonElement>) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        setButtonAction('pressing');
      }
    },
    [setButtonAction],
  );

  const handleKeyUp = React.useCallback(
    (ev: React.KeyboardEvent<HTMLButtonElement>) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        setButtonAction('releasing');
      }
    },
    [setButtonAction],
  );

  const transitionDuration = buttonAction
    ? DURATIONS_BY_ACTION[buttonAction]
    : 0;

  return (
    <OuterWrapper
      type="button"
      inert={isRetracted}
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <Wrapper
        data-action={buttonAction}
        data-is-retracted={isRetracted}
        style={{
          '--transition-duration': transitionDuration + 'ms',
        }}

        ref={wrapperRef}
      >
        <Shaft />
        <CastShadow />
        <Clipper>
          <Front />
          <Face>
            Press me!
            <BottomShadow />
          </Face>
        </Clipper>
        <MascotClipper>
          <picture aria-hidden="true">
            <source srcSet="/images/josh-happy-dark.webp" type="image/webp" />
            <Mascot
              src="/images/josh-happy-dark.png"
              alt=""
              draggable={false}
            />
          </picture>
        </MascotClipper>
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.button`
  --focus-offset: 2px;
  --dot-size: 3px;
  position: relative;
  display: block;
  border: none;
  background: transparent;
  margin: 0;
  padding: 0;
  corner-shape: bevel;
  border-radius: 16px;

  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border: 2px dashed var(--color-gray-200);
    border-radius: 19px;
    corner-shape: inherit;
  }

  &:focus-visible::before {
    opacity: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Wrapper = styled.span`
  --outer-radius: 16px;
  --gap: 2px;
  --bw: 2px;
  position: relative;
  display: block;
  width: 15rem;
  max-width: 100%;
  height: 6rem;
  border: none;
  border-bottom: var(--bw) solid var(--color-gray-300);
  /*
    Ok so this mess of a declaration is because we have a 2px bottom border and no other borders. This means that in the bottom-left and bottom-right corners, the border fades away in a triangular fashion, which changes the perceived angle of the corner.
    We can fix this by using the long-form of border-radius, so that the disappearing border is parallel with the button face's beveled edges.
  */
  /* prettier-ignore */
  border-radius:
    var(--outer-radius) var(--outer-radius)
    var(--outer-radius) var(--outer-radius)
    / var(--outer-radius) var(--outer-radius)
    calc(var(--outer-radius) + var(--bw))
    calc(var(--outer-radius) + var(--bw));
  corner-shape: inherit;
  background: var(--color-background);

  /* Retracting and rising back up use different timings. These delays are choreographed with the MainDemo prize sequence: the button waits for the sidebars to start moving before sinking, and waits for the mascot to duck back down before rising. */
  --retract-transition: 500ms ease 350ms;
  --mascot-transition: var(--spring-smooth) var(--spring-smooth-duration);

  &[data-is-retracted='true'] {
    --retract-transition: 400ms ease 250ms;
    --mascot-transition: var(--spring-smooth) var(--spring-smooth-duration)
      650ms;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &[data-is-retracted='true'] {
      --retract-transition: 0ms;
      --mascot-transition: 0ms;
    }
  }
`;

const Front = styled.span`
  --dark: hsl(360deg 100% 26%);
  --light: hsl(353deg 100% 34%);
  position: absolute;
  left: var(--gap);
  right: var(--gap);
  bottom: 0;
  height: 50%;
  background:
    linear-gradient(to top, hsl(0deg 0% 0% / 0.2), transparent 4px),
    linear-gradient(
      to right,
      var(--dark) 0px var(--outer-radius),
      var(--light) var(--outer-radius) calc(100% - var(--outer-radius)),
      var(--dark) calc(100% - var(--outer-radius)) 100%
    );
  transition: translate var(--retract-transition);

  ${Wrapper}[data-is-retracted='true'] & {
    translate: 0 30px;
  }
`;
const Shaft = styled.span`
  --inset: 1px;
  --dark: var(--color-gray-75);
  --light: var(--color-gray-100);
  position: absolute;
  top: var(--inset);
  left: var(--inset);
  right: var(--inset);
  height: 100%;
  border-radius: inherit;
  corner-shape: inherit;
  background:
    linear-gradient(to top, hsl(210deg 15% 6% / 0.5), transparent),
    linear-gradient(to top, hsl(0deg 0% 0% / 0.2), transparent 4px),
    linear-gradient(
      to right,
      var(--dark) 0px var(--outer-radius),
      var(--light) var(--outer-radius) calc(100% - var(--outer-radius)),
      var(--dark) calc(100% - var(--outer-radius)) 100%
    );
`;

// A small detail: I want the button to rise up from deep within the machine on page load. We'll tackle this with a keyframe animation, applied to both the Face and the CastShadow (which mirrors the same animation)
const slideInShadow = keyframes`
  from {
    transform: translateY(0);
  }
`;

const CastShadow = styled.span`
  --size: 8px;
  position: absolute;
  display: block;
  bottom: 0;
  left: var(--gap);
  right: var(--gap);
  height: 50%;
  background: hsl(350deg 50% 10%);
  border-radius: 0 0 var(--outer-radius) var(--outer-radius);
  corner-shape: inherit;
  opacity: 0.5;
  transition:
    transform var(--transition-duration),
    opacity var(--retract-transition);
  transform: translateY(var(--size));
  pointer-events: none;

  ${Wrapper}[data-action="hovering"] &, ${Wrapper}[data-action="releasing"] & {
    --size: 16px;
  }
  ${Wrapper}[data-action="pressing"] & {
    --size: 0px;
  }
  /* With the button sunk into its housing, there's nothing left to cast a shadow. */
  ${Wrapper}[data-is-retracted='true'] & {
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${slideInShadow} 600ms cubic-bezier(0.07, 1, 0.325, 1) 250ms
      backwards;
  }
`;

const Clipper = styled.span`
  position: absolute;
  inset: 0;
  top: -16px;
  padding-top: 16px;
  overflow: hidden;
  border-radius: 0 0 var(--outer-radius) var(--outer-radius);
  corner-shape: inherit;
  transition: opacity var(--retract-transition);

  /* Fades out the Front and Face as they sink. */
  ${Wrapper}[data-is-retracted='true'] & {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(12px);
  }
`;

const Face = styled.span`
  --shadow-color: hsl(350deg 100% 10% / 0);
  position: relative;
  margin: var(--gap);
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 2 * var(--gap));
  height: calc(100% - 2 * var(--gap));
  background: linear-gradient(
    to bottom,
    hsl(350deg 100% 60%),
    hsl(350deg 100% 50%)
  );
  border-top: 2px solid hsl(340deg 100% 80%);
  border-radius: var(--outer-radius);
  corner-shape: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  text-shadow: 0px 1px 0px hsl(350deg 100% 10% / 0.25);
  overflow: hidden;
  user-select: none;
  box-shadow:
    inset 0px 1px 2px var(--shadow-color),
    inset 0px 2px 4px var(--shadow-color),
    inset 0px 4px 8px var(--shadow-color),
    inset 0px 8px 16px var(--shadow-color);

  @media (prefers-reduced-motion: no-preference) {
    transition:
      color var(--transition-duration),
      transform var(--transition-duration),
      text-shadow var(--transition-duration),
      border var(--transition-duration),
      --shadow-color var(--transition-duration),
      translate var(--retract-transition);
    animation: ${slideIn} 600ms cubic-bezier(0.07, 1, 0.325, 1) 250ms backwards;
  }

  /* The inverse of the slideIn animation: sink down a bit while the Clipper fades out. */
  ${Wrapper}[data-is-retracted='true'] & {
    translate: 0 30px;
  }

  @property --shadow-color {
    syntax: '<color>';
    inherits: false;
    initial-value: hsl(350deg 100% 10% / 0);
  }

  ${Wrapper}[data-action="hovering"] &,
  ${Wrapper}[data-action="releasing"] & {
    transform: translateY(-4px);
  }
  ${Wrapper}[data-action="pressing"] & {
    --shadow-color: hsl(350deg 100% 10% / 0.25);
    transform: translateY(8px);
    background: linear-gradient(
      to top,
      hsl(350deg 100% 47%),
      hsl(350deg 100% 30%)
    );
    border-top: 2px solid hsl(340deg 50% 26%);
    color: hsl(350deg 100% 90%);
    text-shadow: 0px -1px 0px hsl(350deg 100% 30%);
  }
`;

const BottomShadow = styled.span`
  --shadow-width: 8px;
  --corner-radius: calc(var(--outer-radius) + var(--shadow-width));
  position: absolute;
  /* We'll be blurring this border, which means if it rests right against the bottom, the blur radius will cause the very edge to be less opaque. We need the shadow to straddle the edge of the clipper, like an SVG line sitting right on the path: */
  top: calc(var(--shadow-width) * -0.5);

  /* Another annoying problem is that the start/end of the line terminates at a 45-degree angle, so we need the border to stick out beyond the left/right edges of the container, otherwise they'd end in a triangular shape. */
  left: calc(var(--shadow-width) * -1);
  right: calc(var(--shadow-width) * -1);
  /* Height doesn't have to be 100%, but it needs to be tall enough for the border-radius to be respected, and this is easier than figuring out the minimum viable value: */
  height: calc(100% - var(--outer-radius) * 2);
  border: var(--shadow-width) solid var(--color-background);
  border-bottom: none;
  border-radius: var(--corner-radius) var(--corner-radius) 0 0;
  corner-shape: inherit;
  opacity: 0;
  filter: blur(12px);
  mix-blend-mode: multiply;
  transition: opacity var(--transition-duration);
  pointer-events: none;

  ${Wrapper}[data-action="pressing"] & {
    opacity: 1;
  }
`;

// Like the Clipper, this hides everything below the bottom edge of the button, but it's tall enough that the mascot can stick up well above the top.
const MascotClipper = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 300px;
  overflow: hidden;
  border-radius: 0 0 var(--outer-radius) var(--outer-radius);
  corner-shape: inherit;
  pointer-events: none;
`;

const Mascot = styled.img`
  /* The bottom of the image stays tucked inside the housing. */
  --hidden-amount: 90px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(var(--hidden-amount) * -1);
  width: calc(275px / 2);
  height: calc(464px / 2);
  max-width: none;
  margin-inline: auto;
  user-select: none;
  translate: 0 100%;
  transition: translate var(--mascot-transition);

  ${Wrapper}[data-is-retracted='true'] & {
    translate: 0 0;
  }
`;

export default FancyButton;
