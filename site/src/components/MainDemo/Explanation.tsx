import styled from 'styled-components';

import Screw from '@/components/Screw/Screw';
import Kbd from '@/components/Kbd/Kbd';
import BevelEdge from '@/components/BevelEdge/BevelEdge';

function Explanation({ isVisible }: { isVisible: boolean }) {
  return (
    <Clipper>
      <OuterWrapper data-is-visible={isVisible}>
        <Wrapper>
          <BevelEdge side="top" color="var(--color-gray-500)" radius={18} />
          <BevelEdge side="bottom" color="var(--color-gray-75)" radius={18} />
          <TopLeftAttachment>
            <Screw />
          </TopLeftAttachment>
          <TopRightAttachment>
            <Screw />
          </TopRightAttachment>
          <DesktopOnly>
            <p>
              <strong>How it works:</strong> Click the big red button to play
              the currently-selected sound. Browse the selection using the
              left-hand sidebar (<em>protip:</em> after clicking the button, you
              can use the up/down arrow keys,{' '}
              <Kbd char="ArrowUp" aliases={['w']}>
                ↑
              </Kbd>{' '}
              /{' '}
              <Kbd char="ArrowDown" aliases={['s']}>
                ↓
              </Kbd>
              , to quickly move between sounds!).
            </p>
            <p>
              Each sound has a handful of individually-recorded samples that are
              randomly selected on every click. The{' '}
              <ConfigSidebarLocationLarge>
                right-hand sidebar
              </ConfigSidebarLocationLarge>{' '}
              <ConfigSidebarLocationMedium>
                config row along the bottom
              </ConfigSidebarLocationMedium>{' '}
              highlights the currently-playing sample, and you can click the
              numbers to lock it.
            </p>
          </DesktopOnly>
          <MobileOnly>
            <p>
              <strong>How it works:</strong> Click the big red button to play
              the currently-selected sound. There are more than 50 sounds to
              choose from in the “Select Sound” list; you can tap the up/down
              arrows to move between them.
            </p>
            <p>
              Each sound has a handful of individually-recorded samples that are
              randomly selected on every tap and release. You can lock it to a
              specific sample by tapping the numbers towards the bottom of the
              demo.
            </p>
            <p>
              I did my best to make this work well on mobile, but the experience
              truly is better on desktop. So, if you’re near a computer, I’d
              highly suggest giving it a shot there!
            </p>
          </MobileOnly>
        </Wrapper>
      </OuterWrapper>
    </Clipper>
  );
}

const Clipper = styled.div`
  overflow: hidden;
`;

const OuterWrapper = styled.div`
  --return-delay: 500ms;
  width: fit-content;
  margin-inline: auto;
  padding: 2px;
  outline: 2px solid black;
  outline-offset: -2px;
  border-radius: 19px;
  corner-shape: bevel;
  transition: opacity 1000ms var(--return-delay);

  &[data-is-visible='false'] {
    opacity: 0;
    transition: opacity 500ms;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity 1000ms var(--return-delay),
      transform 1200ms var(--return-delay) cubic-bezier(0.05, 1, 0, 0.99);

    &[data-is-visible='false'] {
      transform: translateY(-100%);
      transition:
        opacity 500ms,
        transform 1000ms;
    }
  }

  @media (max-width: 53rem) {
    margin-top: 1rem;
  }
`;

const Wrapper = styled.div`
  width: fit-content;
  padding: 1rem 1.5rem;
  border: 1px solid var(--color-gray-200);
  background: hsl(210deg 15% 6% / 0.5);
  backdrop-filter: blur(4px);
  border-radius: 18px;
  corner-shape: bevel;
  outline: 2px solid black;
  outline-offset: -3px;

  --selection-bg: hsl(45deg 70% 70%);
  --selection-color: hsl(210deg 15% 6%);

  p {
    max-width: 75ch;
    margin-inline: auto;
    font-size: 0.875rem;
    text-align: justify;
    text-wrap: pretty;

    @media (max-width: 28rem) {
      text-align: center;
    }

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    strong {
      text-transform: uppercase;
    }
  }
`;

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 42rem) {
    display: block;
  }
`;
const MobileOnly = styled.div`
  @media (min-width: 42rem) {
    display: none;
  }
`;

const ConfigSidebarLocationMedium = styled.span`
  @media (min-width: 55rem) {
    display: none;
  }
`;
const ConfigSidebarLocationLarge = styled.span`
  display: none;
  @media (min-width: 55rem) {
    display: inline;
  }
`;

const TopAttachment = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 32px;
  aspect-ratio: 2 / 1;
  border-radius: 0 0 100px 100px;
  corner-shape: bevel;
  background: var(--color-gray-800);

  @supports not (corner-shape: bevel) {
    display: none;
  }

  @media (max-width: 53rem) {
    display: none;
  }
`;

const TopLeftAttachment = styled(TopAttachment)`
  left: 0;
  transform: translate(-50%, -3px);
`;
const TopRightAttachment = styled(TopAttachment)`
  right: 0;
  transform: translate(50%, -3px);
`;

export default Explanation;
