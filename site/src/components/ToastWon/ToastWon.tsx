// NOTE: I only have a single toast popup in the whole project, so I didn't bother creating a reusable component. In 99% of real-world projects, it would be better to create a generic low-level reusable <Toast> component and compose it here.
import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import InfoTooltip from '@/components/InfoTooltip/InfoTooltip';
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden';

const RADIUS = 12;
const DISCOUNT_AMOUNT = 40;

const termsAndConditions = (
  <>
    Coupon valid for the “Ultimate” package only. Can’t be combined with other
    discounts. Reduces the global price by ${DISCOUNT_AMOUNT}, but the amount
    will be proportional to the regional discount for folks who opt for a
    regional license.
  </>
);

function ToastWon() {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <OuterWrapper>
      <picture>
        <source srcSet="/images/josh-happy-dark.webp" type="image/webp" />
        <Josh
          src="/images/josh-happy-dark.png"
          alt="Josh happy"
          draggable={false}
        />
      </picture>
      <Wrapper>
        <BevelEdge
          side="top"
          color="var(--color-gray-700)"
          radius={RADIUS}
          borderWidth={2}
        />
        <Header>
          <EmptyCell />
          <Title>You cracked the code!</Title>
          <CloseButton onClick={() => setIsDismissed(true)}>
            <XWrapper>
              <X size={32} />
            </XWrapper>
            <VisuallyHidden>Dismiss</VisuallyHidden>
            <BevelEdge side="top" color="var(--top-color)" radius={9} />
            <BevelEdge side="bottom" color="var(--bottom-color)" radius={9} />
          </CloseButton>
        </Header>
        <Body>
          <p>
            You clever little sleuth! You found and solved the hidden minigame.
            😄
          </p>
          <p>
            Here’s your prize: you can use the top-secret coupon code{' '}
            <code>CLEVER_SLEUTH</code> to take{' '}
            <em>up to ${DISCOUNT_AMOUNT} off</em> any of my courses.{' '}
            <InfoTooltip content={termsAndConditions}>Terms apply.</InfoTooltip>
          </p>
          <p>
            This coupon can be applied to{' '}
            <a href="https://whimsy.joshwcomeau.com/">Whimsical Animations</a>,{' '}
            <a href="https://www.css-for-js.dev/">
              CSS for JavaScript Developers
            </a>
            , and <a href="https://www.joyofreact.com/">The Joy of React</a>.
          </p>
        </Body>
      </Wrapper>
    </OuterWrapper>
  );
}

const slideBox = keyframes`
  from {
    transform: translateY(100%);
  }
`;

const slideJosh = keyframes`
  from {
    transform: translateY(15%);
  }
`;

const OuterWrapper = styled.div`
  --bezier: cubic-bezier(0.076, 1.136, 0.056, 1);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 45.5rem;
  max-width: calc(100% - 32px);
  margin: auto;
  @media (max-width: 35rem) {
    max-width: calc(100% - 8px);
  }
`;

const Josh = styled.img`
  position: absolute;
  left: 0;
  right: 0;
  top: -142px;
  width: calc(275px / 2);
  height: calc(464px / 2);
  margin-inline: auto;
  user-select: none;
  animation:
    ${slideJosh} 2000ms var(--bezier) 250ms backwards,
    fadeFromTransparent 1500ms var(--bezier) 250ms backwards;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${RADIUS}px ${RADIUS}px 0 0;
  border: 2px solid var(--color-gray-200);
  border-bottom: none;
  corner-shape: bevel;
  background-color: hsl(from var(--color-background) h s l / 0.9);
  backdrop-filter: blur(10px);
  animation: ${slideBox} 1250ms var(--bezier) forwards;
  will-change: transform;
  box-shadow:
    0px 0px 4px hsl(210deg 15% 6% / 0.5),
    0px 0px 8px hsl(210deg 15% 6% / 0.5),
    0px 0px 16px hsl(210deg 15% 6% / 0.5),
    0px 0px 32px hsl(210deg 15% 6% / 0.5);

  p {
    font-size: 0.875rem;
    text-wrap: pretty;
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  em {
    font-weight: 600;
  }

  a {
    font-weight: 600;
  }

  code {
    background-color: var(--color-gray-100);
    font-weight: 900;
    padding: 6px;
    border-radius: 4px;
    corner-shape: bevel;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
`;

const EmptyCell = styled.div`
  width: 32px;
`;

const CloseButton = styled.button`
  --r: 9px;
  --top-color: var(--color-gray-700);
  --bottom-color: var(--color-background);
  position: relative;
  width: 32px;
  height: 32px;
  margin-top: 4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--r);
  corner-shape: bevel;
  cursor: pointer;

  &:active {
    --top-color: black;
    --bottom-color: var(--color-gray-300);
    border: 1px solid var(--color-gray-100);
    background: var(--color-background);
  }
`;

const XWrapper = styled.span`
  display: block;

  ${CloseButton}:active & {
    transform: translateY(1px);
  }

  svg {
    display: block;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
  padding-top: 1rem;
`;

const Body = styled.div`
  padding: 1rem 2rem 2rem;

  @media (max-width: 35rem) {
    padding-inline: 1rem;
  }
`;

export default ToastWon;
