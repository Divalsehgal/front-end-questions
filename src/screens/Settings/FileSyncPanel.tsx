import { useState } from 'react';
import { disconnectFile, isAbort, useFileSync } from '../../state/storage/fileSync';
import { connectProgressFile, reconnectProgressFile } from '../../state/sync';
import { Button, Card } from '../../ui';
import type { FileSyncState } from '../../state/storage/fileSync';

const MESSAGES: Record<FileSyncState['status'], (name?: string) => string> = {
  unsupported: () => "This browser can't write to files on disk (that needs Chrome or Edge). Download a backup now and then instead.",
  off: () => 'Keep a copy of your progress in a file you choose. It survives clearing browser data and moves between browsers.',
  connected: (name) => `Syncing to ${name}. Every answer is written to it.`,
  'needs-permission': (name) => `The browser needs your OK again before writing to ${name}.`,
  error: (name) => `Couldn't write to ${name}. It may have been moved or deleted.`,
};

/** Connect, reconnect or stop syncing progress to a file on disk. */
export function FileSyncPanel() {
  const { status, name } = useFileSync();
  const [error, setError] = useState('');

  const attempt = async (action: () => Promise<unknown>) => {
    setError('');
    try {
      await action();
    } catch (err) {
      if (!isAbort(err)) setError("Couldn't use that file. Try another one.");
    }
  };
  const reconnect = () =>
    attempt(async () => {
      if (!(await reconnectProgressFile())) setError('Permission was not granted, so the file is not being updated.');
    });

  return (
    <Card className="px-5 py-4 text-sm">
      <p>{MESSAGES[status](name)}</p>
      <div className="mt-3 flex flex-wrap gap-2 empty:hidden">
        {status === 'off' && <Button onClick={() => void attempt(connectProgressFile)}>Choose a file</Button>}
        {status === 'needs-permission' && <Button onClick={() => void reconnect()}>Reconnect {name}</Button>}
        {status === 'error' && <Button onClick={() => void attempt(connectProgressFile)}>Choose the file again</Button>}
        {status !== 'off' && status !== 'unsupported' && (
          <Button variant="ghost" onClick={() => void disconnectFile()}>
            Stop syncing
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-error">
          {error}
        </p>
      )}
    </Card>
  );
}
