import React from 'react';

import { random } from '@/utils';

function useRandomInterval(
  // eslint-disable-next-line
  callback: () => any,
  minDelay: number | null,
  maxDelay: number | null,
) {
  const timeoutId = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number';

    if (isEnabled) {
      const handleTick = () => {
        // Weirdly, TS requires yet another check
        if (typeof minDelay !== 'number' || typeof maxDelay !== 'number') {
          return;
        }

        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }

    return () => {
      if (typeof timeoutId.current === 'number') {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [minDelay, maxDelay]);

  const cancel = React.useCallback(function () {
    if (typeof timeoutId.current === 'number') {
      window.clearTimeout(timeoutId.current);
    }
  }, []);
  return cancel;
}

export default useRandomInterval;
