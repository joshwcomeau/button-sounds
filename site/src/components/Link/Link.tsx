// NOTE: This project doesn't really have any routing, it's only a single page, so this Link component really only exists to add the external icon when links open in a new tab, which is an important usability/accessibility feature.

import React from 'react';
import styled from 'styled-components';

import VisuallyHidden from '@/components/VisuallyHidden';

import ExternalIcon from './ExternalIcon';

type LinkDestination = 'internal' | 'external' | 'hash' | 'mailto';

export interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href?: string;
  target?: '_blank';
  rel?: string;
  preventExternalIcon?: boolean;
}

function Link({
  href = '',
  target,
  rel,
  preventExternalIcon,
  children,
  ...delegated
}: Props) {
  const [isHovering, setIsHovering] = React.useState(false);

  let linkDestination: LinkDestination = 'internal';
  if (href.match(/^#/)) {
    linkDestination = 'hash';
  } else if (href.match(/^http/i) || target === '_blank') {
    linkDestination = 'external';
  } else if (href.match(/^mailto/)) {
    linkDestination = 'mailto';
  }

  // By default, external links should open in a new tab.
  if (typeof target === 'undefined') {
    target = linkDestination === 'external' ? '_blank' : undefined;
  }

  const safeRel = target === '_blank' ? 'noopener noreferrer' : rel;

  const includeExternalIcon =
    target === '_blank' && !preventExternalIcon && typeof children === 'string';

  // Annoyingly complicated: I don't want the external icon to be an orphan. No combination of &nbsp; is working, so what I need is to wrap the final word + icon in a span with no wrapping:
  //
  //  <a>The Joy of <span>React [Icon]</span></a>
  //
  let first, last;
  if (includeExternalIcon) {
    const words = children.split(' ');
    first = words.slice(0, -1).join(' ');
    last = words.at(-1);
  } else {
    first = children;
    last = '';
  }

  return (
    <a
      href={href}
      rel={safeRel}
      target={target}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...delegated}
    >
      {includeExternalIcon ? (
        <>
          {first}{' '}
          <PreventOrphan>
            {last}
            <StyledExternalIcon
              isHovering={isHovering}
              accentColor="var(--color-primary-700)"
              size="0.925em"
              style={{
                opacity: 1,
              }}
            />
            <VisuallyHidden>(opens in new tab)</VisuallyHidden>
          </PreventOrphan>
        </>
      ) : (
        children
      )}
    </a>
  );
}

const StyledExternalIcon = styled(ExternalIcon)`
  transform: translateY(0.0625rem);
  margin-left: 0.25em;
  color: var(--base-icon-color, inherit);
`;

const PreventOrphan = styled.span`
  white-space: nowrap;
`;

export default Link;
