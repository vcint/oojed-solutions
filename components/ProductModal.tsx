"use client";
import { useEffect, useId, useRef, useState } from "react";
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

  if (!open || !product) return null;

  const imageList = (product as any)?.images as string[] | undefined;
  const mainImage = imageList && imageList.length > 0 ? imageList[Math.max(0, Math.min(activeImageIdx, imageList.length - 1))] : product.image || "/product-1.svg";

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
        className={`relative z-10 w-full max-w-3xl rounded-lg bg-white shadow-xl ring-1 ring-black/5 transition-transform transition-opacity duration-200 ${
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
              <div className="w-full overflow-hidden rounded-md bg-slate-50">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-auto object-cover md:object-contain aspect-[4/3]"
                />
              </div>
              {imageList && imageList.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {imageList.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`h-16 w-20 overflow-hidden rounded border ${
                        idx === activeImageIdx ? "ring-2 ring-blue-600 border-transparent" : "border-slate-200"
                      }`}
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
                    image: product.image
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
