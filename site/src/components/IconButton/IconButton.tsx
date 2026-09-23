import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge';

const OUTER_RADIUS = 8;
const HEIGHT = 2.75;

interface Props extends React.ComponentProps<'button'> {
  icon: React.ReactNode;
  color?: string;
}

function IconButton({ icon, children, color, ...props }: Props) {
  const [isPressedWithKeyboard, setIsPressedWithKeyboard] =
    React.useState(false);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressedWithKeyboard(true);
    }

    if (props.onKeyDown) {
      props.onKeyDown(event);
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressedWithKeyboard(false);
    }

    if (props.onKeyUp) {
      props.onKeyUp(event);
    }
  }
  return (
    <Wrapper
      type="button"
      data-is-depressed={isPressedWithKeyboard}
      {...props}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <Shaft />
      <BevelEdge
        side="top"
        color="var(--color-gray-50)"
        radius={OUTER_RADIUS}
      />
      <BevelEdge
        side="bottom"
        color="var(--color-gray-500)"
        radius={OUTER_RADIUS}
      />
      <CastShadow style={{ '--face-color': color }} />
      <Clipper>
        <Slider>
          <Front />
          <Face>
            <BevelEdge
              side="top"
              color="var(--color-gray-400)"
              radius={OUTER_RADIUS - 1}
            />
            <BevelEdge
              side="bottom"
              color="hsl(210deg 15% 5% / 0.15)"
              radius={OUTER_RADIUS - 1}
            />
            <IconSlot>
              <IconWrapper>{icon}</IconWrapper>
            </IconSlot>
            {children}
          </Face>
          <Colorizer style={{ '--face-color': color }} />
        </Slider>
      </Clipper>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  --focus-offset: 0px;
  position: relative;
  display: block;
  height: ${HEIGHT}rem;
  padding: 1px;
  margin: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: ${OUTER_RADIUS}px;
  background: black;
  corner-shape: bevel;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Shaft = styled.span`
  --inset: ${OUTER_RADIUS}px;
  --side: var(--color-gray-50);
  --center: var(--color-gray-75);
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    var(--side) 0px var(--inset),
    var(--center) var(--inset) calc(100% - var(--inset)),
    var(--side) calc(100% - var(--inset)) 100%
  );
  border-radius: ${OUTER_RADIUS}px;
  corner-shape: inherit;
`;

const CastShadow = styled.span`
  --size: 4px;
  --gap: 0px;
  position: absolute;
  display: block;
  bottom: 0;
  left: var(--gap);
  right: var(--gap);
  height: 50%;
  background: black;
  background: color-mix(in srgb, black 85%, var(--face-color));
  border-radius: 0 0 ${OUTER_RADIUS}px ${OUTER_RADIUS}px;
  corner-shape: inherit;
  opacity: 0.5;
  transition:
    transform 150ms,
    background 150ms;
  transform: translateY(var(--size));
  pointer-events: none;

  ${Wrapper}:hover & {
    --size: 8px;
  }
  ${Wrapper}:active &, ${Wrapper}[data-is-depressed='true'] & {
    --size: 0px;
    transition: transform 0ms;
  }
`;
const Clipper = styled.span`
  position: relative;
  display: block;
  height: calc(100% + 1rem);
  margin-top: -1rem;
  padding-top: 1rem;
  border-radius: ${OUTER_RADIUS}px ${OUTER_RADIUS}px ${OUTER_RADIUS - 1}px
    ${OUTER_RADIUS - 1}px;
  corner-shape: inherit;
  overflow: hidden;
`;

const Slider = styled.span`
  position: relative;
  display: block;
  height: 100%;
  border-radius: inherit;
  corner-shape: inherit;
  transition: transform 150ms;

  ${Wrapper}:hover & {
    transform: translateY(-2px);
  }

  ${Wrapper}:active &, ${Wrapper}[data-is-depressed='true'] & {
    transform: translateY(4px);
    transition: transform 0ms;
  }
`;

const Front = styled.span`
  --side: hsl(210deg 17% 9%);
  --center: hsl(210deg 17% 12%);
  --inset: ${OUTER_RADIUS - 1}px;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: -10px;
  background: linear-gradient(
    to right,
    var(--side) 0px var(--inset),
    var(--center) var(--inset) calc(100% - var(--inset)),
    var(--side) calc(100% - var(--inset)) 100%
  );

  border-radius: inherit;
  corner-shape: inherit;
`;

const Face = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--face-gap, 1rem);
  height: 100%;
  padding-inline: 4px;
  background: linear-gradient(
    to bottom,
    var(--color-gray-200),
    var(--color-gray-100)
  );
  border: 1px solid var(--color-gray-100);
  border-radius: ${OUTER_RADIUS - 1}px;
  corner-shape: inherit;
  font-weight: 600;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(to bottom, black, transparent);
    border-radius: inherit;
    corner-shape: inherit;
    mix-blend-mode: multiply;
    opacity: 0;
    transition: opacity 250ms;
  }

  ${Wrapper}:active &, ${Wrapper}[data-is-depressed='true'] & {
    background: linear-gradient(
      to top,
      var(--color-gray-200),
      var(--color-gray-100)
    );

    &::after {
      transition: opacity 50ms;
      opacity: 0.3;
    }
  }
`;

const IconSlot = styled.span`
  display: grid;
  place-items: center;
  flex: none;
  width: calc(${HEIGHT}rem - 6px * 2);
  aspect-ratio: 1;
  background: var(--color-gray-250);
  border-radius: 4px;
  corner-shape: inherit;
  box-shadow:
    inset 0 -1px 0 var(--color-gray-50),
    inset 0 2px 0 var(--color-gray-400);

  ${Wrapper}:active &, ${Wrapper}[data-is-depressed='true'] & {
    box-shadow:
      inset 0 2px 0 var(--color-gray-50),
      inset 0 -1px 0 var(--color-gray-400);
  }
`;

const IconWrapper = styled.span`
  display: block;

  ${Wrapper}:active &, ${Wrapper}[data-is-depressed='true'] & {
    transform: translateY(2px);
  }
`;

const Colorizer = styled.span`
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -10px;
  height: calc(${HEIGHT}rem + 6px);
  background: var(--face-color);
  border-radius: inherit;
  corner-shape: inherit;
  opacity: 1;
  mix-blend-mode: color;
  transition: background 150ms;
`;

export default IconButton;
