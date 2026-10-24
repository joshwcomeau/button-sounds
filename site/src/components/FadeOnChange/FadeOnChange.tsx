/**
 * NOTE: Interrupts are kinda buggy.
 * Needs to be better-thought-out before general usage.
 */
import React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
  duration?: number;
  changeKey: any;
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
  const [status, setStatus] = React.useState('idle');

  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);
  const cachedChildren = React.useRef(children);
  // The key that `cachedChildren` belongs to. While the key is unchanged, the children can update freely without triggering a fade.
  const cachedKey = React.useRef(changeKey);

  if (changeKey === cachedKey.current) {
    cachedChildren.current = children;
  }

  React.useEffect(() => {
    // Ignore initial mount, as well as the key flipping back before the fade-out finished.
    if (changeKey === cachedKey.current) {
      setStatus('idle');
      return;
    }

    setStatus('fading-out');

    const elem = wrapperRef.current;

    if (!elem) {
      return;
    }

    function handleTransitionEnd(event: TransitionEvent) {
      // transitionend bubbles, so we need to ignore any transitions happening on descendants.
      if (event.target !== elem || event.propertyName !== 'opacity') {
        return;
      }

      cachedKey.current = changeKey;
      cachedChildren.current = children;
      setStatus('idle');
    }

    elem.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      elem?.removeEventListener('transitionend', handleTransitionEnd);
    };
    // I only want to do the unmount-fade dance when the `changeKey` changes. The bug of outdated UI is actually a feature in this case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeKey]);

  return (
    <Wrapper
      as={as}
      ref={wrapperRef}
      style={{
        ...style,
        opacity: status === 'fading-out' ? 0 : 1,
        '--duration': `${duration}ms`,
      }}
      {...delegated}
    >
      {cachedChildren.current}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  transition: opacity var(--duration);
  transition-delay: 0ms;
`;

export default FadeOnChange;
