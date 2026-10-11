import * as React from 'react';
import { styled } from '@linaria/react';

import { WarningAside } from '@/components/Aside';

import Link, { Props } from './Link';

function TextLink(
  props: Props,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return <Anchor {...props} ref={ref} />;
}

export const Anchor = styled(Link)`
  color: inherit;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  box-shadow: 0px 1.5px 0px var(--color-primary);
  transition: 200ms box-shadow;
  will-change: transform;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;

  html[data-color-mode='light'] ${WarningAside} & {
    box-shadow: 0px 1.5px 0px var(--color-warning-700);
  }

  strong & {
    font-weight: inherit;
  }

  /* Double the selector so that it overrides dark/light styles */
  &:hover&:hover {
    box-shadow: 0px 0px 0px transparent;
  }

  &:focus-visible {
    outline: 2px auto var(--color-primary);
    outline-offset: 4px;
  }

  &:has(> code) {
    box-shadow: 0px 0px 0px transparent;
  }
`;

export default React.forwardRef(TextLink);
