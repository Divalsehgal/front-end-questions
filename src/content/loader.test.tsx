// The on-demand subject chunks. Each test imports a fresh loader (vi.resetModules), so it starts
// empty instead of with the whole bank that the test setup provides.
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BANK_ENTRIES } from './bank';
import type * as Loader from './loader';

let loader: typeof Loader;
beforeEach(async () => {
  vi.resetModules();
  loader = await import('./loader');
});

const react = BANK_ENTRIES.find((e) => e.subject.slug === 'react')!;

describe('loadSubject', () => {
  it('loads one subject in full, then reads it synchronously', async () => {
    expect(loader.loadedSubject('react')).toBeUndefined();
    expect(loader.fullEntry(react.key)).toBeUndefined();
    const subject = await loader.loadSubject('react');
    expect(subject?.slug).toBe('react');
    expect(loader.loadedSubject('react')).toBe(subject);
    expect(loader.fullEntry(react.key)?.q).toEqual(react.q);
    expect(loader.loadedSubject('javascript')).toBeUndefined();
    expect(await loader.loadSubject('react')).toBe(subject);
  });

  it('shares one request between concurrent callers', async () => {
    const [a, b] = await Promise.all([loader.loadSubject('css'), loader.loadSubject('css')]);
    expect(a).toBe(b);
  });

  it('resolves undefined for an unknown subject', async () => {
    expect(await loader.loadSubject('nope')).toBeUndefined();
  });

  it('has a chunk for every subject in the manifest', async () => {
    const all = await loader.loadAllSubjects();
    expect(all.map((s) => s?.slug)).toEqual([...new Set(BANK_ENTRIES.map((e) => e.subject.slug))]);
  });
});

describe('preloadPath', () => {
  it('loads the subject of a question page only', async () => {
    expect(loader.subjectForPath('/q/react/h-17/')).toBe('react');
    expect(loader.subjectForPath('/q/react/h-17')).toBe('react');
    expect(loader.subjectForPath('/q/nope/x/')).toBeUndefined();
    expect(loader.subjectForPath('/s/react/')).toBeUndefined();
    expect(loader.subjectForPath('/')).toBeUndefined();
    expect(await loader.preloadPath('/review')).toBeUndefined();
    expect((await loader.preloadPath(`/q/react/${react.q.id}/`))?.slug).toBe('react');
  });
});

describe('hooks', () => {
  it('useFullEntry loads the subject and re-renders when it arrives', async () => {
    const { result } = renderHook(() => loader.useFullEntry(react.key));
    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current?.q).toEqual(react.q));
  });

  it('useSubject is undefined without a slug and reads provided subjects synchronously', () => {
    expect(renderHook(() => loader.useSubject(undefined)).result.current).toBeUndefined();
    const { result } = renderHook(() => loader.useSubject('x'));
    expect(result.current).toBeUndefined();
    const subject = { slug: 'x', title: 'X', blurb: '', icon: 'x', topics: [] };
    act(() => loader.provideSubjects([subject]));
    expect(result.current).toBe(subject);
  });
});
