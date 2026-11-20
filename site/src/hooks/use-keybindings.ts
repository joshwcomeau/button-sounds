import * as React from 'react';

interface Options {
  caseSensitive?: boolean;
  ignoreWhileMetaKey?: boolean;
  event?: 'keydown' | 'keyup';
}

function useKeybindings(
  map: Record<string, () => void>,
  { event = 'keydown', caseSensitive, ignoreWhileMetaKey }: Options = {
    caseSensitive: false,
  },
) {
  const mapRef = React.useRef(map);

  React.useEffect(() => {
    mapRef.current = map;
  }, [map]);

  React.useEffect(() => {
    const handlePress = (ev: KeyboardEvent) => {
      if (ev.metaKey && ignoreWhileMetaKey) {
        return;
      }

      // if `event.target` is a text input, don't play the sound effect. This would be weird and seem buggy.
      if (ev.target instanceof HTMLInputElement) {
        return;
      }

      const map = mapRef.current;
      const handler = caseSensitive
        ? map[ev.key]
        : (map[ev.key] ??
          map[ev.key.toLowerCase()] ??
          map[ev.key.toUpperCase()]);

      if (typeof handler === 'function') {
        handler();
      }
    };

    window.addEventListener(event, handlePress);

    return () => {
      window.removeEventListener(event, handlePress);
    };
  }, [event, caseSensitive, ignoreWhileMetaKey]);
}

export default useKeybindings;
