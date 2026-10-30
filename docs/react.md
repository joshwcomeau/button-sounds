# Using the React API

If you use React, I’ve provided two convenient custom hooks that wrap over the vanilla JS API and make it a bit nicer to use in a React context.

## The high-level `useButtonSounds` hook

In most situations, you’ll want to use this hook. It does everything in a single step:

```tsx
import { useButtonSounds } from 'button-sounds/react';

function SomeComponent() {
  const buttonRef = React.useRef(null);

  useButtonSounds(
    buttonRef,
    'hi75-soft',
    // Optionally provide custom parameters:
    {
      volume: 0.5,
      pitchVariation: 0.1,
      lofi: true,
      lofiOptions: {
        bits: 4,
        downsample: 0.25,
      },
    },
  );

  return <button ref={buttonRef}>Click me</button>;
}
```

We supply `useButtonSounds` with an element ref and the name of the specific sound we want to use. The list of all valid sound names is available in the [Sound Playground](https://buttons.joshwcomeau.com). We can also optionally provide some custom options, described below.

Internally, this hook will wire everything up so that each click and release triggers a random sample of the chosen sound. It also handles preloading the specified sound so that it’s available when the user first clicks the button.

Technically, this function should work with any valid DOM node, but I would strongly recommend only using it on interactive elements like `<button>`, `<a>`, `<input>`, etc.

### Options

The `wireUp` function takes an optional set of options:

- `volume` (default: 0.5) — controls how loud the button presses will be, from 0 (muted) to 1 (full volume).
- `pitchVariation` (default: 0) — tweaks the `playbackRate` value on each trigger by +/- the provided amount. For example, specifying `pitchVariation: 0.1` will pick a playback speed between 0.9 and 1.1.
  - Alternatively, you can pass a tuple of two values to manually set the min/max playback speeds. For example, specifying `pitchVariation: [0.8, 1.5]` will pick a random value between 0.8 and 1.5.
- `lofi` (default: `false`) — enables a retro NES-style bitcrushed effect.
- `lofiOptions.bits` (default: 4) — sets the bit depth of the playback. Lower values are crunchier, as quantization errors distort the sound.
- `lofiOptions.downsample` (default: 0.25) — reduces the sample rate, lowering the number of data points used in the audio file. Lower values produce deeper and muddier sounds.

Note that `lofiOptions` are ignored unless `lofi` is set to `true`

> [!NOTE]
> For `volume`, I recommend picking lower values, between 0.25 and 0.5. Sound isn’t very common on the web and we don’t want to startle people who have their volume turned up.
> And for `pitchVariation`, I find that less is more. Even tiny values like 0.05 can produce a nice amount of variation, though it depends on the specific sound.

## The lower-level API

If you need more control over the sound playback, the library also exposes an alternative hook, `useImperativeButtonSounds`:

```js
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
```

With this version of the hook, we’re responsible for calling the `press` and `release` functions whenever we want to trigger the sound. These functions take an optional `options` argument, with similar options to the higher-level API:

- `sampleIndex` — optionally select one of the specific recorded samples to play. If omitted, a random sample will be selected.
- `volume` (default: 0.5) — controls how loud the button presses will be, from 0 (muted) to 1 (full volume).
- `playbackRate` (default: 1) — change the pitch of the sound by speeding it up or slowing it down.
- `lofi` and `lofiOptions` — same as the higher-level API, described above.

The options are slightly different since we’re the ones responsible for triggering each sound. Instead of supplying a `pitchVariation`, for example, we can instead specify the actual `playbackRate` we want for each invocation, giving us total control over the pitch each time.

### Nested event handlers

If you use the lower-level API, I have a counterintuitive recommendation:

```tsx
// ⛔ Don’t add parallel pointerDown/pointerUp event handlers:
<button
  onPointerDown={() => press('iidx')}
  onPointerUp={() => release('iidx')}
/>

// ✅ Instead, nest the pointerUp handler within the pointerDown handler:
<button
  onPointerDown={() => {
    press('iidx');

    // After playing the 'down' sample, register a global listener for the 'up' sample:
    window.addEventListener(
      'pointerup',
      () => {
        release('iidx');
      },
      // Automatically cancel the event listener after a single use:
      { once: true },
    );
  }}
/>
```

The problem with having a parallel `pointerUp` listener is that it leads to two weird edge-cases:

1. Suppose the user is selecting some text on the page, and they happen to release the cursor while it's hovering over the button. They never actually clicked the button, but since the cursor is resting on top of it, it triggers a `pointerUp` event, which would play the “release” sound.
2. Suppose the user presses down on the button, but happens to shift a few pixels off of the button before releasing it. The button would visually shift from `:active` back to normal, but the sound wouldn’t play, since technically the `pointerUp` event didn't trigger on the button.

By nesting the `pointerUp` listener, we ensure that the two sounds are linked. We’ll always hear the button pop back up when it’s been depressed, and stray `pointerUp` events will be ignored.

There are other valid solutions to this problem; for example, we could use a state variable or a ref to keep track of the button’s pressed state, and register the global `pointerUp` event listener in an effect. Personally, I prefer the nested approach because everything is tackled in one spot, but I'm not too fussy about the particular implementation. The most important thing is that we handle the aforementioned edge cases.

## Hosting the audio files yourself

By default, the .mp3 audio files will be downloaded directly from the JSDelivr CDN. For example:

- https://cdn.jsdelivr.net/npm/button-sounds@0.0.0/assets/hi75-soft.mp3

If you’d prefer, you can alternatively download the audio files yourself and point the library to your own copies of the files. You can learn more about this in the [“Self-hosting the audio files” docs](https://github.com/joshwcomeau/button-sounds/blob/main/docs/self-hosting-audio-files.md).
