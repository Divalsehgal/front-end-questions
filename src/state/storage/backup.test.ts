// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { record } from '../progress';
import { backupName, downloadBackup } from './backup';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('backup', () => {
  it('names the file after the date', () => {
    expect(backupName(new Date('2026-03-04T10:00:00Z'))).toBe('fe-grind-backup-2026-03-04.json');
  });

  it('downloads the current progress as JSON and frees the blob URL', async () => {
    vi.useFakeTimers();
    record('js:a', true);
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => {
      blob = b;
      return 'blob:x';
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toMatch(/^fe-grind-backup-\d{4}-\d{2}-\d{2}\.json$/);
      expect(this.href).toBe('blob:x');
    });
    downloadBackup();
    expect(click).toHaveBeenCalledOnce();
    expect(blob?.type).toBe('application/json');
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:x');
    vi.useRealTimers(); // FileReader completes on a real task
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blob!);
    });
    expect(Object.keys(JSON.parse(text))).toEqual(['js:a']);
  });
});
