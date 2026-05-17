import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
// Footer is provided by the RootLayout
import data from "@/data/site.json";
import Button from "@/components/Button";
import dynamic from 'next/dynamic';
import { generatePageMetadata } from "@/lib/seo";

const BrandMarquee = dynamic(() => import("@/components/BrandMarquee"), { loading: () => <div className="h-24 w-full bg-secondary/10" /> });
const Products = dynamic(() => import("@/components/Products"), { loading: () => <div className="h-96" /> });
const Benefits = dynamic(() => import("@/components/Benefits"));
const Contact = dynamic(() => import("@/components/Contact"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const QuickLeadForm = dynamic(() => import("@/components/QuickLeadForm"));
const HomeFAQ = dynamic(() => import("@/components/HomeFAQ"));

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

const homeTitle = 'OOJED: Trusted Solar Solutions in Pune, Pimpri Chinchwad & Lonavala';
const homeDescription = 'OOJED delivers reliable solar water heaters, rooftop solar & LED lighting in Pune, Pimpri Chinchwad, Lonavala and nearby areas. 11+ years of honest service & fair pricing. Get a free quote.';

export const generateMetadata = (): Metadata => {
  return generatePageMetadata('/', homeTitle, homeDescription);
};

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
    addressLocality: "Pimpri-Chinchwad",
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
      name: "How long does solar installation take in Pune and Pimpri Chinchwad?",
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
      name: "Does OOJED provide AMC services in Pune, Pimpri Chinchwad and Lonavala?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer Annual Maintenance Contracts with scheduled preventive visits, performance checks, and priority breakdown support across Pune, Pimpri Chinchwad, Lonavala and nearby areas. Our local teams understand regional challenges like hard water and grid instability."
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
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none" />
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Professional Solar Energy Solutions Built on 11+ Years of Trust</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                OOJED delivers turnkey solar systems for residences, businesses, and institutions across Pune, Pimpri-Chinchwad, and Lonavala. We combine transparent pricing, engineering excellence, local expertise, and unwavering after-sales support to make solar simple, predictable, and profitable.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-muted-foreground">
              {[
                {
                  title: '01 · Assessment',
                  body: 'Professional site survey with structural analysis, shading study, electrical audit and detailed photo documentation.',
                },
                {
                  title: '02 · Engineering',
                  body: 'Custom system design with BIS/MNRE compliance, itemized quotations, ROI analysis and subsidy guidance.',
                },
                {
                  title: '03 · Execution',
                  body: 'Project-managed installation with quality inspections, safety protocols, performance testing and customer handover training.',
                },
                {
                  title: '04 · Assurance',
                  body: 'Warranty support, optional AMC with 24/7 emergency response, remote monitoring, and proactive maintenance across all areas.',
                },
              ].map((step) => (
                <div key={step.title} className="glass px-5 py-6 rounded-xl border border-slate-200 dark:border-white/10">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground text-xs md:text-sm">{step.body}</p>
                </div>
              ))}
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-gradient-to-r from-blue-50/50 to-slate-50/50 dark:from-[#102a6d]/10 dark:to-transparent p-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#102a6d] dark:text-[#8bb8ff]">11+</div>
                <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#102a6d] dark:text-[#8bb8ff]">350+</div>
                <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#102a6d] dark:text-[#8bb8ff]">25+ MWp</div>
                <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1">Installed Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#102a6d] dark:text-[#8bb8ff]">60+</div>
                <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1">Active AMC Contracts</div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">What We Deliver</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                OOJED specializes in solar water heating systems, rooftop solar power plants with net-metering, solar water pumps, and LED lighting projects. We handle everything from site analysis and engineering to installation, testing, and multi-year maintenance contracts.
              </p>
              <ul className="mt-6 space-y-3 text-muted-foreground text-sm">
                <li><strong>Solar Water Heaters:</strong> ETC and FPC systems sized for your hot water needs with polymer-coated tanks designed for hard water.</li>
                <li><strong>Rooftop Solar Power Plants:</strong> Grid-tied systems with net-metering approvals, customized for your electricity consumption and roof space.</li>
                <li><strong>Solar Water Pumps:</strong> DC and AC pump systems for bore wells and agricultural applications, sized to your head and flow requirements.</li>
                <li><strong>LED Lighting Solutions:</strong> Professional-grade LED systems for various applications with proper electrical design and safety compliance.</li>
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-[#102a6d]/10 border border-blue-200 dark:border-blue-900">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <strong>Our approach:</strong> We listen to your needs, design appropriate solutions, provide transparent pricing, and maintain systems responsibly over the long term.
                </p>
              </div>
            </div>
            <div className="glass p-8 rounded-xl border border-slate-200 dark:border-white/10">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">How We Work</h3>
              <ul className="mt-6 space-y-4 text-muted-foreground text-sm list-disc list-inside">
                <li><strong>Site Survey First:</strong> We assess your roof, electrical capacity, water usage and local regulations before any proposal.</li>
                <li><strong>Transparent Pricing:</strong> Our quotes itemize every cost - no hidden charges, no upselling. We disclose expected subsidies upfront.</li>
                <li><strong>Professional Installation:</strong> Licensed engineers and certified installers handle all work with quality inspections and performance testing.</li>
                <li><strong>Long-term Support:</strong> Optional AMC programs include preventive maintenance, emergency response, and remote performance monitoring.</li>
                <li><strong>Local Expertise:</strong> We understand Pune and Pimpri-Chinchwad's climate, water hardness, electricity tariffs, and local regulations.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-12 bg-background">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Trusted Brands We Work With</h2>
            <div className="relative">
              {/* Gradient overlays for smooth edge fade */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

              <BrandMarquee />
            </div>
          </div>
        </section>

        <section className="bg-secondary/10">
          <div className="container py-12">
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
                  stat: '100+ sites',
                  body: 'Completed across Pune, Pimpri Chinchwad, Lonavala and nearby areas.',
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

        <section className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Client feedback</h2>
              <div className="mt-6 space-y-6 text-muted-foreground text-sm">
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "Simplified our solar transition with surveys, paperwork and execution. Regular updates, zero surprises."
                  <span className="mt-3 block font-semibold not-italic text-foreground">Head of Admin, Industrial Supplier - Pune</span>
                </blockquote>
              </div>
            </div>
            <div className="rounded-xl border border-border glass p-5 shadow-none">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">Ready to start?</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Share your energy spend, roof photos or lighting layouts. We will prepare an assessment within five working days with capacities, subsidy eligibility and timelines.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Solar water heater systems for residential use.</li>
                <li>Rooftop solar power plants with net-metering.</li>
                <li>Solar pumps and LED lighting solutions.</li>
              </ul>
              <Button href="/contact" variant="gradient" className="mt-6 w-full sm:w-auto">
                Let's Talk Solar
              </Button>
            </div>
          </div>
        </section>

        <Products />
        <Benefits />

        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-[#102a6d]/20 dark:to-transparent">
          <div className="container py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Where We Serve: Pune, Pimpri-Chinchwad & Lonavala</h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              Trusted solar, LED and renewable energy solutions across Pune metropolitan area and Lonavala. Over a decade of local expertise, same-day surveys, and round-the-clock support.
            </p>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  city: 'Pune',
                  focus: 'Solar water heaters, rooftop solar & LED lighting across metro areas',
                  areas: 'Kalyani Nagar, Kothrud, Baner, Hinjawadi, Hadapsar, Kharadi & more',
                  keywords: 'Solar water heater Pune • Solar power plant Pune • LED lighting Pune'
                },
                {
                  city: 'Pimpri-Chinchwad',
                  focus: 'Solar water heaters, rooftop solar & solar pumps across residential and commercial',
                  areas: 'Wakad, Aundh, Pimpri, Nigdi, Ravet, Bhosari & surrounding',
                  keywords: 'Solar Pimpri Chinchwad • Solar pump PCMC • Rooftop solar EPC'
                },
                {
                  city: 'Lonavala',
                  focus: 'Solar water heaters, rooftop solar and solar pumps with hill-area expertise',
                  areas: 'Lonavala, Khandala & nearby areas',
                  keywords: 'Solar Lonavala • Monsoon-rated solar systems • Solar Khandala'
                },
              ].map((item) => (
                <Link key={item.city} href={`/locations/${item.city.toLowerCase()}`} className="group rounded-xl border border-border bg-white dark:bg-[#0f1f36] p-6 shadow-md hover:shadow-lg hover:border-primary/50 transition-all">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition">{item.city}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{item.focus}</p>
                  <p className="mt-2 text-xs text-muted-foreground/70 font-medium">Areas: {item.areas}</p>
                  <p className="mt-4 text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.keywords}</p>
                  <div className="mt-4 flex items-center text-primary font-semibold text-sm">
                    View details <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                <span className="font-semibold">Service radius:</span> We also serve Talegaon Dabhade, Chakan, Dehu, PCMC and surrounding towns. <Link href="/locations" className="text-primary hover:underline">Explore all service areas</Link>.
              </p>
              <Button href="/contact" variant="gradient">Get Free Survey & Quotation</Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to switch to solar?</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Join hundreds of satisfied customers in Pune, Pimpri-Chinchwad and Lonavala who are saving money and energy every day.
                Whether it's a simple water heater or a complete rooftop power plant, we make the process easy.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Free site survey and consultation",
                  "Transparent pricing with no hidden costs",
                  "Genuine components and warranty support",
                  "Local team for quick service"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pl-10">
              <QuickLeadForm />
            </div>
          </div>
        </section>

        <Testimonials />

        <HomeFAQ />

      </main>
      {/* contact-badge is loaded globally by RootLayout */}
      {/* @ts-expect-error - custom element
      <contact-badge email={data.contacts.email} phone={data.contacts.phones[0]} /> */}
    </>
  );
}
