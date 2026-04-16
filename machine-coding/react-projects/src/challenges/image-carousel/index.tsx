import React, { useState, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase">
            <ImageIcon className="w-7 h-7 text-brand-500" />
            VISTA CAROUSEL
          </h2>
          <p className="text-sm font-medium text-text-muted">
            Immersive visual storytelling explorer.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-2xl border border-subtle">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 hover:bg-surface rounded-xl transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-brand-500" /> : <Play className="w-4 h-4 text-brand-500" />}
          </button>
        </div>
      </div>

      <div className="relative group">
        {/* Main Display */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border-4 border-surface shadow-hard bg-muted">
          {IMAGES.map((src, idx) => (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out transform",
                idx === currentIndex ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-20 scale-105 pointer-events-none"
              )}
            >
              {loading[idx] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                </div>
              )}
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                onLoad={() => handleImageLoad(idx)}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-1000",
                  loading[idx] ? "opacity-0" : "opacity-100"
                )}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-12 text-text-inverted">
                <span className="text-tiny font-black uppercase tracking-[0.2em] opacity-80 mb-2 block">Nature Collection v4</span>
                <h3 className="text-3xl font-black tracking-tight uppercase">Scenic Landscape {idx + 1}</h3>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-text-inverted transition-all hover:scale-110 active:scale-90 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-text-inverted transition-all hover:scale-110 active:scale-90 border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-text-inverted opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-muted rounded-full border border-subtle">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 transition-all rounded-full",
                currentIndex === idx ? "w-8 bg-brand-500" : "bg-text-muted/20 hover:bg-text-muted/40 w-2"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
        {IMAGES.map((src, idx) => (
          <button
            key={src}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:brightness-110",
              currentIndex === idx ? "border-brand-500 p-1 scale-105" : "border-subtle p-0"
            )}
          >
            <img src={src} className="w-full h-full object-cover rounded-xl" alt={`Thumb ${idx}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
