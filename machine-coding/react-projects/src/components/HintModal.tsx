import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
  challengeName?: string;
}

export default function HintModal({ isOpen, onClose, hint, challengeName }: HintModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Simple Markdown-lite parser (v2 - refined for modal)
  const renderHintContent = (text: string) => {
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={index} className="h-4" />;

      // Headings
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={index} className="mt-8 mb-4 flex items-center gap-3 text-xl font-black tracking-tighter text-text-main uppercase">
            <CheckCircle2 className="size-6 text-brand-500" />
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }

      // Numbered Lists
      const listMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
      if (listMatch) {
        const [_, num, content] = listMatch;
        const boldMatch = content.match(/^\*\*(.*?)\*\*:\s*(.*)/);
        
        if (boldMatch) {
          return (
            <div key={index} className="bg-surface-sunken/40 group mb-3 flex gap-4 rounded-3xl border border-border-subtle p-5 transition-all duration-300 hover:border-brand-500/30">
              <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-sm font-black text-white shadow-soft shadow-brand-500/20">
                {num}
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold tracking-tight text-text-main transition-colors group-hover:text-brand-500">{boldMatch[1]}</p>
                <p className="text-sm leading-relaxed text-text-muted">{boldMatch[2]}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="bg-surface-sunken/40 mb-3 flex gap-4 rounded-3xl border border-border-subtle p-5 transition-all duration-300 hover:border-brand-500/30">
            <span className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-sm font-black text-white shadow-soft shadow-brand-500/20">
              {num}
            </span>
            <p className="pt-2 text-sm leading-relaxed text-text-muted">{content}</p>
          </div>
        );
      }

      // Regular text with potential bolding
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-3 text-sm leading-relaxed text-text-muted">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={i} className="font-bold text-text-main">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="animate-in fade-in absolute inset-0 bg-canvas/60 backdrop-blur-md duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="animate-in zoom-in-95 slide-in-from-bottom-8 relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-border-strong bg-surface shadow-2xl duration-500 ease-spring"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-surface-sunken/20 flex items-center justify-between border-b border-border-subtle px-10 py-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-brand-500 p-3 text-white shadow-hard shadow-brand-500/20">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-2xl leading-tight font-black tracking-tighter text-text-main uppercase">
                Learning Gist
              </h2>
              <p className="text-xs font-bold tracking-widest text-text-muted uppercase">
                {challengeName || "Implementation Guide"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-3 text-text-muted transition-all hover:bg-muted hover:text-text-main active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto p-10">
          <div className="space-y-2">
            {renderHintContent(hint)}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-sunken/20 flex justify-end border-t border-border-subtle px-10 py-6">
          <button
            onClick={onClose}
            className="rounded-2xl bg-text-main px-10 py-3.5 font-black tracking-widest text-canvas uppercase shadow-soft transition-all hover:bg-brand-500 hover:text-white active:scale-95"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
