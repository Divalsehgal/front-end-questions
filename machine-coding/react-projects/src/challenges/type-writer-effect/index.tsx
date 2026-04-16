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
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Terminal className="w-7 h-7 text-brand-500" />
            VIRTUAL TERMINAL
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Simulating high-speed code generation sequences.
          </p>
        </div>
        <button 
          onClick={reset}
          className="p-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-2xl transition-all shadow-sm active:scale-95 group"
        >
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="bg-surface-950 rounded-[2rem] border-4 border-surface-800 shadow-2xl overflow-hidden relative group">
        {/* Terminal Header */}
        <div className="bg-surface-900 px-6 py-3 border-b border-surface-800 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">
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
          <div className="p-4 bg-surface-900/80 backdrop-blur-md rounded-2xl border border-surface-800 flex flex-col gap-4">
             <div className="space-y-2">
               <div className="flex justify-between items-center text-[10px] font-black text-surface-500 uppercase tracking-widest">
                 <span>Speed</span>
                 <span className="text-brand-400">{speed}ms</span>
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
                 "flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 isTyping ? "bg-red-500/10 text-red-500" : "bg-brand-500 text-white"
               )}
             >
               {isTyping ? <Settings2 className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
               {isTyping ? "Pause" : "Resume"}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/20 rounded-3xl flex gap-4">
          <div className="p-3 bg-brand-100 dark:bg-brand-500/10 rounded-2xl text-brand-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-brand-900 dark:text-brand-300 uppercase tracking-widest">Stream Engine</h4>
            <p className="text-xs text-brand-800/60 dark:text-brand-400/60 leading-relaxed font-medium">Uses a high-precision timeout loop to simulate character-by-character processing.</p>
          </div>
        </div>
        <div className="p-5 bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-transparent rounded-3xl flex gap-4">
          <div className="p-3 bg-white dark:bg-surface-700 rounded-2xl text-gray-500 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Monospace Core</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Rendered with fixed-width typography and glowing shadow effects for terminal authenticity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
