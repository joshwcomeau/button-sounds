import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';
import { useButtonSounds } from 'button-sounds/react';

import { SUPERHEADER_HEIGHT, BANNER_SHOW_ANIMATION } from '@/constants';

import { useSoundSettings } from '@/components/SoundSettingsProvider';

import VisuallyHidden from '@/components/VisuallyHidden/VisuallyHidden';
import BevelEdge from '@/components/BevelEdge/BevelEdge';
import TextLink from '@/components/Link/TextLink';

import RainbowBorder from './RainbowBorder';

const BOTTOM_RADIUS = 8;
const COURSE_HREF = 'https://whimsy.joshwcomeau.com/';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleDismiss: () => void;
}

function SaleBanner({ handleDismiss, ...delegated }: Props) {
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const { usingLofi } = useSoundSettings();

  useButtonSounds(closeBtnRef, 'sd-standard', {
    lofi: usingLofi,
    pitchVariation: 0.1,
    volume: 0.2,
  });

  return (
    <Wrapper {...delegated}>
      <Box>
        <Content>
          <Spacer />
          <DesktopText>
            My flagship course,{' '}
            <TextLink href={COURSE_HREF} preventExternalIcon>
              Whimsical Animations
            </TextLink>
            , is currently on sale for Black Friday! Save 40%. ✨
          </DesktopText>
          <TabletText>
            Save 40% on my flagship course,{' '}
            <TextLink href={COURSE_HREF} preventExternalIcon>
              Whimsical Animations
            </TextLink>
            !
          </TabletText>
          <MobileText>
            Save 40% on{' '}
            <TextLink href={COURSE_HREF} preventExternalIcon>
              Whimsical Animations
            </TextLink>
            !
          </MobileText>
          <CloseButton ref={closeBtnRef} onClick={handleDismiss}>
            <X aria-hidden="true" />
            <VisuallyHidden>Dismiss banner</VisuallyHidden>
          </CloseButton>
        </Content>
        <BevelEdge
          side="bottom"
          color="var(--color-gray-250)"
          radius={BOTTOM_RADIUS - 1}
          borderWidth={1}
        />
      </Box>
      <BevelEdge
        side="bottom"
        color="var(--color-gray-200)"
        radius={BOTTOM_RADIUS}
        borderWidth={2}
      />
      <RainbowBorder />
    </Wrapper>
  );
}

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
`;

const Wrapper = styled.div`
  --selection-bg: hsl(45deg 100% 70%);
  --selection-color: black;
  position: fixed;
  top: 0;
  left: 4px;
  right: 4px;
  height: ${SUPERHEADER_HEIGHT}rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 1px;
  background-color: var(--color-background);
  border: 2px solid var(--color-gray-200);
  border-top: none;
  border-radius: 0 0 ${BOTTOM_RADIUS}px ${BOTTOM_RADIUS}px;
  corner-shape: bevel;
  animation: ${slideIn} ${BANNER_SHOW_ANIMATION.duration}ms
    ${BANNER_SHOW_ANIMATION.curve} both;
  animation-delay: ${BANNER_SHOW_ANIMATION.delay}ms;
`;

const Box = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  border: 1px solid var(--color-gray-75);
  border-top: none;
  padding-top: 6px;
  border-radius: 0 0 6px 6px;
  corner-shape: bevel;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 67.5rem;
  max-width: 100%;
  padding-inline: 1rem;
  /* Optical alignment */
  transform: translateY(-1px);

  a {
    font-weight: 700;
  }
`;

const Spacer = styled.div`
  flex-shrink: 0;
  width: 32px;

  /* On smaller screens, the symmetry is less important than fitting everything comfortably */
  @media (max-width: 40rem) {
    display: none;
  }
`;

const Text = styled.p`
  flex: 1;
  margin: 0;
  text-align: center;
`;

const DesktopText = styled(Text)`
  display: block;

  @media (max-width: 58rem) {
    display: none;
  }
`;

const TabletText = styled(Text)`
  display: none;

  @media (max-width: 58rem) and (min-width: 40rem) {
    display: block;
  }
`;
const MobileText = styled(Text)`
  display: none;
  line-height: 1;
  /* On most modern mobile devices, we hide the left-side spacer but keep the close button, so center alignment feels lopsided. Switch to left align. */
  text-align: left;

  @media (max-width: 40rem) {
    display: block;
  }
  @media (max-width: 24.5rem) {
    /* On *very* small screens, there just isn't enough space for the close button. Since we've removed the spacing on both sides, we can go back to center alignment */
    text-align: center;
  }
`;

const CloseButton = styled.button`
  display: grid;
  place-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  border-radius: 6px;
  corner-shape: bevel;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: white;

  &:hover {
    background: var(--color-gray-100);
  }
  &:active > svg {
    display: block;
    width: 16px;
    height: 16px;
  }

  svg * {
    vector-effect: non-scaling-stroke;
    stroke-width: 5px;
  }

  /* On very small mobile devices, there just isn't enough space for the close button */
  @media (max-width: 24.5rem) {
    display: none;
  }
`;

export default SaleBanner;
