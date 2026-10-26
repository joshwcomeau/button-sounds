/*
  This is a lower-level version of my `useBoop` hook.
  https://www.joshwcomeau.com/snippets/react-hooks/use-boop/
*/

import * as React from 'react';

import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

interface Options {
  timing?: number;
  ignoreMotionPreference?: boolean;
}

function useBoopMinimal(
  isHovering: boolean,
  { timing = 150, ignoreMotionPreference = false }: Options = {
    timing: 150,
    ignoreMotionPreference: false,
  },
) {
  const [isBooped, setIsBooped] = React.useState(false);
  const prefersReducedMotion =
    usePrefersReducedMotion() && !ignoreMotionPreference;

  React.useEffect(() => {
    if (!isHovering || prefersReducedMotion) {
      return;
    }

    // Obviously not ideal to sync one state variable to another inside an effect, but the whole point of `useBoopMinimal` is that it doesn’t own the hover state, since it's designed for more-complex use cases. The double-render isn't the end of the world.
    // eslint-disable-next-line
    setIsBooped(true);
  }, [isHovering, prefersReducedMotion]);

  React.useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBooped, timing]);

  return isBooped;
}

export default useBoopMinimal;
