import type { Metadata } from "next";
import Script from 'next/script';
import site from '@/data/site.json';
import "./globals.css";
import { Inter } from 'next/font/google';
import WhatsAppButton from "../components/WhatsAppButton";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FloatingCTA from "../components/FloatingCTA";
import ExitIntentPopup from "../components/ExitIntentPopup";
// client-side location detection and redirect helper
import LocationDetector from '@/components/LocationDetector';
import CitySelector from '@/components/CitySelector';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackSiteUrl = 'https://oojed.com';
const siteUrl = rawSiteUrl && /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : fallbackSiteUrl;
const metadataBaseUrl = (() => {
  try {
    return new URL(siteUrl);
  } catch (error) {
    return new URL(fallbackSiteUrl);
  }
})();
const siteOrigin = metadataBaseUrl.origin;
const defaultTitle = 'OOJED | Solar & LED Specialists';
const defaultDescription = 'OOJED sources, supplies and installs solar water heaters, rooftop solar plants, solar pumps and LED lighting projects across Maharashtra, with in-house fabrication limited to spare parts and BOS assemblies.';
const ogImageUrl = new URL('/10.webp', metadataBaseUrl).toString();

const keywordSet = new Set<string>();
const addKeyword = (value?: string | null) => {
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  if (trimmed) keywordSet.add(trimmed);
};

[
  'OOJED',
  'solar solutions Maharashtra',
  'solar water heater supplier',
  'solar lighting supplier',
  'solar pumps installer',
  'LED street lighting Maharashtra',
  'solar AMC services',
].forEach(addKeyword);

const categories: any[] = Array.isArray((site as any).categories) ? (site as any).categories : [];
categories.forEach((cat) => {
  addKeyword(cat?.name);
  if (Array.isArray(cat?.keywords)) cat.keywords.forEach(addKeyword);
});

const services: any[] = Array.isArray((site as any).services) ? (site as any).services : [];
services.forEach((svc) => {
  addKeyword(svc?.name);
  if (Array.isArray(svc?.keywords)) svc.keywords.forEach(addKeyword);
});

const globalKeywords = Array.from(keywordSet).slice(0, 30);

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteOrigin}#organization`,
  name: "OOJED",
  url: siteOrigin,
  logo: `${siteOrigin}/oojed-logo.png`,
  brand: {
    "@type": "Brand",
    name: "OOJED",
    url: siteOrigin,
  },
  sameAs: [
    "https://www.justdial.com/Pune/OOJED-SOLAR-SOLUTIONS/020PXX20-XX20-170305105945-P6R6_BZDET",
    "https://www.indiamart.com/oojed-solutions/profile.html",
  ],
  email: (site as any).contacts?.email,
  telephone: Array.isArray((site as any).contacts?.phones)
    ? (site as any).contacts?.phones?.[0]
    : (site as any).contacts?.phones,
  address: {
    "@type": "PostalAddress",
    streetAddress: (site as any).contacts?.puneOffice || undefined,
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411033",
    addressCountry: "IN",
  },
};

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: defaultTitle,
    template: "%s | OOJED",
  },
  description: defaultDescription,
  applicationName: "OOJED",
  publisher: "OOJED",
  keywords: globalKeywords,
  category: "Renewable energy",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en": "/",
    },
  },
  icons: {
    icon: "/oojed-logo.png",
    shortcut: "/oojed-logo.png",
    apple: "/oojed-logo.png",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteOrigin,
    siteName: "OOJED",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1600,
        height: 900,
        alt: "OOJED solar installation in Maharashtra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '600', '700', '800'],
  adjustFontFallback: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {}
})();
`,
          }}
        />
        {/* Performance & SEO: preload hero image(s) */}
        {/* preload primary hero image for LCP improvement */}
        <link rel="preload" as="image" href="/2.webp" />
        {/* hero preloads removed — hero-1.jpg / hero-2.jpg were missing and caused 404s; consider preloading actual existing hero images if available */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#102a6d" />

        {/* Runtime helper: convert Next-generated stylesheet links to preload early to reduce blocking (best-effort) */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var links=document.querySelectorAll('link[rel="stylesheet"]');for(var i=0;i<links.length;i++){var l=links[i];if(l.href && l.href.indexOf('/_next/static/css/')!==-1){l.rel='preload';l.as='style';l.onload=function(){this.rel='stylesheet';};}}}catch(e){}})();` }} />

        <link rel="publisher" href={siteOrigin} />
        {/* Organization JSON-LD for better local/brand SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd, null, 2) }} />
      </head>
      <body className="selection:bg-primary/30 bg-background text-foreground transition-colors duration-200">
        {/* Run location detection early on the client. It only redirects if user previously set an override. */}
        <LocationDetector />
        <Nav />
        <main className="min-h-screen bg-background transition-colors duration-200">
          {children}
        </main>

        <Footer />

        {/* floating WhatsApp connect button (site-wide) */}
        <WhatsAppButton />

        {/* floating CTA bar (appears on scroll) */}
        <FloatingCTA />

        {/* exit intent popup (lead capture) */}
        <ExitIntentPopup />

        {/* City selector (shows only when IP detection fails) */}
        <CitySelector />

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
