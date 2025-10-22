import type { Metadata } from "next";
import Script from 'next/script';
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
  {/* hero preloads removed — hero-1.jpg / hero-2.jpg were missing and caused 404s; consider preloading actual existing hero images if available */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#102a6d" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* Open Graph */}
  <meta property="og:title" content="OOJED | Solar & LED Specialists" />
  <meta property="og:description" content="OOJED — Solar water heaters, LED lighting, solar pumps, and power plants in Maharashtra." />
        <meta property="og:image" content="/oojed-logo.png" />
        <meta property="og:url" content="https://your-production-domain.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="OOJED | Solar & LED Specialists" />
  <meta name="twitter:description" content="OOJED — Solar water heaters, LED lighting, solar pumps, and power plants in Maharashtra." />
        <meta name="twitter:image" content="/oojed-logo.png" />
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
