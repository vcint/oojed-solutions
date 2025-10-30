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
    <div ref={root} className="product-gallery">
      <div className="relative">
        {/* main image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={alt || ''} className="w-full h-64 md:h-80 object-cover rounded-md" />

        {/* arrows */}
        {images.length > 1 && (
          <>
            <button aria-label="Previous image" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
              ‹
            </button>
            <button aria-label="Next image" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button key={img} type="button" onClick={() => setIndex(i)} className={`p-0 rounded-md ${i === index ? 'ring-2 ring-blue-500' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${alt || ''} ${i + 1}`} className="w-24 h-16 object-cover rounded" />
              </button>
            ))}
          </div>

          {/* indicator dots for quick overview */}
          <div className="ml-auto flex items-center gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} aria-label={`Go to image ${i + 1}`} className={`w-2 h-2 rounded-full ${i === index ? 'bg-blue-600' : 'bg-slate-300'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
