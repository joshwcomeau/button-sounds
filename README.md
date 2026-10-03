# Button Sounds

> NOTE: This project is a work-in-progress and has not yet been released. Use at your own risk!

A collection of 50+ professionally-recorded multi-sampled clicks and toggles. Available as standalone sprites or through a convenient feature-packed NPM library. 🎵

- [Sound Playground](/)
- [NPM package](https://npmx.dev/)

## Multi-sampled sound effects

For each of the 50+ included sounds, I recorded dozens of separate button presses and releases, and picked between 4-8 distinctive samples. A random sample is picked on every press and release, so that repeated button presses don't feel monotonous and artificial.

Each sound was recorded in the same acoustically-treated room using a Zoom H4 recorder, and room noise was further reduced in Adobe Audition. Sounds are available as 48kHz `.wav` files or as 192kbps MP3 files. All sounds are stereo.

## Installation instructions

If you have a JavaScript application, the easiest way to use these sounds is through the [NPM package](https://npmx.dev/). You can install it using your favourite package manager:

```bash
$ npm install button-sounds
```

The same package is used for both the vanilla JavaScript version and the React bindings. The React bindings will only get bundled into your application code if you use them, as long as your bundler supports tree-shaking.

### Vanilla JavaScript usage
