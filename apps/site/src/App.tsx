import { useEffect, useRef, useState } from 'react';
import ButtonSounds, { SOUND_NAMES, DEFAULT_NAME } from 'button-sounds';
import type { SoundName } from 'button-sounds';
import { useButtonSounds } from 'button-sounds/react';
import './App.css';

// The published package loads sounds from the jsDelivr CDN by default. This demo isn't published, so it self-hosts: `pnpm dev` copies the sounds into public/sounds, and we point the library there.
const SOUNDS_PATH = '/sounds';
ButtonSounds.setPath(SOUNDS_PATH);

export function App() {
  const [muted, setMuted] = useState(false);
  const [name, setName] = useState<SoundName>(DEFAULT_NAME);

  // React hook API.
  const reactRef = useRef<HTMLButtonElement>(null);
  useButtonSounds(reactRef, name, { pitchVariation: 0.25, muted });

  // Vanilla wireUp API, attached imperatively via a ref.
  const vanillaRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = vanillaRef.current;
    if (!el || muted) return;
    return ButtonSounds.wireUp(el, name, { pitchVariation: 0.3 });
  }, [name, muted]);

  return (
    <main className="page">
      <header className="hero">
        <h1>
          Button <span className="accent">Sounds</span>
        </h1>
        <p className="tagline">
          Add tactile press &amp; release sound effects to your UI — a tiny
          vanilla API, or a React hook.
        </p>
        <div className="install">
          <code>npm install button-sounds</code>
        </div>
      </header>

      <section className="demo">
        <div className="demo-head">
          <h2>Try it</h2>
          <div className="demo-controls">
            <label className="control">
              Name
              <select
                value={name}
                onChange={(event) => setName(event.target.value as SoundName)}
              >
                {SOUND_NAMES.map((soundName) => (
                  <option key={soundName} value={soundName}>
                    {soundName}
                  </option>
                ))}
              </select>
            </label>
            <label className="control mute-toggle">
              <input
                type="checkbox"
                checked={muted}
                onChange={(event) => setMuted(event.target.checked)}
              />
              Mute
            </label>
          </div>
        </div>

        <div className="button-row">
          <button className="sfx-button" type="button" ref={reactRef}>
            React hook
          </button>

          <button className="sfx-button" type="button" ref={vanillaRef}>
            Vanilla wireUp
          </button>
        </div>

        <p className="hint">
          Each press/release plays a random sample from the sound, so no two
          clicks sound quite the same. Both buttons also randomize pitch.
        </p>
      </section>

      <section className="usage">
        <div className="snippet">
          <h3>Vanilla</h3>
          <pre>
            <code>{`import ButtonSounds from 'button-sounds';

ButtonSounds.wireUp(button, 'uhk-soft', {
  pitchVariation: 0.3,
});`}</code>
          </pre>
        </div>

        <div className="snippet">
          <h3>React</h3>
          <pre>
            <code>{`import { useButtonSounds } from 'button-sounds/react';

function MyButton() {
  const buttonRef = React.useRef();
  useButtonSounds(buttonRef, 'uhk-soft', { pitchVariation: 0.25 });
  return <button ref={buttonRef}>Click me</button>;
}`}</code>
          </pre>
        </div>
      </section>

      <footer className="footer">
        <p>
          MIT © Josh Comeau · built on{' '}
          <a href="https://github.com/goldfire/howler.js">howler</a>
        </p>
      </footer>
    </main>
  );
}
