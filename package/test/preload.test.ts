import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SoundName } from '../src/index';

const constructed: Array<{ src: string[] }> = [];

vi.mock('howler', () => ({
  Howl: class {
    constructor(options: { src: string[] }) {
      constructed.push(options);
    }
  },
}));

import { DEFAULT_NAME, load, setPath, wireUp } from '../src/index';

function fakeElement(): HTMLElement {
  return {
    addEventListener() {},
    removeEventListener() {},
  } as unknown as HTMLElement;
}

describe('preloading', () => {
  afterEach(() => {
    constructed.length = 0;
  });

  it('load fetches the named file once', async () => {
    setPath(`/sounds/load-once-${Math.random()}/`);
    load(DEFAULT_NAME);
    load(DEFAULT_NAME);

    await vi.waitFor(() => {
      expect(constructed).toHaveLength(1);
    });
    expect(constructed[0]?.src[0]).toContain(`${DEFAULT_NAME}.mp3`);
  });

  it('load fetches a different file for a different name', async () => {
    setPath(`/sounds/load-name-${Math.random()}/`);
    load(DEFAULT_NAME);
    await vi.waitFor(() => {
      expect(constructed).toHaveLength(1);
    });

    load('uhk-medium');
    await vi.waitFor(() => {
      expect(constructed).toHaveLength(2);
    });
    expect(constructed.map((howl) => howl.src[0])).toEqual([
      expect.stringMatching(/uhk-soft\.mp3$/),
      expect.stringMatching(/uhk-medium\.mp3$/),
    ]);
  });

  it('wireUp fetches the sound when called', async () => {
    setPath(`/sounds/wire-${Math.random()}/`);
    wireUp(fakeElement(), 'halo-kbd-soft');

    await vi.waitFor(() => {
      expect(constructed).toHaveLength(1);
    });
    expect(constructed[0]?.src[0]).toMatch(/halo-kbd-soft\.mp3$/);
  });

  it('load ignores unknown names', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    load('nope' as SoundName);
    expect(warn).toHaveBeenCalledWith(
      '[button-sounds] Unknown sound name: "nope"',
    );
    expect(constructed).toHaveLength(0);
    warn.mockRestore();
  });
});
