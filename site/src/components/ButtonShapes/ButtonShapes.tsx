import React from 'react';
import styled from 'styled-components';

import { normalize } from '@/utils';

interface Shape {
  id: string;
  // X/Y control the object-position shift, to select the shape from within the larger sprite image
  x: number;
  y: number;
  width: number;
  height: number;
  // translateX/translateY control the element's offset from the origin point (which is horizontally centered and vertically at the top of the page).
  translateX: number;
  translateY: number;
  mobile?: {
    translateX: number;
    translateY: number;
  };
  // How quickly should this element fade in? Normalized from 0-1.
  fadeScale: number;
}

export const SPRITE_SRC = '/images/button-sprite-condensed.webp';

const BACKGROUND_SHAPES: Array<Shape> = [
  {
    id: 'joystick',
    x: 0,
    y: 0,
    translateX: -850,
    translateY: 185,
    width: 255,
    height: 218,
    fadeScale: 1,
  },
  {
    id: 'rounded-keycap',
    x: 256,
    y: 0,
    translateX: -640,
    translateY: 25,
    width: 173,
    height: 186,
    fadeScale: 0.6,
  },
  {
    id: 'marsh-yellow',
    x: 424,
    y: 0,
    translateX: -420,
    translateY: -5,
    width: 178,
    height: 190,
    fadeScale: 0.2,
  },
  // {
  //   id: 'lock',
  //   x: 604,
  //   y: 0,
  //   translateX: 460,
  //   translateY: 475,
  //   width: 170,
  //   height: 220,
  //   fadeScale: 0.5,
  // },
  {
    id: 'blue-rect',
    x: 772,
    y: 46,
    translateX: 60,
    translateY: 55,
    width: 123,
    height: 85,
    fadeScale: 0,
  },
  {
    id: 'marsh-orange',
    x: 900,
    y: 15,
    translateX: 360,
    translateY: -2,
    width: 160,
    height: 164,
    fadeScale: 0.3,
  },
  {
    id: 'ps4-triangle',
    x: 1056,
    y: 10,
    translateX: 460,
    translateY: 120,
    width: 128,
    height: 150,
    fadeScale: 0.333,
  },
  {
    id: 'traditional-keycap-a',
    x: 1188,
    y: 10,
    translateX: -500,
    translateY: 150,
    width: 130,
    height: 150,
    fadeScale: 0.4,
  },
  {
    id: 'arcade-blue',
    x: 0,
    y: 226,
    translateX: -690,
    translateY: 600,
    width: 240,
    height: 230,
    fadeScale: 0.85,
  },
  {
    id: 'dpad',
    x: 248,
    y: 222,
    translateX: -650,
    translateY: 330,
    width: 146,
    height: 140,
    fadeScale: 0.7,
  },
  {
    id: 'marsh-red',
    x: 392,
    y: 200,
    translateX: -550,
    translateY: 300,
    width: 250,
    height: 230,
    fadeScale: 0.5,
  },
  {
    id: 'marsh-green',
    x: 638,
    y: 218,
    translateX: 550,
    translateY: 300,
    width: 208,
    height: 208,
    fadeScale: 0.75,
  },
  {
    id: 'btn',
    x: 874,
    y: 224,
    translateX: 350,
    translateY: 300,
    width: 110,
    height: 120,
    fadeScale: 0.335,
  },
  {
    id: 'die',
    x: 980,
    y: 202,
    translateX: 280,
    translateY: 170,
    width: 140,
    height: 140,
    fadeScale: 0.25,
  },
  {
    id: 'ps4-square',
    x: 0,
    y: 464,
    translateX: -340,
    translateY: 370,
    width: 130,
    height: 124,
    fadeScale: 0.28,
  },
  {
    id: 'purple-rect',
    x: 140,
    y: 454,
    translateX: 740,
    translateY: 170,
    width: 144,
    height: 122,
    fadeScale: 0.85,
  },
  {
    id: 'traditional-keycap-b',
    x: 286,
    y: 436,
    translateX: 690,
    translateY: 600,
    width: 160,
    height: 150,
    fadeScale: 0.75,
  },
  {
    id: 'arcade-yellow',
    x: 460,
    y: 444,
    translateX: 190,
    translateY: 400,
    width: 230,
    height: 212,
    fadeScale: 0.35,
  },
  {
    id: 'marsh-purple',
    x: 700,
    y: 434,
    translateX: 440,
    translateY: 800,
    width: 226,
    height: 222,
    fadeScale: 0.9,
  },
  {
    id: 'iidx',
    x: 945,
    y: 358,
    translateX: -530,
    translateY: 1090,
    width: 206,
    height: 258,
    fadeScale: 1,
  },
  {
    id: 'switch',
    x: 0,
    y: 590,
    translateX: 750,
    translateY: 800,
    width: 200,
    height: 70,
    fadeScale: 0.95,
  },
];

const FOREGROUND_SHAPES: Array<Shape> = [];

interface ShapeLayerProps {
  layer: 'background' | 'foreground';
}

export const ShapeLayer = React.memo(({ layer }: ShapeLayerProps) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const viewportSizeOnLoad = React.useRef<'mobile' | 'desktop' | null>(null);

  React.useEffect(() => {
    const start = Date.now();

    const img = new Image();
    img.src = SPRITE_SRC;
    img.onload = () => {
      const loadTime = Date.now() - start;

      // This image is pretty heavy (150kb+). If it takes more than 6 seconds to load, we won't bother showing it, since it would be jarring to have them randomly pop in after so much time.
      if (loadTime <= 6_000) {
        setHasLoaded(true);
        viewportSizeOnLoad.current =
          window.innerWidth < 44 * 16 ? 'mobile' : 'desktop';
      }
    };
  }, []);

  if (!hasLoaded) {
    return null;
  }

  const shapes = layer === 'background' ? BACKGROUND_SHAPES : FOREGROUND_SHAPES;

  return (
    <Wrapper data-layer={layer} data-has-loaded={hasLoaded}>
      {shapes.map((shape) => {
        // The shapes will be positioned differently on mobile vs desktop, but this is *not* dynamic. We evaluate the screen size when this image loads, and they don’t readjust if the viewport is resized. This produces a nicer experience, we don’t want stuff moving if the user resizes.
        const isMobile = viewportSizeOnLoad.current === 'mobile';

        const { translateX, translateY } = getShapePosition(shape, {
          isMobile,
        });

        const enterFadeDuration = normalize(shape.fadeScale, 0, 1, 550, 800);
        const enterFadeDelay = normalize(shape.fadeScale, 0, 1, 0, 500);

        return (
          <ImgWrapper
            key={shape.id}
            style={{
              top: 0,
              '--width': `${shape.width}px`,
              '--height': `${shape.height}px`,
              '--object-position': `-${shape.x}px -${shape.y}px`,
              '--enter-fade-duration': `${enterFadeDuration}ms`,
              '--enter-fade-delay': `${enterFadeDelay}ms`,
              transform: `
                  translate(
                    ${translateX}px,
                    ${translateY}px
                  )
                  scale(0.5)`,
            }}
          >
            <img draggable={false} alt="" src={SPRITE_SRC} />
          </ImgWrapper>
        );
      })}
    </Wrapper>
  );
});

function getShapePosition(
  shape: Shape,
  {
    isMobile,
  }: {
    isMobile: boolean;
  },
) {
  const baseTranslateX = isMobile
    ? (shape.mobile?.translateX ?? shape.translateX)
    : shape.translateX;
  const baseTranslateY = isMobile
    ? (shape.mobile?.translateY ?? shape.translateY)
    : shape.translateY;

  return {
    translateX: baseTranslateX,
    translateY: baseTranslateY,
  };
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  overflow: clip;
  transition: opacity 300ms ease-in-out;
  pointer-events: none;
`;

const ImgWrapper = styled.div`
  position: absolute;
  left: 50%;
  width: var(--width);
  height: var(--height);
  transform-origin: top left;
  transform: var(--transform);
  user-select: none;
  animation: fadeFromTransparent var(--enter-fade-duration)
    var(--enter-fade-delay) backwards cubic-bezier(0.3, 0, 0.15, 1);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: none;
    object-position: var(--object-position);
  }
`;
