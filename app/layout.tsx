import type { Metadata } from "next";
import Script from 'next/script';
import site from '@/data/site.json';
import "./globals.css";
import { Inter } from 'next/font/google';
import WhatsAppButton from "../components/WhatsAppButton";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "OOJED | Solar & LED Specialists",
  description: "OOJED — Solar water heaters, LED lighting, solar pumps, and power plants in Maharashtra.",
  icons: {
    icon: '/oojed-logo.png',
    shortcut: '/oojed-logo.png',
  },
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300','400','600','700','800'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Performance & SEO: preload hero image(s) */}
        {/* preload primary hero image for LCP improvement */}
        <link rel="preload" as="image" href="/2.webp" />
  {/* hero preloads removed — hero-1.jpg / hero-2.jpg were missing and caused 404s; consider preloading actual existing hero images if available */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#102a6d" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

  {/* Critical CSS: inline small, high-priority rules to speed first paint/LCP */}
  <style dangerouslySetInnerHTML={{ __html: `:root{--radius:.375rem;--accent:#102a6d;--bg:#fff;--muted:#94a3b8;--text:#0f172a;--card:#fff}html,body{height:100%;scroll-behavior:smooth}body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:var(--text);background-color:var(--bg);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;margin:0} .container{max-width:72rem;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem} .section{padding-top:4rem;padding-bottom:4rem} .gradient-hero{background:linear-gradient(120deg,#e9ecef 0%,#f8fafc 100%)} ` }} />

  {/* Runtime helper: convert Next-generated stylesheet links to preload early to reduce blocking (best-effort) */}
  <script dangerouslySetInnerHTML={{ __html: `(function(){try{var links=document.querySelectorAll('link[rel="stylesheet"]');for(var i=0;i<links.length;i++){var l=links[i];if(l.href && l.href.indexOf('/_next/static/css/')!==-1){l.rel='preload';l.as='style';l.onload=function(){this.rel='stylesheet';};}}}catch(e){}})();` }} />

        {/* Open Graph */}
  <meta property="og:title" content="OOJED | Solar & LED Specialists" />
  <meta property="og:site_name" content="OOJED" />
  <meta property="og:description" content="OOJED — Solar water heaters, LED lighting, solar pumps, and power plants in Maharashtra." />
        <meta property="og:image" content="/oojed-logo.png" />
  <meta property="og:url" content="https://oojed.com" />
  <link rel="canonical" href="https://oojed.com" />
  <meta name="robots" content="index, follow" />
  {/* Aggregate keywords from site data for a general keywords tag */}
  <meta name="keywords" content={(Array.from(new Set(["solar","solar water heaters","solar pumps","rooftop solar","LED street lights","solar spare parts","OOJED"]))).slice(0,25).join(', ')} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="OOJED | Solar & LED Specialists" />
  <meta name="twitter:description" content="OOJED — Solar water heaters, LED lighting, solar pumps, and power plants in Maharashtra." />
        <meta name="twitter:image" content="/oojed-logo.png" />
        {/* Organization JSON-LD for better local/brand SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "OOJED",
          url: "https://oojed.com",
          logo: "https://oojed.com/oojed-logo.png",
          email: site.contacts?.email,
          telephone: Array.isArray(site.contacts?.phones) ? site.contacts.phones[0] : site.contacts?.phones,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.contacts?.puneOffice || undefined,
            addressLocality: "Pune",
            addressRegion: "Maharashtra",
            postalCode: "411033",
            addressCountry: "IN"
          }
        }, null, 2) }} />
      </head>
    <body className="selection:bg-brand-300/40">
      <Nav />
      <main>
        {children}
      </main>

      <Footer />

      {/* floating WhatsApp connect button (site-wide) */}
      <WhatsAppButton />

      {/* contact badge web component (deferred) */}
      <Script src="/contact-badge.js" strategy="lazyOnload" />

      {/* Google Analytics (gtag.js) - only load in production to avoid dev noise */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-HSZ4TPF6RR" strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-HSZ4TPF6RR');` }} />
        </>
      )}

    </body>
    </html>
  );
}
