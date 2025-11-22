"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [active, setActive] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideQuote, setHideQuote] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof pathname === 'string' && pathname !== '/') {
      if (pathname.startsWith('/products')) {
        setActive('products');
        return;
      }
      if (pathname.startsWith('/services')) {
        setActive('services');
        return;
      }
      const seg = pathname.replace(/^\/+/, '').split('/')[0];
      if (seg) {
        setActive(seg);
        return;
      }
    }

    const ids = ["home", "about", "products", "benefits", "contact"];
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
          ? "text-primary-foreground font-semibold"
          : "text-muted-foreground hover:text-primary transition-colors")
      }
    >
      {active === id.replace(/^\/+/, '') && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full bg-primary -z-10"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {label}
    </Link>
  );

  const sections: { id: string; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: '/about', label: 'About' },
    { id: '/products', label: 'Products' },
    { id: '/services', label: 'Services' },
    { id: '/why-us', label: 'Why Us' },
    { id: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[92%] md:w-[90%] lg:w-[82%] pointer-events-none">
      <div className="glass pointer-events-auto flex items-center justify-between px-3 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm border-white/20 dark:border-white/10">
        <Link href="/" aria-label="OOJED home" className="pointer-events-auto inline-flex items-center">
          <div className="relative h-10 w-32">
            <Image
              src="/oojed-logo.png"
              alt="OOJED logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {sections.map(({ id, label }) => link(id, label))}
          </div>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border">
            {!hideQuote && (
              <Button href="/contact" variant="gradient" className="px-4 py-2 text-xs md:text-sm rounded-full">
                Get a Quote
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 w-full pointer-events-auto"
          >
            <div className="glass px-4 py-4 space-y-3 rounded-xl">
              <div className="flex flex-col gap-2">
                {sections.map(s => (
                  <div key={s.id}>{link(s.id, s.label, () => setMobileOpen(false))}</div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                {!hideQuote && (
                  <Button href="/contact" variant="gradient" className="w-full justify-center rounded-full" onClick={() => setMobileOpen(false)}>
                    Get a Quote
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
