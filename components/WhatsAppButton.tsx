"use client";
import React, { useEffect, useState, useRef } from 'react';
import site from '../data/site.json';

function cleanPhone(phone?: string) {
  if (!phone) return '';
  return phone.replace(/[^+0-9]/g, '');
}

export default function WhatsAppButton() {
  const phone = cleanPhone(site.contacts?.phones?.[0]);
  const text = encodeURIComponent("Hello OOJED, I would like to inquire about your products and services.");
  const href = phone ? `https://wa.me/${phone.replace(/^\+/, '')}?text=${text}` : `https://wa.me/?text=${text}`;

  // popup state and refs
  const [showPopup, setShowPopup] = useState(false);
  const popupTimeout = useRef<number | null>(null);

  // threshold: fraction of total scroll (e.g., 0.25 = 25%) before showing popup
  const SCROLL_THRESHOLD = 0.25;

  useEffect(() => {
    // compute mobile detection on mount (avoids SSR/mismatch)
    const mobile = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)) && window.innerWidth <= 900;
    if (!mobile) return; // only show on mobile

    // don't show more than once per session per page
    const pathKey = (typeof window !== 'undefined' ? window.location.pathname : '/') || '/';
    const sessionKey = `waPopupShown:${pathKey}`;
    try {
      if (sessionStorage.getItem(sessionKey) === '1') return;
    } catch (e) {
      // ignore sessionStorage errors
    }

    const onScroll = () => {
      try {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
        const clientHeight = window.innerHeight || doc.clientHeight || 0;
        const maxScroll = Math.max(1, scrollHeight - clientHeight);
        const frac = scrollTop / maxScroll;
        if (frac >= SCROLL_THRESHOLD) {
          // show popup once
          setShowPopup(true);
          try { sessionStorage.setItem(sessionKey, '1'); } catch (e) {}
          // hide after 5 seconds if not interacted
          popupTimeout.current = window.setTimeout(() => setShowPopup(false), 5000) as unknown as number;
          // remove listener (use same function reference)
          try { window.removeEventListener('scroll', onScroll); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => {
      window.removeEventListener('scroll', onScroll as any);
      if (popupTimeout.current) {
        clearTimeout(popupTimeout.current as any);
      }
    };
  }, []);

  return (
    <div
      className="whatsapp-pulse"
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)',
        zIndex: 9999,
      }}
    >
      {/* popup bubble shown on mobile after scroll threshold */}
      {showPopup && (
        <div className="mb-2 flex items-center justify-end">
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => setShowPopup(false)} className="rounded-lg bg-emerald-600 text-white px-3 py-2 shadow-lg max-w-xs text-sm flex items-center gap-2" style={{ marginRight: 8 }}>
            <div className="flex-1">Connect with us on WhatsApp</div>
            <button aria-label="Dismiss" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPopup(false); }} className="opacity-80 hover:opacity-100">✕</button>
          </a>
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 hover-raise"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Prefer a public asset if available for branding; fallback to inline filled glyph */}
        {false ? (
          // If you add `public/whatsapp.svg` you can toggle this to true or replace condition with a runtime check
          <img src="/whatsapp.svg" alt="WhatsApp" className="h-5 w-5" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M20.52 3.48A11.88 11.88 0 0012.02.01C5.48.01.34 5.03.22 11.55a11.87 11.87 0 001.9 6.06L.04 24l6.5-1.72a11.86 11.86 0 005.49 1.33h.02c6.54 0 11.69-5.02 11.81-11.54a11.86 11.86 0 00-3.34-8.59zM12 21.5h-.01c-1.7 0-3.36-.45-4.83-1.3l-.35-.21-3.86 1.02 1.03-3.76-.22-.38A9.44 9.44 0 012.5 11.55c.12-5.02 4.2-9.1 9.24-9.1 2.48 0 4.81.97 6.56 2.73a9.22 9.22 0 012.7 6.52c-.02 5.22-4.26 9.45-9.73 9.45z" />
            <path d="M17.37 14.04c-.29-.14-1.7-.84-1.96-.93-.26-.09-.45-.14-.64.14-.19.29-.74.93-.9 1.12-.16.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.43-1.72-1.6-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.32.43-.48.14-.16.18-.28.28-.47.09-.19.05-.36-.02-.5-.07-.13-.63-1.52-.86-2.08-.23-.55-.46-.48-.64-.49l-.54-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.37 0 1.4 1.02 2.75 1.16 2.94.14.19 2.01 3.05 4.87 4.28 1.77.77 2.72.85 3.69.7.57-.09 1.7-.69 1.94-1.36.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.33z" />
          </svg>
        )}

        <span className="hidden sm:inline-block font-medium">Connect on WhatsApp</span>
      </a>
    </div>
  );
}
