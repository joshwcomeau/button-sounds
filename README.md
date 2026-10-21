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

## Using the sounds yourself

If you’re not a JavaScript developer or wish to use the sounds in a non-JS context, you can learn more about how to use the raw audio here:

- [Using the raw audio files](/TODO)

## Installation instructions

If you have a JavaScript application, the easiest way to use these sounds is through the [NPM package](https://npmx.dev/package/button-sounds). You can install it using your favourite package manager:

```bash
$ npm install button-sounds
```

The same package is used for both the vanilla JavaScript version and the React bindings. The React bindings will only get bundled into your application code if you use them, as long as your bundler supports tree-shaking.

To keep things simple, I’ve created two separate sets of docs depending on which version you use:

- [Vanilla JS documentation](/)
- [React hook documentation](/)
