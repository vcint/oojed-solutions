"use client";
import { useState, useEffect, useRef } from 'react';

type Props = { images: string[]; alt?: string };

export default function ImageGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!images || images.length < 2) return;
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images]);

  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div ref={root} className="space-y-3">
      <div className="glass-panel relative overflow-hidden p-3">
        {/* main image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={alt || ''} className="h-64 w-full rounded-lg object-cover md:h-80" />

        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-lg shadow-black/20 hover:bg-white dark:bg-[#0b1e3b]/80 dark:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              aria-label="Next image"
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-lg shadow-black/20 hover:bg-white dark:bg-[#0b1e3b]/80 dark:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute right-5 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-slate-700 shadow-sm dark:bg-[#0b1e3b]/85 dark:text-[#9bd1ff]">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                className={`glass-panel h-16 w-20 overflow-hidden rounded-lg border ${i === index ? 'ring-2 ring-[#0f3fa6] dark:ring-[#5ea8ff]' : 'border-transparent'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${alt || ''} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1 pr-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${i === index ? 'bg-[#0f3fa6] dark:bg-[#5ea8ff]' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
