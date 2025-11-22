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
              const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (prefersReducedMotion) {
                (gsapMod as any).gsap.set([".hero-head", ".hero-sub", ".hero-cta"], { y: 0, opacity: 1 });
                return;
              }
              ctx = (gsapMod as any).gsap.context(() => {
                (gsapMod as any).gsap.fromTo(
                  ".hero-head",
                  { y: 12, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.4, delay: 0, ease: "power2.out" },
                );
                (gsapMod as any).gsap.fromTo(
                  ".hero-sub",
                  { y: 12, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.out" },
                );
                (gsapMod as any).gsap.fromTo(
                  ".hero-cta",
                  { y: 12, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: "power2.out" },
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
    <section ref={ref} id="home" className="section hero relative overflow-hidden text-foreground pt-32 md:pt-40 lg:pt-48">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-secondary-foreground backdrop-blur-md border border-border">
              <FiShield className="h-3.5 w-3.5" />
              Since 2014
            </span>

            <div className="space-y-6">
              <h1 className="hero-head text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">{headline}</h1>
              <p className="hero-sub max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {subtitle}
              </p>
            </div>

            <div className="hero-cta flex flex-col gap-4 sm:flex-row">
              <Button
                href={data.hero.ctaPrimary?.href || "/contact"}
                variant="gradient"
                className="w-full px-6 py-3 sm:w-auto md:px-8 md:py-3.5 shadow-lg shadow-primary/20 rounded-full glow-on-hover"
              >
                {ctaPrimaryLabel}
                <FiArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href={data.hero.ctaSecondary?.href || "/products"}
                variant="surface"
                className="w-full px-6 py-3 sm:w-auto md:px-8 md:py-3.5 border-border text-foreground hover:bg-secondary/50 rounded-full glow-on-hover"
              >
                {ctaSecondaryLabel}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass px-5 py-6 rounded-xl text-foreground">
                  <div className="text-xl font-semibold sm:text-2xl">{stat.value}</div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass glass-hover elevated ambient-light relative overflow-hidden rounded-2xl">
              <HeroCarousel
                variant="panel"
                className="h-[260px] sm:h-[320px] md:h-[360px] lg:h-[420px]"
              />
              <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/85 backdrop-blur">
                Swipe to view
              </span>
            </div>
            <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm">
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
