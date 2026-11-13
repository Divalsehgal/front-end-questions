// useSubject's hooks over a fresh loader (vi.resetModules), so each test starts with no subject loaded.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { transformSync } from '@babel/core';
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

  // Production runs the React Compiler (next.config.ts); these tests otherwise don't, which once hid
  // a question stuck on "Loading question…" because the compiler cached the not-yet-loaded entry.
  it('useFullEntry re-renders when the subject arrives under the React Compiler', async () => {
    const src = join(__dirname, 'useSubject.ts');
    const out = join(__dirname, 'useSubject.compiled.tmp.ts');
    const code = transformSync(readFileSync(src, 'utf8'), {
      filename: src,
      configFile: false,
      babelrc: false,
      parserOpts: { plugins: ['typescript'] },
      plugins: ['babel-plugin-react-compiler'],
    })!.code!;
    writeFileSync(out, code);
    try {
      const compiled: typeof Hooks = await import(/* @vite-ignore */ out);
      const { result } = renderHook(() => compiled.useFullEntry(react.key));
      expect(result.current).toBeUndefined();
      await waitFor(() => expect(result.current?.q).toEqual(react.q));
    } finally {
      rmSync(out);
    }
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
