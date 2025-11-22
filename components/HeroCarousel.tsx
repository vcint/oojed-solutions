"use client";
import { LazyMotionDiv, LazyAnimatePresence } from "./LazyMotion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    alt: "OOJED team installing solar water heating system on rooftop in Pune, Maharashtra",
  },
  {
    id: 2,
    img: "/10.webp",
    colorA: "#F3F7FA",
    colorB: "#EEF6F3",
    alt: "Rooftop solar panel installation by OOJED engineers in Maharashtra with net-metering setup",
  },
  {
    id: 3,
    img: "/13.webp",
    colorA: "#F7F9FC",
    colorB: "#F0F6FB",
    alt: "LED street lighting project installed by OOJED for municipal roads in Maharashtra",
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
    // next/image handles preloading, but we can keep this for smoother transitions if needed
    // actually next/image with priority is better
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
                className={variant === "background" ? "absolute inset-0" : "absolute inset-0 rounded-[28px] overflow-hidden"}
                style={{ background: `linear-gradient(180deg, ${s.colorA}, ${s.colorB})` }}
              >
                <Image
                  src={s.img}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  style={{ backgroundColor: s.colorA }}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${s.colorA}"/></svg>`
                  ).toString('base64')}`}
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
