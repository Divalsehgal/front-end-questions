import React, { useState, useEffect, useCallback } from "react";
import { cn } from "../../../utils/cn";
import { 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Loader2, 
  Maximize2,
  Play,
  Pause
} from "lucide-react";

export const hint = "Fluid image carousel with auto-play, touch swipes, and loading states";

const IMAGES = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000",
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState<boolean[]>(new Array(IMAGES.length).fill(true));

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  const handleImageLoad = (index: number) => {
    setLoading(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase">
            <ImageIcon className="size-7 text-brand-500" />
            VISTA CAROUSEL
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Immersive visual storytelling explorer.
          </p>
        </div>
        <div className="border-subtle flex items-center gap-2 rounded-2xl border bg-muted p-1">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-xl p-2.5 transition-all hover:bg-surface"
          >
            {isPlaying ? <Pause className="size-4 text-brand-500" /> : <Play className="size-4 text-brand-500" />}
          </button>
        </div>
      </div>

      <div className="group relative">
        {/* Main Display */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border-4 border-surface bg-muted shadow-hard">
          {IMAGES.map((src, idx) => (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transform transition-all duration-700 ease-in-out",
                idx === currentIndex ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-20 scale-105 opacity-0"
              )}
            >
              {loading[idx] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-12 animate-spin text-brand-500" />
                </div>
              )}
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                onLoad={() => handleImageLoad(idx)}
                className={cn(
                  "size-full object-cover transition-opacity duration-1000",
                  loading[idx] ? "opacity-0" : "opacity-100"
                )}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-12 text-text-inverted">
                <span className="text-tiny mb-2 block font-black tracking-[0.2em] uppercase opacity-80">Nature Collection v4</span>
                <h3 className="text-3xl font-black tracking-tight uppercase">Scenic Landscape {idx + 1}</h3>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-text-inverted backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 active:scale-90"
            >
              <ChevronLeft className="size-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-text-inverted backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 active:scale-90"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          <button className="absolute top-6 right-6 rounded-xl border border-white/10 bg-white/10 p-3 text-text-inverted opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-white/20">
            <Maximize2 className="size-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="border-subtle absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-3 rounded-full border bg-muted p-2">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all",
                currentIndex === idx ? "w-8 bg-brand-500" : "w-2 bg-text-muted/20 hover:bg-text-muted/40"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-12 md:grid-cols-4">
        {IMAGES.map((src, idx) => (
          <button
            key={src}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "aspect-square overflow-hidden rounded-2xl border-2 transition-all hover:brightness-110",
              currentIndex === idx ? "scale-105 border-brand-500 p-1" : "border-subtle p-0"
            )}
          >
            <img src={src} className="size-full rounded-xl object-cover" alt={`Thumb ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
