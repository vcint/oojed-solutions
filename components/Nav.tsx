"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";

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
        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors " +
        (active === id.replace(/^\/+/, '')
          ? "text-white before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-[#0f3fa6] before:to-[#00a8ff] before:opacity-90 before:-z-10 font-semibold"
          : "text-slate-700 dark:text-slate-200 hover:text-[#0f3fa6] dark:hover:text-[#5ea8ff]")
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
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[92%] md:w-[90%] lg:w-[82%] pointer-events-none">
      <div className="glass-panel pointer-events-auto flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 shadow-[0_18px_45px_rgba(7,17,38,0.18)]">
        <Link href="/" aria-label="OOJED home" className="pointer-events-auto inline-flex items-center">
          <img src="/oojed-logo.png" alt="OOJED logo" className="h-12 w-auto object-contain drop-shadow-[0_6px_18px_rgba(8,15,35,0.45)] contrast-125 brightness-110" />
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-[#0a1f3a]/70 text-slate-900 dark:text-slate-100 shadow-md shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-[#5ea8ff]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="md:hidden">
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-2 xl:gap-4">
            {sections.map(({ id, label }) => link(id, label))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!hideQuote && (
              <Button href="/contact" variant="gradient" className="px-4 py-2 text-xs md:text-sm">
                Get a Quote
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-3 w-full pointer-events-auto">
          <div className="glass-panel px-4 py-4 space-y-3">
            <div className="flex flex-col gap-2">
              {sections.map(s => (
                <div key={s.id}>{link(s.id, s.label, () => setMobileOpen(false))}</div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-[#5ea8ff]/20">
              {!hideQuote && (
                <Button href="/contact" variant="gradient" className="w-full justify-center" onClick={() => setMobileOpen(false)}>
                  Get a Quote
                </Button>
              )}
              <div className="ml-3">
                
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
