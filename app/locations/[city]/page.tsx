import site from '@/data/site.json';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';
import FaqAccordion from '@/components/FaqAccordion';

const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');
const fromSlug = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const match = cities.find((c) => toSlug(c) === slug);
  return match || slug;
};

const localizeCity = (text: string, cityName: string) =>
  String(text || '')
    .replace(/Pune,\s*Maharashtra/gi, `${cityName}, Maharashtra`)
    .replace(/\bPune\b/gi, cityName)
    .replace(/{{\s*city\s*}}/gi, cityName);

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
  const citySlug = toSlug(cityName);
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
      <p className="mt-4 max-w-3xl text-slate-700 leading-relaxed">
        We deliver and support clean energy systems in {cityName}: solar water heaters (ETC/FPC), rooftop solar power plants, solar water pumps, and LED street/flood lighting. Our local teams handle site survey, design, installation, commissioning, repair and AMC.
      </p>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Why OOJED in {cityName}</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            {localizeCity('Since 2014 we have executed residential, industrial and institutional solar projects across {{city}}, navigating roof-space constraints, water quality challenges, utility permissions and occupancy schedules unique to the region.', cityName)}
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 text-sm">
            <li className="p-3 bg-slate-50 border rounded-lg shadow-sm">
              <span className="block text-slate-900 font-semibold">Local field teams</span>
              {localizeCity('Surveyors, installers and service engineers based in and around {{city}} for faster mobilisation and after-sales visits.', cityName)}
            </li>
            <li className="p-3 bg-slate-50 border rounded-lg shadow-sm">
              <span className="block text-slate-900 font-semibold">Turnkey compliance</span>
              {localizeCity('Engineering drawings, net-metering/subsidy paperwork and handover documents prepared to suit civic and DISCOM requirements in {{city}}.', cityName)}
            </li>
            <li className="p-3 bg-slate-50 border rounded-lg shadow-sm">
              <span className="block text-slate-900 font-semibold">Rapid spare-part support</span>
              {localizeCity('Critical tubes, pumps, controllers and LED drivers stocked within driving distance of {{city}} enabling priority service.', cityName)}
            </li>
            <li className="p-3 bg-slate-50 border rounded-lg shadow-sm">
              <span className="block text-slate-900 font-semibold">Lifecycle monitoring</span>
              {localizeCity('AMC programs with seasonal tune-ups, data logging and remote alerts keep assets productive throughout the year.', cityName)}
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-b from-blue-50 to-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#102a6d]">At a glance</h3>
          <ul className="mt-4 space-y-3 text-slate-700 text-sm">
            <li>
              <span className="block text-3xl font-bold text-slate-900">350+</span>
              {localizeCity('Solar water heater installations completed in housing societies, hotels and hostels around {{city}}.', cityName)}
            </li>
            <li>
              <span className="block text-3xl font-bold text-slate-900">25 MWp</span>
              {localizeCity('Rooftop solar capacity engineered with net-metering approvals for industries, institutions and commercial complexes in {{city}}.', cityName)}
            </li>
            <li>
              <span className="block text-3xl font-bold text-slate-900">60+</span>
              {localizeCity('Active AMC contracts serviced with guaranteed response SLAs inside {{city}} limits.', cityName)}
            </li>
          </ul>
        </div>
      </section>

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

      <section className="mt-8 bg-white/60 border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Recent deployments</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700 text-sm">
          <div className="border rounded-lg p-4 h-full">
            <h3 className="font-semibold text-slate-900">{localizeCity('Skyline Heights Cooperative', cityName)}</h3>
            <p className="mt-2">{localizeCity('45,000 LPD solar water heating retrofit with polymer-coated tanks and automation for staggered supply in {{city}}.', cityName)}</p>
          </div>
          <div className="border rounded-lg p-4 h-full">
            <h3 className="font-semibold text-slate-900">{localizeCity('Sunbeam International School', cityName)}</h3>
            <p className="mt-2">{localizeCity('80 kWp rooftop solar with remote monitoring dashboards and classroom awareness program.', cityName)}</p>
          </div>
          <div className="border rounded-lg p-4 h-full">
            <h3 className="font-semibold text-slate-900">{localizeCity('Riverfront Industrial Estate', cityName)}</h3>
            <p className="mt-2">{localizeCity('Hybrid solar + high-mast LED lighting upgrade for internal roads, loading bays and security perimeters.', cityName)}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl bg-white/70 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What customers say</h2>
          <div className="mt-4 space-y-4 text-slate-700 text-sm">
            <blockquote className="border-l-4 border-[#102a6d] pl-3 italic">
              {localizeCity('“OOJED completed our hostel solar water heating upgrade ahead of schedule and continues to service the system promptly in {{city}}.”', cityName)}
              <span className="block mt-2 font-semibold not-italic text-slate-900">— Facilities Head, Hospitality Group</span>
            </blockquote>
            <blockquote className="border-l-4 border-[#102a6d] pl-3 italic">
              {localizeCity('“Their rooftop solar plant reduced our demand charges immediately, and the AMC team in {{city}} keeps performance on track.”', cityName)}
              <span className="block mt-2 font-semibold not-italic text-slate-900">— Operations Lead, Manufacturing Unit</span>
            </blockquote>
          </div>
        </div>
        <div className="border rounded-xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Plan your project</h2>
          <p className="mt-3 text-slate-700 text-sm leading-relaxed">
            {localizeCity('Share site images, roof drawings or load data with our pre-sales desk in {{city}}. We will prepare an itemised proposal with savings estimates, vendor qualifications and a mobilisation schedule.', cityName)}
          </p>
          <ul className="mt-4 space-y-2 text-slate-700 text-sm">
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
                <div className="mt-4">
                  <FaqAccordion items={faqs.map((f) => ({ q: f.q, a: f.a }))} idPrefix={`local-faq-${cityName.replace(/\s+/g, '-').toLowerCase()}`} />
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
