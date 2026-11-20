// A transport button inspired by Winamp’s main control buttons
// The icons are drawn as 1px outlines on a pixel grid (hence the half-pixel coordinates), so the viewBox must match the rendered size to keep them crisp.
import * as React from 'react';
import styled from 'styled-components';
import { useButtonSounds } from 'button-sounds/react';

import VisuallyHidden from '@/components/VisuallyHidden';

const ICON_WIDTH = 19;
const ICON_HEIGHT = 15;

type Icon = 'rewind' | 'play' | 'pause' | 'stop' | 'fast-forward' | 'eject';

const LABELS: Record<Icon, string> = {
  rewind: 'Rewind',
  play: 'Play',
  pause: 'Pause',
  stop: 'Stop',
  'fast-forward': 'Fast-forward',
  eject: 'Eject',
};

type Props = Omit<React.ComponentProps<'button'>, 'children'> & {
  icon: Icon;
};

function MediaBtn({ icon, ref, ...delegated }: Props) {
  const internalRef = React.useRef<HTMLButtonElement>(null);
  const actualRef = ref ?? internalRef;

  useButtonSounds(
    actualRef as React.RefObject<HTMLButtonElement>,
    'sd-metallic',
    {
      volume: 0.2,
      pitchVariation: 0.1,
    },
  );

  return (
    <Wrapper ref={actualRef} type="button" {...delegated}>
      <MediaIcon icon={icon} />
      <VisuallyHidden>{LABELS[icon]}</VisuallyHidden>
    </Wrapper>
  );
}

// Light comes from directly above, so each recessed shape’s top edges are in shadow and its bottom edges catch the light. SVG can’t color individual edges of a shape, so those edges are traced separately on top of it.
const ICONS: Record<
  Icon,
  { shapes: React.ReactNode; shadow: string; highlight: string }
> = {
  rewind: {
    shapes: (
      <>
        <rect x={3.5} y={1.5} width={2} height={12} />
        <polygon points="8.5,7.5 15.5,1.5 15.5,13.5" />
      </>
    ),
    shadow: 'M3.5 1.5 H5.5 M8.5 7.5 L15.5 1.5',
    highlight: 'M3.5 13.5 H5.5 M8.5 7.5 L15.5 13.5',
  },
  play: {
    shapes: <polygon points="3.5,1.5 15.5,7.5 3.5,13.5" />,
    shadow: 'M3.5 1.5 L15.5 7.5',
    highlight: 'M3.5 13.5 L15.5 7.5',
  },
  pause: {
    shapes: (
      <>
        <rect x={3.5} y={1.5} width={4} height={12} />
        <rect x={11.5} y={1.5} width={4} height={12} />
      </>
    ),
    shadow: 'M3.5 1.5 H7.5 M11.5 1.5 H15.5',
    highlight: 'M3.5 13.5 H7.5 M11.5 13.5 H15.5',
  },
  stop: {
    shapes: <rect x={3.5} y={1.5} width={12} height={12} />,
    shadow: 'M3.5 1.5 H15.5',
    highlight: 'M3.5 13.5 H15.5',
  },
  'fast-forward': {
    shapes: (
      <>
        <polygon points="3.5,1.5 10.5,7.5 3.5,13.5" />
        <rect x={13.5} y={1.5} width={2} height={12} />
      </>
    ),
    shadow: 'M3.5 1.5 L10.5 7.5 M13.5 1.5 H15.5',
    highlight: 'M3.5 13.5 L10.5 7.5 M13.5 13.5 H15.5',
  },
  eject: {
    shapes: (
      <>
        <polygon points="3.5,8.5 9.5,1.5 15.5,8.5" />
        <rect x={3.5} y={11.5} width={12} height={2} />
      </>
    ),
    shadow: 'M3.5 8.5 L9.5 1.5 L15.5 8.5 M3.5 11.5 H15.5',
    highlight: 'M3.5 8.5 H15.5 M3.5 13.5 H15.5',
  },
};

function MediaIcon({ icon }: { icon: Icon }) {
  const { shapes, shadow, highlight } = ICONS[icon];

  return (
    <Svg
      width={ICON_WIDTH}
      height={ICON_HEIGHT}
      viewBox={`0 0 ${ICON_WIDTH} ${ICON_HEIGHT}`}
      aria-hidden="true"
    >
      {shapes}
      <Shadow d={shadow} />
      <Highlight d={highlight} />
    </Svg>
  );
}

const Wrapper = styled.button`
  --adjusted-radius: calc(var(--corner-radius) - 1px);
  --bg-top: hsl(240deg 40% 85%);
  --bg-bottom: hsl(240deg 30% 72%);
  --icon-fill: hsl(240deg 28% 74%);
  --icon-stroke: hsl(240deg 28% 64%);
  --icon-shadow: hsl(240deg 15% 20%);
  --icon-highlight: hsl(0deg 0% 100%);
  --shadow-color: red;
  --shift-by: 2px;
  --reset-duration: 150ms;
  position: relative;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 1.5rem;
  padding: 0;
  margin: 0;
  background: linear-gradient(to bottom, var(--bg-top), var(--bg-bottom));
  border: none;
  border-radius: 2px;
  corner-shape: bevel;
  box-shadow:
    inset 0px 1px 0px hsl(0deg 0% 100%),
    inset 0px -1px 0px hsl(240deg 15% 45%);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--reset-duration);

  &:first-child {
    border-top-left-radius: var(--adjusted-radius);
    border-bottom-left-radius: var(--adjusted-radius);
  }
  &:last-child {
    border-top-right-radius: var(--adjusted-radius);
    border-bottom-right-radius: var(--adjusted-radius);
  }

  /* A shadow that spreads across the bottom of the keys when pushed in */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background: linear-gradient(
      to top,
      hsl(240deg 100% 5%) 0px var(--shift-by),
      transparent
    );

    opacity: 0.35;
    transform: translateY(100%);
    transition: transform var(--reset-duration);
  }

  &:active {
    --bg-top: hsl(240deg 30% 75%);
    --bg-bottom: hsl(240deg 20% 60%);
    --icon-fill: hsl(240deg 24% 55%);
    --icon-stroke: hsl(240deg 20% 50%);
    --icon-shadow: hsl(240deg 15% 10%);
    --icon-highlight: hsl(240deg 50% 80%);
    transform: translateY(var(--shift-by));
    transition: none;
    background: hsl(240deg 20% 60%);
    box-shadow: none;

    &::after {
      transform: translateY(calc(var(--shift-by) * -1px));
      transition: none;
    }
  }

  &:focus-visible {
    /* Drawn inside the button, since the parent clips anything outside it */
    outline-offset: 1px;
    /* Lift this button up so that its focus outline sits above its siblings */
    position: relative;
    z-index: 2;
    /* The focus outline is partially obscured by 'overflow: hidden', so let's also add a lighter background color for focused elements */
    --bg-top: hsl(240deg 100% 100%);
    --bg-bottom: hsl(240deg 50% 90%);
    --icon-fill: hsl(240deg 38% 90%);
    --icon-stroke: hsl(240deg 38% 75%);
    --icon-shadow: hsl(240deg 10% 50%);
    --icon-highlight: hsl(0deg 0% 100%);
  }
`;

const Svg = styled.svg`
  display: block;
  overflow: visible;

  & rect,
  & polygon {
    fill: var(--icon-fill);
    stroke: var(--icon-stroke);
    stroke-width: 1px;
    stroke-linejoin: miter;
  }
`;

const Edge = styled.path`
  fill: none;
  stroke-width: 1px;
  /* Extends each line by half a pixel, so it covers the corners of the outline beneath */
  stroke-linecap: square;
`;

const Shadow = styled(Edge)`
  stroke: var(--icon-shadow);
`;

const Highlight = styled(Edge)`
  stroke: var(--icon-highlight);
`;

export default MediaBtn;
