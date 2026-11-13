import { useEffect, useRef } from 'react';

// Inputs that take no typed text: a focused quiz option (radio/checkbox) must still let 1–n and Enter through.
const NON_TEXT_INPUTS = new Set(['checkbox', 'radio', 'button', 'submit', 'reset']);

/** Ignore global shortcuts while the user is typing somewhere. */
export const isTyping = (e: KeyboardEvent) =>
  e.target instanceof HTMLTextAreaElement ||
  (e.target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(e.target.type)) ||
  (e.target instanceof HTMLElement && (e.target.isContentEditable || !!e.target.closest('.monaco-editor')));

/** Window-level keyboard shortcuts that stay quiet while the user is typing. Always calls the latest handler. */
export function useShortcuts(handler: (e: KeyboardEvent) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isTyping(e)) ref.current(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
