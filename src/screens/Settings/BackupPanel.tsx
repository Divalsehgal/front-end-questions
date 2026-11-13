import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { importProgress } from '../../state/progress';
import { downloadBackup } from '../../state/storage/backup';
import { Button, Card, SectionTitle } from '../../ui';
import type { ChangeEvent } from 'react';

/** Download progress as a JSON file, or merge one back in. */
export function BackupPanel() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const restore = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // picking the same file again should still fire change
    if (!file) return;
    try {
      const n = importProgress(await file.text());
      setMessage({ ok: true, text: `Restored ${n} question${n === 1 ? '' : 's'}. Newer answers on this device were kept.` });
    } catch {
      setMessage({ ok: false, text: `${file.name} isn't an FE Grind backup.` });
    }
  };

  return (
    <>
      <SectionTitle icon={<Download size={14} />}>Backup</SectionTitle>
      <Card className="px-5 py-4 text-sm">
        <p>Works in every browser. Restoring merges the backup in, keeping whichever answer is newer for each question.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={downloadBackup}>
            <Download size={16} aria-hidden /> Download backup
          </Button>
          <Button variant="secondary" onClick={() => input.current?.click()}>
            <Upload size={16} aria-hidden /> Restore from backup
          </Button>
          <input ref={input} type="file" accept="application/json,.json" className="hidden" aria-label="Backup file" onChange={(e) => void restore(e)} />
        </div>
        {message && (
          <p role="status" className={message.ok ? 'mt-3 text-success' : 'mt-3 text-error'}>
            {message.text}
          </p>
        )}
      </Card>
    </>
  );
}
