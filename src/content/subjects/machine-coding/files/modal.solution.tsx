import React, { useState, useRef, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalDialogProps = {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
};

function ModalDialog({ children, title, open, onClose }: ModalDialogProps) {
  const id = useId();
  const titleId = `modal-title-${id}`;
  const descId = `modal-desc-${id}`;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Remember what had focus so we can restore it on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        // Only a press that starts on the backdrop itself closes the dialog.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold text-slate-800">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        <div id={descId} className="p-6 leading-relaxed text-slate-700">
          {children}
        </div>

        <div className="flex justify-end bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 font-semibold text-white transition-colors hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ModalChallenge() {
  const [open, setOpen] = useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface p-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-text-main">Modal</h2>
        <p className="text-sm text-text-muted">Rendered with createPortal</p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-text-inverted transition-colors hover:bg-brand-600"
      >
        Open modal
      </button>

      <ModalDialog title="Modal dialog" open={open} onClose={close}>
        This dialog is rendered into document.body, so it is not clipped by a
        parent with overflow hidden. Press Escape, click the backdrop or use a
        close button to dismiss it. Focus returns to the button that opened it.
      </ModalDialog>
    </div>
  );
}
