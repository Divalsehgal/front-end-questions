import { useEffect, useState } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1000',
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(new Array(IMAGES.length).fill(false));

  // % wraps around: after the last slide comes the first one.
  const next = () => setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval); // runs on unmount and before the effect runs again
  }, [isPaused]);

  const handleImageLoad = (index: number) => {
    setLoaded((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-muted"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Move the whole row of slides with transform, not `left`. */}
        <div className="flex h-full transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {IMAGES.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0">
              {!loaded[i] && <p className="absolute inset-0 grid place-items-center text-text-muted">Loading…</p>}
              <img src={src} alt={`Slide ${i + 1}`} onLoad={() => handleImageLoad(i)} className="size-full object-cover" />
            </div>
          ))}
        </div>

        <button onClick={prev} aria-label="Previous slide" className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-2xl text-white">
          ‹
        </button>
        <button onClick={next} aria-label="Next slide" className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-2xl text-white">
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {IMAGES.map((src, i) => (
          <button
            key={src}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full ${i === currentIndex ? 'w-8 bg-brand-500' : 'w-2 bg-text-muted/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
