import * as React from 'react';

import useInterval from '@/hooks/use-interval';

const TICK_MS = 100;

interface Props {
  from: number;
  to: number;
  // How long to wait before starting the climb, in milliseconds.
  delay: number;
  // How long the climb takes, in milliseconds.
  duration: number;
  decimalPlaces: number;
  // Shown until the climb starts. Defaults to `from`.
  placeholder?: string;
}

function ClimbingNumber({
  from,
  to,
  delay,
  duration,
  decimalPlaces,
  placeholder,
}: Props) {
  const [elapsed, setElapsed] = React.useState(0);
  const isDone = elapsed >= delay + duration;

  useInterval(
    () => {
      setElapsed((current) => current + TICK_MS);
    },
    isDone ? null : TICK_MS,
  );

  if (elapsed < delay) {
    return <>{placeholder ?? from.toFixed(decimalPlaces)}</>;
  }

  const progress = duration > 0 ? Math.min((elapsed - delay) / duration, 1) : 1;
  const value = from + (to - from) * progress;

  return <>{value.toFixed(decimalPlaces)}</>;
}

export default ClimbingNumber;
