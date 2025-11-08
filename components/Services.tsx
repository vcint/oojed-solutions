"use client";
import data from "@/data/site.json";
import { LazyMotionDiv } from "./LazyMotion";
import { useState, useEffect, useMemo } from "react";
import { getCache, setCache } from "@/lib/cache";
import ProductModal from "./ProductModal";
import Button from "./Button";
import Link from "next/link";
import {
  FiTool as Tool,
  FiMapPin as Feas,
  FiRefreshCw as Repair,
  FiClock as AMC,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

const CITY_COOKIE = "oojed_city";
const DEFAULT_CITY_SLUG = "pune";

const toSlug = (value?: string | null) => {
  if (!value) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const extractCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export default function Services() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [citySlug, setCitySlug] = useState<string>(DEFAULT_CITY_SLUG);

  const normalizeSrc = (raw?: string) => {
    if (!raw) return "";
    try {
      const decoded = decodeURIComponent(String(raw));
      const enc = encodeURI(decoded);
      return enc.startsWith("/") ? enc : `/${enc}`;
    } catch (e) {
      try {
        const s = String(raw);
        const enc = encodeURI(s);
        return enc.startsWith("/") ? enc : `/${enc}`;
      } catch (err) {
        return String(raw || "");
      }
    }
  };

  const services = useMemo(
    () =>
      Array.isArray((data as any).services) && (data as any).services.length > 0
        ? (data as any).services
        : [
            { name: "Installation", slug: "installation", short: "On-site professional installation and commissioning" },
            { name: "Feasibility", slug: "feasibility", short: "Site surveys, yield estimates and feasibility reports" },
            { name: "Repair & Service", slug: "repair", short: "Corrective repairs and spare parts supply" },
            { name: "Annual Maintenance (AMC)", slug: "amc", short: "Preventive maintenance and service contracts" },
          ],
    [],
  );

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      let slug = toSlug(window.localStorage.getItem("oojed_city_override"));
      if (!slug) slug = toSlug(window.localStorage.getItem("oojed_detected_city"));
      if (!slug) slug = toSlug(extractCookie(CITY_COOKIE));
      if (!slug) slug = DEFAULT_CITY_SLUG;
      setCitySlug(slug);
    }

    services.forEach(async (svc) => {
      const slug = `services/${svc.slug}`;
      const cacheKey = `images:${slug}:preview`;
      const cached = getCache(cacheKey);
      if (cached) {
        setPreviews((p) => ({ ...p, [svc.name]: normalizeSrc(cached) }));
        return;
      }
      try {
        const res = await fetch(`/api/images?dir=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.debug) console.debug(`/api/images for ${slug}:`, json.debug);
        if (Array.isArray(json.images) && json.images.length > 0) {
          const first = normalizeSrc(json.images[0]);
          try {
            setCache(cacheKey, first, 1000 * 60 * 10);
          } catch (err) {
            // ignore cache errors
          }
          setPreviews((p) => ({ ...p, [svc.name]: first }));
        }
      } catch (err) {
        // ignore fetch failures
      }
    });
  }, [services]);

  const openService = (svc: any, i: number) => {
    const slug = `services/${svc.slug}`;
    const fallback = ["/oojed-logo.png"];

    const fb = fallback.map((r: string) => normalizeSrc(r));
    setSelected({ ...svc, images: fb, image: fb[0] });
    setOpen(true);

    (async () => {
      try {
        const cacheKey = `images:${slug}`;
        const cached = getCache(cacheKey);
        if (cached) {
          const images = (cached as string[]).map((r: string) => normalizeSrc(r));
          setSelected((prev) =>
            prev && prev.slug === svc.slug ? { ...svc, images, image: images[0] } : { ...svc, images, image: images[0] }
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
            prev && prev.slug === svc.slug ? { ...svc, images, image: images[0] } : { ...svc, images, image: images[0] }
          );
        }
      } catch (err) {
        // ignore fetch failures
      }
    })();
  };

  const serviceHighlights = [
    { title: "Avg. delivery cycle", description: "18-35 days from survey to commissioning for most residential and SME projects." },
    { title: "Dedicated PMO", description: "Daily progress snapshots, escalation ladder and direct coordination with site stakeholders." },
    { title: "Certified teams", description: "BIS and MNRE compliant workmanship with safety tool-box talks before every work shift." },
  ];

  const marketSignals = [
    {
      label: "Segments served",
      ours: "Housing societies, MSME plants, hospitality, public lighting and government infrastructure",
      baseline: "Residential-first focus for most national brands",
    },
    {
      label: "Supply chain control",
      ours: "OOJED stocks BIS-certified systems from leading OEMs and fabricates critical spares/BOS in-house to stabilise lead times",
      baseline: "Aggregator sourcing with partner OEMs; schedules depend on third-party dispatch",
    },
    {
      label: "Lifecycle ownership",
      ours: "Single team for installation, spares, remote diagnostics and AMC with SLA dashboards",
      baseline: "AMC and after-sales routed via partner networks or external service marketplaces",
    },
  ];

  const serviceProcess = [
    { step: "01", title: "Discovery and ROI modelling", description: "Energy audit, load profiling, subsidy assessment and DISCOM paperwork checklist." },
    { step: "02", title: "Engineering and procurement", description: "Layout, structure vetting, string design, bill of materials and factory-tested assemblies." },
    { step: "03", title: "Execution and commissioning", description: "Site mobilisation, QHSE supervision, utility coordination and performance acceptance tests." },
    { step: "04", title: "Operations and AMC", description: "Remote dashboards, quarterly health checks, spares management and SLA compliance." },
  ];

  const iconForService = (slug: string) => {
    if (slug === "installation") return <Tool className="w-4 h-4" />;
    if (slug === "feasibility") return <Feas className="w-4 h-4" />;
    if (slug === "repair") return <Repair className="w-4 h-4" />;
    return <AMC className="w-4 h-4" />;
  };

  return (
    <section id="services" className="section relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#071a40]/10 via-white/40 to-transparent dark:from-[#071a40]/35 dark:via-transparent pointer-events-none" />
      <div className="absolute -left-24 bottom-0 w-72 h-72 bg-[#e6f0ff] dark:bg-[#17345f]/40 blur-3xl rounded-full pointer-events-none" />
      <div className="container relative">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#102a6d] text-white px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
              <Tool className="w-3.5 h-3.5" />
              Service delivery stack
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-black  leading-tight">
              Distributor-backed services that benchmark with leading national EPCs and extend to industrial loads
            </h2>
            <p className="mt-4 text-base md:text-lg text-black leading-relaxed">
              From lighting retrofits to multi-megawatt rooftop plants, our service teams operate on predictable playbooks.
              We offer the polished homeowner journey customers expect from national leaders while pairing distributor reach with in-house spare parts and BOS fabrication for industrial safety and public infrastructure projects.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {serviceHighlights.map((item) => (
                <div
                  key={item.title}
                  className="glass-panel px-5 py-6 text-slate-700 dark:text-white/85"
                >
                  <div className="text-xs font-semibold text-[#102a6d] dark:text-[#9cbcff] uppercase tracking-[0.2em]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 md:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">
              <FiTrendingUp className="w-3.5 h-3.5" />
              Where we stand in the market
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Customers choose OOJED when they want national-brand transparency with distributor-grade availability, faster lead times and SLA backed AMC for complex sites.
            </p>
            <div className="mt-6 space-y-4">
              {marketSignals.map((row) => (
                <div key={row.label} className="glass-panel p-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">{row.label}</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="glass-panel p-3">
                      <div className="text-xs font-semibold text-[#102a6d] dark:text-[#9cbcff] uppercase tracking-[0.25em]">OOJED</div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-200 leading-relaxed">{row.ours}</p>
                    </div>
                    <div className="glass-panel p-3">
                      <div className="text-xs font-semibold text-slate-500 dark:text-[#87a8d8] uppercase tracking-[0.25em]">Market baseline</div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-200 leading-relaxed">{row.baseline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((svc, i) => {
            const icon = iconForService(svc.slug);
            const teaser = (() => {
              const text = svc.long || svc.short || svc.desc || "";
              const max = 190;
              return text.length > max ? `${text.slice(0, max).trim()}...` : text;
            })();

            const previewSrc = normalizeSrc(previews[svc.name] || `/services/${svc.slug}/1.jpg`);

            return (
              <LazyMotionDiv
                key={svc.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                viewport={{ once: true, margin: "-40px" }}
                className="group"
              >
                <Link
                  href={`/services/${svc.slug}?city=${encodeURIComponent(citySlug)}`}
                  className="glass-panel flex h-full flex-col overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
                >
                  <div
                    className="relative h-52 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      openService(svc, i);
                    }}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={previewSrc}
                      alt={svc.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/oojed-logo.png";
                      }}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 text-white">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] dark:bg-white/10 dark:text-white">
                        {icon}
                        {svc.name}
                      </span>
                      <button
                        type="button"
                        className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openService(svc, i);
                        }}
                      >
                        Preview
                      </button>
                    </div>
                    <div className="absolute left-0 right-0 bottom-3 px-4 text-xs text-white/80">
                      Tap for quick-look gallery
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-[0.3em]">
                      Service snapshot
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed flex-1">{teaser}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                      <Button
                        href={`/services/${svc.slug}?city=${encodeURIComponent(citySlug)}`}
                        variant="surface"
                        className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      >
                        View service
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openService(svc, i);
                        }}
                        className="text-xs font-semibold uppercase tracking-[0.25em] text-[#102a6d] hover:text-[#0c3a99] dark:text-[#9cbcff]"
                      >
                        Quick look
                      </button>
                    </div>
                  </div>
                </Link>
              </LazyMotionDiv>
            );
          })}
        </div>

        <div className="mt-16 glass-panel p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#102a6d] dark:text-[#9cbcff]">
                <FiActivity className="w-3.5 h-3.5" />
                Delivery process
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">
                A structured four-step program for dependable solar and lighting outcomes
              </h3>
              <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Every scope blends disciplined EPC delivery with distributor-backed procurement. Clients see daily updates, milestone checklists and punch lists mirroring best-in-class homeowner journeys, adapted for industrial and public mandates.
              </p>
            </div>
            <Button href="/contact" variant="gradient" className="px-6 py-3 shadow-lg">
              Book a walkthrough
            </Button>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceProcess.map((step) => (
              <div key={step.step} className="glass-panel p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  {step.step}
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{step.title}</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProductModal open={open} onClose={() => setOpen(false)} product={selected} />
    </section>
  );
}
