# Self-hosting the audio files

By default, audio files are loaded directly from the JSDelivr CDN, which is used by default by NPM. This is nice because you don’t have to worry about bandwidth costs, and it ensures the files are loaded from a regionally-appropriate data center, rather than a single global source.

That said, you may want to self-host the audio files. There are a few potential reasons for this:

1. You don’t want to rely on a third-party service which could eventually become unavailable or unreliable.
2. You’re building a desktop application (eg. with Electron) which needs to work offline.
3. You want to tweak the audio files themselves, or replace them with your own versions!

This document shares how you can achieve this.

## Copying the files

First, you’ll need to grab the raw MP3 files themselves and store them alongside your other assets.

The MP3 files are distributed along with the NPM package, so if you have the package installed, the easiest way to do this is with the CLI’s `cp` (copy) command:

```bash
# From your project root:
$ cp -r node_modules/button-sounds/assets [destination-directory]
```

For example, if you want to store the MP3s in `/public/sounds/btn`, you would do it like this:

```bash
$ cp -r node_modules/button-sounds/assets ./public/sounds/btn
```

If you’re not super comfortable with the command line, you can alternatively [download the Git repository](https://github.com/joshwcomeau/button-sounds), which includes all of the MP3 files in `/package/assets`. You can drag-and-drop this directory into your project

## Pointing the library to your files

Now that you have a local copy of the files, we need to tell the `button-sounds` NPM package to use them instead of the ones on the CDN. We do this with the provided `setPath` function:

```js
import { setPath } from 'button-sounds';

setPath('/sounds/btn');
```

(I’ve omitted the `/public` part of the path because it’s a common convention for everything in `/public` to be accessible from the root URL, but of course you should specify whatever path makes sense for your own project.)

This approach is the same regardless of whether you’re using the vanilla JS version or the React bindings.

> **A single source for all sound files.**
> This does mean that all files must be loaded from the same source. There's no way to specify different sources in different situations. If this is an issue for you, please file an issue and let me know, though honestly, I probably won’t update it unless it’s a very common request. Rather than wait for me to address it, I’d encourage you to fork the package and customize it for your needs.

### Creating a thin wrapper

The `setPath()` function should be called as early as possible, before using `wireUp()` or `load()`. It only needs to be called once, no matter how many separate sounds are used.

To make sure it’s called early enough, I think it makes a lot of sense to create our own thin wrapper around the dependency, something like this:

```js
// /src/button-sounds.ts
import { setPath } from 'button-sounds';

setPath('/sounds/btn');

export * from 'button-sounds';
```

Then, instead of importing from the `button-sounds` library, you’d load this thin wrapper:

```js
// Import our wrapper, not the NPM dependency:
import { wireUp } from '../button-sounds';
```

If you’re using the React bindings, the same pattern works, except you’d export everything from `button-sounds/react`.
