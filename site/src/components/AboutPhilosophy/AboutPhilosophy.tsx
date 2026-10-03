import * as React from 'react';
import styled from 'styled-components';

import MultiSampleDemo from '@/components/MultiSampleDemo/MultiSampleDemo';
import Snippet from '../Snippet/Snippet';

const VANILLA_JS_EXAMPLE = `\
import ButtonSounds from 'button-sounds';

// Grab a reference to the button you want to add sounds to:
const button = document.querySelector('.my-button');

// Specify which sound you want to use:
ButtonSounds.wireUp(button, 'hi75-soft');
`;
const REACT_EXAMPLE = `\
import { useButtonSounds } from 'button-sounds/react';

function SomeComponent() {
  const buttonRef = React.useRef(null);

  useButtonSounds(buttonRef, 'hi75-soft');

  return (
    <button ref={buttonRef}>Click me</button>
  );
}
`;

function AboutPhilosophy() {
  return (
    <Wrapper>
      <h2>Why is this useful?</h2>
      <p>
        There are plenty of existing button sound effects out there, including{' '}
        <a href="https://freesound.org/search/?q=button">
          thousands on freesound.org
        </a>
        . So why would you use this?
      </p>
      <p>There are a few reasons I think this is a useful tool.</p>
      <h3>Multi-sampled sounds</h3>
      <p>
        The vast majority of existing SFX are one-shots; you get a single
        press-and-release sample. This winds up sounding very monotonous,
        especially if the action is performed repeatedly.
      </p>
      <p>
        In my library, I recorded the same button action dozens of times and
        picked 4-8 samples that were distinctive. When pressing/releasing a
        button, one of the samples is chosen at random, which produces a
        much-more-realistic and tactile button-pressing experience.
      </p>
      <p>Here's a little demo showing the difference:</p>
      <MultiSampleDemo />
      <h3>A cohesive set of sounds</h3>
      <p>
        In the past, I’ve assembled my library of sound effects from sites like{' '}
        <a href="https://freesound.org/">freesound.org</a>. The trouble with
        this approach is that it always winds up feeling a bit inconsistent;
        different sounds were recorded in different environments, with different
        equipment and different levels of noise.
      </p>
      <p>
        I recorded all 50+ sounds myself, in the same space, using the same
        equipment and with the same noise-reduction processing. As a result, all
        of these sounds feel like part of the same family. You can use different
        sounds for different buttons, and it'll all feel cohesive. 😄
      </p>
      <h3>A super-convenient library</h3>
      <p>
        In addition to providing the <a href="">raw .mp3 files</a>, I've also
        produced an NPM library that makes it super easy to start using these
        sounds in your own JavaScript projects.
      </p>
      <p>Here’s a quick “Hello World” example of the raw JS version:</p>
      <Snippet lang="javascript">{VANILLA_JS_EXAMPLE}</Snippet>
      <p>
        That’s it! The <code>wireUp</code> function will automatically add
        pointer event listeners to the button.
      </p>
      <p>
        By default, the audio files will be loaded from NPM’s CDN, so you don’t
        even need to host them yourself (though you can if you want, and there’s
        an <a href="">NPM script</a> to make this easy). The files are only
        loaded when you call <code>.wireUp</code>, which means only the selected
        sounds will be preloaded, ready for the very first click.
      </p>
      <p>
        If you use React, I’ve also included a couple of React hooks you can
        use:
      </p>
      <Snippet lang="javascript">{REACT_EXAMPLE}</Snippet>
      <p>
        Both the React and JavaScript versions have lower-level alternative
        APIs, in case you want to trigger the sounds yourself. You can also use
        the <code>lofi</code> and <code>pitchVariation</code> options to
        customize the sound even more!
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 3rem;
  max-width: 60ch;
  margin-inline: auto;
`;

export default AboutPhilosophy;
