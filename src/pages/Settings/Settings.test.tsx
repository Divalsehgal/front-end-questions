import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProfile } from '../../state/profile';
import { resetProgress } from '../../state/progress';
import { downloadBackup } from '../../state/storage/backup';
import { disconnectFile } from '../../state/storage/fileSync';
import { isPersisted, requestPersistence } from '../../state/storage/persist';
import { connectProgressFile, reconnectProgressFile } from '../../state/sync';
import { abortError } from '../../test/fakeStorage';
import { renderWithRouter, storedProgress } from '../../test/render';
import { Settings } from '.';
import type { FileSyncState } from '../../state/storage/fileSync';

const file = vi.hoisted(() => ({ state: { status: 'off' } as FileSyncState }));
vi.mock('../../state/storage/fileSync', async (original) => ({
  ...(await original()),
  useFileSync: () => file.state,
  disconnectFile: vi.fn(() => Promise.resolve()),
}));
vi.mock('../../state/sync', () => ({ connectProgressFile: vi.fn(), reconnectProgressFile: vi.fn() }));
vi.mock('../../state/storage/persist', () => ({ isPersisted: vi.fn(), requestPersistence: vi.fn() }));
vi.mock('../../state/storage/backup', () => ({ downloadBackup: vi.fn() }));

// The router test helper's <output> is a status too: pick the panel's message.
const message = () => screen.getAllByRole('status').find((el) => el.tagName === 'P');
const attempt = { status: 'correct', attempts: 1, firstTry: true, box: 2, due: 0, updated: 1 };
const backupFile = (content: string, name = 'backup.json') => new File([content], name, { type: 'application/json' });

/** jsdom's File has no text(): give each test file one. */
function withText(f: File, content: string) {
  return Object.assign(f, { text: () => Promise.resolve(content) });
}

beforeEach(() => {
  resetProgress();
  updateProfile({ name: '', welcomed: true });
  file.state = { status: 'off' };
  vi.mocked(isPersisted).mockResolvedValue(false);
  vi.mocked(requestPersistence).mockResolvedValue(true);
  vi.mocked(connectProgressFile).mockReset().mockResolvedValue();
  vi.mocked(reconnectProgressFile).mockReset().mockResolvedValue(true);
});

describe('Settings', () => {
  it('edits the name', async () => {
    const { user } = renderWithRouter(<Settings />);
    await user.type(screen.getByRole('textbox', { name: /Your name/ }), 'Ada');
    expect(JSON.parse(localStorage.getItem('grind:profile')!).name).toBe('Ada');
  });

  it('asks the browser for persistent storage when not yet granted', async () => {
    const { user } = renderWithRouter(<Settings />);
    expect(await screen.findByText('Not yet protected from automatic clearing')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ask the browser' }));
    expect(await screen.findByText('Protected from automatic clearing')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Ask the browser' })).not.toBeInTheDocument();
  });

  it('shows storage as protected when it already is', async () => {
    vi.mocked(isPersisted).mockResolvedValue(true);
    renderWithRouter(<Settings />);
    expect(await screen.findByText('Protected from automatic clearing')).toBeInTheDocument();
  });

  it('connects a file, ignoring a closed picker and reporting a failure', async () => {
    const { user } = renderWithRouter(<Settings />);
    await user.click(screen.getByRole('button', { name: 'Choose a file' }));
    expect(connectProgressFile).toHaveBeenCalledOnce();

    vi.mocked(connectProgressFile).mockRejectedValueOnce(abortError());
    await user.click(screen.getByRole('button', { name: 'Choose a file' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.mocked(connectProgressFile).mockRejectedValueOnce(new Error('nope'));
    await user.click(screen.getByRole('button', { name: 'Choose a file' }));
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't use that file");
  });

  it('shows the synced file and stops syncing', async () => {
    file.state = { status: 'connected', name: 'grind.json' };
    const { user } = renderWithRouter(<Settings />);
    expect(screen.getByText(/Syncing to grind.json/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Stop syncing' }));
    expect(disconnectFile).toHaveBeenCalled();
  });

  it('reconnects a file whose permission lapsed, and explains a refusal', async () => {
    file.state = { status: 'needs-permission', name: 'grind.json' };
    const { user } = renderWithRouter(<Settings />);
    await user.click(screen.getByRole('button', { name: 'Reconnect grind.json' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    vi.mocked(reconnectProgressFile).mockResolvedValueOnce(false);
    await user.click(screen.getByRole('button', { name: 'Reconnect grind.json' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Permission was not granted');
  });

  it('offers to pick the file again after a write error', async () => {
    file.state = { status: 'error', name: 'grind.json' };
    const { user } = renderWithRouter(<Settings />);
    expect(screen.getByText(/Couldn't write to grind.json/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Choose the file again' }));
    expect(connectProgressFile).toHaveBeenCalledOnce();
  });

  it('points to backups where file sync is unsupported', () => {
    file.state = { status: 'unsupported' };
    renderWithRouter(<Settings />);
    expect(screen.getByText(/needs Chrome or Edge/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Choose|Stop/ })).not.toBeInTheDocument();
  });

  it('downloads a backup', async () => {
    const { user } = renderWithRouter(<Settings />);
    await user.click(screen.getByRole('button', { name: 'Download backup' }));
    expect(downloadBackup).toHaveBeenCalledOnce();
  });

  it('restores a backup and reports how many questions it held', async () => {
    const { user } = renderWithRouter(<Settings />);
    const click = vi.spyOn(HTMLInputElement.prototype, 'click');
    await user.click(screen.getByRole('button', { name: 'Restore from backup' }));
    expect(click).toHaveBeenCalled();
    const json = JSON.stringify({ 'js:a': attempt, 'js:b': attempt });
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Backup file'), { target: { files: [withText(backupFile(json), json)] } });
    });
    expect(message()).toHaveTextContent('Restored 2 questions');
    expect(Object.keys(storedProgress())).toEqual(['js:a', 'js:b']);

    const one = JSON.stringify({ 'js:c': attempt });
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Backup file'), { target: { files: [withText(backupFile(one), one)] } });
    });
    expect(message()).toHaveTextContent('Restored 1 question.');
  });

  it('rejects a file that is not a backup, and ignores an empty pick', async () => {
    renderWithRouter(<Settings />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Backup file'), { target: { files: [withText(backupFile('oops', 'notes.txt'), 'oops')] } });
    });
    expect(message()).toHaveTextContent("notes.txt isn't an FE Grind backup.");
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Backup file'), { target: { files: [] } });
    });
    expect(message()).toHaveTextContent("notes.txt isn't");
  });
});
