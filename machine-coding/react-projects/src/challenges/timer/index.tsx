import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../utils/cn";
import { 
  Timer as TimerIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  History,
  Clock,
  Zap
} from "lucide-react";

export const hint = "Advanced precision stopwatch with lap tracking and split-time logic";

export default function Timer() {
  const [time, setTime] = useState(0); // in milliseconds
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    startTimeRef.current = Date.now() - time;
    timerRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  };

  const pauseTimer = () => {
    if (!isActive) return;
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    pauseTimer();
    setTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (!isActive && time === 0) return;
    setLaps(prev => [time, ...prev]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return {
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: centiseconds.toString().padStart(2, '0')
    };
  };

  const t = formatTime(time);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
            <TimerIcon className="w-7 h-7 text-brand-500" />
            CHRONO CORE
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Precision instrumentation for temporal events.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/20">
          <Zap className="w-3.5 h-3.5 text-brand-500 fill-brand-500/20" />
          <span className="text-tiny font-black uppercase tracking-widest text-brand-500">10ms Precision</span>
        </div>
      </div>

      {/* Main Display */}
      <div className="relative group">
        <div className="bg-surface rounded-[3rem] border-8 border-muted shadow-hard p-12 text-center space-y-4">
          <div className="flex items-center justify-center font-mono font-black tabular-nums tracking-tighter">
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-8xl text-text-main leading-none">{t.min}</span>
              <span className="text-tiny font-black uppercase text-text-muted/40 mt-2 tracking-widest">Min</span>
            </div>
            <span className="text-4xl sm:text-6xl text-brand-500 mx-2 animate-pulse mb-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-8xl text-text-main leading-none">{t.sec}</span>
              <span className="text-tiny font-black uppercase text-text-muted/40 mt-2 tracking-widest">Sec</span>
            </div>
            <span className="text-2xl sm:text-4xl text-brand-500/50 mx-1 mb-4">.</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-5xl text-brand-500 leading-none mb-2">{t.ms}</span>
              <span className="text-[8px] uppercase text-text-muted/40 tracking-widest">Ms</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-4 bg-surface border-2 border-subtle rounded-2xl shadow-soft hover:bg-muted transition-all text-text-muted hover:text-error-500 group"
          >
            <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          <button
            onClick={isActive ? pauseTimer : startTimer}
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-hard active:scale-95 group",
              isActive 
                ? "bg-surface text-brand-500 border-4 border-brand-500 shadow-brand-500/10" 
                : "bg-brand-500 text-text-inverted shadow-brand-500/30 hover:bg-brand-600 border-4 border-brand-400"
            )}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button
            onClick={recordLap}
            disabled={!isActive && time === 0}
            className="p-4 bg-surface border-2 border-subtle rounded-2xl shadow-soft hover:bg-muted transition-all text-text-muted hover:text-brand-500 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <Flag className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Laps Section */}
      <div className="pt-12 space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-tiny font-black uppercase tracking-widest text-text-muted/40 flex items-center gap-2">
             <History className="w-4 h-4" />
             Laps History
           </h3>
           {laps.length > 0 && <span className="text-tiny font-black uppercase tracking-widest text-brand-500">{laps.length} Splits</span>}
        </div>
        
        <div className="bg-muted border border-subtle rounded-3xl overflow-hidden max-h-[300px] overflow-y-auto">
          {laps.length === 0 ? (
            <div className="p-12 text-center text-text-muted/40 italic text-sm font-medium uppercase tracking-widest">
              Press the flag icon to record temporal splits.
            </div>
          ) : (
            <div className="divide-y divide-subtle">
              {laps.map((lapTime, idx) => {
                const lt = formatTime(lapTime);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-surface transition-colors animate-in slide-in-from-top-2 duration-300">
                    <span className="text-tiny font-black text-text-muted/40 uppercase tracking-widest w-12">#{laps.length - idx}</span>
                    <span className="flex-1 font-mono font-black text-text-main text-right pr-8">
                       {lt.min}:{lt.sec}<span className="text-brand-500/50">.{lt.ms}</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-tiny font-black text-brand-500 bg-brand-500/10 px-2 py-1 rounded-lg">
                       <Clock className="w-3 h-3" />
                       SPLIT
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
