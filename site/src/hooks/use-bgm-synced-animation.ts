import React from 'react';

import { useBGMSetters, useBGMState } from '@/components/BGMProvider';

// Certain animations, like the Winamp bounce, are meant to be synced with the background music while it's playing. This is tricky because the song can be paused, and the user can scrub through the song to hop to a new location.
// In order to ensure a perfect sync, without causing a bunch of re-renders on every frame, we need to run a requestAnimationFrame loop that synchronizes the animation whenever the playback position changes.
export default function useBGMSyncedAnimation(
  ...refs: Array<React.RefObject<Element | null>>
) {
  const { isPlaying, hasCompletedIntro, playheadEpoch } = useBGMState();
  const { getPlaybackPosition } = useBGMSetters();

  const refsRef = React.useRef(refs);
  React.useEffect(() => {
    refsRef.current = refs;
  });

  const sync = React.useCallback(() => {
    const positionMs = getPlaybackPosition() * 1000;
    if (!Number.isFinite(positionMs)) {
      return false;
    }

    let didSync = false;
    for (const ref of refsRef.current) {
      for (const animation of ref.current?.getAnimations() ?? []) {
        // `getAnimations()` includes transitions, which shouldn’t be seeked.
        if (!(animation instanceof CSSAnimation)) {
          continue;
        }

        const duration = animation.effect?.getComputedTiming().duration;
        if (typeof duration !== 'number' || duration <= 0) {
          continue;
        }

        animation.currentTime = positionMs % duration;
        didSync = true;
      }
    }

    return didSync;
  }, [getPlaybackPosition]);

  React.useLayoutEffect(() => {
    if (!hasCompletedIntro) {
      return;
    }

    if (sync()) {
      return;
    }

    const frameId = window.requestAnimationFrame(sync);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hasCompletedIntro, isPlaying, playheadEpoch, sync]);

  React.useEffect(() => {
    if (!hasCompletedIntro) {
      return;
    }

    // Browsers can pause animations in background tabs while the audio keeps going.
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        sync();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasCompletedIntro, sync]);
}
