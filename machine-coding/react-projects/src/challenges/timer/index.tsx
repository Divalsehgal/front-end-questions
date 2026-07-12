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
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
            <TimerIcon className="size-7 text-brand-500" />
            CHRONO CORE
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Precision instrumentation for temporal events.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5">
          <Zap className="size-3.5 fill-brand-500/20 text-brand-500" />
          <span className="text-tiny font-black tracking-widest text-brand-500 uppercase">10ms Precision</span>
        </div>
      </div>

      {/* Main Display */}
      <div className="group relative">
        <div className="space-y-4 rounded-[3rem] border-8 border-muted bg-surface p-12 text-center shadow-hard">
          <div className="flex items-center justify-center font-mono font-black tracking-tighter tabular-nums">
            <div className="flex flex-col items-center">
              <span className="text-6xl leading-none text-text-main sm:text-8xl">{t.min}</span>
              <span className="text-tiny mt-2 font-black tracking-widest text-text-muted/40 uppercase">Min</span>
            </div>
            <span className="mx-2 mb-6 animate-pulse text-4xl text-brand-500 sm:text-6xl">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl leading-none text-text-main sm:text-8xl">{t.sec}</span>
              <span className="text-tiny mt-2 font-black tracking-widest text-text-muted/40 uppercase">Sec</span>
            </div>
            <span className="mx-1 mb-4 text-2xl text-brand-500/50 sm:text-4xl">.</span>
            <div className="flex flex-col items-center">
              <span className="mb-2 text-3xl leading-none text-brand-500 sm:text-5xl">{t.ms}</span>
              <span className="text-[8px] tracking-widest text-text-muted/40 uppercase">Ms</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
          <button
            onClick={resetTimer}
            className="border-subtle hover:text-error-500 group rounded-2xl border-2 bg-surface p-4 text-text-muted shadow-soft transition-all hover:bg-muted"
          >
            <RotateCcw className="size-6 transition-transform duration-500 group-hover:rotate-180" />
          </button>
          
          <button
            onClick={isActive ? pauseTimer : startTimer}
            className={cn(
              "group flex size-20 items-center justify-center rounded-3xl shadow-hard transition-all active:scale-95",
              isActive 
                ? "border-4 border-brand-500 bg-surface text-brand-500 shadow-brand-500/10" 
                : "border-4 border-brand-400 bg-brand-500 text-text-inverted shadow-brand-500/30 hover:bg-brand-600"
            )}
          >
            {isActive ? <Pause className="size-10 fill-current" /> : <Play className="ml-1 size-10 fill-current" />}
          </button>

          <button
            onClick={recordLap}
            disabled={!isActive && time === 0}
            className="border-subtle group rounded-2xl border-2 bg-surface p-4 text-text-muted shadow-soft transition-all hover:bg-muted hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Flag className="size-6 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Laps Section */}
      <div className="space-y-4 pt-12">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-tiny flex items-center gap-2 font-black tracking-widest text-text-muted/40 uppercase">
             <History className="size-4" />
             Laps History
           </h3>
           {laps.length > 0 && <span className="text-tiny font-black tracking-widest text-brand-500 uppercase">{laps.length} Splits</span>}
        </div>
        
        <div className="border-subtle max-h-[300px] overflow-hidden overflow-y-auto rounded-3xl border bg-muted">
          {laps.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium tracking-widest text-text-muted/40 uppercase italic">
              Press the flag icon to record temporal splits.
            </div>
          ) : (
            <div className="divide-subtle divide-y">
              {laps.map((lapTime, idx) => {
                const lt = formatTime(lapTime);
                return (
                  <div key={idx} className="animate-in slide-in-from-top-2 flex items-center justify-between p-4 transition-colors duration-300 hover:bg-surface">
                    <span className="text-tiny w-12 font-black tracking-widest text-text-muted/40 uppercase">#{laps.length - idx}</span>
                    <span className="flex-1 pr-8 text-right font-mono font-black text-text-main">
                       {lt.min}:{lt.sec}<span className="text-brand-500/50">.{lt.ms}</span>
                    </span>
                    <div className="text-tiny flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-2 py-1 font-black text-brand-500">
                       <Clock className="size-3" />
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
