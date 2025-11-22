"use client";
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

  useEffect(() => {
    if (!hasMultipleSlides || interval <= 0) return;
    const id = setInterval(goToNext, interval);
    return () => clearInterval(id);
  }, [hasMultipleSlides, interval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) return;
    const diff = touchStartX.current - touchCurrentX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-live="polite"
    >
      {/* Render all slides, only show current one */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={variant === "background" ? "absolute inset-0" : "absolute inset-0 rounded-[28px] overflow-hidden"}
          style={{
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: i === index ? 'auto' : 'none',
            background: `linear-gradient(180deg, ${slide.colorA}, ${slide.colorB})`,
          }}
        >
          <Image
            src={slide.img}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i < 2} // Eagerly load first 2 images
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ backgroundColor: slide.colorA }}
          />
        </div>
      ))}

      {/* Navigation arrows */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 flex items-center justify-center text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-md"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 dark:bg-black/60 flex items-center justify-center text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-md"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {hasMultipleSlides && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index
                  ? "w-6 bg-primary dark:bg-white"
                  : "w-2 bg-gray-400 dark:bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
