import type { UniformNode } from 'three/webgpu';

// The canvas renders at 1/PIXEL_SCALE of the viewport resolution and gets scaled back up with `image-rendering: pixelated`, for a chunky retro look.
export const PIXEL_SCALE = 8;

// Total length of the celebration, in seconds. Every effect should be finished by this point, since the canvas unmounts.
export const DURATION = 5;

// Seconds since the celebration started. A single uniform is shared by every effect, so they stay in sync.
export type TimeUniform = UniformNode<'float', number>;
