import site from '@/data/site.json';
import Link from 'next/link';
import TrustBar from '@/components/TrustBar';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import fs from 'fs/promises';
import path from 'path';

// inline param types to avoid conflicting with Next.js PageProps generic


const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');

const findCityName = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  return cities.find((c) => toSlug(c) === slug) || slug;
};

const categories = Array.isArray((site as any).categories) ? (site as any).categories : [];
const findCategory = (slug: string) => categories.find((c: any) => toSlug(c?.slug || c?.name) === slug);

const localizeText = (text: string | undefined, cityName: string) => {
  if (!text) return text;
  // Replace exact mentions of 'Pune' or 'Pune, Maharashtra' with the target city
  return String(text)
    .replace(/Pune,?\s*Maharashtra/gi, `${cityName}`)
    .replace(/\bPune\b/gi, `${cityName}`)
    // Support placeholder substitution: {{city}} or {{ city }}
    .replace(/\{\{\s*city\s*\}\}/gi, `${cityName}`);
};

const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function getImagesFor(base: 'products' | 'services', slug: string) {
  const publicDir = path.join(process.cwd(), 'public');
  const decoded = String(slug || '').trim().replace(/^\/+|\/+$/g, '');

  // try direct folder first
  const candidate = path.join(publicDir, base, decoded);
  let stat = await fs.stat(candidate).catch(() => null);
  if (stat && stat.isDirectory()) {
    const files = (await fs.readdir(candidate)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
    return files.map((f) => encodeURI(`/${base}/${decoded}/${f}`));
  }

  // fallback: scan base directory for a matching folder (normalize names)
  const basePath = path.join(publicDir, base);
  const dirents = await fs.readdir(basePath, { withFileTypes: true }).catch(() => [] as any[]);
  const match = (dirents || []).find((d: any) => {
    if (!d || !d.isDirectory) return false;
    const name = d.name || '';
    return normalize(name) === normalize(decoded) || normalize(name.replace(/\s+/g, '-')) === normalize(decoded);
  });
  if (match && match.name) {
    const resolved = path.join(basePath, match.name);
    const files = (await fs.readdir(resolved)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
    return files.map((f) => encodeURI(`/${base}/${match.name}/${f}`));
  }

  return [];
}

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

export async function generateMetadata({ params }: { params: any }) {
  const cityName = findCityName(params.city);
  const cat = findCategory(params.category);
  const catName = cat?.name || 'Category';
  const title = `${catName} in ${cityName} — Installation, Repair, AMC | OOJED`;
  const baseDesc = localizeText(cat?.metaDescription || cat?.desc || cat?.long || `Explore ${catName}.`, cityName);
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

export default async function CityCategoryPage({ params }: { params: any }) {
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

  // server-side: fetch images for this category (product images folder)
  const slug = toSlug(cat.slug || cat.name);
  const images = await getImagesFor('products', slug);

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
      {/* server-side image lookup for this category (same UX as product pages) */}
      {images && images.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={images} alt={cat.name} />
        </div>
      )}
      {/* We'll show the description and long copy, localized for the city */}
      {cat.metaDescription && (
        <p className="mt-4 text-lg text-slate-700">{localizeText(cat.metaDescription, cityName)} Available in {cityName}.</p>
      )}
      {cat.long && (
        <div className="mt-6 text-slate-700 leading-relaxed">{localizeText(cat.long, cityName)}</div>
      )}

      {/* Representative items (same as product page) */}
      {cat.items && cat.items.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Representative items</h2>
          <ul className="list-disc list-inside mt-2">
            {cat.items.map((it: string) => (
              <li key={it}>{localizeText(it, cityName)}</li>
            ))}
          </ul>
        </section>
      )}

      {/* quick specs */}
      {cat.__optional && cat.__optional.quickSpecs && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Quick specs</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(cat.__optional.quickSpecs).map(([k, v]) => (
              <div key={k} className="text-sm">
                <div className="font-semibold">{k}</div>
                <div className="muted">{localizeText(String((v as any) || ''), cityName)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {cat.highlights && cat.highlights.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="list-disc list-inside mt-2">
            {cat.highlights.map((h: string) => (
              <li key={h}>{localizeText(h, cityName)}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Local intent FAQ JSON-LD combining category FAQs with local questions */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          ...(((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({ '@type': 'Question', name: localizeText(f.q, cityName), acceptedAnswer: { '@type': 'Answer', text: localizeText(f.a, cityName) } }))),
          { '@type': 'Question', name: localizeText(`Do you install ${cat.name.toLowerCase()} in ${cityName}?`, cityName), acceptedAnswer: { '@type': 'Answer', text: localizeText(`Yes. We survey, supply and install ${cat.name.toLowerCase()} in ${cityName}, with repair and AMC options.`, cityName) } },
          { '@type': 'Question', name: 'How soon can you schedule?', acceptedAnswer: { '@type': 'Answer', text: 'Installation typically within 2–7 days post survey and material readiness.' } },
        ],
      }) }} />

      {/* OfferCatalog JSON-LD describing the category and representative items (localized) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: localizeText(cat.name, cityName),
        description: localizeText(cat.metaDescription || cat.desc || undefined, cityName),
        url: `https://oojed.com/locations/${encodeURIComponent(params.city)}/${encodeURIComponent(params.category)}`,
        itemListElement: Array.isArray(cat.items) ? cat.items.map((label: string, idx: number) => ({ '@type': 'OfferCatalog', name: localizeText(label, cityName), position: idx + 1 })) : undefined,
      }) }} />

      {/* Related services with descriptive anchors (same appearance as product page) */}
      <section className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold">Related product categories</h2>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Link href="/products/solar-water-heaters" className="text-blue-700 hover:underline">Solar Water Heaters — ETC/FPC systems with installation & AMC</Link></li>
          <li><Link href="/products/led-lighting" className="text-blue-700 hover:underline">LED Street & Flood Lighting — IP65, surge protected</Link></li>
          <li><Link href="/products/solar-pumps" className="text-blue-700 hover:underline">Solar Water Pumps — correctly sized head/flow with MPPT/VFD</Link></li>
        </ul>
      </section>

      <TrustBar />

      <div className="mt-8">
        <Button href="/contact" variant="primary">Request {localizeText(cat.name, cityName)} quote in {cityName}</Button>
      </div>
    </main>
  );
}

