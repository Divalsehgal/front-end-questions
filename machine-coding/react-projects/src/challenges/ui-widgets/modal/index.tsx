import React, { useState, useRef, useId, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2 } from "lucide-react";
import { cn } from "../../../utils/cn";

export const hint = "Manual Modal implementation using Portals, Refs, and Click-Outside logic.";

type ModalDialogProps = {
  children: React.ReactNode;
  title: string;
  toggle: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

function ModalDialog({
  children,
  title,
  toggle,
  setToggle,
  modalRef,
}: ModalDialogProps) {
  const id = useId()
  const titleId = `modal-title-${id}`;
  const descId = `modal-desc-${id}`;


  const clickHandler = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setToggle(false);
    }
  }, [modalRef])

  useEffect(() => {
    function escapeHandler(e: KeyboardEvent) {

      if (e.key === "Escape") {
        setToggle(false);
      }
    }

    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, []);


  if (!toggle) {
    return null;
  }


  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#f0ffff]/80 p-4 backdrop-blur-sm duration-300" onMouseDown={clickHandler}>
      <div
        className="animate-in zoom-in-95 slide-in-from-bottom-8 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-slate-400 bg-[#f5f5dc] shadow-2xl duration-500 ease-out"
        ref={modalRef}
        role="dialog"
        aria-labelledby={titleId}
        aria-modal={true}
        onMouseDown={(e) => e.stopPropagation()}
        aria-describedby={descId}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/50 px-8 py-6">
          <h1 id={titleId} className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800 uppercase">
            <Maximize2 className="size-6 text-brand-500" />
            {title}
          </h1>
          <button
            aria-label="close button"
            onClick={() => setToggle(false)}
            className="rounded-xl p-2 transition-colors hover:bg-slate-200 active:scale-90"
          >
            <X className="size-6 text-slate-500" />
          </button>
        </div>

        <div id={descId} className="p-8 leading-relaxed font-medium text-slate-700">
          {children}
        </div>

        <div className="flex justify-end bg-slate-100/50 px-8 py-4">
          <button
            onClick={() => setToggle(false)}
            className="rounded-xl bg-slate-800 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-slate-900 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ModalChallenge() {
  const [title, setTitle] = useState("Modal Dialog");
  const [toggle, setToggle] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-subtle flex min-h-[400px] flex-col items-center justify-center rounded-3xl border bg-surface p-12 shadow-soft">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tighter text-text-main uppercase">Manual Modal</h2>
        <p className="text-sm font-medium text-text-muted">Mastering Portals and Event Handling</p>
      </div>

      <button
        onClick={() => setToggle(true)}
        className={cn(
          "rounded-2xl bg-brand-500 px-8 py-4 font-black tracking-widest text-text-inverted uppercase shadow-hard shadow-brand-500/10",
          "flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        )}
      >
        <Maximize2 className="size-5" />
        Open Modal
      </button>

      <ModalDialog
        modalRef={modalRef}
        title={title}
        toggle={toggle}
        setToggle={setToggle}
      >
        One morning, when Gregor Samsa woke from troubled dreams, he found
        himself transformed in his bed into a horrible vermin. He lay on his
        armour-like back, and if he lifted his head a little he could see his
        brown belly, slightly domed and divided by arches into stiff sections.
      </ModalDialog>
    </div>
  );
}
