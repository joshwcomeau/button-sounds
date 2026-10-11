import * as React from 'react';
import styled from 'styled-components';

import MultiSampleDemo from '@/components/MultiSampleDemo/MultiSampleDemo';
import Snippet from '../Snippet/Snippet';

const VANILLA_JS_EXAMPLE = `\
import { wireUp } from 'button-sounds';

// Grab a reference to the button you want to add sounds to:
const button = document.querySelector('.my-button');

// Attach pointer event listeners, and specify the sound to play:
ButtonSounds.wireUp(button, 'hi75-soft');
`;
const LOW_LEVEL_EXAMPLE = `\
import { load, press, release} from 'button-sounds';

// Preload the audio file ASAP:
load('hi75-soft');

const btn = document.querySelector('my-button');

// Trigger the sounds whenever you’d like:
btn.addEventListener('pointerdown', () => {
  press('hi75-soft');
});
`;
const REACT_EXAMPLE = `\
import { useButtonSounds } from 'button-sounds/react';

function SomeComponent() {
  const buttonRef = React.useRef(null);

  useButtonSounds(buttonRef, 'hi75-soft');

  return (
    <button ref={buttonRef}>
      Click me
    </button>
  );
}
`;

function AboutPhilosophy(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Wrapper {...props}>
      <h2>
        About <em>Button Sounds</em>
      </h2>
      <p>There’s two pieces to this project:</p>
      <ol>
        <li>
          A library of 50+ uniform high-quality button sounds, with up to 16
          samples per sound.
        </li>
        <li>
          An NPM package that makes it as easy as possible to start using these
          sounds in your web projects.
        </li>
      </ol>
      <p>
        On this page, we’re going to look at both of these pieces. But first,
        let’s talk about <em>why</em> I created this project.
      </p>
      <h3>Multi-sampled sounds</h3>
      <p>
        The vast majority of existing SFX are “one-shots”; you get a single
        recorded instance of the sound. If that sound gets triggered often
        (like, a button which can be clicked over and over), it winds up feeling
        very monotonous and artificial. In real life, button presses don’t sound{' '}
        <em>identical</em> every time.
      </p>
      <p>
        One of my favourite lil’ sound effect tricks is to record the same sound
        multiple times, and pick one of those sounds randomly whenever it’s
        triggered. It’s subtle, but it winds up feeling a lot more realistic and
        organic.
      </p>
      <p>
        Here's a little demo showing the difference. Try spamming the “Trigger”
        button with and without locking it to the first sample:
      </p>
      <StyledMultiSampleDemo />
      <p>
        Like I said, it can be a bit subtle, especially if you’re listening on
        phone speakers. But I hope you’ll agree that the random sample selection
        just <em>feels</em> better.
      </p>
      <p>
        <strong>This is the core idea with this library.</strong> I scoured my
        home looking for things that had buttons and recorded a whole lot of
        button presses and releases. Each of the 50+ sounds has at least 8
        samples (4 pressing, 4 releasing), and I tried to select samples that
        had a good bit of variety, while still feeling consistent.
      </p>
      <aside>
        For the audio nerds out there: sounds were recorded in a sound-treated
        room using a Zoom H4 recorder, with additional processing to remove
        noise in Adobe Audition. Sounds are available either as{' '}
        <a
          target="_blank"
          href="https://github.com/joshwcomeau/button-sounds/tree/main/package/assets"
        >
          192kbps MP3 files
        </a>{' '}
        or{' '}
        <a
          target="_blank"
          href="https://github.com/joshwcomeau/button-sounds/tree/main/package/audio"
        >
          48Hz .wav files
        </a>
        .
      </aside>

      <h3>A super-convenient library</h3>
      <p>
        The other half of this project is the{' '}
        <a href="https://www.npmjs.com/package/button-sounds">NPM package</a>{' '}
        that makes it as easy as possible to start using these sounds in your
        own projects.
      </p>
      <p>Here’s a quick “Hello World” example:</p>
      <Snippet lang="javascript">{VANILLA_JS_EXAMPLE}</Snippet>
      <p>
        That <code>wireUp</code> function is doing <em>a bunch</em> of stuff
        under the hood, including:
      </p>
      <ol>
        <li>
          Preloading the specified audio file so that it’s available when the
          first click occurs.
        </li>
        <li>
          Adding event handlers to the button so that the correct sounds trigger
          at the right times. This is harder than it sounds, since there are
          lots of little edge cases.
        </li>
        <li>
          Picking random samples on every press/release, and optionally adding a
          small amount of pitch variation for even more variety.
        </li>
        <li>
          Optionally reduce the bit/sample rate for crunchy NES-style sounds.
        </li>
      </ol>
      <p>
        By default, the audio files will be loaded from NPM’s CDN, so you don’t
        even need to host them yourself (though you can if you want, and there’s
        an <a href="">NPM script</a> to make this easy). The files are only
        loaded when you call <code>.wireUp</code>, which means only the selected
        sound(s) will be downloaded.
      </p>
      <p>
        The <code>button-sounds</code> package is tiny, only adding ~2kB gzip to
        your bundle (though it does asynchronously load Howler, a ~12kB JS
        library for playing sounds).
      </p>
      <h3>The lower-level API</h3>
      <p>
        I consider the <code>wireUp</code> function to be the high-level API.
        Call one function and you’re good to go.
      </p>
      <p>
        In some cases, however, you might want more control over when the
        press/release sounds trigger. In that case, you can use the lower-level
        API:
      </p>
      <Snippet lang="javascript">{LOW_LEVEL_EXAMPLE}</Snippet>

      <p>
        Just please note that the lower-level API misses some of the
        nice-to-haves. For example, the higher-level API wires up the pointerUp
        listener <em>within</em> the pointerDown listener, so that the release
        sound still triggers even if the user isn’t still hovering over the
        button when they release the cursor.
      </p>

      <h3>Additional configuration</h3>
      <p>Pitch variation and lofi.</p>

      <h3>React bindings</h3>

      <p>
        Finally, if you use React, I’ve also included a couple of React hooks
        that tackle all of this stuff. Here’s the main high-level API:
      </p>
      <Snippet lang="javascript">{REACT_EXAMPLE}</Snippet>
      <p>
        I’ve also included a lower-level hook,{' '}
        <code>useImperativeButtonSounds</code>, that provides the{' '}
        <code>press</code> and <code>release</code> functions directly, in case
        the higher-level API doesn’t work for you.
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 3rem;
  max-width: 70ch;
  margin-inline: auto;

  li:not(:last-child) {
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.25rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  ol {
    margin-bottom: 1rem;

    ::marker {
      color: var(--color-primary);
      font-style: italic;
    }
  }
`;

const StyledMultiSampleDemo = styled(MultiSampleDemo)`
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export default AboutPhilosophy;
