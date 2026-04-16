import React from "react";
import { Popover } from "@base-ui/react/popover";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PopoverDemo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-24 bg-surface-sunken rounded-3xl min-h-[400px]">
      <div className="mb-12 text-center max-w-md">
        <h2 className="text-3xl font-display font-black tracking-tight text-text-main">Base UI Popover</h2>
        <p className="text-text-muted mt-2">
          Headless popover with smart positioning, refactored with Tailwind v4 utilities.
        </p>
      </div>

      <Popover.Root>
        <Popover.Trigger className={cn(
          "px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20",
          "hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 transition-transform cursor-pointer",
          "focus-visible:ring-4 focus-visible:ring-primary/40 outline-none"
        )}>
          Click to Open
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={12}>
            <Popover.Popup className={cn(
              "z-50 p-6 bg-surface border border-border-strong rounded-3xl shadow-2xl w-72",
              "animate-in fade-in zoom-in-95 duration-300 ease-spring"
            )}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Info
                </div>
                <p className="text-text-main leading-relaxed">
                  Hi! This is a <strong>Base UI Popover</strong>. It automatically handles positioning, accessibility, and click-outside dismissal.
                </p>
                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-xs text-text-muted italic">Click anywhere outside to close.</p>
                </div>
              </div>
              <Popover.Arrow className="fill-surface stroke-border-strong border-strong" />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default PopoverDemo;
export const hint = "Headless popover component with smart positioning using Base UI";
