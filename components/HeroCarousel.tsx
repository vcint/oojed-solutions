"use client";
import { LazyMotionDiv, LazyAnimatePresence } from "./LazyMotion";
import { useEffect, useRef, useState } from "react";

type HeroCarouselVariant = "background" | "panel";

type HeroCarouselProps = {
  interval?: number;
  variant?: HeroCarouselVariant;
  className?: string;
};

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

export default function HeroCarousel({
  interval = 6000,
  variant = "background",
  className = "",
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const hasMultipleSlides = slides.length > 1;

  const goToNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // advance slides unless user prefers reduced motion
  useEffect(() => {
    if (slides.length <= 1) return;
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => window.clearInterval(timer);
  }, [interval]);

  // preload images to avoid flashes during transitions
  useEffect(() => {
    if (typeof window === "undefined") return;
    slides.forEach((s) => {
      const img = new window.Image();
      img.src = s.img;
    });
  }, []);

  const baseClass =
    variant === "background"
      ? "absolute inset-0 -z-10 overflow-hidden"
      : "relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl";

  const containerClass = `${baseClass} ${className}`.trim();

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleSlides) return;
    touchStartX.current = event.touches[0].clientX;
    touchCurrentX.current = null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleSlides) return;
    touchCurrentX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleSlides) return;
    if (touchStartX.current == null || touchCurrentX.current == null) return;
    const delta = touchStartX.current - touchCurrentX.current;
    const threshold = 40;
    if (Math.abs(delta) < threshold) return;
    if (delta > 0) {
      goToNext();
    } else {
      goToPrev();
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <div
      className={containerClass}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-live="polite"
    >
      <LazyAnimatePresence>
        {slides.map(
          (s, i) =>
            i === index && (
              <LazyMotionDiv
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={variant === "background" ? "absolute inset-0" : "absolute inset-0"}
                style={{ background: `linear-gradient(180deg, ${s.colorA}, ${s.colorB})` }}
              >
                <img
                  src={s.img}
                  alt={s.alt}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  style={{ backgroundColor: s.colorA }}
                  {...(i === 0 ? { width: 1600, height: 900 } : {})}
                />
              </LazyMotionDiv>
            ),
        )}
      </LazyAnimatePresence>

      {variant === "background" ? (
        <div className="absolute inset-0 bg-[#031024]/55 mix-blend-normal" aria-hidden="true" />
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020b1f]/85 via-transparent to-transparent" />
      )}

      {variant === "panel" && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${idx === index ? "bg-white dark:bg-[#5ea8ff]" : "bg-white/45 hover:bg-white/80 dark:bg-[#5ea8ff]/30 dark:hover:bg-[#5ea8ff]/60"}`}
              aria-label={`Show slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
