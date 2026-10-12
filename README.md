# Button Sounds

> NOTE: This project is a work-in-progress and has not yet been released. Use at your own risk!

A collection of 50+ professionally-recorded multi-sampled clicks and toggles. Available as standalone audio files or through a convenient feature-packed NPM library. 🎵

- [Sound Playground](https://buttons.joshwcomeau.com)
- [NPM package](https://npmx.dev/package/button-sounds)

## Why does this project exist?

I’ve been adding little UI sound effects to my projects for years, and I think they add a lot to the user experience.

The problem is that most sound effects out there are “one-shots”; someone uploads a single recording of a button press. If we play the exact same sound effect every time someone clicks the button, it will feel very robotic and artificial.

I happen to have a background in audio engineering, and so for years I’ve been recording my own sound effects. Rather than record a single instance, though, I record _dozens_ of samples and pick a handful of winners. Whenever the sound is triggered, one of the samples is randomly selected. This means that if the sound is triggered multiple times in a row, it'll always sound a little bit different.

I’m currently taking a bit of a sabbatical from [my blog](https://www.joshwcomeau.com/) and [courses](https://whimsy.joshwcomeau.com/), and so I decided to indulge myself. I spent several weeks building the _ultimate_ collection of button sounds.

You can browse the sounds and hear the effect of using multiple samples [on the project website](https://buttons.joshwcomeau.com).

## Using the sounds yourself

If you’re not a JavaScript developer, you can download the raw audio files and use them in whichever context you wish. All sounds are released under an [MIT license](https://github.com/joshwcomeau/button-sounds/blob/main/LICENSE).

- [192kbps MP3 files](https://github.com/joshwcomeau/button-sounds/tree/main/package/assets)
- [lossless 48kHz .wav files](https://github.com/joshwcomeau/button-sounds/tree/main/package/audio)

Each audio file contains between 8 and 16 individual samples, for both the presses and releases. The easiest way to use them is to work with audio sprites: load the audio file and then play a specific range. [The `sprite-data.ts` file](https://github.com/joshwcomeau/button-sounds/blob/main/package/src/core/sprite-data.ts) contains the start position and duration of each sample within the sprite.

For each of the 50+ included sounds, I recorded dozens of separate button presses and releases, and picked between 4-8 distinctive samples. A random sample is picked on every press and release, so that repeated button presses don't feel monotonous and artificial.

Each sound was recorded in the same acoustically-treated room using a Zoom H4 recorder, and room noise was further reduced in Adobe Audition. Sounds are available as 48kHz `.wav` files or as 192kbps MP3 files. All sounds are stereo.

## Installation instructions

If you have a JavaScript application, the easiest way to use these sounds is through the [NPM package](https://npmx.dev/). You can install it using your favourite package manager:

```bash
$ npm install button-sounds
```

The same package is used for both the vanilla JavaScript version and the React bindings. The React bindings will only get bundled into your application code if you use them, as long as your bundler supports tree-shaking.

### Vanilla JavaScript usage
