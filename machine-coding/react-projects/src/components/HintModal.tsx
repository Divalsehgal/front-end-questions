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
          <h4 key={index} className="text-xl font-black text-text-main mt-8 mb-4 flex items-center gap-3 uppercase tracking-tighter">
            <CheckCircle2 className="w-6 h-6 text-brand-500" />
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
            <div key={index} className="flex gap-4 p-5 rounded-3xl bg-surface-sunken/40 mb-3 border border-border-subtle group hover:border-brand-500/30 transition-all duration-300">
              <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-sm shadow-soft shadow-brand-500/20">
                {num}
              </span>
              <div className="space-y-1">
                <p className="font-bold text-lg text-text-main group-hover:text-brand-500 transition-colors tracking-tight">{boldMatch[1]}</p>
                <p className="text-sm text-text-muted leading-relaxed">{boldMatch[2]}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="flex gap-4 p-5 rounded-3xl bg-surface-sunken/40 mb-3 border border-border-subtle hover:border-brand-500/30 transition-all duration-300">
            <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-sm shadow-soft shadow-brand-500/20">
              {num}
            </span>
            <p className="text-sm text-text-muted leading-relaxed pt-2">{content}</p>
          </div>
        );
      }

      // Regular text with potential bolding
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="text-sm text-text-muted mb-3 leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={i} className="text-text-main font-bold">{part.slice(2, -2)}</strong>;
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
        className="absolute inset-0 bg-canvas/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] border border-border-strong shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-spring"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-border-subtle flex items-center justify-between bg-surface-sunken/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-brand-500 text-white shadow-hard shadow-brand-500/20">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main tracking-tighter uppercase leading-tight">
                Learning Gist
              </h2>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                {challengeName || "Implementation Guide"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-muted rounded-2xl transition-all active:scale-90 text-text-muted hover:text-text-main"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-10 py-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {renderHintContent(hint)}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-surface-sunken/20 border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3.5 bg-text-main text-canvas font-black uppercase tracking-widest rounded-2xl hover:bg-brand-500 hover:text-white transition-all active:scale-95 shadow-soft"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
