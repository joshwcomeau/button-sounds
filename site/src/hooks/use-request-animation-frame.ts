import React from 'react';

const useRequestAnimationFrameLoop = (
  callback: () => any,
  isRunning: boolean = true,
) => {
  const animationFrameId = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }

    const tick = () => {
      if (typeof savedCallback.current !== 'function') {
        return;
      }

      savedCallback.current();
      animationFrameId.current = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (typeof animationFrameId.current === 'number') {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning]);

  // eslint-disable-next-line
  return animationFrameId.current;
};

export default useRequestAnimationFrameLoop;
