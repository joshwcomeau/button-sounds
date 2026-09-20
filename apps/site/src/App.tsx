import { useState } from 'react';
import { handlePress, handleRelease } from 'button-sounds';
import { useButtonSfx } from 'button-sounds/react';
import './App.css';

export function App() {
  const [muted, setMuted] = useState(false);
  const sfx = useButtonSfx({ muted });

  return (
    <main className="page">
      <header className="hero">
        <h1>
          Button <span className="accent">Sounds</span>
        </h1>
        <p className="tagline">
          Add tactile press &amp; release sound effects to your UI — a tiny
          vanilla function, or a React hook.
        </p>
        <div className="install">
          <code>npm install button-sounds</code>
        </div>
      </header>

      <section className="demo">
        <div className="demo-head">
          <h2>Try it</h2>
          <label className="mute-toggle">
            <input
              type="checkbox"
              checked={muted}
              onChange={(event) => setMuted(event.target.checked)}
            />
            Mute
          </label>
        </div>

        <div className="button-row">
          <button className="sfx-button" type="button" {...sfx}>
            React hook
          </button>

          <button
            className="sfx-button"
            type="button"
            onPointerDown={() => handlePress({ muted })}
            onPointerUp={() => handleRelease({ muted })}
          >
            Vanilla fn
          </button>
        </div>

        <p className="hint">
          The scaffold plays a silent placeholder sprite — real recorded sounds
          are coming soon.
        </p>
      </section>

      <section className="usage">
        <div className="snippet">
          <h3>Vanilla</h3>
          <pre>
            <code>{`import { handlePress } from 'button-sounds';

button.addEventListener('pointerdown', () => {
  handlePress();
});`}</code>
          </pre>
        </div>

        <div className="snippet">
          <h3>React</h3>
          <pre>
            <code>{`import { useButtonSfx } from 'button-sounds/react';

function MyButton() {
  const sfx = useButtonSfx();
  return <button {...sfx}>Click me</button>;
}`}</code>
          </pre>
        </div>
      </section>

      <footer className="footer">
        <p>
          MIT © Josh Comeau · built on{' '}
          <a href="https://github.com/joshwcomeau/use-sound">use-sound</a>
        </p>
      </footer>
    </main>
  );
}
