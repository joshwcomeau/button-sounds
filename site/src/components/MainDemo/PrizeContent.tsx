import * as React from 'react';
import styled from 'styled-components';
import { RotateCcw } from 'lucide-react';
import { useButtonSounds } from 'button-sounds/react';

import InfoTooltip from '@/components/InfoTooltip/InfoTooltip';
import TextLink from '@/components/Link/TextLink';
import IconButton from '@/components/IconButton/IconButton';

const DISCOUNT_AMOUNT = 15;

const termsAndConditions = (
  <>
    Coupon valid for the “Ultimate” package only. Can’t be combined with other
    discount codes.
  </>
);

interface Props {
  isShown: boolean;
  onRestore: () => void;
}

function PrizeContent({ isShown, onRestore }: Props) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useButtonSounds(buttonRef, 'uhk-soft');

  // This content replaces the sound description when the minigame is won, and everything else in the playground becomes inert. Move focus here so keyboard users land on the new content.
  React.useEffect(() => {
    if (isShown) {
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [isShown]);

  return (
    <Wrapper data-is-shown={isShown}>
      <p>
        You clever little sleuth! You found and solved the hidden minigame. 😄
      </p>
      <p>
        As a reward, you can use the top-secret coupon code{' '}
        <code>CLEVER_SLEUTH</code> to <em>get {DISCOUNT_AMOUNT}% off</em> any of
        my courses.{' '}
        <InfoTooltip content={termsAndConditions}>Terms apply.</InfoTooltip>
      </p>
      <p>
        This coupon can be applied to{' '}
        <TextLink href="https://whimsy.joshwcomeau.com/">
          Whimsical Animations
        </TextLink>
        ,{' '}
        <TextLink href="https://www.css-for-js.dev/">
          CSS for JavaScript Developers
        </TextLink>
        , and{' '}
        <TextLink href="https://www.joyofreact.com/">The Joy of React</TextLink>
        .
      </p>
      <Actions>
        <StyledIconButton
          ref={buttonRef}
          icon={<RotateCcw size={16} />}
          onClick={onRestore}
        >
          Restore Playground
        </StyledIconButton>
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  &[data-is-shown='true'] {
    animation: fadeFromTransparent 5000ms backwards
      cubic-bezier(0.95, 0.06, 0.6, 1);
    animation-delay: 500ms;
  }

  em {
    font-weight: 600;
  }

  code {
    background-color: var(--color-gray-100);
    font-weight: 900;
    padding: 4px 6px;
    border-radius: 4px;
    corner-shape: bevel;
  }

  a {
    color: white !important;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 16px;
  padding-bottom: 8px;
`;

const StyledIconButton = styled(IconButton)`
  font-size: 0.875rem;
  --face-gap: 1rem;
`;

export default PrizeContent;
