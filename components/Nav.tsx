"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [active, setActive] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideQuote, setHideQuote] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // If we're on a different route (not the homepage), derive active from pathname
    if (typeof pathname === 'string' && pathname !== '/') {
      if (pathname.startsWith('/products')) {
        setActive('products');
        return;
      }
      if (pathname.startsWith('/services')) {
        setActive('services');
        return;
      }
      // fallback: use the first path segment
      const seg = pathname.replace(/^\/+/, '').split('/')[0];
      if (seg) {
        setActive(seg);
        return;
      }
    }

    // otherwise, we're on the homepage — use scroll position to set active section
    const ids = ["home","about","products","benefits","contact"];
    const handler = () => {
      const top = window.scrollY + 120;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= top && top < el.offsetTop + el.offsetHeight) {
          setActive(id);
          return;
        }
      }
      setActive('home');
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [pathname]);
  // hide the Quote button when the contact section is active or when the URL hash points to contact
  // (some deployments don't have a separate /contact route, so rely on hash too)
  useEffect(() => {
    const updateHide = () => {
      if (typeof window === 'undefined') return;
      const pathIsContact = window.location && window.location.pathname === '/contact';
      const hashIsContact = window.location && (window.location.hash === '#contact' || window.location.hash === '#/contact');
      setHideQuote(active === 'contact' || pathIsContact || hashIsContact);
    };
    updateHide();
    window.addEventListener('popstate', updateHide);
    window.addEventListener('hashchange', updateHide);
    return () => {
      window.removeEventListener('popstate', updateHide);
      window.removeEventListener('hashchange', updateHide);
    };
  }, [active]);
  const link = (id: string, label: string, onClick?: () => void) => (
    <Link
      href={
        id.startsWith('/') ? id : (id === 'home' ? '/' : `/#${id}`)
      }
      onClick={() => { if (onClick) onClick(); }}
      className={
        (active === id.replace(/^\/+/, '') ? "ui-text font-semibold" : "ui-text font-medium") +
        " hover:text-slate-900 transition-colors"
      }
    >
      {label}
    </Link>
  );
  // Use top-level routes for pages we've created. Keep anchors for purely in-page sections.
  const sections: { id: string; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: '/about', label: 'About' },
    { id: '/products', label: 'Products' },
    { id: '/services', label: 'Services' },
    { id: '/why-us', label: 'Why Us' },
    { id: '/contact', label: 'Contact' },
  ];
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[94%] md:w-[92%] lg:w-[84%]">
      <div className="nav-glass">
          <div className="container flex items-center justify-between h-12 md:h-16 px-3 md:px-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/oojed-logo.png" alt="OOJED-logo" className="h-12 md:h-14 w-auto" />
            {/* <span className="text-blue-900 font-semibold text-lg md:text-xl tracking-tight">SOLUTIONS</span> */}
            <span className="sr-only">OOJED</span>
          </Link>

          {/* mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* mobile theme toggle (visible next to hamburger) */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>

              <div className="hidden md:flex gap-4 text-sm items-center">
                {sections.filter(s => {
                  const sid = s.id.startsWith('/') ? s.id.replace(/^\/+/, '') : s.id;
                  return sid !== active;
                }).map(s => (
                  <span key={s.id}>{link(s.id, s.label)}</span>
                ))}
                {!hideQuote && <Link href="/contact" className="hidden md:inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-4 py-2 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300">Get a Quote</Link>}
                <ThemeToggle />
              </div>
          </div>
        </div>

        {/* mobile menu panel - positioned absolutely below the nav to avoid overlapping hero/logo */}
        {mobileOpen && (
          <div className="md:hidden relative">
                <div className="absolute left-4 right-4 top-full mt-3 z-40">
              <div className="nav-panel p-3">
                <div className="flex flex-col gap-3 text-sm text-slate-900">
                  {sections.filter(s => {
                    const sid = s.id.startsWith('/') ? s.id.replace(/^\/+/, '') : s.id;
                    return sid !== active;
                  }).map(s => (
                    <div key={s.id}>{link(s.id, s.label, () => setMobileOpen(false))}</div>
                  ))}
                  {!hideQuote && (
                      <Link href="/contact" className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-4 py-2 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300" onClick={() => setMobileOpen(false)}>Get a Quote</Link>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
