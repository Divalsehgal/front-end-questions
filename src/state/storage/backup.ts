import { exportProgress } from '../progress';

/** Today's date as YYYY-MM-DD, for backup file names. */
export const backupName = (now = new Date()) => `fe-grind-backup-${now.toISOString().slice(0, 10)}.json`;

/** Saves the current progress as a JSON file through the browser's normal download. */
export function downloadBackup() {
  const url = URL.createObjectURL(new Blob([exportProgress()], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = backupName();
  a.click();
  // Revoke on the next tick: some browsers start the download asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
