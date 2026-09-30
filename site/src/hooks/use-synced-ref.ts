import React from 'react';

// Lets long-lived callbacks (rAF loops, timers, event handlers) read the latest render value without stale-closure bugs.
const useSyncedRef = <T>(value: T) => {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref;
};

export default useSyncedRef;
