import React from "react";
import { Popover } from "@base-ui/react/popover";
import { Info, MousePointer2 } from "lucide-react";
import { cn } from "../../utils/cn";

export const hint = "Headless popover component with smart positioning using Base UI";

const PopoverDemo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-3xl min-h-[500px] relative overflow-hidden border border-subtle">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />

      <div className="mb-12 text-center max-w-md relative z-10">
        <h2 className="text-3xl font-black tracking-tighter text-text-main uppercase">Base UI Popover</h2>
        <p className="text-sm font-medium text-text-muted mt-2">
          Headless popover with smart positioning, refactored with <span className="text-brand-500">Antigravity Design Tokens</span>.
        </p>
      </div>

      <Popover.Root>
        <Popover.Trigger className={cn(
          "px-8 py-4 bg-brand-500 text-text-inverted font-black uppercase tracking-widest rounded-2xl shadow-hard shadow-brand-500/10",
          "hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2",
          "focus-visible:ring-4 focus-visible:ring-brand-500/40 outline-none"
        )}>
          <MousePointer2 className="w-4 h-4" />
          Click to Open
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={12}>
            <Popover.Popup className={cn(
              "z-50 p-6 bg-surface border border-strong rounded-3xl shadow-hard w-80",
              "animate-in fade-in zoom-in-95 duration-300 ease-spring"
            )}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-500 font-black text-tiny uppercase tracking-widest">
                  <div className="p-1 bg-brand-500/10 rounded-lg">
                    <Info className="w-4 h-4" />
                  </div>
                  Semantic Intelligence
                </div>
                <p className="text-text-main leading-relaxed font-medium">
                  Hi! This is a <strong>Base UI Popover</strong>. It automatically handles positioning, accessibility, and click-outside dismissal using high-precision logic.
                </p>
                <div className="pt-4 border-t border-subtle">
                  <p className="text-tiny font-medium text-text-muted/60 italic">Dismiss by clicking anywhere outside this boundary.</p>
                </div>
              </div>
              <Popover.Arrow className="fill-surface stroke-strong border-strong" />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default PopoverDemo;
