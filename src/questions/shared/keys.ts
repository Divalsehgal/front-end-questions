import { useEffect, useRef } from 'react';

/** Ignore global shortcuts while the user is typing somewhere. */
export const isTyping = (e: KeyboardEvent) =>
  e.target instanceof HTMLTextAreaElement ||
  e.target instanceof HTMLInputElement ||
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
