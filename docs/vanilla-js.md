# Using the JavaScript API

## The high-level `wireUp` function

This library includes both a high-level and a low-level API. The high-level API is designed to be used in most circumstances. Here’s how to use it:

```js
import { wireUp } from 'button-sounds';

// Grab a reference to the button you want to add sounds to:
const button = document.querySelector('.my-button');

// Attach pointer event listeners, and specify the sound to play:
ButtonSounds.wireUp(
  button,
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
```

As the name suggests, the `wireUp` function wires everything up so that each click and release will trigger a random sample of the chosen sound. The list of all valid sound names is available in the [Sound Playground](https://buttons.joshwcomeau.com). We can also optionally provide some custom options, described below.

It also handles preloading the specified sound, so that it’s available when the user first clicks the button.

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

If you need more control over the sound playback, the library also exposes individual functions to play the press/release samples, as well as a `load` function to preload it:

```js
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
```

The `press` and `release` functions also take an optional `options` argument, with similar options to the higher-level API:

- `sampleIndex` — optionally select one of the specific recorded samples to play. If omitted, a random sample will be selected.
- `volume` (default: 0.5) — controls how loud the button presses will be, from 0 (muted) to 1 (full volume).
- `playbackRate` (default: 1) — change the pitch of the sound by speeding it up or slowing it down.
- `lofi` and `lofiOptions` — same as the higher-level API, described above.

With the lower-level API, we’re the ones responsible for calling `press`/`release`, which changes how some of these options work. Instead of supplying a `pitchVariation`, for example, we can instead specify the specific `playbackRate` we want for each invocation, giving us total control over the pitch each time.

### Nested event handlers

If you use the lower-level API, I have a counterintuitive recommendation:

```js
// ⛔ Don’t add parallel pointerDown/pointerUp event handlers:
button.addEventListener('pointerdown', () => press('iidx'));
button.addEventListener('pointerup', () => release('iidx'));

// ✅ Instead, nest the pointerUp handler within the pointerDown handler:
button.addEventListener('pointerdown', () => {
  press('iidx');

  // After playing the 'down' sample, register a global listener for the 'up' sample:
  window.addEventListener(
    'pointerup',
    () => {
      release('iidx');
    },
    { once: true },
  );
});
```

The problem with having a parallel `pointerUp` listener is that it leads to two weird edge-cases:

1. Suppose the user is selecting some text on the page, and they happen to release the cursor while it's hovering over the button. A `pointerUp` event handler would play the 'up' sound even though the button was never depressed.
1. Suppose the user presses down on the button, but shifts a few pixels off of the button before releasing it. The button would visually shift from `:active` back to normal, but the sound wouldn’t play, since technically the `pointerUp` event didn't trigger on the button.

By nesting the `pointerUp` listener, we ensure that the two sounds are connected, that we'll always get the 'release' sound when the button is released. Stray `pointerUp` events will be ignored.

There are other valid solutions to this problem; for example, we could use a variable to keep track of the button’s pressed state. I really like the nested approach since everything is contained in one spot. The `{ once: true }` parameter is super nice in situations like this! But really, this is a personal preference. Feel free to use a different approach if you prefer.
