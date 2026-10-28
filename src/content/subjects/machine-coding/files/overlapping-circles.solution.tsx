import React, { useState, useRef } from "react";
import { RefreshCcw } from "lucide-react";

interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
}

const MIN_RADIUS = 5;

const overlaps = (a: Circle, b: Circle) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < a.radius + b.radius;
};

export default function OverlappingCircles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [draft, setDraft] = useState<Circle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPoint = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getPoint(e);
    setDraft({ id: crypto.randomUUID(), x, y, radius: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draft) return;
    const { x, y } = getPoint(e);
    setDraft({ ...draft, radius: Math.hypot(x - draft.x, y - draft.y) });
  };

  const commit = () => {
    if (draft && draft.radius > MIN_RADIUS) {
      setCircles((prev) => [...prev, draft]);
    }
    setDraft(null);
  };

  // Derived at render: every circle (including the one being drawn) that
  // overlaps at least one other circle.
  const all = draft ? [...circles, draft] : circles;
  const overlapping = new Set<string>();
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (overlaps(all[i], all[j])) {
        overlapping.add(all[i].id);
        overlapping.add(all[j].id);
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Overlapping circles</h2>
          <p className="text-sm text-text-muted">
            Click and drag to draw a circle. Circles that overlap another turn{" "}
            <span className="font-semibold text-red-500">red</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCircles([])}
          className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          <RefreshCcw className="size-4 text-brand-500" />
          Clear
        </button>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={commit}
        onMouseLeave={commit}
        className="relative h-[450px] cursor-crosshair overflow-hidden rounded-2xl border-2 border-dashed border-border-subtle bg-surface select-none"
      >
        {all.map((circle) => (
          <div
            key={circle.id}
            className={
              "pointer-events-none absolute rounded-full border-2 border-white/70 " +
              (overlapping.has(circle.id) ? "bg-red-500/70" : "bg-blue-500/70") +
              (circle === draft ? " opacity-60" : "")
            }
            style={{
              width: circle.radius * 2,
              height: circle.radius * 2,
              left: circle.x - circle.radius,
              top: circle.y - circle.radius,
            }}
          />
        ))}

        {all.length === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-text-muted">
            Click and drag to draw
          </p>
        )}
      </div>
    </div>
  );
}
