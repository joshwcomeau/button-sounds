import * as React from 'react';
import * as THREE from 'three/webgpu';
import {
  color,
  cos,
  exp,
  float,
  hash,
  instanceIndex,
  length,
  mix,
  sin,
  smoothstep,
  step,
  uniform,
  vec2,
  vec3,
} from 'three/tsl';
import { useThree } from '@react-three/fiber';

import { DURATION, PIXEL_SCALE, type TimeUniform } from './constants';

const PARTICLE_COUNT = 4000;
const MIN_LIFE = 0.5;
const MAX_LIFE = 1.4;
// Launch angles, in degrees. 0 is horizontal, pointing inward (rightward for the left sparkler, leftward for the right one), 90 is straight up.
const MIN_ANGLE = 30;
const MAX_ANGLE = 65;
const DRAG = 1.2;

interface Props {
  uTime: TimeUniform;
}

function Sparklers({ uTime }: Props) {
  const size = useThree((state) => state.size);

  const { material, uViewport } = React.useMemo(() => {
    const uViewport = uniform(new THREE.Vector2(1, 1));

    const rand = (seed: number) => hash(instanceIndex.add(seed));

    const halfWidth = uViewport.x.mul(0.5);
    const halfHeight = uViewport.y.mul(0.5);
    const diagonal = length(uViewport);

    // 0 for the bottom-left corner, 1 for the bottom-right.
    const side = step(0.5, rand(0));
    const corner = vec2(
      mix(halfWidth.negate(), halfWidth, side),
      halfHeight.negate(),
    );

    const angle = mix(
      THREE.MathUtils.degToRad(MIN_ANGLE),
      THREE.MathUtils.degToRad(MAX_ANGLE),
      rand(1),
    );
    // Mirrored for the right-hand sparkler, so that both point inward.
    const inward = mix(1, -1, side);
    const direction = vec2(cos(angle).mul(inward), sin(angle));

    // Squaring the random value clusters spawns toward the start, so the number of live particles tapers off over the duration. Every particle is guaranteed to finish before DURATION.
    const spawnTime = rand(2)
      .pow(2)
      .mul(DURATION - MAX_LIFE);
    const life = mix(MIN_LIFE, MAX_LIFE, rand(3));
    const age = uTime.sub(spawnTime);
    const progress = age.div(life);
    const isAlive = step(0, age).mul(float(1).sub(step(1, progress)));

    // Later sparks launch a bit slower, as though the sparkler is running out of steam.
    const speed = diagonal
      .mul(mix(0.3, 0.9, rand(4)))
      .mul(mix(1, 0.75, spawnTime.div(DURATION)));
    // Closed-form distance travelled under linear drag.
    const distance = speed.div(DRAG).mul(float(1).sub(exp(age.mul(-DRAG))));
    const gravity = diagonal.mul(0.3);
    const drop = gravity.mul(0.5).mul(age).mul(age);

    const position = corner.add(direction.mul(distance)).sub(vec2(0, drop));

    const sparkColor = mix(
      mix(
        mix(color('#fffbe8'), color('#ffe14a'), smoothstep(0, 0.25, progress)),
        color('#ff8a1c'),
        smoothstep(0.25, 0.6, progress),
      ),
      color('#e0241a'),
      smoothstep(0.6, 1, progress),
    );
    const opacity = mix(
      mix(float(1), float(0.8), smoothstep(0.25, 0.6, progress)),
      float(0),
      smoothstep(0.6, 1, progress),
    );

    // Most sparks are a single low-res pixel, but a few are 2×2 to add some variety.
    const pixelSize = float(PIXEL_SCALE).mul(float(1).add(step(0.85, rand(5))));

    const material = new THREE.SpriteNodeMaterial({
      transparent: true,
      depthWrite: false,
    });
    material.positionNode = vec3(position, 0);
    material.colorNode = sparkColor;
    material.opacityNode = opacity.mul(isAlive);
    material.scaleNode = pixelSize.mul(isAlive);

    return { material, uViewport };
  }, [uTime]);

  React.useEffect(() => {
    uViewport.value.set(size.width, size.height);
  }, [uViewport, size.width, size.height]);

  React.useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <sprite material={material} count={PARTICLE_COUNT} frustumCulled={false} />
  );
}

export default Sparklers;
