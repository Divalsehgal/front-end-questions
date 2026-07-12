import React, { useImperativeHandle, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { 
  Keyboard, 
  MousePointer2, 
  Eraser, 
  Terminal, 
  ShieldCheck,
  Zap,
  Cpu
} from "lucide-react";

export const hint = "Structural example of useImperativeHandle for precise parent-to-child component control";

export interface CustomInputRef {
  focus: () => void;
  clear: () => void;
  shake: () => void;
}

// --- Child Component ---

const CustomInput = ({ placeholder, ref }: { placeholder?: string; ref: React.Ref<CustomInputRef> }) => {
  const [isShaking, setIsShaking] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      internalInputRef.current?.focus();
    },
    clear() {
      if (internalInputRef.current) {
        internalInputRef.current.value = "";
      }
    },
    shake() {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }), []);

  return (
    <div className={cn(
      "group relative transition-all duration-300",
      isShaking && "animate-shake"
    )}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted transition-colors group-focus-within:text-brand-500">
        <Keyboard className="size-5" />
      </div>
      <input
        ref={internalInputRef}
        placeholder={placeholder}
        className="border-subtle w-full rounded-2xl border-2 bg-surface py-4 pr-4 pl-11 font-medium text-text-main transition-all outline-none placeholder:text-text-muted/50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
      />
      
      {/* Visual Indicator of "Controlled" status */}
      <div className="absolute top-0 right-0 -m-1 rounded-full bg-brand-500 p-1 shadow-soft shadow-brand-500/50">
        <Cpu className="size-3 text-text-inverted" />
      </div>
    </div>
  );
};

// --- Parent Component ---

export default function ImperativeHandleExample() {
  const customInputRef = useRef<CustomInputRef>(null);

  const handleFocus = () => customInputRef.current?.focus();
  const handleClear = () => customInputRef.current?.clear();
  const handleShake = () => customInputRef.current?.shake();

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6 pb-20">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
          <ShieldCheck className="size-7 text-brand-500" />
          BRIDGE CONTROL
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Enabling external orchestration of encapsulation layers.
        </p>
      </div>

      <div className="border-subtle overflow-hidden rounded-3xl border bg-surface shadow-hard">
        <div className="space-y-8 p-8">
          <div className="space-y-3">
             <label className="text-tiny ml-1 font-black tracking-widest text-text-muted uppercase">Exposed Interface Unit</label>
             <CustomInput ref={customInputRef} placeholder="Enter mission protocols..." />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ControlButton 
              onClick={handleFocus} 
              icon={<MousePointer2 />} 
              label="Focus" 
              color="bg-brand-500 shadow-brand-500/20"
            />
            <ControlButton 
              onClick={handleShake} 
              icon={<Zap />} 
              label="Shake" 
              color="bg-amber-500 shadow-amber-500/20"
            />
            <ControlButton 
              onClick={handleClear} 
              icon={<Eraser />} 
              label="Clear" 
              color="bg-slate-800 shadow-slate-800/20"
            />
          </div>
        </div>

        <div className="border-subtle border-t bg-muted p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-text-muted uppercase">
            <Terminal className="size-4" />
            Pattern Explanation
          </div>
          <p className="text-xs leading-relaxed font-medium text-text-muted italic">
            "By using <span className="font-bold text-brand-500">useImperativeHandle</span>, we've carefully selected which specific operations (Focus, Shake, Clear) are leaked to the parent, maintaining the child's integrity while allowing remote orchestration."
          </p>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ onClick, icon, label, color }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-white shadow-lg transition-all hover:scale-105 active:scale-95",
        color
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span className="text-tiny font-black tracking-widest uppercase">{label}</span>
    </button>
  );
}