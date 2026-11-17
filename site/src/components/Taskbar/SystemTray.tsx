import * as React from 'react';
import styled from 'styled-components';
import { Zap } from 'lucide-react';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import MediaPlayer from '@/components/MediaPlayer/MediaPlayer';

function SystemTray() {
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCloseMediaPlayer = React.useCallback(() => {
    setIsMediaPlayerOpen(false);
  }, []);

  return (
    <>
      <Wrapper>
        <BevelEdge side="top" color="black" radius={4} />
        <BevelEdge side="bottom" color="var(--color-gray-300)" radius={4} />
        <Clock>{formattedTime}</Clock>
        <Divider />
        <MediaPlayerButton
          onClick={() => setIsMediaPlayerOpen(!isMediaPlayerOpen)}
        >
          <MediaPlayerIcon size={16} />
        </MediaPlayerButton>
      </Wrapper>
      {isMediaPlayerOpen && (
        <MediaPlayer handleClose={handleCloseMediaPlayer} />
      )}
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-gray-50);
  padding: 4px 16px;
  border-radius: 4px;
  corner-shape: bevel;
  border: 1px solid var(--color-gray-100);
`;

const Clock = styled.div`
  font-family: 'seven-segment';
  font-weight: 600;
  white-space: nowrap;
`;

const MediaPlayerButton = styled.button`
  width: 1.75rem;
  aspect-ratio: 1;
  display: grid;
  place-content: center;
  background: transparent;
  border: none;
  border: 1px solid var(--color-gray-100);
  border-radius: 4px;
  color: var(--color-primary);
  corner-shape: bevel;
  cursor: pointer;
  anchor-name: --media-player-anchor;

  &:hover {
    border-color: var(--color-gray-300);
  }

  /* I'm being a bit lazy here… there's no real reason that the media player and background music can't exist on mobile (aside from Safari's frequent refusal to play audio), but I don't feel like doing the work to make the Winamp clone responsive. */
  @media (max-width: 600px) {
    display: none;
  }
`;

const MediaPlayerIcon = styled(Zap)``;

const Divider = styled.div`
  align-self: stretch;
  width: 1px;
  flex-shrink: 0;
  border-radius: 1px;
  background: var(--color-gray-300);

  @media (max-width: 600px) {
    display: none;
  }
`;

export default SystemTray;
