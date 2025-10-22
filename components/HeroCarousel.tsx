"use client";
import { LazyMotionDiv, LazyAnimatePresence } from "./LazyMotion";
import { useEffect, useState } from "react";

const slides = [
  { id: 1, img: "/2.webp", colorA: "#E6EEF8", colorB: "#F8FAFC" },
  { id: 2, img: "/10.webp", colorA: "#F3F7FA", colorB: "#EEF6F3" },
  { id: 3, img: "/13.webp", colorA: "#F7F9FC", colorB: "#F0F6FB" }
];

export default function HeroCarousel({ interval = 6000 }: { interval?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [interval]);

  // preload images to avoid white flashes between slides
  useEffect(() => {
    slides.forEach(s => {
      const img = new window.Image();
      img.src = s.img;
    });
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* crossfade: show enter and exit simultaneously to prevent a blank white gap */}
      <LazyAnimatePresence>
        {slides.map((s, i) => i === index && (
          <LazyMotionDiv
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${s.colorA}, ${s.colorB})` }}
          >
            <img
              src={s.img}
              alt={`slide-${s.id}`}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              style={{ backgroundColor: s.colorA }}
            />
          </LazyMotionDiv>
        ))}
      </LazyAnimatePresence>
      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/35 mix-blend-normal" />
    </div>
  );
}
