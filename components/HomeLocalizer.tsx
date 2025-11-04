"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';

type Hero = {
  headline?: string;
  sub?: string;
  ctaPrimary?: { href?: string; label?: string };
  ctaSecondary?: { href?: string; label?: string };
};

const STORAGE_DETECTED = 'oojed_detected_city';
const DEFAULT_CITY = 'Pune';

function fillCity(text: any, city?: string) {
  if (text == null) return text;
  const c = String(city || DEFAULT_CITY);
  try { return String(text).replace(/\{\{\s*city\s*\}\}/gi, c).replace(/\bPune,?\s*Maharashtra\b/gi, c).replace(/\bPune\b/gi, c); } catch (e) { return text; }
}

export default function HomeLocalizer({ hero }: { hero: Hero }) {
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    try {
      const detected = window.localStorage.getItem(STORAGE_DETECTED);
      if (detected) setCity(detected);
    } catch (e) {
      // ignore
    }
  }, []);

  const selected = city || undefined;

  return (
    <div className="container relative z-10 text-center py-24">
      <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white">{fillCity(hero.headline, selected)}</h1>
      <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto flex items-center justify-center gap-3">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2" /><path d="M12 20v2" /></svg>
        <span>{fillCity(hero.sub, selected)}</span>
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href={hero.ctaPrimary?.href || '/contact'} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 md:px-6 md:py-3">{fillCity(hero.ctaPrimary?.label || 'Get a Free Solar Assessment', selected)}</Link>
        <Link href={hero.ctaSecondary?.href || '#'} className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-5 py-2.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 md:px-6 md:py-3 dark:bg-transparent dark:text-white dark:border-white/20">{fillCity(hero.ctaSecondary?.label || 'See Sample Savings Report (PDF)', selected)}</Link>
      </div>
    </div>
  );
}
