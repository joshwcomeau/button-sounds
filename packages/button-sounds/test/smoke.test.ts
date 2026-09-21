import { describe, expect, it } from 'vitest';
import ButtonSounds, {
  press,
  release,
  wireUp,
  setPath,
  resolveSoundUrl,
  SOUND_NAMES,
  DEFAULT_NAME,
  DEFAULT_LOFI_OPTIONS,
} from '../src/index';
import { useButtonSounds, useImperativeButtonSounds } from '../src/react';
import { getVariantIds, pickSampleId } from '../src/core/variants';
import { SPRITE_DATA } from '../src/core/sprite-data';
import { resolveLofiOptions } from '../src/core/lofi';

describe('button-sounds vanilla API', () => {
  it('default export exposes the API', () => {
    expect(typeof ButtonSounds.press).toBe('function');
    expect(typeof ButtonSounds.release).toBe('function');
    expect(typeof ButtonSounds.wireUp).toBe('function');
    expect(typeof ButtonSounds.setPath).toBe('function');
  });

  it('press / release do not throw', () => {
    expect(() => press(DEFAULT_NAME)).not.toThrow();
    expect(() =>
      press(DEFAULT_NAME, { volume: 0.5, sampleIndex: 0 }),
    ).not.toThrow();
    expect(() => release(DEFAULT_NAME, { playbackRate: 1.2 })).not.toThrow();
    expect(() => press(DEFAULT_NAME, { lofi: true })).not.toThrow();
    expect(() =>
      press(DEFAULT_NAME, {
        lofi: true,
        lofiOptions: { bits: 8, downsample: 0.5 },
      }),
    ).not.toThrow();
  });

  it('setPath does not throw', () => {
    expect(() => setPath('/sounds')).not.toThrow();
    setPath(''); // reset-ish for other tests; empty path resolves relative
  });

  it('exposes the React hooks', () => {
    expect(typeof useButtonSounds).toBe('function');
    expect(typeof useImperativeButtonSounds).toBe('function');
  });

  it('has a default name among the available names', () => {
    expect(SOUND_NAMES).toContain(DEFAULT_NAME);
  });

  it('resolves sound URLs, defaulting to the jsDelivr CDN', () => {
    expect(resolveSoundUrl('uhk-soft')).toContain('cdn.jsdelivr.net');
    expect(resolveSoundUrl('uhk-soft')).toMatch(/uhk-soft\.mp3$/);
    expect(resolveSoundUrl('uhk-soft', '/sounds/')).toBe(
      '/sounds/uhk-soft.mp3',
    );
    expect(resolveSoundUrl('uhk-soft', '/sounds')).toBe('/sounds/uhk-soft.mp3');
  });
});

describe('sample selection', () => {
  const spriteMap = SPRITE_DATA['uhk-soft'];

  it('orders variant ids by trailing number', () => {
    expect(getVariantIds(spriteMap, 'press')).toEqual([
      'down1',
      'down2',
      'down3',
      'down4',
      'down5',
      'down6',
    ]);
    expect(getVariantIds(spriteMap, 'release')[0]).toBe('up1');
  });

  it('sampleIndex picks a specific sample and wraps', () => {
    expect(pickSampleId(spriteMap, 'press', 0)).toBe('down1');
    expect(pickSampleId(spriteMap, 'press', 2)).toBe('down3');
    // 6 press samples → index 6 wraps back to the first.
    expect(pickSampleId(spriteMap, 'press', 6)).toBe('down1');
  });

  it('returns a valid sample when picking randomly', () => {
    const id = pickSampleId(spriteMap, 'release');
    expect(getVariantIds(spriteMap, 'release')).toContain(id);
  });
});

describe('lofi options', () => {
  it('defaults to 4-bit / 0.25 downsample', () => {
    expect(DEFAULT_LOFI_OPTIONS).toEqual({ bits: 4, downsample: 0.25 });
    expect(resolveLofiOptions()).toEqual({ bits: 4, downsample: 0.25 });
  });

  it('fills in omitted fields and clamps to the documented ranges', () => {
    expect(resolveLofiOptions({ bits: 8 })).toEqual({
      bits: 8,
      downsample: 0.25,
    });
    expect(resolveLofiOptions({ downsample: 1 })).toEqual({
      bits: 4,
      downsample: 1,
    });
    expect(resolveLofiOptions({ bits: 0, downsample: -1 })).toEqual({
      bits: 1,
      downsample: 0,
    });
    expect(resolveLofiOptions({ bits: 32, downsample: 2 })).toEqual({
      bits: 16,
      downsample: 1,
    });
  });
});

describe('wireUp', () => {
  it('returns a cleanup function and toggles the pointerdown listener', () => {
    let downListeners = 0;
    const fakeEl = {
      addEventListener: (type: string) => {
        if (type === 'pointerdown') downListeners += 1;
      },
      removeEventListener: (type: string) => {
        if (type === 'pointerdown') downListeners -= 1;
      },
    } as unknown as HTMLElement;

    const cleanup = wireUp(fakeEl, DEFAULT_NAME, { pitchVariation: 0.3 });
    expect(downListeners).toBe(1);
    cleanup();
    expect(downListeners).toBe(0);
  });
});
