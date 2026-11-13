import { useEffect, useState } from 'react';
import { clearDraft, loadDraft, saveDraft } from '../../state/progress';

/** Editor contents persisted per question, so a reload doesn't lose work. */
export function useDraft(draftId: string, starter: string) {
  const [code, setCode] = useState(() => loadDraft(draftId) ?? starter);
  useEffect(() => {
    saveDraft(draftId, code);
  }, [draftId, code]);

  /** Back to the starter, asking first if there is work to lose. Returns whether it reset. */
  const reset = (message: string) => {
    if (code !== starter && !window.confirm(message)) return false;
    clearDraft(draftId);
    setCode(starter);
    return true;
  };
  return { code, setCode, reset };
}
