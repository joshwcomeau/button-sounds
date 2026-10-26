import React from 'react';

const useRequestAnimationFrameLoop = (
  callback: () => void,
  isRunning = true,
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

  // We return the animation frame ID so that we have the option of canceling it elsewhere. ESLint doesn't like it since it means accessing refs in render, but really it’s fine.
  // eslint-disable-next-line
  return animationFrameId.current;
};

export default useRequestAnimationFrameLoop;
