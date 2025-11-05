"use client";
import data from "@/data/site.json";
import Link from "next/link";
import Button from "./Button";
import { LazyMotionDiv } from "./LazyMotion";
import { useState, useEffect } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import { FiBox as Product, FiSun as Solar, FiZap as Lightbulb } from "react-icons/fi";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const normalizeSrc = (raw?: string) => {
    if (!raw) return "/oojed-logo.png";
    try {
      const decoded = decodeURIComponent(String(raw));
      const encoded = encodeURI(decoded);
      if (/^https?:\/\//i.test(encoded)) return encoded;
      return encoded.startsWith("/") ? encoded : `/${encoded}`;
    } catch (e) {
      try {
        const encoded = encodeURI(String(raw));
        return encoded.startsWith("/") ? encoded : `/${encoded}`;
      } catch (err) {
        return "/oojed-logo.png";
      }
    }
  };

  const DEFAULT_CITY = "Pune";
  const fillCity = (text: any, city?: string) => {
    if (text == null) return text;
    const c = String(city || DEFAULT_CITY);
    try {
      return String(text).replace(/\{\{\s*city\s*\}\}/gi, c);
    } catch (e) {
      return text;
    }
  };

  const fallbackImages = [
    "/solar-water-heater.webp",
    "/2.webp",
    "/solar-water-pump.webp",
    "/solar-street-light.webp",
    "/poles.webp",
    "/spare-parts.jpeg",
  ];

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    data.categories.forEach(async (cat: any) => {
      const slug = (cat && cat.slug)
        ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}`
        : `products/${String(cat.name).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()}`;
      const cacheKey = `images:${slug}:preview`;
      const cached = getCache(cacheKey);
      if (cached) {
        setPreviews((p) => ({ ...p, [cat.name]: cached }));
        return;
      }
      try {
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.images) && json.images.length > 0) {
          const first = normalizeSrc(json.images[0]);
          try {
            setCache(cacheKey, first, 1000 * 60 * 10);
          } catch (e) {
            /* ignore */
          }
          setPreviews((p) => ({ ...p, [cat.name]: first }));
        }
      } catch (e) {
        /* ignore */
      }
    });
  }, []);

  const openProduct = (cat: any, i: number) => {
    const fallback = Array.isArray((cat as any).images) && (cat as any).images.length > 0
      ? (cat as any).images
      : Array.from({ length: 3 }, (_, idx) => fallbackImages[(i + idx) % fallbackImages.length]);

    const slugFromName = `products/${cat.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()}`;
    const slug = (cat && cat.slug) ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : slugFromName;

    const fb = fallback.map((r: string) => normalizeSrc(r));
    const filled = {
      ...cat,
      long: fillCity(cat.long),
      desc: fillCity(cat.desc),
      items: Array.isArray(cat.items) ? cat.items.map((it: any) => fillCity(it)) : cat.items,
      highlights: Array.isArray(cat.highlights) ? cat.highlights.map((h: any) => fillCity(h)) : cat.highlights,
      faqs: Array.isArray(cat.faqs) ? cat.faqs.map((f: any) => ({ q: fillCity(f.q), a: fillCity(f.a) })) : cat.faqs,
    };

    setSelected({ ...filled, images: fb, image: fb[0] });
    setOpen(true);

    (async () => {
      try {
        const cacheKey = `images:${slug}`;
        const cached = getCache(cacheKey);
        if (cached) {
          const images = (cached as string[]).map((r: string) => normalizeSrc(r));
          setSelected((prev) => prev && prev.name === cat.name ? { ...cat, images, image: images[0] } : { ...cat, images, image: images[0] });
          return;
        }
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          const rawImages = Array.isArray(json.images) && json.images.length > 0 ? json.images : fallback;
          const images = rawImages.map((r: string) => normalizeSrc(r));
          try {
            setCache(cacheKey, rawImages, 1000 * 60 * 60);
          } catch (e) {
            /* ignore */
          }
          setSelected((prev) => prev && prev.name === cat.name ? { ...cat, images, image: images[0] } : { ...cat, images, image: images[0] });
        }
      } catch (e) {
        /* ignore */
      }
    })();
  };

  return (
    <section id="products" className="section bg-white dark:bg-slate-900">
      <div className="container">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d]/10 text-[#102a6d] dark:bg-[#102a6d]/20 dark:text-[#9cc0ff] px-4 py-1 text-xs font-semibold uppercase tracking-widest">
            <Solar className="w-3.5 h-3.5" />
            Product portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">Solar and lighting systems tailored to every site</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore our core categories. Open a quick preview to see representative imagery, then dive into detailed pages for deeper specs and FAQs.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.categories.map((cat, i) => {
            const slug = String(((cat && (cat as any).slug) ? (cat as any).slug : cat.name) || "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9-]/g, "")
              .toLowerCase();

            const description = cat.long || cat.desc || "";
            const previewImage = (() => {
              const s = (Array.isArray((cat as any).images) && (cat as any).images.length > 0)
                ? (cat as any).images[0]
                : (previews[cat.name] ? previews[cat.name] : "/oojed-logo.png");
              return normalizeSrc(s);
            })();

            const icon = i % 3 === 0 ? <Solar className="w-4 h-4" /> : i % 3 === 1 ? <Lightbulb className="w-4 h-4" /> : <Product className="w-4 h-4" />;

            return (
              <LazyMotionDiv
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
                className="group"
              >
                <div className="relative h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => openProduct(cat, i)}>
                    <img
                      src={previewImage}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/oojed-logo.png"; }}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <div className="absolute left-4 bottom-4 flex items-center gap-3 text-white text-sm font-semibold">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5">
                        {icon}
                        {cat.name}
                      </span>
                      <button type="button" className="text-xs uppercase tracking-widest text-white/80 hover:text-white" onClick={() => openProduct(cat, i)}>
                        Preview
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{description}</p>
                    </div>

                    {Array.isArray(cat.items) && cat.items.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cat.items.slice(0, 2).map((it: string) => (
                          <span key={it} className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-200">
                            {it}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <Button href={`/products/${slug}`} variant="outline" className="rounded-full px-4 py-2 text-sm">
                        Learn more
                      </Button>
                      <button
                        type="button"
                        onClick={() => openProduct(cat, i)}
                        className="text-xs font-semibold uppercase tracking-widest text-[#102a6d] hover:text-[#0c3a99]"
                      >
                        Quick view
                      </button>
                    </div>
                  </div>
                </div>
              </LazyMotionDiv>
            );
          })}
        </div>
      </div>
      <ProductModal open={open} onClose={() => setOpen(false)} product={selected} />
    </section>
  );
}
