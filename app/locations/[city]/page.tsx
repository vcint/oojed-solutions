import site from '@/data/site.json';
import neighborhoods from '@/data/neighborhoods.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrustBar from '@/components/TrustBar';
import FaqAccordion from '@/components/FaqAccordion';
import { generateCityFAQs } from '@/lib/city-faq-generator';

const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
const fromSlug = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const match = cities.find((c) => toSlug(c) === slug);
  return match; // return undefined if not found
};

const localizeCity = (text: string, cityName: string) =>
  String(text || '')
    .replace(/Pune,\s*Maharashtra/gi, `${cityName}, Maharashtra`)
    .replace(/\bPune\b/gi, cityName)
    .replace(/\{\{\s*city\s*\}\}/gi, cityName);

export async function generateStaticParams() {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  return cities.map((c) => ({ city: toSlug(c) }));
}

export async function generateMetadata({ params }: { params: any }) {
  const cityName = fromSlug(params.city);
  if (!cityName) return { title: 'City Not Found | OOJED' };

  const title = `Solar Solutions in ${cityName} - Heaters, Pumps, LED Lighting | OOJED`;
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

  // If city is not in our service areas list, show 404
  if (!cityName) {
    notFound();
  }

  const citySlug = toSlug(cityName);
  return (
    <main className="container py-12 text-slate-800 dark:text-slate-100">
      <nav className="mb-3 text-sm text-slate-500 dark:text-slate-300">
        <Link href="/locations" className="hover:underline">Service Areas</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{cityName}</span>
      </nav>

      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Service Areas', item: 'https://oojed.com/locations' },
            { '@type': 'ListItem', position: 2, name: cityName, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}` },
          ],
        })
      }} />

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Solar Solutions in {cityName}</h1>
      <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed dark:text-slate-200">
        We deliver and support clean energy systems in {cityName}: solar water heaters (ETC/FPC), rooftop solar power plants, solar water pumps, and LED street/flood lighting. Our local teams handle site survey, design, installation, commissioning, repair and AMC.
      </p>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1f36] dark:shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Why OOJED in {cityName}</h2>
          <p className="mt-3 text-slate-700 leading-relaxed dark:text-slate-200">
            {localizeCity('OOJED specializes in solar water heaters, rooftop solar power plants, solar pumps, and LED lighting systems. We handle everything from site assessment to installation, testing, and long-term maintenance.', cityName)}
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <li className="rounded-lg border bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="block font-semibold text-slate-900 dark:text-white">Local field teams</span>
              {localizeCity('Surveyors, installers and service engineers based in and around {{city}} for faster mobilisation and after-sales visits.', cityName)}
            </li>
            <li className="rounded-lg border bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="block font-semibold text-slate-900 dark:text-white">Turnkey compliance</span>
              {localizeCity('Engineering drawings, net-metering/subsidy paperwork and handover documents prepared to suit civic and DISCOM requirements in {{city}}.', cityName)}
            </li>
            <li className="rounded-lg border bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="block font-semibold text-slate-900 dark:text-white">Rapid spare-part support</span>
              {localizeCity('Critical tubes, pumps, controllers and LED drivers stocked within driving distance of {{city}} enabling priority service.', cityName)}
            </li>
            <li className="rounded-lg border bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="block font-semibold text-slate-900 dark:text-white">Lifecycle monitoring</span>
              {localizeCity('AMC programs with seasonal tune-ups, data logging and remote alerts keep assets productive throughout the year.', cityName)}
            </li>
          </ul>
        </div>
        <div className="rounded-xl border bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-[#102a6d]/40 dark:to-[#0b1729]">
          <h3 className="text-lg font-semibold text-[#102a6d] dark:text-[#8bb8ff]">At a glance</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <li>
              <span className="block text-3xl font-bold text-slate-900">350+</span>
              Solar water heater systems designed and installed across {cityName}.
            </li>
            <li>
              <span className="block text-3xl font-bold text-slate-900">25 MWp</span>
              Rooftop solar capacity deployed with net-metering approvals in {cityName}.
            </li>
            <li>
              <span className="block text-3xl font-bold text-slate-900">60+</span>
              Active maintenance contracts with guaranteed response in {cityName}.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Popular categories</h2>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Link href="/products/solar-water-heaters" className="text-blue-700 hover:underline">Solar Water Heaters - ETC/FPC systems with installation & AMC</Link></li>
          <li><Link href="/products/solar-power-plants" className="text-blue-700 hover:underline">Rooftop Solar Power Plants - on-grid/hybrid with net-metering</Link></li>
          <li><Link href="/products/solar-pumps" className="text-blue-700 hover:underline">Solar Water Pumps - sized to head/flow with MPPT/VFD</Link></li>
          <li><Link href="/products/led-lighting" className="text-blue-700 hover:underline">LED Street & Flood Lighting - IP65, surge protected</Link></li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Services offered</h2>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Link href={`/services/installation?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Professional Installation & Commissioning</Link></li>
          <li><Link href={`/services/feasibility?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Feasibility & Site Survey</Link></li>
          <li><Link href={`/services/repair?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Repair & Service</Link></li>
          <li><Link href={`/services/amc?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Annual Maintenance Contracts (AMC)</Link></li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Typical project timeline in {cityName}</h2>
        <ol className="mt-4 space-y-3 text-slate-700 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102a6d] text-white font-semibold">1</span>
            <div>
              <h3 className="font-semibold text-slate-900">Site discovery & assessment</h3>
              <p>{localizeCity('Roof, electrical and plumbing audit with load profiling and shading analysis in {{city}}.', cityName)}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102a6d] text-white font-semibold">2</span>
            <div>
              <h3 className="font-semibold text-slate-900">Design & commercial proposal</h3>
              <p>{localizeCity('Optimised sizing, ROI estimate, itemised bill of materials and execution schedule presented within 3–5 business days.', cityName)}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102a6d] text-white font-semibold">3</span>
            <div>
              <h3 className="font-semibold text-slate-900">Installation & commissioning</h3>
              <p>{localizeCity('Material delivery, installation, quality checks and customer training completed with photo-logged updates in {{city}}.', cityName)}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102a6d] text-white font-semibold">4</span>
            <div>
              <h3 className="font-semibold text-slate-900">Care & performance assurance</h3>
              <p>{localizeCity('AMC visits, remote monitoring and emergency callouts keep systems running at peak efficiency year-round.', cityName)}</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-xl border bg-white/60 p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1f36]">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What We Can Deliver</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
          <div className="h-full rounded-lg border p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Solar Water Heaters</h3>
            <p className="mt-2">ETC and FPC systems sized for your hot water needs. Professional installation with testing, training and AMC support in {cityName}.</p>
          </div>
          <div className="h-full rounded-lg border p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Rooftop Solar Power</h3>
            <p className="mt-2">Grid-tied systems with net-metering approvals. Custom engineering for your roof space and electricity consumption.</p>
          </div>
          <div className="h-full rounded-lg border p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Solar Pumps & LED</h3>
            <p className="mt-2">Water pumps for bore wells and agricultural use. Professional LED systems with proper design and safety compliance.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#0f1f36]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Why Choose Us</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <p><strong>Local Expertise:</strong> We understand {cityName}'s climate, water quality, and regulations.</p>
            <p><strong>Transparent Pricing:</strong> All quotations itemize every cost upfront.</p>
            <p><strong>Professional Installation:</strong> Licensed engineers and certified installers with quality testing.</p>
            <p><strong>Long-term Support:</strong> Optional AMC programs with preventive maintenance and emergency response.</p>
          </div>
        </div>
        <div className="border rounded-xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-[#102a6d]/40 dark:to-[#0b1729]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Plan your project</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {localizeCity('Share site images, roof drawings or load data with our pre-sales desk in {{city}}. We will prepare an itemised proposal with savings estimates, vendor qualifications and a mobilisation schedule.', cityName)}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <li>• Site survey & shading analysis</li>
            <li>• ROI, payback and subsidy advisory</li>
            <li>• Delivery schedule & manpower plan</li>
            <li>• AMC and service-level options</li>
          </ul>
          <Link
            href={`/contact?city=${encodeURIComponent(citySlug)}`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] text-white font-semibold px-5 py-2.5 shadow hover:bg-[#0c3a99]"
          >
            Schedule a survey in {cityName}
          </Link>
        </div>
      </section>

      <TrustBar />

      {/* Local intent FAQ: generate an extensive, city-aware FAQ to improve local indexing */}
      {
        (() => {
          const phone = (site as any).contacts?.phones?.[0] || (site as any).contacts?.phone || '';
          const faqs = generateCityFAQs(cityName, phone);

          return (
            <>
              <section className="mt-8" aria-labelledby="local-faqs">
                <h2 id="local-faqs" className="text-xl font-semibold">Frequently asked questions - {cityName}</h2>
                <div className="mt-4">
                  <FaqAccordion items={faqs.map((f) => ({ q: f.q, a: f.a }))} idPrefix={`local-faq-${cityName.replace(/\s+/g, '-').toLowerCase()}`} />
                </div>
              </section>

              <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
                })
              }} />
            </>
          );
        })()
      }

      {/* Neighborhoods section for hyperlocal SEO */}
      {
        (() => {
          const nhData = neighborhoods as any;
          const cityNhData = nhData.neighborhoods[params.city] || [];
          
          if (cityNhData.length === 0) return null;
          
          return (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Service neighborhoods in {cityName}</h2>
              <p className="text-slate-700 dark:text-slate-200 mb-6">OOJED provides solar installation, repair and AMC services across all neighborhoods in {cityName}. Click below to see details for your area:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cityNhData.map((neighborhood: any) => (
                  <Link
                    key={neighborhood.slug}
                    href={`/locations/neighborhoods/${params.city}-${neighborhood.slug}`}
                    className="px-4 py-3 rounded-lg border border-blue-300 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-medium transition text-center"
                  >
                    {neighborhood.name}
                  </Link>
                ))}
              </div>
            </section>
          );
        })()
      }

      <div className="mt-8">
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg">Request a quote in {cityName}</Link>
      </div>
    </main>
  );
}
