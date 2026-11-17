// A transport button inspired by Winamp’s rewind/play/pause/stop controls.
// The icons are drawn as 1px outlines on a pixel grid (hence the half-pixel coordinates), so the viewBox must match the rendered size to keep them crisp.
import * as React from 'react';
import styled from 'styled-components';

import VisuallyHidden from '@/components/VisuallyHidden';

const ICON_WIDTH = 19;
const ICON_HEIGHT = 15;

type Icon = 'rewind' | 'play' | 'pause' | 'stop';

const LABELS: Record<Icon, string> = {
  rewind: 'Rewind',
  play: 'Play',
  pause: 'Pause',
  stop: 'Stop',
};

type Props = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
  icon: Icon;
};

function MediaBtn({ icon, ...delegated }: Props) {
  return (
    <Wrapper type="button" {...delegated}>
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
  display: grid;
  place-items: center;
  width: 32px;
  height: 24px;
  padding: 0;
  margin: 0;
  background: hsl(240deg 8% 78%);
  border: 1px solid hsl(240deg 25% 8%);
  border-radius: 1px;
  box-shadow:
    inset 0px 1px 0px hsl(0deg 0% 100%),
    inset 0px -1px 0px hsl(240deg 15% 45%);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: translateY(2px);
  }

  &:focus-visible {
    /* Drawn inside the button, since the parent clips anything outside it */
    outline: 2px solid var(--color-primary);
    outline-offset: -3px;
  }
`;

const Svg = styled.svg`
  display: block;
  overflow: visible;

  & rect,
  & polygon {
    fill: hsl(240deg 8% 74%);
    stroke: hsl(240deg 8% 64%);
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
  stroke: hsl(240deg 15% 30%);
`;

const Highlight = styled(Edge)`
  stroke: hsl(0deg 0% 100%);
`;

export default MediaBtn;
