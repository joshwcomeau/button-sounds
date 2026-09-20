# button-sounds

> Add tactile press/release sound effects to your buttons and interactive
> elements.

Framework-agnostic core, plus a React hook under `button-sounds/react`.

## Install

```bash
npm install button-sounds
```

The React entry point depends on [`use-sound`](https://github.com/joshwcomeau/use-sound),
which is bundled as a dependency. `react` / `react-dom` are **optional** peers —
you only need them if you use `button-sounds/react`.

## Vanilla

```js
import { handlePress, handleRelease } from 'button-sounds';

const button = document.querySelector('button');
button.addEventListener('pointerdown', () => handlePress());
button.addEventListener('pointerup', () => handleRelease());
```

## React

```jsx
import { useButtonSfx } from 'button-sounds/react';

function MyButton() {
  const sfx = useButtonSfx();
  return <button {...sfx}>Click me</button>;
}
```

## Options

Both APIs accept the same options:

| Option   | Type      | Default | Description                  |
| -------- | --------- | ------- | ---------------------------- |
| `volume` | `number`  | `1`     | Playback volume, `0`–`1`.    |
| `muted`  | `boolean` | `false` | When `true`, no sound plays. |

> **Status:** early scaffold. The API surface is in place; real recorded
> sprites and the full option set are still in progress.

## License

MIT © Josh Comeau
