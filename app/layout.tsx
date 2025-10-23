import type { Metadata } from "next";
import Script from 'next/script';
import site from '@/data/site.json';
import "./globals.css";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Performance & SEO: preconnect to common hosts (fonts, analytics), preload hero image(s) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* non-blocking Google Fonts: preload the stylesheet then swap media on the client to avoid render-blocking @import */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" media="print" />
        <Script id="font-swap" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(){try{var l=document.querySelector('link[href^="https://fonts.googleapis.com"]');if(!l)return;if((l as any).sheet){l.media='all';return;}l.addEventListener('load',function(){l.media='all';});}catch(e){}})();` }} />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" />
        </noscript>
        {/* preload primary hero image for LCP improvement */}
        <link rel="preload" as="image" href="/2.webp" />
  {/* hero preloads removed — hero-1.jpg / hero-2.jpg were missing and caused 404s; consider preloading actual existing hero images if available */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#102a6d" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

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

    </body>
    </html>
  );
}
