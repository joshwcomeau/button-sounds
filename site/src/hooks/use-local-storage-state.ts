import React from 'react';

// This app doesn’t use SSR, so the stored value can be read during the initial render.
function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch {
        window.localStorage.removeItem(key);
      }
    }

    if (typeof defaultValue === 'function') {
      return (defaultValue as () => T)();
    }

    return defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorageState;
