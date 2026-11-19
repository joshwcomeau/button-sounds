import * as React from 'react';
import styled from 'styled-components';

import BevelEdge from '@/components/BevelEdge/BevelEdge';
import WinampButton from '@/components/WinampButton/WinampButton';

function SystemTray() {
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

  return (
    <>
      <Wrapper>
        <BevelEdge side="top" color="black" radius={4} />
        <BevelEdge side="bottom" color="var(--color-gray-300)" radius={4} />
        <Clock>{formattedTime}</Clock>
        <Divider />
        <StyledWinampButton />
      </Wrapper>
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

const StyledWinampButton = styled(WinampButton)`
  margin-inline: -6px;
`;
export default SystemTray;
