import * as React from 'react';
import styled from 'styled-components';
import ButtonSounds, { SOUND_NAMES, DEFAULT_NAME } from 'button-sounds';
import { highlightAll } from 'microlighter';
import 'microlighter/themes/tokyo-night.css';

import SoundSettingsProvider from '@/components/SoundSettingsProvider';
import CRTEffect from '@/components/CRTEffect/CRTEffect';
import CRTControls from '@/components/CRTControls/CRTControls';
import ProjectByJosh from '@/components/ProjectByJosh/ProjectByJosh';
import MainDemo from '@/components/MainDemo/MainDemo';
import AboutPhilosophy from '@/components/AboutPhilosophy/AboutPhilosophy';
import { ShapeLayer } from '@/components/ButtonShapes/ButtonShapes';

import { SOUNDS_PATH } from './constants';

ButtonSounds.setPath(SOUNDS_PATH);

function App() {
  const [crtStrength, setCrtStrength] = React.useState(0.7);

  React.useEffect(() => {
    document.body.dataset.syntaxTheme = 'tokyo-night';
    highlightAll();
  }, []);

  return (
    <SoundSettingsProvider>
      <CRTControls
        crtStrength={crtStrength}
        setCrtStrength={setCrtStrength}
        // I don't want the CRT slider to be affected by the CRT effect itself; the vignette darkens the corners of the screen, which makes it harder to distinguish the slider! So, the controls exist outside the “Container” stacking context that holds the effect.
        // It also needs to be up here, *before* the main content, for keyboard tab order to make sense.
        style={{ zIndex: 2 }}
      />
      <Container>
        <Wrapper>
          <ShapeLayer layer="background" />
          <Header>
            <h1>Button Sounds</h1>
            <p>
              A <em>free</em> collection of 50+ professionally-recorded
              multi-sampled clicks and toggles. Distributed as an NPM package
              with optional React bindings.
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
      </Container>
    </SoundSettingsProvider>
  );
}

// NOTE: I need this for `ShapeLayer`; it uses `position; absolute; inset: 0`, which by default uses the initial containing block, and as a result, images below the fold get cut off due to overflow: hidden. So, this element wraps around everything and creates a containing block so that we aren't locked to the ICB.
const Container = styled.div`
  position: relative;
  reading-order: 2;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60rem;
  padding-block: 3rem;
  margin-inline: auto;
`;

const Header = styled.header`
  position: relative;
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
    font-size: 1.125rem;
  }
`;

export default App;
