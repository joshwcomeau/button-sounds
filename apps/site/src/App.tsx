import * as React from 'react';
import styled from 'styled-components';
import ButtonSounds, { SOUND_NAMES, DEFAULT_NAME } from 'button-sounds';
import type { SoundName } from 'button-sounds';
import { useButtonSounds } from 'button-sounds/react';

import CRTEffect from '@/components/CRTEffect/CRTEffect';
import MainDemo from '@/components/MainDemo/MainDemo';
import { SOUNDS_PATH } from './constants';

ButtonSounds.setPath(SOUNDS_PATH);

function App() {
  const [muted, setMuted] = React.useState(false);
  const [name, setName] = React.useState<SoundName>(DEFAULT_NAME);

  // React hook API.
  const reactRef = React.useRef<HTMLButtonElement>(null);
  useButtonSounds(reactRef, name, {
    pitchVariation: 0.25,
    volume: muted ? 0 : 1,
  });

  // Vanilla wireUp API, attached imperatively via a ref.
  const vanillaRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const el = vanillaRef.current;
    if (!el) return;
    return ButtonSounds.wireUp(el, name, {
      pitchVariation: 0.3,
      volume: muted ? 0 : 1,
    });
  }, [name, muted]);

  return (
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
