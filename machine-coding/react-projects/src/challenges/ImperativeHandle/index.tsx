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
      "relative group transition-all duration-300",
      isShaking && "animate-shake"
    )}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-500 transition-colors">
        <Keyboard className="w-5 h-5" />
      </div>
      <input
        ref={internalInputRef}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-4 bg-surface border-2 border-subtle rounded-2xl outline-none transition-all text-text-main focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-text-muted/50 font-medium"
      />
      
      {/* Visual Indicator of "Controlled" status */}
      <div className="absolute top-0 right-0 -m-1 p-1 bg-brand-500 rounded-full shadow-soft shadow-brand-500/50">
        <Cpu className="w-3 h-3 text-text-inverted" />
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
    <div className="max-w-xl mx-auto p-6 space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
          <ShieldCheck className="w-7 h-7 text-brand-500" />
          BRIDGE CONTROL
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Enabling external orchestration of encapsulation layers.
        </p>
      </div>

      <div className="bg-surface rounded-3xl border border-subtle shadow-hard overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="space-y-3">
             <label className="text-tiny font-black text-text-muted uppercase tracking-widest ml-1">Exposed Interface Unit</label>
             <CustomInput ref={customInputRef} placeholder="Enter mission protocols..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        <div className="bg-muted p-6 border-t border-subtle">
          <div className="flex items-center gap-2 text-xs font-black text-text-muted uppercase tracking-widest mb-4">
            <Terminal className="w-4 h-4" />
            Pattern Explanation
          </div>
          <p className="text-xs font-medium text-text-muted leading-relaxed italic">
            "By using <span className="text-brand-500 font-bold">useImperativeHandle</span>, we've carefully selected which specific operations (Focus, Shake, Clear) are leaked to the parent, maintaining the child's integrity while allowing remote orchestration."
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
        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-white transition-all hover:scale-105 active:scale-95 shadow-lg",
        color
      )}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span className="text-tiny font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}