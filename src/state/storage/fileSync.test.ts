// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { abortError, fakeHandle, memoryDb, stubPicker } from '../../test/fakeStorage';

const db = new Map<string, unknown>();
vi.mock('./db', () => memoryDb(db));

const load = () => import('./fileSync');

beforeEach(() => {
  db.clear();
  vi.resetModules();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('file sync', () => {
  it('is unsupported without showSaveFilePicker', async () => {
    const { fileSyncSupported, restoreFileSync, connectFile, useFileSync } = await load();
    expect(fileSyncSupported()).toBe(false);
    expect(renderHook(useFileSync).result.current.status).toBe('unsupported');
    expect(await restoreFileSync()).toBeNull();
    await expect(connectFile()).rejects.toThrow(/cannot sync/);
  });

  it('connects a picked file, remembers it, and debounces writes into one', async () => {
    const h = fakeHandle('mine.json', '{"old":1}');
    stubPicker(h);
    const { connectFile, writeToFile, useFileSync } = await load();
    const { result } = renderHook(useFileSync);
    expect(result.current.status).toBe('off');
    await act(async () => expect(await connectFile()).toBe('{"old":1}'));
    expect(result.current).toEqual({ status: 'connected', name: 'mine.json' });
    expect(db.get('progress-file')).toBe(h);
    writeToFile('a');
    writeToFile('b');
    await vi.runAllTimersAsync();
    expect(h.content).toBe('b');
  });

  it('still connects for this visit when the handle cannot be remembered', async () => {
    const { idbSet } = await import('./db');
    vi.mocked(idbSet).mockRejectedValueOnce(new Error('no idb'));
    stubPicker(fakeHandle());
    const { connectFile, useFileSync } = await load();
    await connectFile();
    expect(renderHook(useFileSync).result.current.status).toBe('connected');
  });

  it('passes on the picker being closed', async () => {
    stubPicker(null, abortError());
    const { connectFile, isAbort } = await load();
    const err = await connectFile().catch((e: unknown) => e);
    expect(isAbort(err)).toBe(true);
    expect(isAbort(new Error('x'))).toBe(false);
  });

  it('restores a remembered file when permission is still granted', async () => {
    stubPicker(null);
    db.set('progress-file', fakeHandle('kept.json', 'data'));
    const { restoreFileSync, useFileSync } = await load();
    expect(await restoreFileSync()).toBe('data');
    expect(renderHook(useFileSync).result.current).toEqual({ status: 'connected', name: 'kept.json' });
  });

  it('returns null when no file was ever chosen', async () => {
    stubPicker(null);
    expect(await (await load()).restoreFileSync()).toBeNull();
  });

  it('asks for a click to reconnect when permission lapsed, and reconnects on a yes', async () => {
    stubPicker(null);
    const h = fakeHandle('kept.json', 'data', 'prompt');
    db.set('progress-file', h);
    const { restoreFileSync, reconnectFile, writeToFile, useFileSync } = await load();
    const { result } = renderHook(useFileSync);
    await act(async () => expect(await restoreFileSync()).toBeNull());
    expect(result.current.status).toBe('needs-permission');
    writeToFile('ignored');
    await vi.runAllTimersAsync();
    expect(h.content).toBe('data');

    expect(await reconnectFile()).toBeNull(); // still 'prompt': refused
    h.permission = 'granted';
    await act(async () => expect(await reconnectFile()).toBe('data'));
    expect(result.current.status).toBe('connected');
    expect(h.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
  });

  it('reconnect does nothing without a remembered file', async () => {
    stubPicker(null);
    expect(await (await load()).reconnectFile()).toBeNull();
  });

  it('reports an error when a write fails (file moved or deleted)', async () => {
    const h = fakeHandle('gone.json');
    stubPicker(h);
    const { connectFile, writeToFile, useFileSync } = await load();
    const { result } = renderHook(useFileSync);
    await act(() => connectFile());
    h.failWrites = true;
    writeToFile('x');
    await act(() => vi.runAllTimersAsync());
    expect(result.current).toEqual({ status: 'error', name: 'gone.json' });
  });

  it('disconnecting forgets the file and drops a queued write', async () => {
    const h = fakeHandle();
    stubPicker(h);
    const { connectFile, disconnectFile, writeToFile, useFileSync } = await load();
    await connectFile();
    writeToFile('queued');
    await disconnectFile();
    await vi.runAllTimersAsync();
    expect(h.content).toBe('');
    expect(db.has('progress-file')).toBe(false);
    expect(renderHook(useFileSync).result.current.status).toBe('off');
  });
});
