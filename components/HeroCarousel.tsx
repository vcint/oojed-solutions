"use client";
import { LazyMotionDiv, LazyAnimatePresence } from "./LazyMotion";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    img: "/2.webp",
    colorA: "#E6EEF8",
    colorB: "#F8FAFC",
    alt: "OOJED team installing a solar water heating system in Maharashtra",
  },
  {
    id: 2,
    img: "/10.webp",
    colorA: "#F3F7FA",
    colorB: "#EEF6F3",
    alt: "Commissioned rooftop solar panels maintained by OOJED engineers",
  },
  {
    id: 3,
    img: "/13.webp",
    colorA: "#F7F9FC",
    colorB: "#F0F6FB",
    alt: "LED street lighting project delivered by OOJED",
  },
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
              alt={s.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{ backgroundColor: s.colorA }}
              {...(i === 0 ? { width: 1600, height: 900 } : {})}
            />
          </LazyMotionDiv>
        ))}
      </LazyAnimatePresence>
      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/35 mix-blend-normal" />
    </div>
  );
}
