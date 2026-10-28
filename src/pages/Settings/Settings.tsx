import { Database, HardDrive, ShieldCheck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateProfile, useProfile } from '../../state/profile';
import { isPersisted, requestPersistence } from '../../state/storage/persist';
import { Button, Card, Page, PageHeader, SectionTitle, TextField } from '../../ui';
import { BackupPanel } from './BackupPanel';
import { FileSyncPanel } from './FileSyncPanel';

function PersistenceRow() {
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    void isPersisted().then((p) => live && setPersisted(p));
    return () => {
      live = false;
    };
  }, []);
  const ask = async () => setPersisted(await requestPersistence());

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm">
      <ShieldCheck size={18} aria-hidden className={persisted ? 'text-success' : 'text-text-muted'} />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{persisted ? 'Protected from automatic clearing' : 'Not yet protected from automatic clearing'}</p>
        <p className="text-text-muted">
          {persisted
            ? 'The browser has agreed not to clear this data on its own. Clearing site data by hand still removes it.'
            : 'The browser may clear this data when disk space runs low (Safari after 7 days without a visit).'}
        </p>
      </div>
      {persisted === false && (
        <Button variant="secondary" size="sm" onClick={() => void ask()}>
          Ask the browser
        </Button>
      )}
    </div>
  );
}

export function Settings() {
  const { name } = useProfile();
  return (
    <Page width="narrow">
      <PageHeader title="Settings" description="Your name and your progress stay on this device. There is no account and no server." />

      <SectionTitle icon={<User size={14} />}>Profile</SectionTitle>
      <Card className="p-5">
        <TextField
          label="Your name"
          hint="(optional, used for greetings)"
          value={name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          maxLength={40}
          autoComplete="given-name"
        />
      </Card>

      <SectionTitle icon={<Database size={14} />}>Storage</SectionTitle>
      <Card>
        <p className="px-5 pt-4 text-sm text-text-muted">
          Progress is saved in this browser&apos;s IndexedDB, with a copy in localStorage for instant loading.
        </p>
        <PersistenceRow />
      </Card>

      <SectionTitle icon={<HardDrive size={14} />}>Sync to a file</SectionTitle>
      <FileSyncPanel />

      <BackupPanel />
    </Page>
  );
}
