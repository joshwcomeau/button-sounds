import * as React from 'react';
import styled from 'styled-components';

import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

import { INTRO_DURATION_MS } from '@/components/BGMProvider/BGMProvider';
import VisuallyHidden from '@/components/VisuallyHidden';

export type IntroStatus = 'waiting' | 'playing' | 'completed';

const TITLE = 'Actuator Jam – Josh W. Comeau (1:17)';
// The trailing space keeps the end of one loop from butting up against the start of the next.
const SCROLLING_TITLE = `${TITLE} *** `;
const SCROLL_INTERVAL_MS = 250;
const START_PAUSE_MS = 2000;
const REVEAL_INTERVAL_MS = INTRO_DURATION_MS / TITLE.length;

interface Props {
  introStatus: IntroStatus;
}

function ScrollingTitle({ introStatus }: Props) {
  const [offset, setOffset] = React.useState(0);
  const [revealedCount, setRevealedCount] = React.useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (introStatus !== 'playing' || revealedCount >= TITLE.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRevealedCount((current) => current + 1);
    }, REVEAL_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [introStatus, revealedCount]);

  React.useEffect(() => {
    if (prefersReducedMotion || introStatus !== 'completed') {
      return;
    }

    const delay = offset === 0 ? START_PAUSE_MS : SCROLL_INTERVAL_MS;

    const timeoutId = window.setTimeout(() => {
      setOffset((current) => (current + 1) % SCROLLING_TITLE.length);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [offset, prefersReducedMotion, introStatus]);

  let text: string;
  if (introStatus === 'completed') {
    // Each tick moves the first character to the end.
    const start = prefersReducedMotion ? 0 : offset;
    text = SCROLLING_TITLE.slice(start) + SCROLLING_TITLE.slice(0, start);
  } else {
    const visibleCount = introStatus === 'playing' ? revealedCount : 0;
    text =
      TITLE.slice(0, visibleCount) +
      TITLE.slice(visibleCount).replace(/\S/g, '-');
  }

  return (
    <>
      <TitleText aria-hidden="true">{text}</TitleText>
      <VisuallyHidden>{TITLE}</VisuallyHidden>
    </>
  );
}

/* Clipping happens here rather than on Title, since overflow is clipped at the padding edge, which would let text spill into Title’s right padding */
export const TitleText = styled.span`
  display: block;
  /* "pre" rather than "nowrap" so that spaces rotated to the start/end aren’t collapsed */
  white-space: pre;
  overflow: hidden;
  margin-right: 10px;
`;

export default ScrollingTitle;
