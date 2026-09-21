// The two moments a button can make a sound.
export type SoundVariant = 'press' | 'release';

// Settings for the bitcrusher used when `lofi` is true.
export interface LofiOptions {
  // Bit depth, from 1 (harsh, NES-like crunch) to 16 (almost clean). Defaults to 4.
  bits?: number;
  // Fraction of the original sample rate to keep, from 0 to 1. Defaults to 0.25 (hold every fourth sample). 1 is no downsampling.
  downsample?: number;
}

// Options for a single press() / release() trigger.
export interface TriggerOptions {
  // Play one specific sample instead of a random one. Indexes into the sound’s samples for this variant (0-based); out-of-range values wrap around.
  sampleIndex?: number;
  // Volume, from 0 (silent) to 1 (full). Defaults to 1.
  volume?: number;
  // Play the sample faster/slower. 1 is normal speed.
  playbackRate?: number;
  // When true, run the sample through a bitcrusher for a retro, NES-like crunch. Defaults to false.
  lofi?: boolean;
  // Bitcrusher settings, used when `lofi` is true.
  lofiOptions?: LofiOptions;
}

// Instead of calling `.press()` and `.release()`, we can also use the declarative "wireUp" method. It shares some of the options but also allows us to randomize the pitch on every click.
export interface WireUpOptions {
  volume?: number;
  lofi?: boolean;
  lofiOptions?: LofiOptions;
  // Randomize pitch on each press/release so repeats feel distinct.
  // A number `n` picks a random playbackRate in [1 - n, 1 + n] (e.g. 0.3 → between 0.7 and 1.3). A tuple [min, max] picks a random playbackRate in that range.
  pitchVariation?: number | [number, number];
}

