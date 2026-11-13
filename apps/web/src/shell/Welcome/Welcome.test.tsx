import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProfile } from '../../state/profile';
import { requestPersistence } from '../../state/storage/persist';
import { connectProgressFile } from '../../state/sync';
import { abortError } from '../../test/fakeStorage';
import { renderWithRouter, location } from '../../test/render';
import { Welcome } from '.';
import type { FileSyncState } from '../../state/storage/fileSync';

const file = vi.hoisted(() => ({ state: { status: 'off' } as FileSyncState }));
vi.mock('../../state/storage/fileSync', async (original) => ({ ...(await original()), useFileSync: () => file.state }));
vi.mock('../../state/sync', () => ({ connectProgressFile: vi.fn(() => Promise.resolve()) }));
vi.mock('../../state/storage/persist', () => ({ requestPersistence: vi.fn(() => Promise.resolve(true)) }));

const stored = () => JSON.parse(localStorage.getItem('grind:profile') ?? '{}') as { name?: string; welcomed?: boolean };

beforeEach(() => {
  updateProfile({ name: '', welcomed: false });
  file.state = { status: 'off' };
  vi.mocked(connectProgressFile).mockReset().mockResolvedValue();
  vi.mocked(requestPersistence).mockClear();
});

describe('Welcome', () => {
  it('asks for an optional name and a storage choice, defaulting to this browser', () => {
    renderWithRouter(<Welcome />);
    expect(screen.getByRole('region', { name: 'Welcome to FE Grind' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /What should we call you/ })).toHaveValue('');
    expect(screen.getByRole('radio', { name: /This browser/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /A file on your computer/ })).toBeEnabled();
  });

  it('saves the name, asks for persistent storage and goes away', async () => {
    const { user } = renderWithRouter(<Welcome />);
    await user.type(screen.getByRole('textbox'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(stored()).toEqual({ name: 'Ada', welcomed: true });
    expect(requestPersistence).toHaveBeenCalledOnce();
    expect(connectProgressFile).not.toHaveBeenCalled();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('connects a file when that is the choice', async () => {
    const { user } = renderWithRouter(<Welcome />);
    await user.click(screen.getByRole('radio', { name: /A file/ }));
    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(connectProgressFile).toHaveBeenCalledOnce();
    expect(stored().welcomed).toBe(true);
  });

  it('stays open, quietly, when the file picker is closed', async () => {
    vi.mocked(connectProgressFile).mockRejectedValue(abortError());
    const { user } = renderWithRouter(<Welcome />);
    await user.click(screen.getByRole('radio', { name: /A file/ }));
    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(stored().welcomed).toBe(false);
  });

  it('explains a file that could not be used', async () => {
    vi.mocked(connectProgressFile).mockRejectedValue(new Error('denied'));
    const { user } = renderWithRouter(<Welcome />);
    await user.click(screen.getByRole('radio', { name: /A file/ }));
    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Couldn't use that file/);
  });

  it('disables the file option where the browser cannot write files', () => {
    file.state = { status: 'unsupported' };
    renderWithRouter(<Welcome />);
    expect(screen.getByRole('radio', { name: /A file/ })).toBeDisabled();
    expect(screen.getByText(/Needs Chrome or Edge/)).toBeInTheDocument();
  });

  it('can be skipped without asking for anything', async () => {
    const { user } = renderWithRouter(<Welcome />);
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(stored().welcomed).toBe(true);
    expect(requestPersistence).not.toHaveBeenCalled();
  });

  it('links to settings', async () => {
    const { user } = renderWithRouter(<Welcome />);
    await user.click(screen.getByRole('link', { name: 'Backups & settings' }));
    expect(location()).toBe('/settings');
  });

  it('is not shown once answered', () => {
    updateProfile({ welcomed: true });
    renderWithRouter(<Welcome />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
