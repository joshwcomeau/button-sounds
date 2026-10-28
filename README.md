# Button Sounds

> NOTE: This project is a work-in-progress and has not yet been released. Use at your own risk!

A collection of 50+ professionally-recorded multi-sampled clicks and toggles. Available as standalone audio files or through a convenient feature-packed NPM library. 🎵

- [Sound Playground](https://buttons.joshwcomeau.com)
- [NPM package](https://npmx.dev/package/button-sounds)

## Why does this project exist?

I’ve been adding little UI sound effects to my projects for years, and I think they add a lot to the user experience.

The problem is that most sound effects out there are “one-shots”; someone uploads a single recording of a button press. If we play the exact same sound effect every time someone clicks the button, it will feel very robotic and artificial.

I happen to have a background in audio engineering, and so for years I’ve been recording my own sound effects. Rather than record a single instance, though, I record _dozens_ of samples and pick a handful of winners. Whenever the sound is triggered, one of the samples is randomly selected. This means that if the sound is triggered multiple times in a row, it'll always sound a little bit different.

I’m currently taking a bit of a sabbatical from [my blog](https://www.joshwcomeau.com/) and [courses](https://whimsy.joshwcomeau.com/), and so I decided to indulge myself. I spent several weeks building the _ultimate_ collection of button sounds. Each sound was recorded in the same acoustically-treated room using a Zoom H4 recorder, and room noise was further reduced in Adobe Audition. Sounds are available as 48kHz `.wav` files or as 192kbps MP3 files. All sounds are stereo.

You can browse the sounds and hear the effect of using multiple samples [on the project website](https://buttons.joshwcomeau.com).

## Using the audio files directly

If you’re not a JavaScript developer or wish to use the sounds in a non-JS context, you can learn more about how to use the raw audio here:

- [Using the raw audio files](https://github.com/joshwcomeau/button-sounds/blob/main/docs/raw-audio-files.md)

## Installation instructions

If you have a JavaScript application, the easiest way to use these sounds is through the [NPM package](https://npmx.dev/package/button-sounds). You can install it using your favourite package manager:

```bash
$ npm install button-sounds
```

The same package is used for both the vanilla JavaScript version and the React bindings. The React bindings should only get bundled into your application code if you import them somewhere; modern bundlers will strip away any modules that aren’t needed.

## Usage instructions

To keep things simple, I’ve created two separate sets of docs depending on which version you use:

- [Vanilla JS documentation](https://github.com/joshwcomeau/button-sounds/blob/main/docs/vanilla-js.md)
- [React documentation](https://github.com/joshwcomeau/button-sounds/blob/main/docs/react.md)

I also have a separate doc that goes over [self-hosting the audio files](https://github.com/joshwcomeau/button-sounds/blob/main/docs/self-hosting-audio-files.md) in case you don’t want to depend on a CDN for the MP3 files.

## Respecting user preferences

Sound remains relatively rare on the web, outside of video playback and not all users are receptive to sound effects. As far as I know, there is no explicit preference for this, like there is for motion with `prefers-reduced-motion`.

Here’s how I suggest going about this:

1. **Play sounds quietly.** I typically play UI sound effects between 25% and 50% of max volume. This reduces the likelihood that we’ll startle someone who has forgotten their sound is enabled.
2. **Allow users to opt out.** My [blog](https://www.joshwcomeau.com/) has a mute button in the top-right, next to the dark/light toggle. This allows users to silence my website without muting their entire device.

## Troubleshooting

### The sounds aren’t playing consistently! Sometimes they don’t trigger.

Over the past few years, a war has been raging between internet marketers who want to expose you to auto-playing advertisements and browsers who want to shield you from them. Unfortunately, fans of tactile user interaction like us sometimes get caught in the crossfire.

It used to be that sounds could reliably be played as long as they were in direct response to a user action, like clicking something. These days, however, the whole thing is much more complex; browsers calculate a “Media Engagement Index” that tracks how the user engages with our site and how much trust it should be given as a result. The specific heuristics vary between browsers and are always changing.

So, unfortunately, there’s no way to _guarantee_ that our sounds will trigger 100% of the time. But I don’t think that’s the end of the world. Button UI sounds are a nice-to-have, and it’s fine if they don’t always exist.
