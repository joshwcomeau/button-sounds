import styled from 'styled-components';

import Link from './Link';

const TextLink = styled(Link)`
  color: inherit;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  box-shadow: 0px 1.5px 0px var(--color-primary);
  transition: 200ms box-shadow;
  will-change: transform;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  font-weight: 600;

  strong & {
    font-weight: inherit;
  }

  &:hover {
    box-shadow: 0px 2.5px 0px var(--color-primary);
  }

  &:focus-visible {
    outline: 2px auto var(--color-primary);
    outline-offset: 4px;
  }

  &:has(> code) {
    box-shadow: 0px 0px 0px transparent;
  }
`;

export default TextLink;
