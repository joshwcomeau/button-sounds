/** The two moments a button can make a sound. */
export type SoundVariant = 'press' | 'release';

/** Options shared by the vanilla API and the React hook. */
export interface ButtonSfxOptions {
  /** Playback volume, from 0 (silent) to 1 (full). Defaults to `1`. */
  volume?: number;
  /**
   * When `true`, no sound plays. Wire this to a user "mute" / sound preference.
   * Defaults to `false`.
   */
  muted?: boolean;
}
