/**
 * NOTE: Interrupts are kinda buggy.
 * Needs to be better-thought-out before general usage.
 */
import React from 'react';
import styled, { type ExecutionProps } from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLElement> {
  // Weirdly I was getting a 'Union type too complex' error from TypeScript when I tried to set this to React.ElementType. Evidently that's broader than what styled-components really uses. So we'll nab the true `as` type from the library and use it.
  as?: ExecutionProps['as'];
  duration?: number;
  changeKey: unknown;
  children: React.ReactNode;
}

function FadeOnChange({
  as = 'span',
  duration = 250,
  changeKey,
  children,
  style = {},
  ...delegated
}: Props) {
  const wrapperRef = React.useRef<HTMLElement | null>(null);
  // The key whose children are currently on screen. While the key is unchanged, the children can update freely without triggering a fade.
  const [settledKey, setSettledKey] = React.useState(changeKey);
  // The last children rendered for `settledKey`, kept on screen while they fade out.
  const [settledChildren, setSettledChildren] = React.useState(children);

  const isFadingOut = changeKey !== settledKey;

  if (!isFadingOut && children !== settledChildren) {
    setSettledChildren(children);
  }

  React.useEffect(() => {
    // Nothing to do on initial mount, or if the key flipped back before the fade-out finished.
    if (!isFadingOut) {
      return;
    }

    const elem = wrapperRef.current;

    if (!elem) {
      return;
    }

    function handleTransitionEnd(event: TransitionEvent) {
      // transitionend bubbles, so we need to ignore any transitions happening on descendants.
      if (event.target !== elem || event.propertyName !== 'opacity') {
        return;
      }

      setSettledKey(changeKey);
    }

    elem.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      elem.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [changeKey, isFadingOut]);

  return (
    <Wrapper
      as={as}
      ref={wrapperRef}
      style={{
        ...style,
        opacity: isFadingOut ? 0 : 1,
        '--duration': `${duration}ms`,
      }}
      {...delegated}
    >
      {isFadingOut ? settledChildren : children}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  transition: opacity var(--duration);
  transition-delay: 0ms;
`;

export default FadeOnChange;
