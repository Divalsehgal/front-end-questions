import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import { 
  Terminal, 
  RotateCcw, 
  Play, 
  Settings2, 
  Code2, 
  Sparkles,
  Zap
} from "lucide-react";

export const hint = "Advanced typewriter logic for text or code block streaming with controls";

const SAMPLE_CODE = `function initializeProject() {
  console.log("🚀 Starting refactor...");
  
  const techStack = [
    "React 19",
    "Tailwind v4",
    "Base UI",
    "Lucide Icons"
  ];

  return {
    status: "Premium",
    vibe: "State of the art"
  };
}

// Running mission critical software...`;

export default function TypeWriterEffect() {
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(30);
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isTyping) return;

    const timeout = setTimeout(() => {
      if (indexRef.current < SAMPLE_CODE.length) {
        setText(prev => prev + SAMPLE_CODE[indexRef.current]);
        indexRef.current += 1;
      } else {
        setIsTyping(false);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, speed, isTyping]);

  const reset = () => {
    setText("");
    indexRef.current = 0;
    setIsTyping(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
            <Terminal className="w-7 h-7 text-brand-500" />
            VIRTUAL TERMINAL
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Simulating high-speed code generation sequences.
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-muted hover:bg-surface rounded-2xl transition-all shadow-soft active:scale-95 group border border-subtle"
        >
          <RotateCcw className="w-5 h-5 text-text-muted group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="bg-muted rounded-3xl border-4 border-subtle shadow-hard overflow-hidden relative group">
        {/* Terminal Header */}
        <div className="bg-surface px-6 py-3 border-b border-subtle flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-error-500/50" />
            <div className="w-3 h-3 rounded-full bg-warning-500/50" />
            <div className="w-3 h-3 rounded-full bg-success-500/50" />
          </div>
          <div className="flex items-center gap-2 text-tiny font-black text-text-muted/40 uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 fill-brand-500 text-brand-500" />
            Antigravity Shell v4.0
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px] font-mono text-sm sm:text-base selection:bg-brand-500/30 selection:text-brand-400">
          <pre className="whitespace-pre-wrap">
            <code className="text-brand-400 leading-relaxed drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              {text}
              <span className={cn(
                "w-2.5 h-6 bg-brand-500 inline-block align-middle ml-1",
                isTyping ? "opacity-100" : "animate-pulse"
              )} />
            </code>
          </pre>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-16 right-6 flex flex-col gap-2">
          <div className="p-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-subtle flex flex-col gap-4">
             <div className="space-y-2">
                <div className="flex justify-between items-center text-tiny font-black text-text-muted/40 uppercase tracking-widest">
                  <span>Speed</span>
                  <span className="text-brand-500">{speed}ms</span>
                </div>
               <input 
                 type="range"
                 min="1"
                 max="100"
                 value={speed}
                 onChange={(e) => setSpeed(Number(e.target.value))}
                 className="w-24 accent-brand-500"
               />
             </div>
             <button 
               onClick={() => setIsTyping(!isTyping)}
               className={cn(
                 "flex items-center justify-center gap-2 py-2 rounded-xl text-tiny font-black uppercase tracking-widest transition-all",
                 isTyping ? "bg-error-500/10 text-error-500" : "bg-brand-500 text-text-inverted"
               )}
             >
               {isTyping ? <Settings2 className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
               {isTyping ? "Pause" : "Resume"}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-brand-500/5 border border-brand-500/10 rounded-3xl flex gap-4">
          <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-tiny font-black text-brand-500 uppercase tracking-widest">Stream Engine</h4>
            <p className="text-tiny text-text-main/60 leading-relaxed font-medium">Uses a high-precision timeout loop to simulate character-by-character processing.</p>
          </div>
        </div>
        <div className="p-5 bg-muted border border-subtle rounded-3xl flex gap-4">
          <div className="p-3 bg-surface rounded-2xl text-text-muted shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-tiny font-black text-text-muted uppercase tracking-widest">Monospace Core</h4>
            <p className="text-tiny text-text-muted font-medium leading-relaxed">Rendered with fixed-width typography and glowing shadow effects for terminal authenticity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
