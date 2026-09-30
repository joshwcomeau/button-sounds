import type { Howl } from 'howler';
import type { LofiOptions } from './types';

export const DEFAULT_LOFI_OPTIONS: Required<LofiOptions> = {
  bits: 4,
  downsample: 0.25,
};

const PROCESSOR_NAME = 'button-sounds-bitcrusher';

// Classic sample-and-hold bitcrusher, as an AudioWorkletProcessor. Loaded via a blob URL so the package doesn’t ship a separate worklet file.
const PROCESSOR_SOURCE = `
class BitcrusherProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.last = [];
  }

  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 4, minValue: 1, maxValue: 16, automationRate: 'k-rate' },
      { name: 'downsample', defaultValue: 0.25, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input.length || !output || !output.length) {
      return true;
    }

    const bits = parameters.bits[0];
    const downsample = parameters.downsample[0];
    const step = Math.pow(0.5, bits);
    const frames = output[0].length;

    for (let i = 0; i < frames; i++) {
      this.phase += downsample;
      const take = this.phase >= 1;
      if (take) {
        this.phase -= 1;
      }

      for (let ch = 0; ch < output.length; ch++) {
        const inputChannel = input[ch] || input[0];
        if (take) {
          const sample = inputChannel ? inputChannel[i] : 0;
          this.last[ch] = step * Math.floor(sample / step + 0.5);
        }
        output[ch][i] = this.last[ch] ?? 0;
      }
    }

    return true;
  }
}

registerProcessor('${PROCESSOR_NAME}', BitcrusherProcessor);
`;

const workletLoads = new WeakMap<AudioContext, Promise<void>>();

type HowlGainNode = GainNode & {
  bufferSource?: AudioBufferSourceNode;
};

type HowlSound = {
  _node: HowlGainNode;
};

type HowlWithInternals = Howl & {
  _soundById: (id: number) => HowlSound | null;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Fill in defaults and clamp to the documented ranges.
export function resolveLofiOptions(
  options: LofiOptions = {},
): Required<LofiOptions> {
  return {
    bits: clamp(Math.round(options.bits ?? DEFAULT_LOFI_OPTIONS.bits), 1, 16),
    downsample: clamp(
      options.downsample ?? DEFAULT_LOFI_OPTIONS.downsample,
      0,
      1,
    ),
  };
}

function loadWorklet(ctx: AudioContext): Promise<void> {
  const blob = new Blob([PROCESSOR_SOURCE], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  return ctx.audioWorklet
    .addModule(url)
    .catch(() => {
      // Already registered by another copy of the library, or blocked (CSP). Creating the node will tell us which.
    })
    .finally(() => {
      URL.revokeObjectURL(url);
    });
}

// Register the bitcrusher worklet on this AudioContext (no-op if AudioWorklet isn’t available). Safe to call more than once.
export function prepareLofi(ctx: AudioContext | undefined): Promise<void> {
  if (!ctx?.audioWorklet) return Promise.resolve();

  let pending = workletLoads.get(ctx);
  if (!pending) {
    pending = loadWorklet(ctx);
    workletLoads.set(ctx, pending);
  }
  return pending;
}

function createScriptBitcrusher(
  ctx: AudioContext,
  options: Required<LofiOptions>,
): AudioNode | null {
  if (typeof ctx.createScriptProcessor !== 'function') return null;

  // Small buffer so a ~200ms click doesn’t pick up a huge slug of extra latency.
  const node = ctx.createScriptProcessor(256, 2, 2);
  let phase = 0;
  const last: number[] = [];
  const step = Math.pow(0.5, options.bits);
  const { downsample } = options;

  node.onaudioprocess = (event) => {
    const input = event.inputBuffer;
    const output = event.outputBuffer;
    const frames = output.length;
    const channels = output.numberOfChannels;

    for (let i = 0; i < frames; i++) {
      phase += downsample;
      const take = phase >= 1;
      if (take) {
        phase -= 1;
      }

      for (let ch = 0; ch < channels; ch++) {
        const inputData = input.getChannelData(
          Math.min(ch, input.numberOfChannels - 1),
        );
        const outputData = output.getChannelData(ch);
        if (take) {
          last[ch] = step * Math.floor(inputData[i]! / step + 0.5);
        }
        outputData[i] = last[ch] ?? 0;
      }
    }
  };

  return node;
}

function createBitcrusher(
  ctx: AudioContext,
  options: Required<LofiOptions>,
): AudioNode | null {
  if (ctx.audioWorklet) {
    try {
      const node = new AudioWorkletNode(ctx, PROCESSOR_NAME, {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      });
      node.parameters
        .get('bits')
        ?.setValueAtTime(options.bits, ctx.currentTime);
      node.parameters
        .get('downsample')
        ?.setValueAtTime(options.downsample, ctx.currentTime);
      return node;
    } catch {
      // Worklet never registered; fall through to ScriptProcessor.
    }
  }

  return createScriptBitcrusher(ctx, options);
}

function getSound(howl: Howl, soundId: number): HowlSound | null {
  return (howl as HowlWithInternals)._soundById(soundId);
}

function insertBitcrusher(
  ctx: AudioContext,
  howl: Howl,
  soundId: number,
  options: Required<LofiOptions>,
): void {
  const sound = getSound(howl, soundId);
  const source = sound?._node.bufferSource;
  if (!sound || !source) return;

  const crusher = createBitcrusher(ctx, options);
  if (!crusher) return;

  // Howler’s graph is bufferSource → gain → masterGain. Splice the bitcrusher in between source and gain so volume/rate still apply on the way out.
  source.disconnect();
  source.connect(crusher);
  crusher.connect(sound._node);

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      crusher.disconnect();
    } catch {
      // Howler may already have torn this node down.
    }
  };

  howl.once('end', cleanup, soundId);
  howl.once('stop', cleanup, soundId);
}

// Route one playing Howl sound through a bitcrusher. If the buffer source isn’t up yet (AudioContext still unlocking), wait for Howler’s play event.
export function applyLofi(
  ctx: AudioContext,
  howl: Howl,
  soundId: number,
  options: Required<LofiOptions>,
): void {
  if (getSound(howl, soundId)?._node.bufferSource) {
    insertBitcrusher(ctx, howl, soundId, options);
    return;
  }

  howl.once('play', () => {
    insertBitcrusher(ctx, howl, soundId, options);
  }, soundId);
}
