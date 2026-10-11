/*
  This wrapper around next/link is used for a few reasons:

  1. Automatically adds "target=_blank" + icon to external links
  2. Uses View Transitions API to smooth out SPA navigation
  3. Adds focus styles (but no other cosmetics; use <TextLink> for
     styled links)
*/
'use client';

import React from 'react';
import NextLink from 'next/link';
import { styled } from '@linaria/react';
import { useViewTransition } from 'use-view-transitions/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { SetNavigationTrackerContext } from '@/components/NavigationTrackerProvider';
import ExternalIcon from '@/components/AnimatedIcons/ExternalIcon';
import VisuallyHidden from '@/components/VisuallyHidden';

type LinkDestination = 'internal' | 'external' | 'hash' | 'mailto';

export interface Props extends React.HTMLProps<HTMLAnchorElement> {
  href?: string;
  target?: '_blank';
  rel?: string;
  prefetch?: boolean;
  skipViewTransitions?: boolean;
  preventExternalIcon?: boolean;
}

const Link = (
  {
    href = '',
    target,
    rel,
    prefetch = true,
    onClick = function () {},
    skipViewTransitions,
    preventExternalIcon,
    children,
    ...delegated
  }: Props,
  ref: React.ForwardedRef<HTMLAnchorElement>
) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const [, startTransition] = React.useTransition();
  const { startViewTransition } = useViewTransition();

  const setMostRecentNavigationFrom = React.useContext(
    SetNavigationTrackerContext
  );

  const router = useRouter();
  const pathname = usePathname();

  let linkDestination: LinkDestination = 'internal';
  if (href.match(/^#/)) {
    linkDestination = 'hash';
  } else if (href.match(/^http/i) || target === '_blank') {
    linkDestination = 'external';
  } else if (href.match(/^mailto/)) {
    linkDestination = 'mailto';
  }

  // By default, external links should open in a new tab.
  // This is overrideable though.
  if (typeof target === 'undefined') {
    target = linkDestination === 'external' ? '_blank' : undefined;
  }

  const safeRel = target === '_blank' ? 'noopener noreferrer' : rel;

  const includeExternalIcon =
    target === '_blank' &&
    !preventExternalIcon &&
    typeof children === 'string';

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
    <StyledLink
      // For some reason, Linaria's ref is typed slightly differently than the default. Try removing the ts-ignore when I move away from linaria.
      // @ts-ignore
      ref={ref}
      href={href}
      rel={safeRel}
      target={target}
      prefetch={linkDestination === 'internal' ? prefetch : false}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      // Support View Transitions by starting a transition before navigation:
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        const isTryingToOpenInNewTab = event.metaKey || event.ctrlKey;

        if (
          linkDestination === 'internal' &&
          !isTryingToOpenInNewTab &&
          !skipViewTransitions
        ) {
          event.preventDefault();
          event.stopPropagation();

          if (pathname) {
            setMostRecentNavigationFrom(pathname);
          }

          startViewTransition(() =>
            startTransition(() => {
              router.push(href);
            })
          );
        }

        onClick(event);
      }}
      {...delegated}
    >
      {includeExternalIcon ? (
        <>
          {first}{' '}
          <PreventOrphan>
            {last}
            <StyledExternalIcon
              isHovering={isHovering}
              accentColor="var(--color-primary)"
              size="0.7em"
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
    </StyledLink>
  );
};

const StyledLink = styled(NextLink)`
  &:focus-visible {
    outline: 2px auto var(--color-primary);
    outline-offset: 2px;
  }
`;

const StyledExternalIcon = styled(ExternalIcon)`
  display: none;
  transform: translateY(0.0625rem);
  margin-left: 0.125em;
  color: var(--base-icon-color, inherit);

  /*
    We only want to show the external icon for links within the main content. This became relevant because the "RSS" link in the header/footer opens in a new tab, but it shouldn't have the external icon.
  */
  main & {
    display: inline-block;
  }
`;

const PreventOrphan = styled.span`
  white-space: nowrap;
`;

export default React.forwardRef<HTMLAnchorElement, Props>(Link);
