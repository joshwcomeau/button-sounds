import React from 'react';

const useInterval = (callback: Function, delay: number | null) => {
  const intervalId = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    // eslint-disable-next-line
    const tick = () => savedCallback.current();

    if (typeof delay === 'number') {
      intervalId.current = window.setInterval(tick, delay);

      return () => {
        if (intervalId.current) {
          window.clearInterval(intervalId.current);
        }
      };
    }
  }, [delay]);

  // eslint-disable-next-line
  return intervalId.current;
};

export default useInterval;
