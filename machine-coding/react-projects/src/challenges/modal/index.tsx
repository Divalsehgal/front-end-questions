import React, { useState, useRef, useId, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2 } from "lucide-react";
import { cn } from "../../utils/cn";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f0ffff]/80 backdrop-blur-sm animate-in fade-in duration-300" onMouseDown={clickHandler}>
      <div
        className="bg-[#f5f5dc] border-2 border-slate-400 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out"
        ref={modalRef}
        role="dialog"
        aria-labelledby={titleId}
        aria-modal={true}
        onMouseDown={(e) => e.stopPropagation()}
        aria-describedby={descId}
      >
        <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white/50">
          <h1 id={titleId} className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <Maximize2 className="w-6 h-6 text-brand-500" />
            {title}
          </h1>
          <button
            aria-label="close button"
            onClick={() => setToggle(false)}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors active:scale-90"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div id={descId} className="p-8 text-slate-700 leading-relaxed font-medium">
          {children}
        </div>

        <div className="px-8 py-4 bg-slate-100/50 flex justify-end">
          <button
            onClick={() => setToggle(false)}
            className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95 shadow-lg"
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
    <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-3xl min-h-[400px] border border-subtle shadow-soft">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-text-main uppercase tracking-tighter">Manual Modal</h2>
        <p className="text-sm font-medium text-text-muted">Mastering Portals and Event Handling</p>
      </div>

      <button
        onClick={() => setToggle(true)}
        className={cn(
          "px-8 py-4 bg-brand-500 text-text-inverted font-black uppercase tracking-widest rounded-2xl shadow-hard shadow-brand-500/10",
          "hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2"
        )}
      >
        <Maximize2 className="w-5 h-5" />
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
