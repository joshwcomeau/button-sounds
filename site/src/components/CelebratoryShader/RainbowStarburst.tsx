// This effect is surprisingly complex; it displays a sunburst pattern (basically a CSS conic gradient with 90 solid stripes), and that pattern animates in two ways:
// 1. Each stripe cycles through the colors specified in PALETTE
// 2. The whole pattern rotates slowly clockwise
// There's also a two-part enter animation: the stripes appear two at a time from the topmost stripe, while the whole pattern also fades in.
import * as React from 'react';
import * as THREE from 'three/webgpu';
import type { Node } from 'three/webgpu';
import {
  atan,
  color,
  degrees,
  float,
  floor,
  int,
  mix,
  mod,
  positionLocal,
  smoothstep,
  step,
  uniform,
  vec2,
  vec3,
} from 'three/tsl';
import { useThree } from '@react-three/fiber';

import { DURATION, type TimeUniform } from './constants';

const PALETTE = [
  '#ff2a1f',
  '#ff8a1c',
  '#ffe14a',
  '#ffffff',
  '#ffe14a',
  '#ff8a1c',
];
// Width of each stripe, in degrees. 360 needs to be divisible by `STRIPE_WIDTH * PALETTE.length`, or there’ll be a seam where the pattern wraps around.
const STRIPE_WIDTH = 4;
// How far the whole pattern turns over the full duration, in degrees.
const ROTATION = 20;
// Every COLOR_SHIFT_INTERVAL seconds, each stripe takes on the next color in the palette, which makes the colors appear to race around the circle much faster than the pattern itself rotates.
const COLOR_SHIFT_INTERVAL = 0.1;
// Starburst patterns have a center point where all the stripes converge. We don't actually want to see this point, we want to zoom in on the top part of the pattern. CENTER_OFFSET specifies how far below the viewport, in percentage terms, the starburst's center is.
const CENTER_OFFSET = 0.25;
const OPACITY = 0.15;
// Over the first ENTER_DURATION seconds, the stripes appear one at a time, radiating outward from the center of the screen.
const ENTER_DURATION = 0.5;
// Each stripe fades in over this long once it appears, so the outermost stripes finish fading in slightly after ENTER_DURATION.
const ENTER_FADE_DURATION = ENTER_DURATION / 2;
const FADE_DURATION = 1;

interface Props {
  uTime: TimeUniform;
}

function RainbowStarburst({ uTime }: Props) {
  const size = useThree((state) => state.size);
  const { material, uViewport } = React.useMemo(() => {
    const uViewport = uniform(new THREE.Vector2(1, 1));

    // The plane is sized to the viewport, so its local coordinates are CSS pixels relative to the center of the screen. Moving down half the viewport reaches the bottom edge, and CENTER_OFFSET goes further from there.
    const center = vec2(0, uViewport.y.mul(-0.5 - CENTER_OFFSET));
    const offset = positionLocal.xy.sub(center);

    const rotation = uTime.div(DURATION).mul(ROTATION);
    // `atan` returns -180° to 180°. Shifting it to be positive keeps the `mod` below well-behaved, since WGSL’s remainder keeps the sign of the dividend.
    const angle = degrees(atan(offset.y, offset.x)).add(360).add(rotation);
    const stripeIndex = floor(angle.div(STRIPE_WIDTH));

    // The enter animation counts outward in whole stripes from the one pointing straight up at the start, so that each pair on either side of it appears at the same moment. The pattern rotates by less than a stripe during the enter animation, so this stripe stays near the center throughout.
    const centerStripeIndex = Math.floor((90 + 360) / STRIPE_WIDTH);
    const stripesFromCenter = stripeIndex.sub(centerStripeIndex).abs();
    // The bottom corners of the viewport are the widest angles on screen, so they determine how many stripes out the reveal needs to go. One extra stripe covers any slack from the rotation.
    const bottomCornerOffset = vec2(
      uViewport.x.mul(0.5),
      uViewport.y.mul(-0.5),
    ).sub(center);
    const cornerAngleFromCenter = float(90).sub(
      degrees(atan(bottomCornerOffset.y, bottomCornerOffset.x)),
    );
    const totalSteps = floor(cornerAngleFromCenter.div(STRIPE_WIDTH)).add(2);
    const revealTime = stripesFromCenter
      .add(1)
      .div(totalSteps)
      .mul(ENTER_DURATION);
    const enterFade = uTime
      .sub(revealTime)
      .div(ENTER_FADE_DURATION)
      .clamp(0, 1);
    const colorShift = floor(uTime.div(COLOR_SHIFT_INTERVAL));
    // Wrapping in integer space avoids float rounding errors, which would otherwise land the occasional stripe on the wrong color.
    const paletteIndex = float(
      mod(int(stripeIndex.add(colorShift)), int(PALETTE.length)),
    );

    const stripeColor = PALETTE.reduce<Node<'vec3'>>(
      (acc, hex, index) =>
        mix(acc, color(hex), step(index - 0.5, paletteIndex)),
      vec3(0),
    );

    const fade = float(1).sub(
      smoothstep(DURATION - FADE_DURATION, DURATION, uTime),
    );

    const material = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    material.colorNode = stripeColor;
    material.opacityNode = fade.mul(enterFade).mul(OPACITY);

    return { material, uViewport };
  }, [uTime]);

  React.useEffect(() => {
    uViewport.value.set(size.width, size.height);
  }, [uViewport, size.width, size.height]);

  React.useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    // Rendered before everything else, so that the other effects layer on top.
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[size.width, size.height]} />
    </mesh>
  );
}

export default RainbowStarburst;
