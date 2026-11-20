import {
  EighthNote,
  HalfNote,
  EighthNotes,
  type LucideIcon,
} from 'lucide-react';

import {
  convertDegreesToRadians,
  convertPolarToCartesian,
  random,
  sampleOne,
} from '@/utils';

// eslint-disable-next-line
const NOTE_ICONS: Array<LucideIcon> = [EighthNote, HalfNote, EighthNotes];

const ANGLE_MIN_DEGREES = -135;
const ANGLE_MAX_DEGREES = -45;
const DISTANCE_MIN_PX = 10;
const DISTANCE_MAX_PX = 30;
// Originally, each particle was given a random angle, but true randomness leads to clumpy results, where 3-4 notes in a row might all wind up in the same general spot. It feels unbalanced. So instead, we imagine an invisible arm sweeping from -135deg to -45deg, back and forth, firing the particle in that direction. This guarantees a relatively-even spread while still feeling random.
const ANGLE_SWEEP_ONE_WAY_MS = 2000;
// We do the same thing for distance, for the same reasons. To prevent a pattern from forming, I picked an especially random value:
const DISTANCE_SWEEP_ONE_WAY_MS = 3456;
const START_DISTANCE = 12;
const TRAVEL_DURATION_MIN_MS = 1200;
const TRAVEL_DURATION_MAX_MS = 1600;
const ROCK_DURATION_MIN_MS = 300;
const ROCK_DURATION_MAX_MS = 600;

export interface Particle {
  id: number;
  createdAt: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  travelDuration: number;
  rockDuration: number;
  Icon: LucideIcon;
}

let nextParticleId = 0;

function getSweepProgress(now: number, oneWayMs: number): number {
  const cycleMs = oneWayMs * 2;
  const phase = (now % cycleMs) / oneWayMs;

  return phase <= 1 ? phase : 2 - phase;
}

function getSweepAngle(now: number): number {
  const progress = getSweepProgress(now, ANGLE_SWEEP_ONE_WAY_MS);

  return ANGLE_MIN_DEGREES + progress * (ANGLE_MAX_DEGREES - ANGLE_MIN_DEGREES);
}

function getSweepDistance(now: number): number {
  const progress = getSweepProgress(now, DISTANCE_SWEEP_ONE_WAY_MS);

  return DISTANCE_MIN_PX + progress * (DISTANCE_MAX_PX - DISTANCE_MIN_PX);
}

export function createParticle(): Particle {
  const now = Date.now();
  const angle = getSweepAngle(now);
  const distance = getSweepDistance(now);

  const [startX, startY] = convertPolarToCartesian([
    convertDegreesToRadians(angle),
    START_DISTANCE,
  ]);
  const [endX, endY] = convertPolarToCartesian([
    convertDegreesToRadians(angle),
    START_DISTANCE + distance,
  ]);

  return {
    id: nextParticleId++,
    createdAt: now,
    startX,
    startY,
    endX,
    endY,
    travelDuration: random(TRAVEL_DURATION_MIN_MS, TRAVEL_DURATION_MAX_MS),
    rockDuration: random(ROCK_DURATION_MIN_MS, ROCK_DURATION_MAX_MS),
    Icon: sampleOne(NOTE_ICONS),
  };
}
