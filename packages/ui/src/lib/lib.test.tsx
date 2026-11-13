import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cn, rovingIndex, TONES, useNow, withStableKeys } from '.';
import type { KeyboardEvent } from 'react';

const key = (k: string) => ({ key: k, preventDefault: vi.fn() }) as unknown as KeyboardEvent;

describe('cn', () => {
  it('joins truthy classes and drops falsy ones', () => {
    expect(cn('a', false, null, undefined, 0, '', 'b')).toBe('a b');
    expect(cn()).toBe('');
  });
});

describe('withStableKeys', () => {
  it('keys items by content and suffixes repeats so every key is unique', () => {
    expect(withStableKeys(['a', 'b', 'a', '', '', 'a#1']).map((x) => x.key)).toEqual(['a', 'b', 'a#1', '', '#1', 'a#1#1']);
    expect(withStableKeys([{ id: 'x' }, { id: 'x' }], (o) => o.id)).toEqual([
      { item: { id: 'x' }, key: 'x' },
      { item: { id: 'x' }, key: 'x#1' },
    ]);
  });
});

describe('TONES', () => {
  it('pairs every tone with a soft background and a text colour that passes contrast', () => {
    for (const tone of Object.values(TONES)) {
      expect(tone.bg).toMatch(/^bg-/);
      expect(tone.text).toMatch(/^text-/);
    }
    // Plain teal fails 4.5:1 on light backgrounds; brand text must use the strong variant.
    expect(TONES.brand.text).toBe('text-brand-strong');
  });
});

describe('rovingIndex', () => {
  it('wraps arrows and jumps with Home/End', () => {
    expect(rovingIndex(key('ArrowRight'), 2, 3)).toBe(0);
    expect(rovingIndex(key('ArrowDown'), 0, 3)).toBe(1);
    expect(rovingIndex(key('ArrowLeft'), 0, 3)).toBe(2);
    expect(rovingIndex(key('ArrowUp'), 1, 3)).toBe(0);
    expect(rovingIndex(key('Home'), 2, 3)).toBe(0);
    expect(rovingIndex(key('End'), 0, 3)).toBe(2);
  });

  it('ignores other keys and does not prevent their default', () => {
    const e = key('a');
    expect(rovingIndex(e, 0, 3)).toBeNull();
    expect(e.preventDefault).not.toHaveBeenCalled();
    expect(rovingIndex(key('ArrowRight'), 0, 0)).toBeNull();
  });
});

describe('useNow', () => {
  afterEach(() => vi.useRealTimers());

  it('reads the time once and ticks only when given an interval', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    const still = renderHook(() => useNow());
    const ticking = renderHook(() => useNow(1000));
    expect(still.result.current).toBe(1_000);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(still.result.current).toBe(1_000);
    expect(ticking.result.current).toBe(4_000);
    ticking.unmount();
  });
});
