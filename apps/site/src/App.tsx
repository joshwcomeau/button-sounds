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
        <header>
          <h1>
            Button <span>Sounds</span>
          </h1>
          <p>
            Add tactile press &amp; release sound effects to your UI — a tiny
            vanilla API, or a React hook.
          </p>
          <div>
            <code>npm install button-sounds</code>
          </div>
        </header>

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

export default App;
