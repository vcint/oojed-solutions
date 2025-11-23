"use client";
import { useEffect, useRef, useState } from "react";
import data from "@/data/site.json";
import HeroCarousel from "./HeroCarousel";
import Button from "./Button";
import TrustBadges from "./TrustBadges";
import SolarCalculator from "./SolarCalculator";
import { FiArrowRight, FiShield, FiTrendingUp } from "react-icons/fi";



const heroHighlights = [
  "Tier-one OEM partners for solar, lighting and pump hardware",
  "In-house fabrication for critical solar water heater spares and BOS kits",
  "Dedicated coordination desk for financing, subsidy and DISCOM paperwork",
];

const STORAGE_DETECTED = "oojed_detected_city";
const DEFAULT_CITY = "Pune";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // hydrate detected city (if any) for personalised hero text
  useEffect(() => {
    try {
      const detected = window.localStorage.getItem(STORAGE_DETECTED);
      if (detected) setCity(detected);
    } catch (error) {
      // ignore storage access failures
    }
  }, []);



  const fillCity = (text: string, city?: string | null) => {
    if (!text) return "";
    const replacement = city || DEFAULT_CITY;
    return text.replace(/{city}/g, replacement)
      .replace(/\{\{\s*city\s*\}\}/gi, replacement)
      .replace(/\bPune,?\s*Maharashtra\b/gi, replacement)
      .replace(/\bPune\b/gi, replacement);
  };

  const headline = fillCity(data.hero.headline, city);
  const sub = fillCity(data.hero.sub, city);

  return (
    <section ref={ref} id="home" className="section hero relative overflow-hidden text-foreground pt-20 md:pt-24 lg:pt-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm backdrop-blur">
              <FiShield className="h-4 w-4 text-primary" />
              <span className="font-medium">SINCE 2014</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {headline}
            </h1>

            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              {sub}
            </p>

            <div className="hero-cta flex flex-col gap-4 sm:flex-row">
              <Button
                href="/contact?intent=survey"
                variant="gradient"
                className="w-full px-6 py-3 sm:w-auto md:px-8 md:py-3.5 shadow-lg shadow-primary/20 rounded-full glow-on-hover"
                title="Schedule your free solar site survey"
              >
                Get Free Site Survey
                <FiArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsCalculatorOpen(true)}
                variant="surface"
                className="w-full px-6 py-3 sm:w-auto md:px-8 md:py-3.5 border-border text-foreground hover:bg-secondary/50 rounded-full glow-on-hover"
                title="Calculate your potential solar savings"
              >
                Calculate Savings
                <FiTrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <SolarCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />

            <SolarCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />

            <TrustBadges />
          </div>

          <div className="space-y-6 animate-in slide-in-from-right duration-700 fade-in">
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
