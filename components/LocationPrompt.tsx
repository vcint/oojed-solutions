"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const STORAGE_DETECTED = 'oojed_detected_city';
const STORAGE_OVERRIDE = 'oojed_city_override';
const STORAGE_DISMISSED = 'oojed_prompt_dismissed';
const CITY_COOKIE = 'oojed_city';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

const normalizeCity = (raw?: string) => {
  if (!raw) return '';
  return String(raw || '').trim();
};

const toSlug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const setCityCookie = (slug: string) => {
  try {
    document.cookie = `${CITY_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=${COOKIE_MAX_AGE}; sameSite=Lax`;
  } catch (e) {
    // ignore cookie errors
  }
};

export default function LocationPrompt() {
  const pathname = usePathname();
  const router = useRouter();
  const [city, setCity] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [always, setAlways] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // only show on homepage
    if (pathname && pathname !== '/') return;
    try {
      const dismissed = window.localStorage.getItem(STORAGE_DISMISSED);
      if (dismissed) return;
      const override = window.localStorage.getItem(STORAGE_OVERRIDE);
      if (override) {
        // user already set override: no prompt (LocationDetector will redirect)
        return;
      }
      const detected = window.localStorage.getItem(STORAGE_DETECTED);
      if (detected) {
        setCity(normalizeCity(detected));
        setVisible(true);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, [pathname]);

  if (!visible || !city) return null;

  const onGo = () => {
    try {
      if (always) window.localStorage.setItem(STORAGE_OVERRIDE, city);
    } catch (e) {}
    setVisible(false);
    const slug = toSlug(city);
    setCityCookie(slug);
    router.replace(`/locations/${encodeURIComponent(slug)}`);
  };
  const onKeep = () => {
    try { window.localStorage.setItem(STORAGE_DISMISSED, '1'); } catch (e) {}
    setVisible(false);
  };

  return (
    <div className="fixed right-4 bottom-6 z-50 w-full max-w-sm rounded-md border border-slate-100 bg-white p-3 shadow-lg dark:border-white/15 dark:bg-[#0b1628]">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Looks like you're in {city}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Would you like to view our {city} page for local pricing, availability and surveys?</div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onGo}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-blue-500"
            >
              Go to {city}
            </button>
            <button
              onClick={onKeep}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
            >
              Keep browsing
            </button>
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={always} onChange={(e) => setAlways(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-400" /> Always use this city
          </label>
        </div>
      </div>
    </div>
  );
}
