import * as React from 'react';
import styled from 'styled-components';
import ButtonSounds, { SOUND_NAMES, DEFAULT_NAME } from 'button-sounds';

import CRTEffect from '@/components/CRTEffect/CRTEffect';
import MainDemo from '@/components/MainDemo/MainDemo';
import SoundSettingsProvider from '@/components/SoundSettingsProvider';
import { SOUNDS_PATH } from './constants';

ButtonSounds.setPath(SOUNDS_PATH);

function App() {
  return (
    <SoundSettingsProvider>
      <Wrapper>
        <Header>
          <h1>Button Sounds</h1>
          <p>
            A collection of 50+ professionally-recorded multi-sampled clicks and
            toggles. Easy to use with a JavaScript library as well as React
            bindings.
          </p>
          <div>
            <code>npm install button-sounds</code>
          </div>
        </Header>

        <MainDemo />

        <footer>
          <p>
            MIT © Josh Comeau · built on{' '}
            <a href="https://github.com/goldfire/howler.js">howler</a>
          </p>
        </footer>
        <CRTEffect />
      </Wrapper>
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
  gap: 1rem;
  padding-block: 4rem;

  h1 {
    text-align: center;
    font-size: 4rem;
  }
`;

export default App;
