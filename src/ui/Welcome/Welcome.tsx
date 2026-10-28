import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateProfile, useProfile } from '../../state/profile';
import { isAbort, useFileSync } from '../../state/storage/fileSync';
import { requestPersistence } from '../../state/storage/persist';
import { connectProgressFile } from '../../state/sync';
import { Button } from '../Button';
import { RadioOption, TextField } from '../Field';
import type { FormEvent } from 'react';

type Where = 'browser' | 'file';

/**
 * First-visit card: an optional name and where progress should live. It sits in a corner instead
 * of blocking the page, so content (and its prerendered HTML) still comes first.
 */
export function Welcome() {
  const { welcomed } = useProfile();
  const canFile = useFileSync().status !== 'unsupported';
  const [name, setName] = useState('');
  const [where, setWhere] = useState<Where>('browser');
  const [error, setError] = useState('');
  if (welcomed) return null;

  const finish = async (e: FormEvent) => {
    e.preventDefault();
    if (where === 'file') {
      try {
        await connectProgressFile();
      } catch (err) {
        if (!isAbort(err)) setError("Couldn't use that file. Pick another, or keep progress in this browser.");
        return;
      }
    }
    void requestPersistence();
    updateProfile({ name, welcomed: true });
  };

  return (
    <section
      aria-labelledby="welcome-title"
      className="fixed inset-x-4 bottom-4 z-40 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg border border-line bg-surface p-5 shadow-lg md:left-auto md:w-96"
    >
      <form onSubmit={(e) => void finish(e)}>
        <h2 id="welcome-title" className="text-base font-semibold">
          Welcome to FE Grind
        </h2>
        <p className="mt-1 text-sm text-text-muted">Two quick choices. No account, and nothing leaves your device.</p>

        <div className="mt-4">
          <TextField
            label="What should we call you?"
            hint="(optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="given-name"
          />
        </div>

        <fieldset className="mt-4 space-y-2">
          <legend className="mb-1.5 text-sm font-medium">Where should your progress live?</legend>
          <RadioOption
            name="where"
            value="browser"
            checked={where === 'browser'}
            onChange={() => setWhere('browser')}
            title="This browser (recommended)"
            hint="Saved in IndexedDB, and we ask the browser never to clear it."
          />
          <RadioOption
            name="where"
            value="file"
            checked={where === 'file'}
            onChange={() => setWhere('file')}
            disabled={!canFile}
            title="A file on your computer"
            hint={canFile ? 'Survives clearing browser data. You pick where it is saved.' : 'Needs Chrome or Edge. Download backups instead.'}
          />
        </fieldset>

        {error && (
          <p role="alert" className="mt-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Link to="/settings" className="text-sm text-text-muted underline underline-offset-2 hover:text-text-main">
            Backups & settings
          </Link>
          <Button variant="ghost" className="ml-auto" onClick={() => updateProfile({ welcomed: true })}>
            Skip
          </Button>
          <Button type="submit">Get started</Button>
        </div>
      </form>
    </section>
  );
}
