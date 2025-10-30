import site from '@/data/site.json';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

type Props = { params: { city: string } };

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

export async function generateMetadata({ params }: Props) {
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

export default function CityPage({ params }: Props) {
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

      {/* Local intent FAQ JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `Do you serve all areas of ${cityName}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, we serve most neighbourhoods in ${cityName} and nearby areas. Share your location for scheduling.` } },
          { '@type': 'Question', name: 'How fast can installation be scheduled?', acceptedAnswer: { '@type': 'Answer', text: 'For standard jobs we schedule within 2–7 days depending on survey and material readiness.' } },
          { '@type': 'Question', name: 'Do you assist with subsidies and net-metering?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We advise on state/city policies and manage documentation where applicable.' } },
          { '@type': 'Question', name: 'Do you provide post-installation service?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We offer repair visits and Annual Maintenance Contracts (AMC) with defined SLAs.' } },
        ],
      }) }} />

      <div className="mt-8">
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg">Request a quote in {cityName}</Link>
      </div>
    </main>
  );
}
