"use client";
import data from "@/data/site.json";
import Link from "next/link";
import Button from "./Button";
import { LazyMotionDiv } from "./LazyMotion";
import { useState, useEffect } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import { FiBox as Product, FiSun as Solar, FiZap as Lightbulb } from "react-icons/fi";

const DEFAULT_CITY = "Pune";

const fallbackImages = [
  "/solar-water-heater.webp",
  "/2.webp",
  "/solar-water-pump.webp",
  "/solar-street-light.webp",
  "/poles.webp",
  "/spare-parts.jpeg",
];

const productHighlights = [
  { title: "Curated OEM portfolio", description: "Solar water heaters, PV kits, pumps and lighting sourced from BIS-certified manufacturers with transparent pricing." },
  { title: "Spare parts & BOS fabrication", description: "Critical solar water heater spares and BOS components are built in-house to keep replacements fast and reliable." },
  { title: "Lifecycle coordination", description: "Design, installation, monitoring, spares and AMC coordinated by a single distributor and service team." },
];

const portfolioSignals = [
  {
    label: "OOJED vs national EPCs",
    ours: "Residential, industrial and civic SKUs with direct OEM relationships plus in-house BOS/spare-part capability.",
    baseline: "Residential rooftop focus with third-party hardware sourcing.",
  },
  {
    label: "Beyond rooftop solar",
    ours: "Solar heaters, hybrid power packs, pumps, LED street and high-mast lighting with smart controls.",
    baseline: "Limited lighting or hot water options offered by aggregator EPC peers.",
  },
];

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

const fillCity = (text: any, city?: string) => {
  if (text == null) return text;
  const c = String(city || DEFAULT_CITY);
  try {
    return String(text).replace(/\{\{\s*city\s*\}\}/gi, c);
  } catch (e) {
    return text;
  }
};

const iconForIndex = (index: number) => {
  if (index % 3 === 0) return <Solar className="w-4 h-4" />;
  if (index % 3 === 1) return <Lightbulb className="w-4 h-4" />;
  return <Product className="w-4 h-4" />;
};

export default function Products() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    data.categories.forEach(async (cat: any) => {
      const slug =
        cat && cat.slug
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
          } catch (err) {
            // ignore cache errors
          }
          setPreviews((p) => ({ ...p, [cat.name]: first }));
        }
      } catch (err) {
        // ignore fetch errors
      }
    });
  }, []);

  const openProduct = (cat: any, i: number) => {
    const fallback = Array.isArray((cat as any).images) && (cat as any).images.length > 0
      ? (cat as any).images
      : Array.from({ length: 3 }, (_, idx) => fallbackImages[(i + idx) % fallbackImages.length]);

    const slugFromName = `products/${cat.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()}`;
    const slug = cat && cat.slug ? `products/${String(cat.slug).replace(/^\/+|\/+$/g, "")}` : slugFromName;

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
          setSelected((prev) =>
            prev && prev.name === cat.name ? { ...cat, images, image: images[0] } : { ...cat, images, image: images[0] }
          );
          return;
        }
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          const rawImages = Array.isArray(json.images) && json.images.length > 0 ? json.images : fallback;
          const images = rawImages.map((r: string) => normalizeSrc(r));
          try {
            setCache(cacheKey, rawImages, 1000 * 60 * 60);
          } catch (err) {
            // ignore cache errors
          }
          setSelected((prev) =>
            prev && prev.name === cat.name ? { ...cat, images, image: images[0] } : { ...cat, images, image: images[0] }
          );
        }
      } catch (err) {
        // ignore fetch failures
      }
    })();
  };

  return (
    <section id="products" className="section relative overflow-hidden bg-transparent dark:bg-gradient-to-bl from-black via-slate-900 to-slate-600">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#f2f6ff] via-white/50 to-transparent dark:from-[#0b1938]/35 pointer-events-none" />
      <div className="absolute -right-36 top-12 w-72 h-72 bg-[#e3f1ff] dark:bg-[#163056]/45 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-80 h-80 bg-[#f5faff] dark:bg-[#10243f]/50 blur-3xl rounded-full pointer-events-none" />

      <div className="container relative dark:bg-slate-400">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d] text-white px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
              <Solar className="w-3.5 h-3.5" />
              Product portfolio
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold !text-black leading-tight">
              Product catalogue engineered beyond standard rooftop playbooks
            </h2>
            <p className="mt-4 text-base md:text-lg !text-black  leading-relaxed">
              We pair homeowner-style communication with distributor reach. Discover ready-to-deploy solutions for housing societies, institutions, industries and civic agencies, all delivered with the polish of top national solar brands.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {productHighlights.map((item) => (
                <div
                  key={item.title}
                  className="glass-panel px-5 py-6 text-slate-700 dark:text-white/85"
                >
                  <div className="text-xs font-semibold text-[#9fcfff] dark:text-[#7bf4ff] uppercase tracking-[0.25em]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-white leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className=" p-6 md:p-7 glass-panel shadow-none dark:bg-white/5 dark:border-white/15">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              How we compare
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-white leading-relaxed">
              Rooftop-focused players optimise the homeowner journey. OOJED extends the same UX while combining deep OEM partnerships with in-house BOS and spare-part fabrication to support heavier commercial loads.
            </p>
            <div className="mt-6 space-y-4">
              {portfolioSignals.map((row) => (
                <div key={row.label} className="glass-panel p-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">{row.label}</div>
                  <div className="grid gap-3">
                    <div className="glass-panel p-3">
                      <div className="text-xs font-semibold text-[#acd2fb] uppercase tracking-[0.25em]">OOJED</div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-white leading-relaxed">{row.ours}</p>
                    </div>
                    <div className="glass-panel p-3">
                      <div className="text-xs font-semibold text-slate-500 dark:text-[#dfe9ff] uppercase tracking-[0.25em]">Market baseline</div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-200 leading-relaxed">{row.baseline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.categories.map((cat: any, i: number) => {
            const slug = String((cat && cat.slug ? cat.slug : cat.name) || "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9-]/g, "")
              .toLowerCase();

            const descriptionSource = cat.long || cat.desc || "";
            const description = fillCity(descriptionSource, DEFAULT_CITY);
            const previewImage = (() => {
              if (Array.isArray((cat as any).images) && (cat as any).images.length > 0) {
                return normalizeSrc((cat as any).images[0]);
              }
              if (previews[cat.name]) return normalizeSrc(previews[cat.name]);
              return "/oojed-logo.png";
            })();

            const icon = iconForIndex(i);

            const teaser = (() => {
              const text = description || "";
              const max = 210;
              return text.length > max ? `${text.slice(0, max).trim()}...` : text;
            })();

            return (
              <LazyMotionDiv
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
                className="group"
              >
                <div className="glass-panel flex h-full flex-col overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                  <div
                    className="relative h-52 cursor-pointer"
                    onClick={() => openProduct(cat, i)}
                  >
                    <img
                      src={previewImage}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/oojed-logo.png";
                      }}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 text-white">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] dark:bg-white/10 dark:text-white">
                        {icon}
                        {cat.name}
                      </span>
                      <button
                        type="button"
                      
                        className="text-xs font-semibold uppercase tracking-[0.25em] text-black/80 bg-slate-400 hover:text-white"
                        onClick={() => openProduct(cat, i)}
                      >
                        Preview
                      </button>
                    </div>
                    <div className="absolute left-0 right-0 bottom-3 px-4 text-xs text-white/80">
                      Tap for quick-look gallery
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-[#87a8d8] uppercase tracking-[0.3em]">
                    Category overview
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed flex-1">{teaser}</p>

                  {Array.isArray(cat.items) && cat.items.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cat.items.slice(0, 3).map((it: string) => (
                          <span
                            key={it}
                            className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-200"
                          >
                            {fillCity(it, DEFAULT_CITY)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-200/80 dark:border-white/15 flex items-center justify-between gap-3">
                      <Button
                        href={`/products/${slug}`}
                        variant="surface"
                        className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      >
                        Learn more
                      </Button>
                      <button
                        type="button"
                        onClick={() => openProduct(cat, i)}
                        className="text-xs font-semibold uppercase tracking-[0.25em] text-[#102a6d] hover:text-[#0c3a99] dark:text-[#9cbcff]"
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
