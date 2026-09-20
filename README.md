# Button Sounds

Add tactile press/release sound effects to your buttons and interactive
elements. Ships a framework-agnostic vanilla API and a React hook.

This repository is a pnpm monorepo:

| Path                     | What it is                                            |
| ------------------------ | ----------------------------------------------------- |
| `packages/button-sounds` | The `button-sounds` npm package (vanilla + `/react`). |
| `apps/site`              | The landing page / interactive demo.                  |

## Getting started

```bash
pnpm install
pnpm dev          # runs the package in watch mode + the demo site
```

Other useful scripts:

```bash
pnpm build        # build the package, then the site
pnpm test         # run package tests
pnpm typecheck    # type-check every workspace
pnpm lint:pkg     # validate package exports (publint + are-the-types-wrong)
```

## Package usage (preview)

```js
// Vanilla
import { handlePress } from 'button-sounds';

button.addEventListener('pointerdown', () => handlePress());
```

```jsx
// React
import { useButtonSfx } from 'button-sounds/react';

function MyButton() {
  const sfx = useButtonSfx();
  return <button {...sfx}>Click me</button>;
}
```

> **Status:** early scaffold. The public API surface is in place, but the real
> recorded audio sprites and the full option set are still being built out.

## License

MIT © Josh Comeau
