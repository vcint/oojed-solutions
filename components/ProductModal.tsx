"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Product = {
  name: string;
  desc?: string;
  image?: string;
  items?: string[];
  highlights?: string[];
  specs?: string[];
};

export default function ProductModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}) {
  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !modalRef.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus the close button first
    setTimeout(() => {
      closeBtnRef.current?.focus();
      setVisible(true);
    }, 0);
  setActiveImageIdx(0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      setVisible(false);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const imageList = (product as any)?.images as string[] | undefined;
  const mainImage = imageList && imageList.length > 0
    ? imageList[Math.max(0, Math.min(activeImageIdx, imageList.length - 1))]
    : product?.image || "/product-1.svg";
  const imageCount = (imageList && imageList.length) || 1;

  // helper to scroll to a slide index
  const scrollToIndex = (idx: number) => {
    const gallery = galleryRef.current;
    const slide = slideRefs.current[idx];
    if (gallery && slide) {
      gallery.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };
  // fallback scroll when slide refs are not yet available (e.g., first render)
  // we approximate by gallery width * index which aligns with snap layout
  const scrollToIndexFallback = (idx: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const left = Math.max(0, Math.min(idx * gallery.clientWidth, gallery.scrollWidth - gallery.clientWidth));
    gallery.scrollTo({ left, behavior: "smooth" });
  };

  const onPrev = () => {
    const target = Math.max(0, activeImageIdx - 1);
    setActiveImageIdx(target);
    if (slideRefs.current[target]) scrollToIndex(target); else scrollToIndexFallback(target);
  };
  const onNext = () => {
  const maxIdx = Math.max(0, imageCount - 1);
    const target = Math.min(maxIdx, activeImageIdx + 1);
    setActiveImageIdx(target);
    if (slideRefs.current[target]) scrollToIndex(target); else scrollToIndexFallback(target);
  };

  // pointer drag handlers for desktop mouse drag
  const onPointerDown = (e: React.PointerEvent) => {
    const g = galleryRef.current;
    if (!g) return;
    g.setPointerCapture(e.pointerId);
    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    dragState.current.scrollLeft = g.scrollLeft;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.active) return;
    const g = galleryRef.current;
    if (!g) return;
    const dx = e.clientX - dragState.current.startX;
    g.scrollLeft = dragState.current.scrollLeft - dx;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const g = galleryRef.current;
    if (g) g.releasePointerCapture?.(e.pointerId);
    dragState.current.active = false;
    // snap to nearest slide
    const slides = slideRefs.current;
    if (!g || !slides.length) return;
    const center = g.scrollLeft + g.clientWidth / 2;
    let found = 0;
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (!s) continue;
      const left = s.offsetLeft;
      const right = left + s.clientWidth;
      if (center >= left && center <= right) {
        found = i;
        break;
      }
    }
    if (slideRefs.current[found]) scrollToIndex(found); else scrollToIndexFallback(found);
  };

  // IntersectionObserver to detect visible slide
  useEffect(() => {
    const g = galleryRef.current;
    if (!g) return;
    const slides = Array.from(g.querySelectorAll<HTMLDivElement>(".gallery-slide"));
    slideRefs.current = slides;
    const observer = new IntersectionObserver((entries) => {
      // pick entry with largest intersectionRatio
      let bestIdx = -1;
      let bestRatio = 0;
      entries.forEach((ent) => {
        const idx = slides.indexOf(ent.target as HTMLDivElement);
        if (ent.intersectionRatio > bestRatio) {
          bestRatio = ent.intersectionRatio;
          bestIdx = idx;
        }
      });
      if (bestIdx >= 0 && bestIdx !== activeImageIdx) {
        setActiveImageIdx(bestIdx);
      }
    }, { root: g, threshold: [0.25, 0.5, 0.75, 1] });
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [open, product]);

  // keep slideRefs updated on resize
  useEffect(() => {
    const handler = () => {
      // ensure we stay centered on active index after resize
      scrollToIndex(activeImageIdx);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [activeImageIdx]);

  // end of helpers

  // Don't attempt to render the modal content when it's closed or when no product
  // is supplied. Hooks above must always run to keep React's hooks order stable,
  // so the early return is placed after all hooks.
  if (!open || !product) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      aria-hidden={false}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={product.desc ? descId : undefined}
        className={`relative z-10 w-full max-w-6xl rounded-lg bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-1 scale-95"
        } max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <h3 id={titleId} className="truncate text-2xl font-semibold text-slate-900">
              {product.name}
            </h3>
            {product.desc && (
              <p id={descId} className="mt-1 text-sm text-slate-600">
                {product.desc}
              </p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:pr-2">
              <div className="w-full overflow-hidden rounded-md bg-slate-50 relative">
                {/* arrows for desktop */}
                {imageList && imageList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={onPrev}
                      className="hidden md:inline-flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={onNext}
                      className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    <div className="absolute right-4 top-4 z-20 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                      {Math.min(activeImageIdx + 1, imageCount)} / {imageCount}
                    </div>
                  </>
                )}
                {/* scrollable snap gallery */}
                <div
                  ref={galleryRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="gallery relative overflow-x-auto scroll-smooth touch-pan-x snap-x snap-mandatory"
                  style={{ scrollbarWidth: "thin", maxHeight: "48vh" }}
                >
                  <div className="flex gap-0 items-center">
                    {(imageList && imageList.length > 0 ? imageList : [product.image || "/product-1.svg"]).map((src, idx) => (
                      <div
                        key={src + idx}
                        ref={(el) => { slideRefs.current[idx] = el; }}
                        className="gallery-slide snap-start flex-shrink-0 min-w-full p-2 flex items-center justify-center"
                      >
                        <div className="w-full flex items-center justify-center">
                          <img src={src} alt={`${product.name} ${idx + 1}`} className="max-h-[44vh] w-auto h-auto object-contain rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* thumbnails */}
              {imageList && imageList.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {imageList.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIdx(idx);
                        scrollToIndex(idx);
                      }}
                      className={`h-16 w-20 overflow-hidden rounded border ${idx === activeImageIdx ? "ring-2 ring-blue-600 border-transparent" : "border-slate-200"}`}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:pl-2">
              {product.items && product.items.length > 0 && (
                <div>
                  <div className="font-medium text-slate-900">Items</div>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {product.items.map((it: string) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.highlights && product.highlights.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-slate-900">Highlights</div>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {product.highlights.map((h: string) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specs && product.specs.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-slate-900">Technical Specs</div>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {product.specs.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <a href="#contact" className="btn-primary">
                  Request a Quote / Enquiry
                </a>
              </div>

              {/* JSON-LD for Product */}
              <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    name: product.name,
                    description: product.desc || "",
                    image: (product as any)?.images && (product as any).images.length > 0
                      ? (product as any).images.map((p: string) => (typeof window !== "undefined" ? window.location.origin + p : p))
                      : product.image
                      ? typeof window !== "undefined"
                        ? window.location.origin + product.image
                        : product.image
                      : undefined,
                    additionalProperty: (product.highlights || []).map((h: string) => ({
                      "@type": "PropertyValue",
                      name: "highlight",
                      value: h,
                    })),
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render in a portal to avoid stacking context issues
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }
  return modal;
}
