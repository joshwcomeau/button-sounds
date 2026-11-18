import { Howl, Howler } from 'howler';

export type ChannelMode = 'mono' | 'stereo';

interface HowlSound {
  _node: GainNode;
  // Created by the spatial plugin the first time `stereo()` is called on the sound.
  _panner?: AudioNode;
}

type HowlWithInternals = Howl & {
  _soundById: (id: number) => HowlSound | null;
};

// Downmixing into the panner’s mono path costs 3dB (it spreads the signal with equal-power gains of ~0.707), so mono sounds get boosted back up to match.
const monoCompensators = new WeakMap<AudioNode, GainNode>();

// Howler has no mono option, but the spatial plugin’s StereoPannerNode can do it: limiting its input to a single channel makes the browser mix left and right together, and the panner then spreads that across both speakers, so the balance slider still works.
// Howler’s graph is bufferSource → panner → gain, and the buffer source is replaced on every play/seek, so the panner is the earliest node that sticks around.
export function applyChannelMode(
  howl: Howl,
  id: number | undefined,
  channelMode: ChannelMode,
) {
  if (id === undefined) {
    return;
  }

  if (howl.state() !== 'loaded') {
    howl.once('load', () => {
      applyChannelMode(howl, id, channelMode);
    });
    return;
  }

  // Makes sure the sound has a panner. Until the balance slider is touched, the group’s value is null.
  const pan = (howl.stereo() as number | null) ?? 0;
  howl.stereo(pan, id);

  const sound = (howl as HowlWithInternals)._soundById(id);
  const panner = sound?._panner;
  if (!sound || !(panner instanceof StereoPannerNode)) {
    return;
  }

  let compensator = monoCompensators.get(panner);
  if (!compensator) {
    compensator = Howler.ctx.createGain();
    panner.disconnect();
    panner.connect(compensator);
    compensator.connect(sound._node);
    monoCompensators.set(panner, compensator);
  }

  const isMono = channelMode === 'mono';
  panner.channelCount = isMono ? 1 : 2;
  panner.channelCountMode = isMono ? 'explicit' : 'clamped-max';
  compensator.gain.setValueAtTime(
    isMono ? Math.SQRT2 : 1,
    Howler.ctx.currentTime,
  );
}
