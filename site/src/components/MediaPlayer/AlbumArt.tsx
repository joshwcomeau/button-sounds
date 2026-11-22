import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { INTRO_DURATION_MS } from '@/components/BGMProvider/BGMProvider';
import Spinner from '@/components/Spinner';
import BevelEdge from '@/components/BevelEdge';

import { type IntroStatus } from './ScrollingTitle';
import Scanlines from './Scanlines';

const ALBUM_ART_FADE_DURATION_MS = 500;

interface Props {
  introStatus: IntroStatus;
  introStartCount: number;
}

function AlbumArt({ introStatus, introStartCount }: Props) {
  return (
    <Wrapper>
      <Clipper>
        {introStatus === 'playing' && (
          <SpinnerWrapper>
            <Spinner size={20} color="var(--w-green)" />
          </SpinnerWrapper>
        )}
        <ArtWrapper key={introStartCount} data-intro-status={introStatus}>
          <Art
            src="/images/album-art-3.png"
            alt="Album art - a complex machine with lots of buttons and switches and knobs, lit in purple and pink"
          />
          <BevelEdge
            side="top"
            color="white"
            leftRadius={3}
            rightRadius={7}
            showEvenWhenUnsupported
          />
        </ArtWrapper>
        <Scanlines />
      </Clipper>
      <BevelEdge
        side="top"
        color="var(--w-primary-900)"
        leftRadius={4}
        rightRadius={8}
      />
      <BevelEdge side="bottom" color="var(--w-gray-500)" radius={8} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100px;
  height: 64px;
  border-radius: 4px 8px 8px 8px;
  corner-shape: bevel;
  padding: 1px;
  border: 1px solid var(--w-primary-700);
  background: black;
`;

const Clipper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3px 7px 7px 7px;
  corner-shape: inherit;
  overflow: hidden;

  /* Vignette effect */
  &::after {
    --shadow-opacity: 0.325;
    content: '';
    position: absolute;
    inset: 0;
    box-shadow:
      inset 0px 0px 2px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 8px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 16px hsl(0deg 0% 0% / var(--shadow-opacity)),
      inset 0px 0px 32px hsl(0deg 0% 0% / var(--shadow-opacity));
  }
`;

/* Sits underneath the album art, so it’s covered as the art fades in */
const SpinnerWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

const ArtWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;

  &[data-intro-status='waiting'] {
    opacity: 0;
  }

  /* Finishes right as the song takes over from the intro */
  &[data-intro-status='playing'] {
    animation: fadeFromTransparent ${ALBUM_ART_FADE_DURATION_MS}ms
      ${INTRO_DURATION_MS - ALBUM_ART_FADE_DURATION_MS}ms backwards;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(1.5);
  }
`;

const Art = styled.img`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  border-radius: 3px 7px 7px 7px;
  corner-shape: bevel;
  will-change: transform;
  ${ArtWrapper}[data-intro-status='playing'] & {
    animation: ${scaleIn} ${ALBUM_ART_FADE_DURATION_MS}ms both;
    animation-delay: ${INTRO_DURATION_MS - ALBUM_ART_FADE_DURATION_MS}ms;
  }
`;

export default AlbumArt;
