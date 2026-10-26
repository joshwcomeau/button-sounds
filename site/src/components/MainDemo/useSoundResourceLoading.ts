import * as React from 'react';
import { resolveSoundUrl, type SoundName } from 'button-sounds';
import { SOUNDS_PATH } from '../../constants';

function soundResourceUrl(name: SoundName): string {
  return new URL(resolveSoundUrl(name, SOUNDS_PATH), window.location.href).href;
}

function matchesSoundUrl(entryName: string, url: string): boolean {
  return entryName === url || entryName.endsWith(new URL(url).pathname);
}

// Howler fetches the mp3 with XHR, which shows up in Resource Timing. We watch that entry so the demo can show a loading label without downloading the file a second time.
function hasResourceTimingEntry(name: SoundName): boolean {
  const url = soundResourceUrl(name);
  if (performance.getEntriesByName(url, 'resource').length > 0) {
    return true;
  }

  return performance
    .getEntriesByType('resource')
    .some((entry) => matchesSoundUrl(entry.name, url));
}

type LoadingStatus = 'loading' | 'ready';

export function useSoundResourceLoading(name: SoundName): LoadingStatus {
  const wasAlreadyLoaded = React.useMemo(
    () => hasResourceTimingEntry(name),
    [name],
  );
  const [loadedName, setLoadedName] = React.useState<SoundName | null>(null);

  console.log(name, loadedName, wasAlreadyLoaded);

  React.useEffect(() => {
    if (wasAlreadyLoaded) {
      return;
    }

    const url = soundResourceUrl(name);
    const observer = new PerformanceObserver((list) => {
      const found = list
        .getEntries()
        .some((entry) => matchesSoundUrl(entry.name, url));
      if (found) {
        setLoadedName(name);
      }
    });
    observer.observe({ type: 'resource', buffered: true });
    return () => {
      observer.disconnect();
    };
  }, [name, wasAlreadyLoaded]);

  return wasAlreadyLoaded || loadedName === name ? 'ready' : 'loading';
}
