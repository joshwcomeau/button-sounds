import * as React from 'react';
import styled from 'styled-components';

import { GITHUB_URL, NPM_URL } from '@/constants';

import BevelEdge from '@/components/BevelEdge/BevelEdge';

import SystemTray from './SystemTray';
import TaskbarLink from './TaskbarLink';

function Taskbar() {
  return (
    <OuterWrapper>
      <Wrapper>
        <Links>
          <TaskbarLink href={GITHUB_URL}>
            <GHLogo src="/images/github-logo.svg" alt="GitHub" />
          </TaskbarLink>
          <TaskbarLink href={NPM_URL}>
            <NPMLogo src="/images/npm-logo.svg" alt="NPM" />
          </TaskbarLink>
        </Links>
        <SystemTray />
      </Wrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled.div`
  --bg: var(--color-gray-100);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 2.5rem;
  background: var(--bg);
  border-radius: 4px 4px 0 0;
  corner-shape: bevel;
  outline: 1px solid var(--color-gray-300);
`;

const Wrapper = styled.div`
  width: 1080px;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1rem;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 2.5rem;
`;

const Logo = styled.img`
  display: block;
`;

const GHLogo = styled(Logo)`
  width: 1.5rem;
  height: 1.5rem;
`;

const NPMLogo = styled(Logo)`
  width: 2rem;
`;

export default Taskbar;
