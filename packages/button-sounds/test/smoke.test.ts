import { describe, expect, it } from 'vitest';
import { handlePress, handleRelease } from '../src/index';
import { useButtonSfx } from '../src/react';

describe('button-sounds', () => {
  it('exposes the vanilla API', () => {
    expect(typeof handlePress).toBe('function');
    expect(typeof handleRelease).toBe('function');
  });

  it('handlePress / handleRelease do not throw', () => {
    expect(() => handlePress()).not.toThrow();
    expect(() => handlePress({ volume: 0.5 })).not.toThrow();
    expect(() => handleRelease({ muted: true })).not.toThrow();
  });

  it('exposes the React hook', () => {
    expect(typeof useButtonSfx).toBe('function');
  });
});
