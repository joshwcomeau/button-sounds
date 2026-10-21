import * as React from 'react';
import styled from 'styled-components';

import MultiSampleDemo from '@/components/MultiSampleDemo/MultiSampleDemo';
import TextLink from '@/components/Link/TextLink';
import InlineCode from '@/components/InlineCode/InlineCode';
import Aside from '@/components/Aside/Aside';

import Snippet from '../Snippet/Snippet';

const VANILLA_JS_EXAMPLE = `\
import { wireUp } from 'button-sounds';

// Grab a reference to the button you want to add sounds to:
const button = document.querySelector('.my-button');

// Attach pointer event listeners, and specify the sound to play:
ButtonSounds.wireUp(button, 'hi75-soft');
`;
const LOW_LEVEL_EXAMPLE = `\
import { load, press, release } from 'button-sounds';

// Preload the audio file ASAP:
load('hi75-soft');

const btn = document.querySelector('my-button');

// Trigger the sounds whenever you’d like:
btn.addEventListener('pointerdown', () => {
  if (someCondition) {
    press('hi75-soft');
  }
});
`;
const CONFIGURATION_EXAMPLE = `\
import { wireUp } from 'button-sounds';

const button = document.querySelector('.my-button');

ButtonSounds.wireUp(
  button,
  'hi75-soft',
  {
    pitchVariation: 0.1,
    lofi: true,
    lofiOptions: {
      bits: 4,
      downsample: 0.25,
    },
  }
);
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
const REACT_LOW_LEVEL_EXAMPLE = `\
import { useImperativeButtonSounds } from 'button-sounds/react';

function SomeComponent() {
  const { press, release } = useImperativeButtonSounds('hi75-soft');

  return (
    <button
      onPointerDown={() => {
        if (someCondition) {
          press();
        }
      }}
    >
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
          A library of 50+ high-quality button sounds, with up to 16 recorded
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
        (like, clicking a button repeatedly), it winds up feeling very
        monotonous and artificial. In real life, button presses don’t sound{' '}
        <em>identical</em> every time.
      </p>
      <p>
        One of my favourite lil’ sound effect tricks is to record the same sound
        multiple times. Whenever it gets triggered, a random instance is
        selected and played. It’s subtle, but it winds up feeling a lot more
        realistic and organic.
      </p>
      <p>
        Here's a little demo showing the difference. Try spamming the “Trigger”
        button with and without locking it to the first sample:
      </p>
      <StyledMultiSampleDemo />
      <p>
        Like I said, it can be a bit subtle, especially if you’re listening on
        laptop or phone speakers. But I hope you’ll agree that the random sample
        selection just <em>feels</em> better.
      </p>
      <p>
        <strong>This is the core idea with this library.</strong> I scoured my
        home looking for things with buttons and made a whole bunch of
        recordings. Each of the 50+ sounds has at least 8 samples (4 pressing, 4
        releasing). In reality, I recorded many more than that, but I only kept
        the most interesting ones.
      </p>
      <Aside title="For the audio nerds">
        <p>
          The sounds were recorded in the same sound-treated room using a Zoom
          H4 recorder, with additional processing to remove noise in Adobe
          Audition. The only exceptions are <InlineCode>synth-on</InlineCode>{' '}
          and <InlineCode>synth-off</InlineCode>, which were created digitally
          using the <i>Current</i> VST synth.
        </p>
        <p>
          Sounds are available either as{' '}
          <TextLink
            target="_blank"
            href="https://github.com/joshwcomeau/button-sounds/tree/main/package/assets"
          >
            192kbps MP3 files
          </TextLink>{' '}
          or{' '}
          <TextLink
            target="_blank"
            href="https://github.com/joshwcomeau/button-sounds/tree/main/package/audio"
          >
            lossless 48KHz .wav files
          </TextLink>
          .
        </p>
      </Aside>

      <h3>A super-convenient library</h3>
      <p>
        The other half of this project is the{' '}
        <TextLink href="https://www.npmjs.com/package/button-sounds">
          NPM package
        </TextLink>{' '}
        that makes it as easy as possible to start using these sounds in your
        own projects.
      </p>
      <p>Here’s a quick “Hello World” example:</p>
      <Snippet lang="javascript">{VANILLA_JS_EXAMPLE}</Snippet>
      <p>
        That <InlineCode>wireUp</InlineCode> function is doing <em>a bunch</em>{' '}
        of stuff under the hood, including:
      </p>
      <ol>
        <li>
          Preloading the specified audio file so that it’s available when the
          first click occurs.
        </li>
        <li>
          Adding event handlers to the button so that the correct sounds trigger
          at the right times. There are some subtle gotchas here that the
          library takes care of.
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
        an <TextLink href="">NPM script</TextLink> to make this easy). The files
        are only loaded when you call <InlineCode>.wireUp</InlineCode>, which
        means only the selected sound(s) will be downloaded.
      </p>
      <p>
        The <InlineCode>button-sounds</InlineCode> package is tiny, only adding
        ~2kB gzip to your bundle (though it does asynchronously load Howler, a
        ~12kB JS library for playing sounds).
      </p>
      <h3>The lower-level API</h3>
      <p>
        I consider the <InlineCode>wireUp</InlineCode> function to be the
        high-level API. Call one function and you’re good to go.
      </p>
      <p>
        In some cases, however, you might want more control over when the
        press/release sounds trigger. In that case, you can use the lower-level
        API:
      </p>
      <Snippet lang="javascript">{LOW_LEVEL_EXAMPLE}</Snippet>

      <p>
        This lower-level API is intended to be used for less-basic use cases, of
        course. If the goal is to trigger the sounds on press/release, the
        higher-level API is both easier to use and provides better UX
        (specifically around making sure the 'release' sound always triggers
        correctly, regardless of where the cursor is).
      </p>

      <h3>Additional configuration</h3>
      <p>
        As shown in the playground above, the library also includes options for
        pitch variation and lower fidelity:
      </p>
      <Snippet lang="javascript">{CONFIGURATION_EXAMPLE}</Snippet>
      <p>
        The <InlineCode>lofi</InlineCode> parameter is a boolean that can be
        turned on for a typical NES-style bitcrusher effect, but you can also
        supply <InlineCode>LofiOptions</InlineCode> to control the specific bit
        depth and downsampling rate.
      </p>

      <h3>React bindings</h3>

      <p>
        Finally, if you use React, I’ve also included a couple of React hooks
        that tackle all of this stuff. Here’s the main high-level API:
      </p>
      <Snippet lang="javascript">{REACT_EXAMPLE}</Snippet>
      <p>
        And here’s the lower-level API that exposes{' '}
        <InlineCode>press</InlineCode> and <InlineCode>release</InlineCode>{' '}
        functions directly:
      </p>
      <Snippet lang="javascript">{REACT_LOW_LEVEL_EXAMPLE}</Snippet>

      <h2>Going deeper</h2>
      <p>
        This has been a quick introduction to the library. If you want to learn
        more, check out the{' '}
        <TextLink href="https://github.com/joshwcomeau/button-sounds">
          README on Github
        </TextLink>{' '}
        for the source code and documentation. You can also point your agent to
        this README for better results.
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
