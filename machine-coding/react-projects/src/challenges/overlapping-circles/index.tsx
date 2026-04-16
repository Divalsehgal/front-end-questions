import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
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
      color: "#3b82f6" // Default blue-500
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
    updatedCircle.color = overlaps ? "#ef4444" : "#3b82f6"; // Red if overlaps, Blue otherwise
    
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
            <MousePointerClick className="w-7 h-7 text-brand-500" />
            VIRTUAL CANVAS
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Click and drag to create circles. <span className="text-brand-500">Blue</span> = Clear, <span className="text-red-500">Red</span> = Overlap.
          </p>
        </div>
        <button 
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-all font-semibold text-sm shadow-sm"
        >
          <RefreshCcw className="w-4 h-4 text-brand-500" />
          Clear All
        </button>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative h-[500px] bg-white dark:bg-surface-900 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-3xl shadow-inner overflow-hidden cursor-crosshair group"
      >
        {/* Helper Grid Line (Optional aesthetics) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Existing Circles */}
        {circles.map(circle => <CircleItem key={circle.id} circle={circle} />)}

        {/* Currently Drawing Circle */}
        {currentCircle && <CircleItem circle={currentCircle} isPreview />}

        {circles.length === 0 && !currentCircle && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-400 space-y-2 pointer-events-none">
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-full">
              <MousePointer2 className="w-8 h-8" />
            </div>
            <p className="font-medium">Click and drag anywhere to begin</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-900/70 dark:text-blue-300/70 leading-relaxed font-medium">Uses Euclidean distance formula to detect precise overlaps in real-time.</p>
        </div>
        <div className="p-4 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-900/20 flex gap-3">
          <Info className="w-5 h-5 text-brand-500 shrink-0" />
          <p className="text-xs text-brand-900/70 dark:text-brand-300/70 leading-relaxed font-medium">Collision logic updates the visual state before the mouse button is released.</p>
        </div>
        <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-700 flex gap-3">
          <Info className="w-5 h-5 text-gray-500 shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Supports infinite circles with high performance canvas reconciliation.</p>
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
        isPreview ? "opacity-40 animate-pulse border-white/50" : "animate-in zoom-in duration-300 border-white dark:border-surface-900 shadow-lg"
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
