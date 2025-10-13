"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [active, setActive] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideQuote, setHideQuote] = useState(false);
  useEffect(() => {
    const handler = () => {
      const ids = ["home","about","products","benefits","contact"];
      const top = window.scrollY + 120;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= top && top < el.offsetTop + el.offsetHeight) {
          setActive(id);
          break;
        }
      }
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  // hide the Quote button when the contact section is active or when on /contact route
  useEffect(() => {
    const updateHide = () => {
      const pathIsContact = typeof window !== 'undefined' && window.location && window.location.pathname === '/contact';
      setHideQuote(active === 'contact' || pathIsContact);
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
      href={`#${id}`}
      onClick={() => { if (onClick) onClick(); }}
      className={
        (active === id ? "text-slate-900 font-semibold" : "text-slate-800 font-medium") +
        " hover:text-slate-900 transition-colors"
      }
    >
      {label}
    </Link>
  );
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[94%] md:w-[92%] lg:w-[84%]">
      <div className="nav-glass">
        <div className="container flex items-center justify-between h-12 md:h-16 px-3 md:px-6">
          <Link href="/" className="font-semibold text-blue-900 text-3xl md:text-4xl tracking-tight">OOJED <span className="text-slate-700">Solutions</span></Link>

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

            <div className="hidden md:flex gap-6 text-sm items-center">
              {link("about","About")}
              {link("products","Products")}
              {link("benefits","Why Us")}
              {link("contact","Contact")}
              {!hideQuote && <Link href="#contact" className="btn-primary hidden md:inline-flex">Get a Quote</Link>}
            </div>
          </div>
        </div>

        {/* mobile menu panel - positioned absolutely below the nav to avoid overlapping hero/logo */}
        {mobileOpen && (
          <div className="md:hidden relative">
            <div className="absolute left-4 right-4 top-full mt-3 z-40">
              <div className="nav-panel p-3">
                <div className="flex flex-col gap-3 text-sm text-slate-900">
                  {link("about","About", () => setMobileOpen(false))}
                  {link("products","Products", () => setMobileOpen(false))}
                  {link("benefits","Why Us", () => setMobileOpen(false))}
                  {link("contact","Contact", () => setMobileOpen(false))}
                  {!hideQuote && (
                    <Link href="#contact" className="btn-primary w-full justify-center mt-2" onClick={() => setMobileOpen(false)}>Get a Quote</Link>
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
