import site from '@/data/site.json';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';

type Props = { params: { city: string, category: string } };

const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');

const findCityName = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  return cities.find((c) => toSlug(c) === slug) || slug;
};

const categories = Array.isArray((site as any).categories) ? (site as any).categories : [];
const findCategory = (slug: string) => categories.find((c: any) => toSlug(c?.slug || c?.name) === slug);

export async function generateStaticParams() {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const cats: any[] = Array.isArray((site as any).categories) ? (site as any).categories : [];
  const pairs: { city: string, category: string }[] = [];
  for (const c of cities) {
    for (const k of cats) {
      pairs.push({ city: toSlug(c), category: toSlug(k?.slug || k?.name || '') });
    }
  }
  return pairs;
}

export async function generateMetadata({ params }: Props) {
  const cityName = findCityName(params.city);
  const cat = findCategory(params.category);
  const catName = cat?.name || 'Category';
  const title = `${catName} in ${cityName} — Installation, Repair, AMC | OOJED`;
  const baseDesc = cat?.metaDescription || cat?.desc || cat?.long || `Explore ${catName}.`;
  const description = `${baseDesc} Available in ${cityName} with site survey, installation, and AMC.`;
  const url = `https://oojed.com/locations/${encodeURIComponent(params.city)}/${encodeURIComponent(params.category)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'OOJED' },
    twitter: { card: 'summary_large_image', title, description },
  } as any;
}

export default function CityCategoryPage({ params }: Props) {
  const cityName = findCityName(params.city);
  const cat = findCategory(params.category);
  if (!cat) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-4">We couldn’t find that category for {cityName}. <Link href={`/locations/${params.city}`} className="underline">Browse city page</Link>.</p>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <nav className="text-sm text-slate-500 mb-3">
        <Link href="/locations" className="hover:underline">Service Areas</Link>
        <span className="mx-2">/</span>
        <Link href={`/locations/${params.city}`} className="hover:underline">{cityName}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{cat.name}</span>
      </nav>

      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Service Areas', item: 'https://oojed.com/locations' },
          { '@type': 'ListItem', position: 2, name: cityName, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}` },
          { '@type': 'ListItem', position: 3, name: cat.name, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}/${encodeURIComponent(params.category)}` },
        ],
      }) }} />

      <h1 className="text-3xl font-bold">{cat.name} in {cityName}</h1>
      {cat.metaDescription && (
        <p className="mt-4 text-lg text-slate-700">{cat.metaDescription} Available in {cityName}.</p>
      )}
      {cat.long && (
        <div className="mt-6 text-slate-700 leading-relaxed">
          {cat.long}
        </div>
      )}

      {/* Local intent FAQ JSON-LD combining category FAQs with local questions */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          ...(((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))),
          { '@type': 'Question', name: `Do you install ${cat.name.toLowerCase()} in ${cityName}?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. We survey, supply and install ${cat.name.toLowerCase()} in ${cityName}, with repair and AMC options.` } },
          { '@type': 'Question', name: 'How soon can you schedule?', acceptedAnswer: { '@type': 'Answer', text: 'Installation typically within 2–7 days post survey and material readiness.' } },
        ],
      }) }} />

      <TrustBar />

      <div className="mt-8">
        <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg">Request {cat.name} quote in {cityName}</Link>
      </div>
    </main>
  );
}

