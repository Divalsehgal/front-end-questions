import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../../utils/cn";
import { MousePointer2, RefreshCcw, Info, MousePointerClick } from "lucide-react";

export const hint = "Interactive canvas for creating circles with dynamic overlap detection";

interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export default function OverlappingCircles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentCircle, setCurrentCircle] = useState<Circle | null>(null);

  const checkOverlap = (c1: Circle, c2: Circle) => {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    
    const newCircle: Circle = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      radius: 0,
      color: "var(--color-brand-500)"
    };
    setCurrentCircle(newCircle);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentCircle || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - startPos.x;
    const dy = y - startPos.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    
    const updatedCircle = { ...currentCircle, radius };
    
    // Check overlap with existing circles
    const overlaps = circles.some(c => checkOverlap(updatedCircle, c));
    updatedCircle.color = overlaps ? "var(--color-error-500)" : "var(--color-brand-500)";
    
    setCurrentCircle(updatedCircle);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentCircle && currentCircle.radius > 5) {
      setCircles([...circles, currentCircle]);
    }
    setIsDrawing(false);
    setCurrentCircle(null);
  };

  const clearCanvas = () => {
    setCircles([]);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main">
            <MousePointerClick className="size-7 text-brand-500" />
            VIRTUAL CANVAS
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Click and drag to create circles. <span className="text-brand-500">Blue</span> = Clear, <span className="text-error-500">Red</span> = Overlap.
          </p>
        </div>
        <button 
          onClick={clearCanvas}
          className="border-subtle flex items-center gap-2 rounded-xl border bg-surface px-4 py-2 text-sm font-semibold shadow-soft transition-all hover:bg-muted"
        >
          <RefreshCcw className="size-4 text-brand-500" />
          Clear All
        </button>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="border-subtle group relative h-[500px] cursor-crosshair overflow-hidden rounded-3xl border-2 border-dashed bg-surface shadow-inner"
      >
        {/* Helper Grid Line (Optional aesthetics) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Existing Circles */}
        {circles.map(circle => <CircleItem key={circle.id} circle={circle} />)}

        {/* Currently Drawing Circle */}
        {currentCircle && <CircleItem circle={currentCircle} isPreview />}

        {circles.length === 0 && !currentCircle && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center space-y-2 text-text-muted/40">
            <div className="rounded-full bg-muted p-4">
              <MousePointer2 className="size-8" />
            </div>
            <p className="font-medium text-text-muted">Click and drag anywhere to begin</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex gap-3 rounded-2xl border border-brand-500/10 bg-brand-500/5 p-4">
          <Info className="size-5 shrink-0 text-brand-500" />
          <p className="text-tiny leading-relaxed font-medium text-text-main/70">Uses Euclidean distance formula to detect precise overlaps in real-time.</p>
        </div>
        <div className="flex gap-3 rounded-2xl border border-brand-500/10 bg-brand-500/5 p-4">
          <Info className="size-5 shrink-0 text-brand-500" />
          <p className="text-tiny leading-relaxed font-medium text-text-main/70">Collision logic updates the visual state before the mouse button is released.</p>
        </div>
        <div className="border-subtle flex gap-3 rounded-2xl border bg-muted p-4">
          <Info className="size-5 shrink-0 text-text-muted" />
          <p className="text-tiny leading-relaxed font-medium text-text-muted">Supports infinite circles with high performance canvas reconciliation.</p>
        </div>
      </div>
    </div>
  );
}

function CircleItem({ circle, isPreview }: { circle: Circle; isPreview?: boolean }) {
  return (
    <div
      className={cn(
        "absolute rounded-full border-2 transition-colors",
        isPreview ? "animate-pulse border-white/50 opacity-40" : "animate-in zoom-in border-text-inverted shadow-hard duration-300"
      )}
      style={{
        width: circle.radius * 2,
        height: circle.radius * 2,
        left: circle.x - circle.radius,
        top: circle.y - circle.radius,
        backgroundColor: circle.color,
      }}
    />
  );
}
