"use client";
import data from "@/data/site.json";
import Link from "next/link";
import Button from "./Button";
import { LazyMotionDiv, usePrefersReducedMotion } from "./LazyMotion";
import { useState, useEffect } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import Image from "next/image";
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
  { title: "Curated OEM portfolio", description: "Solar water heaters, PV kits, pumps and lighting from BIS-certified manufacturers." },
  { title: "Spare parts & BOS fabrication", description: "Critical spares and BOS components built in-house for fast replacements." },
  { title: "Lifecycle coordination", description: "Design, installation, monitoring, and AMC by a single team." },
];

const portfolioSignals = [
  {
    label: "OOJED vs national EPCs",
    ours: "Residential, industrial and civic SKUs with direct OEM relationships and in-house BOS.",
    baseline: "Residential rooftop focus with third-party hardware sourcing.",
  },
  {
    label: "Beyond rooftop solar",
    ours: "Heaters, hybrid power packs, pumps, LED street and high-mast lighting with smart controls.",
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
  const prefersReducedMotion = usePrefersReducedMotion();

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
    <section id="products" className="section relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
              <Solar className="w-3.5 h-3.5" />
              Product portfolio
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Everything you need for clean energy, not just rooftop solar
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              From hot water to street lights, we supply reliable systems for Maharashtra homes, businesses, and civic projects. Built to handle local conditions and backed by real support.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {productHighlights.map((item) => (
                <div
                  key={item.title}
                  className="glass px-5 py-6 rounded-xl"
                >
                  <div className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 md:p-7 rounded-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              How we compare
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We combine warm, personal service with trusted OEM hardware and the ability to build critical parts in-house when you need them fast.
            </p>
            <div className="mt-6 space-y-4">
              {portfolioSignals.map((row) => (
                <div key={row.label} className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{row.label}</div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">OOJED</div>
                      <p className="mt-2 text-sm text-foreground leading-relaxed">{row.ours}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.25em]">Market baseline</div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{row.baseline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            const cardMotionProps = prefersReducedMotion
              ? { initial: { opacity: 1, y: 0 } }
              : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 0.3, delay: i * 0.03 },
                viewport: { once: true, margin: "-40px" },
              };

            return (
              <LazyMotionDiv
                key={cat.name}
                {...cardMotionProps}
                className="h-full"
              >
                <div className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-xl">
                  <div
                    className="relative h-52 cursor-pointer overflow-hidden"
                    onClick={() => openProduct(cat, i)}
                  >
                    <Image
                      src={previewImage}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      onError={(e) => {
                        // Fallback logic handled by src or ignored
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 text-white">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-sm">
                        {icon}
                        {cat.name}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-sm transition hover:bg-slate-100"
                        onClick={() => openProduct(cat, i)}
                        aria-label={`Preview ${cat.name} gallery`}
                      >
                        Preview
                      </button>
                    </div>
                    <div className="absolute left-0 right-0 bottom-3 px-4 text-xs text-white/80">
                      Tap for quick-look gallery
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                      Category overview
                    </div>
                    <p className="text-sm text-foreground leading-relaxed flex-1">{teaser}</p>

                    {Array.isArray(cat.items) && cat.items.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cat.items.slice(0, 3).map((it: string) => (
                          <span
                            key={it}
                            className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            {fillCity(it, DEFAULT_CITY)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
                      <Button
                        href={`/contact#quote-${slug}`}
                        variant="gradient"
                        className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-lg"
                        title={`Get a quote for ${cat.name}`}
                        aria-label={`Get a quote for ${cat.name}`}
                      >
                        Get Quote
                      </Button>
                      <Button
                        href={`/products/${slug}`}
                        variant="surface"
                        className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                        title={`View details for ${cat.name}`}
                        aria-label={`Learn more about ${cat.name}`}
                      >
                        Learn more
                      </Button>
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
