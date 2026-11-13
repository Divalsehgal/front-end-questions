// useSubject's hooks over a fresh loader (vi.resetModules), so each test starts with no subject loaded.
import { BANK_ENTRIES } from '@fe-grind/content/bank';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as Hooks from './useSubject';
import type * as Loader from '@fe-grind/content/loader';

let loader: typeof Loader;
let hooks: typeof Hooks;
beforeEach(async () => {
  vi.resetModules();
  loader = await import('@fe-grind/content/loader');
  hooks = await import('./useSubject');
});

const react = BANK_ENTRIES.find((e) => e.subject.slug === 'react')!;

describe('hooks', () => {
  it('useFullEntry loads the subject and re-renders when it arrives', async () => {
    const { result } = renderHook(() => hooks.useFullEntry(react.key));
    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current?.q).toEqual(react.q));
  });

  it('useSubject is undefined without a slug and reads provided subjects synchronously', () => {
    expect(renderHook(() => hooks.useSubject(undefined)).result.current).toBeUndefined();
    const { result } = renderHook(() => hooks.useSubject('x'));
    expect(result.current).toBeUndefined();
    const subject = { slug: 'x', title: 'X', blurb: '', icon: 'x', topics: [] };
    act(() => loader.provideSubjects([subject]));
    expect(result.current).toBe(subject);
  });
});
