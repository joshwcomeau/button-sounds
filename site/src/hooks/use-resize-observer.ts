import React from 'react';

function useResizeObserver(
  ref: React.RefObject<Element | null>,
  callback: ResizeObserverCallback,
) {
  const callbackRef = React.useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((...args) => {
      callbackRef.current(...args);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  // NOTE: Claude seems to think that we also need to trigger the callback whenever the component re-renders, since certain state changes could change the children without triggering a resize. I sorta feel like that's fine and we don't *want* this to run on every state change, but I'll leave this here in case it winds up being useful in certain situations:
  /*
    React.useLayoutEffect(() => {
      callbackRef.current();
    });
  */
}

export default useResizeObserver;
