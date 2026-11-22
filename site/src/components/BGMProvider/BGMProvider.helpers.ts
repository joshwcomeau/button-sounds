import { Howl, Howler } from 'howler';

export type ChannelMode = 'mono' | 'stereo';

interface HowlGainNode extends GainNode {
  // Howler stores the playing buffer source here and clears it on pause or stop.
  bufferSource?: AudioBufferSourceNode | null;
}

interface HowlSound {
  _node: HowlGainNode;
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
  const nextCount = isMono ? 1 : 2;
  const nextMode: ChannelCountMode = isMono ? 'explicit' : 'clamped-max';
  const source = sound._node.bufferSource ?? null;
  const channelConfigChanged =
    panner.channelCount !== nextCount || panner.channelCountMode !== nextMode;

  // Annoyingly, Safari would become muted when switching between mono/stereo. Evidently we need to disconnect and reconnect. I was worried this would lead to a brief audio drop in other browsers, but it seems to run seamlessly.
  // (I should also say, I delegated this task to Claude and don’t *really* understand it. If there are unintended consequences to this, I can revert to the code in commit 3fecbdaadbfbb6e12289ca2c65ecc837133a4d29, which will mute on Safari but work flawlessly everywhere else.)
  if (channelConfigChanged && source) {
    disconnectFrom(source, panner);
    disconnectFrom(panner, compensator);
  }

  panner.channelCount = nextCount;
  panner.channelCountMode = nextMode;

  if (channelConfigChanged && source) {
    source.connect(panner);
    panner.connect(compensator);
  }

  compensator.gain.setValueAtTime(
    isMono ? Math.SQRT2 : 1,
    Howler.ctx.currentTime,
  );
}

// `disconnect(node)` throws InvalidAccessError when that connection isn’t there.
function disconnectFrom(source: AudioNode, destination: AudioNode) {
  try {
    source.disconnect(destination);
  } catch (error) {
    if (
      !(error instanceof DOMException) ||
      error.name !== 'InvalidAccessError'
    ) {
      throw error;
    }
  }
}
