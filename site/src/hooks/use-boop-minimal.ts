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
