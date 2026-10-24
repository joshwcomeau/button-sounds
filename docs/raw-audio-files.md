# Using the raw audio files

This project’s sounds are primarily intended to be used via the [JavaScript NPM package](https://npmx.dev/package/button-sounds), but you’re also welcome to download and use the audio files in any other context!

The files themselves are released under an [MIT license](https://github.com/joshwcomeau/button-sounds/blob/main/LICENSE), and can be downloaded by cloning this Git repository. Here are the relevant directories:

- [192kbps MP3 files](https://github.com/joshwcomeau/button-sounds/tree/main/package/assets)
- [lossless 48kHz .wav files](https://github.com/joshwcomeau/button-sounds/tree/main/package/audio)

One complicating factor is that each sound is a single audio file with all of the press/release samples spaced within. This was done to make the download faster on the web, since even with HTTP/2, there’s a cost to having many parallel files. But it could make the files a bit harder to use depending on your use case, since I don’t have individual sound files available for each sample.

**Here’s the good news:** each sound follows the exact same format, in terms of the location of each sample within the audio file:

- There’s exactly 1000ms of silence before the first sample.
- The “down” samples start every second (1000ms, 2000ms, etc) and should be played for 200ms.
- The “up” samples start after each down sample (1200ms, 2200ms, etc) and should be played for 800ms.

Each sound has between 4 and 8 pairs of down/up samples. You can find the specific number for each sound in the [/sprite-data.ts file](https://github.com/joshwcomeau/button-sounds/blob/main/package/src/core/sprite-data.ts), or via the [Sound Playground](https://buttons.joshwcomeau.com).

Here’s a quick JS pseudo-code snippet that you can translate to your language of choice for playing random samples:

```js
// Assuming your chosen sound has 4 samples:
const DOWN_PRESSES = [1000, 2000, 3000, 4000];
const UP_PRESSES = [1200, 2200, 3200, 4200];

function press() {
  const startAt = pickRandom(DOWN_PRESSES);
  const duration = 200;
  playAudio('/sample.mp3', startAt, duration);
}
function release() {
  const startAt = pickRandom(UP_PRESSES);
  const duration = 800;
  playAudio('/sample.mp3', startAt, duration);
}
```
