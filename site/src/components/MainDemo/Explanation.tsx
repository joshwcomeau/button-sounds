import styled from 'styled-components';

import Screw from '@/components/Screw/Screw';
import Kbd from '@/components/Kbd/Kbd';

function Explanation() {
  return (
    <Wrapper>
      <TopLeftAttachment>
        <Screw />
      </TopLeftAttachment>
      <TopRightAttachment>
        <Screw />
      </TopRightAttachment>
      <DesktopOnly>
        <p>
          <strong>How it works:</strong> Click the big red button to play the
          currently-selected sound. Browse the selection using the left-hand
          sidebar (<em>protip:</em> after clicking the button, you can use the
          up/down arrow keys,{' '}
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
          randomly selected on every click. The right-hand sidebar shows which
          sample was selected, and you can click individual sample numbers to
          lock it.
        </p>
      </DesktopOnly>
      <MobileOnly>
        <p>
          <strong>How it works:</strong> The sidebar
        </p>
      </MobileOnly>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: fit-content;
  margin-inline: auto;
  margin-top: 0.5rem;
  padding: 1rem 1.5rem;
  background: hsl(210deg 15% 6% / 0.5);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  corner-shape: bevel;

  --selection-bg: hsl(45deg 70% 70%);
  --selection-color: hsl(210deg 15% 6%);

  p {
    max-width: 75ch;
    margin-inline: auto;
    font-size: 0.875rem;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`;

const DesktopOnly = styled.div`
  display: none;

  @media (min-width: 37.5rem) {
    display: block;
  }
`;
const MobileOnly = styled.div`
  @media (min-width: 37.5rem) {
    display: none;
  }
`;

const TopAttachment = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  aspect-ratio: 2 / 1;
  border-radius: 0 0 100px 100px;
  corner-shape: bevel;
  background: var(--color-gray-800);
`;

const TopLeftAttachment = styled(TopAttachment)`
  left: 0;
  transform: translate(-50%, -8px);
`;
const TopRightAttachment = styled(TopAttachment)`
  right: 0;
  transform: translate(50%, -8px);
`;

export default Explanation;
