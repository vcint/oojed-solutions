"use client";
import { useEffect, useRef, useState } from "react";
import data from "@/data/site.json";
import HeroCarousel from "./HeroCarousel";
import Button from "./Button";
import { FiArrowRight, FiShield } from "react-icons/fi";

const heroStats = [
  { value: "2+ MW", label: "Solar & hybrid capacity delivered" },
  { value: "100+ sites", label: "Housing, industrial & public projects" },
  { value: "98% uptime", label: "Contracts serviced with scheduled AMC" },
];

const heroHighlights = [
  "Tier-one OEM partners for solar, lighting and pump hardware",
  "In-house fabrication for critical solar water heater spares and BOS kits",
  "Dedicated coordination desk for financing, subsidy and DISCOM paperwork",
];

const STORAGE_DETECTED = "oojed_detected_city";
const DEFAULT_CITY = "Pune";

const fillCity = (value?: string | null, city?: string | null) => {
  if (value == null) return value ?? "";
  const replacement = city || DEFAULT_CITY;
  try {
    return String(value)
      .replace(/\{\{\s*city\s*\}\}/gi, replacement)
      .replace(/\bPune,?\s*Maharashtra\b/gi, replacement)
      .replace(/\bPune\b/gi, replacement);
  } catch (error) {
    return value;
  }
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [city, setCity] = useState<string | null>(null);

  // hydrate detected city (if any) for personalised hero text
  useEffect(() => {
    try {
      const detected = window.localStorage.getItem(STORAGE_DETECTED);
      if (detected) setCity(detected);
    } catch (error) {
      // ignore storage access failures
    }
  }, []);

  // entry animations (best-effort)
  useEffect(() => {
    let ctx: any = null;
    let mounted = true;
    import("gsap")
      .then((gsapMod) => {
        if (!mounted) return;
        import("gsap/ScrollTrigger")
          .then(() => {
            try {
              gsapMod.gsap.registerPlugin((gsapMod as any).ScrollTrigger || (globalThis as any).ScrollTrigger);
            } catch (error) {
              // no-op
            }
            try {
              ctx = (gsapMod as any).gsap.context(() => {
                (gsapMod as any).gsap.fromTo(
                  ".hero-head",
                  { y: 12, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power2.out" },
                );
                (gsapMod as any).gsap.fromTo(
                  ".hero-sub",
                  { y: 18, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.9, delay: 0.25, ease: "power2.out" },
                );
                (gsapMod as any).gsap.fromTo(
                  ".hero-cta",
                  { y: 16, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.9, delay: 0.4, ease: "power2.out" },
                );
              }, ref);
            } catch (error) {
              // animation failure -> ignore
            }
          })
          .catch(() => {
            // ScrollTrigger optional
          });
      })
      .catch(() => {
        // gsap optional
      });
    return () => {
      mounted = false;
      if (ctx && ctx.revert) ctx.revert();
    };
  }, []);

  const headline = fillCity(data.hero.headline, city);
  const subtitle = fillCity(data.hero.sub, city);
  const ctaPrimaryLabel = fillCity(data.hero.ctaPrimary?.label, city) || "Get a Quote";
  const ctaSecondaryLabel = fillCity(data.hero.ctaSecondary?.label, city) || "Our Products";

  return (
    <section ref={ref} id="home" className="hero relative overflow-hidden pt-28 text-slate-900 dark:text-slate-100 md:pt-32">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.95),transparent_60%),radial-gradient(circle_at_82%_4%,rgba(219,233,255,0.65),transparent_50%),linear-gradient(135deg,#dbe3f6 0%,#f5f7ff 55%,#e7edf9 100%)] dark:hidden" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_20%_8%,rgba(83,139,255,0.25),transparent_58%),radial-gradient(circle_at_88%_18%,rgba(24,88,184,0.32),transparent_60%),linear-gradient(140deg,#02060f 0%,#041027 55%,#030918 100%)] dark:block" />
        <div className="absolute inset-0 bg-white/60 mix-blend-soft-light dark:bg-white/5" />
      </div>
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#75b1ff]/25 blur-3xl dark:bg-[#1f3f7a]/45" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-28 -right-20 h-64 w-64 rounded-full bg-[#4d8cf7]/30 blur-3xl dark:bg-[#112649]/55" aria-hidden="true" />

      <div className="container relative pb-20 pt-8 md:pb-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px] items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 shadow-lg shadow-blue-900/10 backdrop-blur-md dark:bg-white/15 dark:text-slate-100 dark:shadow-blue-900/30">
              <FiShield className="h-3.5 w-3.5" />
              Since 2014
            </span>

            <div className="space-y-6">
              <h1 className="hero-head text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">{headline}</h1>
              <p className="hero-sub max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg md:text-xl">
                {subtitle}
              </p>
            </div>

            <div className="hero-cta flex flex-wrap gap-3">
              <Button href={data.hero.ctaPrimary?.href || "/contact"} variant="gradient" className="px-6 py-3 md:px-8 md:py-3.5 shadow-lg shadow-blue-900/40">
                {ctaPrimaryLabel}
                <FiArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href={data.hero.ctaSecondary?.href || "/products"}
                variant="surface"
                className="px-6 py-3 md:px-8 md:py-3.5 border-slate-200/80 text-slate-900 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
              >
                {ctaSecondaryLabel}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass-panel px-5 py-6 bg-white/80 text-slate-900 dark:bg-slate-900/40 dark:text-white">
                  <div className="text-xl font-semibold sm:text-2xl">{stat.value}</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel overflow-hidden relative">
              <HeroCarousel
                variant="panel"
                className="h-[260px] sm:h-[320px] md:h-[360px] lg:h-[420px]"
              />
              <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur">
                Swipe to view
              </span>
            </div>
            <ul className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/65 text-slate-900 shadow-lg shadow-blue-950/15 backdrop-blur dark:bg-white/15 dark:text-white">
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
