import neighborhoods from '@/data/neighborhoods.json';
import site from '@/data/site.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FaqAccordion from '@/components/FaqAccordion';

export async function generateStaticParams() {
  const nhData = neighborhoods as any;
  const params: { slug: string }[] = [];
  
  // Generate params for all neighborhoods
  const puneNeighborhoods = nhData.neighborhoods.pune || [];
  const pcmcNeighborhoods = nhData.neighborhoods['pimpri-chinchwad'] || [];
  const lonavaNeighborhoods = nhData.neighborhoods.lonavala || [];
  
  puneNeighborhoods.forEach((n: any) => {
    params.push({ slug: `pune-${n.slug}` });
  });
  
  pcmcNeighborhoods.forEach((n: any) => {
    params.push({ slug: `pimpri-chinchwad-${n.slug}` });
  });
  
  lonavaNeighborhoods.forEach((n: any) => {
    params.push({ slug: `lonavala-${n.slug}` });
  });

  return params;
}

export async function generateMetadata({ params }: { params: any }) {
  const nhData = neighborhoods as any;
  const slugParts = params.slug.split('-');
  
  let neighborhood: any = null;
  let cityKey = '';
  let cityName = '';
  
  // Try to find matching neighborhood
  Object.entries(nhData.neighborhoods).forEach(([key, cityNeighborhoods]: [string, any]) => {
    if (params.slug.startsWith(key + '-') && !neighborhood) {
      const nhSlug = params.slug.substring(key.length + 1);
      neighborhood = cityNeighborhoods.find((n: any) => n.slug === nhSlug);
      if (neighborhood) {
        cityKey = key;
        cityName = key === 'pimpri-chinchwad' ? 'Pimpri Chinchwad' : key.charAt(0).toUpperCase() + key.slice(1);
      }
    }
  });

  if (!neighborhood) return { title: 'Area Not Found | OOJED' };

  const title = `Solar Solutions in ${neighborhood.name}, ${cityName} - Water Heaters, Rooftop Solar & More | OOJED`;
  const description = `${neighborhood.description} OOJED provides professional solar water heaters, rooftop solar systems, solar pumps and LED lighting with installation, repair and AMC services.`;
  const url = `https://oojed.com/locations/neighborhoods/${params.slug}`;
  
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: 'summary', title, description },
  };
}

export default function NeighborhoodPage({ params }: { params: any }) {
  const nhData = neighborhoods as any;
  const slugParts = params.slug.split('-');
  
  let neighborhood: any = null;
  let cityKey = '';
  let cityName = '';
  
  // Find matching neighborhood
  Object.entries(nhData.neighborhoods).forEach(([key, cityNeighborhoods]: [string, any]) => {
    if (params.slug.startsWith(key + '-') && !neighborhood) {
      const nhSlug = params.slug.substring(key.length + 1);
      neighborhood = cityNeighborhoods.find((n: any) => n.slug === nhSlug);
      if (neighborhood) {
        cityKey = key;
        cityName = key === 'pimpri-chinchwad' ? 'Pimpri Chinchwad' : key.charAt(0).toUpperCase() + key.slice(1);
      }
    }
  });

  if (!neighborhood) notFound();

  const phone = (site as any).contacts.phones[0];
  const siteData = site as any;

  return (
    <main className="container py-12 text-slate-800 dark:text-slate-100">
      <nav className="mb-3 text-sm text-slate-500 dark:text-slate-300">
        <Link href="/locations" className="hover:underline">Service Areas</Link>
        <span className="mx-2">/</span>
        <Link href={`/locations/${cityKey}`} className="hover:underline">{cityName}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{neighborhood.name}</span>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: `OOJED Solar - ${neighborhood.name}, ${cityName}`,
          areaServed: neighborhood.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteData.contacts.puneOffice,
            addressLocality: cityName,
            addressRegion: 'Maharashtra',
            postalCode: '411033',
            addressCountry: 'IN'
          },
          telephone: phone,
          email: siteData.contacts.email,
          url: 'https://oojed.com',
          serviceType: ['Solar Water Heaters', 'Rooftop Solar', 'Solar Pumps', 'LED Lighting'],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '50'
          }
        })
      }} />

      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-8">
        Solar Solutions in {neighborhood.name}, {cityName}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
        {neighborhood.description} OOJED is your local solar partner providing professional solar water heaters, rooftop solar systems, solar pumps, and LED lighting with installation, repair and AMC services.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">What We Offer in {neighborhood.name}</h2>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li>✓ Solar water heaters with professional installation</li>
            <li>✓ Rooftop solar systems with net-metering support</li>
            <li>✓ Solar pumps for farms and irrigation</li>
            <li>✓ LED street and flood lighting</li>
            <li>✓ Emergency repairs and 24/7 AMC support</li>
          </ul>
        </div>

        <div className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-6">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-4">Why OOJED</h2>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li>✓ 11+ years of local experience in {cityName}</li>
            <li>✓ Free surveys within 24-48 hours</li>
            <li>✓ Transparent pricing with subsidies included</li>
            <li>✓ Licensed engineers and certified technicians</li>
            <li>✓ 24/7 emergency support for AMC customers</li>
          </ul>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Common Questions</h2>
        <FaqAccordion
          items={[
            { q: `Do you serve ${neighborhood.name}?`, a: `Yes, we provide full service coverage in ${neighborhood.name} including surveys, installation and maintenance. Call ${phone} to confirm for your exact location.` },
            { q: `How quickly can I get a quote?`, a: `We schedule free surveys within 24-48 hours for ${neighborhood.name} area. Quotations are ready within 1-2 days.` },
            { q: `What subsidies are available for ${neighborhood.name}?`, a: `Maharashtra offers up to 60% subsidy on solar water heaters and 40% on rooftop solar. We assist with all paperwork and applications.` },
            { q: `How long does installation take?`, a: `Solar water heater: 2-3 days. Rooftop solar: 5-10 days. Exact timeline provided after survey.` },
            { q: `What maintenance is required?`, a: `Annual maintenance with pre-monsoon descaling recommended. Our optional AMC (₹150-300/month) includes quarterly visits and 24/7 emergency support.` },
            { q: `Is emergency repair available in ${neighborhood.name}?`, a: `Yes. AMC customers get 24/7 support with same-day or next-day response. Non-AMC: we respond within 48 hours when possible.` },
          ]}
        />
      </section>

      <section className="mt-12 rounded-lg border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 p-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Get Started in {neighborhood.name} Today</h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">Free site survey, transparent quote, and subsidy guidance. No obligation.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/contact" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
            Request Quote
          </a>
          <a href={`tel:${phone}`} className="inline-block px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition">
            Call Now: {phone}
          </a>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Service Areas Near {neighborhood.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(nhData.neighborhoods[cityKey] || []).slice(0, 8).map((n: any) => (
            <Link
              key={n.slug}
              href={`/locations/neighborhoods/${cityKey}-${n.slug}`}
              className="px-3 py-2 rounded border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm transition"
            >
              {n.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
