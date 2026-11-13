import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetDone, toggleDone, useDone } from './done';

beforeEach(() => {
  localStorage.clear();
  resetDone();
});

function Count() {
  return createElement('span', null, useDone().size);
}

describe('done store', () => {
  it('is empty on the server, whatever this browser stored', () => {
    localStorage.setItem('dsa-done', JSON.stringify(['Two Sum']));
    expect(renderToString(createElement(Count))).toBe('<span>0</span>');
  });

  it('reads stored ticks, toggles them and keeps them', () => {
    localStorage.setItem('dsa-done', JSON.stringify(['Two Sum']));
    const { result } = renderHook(() => useDone());
    expect([...result.current]).toEqual(['Two Sum']);
    act(() => toggleDone('3Sum'));
    expect([...result.current]).toEqual(['Two Sum', '3Sum']);
    act(() => toggleDone('Two Sum'));
    expect(JSON.parse(localStorage.getItem('dsa-done')!)).toEqual(['3Sum']);
  });

  it('survives unreadable storage', () => {
    localStorage.setItem('dsa-done', '{not json');
    expect(renderHook(() => useDone()).result.current.size).toBe(0);
  });
});
