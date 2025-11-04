"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const DEFAULT_CITY = "Pune";

function normalizeCity(raw?: string) {
  if (!raw) return DEFAULT_CITY;
  return String(raw || "").trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function LocationDetector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only auto-detect when on the home page (avoid surprising redirects when user visits other pages)
    if (typeof window === 'undefined') return;
    if (pathname && pathname !== '/') return;

    // If user previously set an explicit override, respect it and redirect.
    // Otherwise do NOT auto-redirect: we'll surface a prompt so the user can choose.
    const storedOverride = window.localStorage.getItem('oojed_city_override');
    if (storedOverride) {
      const slug = normalizeCity(storedOverride);
      if (window.location.pathname !== `/locations/${slug}`) {
        router.replace(`/locations/${slug}`);
      }
      return;
    }

    let finished = false;

    const finishWith = (city?: string) => {
      if (finished) return;
      finished = true;
      try { window.localStorage.setItem('oojed_detected_city', city || DEFAULT_CITY); } catch (e) {}
      // do not redirect automatically unless user previously requested overrides
      // the LocationPrompt UI reads `oojed_detected_city` and offers the user a choice
    };

    // Try device geolocation first (asks user for permission)
    const tryGeolocation = () => new Promise<void>((resolve) => {
      if (!navigator.geolocation) return resolve();
      const onSuccess = async (pos: GeolocationPosition) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Call server reverse geocode endpoint
          const res = await fetch(`/api/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.city) {
              finishWith(json.city);
              return resolve();
            }
          }
        } catch (e) {
          // ignore and fallthrough to resolve so IP lookup runs
        }
        resolve();
      };
      const onError = () => resolve();
      // prefer low accuracy to respect battery; short timeout
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 1000 * 60 * 60, timeout: 6000, enableHighAccuracy: false });
    });

    // IP fallback when geolocation is unavailable or denied
    const tryIpLookup = async () => {
      try {
        const res = await fetch('/api/ip');
        if (res.ok) {
          const json = await res.json();
          if (json && json.city) {
            finishWith(json.city);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      // final fallback
      finishWith(DEFAULT_CITY);
    };

    (async () => {
      try {
        await tryGeolocation();
        // if geolocation resolved the flow it will have redirected; otherwise continue
        if (!finished) await tryIpLookup();
      } catch (e) {
        finishWith(DEFAULT_CITY);
      }
    })();
  }, [router, pathname]);

  return null;
}
