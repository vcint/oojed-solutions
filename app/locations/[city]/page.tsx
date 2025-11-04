import site from '@/data/site.json';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
const fromSlug = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const match = cities.find((c) => toSlug(c) === slug);
  return match || slug;
};

export async function generateStaticParams() {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  return cities.map((c) => ({ city: toSlug(c) }));
}

export async function generateMetadata({ params }: { params: any }) {
  const cityName = fromSlug(params.city);
  const title = `Solar Solutions in ${cityName} — Heaters, Pumps, LED Lighting | OOJED`;
  const description = `OOJED serves ${cityName} with solar water heaters (ETC/FPC), rooftop solar, solar pumps, LED street/flood lighting, installation, repair and AMC.`;
  const url = `https://oojed.com/locations/${encodeURIComponent(params.city)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'OOJED' },
    twitter: { card: 'summary', title, description },
  } as any;
}

export default function CityPage({ params }: { params: any }) {
  const cityName = fromSlug(params.city);
  return (
    <main className="container py-12">
      <nav className="text-sm text-slate-500 mb-3">
        <Link href="/locations" className="hover:underline">Service Areas</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{cityName}</span>
      </nav>

      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Service Areas', item: 'https://oojed.com/locations' },
          { '@type': 'ListItem', position: 2, name: cityName, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}` },
        ],
      }) }} />

      <h1 className="text-3xl font-bold">Solar Solutions in {cityName}</h1>
      <p className="mt-4 max-w-3xl text-slate-700">
        We deliver and support clean energy systems in {cityName}: solar water heaters (ETC/FPC), rooftop solar power plants, solar water pumps, and LED street/flood lighting. Our local teams handle site survey, design, installation, commissioning, repair and AMC.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Popular categories</h2>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Link href="/products/solar-water-heaters" className="text-blue-700 hover:underline">Solar Water Heaters — ETC/FPC systems with installation & AMC</Link></li>
          <li><Link href="/products/solar-power-plants" className="text-blue-700 hover:underline">Rooftop Solar Power Plants — on‑grid/hybrid with net‑metering</Link></li>
          <li><Link href="/products/solar-pumps" className="text-blue-700 hover:underline">Solar Water Pumps — sized to head/flow with MPPT/VFD</Link></li>
          <li><Link href="/products/led-lighting" className="text-blue-700 hover:underline">LED Street & Flood Lighting — IP65, surge protected</Link></li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Services offered</h2>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Link href="/services/installation" className="text-blue-700 hover:underline">Professional Installation & Commissioning</Link></li>
          <li><Link href="/services/feasibility" className="text-blue-700 hover:underline">Feasibility & Site Survey</Link></li>
          <li><Link href="/services/repair" className="text-blue-700 hover:underline">Repair & Service</Link></li>
          <li><Link href="/services/amc" className="text-blue-700 hover:underline">Annual Maintenance Contracts (AMC)</Link></li>
        </ul>
      </section>

      <TrustBar />

      {/* Local intent FAQ: generate an extensive, city-aware FAQ to improve local indexing */}
      {
        (() => {
          const phone = (site as any).contacts?.phones?.[0] || (site as any).contacts?.phone || '';
          const baseFaq = [
            { q: `Do you serve all areas of ${cityName}?`, a: `Yes, we serve most neighbourhoods in ${cityName} and nearby areas. Share your location for scheduling.` },
            { q: `How quickly can installation be scheduled in ${cityName}?`, a: `For standard residential installations we typically schedule within 2–7 business days after a site survey and material confirmation; larger or custom projects may take longer.` },
            { q: `Do you provide post-installation service in ${cityName}?`, a: `Yes. We provide repair visits and Annual Maintenance Contracts (AMC) with defined SLAs. Call ${phone} to book a service visit.` },
            { q: `Do you assist with subsidies and net-metering for ${cityName}?`, a: `Yes. We advise on state/city subsidy schemes and assist with net-metering paperwork where applicable.` },
            { q: `What areas do your warranties and service cover in ${cityName}?`, a: `Warranties vary by product: tubes and tanks typically have multi-year warranties while service support and AMC are available across ${cityName}. We explain warranty terms during the quote.` },
            { q: `Can you do installations on apartment blocks or multi-storey buildings in ${cityName}?`, a: `Yes. We provision manifold/pressurized systems and booster arrangements for multi-storey buildings; we also provide structural mounting and civil drawings as required.` },
            { q: `What preparations are needed before a site survey in ${cityName}?`, a: `Please share roof access details, expected hot‑water usage (family size), and any existing plumbing constraints. Photos help speed up the survey.` },
            { q: `Do you supply spare parts and emergency support in ${cityName}?`, a: `We stock common spare parts and offer emergency repair visits; contact ${phone} for urgent requests.` },
          ];

          // Category-focused FAQs to increase keyword coverage
          const categoryFaqs = [
            { q: `Which solar water heater model is recommended for ${cityName}?`, a: `We recommend ETC or FPC systems based on roof orientation, water usage and local climate. Our site survey in ${cityName} determines the best choice.` },
            { q: `Can you install LED street lighting projects in ${cityName}?`, a: `Yes. We design photometric layouts, provide poles/masts and deliver complete installation for municipal and commercial projects in ${cityName}.` },
            { q: `Do you size solar pumps for agricultural sites near ${cityName}?`, a: `Yes. We size pumps to required head and flow. Provide bore depth, desired discharge and irrigation schedule for an accurate quote.` },
          ];

          const faqs = [...baseFaq, ...categoryFaqs];

          return (
            <>
              <section className="mt-8" aria-labelledby="local-faqs">
                <h2 id="local-faqs" className="text-xl font-semibold">Frequently asked questions — {cityName}</h2>
                <div className="mt-4 prose max-w-none text-slate-700">
                  {faqs.map((f, i) => (
                    <div key={i} className="mb-4">
                      <div className="font-semibold">{f.q}</div>
                      <div className="mt-1">{f.a}</div>
                    </div>
                  ))}
                </div>
              </section>

              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
              }) }} />
            </>
          );
        })()
      }

      <div className="mt-8">
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg">Request a quote in {cityName}</Link>
      </div>
    </main>
  );
}
