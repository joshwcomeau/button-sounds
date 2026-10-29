// NOTE: This hook will not work correctly in an SSR environment. I can get away with using it here since I'm using a CSR structure with Vite.
// Specifically, we would need to initialize the `dpr` state variable to a universal number like 1, since we wouldn't know what it is during SSR. We could then update it in an effect after hydration. This would also work during CSR, but it would introduce an unnecessary double-render.
import React from 'react';

export default function useDevicePixelRatio(): number {
  const [dpr, setDpr] = React.useState(() => window.devicePixelRatio);

  React.useEffect(() => {
    const handleResize = () => {
      setDpr(window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return dpr;
}
