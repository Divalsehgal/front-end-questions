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
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
            <Terminal className="size-7 text-brand-500" />
            VIRTUAL TERMINAL
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Simulating high-speed code generation sequences.
          </p>
        </div>
        <button 
          onClick={reset}
          className="group border-subtle rounded-2xl border bg-muted p-3 shadow-soft transition-all hover:bg-surface active:scale-95"
        >
          <RotateCcw className="size-5 text-text-muted transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>

      <div className="border-subtle group relative overflow-hidden rounded-3xl border-4 bg-muted shadow-hard">
        {/* Terminal Header */}
        <div className="border-subtle flex items-center justify-between border-b bg-surface px-6 py-3">
          <div className="flex gap-2">
            <div className="bg-error-500/50 size-3 rounded-full" />
            <div className="bg-warning-500/50 size-3 rounded-full" />
            <div className="bg-success-500/50 size-3 rounded-full" />
          </div>
          <div className="text-tiny flex items-center gap-2 font-black tracking-[0.2em] text-text-muted/40 uppercase">
            <Zap className="size-3 fill-brand-500 text-brand-500" />
            Antigravity Shell v4.0
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px] p-8 font-mono text-sm selection:bg-brand-500/30 selection:text-brand-400 sm:text-base">
          <pre className="whitespace-pre-wrap">
            <code className="leading-relaxed text-brand-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              {text}
              <span className={cn(
                "ml-1 inline-block h-6 w-2.5 bg-brand-500 align-middle",
                isTyping ? "opacity-100" : "animate-pulse"
              )} />
            </code>
          </pre>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-16 right-6 flex flex-col gap-2">
          <div className="border-subtle flex flex-col gap-4 rounded-2xl border bg-surface/80 p-4 backdrop-blur-md">
             <div className="space-y-2">
                <div className="text-tiny flex items-center justify-between font-black tracking-widest text-text-muted/40 uppercase">
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
                 "text-tiny flex items-center justify-center gap-2 rounded-xl py-2 font-black tracking-widest uppercase transition-all",
                 isTyping ? "bg-error-500/10 text-error-500" : "bg-brand-500 text-text-inverted"
               )}
             >
               {isTyping ? <Settings2 className="size-3" /> : <Play className="size-3 fill-current" />}
               {isTyping ? "Pause" : "Resume"}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex gap-4 rounded-3xl border border-brand-500/10 bg-brand-500/5 p-5">
          <div className="shrink-0 rounded-2xl bg-brand-500/10 p-3 text-brand-500">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-tiny font-black tracking-widest text-brand-500 uppercase">Stream Engine</h4>
            <p className="text-tiny leading-relaxed font-medium text-text-main/60">Uses a high-precision timeout loop to simulate character-by-character processing.</p>
          </div>
        </div>
        <div className="border-subtle flex gap-4 rounded-3xl border bg-muted p-5">
          <div className="shrink-0 rounded-2xl bg-surface p-3 text-text-muted">
            <Code2 className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-tiny font-black tracking-widest text-text-muted uppercase">Monospace Core</h4>
            <p className="text-tiny leading-relaxed font-medium text-text-muted">Rendered with fixed-width typography and glowing shadow effects for terminal authenticity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
