import * as React from 'react';
import styled from 'styled-components';
import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import { Canvas, extend, useFrame } from '@react-three/fiber';

import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

import InPortal from '@/components/InPortal';

import { DURATION, PIXEL_SCALE, type TimeUniform } from './constants';
import RainbowStarburst from './RainbowStarburst';
import Sparklers from './Sparklers';

// r3f’s JSX elements need to resolve to the node-material-friendly classes from `three/webgpu`, rather than the WebGL-only defaults.
extend(THREE as unknown as Parameters<typeof extend>[0]);

interface Props {
  onComplete: () => void;
}

function CelebratoryShader({ onComplete }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion) {
      window.setTimeout(() => {
        onComplete();
      }, DURATION * 1000);
    }
  }, [prefersReducedMotion, onComplete]);

  React.useEffect(() => {
    // Applied to the root element rather than `<body>`, since a filter on any other element creates a containing block for `position: fixed` descendants, which would break the shader overlay (and anything else that’s fixed to the viewport).
    const root = document.documentElement;
    const fadeOutDuration = 1500;

    root.style.transition = 'filter 600ms';
    root.style.filter = 'brightness(190%) saturate(120%) contrast(150%)';

    const timeoutId = window.setTimeout(
      () => {
        root.style.transition = `filter ${fadeOutDuration}ms`;
        root.style.filter = '';
      },
      DURATION * 1000 - fadeOutDuration,
    );

    return () => {
      window.clearTimeout(timeoutId);
      root.style.filter = '';
    };
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <InPortal id="celebratory-shader-wrapper">
      <Wrapper aria-hidden="true">
        <Canvas
          orthographic
          flat
          dpr={1 / PIXEL_SCALE}
          style={{ pointerEvents: 'none' }}
          gl={async ({ canvas }) => {
            const renderer = new THREE.WebGPURenderer({
              canvas: canvas as HTMLCanvasElement,
              alpha: true,
              antialias: false,
            });
            await renderer.init();
            return renderer;
          }}
        >
          <Effects onComplete={onComplete} />
        </Canvas>
      </Wrapper>
    </InPortal>
  );
}

function Effects({ onComplete }: Props) {
  const [uTime] = React.useState<TimeUniform>(() => uniform(0));
  const elapsedRef = React.useRef(0);
  const hasCompletedRef = React.useRef(false);

  useFrame((_, delta) => {
    // Clamp the delta so that the effects don’t skip ahead if the tab was backgrounded.
    elapsedRef.current += Math.min(delta, 1 / 20);
    // Three.js uniforms are mutable by design, and updating one doesn’t affect React rendering.
    // eslint-disable-next-line react-hooks/immutability
    uTime.value = elapsedRef.current;

    if (elapsedRef.current >= DURATION && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }
  });

  return (
    <>
      <RainbowStarburst uTime={uTime} />
      <Sparklers uTime={uTime} />
    </>
  );
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  canvas {
    image-rendering: pixelated;
  }
`;

export default CelebratoryShader;
