"use client";
import { useEffect } from "react";

const DEFAULT_CITY = "Pune";
const CITY_COOKIE = 'oojed_city';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // ~180 days

function normalizeCity(raw?: string) {
  const base = raw ?? DEFAULT_CITY;
  return String(base || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function setCityCookie(slug: string) {
  try {
    document.cookie = `${CITY_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=${COOKIE_MAX_AGE}; sameSite=Lax`;
  } catch (e) {
    // ignore cookie set errors (Safari private mode, etc.)
  }
}

function getCityCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function LocationDetector() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If a cookie is missing, seed it from override/detected/default for server-side usage.
    const existingCookieSlug = getCityCookie();
    if (!existingCookieSlug) {
      const overrideSlug = normalizeCity(window.localStorage.getItem('oojed_city_override') || undefined);
      const seed = overrideSlug || normalizeCity(DEFAULT_CITY);
      setCityCookie(seed);
    }
  }, []);

  return null;
}
