import * as React from 'react';
import styled from 'styled-components';

import { GITHUB_URL, NPM_URL } from '@/constants';

import JoshWComeauLogo from '@/components/JoshWComeauLogo';
import Screw from '@/components/Screw/Screw';
import Link from '@/components/Link/TextLink';

function Footer() {
  return (
    <PaddedContainer>
      <OuterWrapper>
        <TLScrew />
        <TRScrew />
        <BLScrew />
        <BRScrew />
        <Wrapper>
          <LogoWrapper>
            <span>A project from</span>
            <JoshWComeauLogo />
          </LogoWrapper>
          <ProjectLinks>
            <Heading>Project Links</Heading>
            <LinkList>
              <li>
                <Link preventExternalIcon href={GITHUB_URL}>
                  GitHub Repo
                </Link>
              </li>
              <li>
                <Link preventExternalIcon href={NPM_URL}>
                  NPM Package
                </Link>
              </li>
            </LinkList>
          </ProjectLinks>
          <JoshLinks>
            <Heading>Also From Josh</Heading>
            <LinkList>
              <li>
                <Link preventExternalIcon href="https://www.joshwcomeau.com/">
                  Main Blog
                </Link>
              </li>
              <li>
                <Link
                  preventExternalIcon
                  href="https://whimsy.joshwcomeau.com/"
                >
                  Whimsical Animations
                </Link>
              </li>
              <li>
                <Link preventExternalIcon href="http://joyofreact.com/">
                  The Joy of React
                </Link>
              </li>
              <li>
                <Link preventExternalIcon href="https://css-for-js.dev/">
                  CSS for JS Developers
                </Link>
              </li>
            </LinkList>
          </JoshLinks>
          <Legal>
            <Copyright>
              © 2026-present Joshua Comeau. All Rights Reserved.
            </Copyright>
            <LegalLinksList>
              <LegalListItem>
                <LegalLink
                  preventExternalIcon
                  href="https://courses.joshwcomeau.com/terms"
                >
                  Terms of Use
                </LegalLink>
              </LegalListItem>
              <LegalListItem>
                <LegalLink
                  preventExternalIcon
                  href="https://courses.joshwcomeau.com/privacy"
                >
                  Privacy Policy
                </LegalLink>
              </LegalListItem>
              <LegalListItem>
                <LegalLink
                  preventExternalIcon
                  href="https://courses.joshwcomeau.com/code-of-conduct"
                >
                  Code of Conduct
                </LegalLink>
              </LegalListItem>
            </LegalLinksList>
          </Legal>
        </Wrapper>
        <DecorativeBaseWrapper>
          <DecorativeBase />
        </DecorativeBaseWrapper>
      </OuterWrapper>
    </PaddedContainer>
  );
}

const PaddedContainer = styled.div`
  padding-inline: 1rem;
`;

const OuterWrapper = styled.div`
  --angled-inset: 24px;
  position: relative;
  background: var(--color-gray-600);
  border-radius: 4px;
  corner-shape: bevel;
  padding: 3px;
  margin-top: 5rem;
  margin-bottom: 2rem;
  margin-inline: auto;
  /* Very marginal, but I want the gradient in DecorativeBase to line up perfectly with the bottom-right bevel of the Wrapper, so it requires this small adjustment to the max-width: */
  max-width: calc(55rem + 1px);

  @media (max-width: 35rem) {
    margin-inline: 0;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 10rem 13rem;
  align-items: start;
  grid-template-areas:
    'logo project-links josh-links'
    'legal legal josh-links';
  gap: 16px;
  background: var(--color-gray-50);
  border-radius: var(--angled-inset) var(--angled-inset) 0 0;
  corner-shape: bevel;
  padding: 1.5rem;
  padding-bottom: 2.5rem;

  @media (max-width: 45rem) {
    grid-template-columns: 15fr 20fr;
    grid-template-areas:
      'logo logo'
      'project-links josh-links'
      'legal legal';
    justify-items: center;
    text-align: center;
  }

  @media (max-width: 35rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'logo'
      'project-links'
      'josh-links'
      'legal';
    justify-items: center;
    text-align: center;
    gap: 2rem;
    padding: 1rem;
  }
`;

const LogoWrapper = styled.div`
  grid-area: logo;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'wotfard';
  text-align: center;
  width: fit-content;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const ProjectLinks = styled(Col)`
  grid-area: project-links;
`;

const JoshLinks = styled(Col)`
  grid-area: josh-links;
`;

const Heading = styled.h3`
  font-size: inherit;
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0;
  color: var(--color-gray-700);
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  list-style-type: none;
`;

const StyledScrew = styled(Screw)`
  --inset: 5px;
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
  margin-top: 2rem;
  color: var(--secondary-text);
  font-size: 0.75rem;
`;
const Copyright = styled.p`
  display: block;
  margin: 0;
`;
const LegalLinksList = styled.ul`
  display: flex;
  gap: 0.5rem;
  padding: 0;
  list-style-type: none;
`;
const LegalListItem = styled.li`
  position: relative;

  &:not(:last-child)::after {
    content: '•';
    margin-left: 0.5rem;
    color: var(--color-gray-400);
  }
`;

const LegalLink = styled(Link)`
  /* color: inherit; */
`;

// Honestly this element mostly exists to give Footer a bit more bottom space, since the CRT spacing makes text right near the edge of the viewport a bit dark / hard to read.

const DecorativeBaseWrapper = styled.div`
  --padding: 3px;
  background: var(--color-background);
  padding: var(--padding);
  border-radius: 0 0 var(--angled-inset) var(--angled-inset);
  corner-shape: bevel;
  border-top: 3px double var(--color-gray-600);
`;
const DecorativeBase = styled.div`
  --trimmed-inset: calc(var(--angled-inset) - var(--padding) / 2);
  height: 2rem;
  background: repeating-linear-gradient(
    135deg,
    var(--color-gray-300) 0px 3px,
    var(--color-gray-100) 3px 6px
  );
  border-radius: 0 0 var(--trimmed-inset) var(--trimmed-inset);
  corner-shape: bevel;
`;

export default Footer;
