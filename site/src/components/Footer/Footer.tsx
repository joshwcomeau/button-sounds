import * as React from 'react';
import styled from 'styled-components';

import JoshWComeauLogo from '@/components/JoshWComeauLogo';
import Screw from '@/components/Screw/Screw';
import Link from '@/components/Link/Link';

function Footer() {
  return (
    <OuterWrapper>
      <TLScrew />
      <TRScrew />
      <BLScrew />
      <BRScrew />
      <Wrapper>
        <JoshWComeauLogo />
        <Legal>
          <Copyright>
            © 2018-present Joshua Comeau. All Rights Reserved.
          </Copyright>
          <LegalLinksList>
            <LegalListItem>
              <LegalLink href="https://courses.joshwcomeau.com/terms">
                Terms of Use
              </LegalLink>
            </LegalListItem>
            <LegalListItem>
              <LegalLink href="https://courses.joshwcomeau.com/privacy">
                Privacy Policy
              </LegalLink>
            </LegalListItem>
            <LegalListItem>
              <LegalLink href="https://courses.joshwcomeau.com/code-of-conduct">
                Code of Conduct
              </LegalLink>
            </LegalListItem>
          </LegalLinksList>
        </Legal>
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  position: relative;
  background: var(--color-gray-600);
  border-radius: 4px;
  corner-shape: bevel;
  padding: 3px;
  margin-top: 5rem;
`;

const Wrapper = styled.div`
  background: var(--color-gray-50);
  border-radius: 16px;
  corner-shape: bevel;
  padding: 1rem;
  padding-bottom: 3rem;
`;

const StyledScrew = styled(Screw)`
  --inset: 4px;
  position: absolute;

  @supports not (corner-shape: bevel) {
    display: none;
  }
`;

const TLScrew = styled(StyledScrew)`
  top: var(--inset);
  left: var(--inset);
`;
const TRScrew = styled(StyledScrew)`
  top: var(--inset);
  right: var(--inset);
`;
const BLScrew = styled(StyledScrew)`
  bottom: var(--inset);
  left: var(--inset);
`;
const BRScrew = styled(StyledScrew)`
  bottom: var(--inset);
  right: var(--inset);
`;

const Legal = styled.div`
  grid-area: legal;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  color: var(--secondary-text);
  font-size: 0.75rem;
`;
const Copyright = styled.p`
  display: block;
  margin: 0;
`;
const LegalLinksList = styled.ul`
  display: flex;
  gap: 16px;
  padding: 0;
  list-style-type: none;
`;
const LegalListItem = styled.li`
  position: relative;
`;

const LegalLink = styled(Link)`
  color: inherit;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

export default Footer;
