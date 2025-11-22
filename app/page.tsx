// Nav is provided by the RootLayout
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
// Footer is provided by the RootLayout
import data from "@/data/site.json";
import Button from "@/components/Button";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackSiteUrl = 'https://oojed.com';
const siteUrl = rawSiteUrl && /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : fallbackSiteUrl;
const heroImageAbsolute = `${siteUrl}/10.webp`;

const baseKeywordSet = new Set<string>([
  'OOJED',
  'solar water heater Maharashtra',
  'solar pump supplier Maharashtra',
  'solar power plant EPC Maharashtra',
  'LED street light supplier Pune',
  'solar AMC service provider',
  'solar energy solutions Pune',
]);

const addKeyword = (value?: string | null) => {
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  if (trimmed) baseKeywordSet.add(trimmed);
};

if (Array.isArray((data as any).categories)) {
  (data as any).categories.forEach((cat: any) => {
    addKeyword(cat?.name);
    if (Array.isArray(cat?.keywords)) cat.keywords.forEach(addKeyword);
  });
}
if (Array.isArray((data as any).services)) {
  (data as any).services.forEach((svc: any) => {
    addKeyword(svc?.name);
    if (Array.isArray(svc?.keywords)) svc.keywords.forEach(addKeyword);
  });
}

const homeKeywords = Array.from(baseKeywordSet).slice(0, 30);

const homeTitle = 'Solar Solutions That Actually Work | 11+ Years Serving Maharashtra | OOJED';
const homeDescription = 'Real solar solutions from a team that cares. Since 2014, we\'ve helped 500+ Maharashtra homes and businesses cut bills with solar water heaters, rooftop power plants, and LED lighting that simply works. Fair pricing, honest advice, solid results.';

export const generateMetadata = (): Metadata => ({
  title: homeTitle,
  description: homeDescription,
  keywords: homeKeywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteUrl,
    type: 'website',
    images: [
      {
        url: heroImageAbsolute,
        width: 1600,
        height: 900,
        alt: 'OOJED solar installation across Maharashtra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
    images: [heroImageAbsolute],
  },
});

const primaryPhone = Array.isArray((data as any).contacts?.phones)
  ? (data as any).contacts?.phones?.[0]
  : (data as any).contacts?.phones;

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "SolarEnergyService",
  "@id": `${siteUrl}#local-business`,
  name: "OOJED Solar Solutions",
  image: heroImageAbsolute,
  url: siteUrl,
  description: homeDescription,
  telephone: primaryPhone,
  email: (data as any).contacts?.email,
  serviceType: [
    "Solar water heater installation",
    "Rooftop solar power plant EPC",
    "Solar pump sizing and supply",
    "LED street and flood lighting projects",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: (data as any).contacts?.puneOffice || undefined,
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411033",
    addressCountry: "IN",
  },
  areaServed: Array.isArray((data as any).cities)
    ? (data as any).cities.slice(0, 12).map((city: string) => ({
      "@type": "City",
      name: city,
    }))
    : undefined,
  sameAs: [
    "https://www.justdial.com/Pune/OOJED-SOLAR-SOLUTIONS/020PXX20-XX20-170305105945-P6R6_BZDET",
    "https://www.indiamart.com/oojed-solutions/profile.html",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  name: "OOJED",
  url: siteUrl,
  inLanguage: "en-IN",
  publisher: {
    "@id": `${siteUrl}#organization`,
  },
  potentialAction: {
    "@type": "ContactAction",
    target: `${siteUrl}/contact`,
    name: "Request a solar quote",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do solar water heaters work during monsoon in Maharashtra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We size systems specifically for Maharashtra's climate. Even on cloudy monsoon days, insulated storage tanks ensure you have usable hot water. Our polymer-coated tanks also handle the region's hard water without scaling issues."
      }
    },
    {
      "@type": "Question",
      name: "How long does solar installation take in Pune?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most residential solar water heater installations are completed within 4-6 hours after the survey. Small rooftop solar power systems typically take 1-2 days, depending on site readiness and permissions."
      }
    },
    {
      "@type": "Question",
      name: "What is the actual payback period for solar in Maharashtra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Solar water heaters typically pay back in 1.5-3 years. Rooftop solar power plants with net-metering usually achieve payback in 3-5 years, depending on your electricity tariff and system size."
      }
    },
    {
      "@type": "Question",
      name: "Does OOJED provide AMC services across Maharashtra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer Annual Maintenance Contracts with scheduled preventive visits, performance checks, and priority breakdown support across Maharashtra and Goa. Our local teams understand regional challenges like hard water and grid instability."
      }
    }
  ]
};

export default function HomePage() {
  return (
    <>
      {/* SEO: Service-level structured data for richer local snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd, null, 2) }}
      />

      <main className="bg-background text-foreground">
        <Hero />
        <section id="about" className="section">
          <div className="container">
            <div className="prose max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why we started OOJED</h2>
              <p className="text-muted-foreground mt-2">
                Back in 2014, solar in Maharashtra was full of big promises and disappointing results. Families paid good money for systems that leaked, failed during monsoon, or needed constant repairs. That didn't sit right with us.
              </p>
              <p className="text-muted-foreground mt-4">
                OOJED was born from a simple belief: Maharashtrians deserve solar solutions that actually work through monsoon rains, hard water, and unreliable grid power. We're here to deliver solar water heaters, rooftop power plants, pumps, and LED lighting that you can count on, year after year.
              </p>
              <p className="text-muted-foreground mt-4"><strong>What makes us different:</strong></p>
              <ul className="list-disc ml-6 text-muted-foreground mt-2">
                {data.values.map((v) => (
                  <li key={v} className="font-semibold">{v}</li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4">
                We fabricate critical spares and BOS components in-house, so you're never waiting weeks for a replacement tube or bracket. From the first survey to years of AMC visits, our local teams stick with you.
              </p>
            </div>

          </div>
        </section>

        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Solar that works. No jargon, no hassles.</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                We follow a straightforward process that keeps you informed, your roof safe, and your solar system performing exactly as promised.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-muted-foreground">
              {[
                {
                  title: '01 · Discover',
                  body: 'Site survey, load assessment, shading analysis and photo logs.',
                },
                {
                  title: '02 · Design',
                  body: 'Right-sized systems, drawings, BOMs and ROI aligned to BIS/MNRE.',
                },
                {
                  title: '03 · Deploy',
                  body: 'Project managers handle logistics, permissions, safety protocols and commissioning.',
                },
                {
                  title: '04 · Support',
                  body: 'AMC visits, monitoring, warranty coordination and emergency callouts across Maharashtra.',
                },
              ].map((step) => (
                <div key={step.title} className="glass px-5 py-6 rounded-xl">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Industries we serve</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We adapt systems for housing societies, manufacturers, hospitality, campuses and municipal sites with proposals tuned to usage patterns, compliance needs and budgets for teams new to solar.
              </p>
              <ul className="mt-6 space-y-3 text-muted-foreground text-sm">
                <li>Residential societies, hostels and hospitals needing reliable hot water.</li>
                <li>MSME and industrial units cutting energy use while meeting safety norms.</li>
                <li>Schools, colleges and offices adopting rooftop solar with monitoring.</li>
                <li>Municipal corporations adopting LED street and high-mast lighting with AMC.</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">Some of our proudest moments</h3>
              <dl className="mt-4 space-y-4 text-muted-foreground text-sm">
                <div>
                  <dt className="font-semibold text-foreground">45,000 LPD solar water heater retrofit</dt>
                  <dd className="text-muted-foreground">Polymer-coated tanks, controllers and smart manifolds for a 320-apartment society in Pune.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">80+ rooftop solar with net-metering</dt>
                  <dd className="text-muted-foreground">Campus EPC with remote monitoring, student dashboards and subsidy documentation.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Hybrid LED street & high-mast lighting</dt>
                  <dd className="text-muted-foreground">Photometric design, poles, trenching and AMC for 9 km of municipal roads.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-secondary/10">
          <div className="container py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  stat: '11+ years',
                  body: 'Designing and maintaining solar + LED systems for Indian climates.',
                },
                {
                  stat: '2+ MW',
                  body: 'Rooftop solar capacity with net-metering and export approvals.',
                },
                {
                  stat: '80+ sites',
                  body: 'Service contracts across Maharashtra and nearby states.',
                },
              ].map((item) => (
                <div key={item.stat} className="rounded-xl border border-border bg-card p-6 shadow-lg">
                  <div className="text-4xl font-extrabold text-primary">{item.stat}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Client feedback</h2>
              <div className="mt-6 space-y-6 text-muted-foreground text-sm">
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "Simplified our solar transition with surveys, paperwork and execution. Regular updates, zero surprises."
                  <span className="mt-3 block font-semibold not-italic text-foreground">Head of Admin, Industrial Supplier - Pune</span>
                </blockquote>
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "LED upgrade reduced downtime. AMC tickets resolved quickly by technicians who know our layout."
                  <span className="mt-3 block font-semibold not-italic text-foreground">Electrical Engineer, Municipal Corporation</span>
                </blockquote>
              </div>
            </div>
            <div className="rounded-xl border border-border glass p-5 shadow-none">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">Ready to start?</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Share your energy spend, roof photos or lighting layouts. We will prepare an assessment within five working days with capacities, subsidy eligibility and timelines.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Residential: hot water, rooftop solar, LED upgrades.</li>
                <li>Institutions: hybrid plants, dashboards, hostel hot water.</li>
                <li>Industry: process heating, pump automation, energy dashboards.</li>
              </ul>
              <Button href="/contact" variant="gradient" className="mt-6 w-full sm:w-auto">
                Let's Talk Solar
              </Button>
            </div>
          </div>
        </section>

        <Products />
        <Benefits />
        <Contact />
      </main>
      {/* contact-badge is loaded globally by RootLayout */}
      {/* @ts-expect-error - custom element
      <contact-badge email={data.contacts.email} phone={data.contacts.phones[0]} /> */}
    </>
  );
}
