// @ts-nocheck

export type Browser = 'firefox' | 'chrome' | 'safari' | 'ie' | 'edge' | 'brave';

export const detectBrowser = (): Browser | null => {
  // SSR!
  if (typeof navigator === 'undefined') {
    return null;
  }

  if (
    // @ts-ignore
    typeof InstallTrigger !== 'undefined' ||
    navigator.userAgent.indexOf('Firefox') !== -1
  ) {
    return 'firefox';
  }

  // @ts-ignore
  if (!!window.navigator.brave) {
    return 'brave';
  }

  const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;

  if (isChrome) {
    return 'chrome';
  }

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari =
    navigator.userAgent.indexOf('Safari') !== -1 ||
    // @ts-ignore
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
    })(
      // @ts-ignore
      !window['safari'] ||
        // @ts-ignore
        (typeof safari !== 'undefined' &&
          // @ts-ignore
          window['safari'].pushNotification),
    );
  const isMobileSafari =
    navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
  if (isSafari || isMobileSafari) {
    return 'safari';
  }

  // Internet Explorer 6-11
  // @ts-ignore
  const isIE = /*@cc_on!@*/ false || !!document.documentMode;
  if (isIE) {
    return 'ie';
  }
  // Edge 20+
  // @ts-ignore
  const isEdge = !isIE && !!window.StyleMedia;
  if (isEdge) {
    return 'edge';
  }

  return null;
};
