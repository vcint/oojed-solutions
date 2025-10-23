"use client";
import data from "@/data/site.json";
import { LazyMotionDiv } from "./LazyMotion";
import { useState, useEffect } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import { FiBox as Product, FiSun as Solar, FiZap as Lightbulb } from "react-icons/fi";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const normalizeSrc = (raw?: string) => {
    if (!raw) return '/oojed-logo.png';
    try {
      // decode any existing percent-encoding (handles both %20 and %2520 cases)
      const decoded = decodeURIComponent(String(raw));
      const encoded = encodeURI(decoded);
      if (/^https?:\/\//i.test(encoded)) return encoded;
      return encoded.startsWith("/") ? encoded : `/${encoded}`;
    } catch (e) {
      // fallback: attempt a safe encode of the raw string
      try {
        const s = String(raw);
        const encoded = encodeURI(s);
        return encoded.startsWith("/") ? encoded : `/${encoded}`;
      } catch (err) {
        return '/oojed-logo.png';
      }
    }
  };
  const imgs = ['/solar-water-heater.webp','/2.webp','/solar-water-pump.webp', '/solar-street-light.webp','/poles.webp','/spare-parts.jpeg','/spare-2.jpeg','/spare-3.jpeg'];
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    // fetch preview image for each category (non-blocking)
    data.categories.forEach(async (cat: any) => {
      const slug = (cat && cat.slug) ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : `products/${String(cat.name).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase()}`;
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
          // normalize the API returned URL before saving
          const first = normalizeSrc(json.images[0]);
          // cache preview for 10 minutes
          try { setCache(cacheKey, first, 1000 * 60 * 10); } catch (e) {}
          setPreviews((p) => ({ ...p, [cat.name]: first }));
        }
      } catch (e) {
        // ignore
      }
    });
  }, []);
  const openProduct = (cat: any, i: number) => {
    const start = i % imgs.length;
    const fallback = (Array.isArray((cat as any).images) && (cat as any).images.length > 0)
      ? (cat as any).images
      : [imgs[start], imgs[(start + 1) % imgs.length], imgs[(start + 2) % imgs.length]];

    const slugFromName = `products/${cat.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase()}`;
    const slug = (cat && cat.slug) ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : slugFromName;

    // Immediately open modal with fallback images for a fast UI response
    const fb = fallback.map((r: string) => normalizeSrc(r));
    setSelected({ ...cat, images: fb, image: fb[0] });
    setOpen(true);

    // Fetch real images in the background and update the modal when ready
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
          if (json.debug) console.debug("/api/images debug:", json.debug);
          try { setCache(cacheKey, rawImages, 1000 * 60 * 60); } catch (e) {}
          setSelected((prev) => prev && prev.name === cat.name ? { ...cat, images, image: images[0] } : { ...cat, images, image: images[0] });
        }
      } catch (e) {
        // ignore background fetch errors; fallback UI already provided
      }
    })();
  };
  return (
    <section id="products" className="section">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold">Products</h2>
  {/* <p className="text-slate-600 mt-2">Solar, LED lighting, pumps and poles & masts.</p> */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data.categories.map((cat, i) => (
            <LazyMotionDiv
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: i * .05 }}
              viewport={{ once: true }}
              className="card p-0 overflow-hidden hover-raise"
            >
              <div className="w-full h-40 relative cursor-pointer" onClick={() => openProduct(cat, i)}>
                {/** Use category-specific preview image when available */}
                <img
                  src={(() => {
                    const s = (Array.isArray((cat as any).images) && (cat as any).images.length > 0)
                        ? (cat as any).images[0]
                        : (previews[cat.name] ? previews[cat.name] : '/oojed-logo.png');
                    return normalizeSrc(s);
                  })()}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/oojed-logo.png'; }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent product-overlay" />
                <div className="absolute left-4 bottom-4 text-white flex items-center gap-3">
                  <div className="icon-bg p-2 rounded-md">
                    {i % 3 === 0 ? <Solar className="w-5 h-5 text-white" /> : i % 3 === 1 ? <Lightbulb className="w-5 h-5 text-white" /> : <Product className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{cat.name}</div>
                  </div>
                </div>
              </div>
                <div className="p-4">
                {/* quick look: prefer `long` truncated, fallback to `desc` */}
                {cat.long ? (
                  <p className="muted line-clamp-3 font-semibold">{cat.long}</p>
                ) : (
                  cat.desc && <p className="muted line-clamp-2 font-semibold">{cat.desc}</p>
                )}
                {/* small tags: show up to 2 representative items */}
                {cat.items && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.items.slice(0,2).map((it: string) => (
                      <span key={it} className="badge text-xs">{it}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4 relative z-20">
                  <button onClick={() => openProduct(cat, i)} className="learn-more-btn w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-4 py-2 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 dark:bg-transparent dark:text-white dark:border-white/20">Learn more</button>
                </div>
              </div>
            </LazyMotionDiv>
          ))}
        </div>
      </div>
      <ProductModal open={open} onClose={() => setOpen(false)} product={selected} />
    </section>
  );
}
