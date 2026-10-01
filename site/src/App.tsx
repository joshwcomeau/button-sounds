import * as React from 'react';
import styled from 'styled-components';
import ButtonSounds, { SOUND_NAMES, DEFAULT_NAME } from 'button-sounds';

import SoundSettingsProvider from '@/components/SoundSettingsProvider';
import CRTEffect from '@/components/CRTEffect/CRTEffect';
import CRTControls from '@/components/CRTControls/CRTControls';
import ProjectByJosh from '@/components/ProjectByJosh/ProjectByJosh';
import MainDemo from '@/components/MainDemo/MainDemo';
import AboutPhilosophy from '@/components/AboutPhilosophy/AboutPhilosophy';
import { SOUNDS_PATH } from './constants';

ButtonSounds.setPath(SOUNDS_PATH);

function App() {
  const [crtStrength, setCrtStrength] = React.useState(0.7);
  return (
    <SoundSettingsProvider>
      <Wrapper>
        <Header>
          <h1>Button Sounds</h1>
          <p>
            A collection of 50+ professionally-recorded multi-sampled clicks and
            toggles. Distributed as an NPM package with optional React bindings.
          </p>
          <ProjectByJosh />
        </Header>

        <MainDemo />

        <AboutPhilosophy />

        <footer>
          <p>
            MIT © Josh Comeau · built on{' '}
            <a href="https://github.com/goldfire/howler.js">howler</a>
          </p>
        </footer>
        <CRTEffect strength={crtStrength} />
      </Wrapper>
      <CRTControls crtStrength={crtStrength} setCrtStrength={setCrtStrength} />
    </SoundSettingsProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60rem;
  padding-block: 3rem;
  margin-inline: auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 45rem;
  margin-inline: auto;
  margin-bottom: 4rem;
  padding-block: 4rem;
  text-align: center;

  h1 {
    font-size: 4rem;
    font-family: var(--font-segment);
  }

  p {
    text-wrap: balance;
    margin-bottom: 2rem;
  }
`;

export default App;
