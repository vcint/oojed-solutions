// Nav is provided by the RootLayout
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
// Footer is provided by the RootLayout
import data from "@/data/site.json";

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

const homeTitle = 'Solar Water Heaters, Solar Pumps & LED Lighting in Maharashtra';
const homeDescription = 'OOJED supplies BIS-compliant solar water heaters, rooftop solar power plants, solar pumps and LED lighting with installation, repair and AMC support across Maharashtra.';

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

      <main className="bg-white dark:bg-slate-900">
        <Hero />
        <section id="about" className="section">
          <div className="container">
            <div className="prose max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">About OOJED</h2>
              <p className="text-slate-700 dark:text-slate-300 mt-2">{data.about}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">Our core strengths include:</p>
              <ul className="list-disc ml-6 text-slate-700 dark:text-slate-300 mt-2">
                {data.values.map((v) => (
                  <li key={v} className="font-semibold">{v}</li>
                ))}
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">We engineer configurations with trusted OEM hardware, fabricate select spare parts and BOS assemblies in-house, and provide end-to-end project support from site survey through commissioning and after-sales service.</p>
            </div>

          </div>
        </section>

        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 via-transparent to-transparent dark:from-[#0a1d3b]/45 pointer-events-none" />
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">End-to-end solar delivery you can rely on</h2>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                From discovery workshops to long-term AMC, OOJED runs a predictable process that keeps stakeholders informed and assets productive. We mix factory-tested assemblies with local engineering and transparent reporting so projects never feel rushed or under-specified.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-slate-700 dark:text-slate-300">
              {[
                {
                  title: '01 · Discover',
                  body: 'Site survey, load assessment and constraint mapping with photo logs and shading analysis.',
                },
                {
                  title: '02 · Design',
                  body: 'Right-sized systems, detailed drawings, BoMs and ROI projections aligned to BIS/MNRE norms.',
                },
                {
                  title: '03 · Deploy',
                  body: 'Project managers coordinate logistics, statutory permissions, safety protocols and commissioning.',
                },
                {
                  title: '04 · Support',
                  body: 'AMC visits, remote monitoring, warranty coordination and emergency callouts across Maharashtra.',
                },
              ].map((step) => (
                <div key={step.title} className="glass-panel px-5 py-6">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Industries & environments we serve</h2>
              <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                Whether you manage a cooperative housing society, manufacturing plant, hotel, campus or municipal infrastructure, our teams adapt systems to actual usage patterns, compliance regulations and budget expectations. Every proposal includes explainers for decision-makers who may be new to solar technologies.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                <li>• Residential societies, hostels and hospitals needing reliable hot water across seasons.</li>
                <li>• MSME and industrial units chasing energy savings while meeting safety and audit requirements.</li>
                <li>• Schools, colleges and corporate offices adopting rooftop solar with monitoring dashboards.</li>
                <li>• Municipal corporations upgrading to LED street / high-mast lighting with AMC-backed uptime.</li>
              </ul>
            </div>
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Project snapshots</h3>
              <dl className="mt-4 space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-white">45,000 LPD solar water heater retrofit</dt>
                  <dd className="text-slate-600 dark:text-slate-400">Polymer-coated tanks, differential controllers and smart manifolds for a 320-apartment housing society in Pune, delivered in 28 days.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-white">80+ rooftop solar with net-metering</dt>
                  <dd className="text-slate-600 dark:text-slate-400">Complete EPC for an educational campus including remote monitoring, student dashboards and subsidy documentation.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-white">Hybrid LED street & high-mast lighting</dt>
                  <dd className="text-slate-600 dark:text-slate-400">Photometric design, pole supply, trenching and AMC for 9 km of municipal roads with 24/7 service desk support.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  stat: '11+ years',
                  body: 'Experience designing and maintaining solar + LED systems that withstand Indian climates.',
                },
                {
                  stat: '2+ MW',
                  body: 'Of rooftop solar capacity engineered with net-metering and export approvals.',
                },
                {
                  stat: '80+ sites',
                  body: 'Under service contracts across Maharashtra and neighbouring states.',
                },
              ].map((item) => (
                <div key={item.stat} className="rounded-xl border border-white/20 dark:border-white/10 bg-white/5 dark:bg-white/5 p-6 shadow-lg">
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{item.stat}</div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">What partners say</h2>
              <div className="mt-6 space-y-6 text-slate-700 dark:text-slate-300 text-sm">
                <blockquote className="border-l-4 border-[#102a6d] dark:border-[#5ea8ff] pl-4 italic">
                  "OOJED simplified our entire solar transition. Their team handled surveys, government paperwork and execution with regular updates — zero surprises."
                  <span className="mt-3 block font-semibold not-italic text-slate-900 dark:text-white">Head of Admin, Industrial Supplier – Pune</span>
                </blockquote>
                <blockquote className="border-l-4 border-[#102a6d] dark:border-[#5ea8ff] pl-4 italic">
                  "The LED high-mast upgrade has reduced downtime dramatically. AMC tickets are resolved quickly and field technicians know our layout well."
                  <span className="mt-3 block font-semibold not-italic text-slate-900 dark:text-white">Electrical Engineer, Municipal Corporation</span>
                </blockquote>
              </div>
            </div>
            <div className="rounded-xl border glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ready to start?</h3>
              <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                Share your current energy spend, roof photos or lighting layouts. We will prepare an assessment within five working days including recommended capacities, subsidy eligibility and implementation timelines.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>• Residential complexes: centralised hot water, rooftop solar, common-area LED upgrades.</li>
                <li>• Institutions: hybrid power plants, classroom dashboards, hostel hot water systems.</li>
                <li>• Industry: process heating support, pump automation, energy monitoring dashboards.</li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] text-white font-semibold px-5 py-2.5 shadow hover:bg-[#0c3a99]"
              >
                Book a consultation
              </Link>
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
