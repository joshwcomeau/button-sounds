import * as React from 'react';
import styled from 'styled-components';

import { QUARTER_NOTE_MS } from '@/constants';
import useInterval from '@/hooks/use-interval';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

const SHIFT_INTERVAL = QUARTER_NOTE_MS;

const RAINBOW_STRIPE_COLORS = [
  'hsl(350deg 100% 60%)',
  'hsl(45deg 100% 55%)',
  'hsl(130deg 100% 70%)',
  'hsl(210deg 100% 75%)',
  'hsl(250deg 100% 70%)',
  'hsl(320deg 100% 65%)',
];

function RainbowBorder({
  style,
  ...delegated
}: React.ComponentPropsWithoutRef<'div'>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [colors, setColors] = React.useState(RAINBOW_STRIPE_COLORS);

  useInterval(
    () => {
      setColors((current) => {
        const [first, ...rest] = current;
        if (first === undefined) {
          return current;
        }
        return [...rest, first];
      });
    },
    prefersReducedMotion ? null : SHIFT_INTERVAL,
  );

  return (
    <Stripe
      {...delegated}
      style={{
        ...style,
        background: generateRainbowGradient({
          colors,
          stripeWidth: 4,
          gapWidth: 2,
        }),
      }}
    />
  );
}

function generateRainbowGradient({
  colors,
  stripeWidth,
  gapWidth,
  angle = 135,
}: {
  colors: readonly string[];
  stripeWidth: number;
  gapWidth: number;
  angle?: number;
}) {
  const tile = stripeWidth + gapWidth;

  const stops = colors.flatMap((color, index) => {
    const stripeStart = index * tile;
    const stripeEnd = stripeStart + stripeWidth;
    const gapEnd = stripeEnd + gapWidth;

    return [
      `${color} ${stripeStart}px ${stripeEnd}px`,
      `transparent ${stripeEnd}px ${gapEnd}px`,
    ];
  });

  return `repeating-linear-gradient(${angle}deg, ${stops.join(', ')})`;
}

const Stripe = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  outline: 2px solid var(--color-background);
  border-radius: 0px 0px 4px 4px;
  corner-shape: bevel;
`;

export default RainbowBorder;
