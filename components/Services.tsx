"use client";
import data from "@/data/site.json";
import { LazyMotionDiv } from "./LazyMotion";
import { useState, useEffect } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import Button from './Button';
import { FiTool as Tool, FiMapPin as Feas, FiRefreshCw as Repair, FiClock as AMC } from "react-icons/fi";

const CITY_COOKIE = 'oojed_city';
const DEFAULT_CITY_SLUG = 'pune';

const toSlug = (value?: string | null) => {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const extractCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export default function Services() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [citySlug, setCitySlug] = useState<string>(DEFAULT_CITY_SLUG);

  const normalizeSrc = (raw?: string) => {
    if (!raw) return '';
    try {
      // decode any percent-encoded input (handles %20 and %2520 cases), then encode once
      const decoded = decodeURIComponent(String(raw));
      const enc = encodeURI(decoded);
      return enc.startsWith('/') ? enc : `/${enc}`;
    } catch (e) {
      try {
        const s = String(raw);
        const enc = encodeURI(s);
        return enc.startsWith('/') ? enc : `/${enc}`;
      } catch (err) {
        return String(raw || '');
      }
    }
  };

  const services = Array.isArray((data as any).services) && (data as any).services.length > 0
    ? (data as any).services
    : [
      { name: 'Installation', slug: 'installation', short: 'On-site professional installation and commissioning' },
      { name: 'Feasibility', slug: 'feasibility', short: 'Site surveys, yield estimates and feasibility reports' },
      { name: 'Repair & Service', slug: 'repair', short: 'Corrective repairs and spare parts supply' },
      { name: 'Annual Maintenance (AMC)', slug: 'amc', short: 'Preventive maintenance and service contracts' },
    ];

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let slug = toSlug(window.localStorage.getItem('oojed_city_override'));
      if (!slug) slug = toSlug(window.localStorage.getItem('oojed_detected_city'));
      if (!slug) slug = toSlug(extractCookie(CITY_COOKIE));
      if (!slug) slug = DEFAULT_CITY_SLUG;
      setCitySlug(slug);
    }
    services.forEach(async (s) => {
      const slug = `services/${s.slug}`;
      const cacheKey = `images:${slug}:preview`;
      const cached = getCache(cacheKey);
      if (cached) {
        setPreviews((p) => ({ ...p, [s.name]: normalizeSrc(cached) }));
        return;
      }
      try {
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.debug) console.debug(`/api/images for ${slug}:`, json.debug);
        if (Array.isArray(json.images) && json.images.length > 0) {
          const first = normalizeSrc(json.images[0]);
          try { setCache(cacheKey, first, 1000 * 60 * 10); } catch (e) {}
          setPreviews((p) => ({ ...p, [s.name]: first }));
        }
      } catch (e) {
        // ignore
      }
    });
  }, []);

  const openService = async (svc: any, i: number) => {
    const slug = `services/${svc.slug}`;
    const fallback = ['/oojed-logo.png'];

    // open modal immediately with placeholder
    const fb = fallback.map((r: string) => normalizeSrc(r));
    setSelected({ ...svc, images: fb, image: fb[0] });
    setOpen(true);

    // fetch images in background and update modal when available
    (async () => {
      try {
        const cacheKey = `images:${slug}`;
        const cached = getCache(cacheKey);
        if (cached) {
          const images = (cached as string[]).map((r: string) => normalizeSrc(r));
          setSelected((prev) => prev && prev.slug === svc.slug ? { ...svc, images, image: images[0] } : { ...svc, images, image: images[0] });
          return;
        }

        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          const rawImages = Array.isArray(json.images) && json.images.length > 0 ? json.images : fallback;
          const images = rawImages.map((r: string) => normalizeSrc(r));
          try { setCache(cacheKey, rawImages, 1000 * 60 * 60); } catch (e) {}
          setSelected((prev) => prev && prev.slug === svc.slug ? { ...svc, images, image: images[0] } : { ...svc, images, image: images[0] });
        }
      } catch (e) {
        // ignore
      }
    })();
  };

  const serviceHighlights = [
    { title: 'Avg. delivery cycle', description: '18–35 days from survey to commissioning for most residential & SME projects.' },
    { title: 'Dedicated PMO', description: 'Daily progress snapshots, escalation ladder and direct coordination with site stakeholders.' },
    { title: 'Certified teams', description: 'BIS/MNRE-compliant workmanship with safety tool-box talks before every work shift.' },
  ];

  return (
    <section id="services" className="section bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#102a6d]/10 via-white to-transparent pointer-events-none" />
      <div className="container relative">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d] text-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-widest">
              <Tool className="w-3.5 h-3.5" />
              Delivery services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">Implementation, maintenance and advisory under one roof</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              From lighting retrofits to multi-megawatt rooftop plants, our service teams operate on predictable playbooks. Explore modular services below, preview real project imagery in a quick-look modal, and jump into city-localised detail pages when you&apos;re ready.
            </p>
          </div>
          <div className="space-y-3 min-w-[18rem]">
            {serviceHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 shadow-sm px-4 py-4">
                <div className="text-sm font-semibold text-[#102a6d] dark:text-[#9cc0ff]">{item.title}</div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((svc, i) => {
            const icon =
              svc.slug === 'installation' ? <Tool className="w-4 h-4" /> :
              svc.slug === 'feasibility' ? <Feas className="w-4 h-4" /> :
              svc.slug === 'repair' ? <Repair className="w-4 h-4" /> :
              <AMC className="w-4 h-4" />;

            const teaser = (() => {
              const text = svc.long || svc.short || svc.desc || '';
              const max = 185;
              return text.length > max ? `${text.slice(0, max).trim()}…` : text;
            })();

            return (
              <LazyMotionDiv
                key={svc.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                viewport={{ once: true, margin: '-40px' }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#102a6d]/15 via-white to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => openService(svc, i)}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={normalizeSrc(previews[svc.name] || `/services/${svc.slug}/1.jpg`)}
                      alt={svc.name}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/oojed-logo.png'; }}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                    <div className="absolute left-5 bottom-5 flex items-center gap-3 text-white">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                        {icon}
                        {svc.name}
                      </span>
                      <button type="button" className="text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white" onClick={() => openService(svc, i)}>
                        Preview
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{svc.name}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 flex-1">{teaser}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-4">
                      <Button href={`/services/${svc.slug}?city=${encodeURIComponent(citySlug)}`} variant="outline" className="rounded-full px-4 py-2 text-sm">
                        View service
                      </Button>
                      <button
                        type="button"
                        onClick={() => openService(svc, i)}
                        className="text-xs font-semibold uppercase tracking-widest text-[#102a6d] hover:text-[#0c3a99]"
                      >
                        Quick look
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
