import site from '@/data/site.json';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import TrustBar from '@/components/TrustBar';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import FaqAccordion from '@/components/FaqAccordion';
import fs from 'fs/promises';
import path from 'path';

// inline param types to avoid conflicting with Next.js PageProps generic


const toSlug = (s: string) => String(s || '').toLowerCase().replace(/\s+/g, '-');

const findCityName = (slug: string) => {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  return cities.find((c) => toSlug(c) === slug); // return undefined if not found
};

const categories = Array.isArray((site as any).categories) ? (site as any).categories : [];
const services = Array.isArray((site as any).services) ? (site as any).services : [];
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
  if (!cityName) return { title: 'City Not Found | OOJED' };

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

  // If city is not in our service areas list, show 404
  if (!cityName) {
    notFound();
  }

  const requestedSlug = toSlug(params.category);
  const cat = findCategory(requestedSlug);
  if (!cat) {
    const serviceMatch = services.find((svc: any) => toSlug(svc?.slug || svc?.name) === requestedSlug);
    if (serviceMatch?.slug) {
      redirect(`/services/${encodeURIComponent(serviceMatch.slug)}?city=${encodeURIComponent(params.city)}`);
    }
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="mt-4">We couldn't find that category for {cityName}. <Link href={`/locations/${params.city}`} className="underline">Browse city page</Link>.</p>
      </main>
    );
  }

  // server-side: fetch images for this category (product images folder)
  const slug = toSlug(cat.slug || cat.name);
  const images = await getImagesFor('products', slug);
  const introCopy = localizeText(cat.metaDescription || cat.desc || cat.long || '', cityName);
  const metaCopy = localizeText(cat.metaDescription || '', cityName);
  const longCopy = localizeText(cat.long || '', cityName);
  const showIntro = introCopy && introCopy.trim().length > 0;
  const showMetaCopy = metaCopy && metaCopy !== introCopy;
  const showLongCopy = longCopy && longCopy !== introCopy;

  const rawFaqs: any[] = Array.isArray((cat as any).__optional?.faq)
    ? (cat as any).__optional?.faq
    : Array.isArray((cat as any).faqs)
      ? (cat as any).faqs
      : [];
  const localizedFaqs = rawFaqs
    .map((f: any) => ({
      q: localizeText(f?.q, cityName),
      a: localizeText(f?.a, cityName),
    }))
    .filter((f) => typeof f.q === 'string' && f.q.trim() && typeof f.a === 'string' && f.a.trim())
    .map((f) => ({ q: String(f.q).trim(), a: String(f.a).trim() }));

  const supplementalFaqs = [
    {
      q: localizeText(`Do you install ${cat.name.toLowerCase()} in ${cityName}?`, cityName),
      a: localizeText(`Yes. We survey, supply and install ${cat.name.toLowerCase()} in ${cityName}, with repair and AMC options.`, cityName),
    },
    {
      q: localizeText(`How soon can installation be scheduled in ${cityName}?`, cityName),
      a: 'Installation typically happens within 2–7 business days after the site survey and material confirmation.',
    },
  ]
    .filter((f) => typeof f.q === 'string' && f.q.trim() && typeof f.a === 'string' && f.a.trim())
    .map((f) => ({ q: String(f.q).trim(), a: String(f.a).trim() }));

  const combinedFaqs: { q: string; a: string }[] = [...localizedFaqs, ...supplementalFaqs];
  const faqEntities = combinedFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  }));
  const faqIdPrefix = `city-cat-faq-${toSlug(`${params.city}-${params.category}`)}`;

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Service Areas', item: 'https://oojed.com/locations' },
            { '@type': 'ListItem', position: 2, name: cityName, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}` },
            { '@type': 'ListItem', position: 3, name: cat.name, item: `https://oojed.com/locations/${encodeURIComponent(params.city)}/${encodeURIComponent(params.category)}` },
          ],
        })
      }} />

      <h1 className="text-3xl font-bold">{cat.name} in {cityName}</h1>
      {/* server-side image lookup for this category (same UX as product pages) */}
      {images && images.length > 0 && (
        <div className="mt-6">
          <ImageGallery images={images} alt={cat.name} />
        </div>
      )}
      {/* We'll show the description and long copy, localized for the city */}
      {showIntro && (
        <p className="mt-4 text-lg text-slate-700">
          {introCopy} Available in {cityName}.
        </p>
      )}
      {showMetaCopy && (
        <p className="mt-4 text-lg text-slate-700">{metaCopy}</p>
      )}
      {showLongCopy && (
        <div className="mt-6 text-slate-700 leading-relaxed">{longCopy}</div>
      )}

      <section className="mt-6 space-y-4 text-slate-700 leading-relaxed">
        <p>
          {localizeText(`OOJED engineers in {{city}} begin every ${cat.name.toLowerCase()} engagement with a detailed walk-through of your site, roof access, civil constraints and utility connections. This helps us tailor collector angles, structural supports, piping diameters and electrical protections so the installation lasts through monsoons and high-heat summers.`, cityName)}
        </p>
        <p>
          {localizeText(`We assemble components from BIS and MNRE-compliant partners, then pre-test subsystems at our works before dispatch. On-site, our technicians coordinate with your facilities team or resident welfare association in {{city}} to schedule shutdowns, crane lifts and plumbing tie-ins with minimal disruption.`, cityName)}
        </p>
        <p>
          {localizeText(`After commissioning, OOJED provides maintenance checklists, spares assurance and AMC plans dedicated to {{city}} customers. Our service desk tracks service-level commitments and ensures escalations are handled by technicians who understand the local water quality, pressure challenges and municipal compliance norms.`, cityName)}
        </p>
      </section>

      <section className="mt-6 border rounded-lg bg-white/60 px-5 py-4">
        <h2 className="text-xl font-semibold">What this includes for {cityName}</h2>
        <ul className="list-disc list-inside mt-3 space-y-2 text-slate-700">
          <li>{localizeText(`Project plan covering survey, design approval, material delivery and execution milestones matched to timelines in {{city}}.`, cityName)}</li>
          <li>{localizeText(`Dedicated coordinator, photo-logged progress updates and a transparent escalation ladder while work is underway.`, cityName)}</li>
          <li>{localizeText(`As-built drawings, warranty cards and subsidy/net-metering documentation bundled for your records in {{city}}.`, cityName)}</li>
          <li>{localizeText(`Priority service response with trained technicians and genuine spares stocked close to {{city}}.`, cityName)}</li>
        </ul>
      </section>

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

      {combinedFaqs.length > 0 && (
        <section className="mt-8" aria-labelledby="city-category-faqs">
          <h2 id="city-category-faqs" className="text-xl font-semibold">Frequently asked questions — {cityName}</h2>
          <div className="mt-4">
            <FaqAccordion
              items={combinedFaqs}
              idPrefix={faqIdPrefix}
            />
          </div>
        </section>
      )}

      {faqEntities.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqEntities,
          })
        }} />
      )}

      {/* OfferCatalog JSON-LD describing the category and representative items (localized) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: localizeText(cat.name, cityName),
          description: localizeText(cat.metaDescription || cat.desc || undefined, cityName),
          url: `https://oojed.com/locations/${encodeURIComponent(params.city)}/${encodeURIComponent(params.category)}`,
          itemListElement: Array.isArray(cat.items) ? cat.items.map((label: string, idx: number) => ({ '@type': 'OfferCatalog', name: localizeText(label, cityName), position: idx + 1 })) : undefined,
        })
      }} />

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
        <Button href={`/contact?city=${encodeURIComponent(toSlug(cityName))}`} variant="primary">Request {localizeText(cat.name, cityName)} quote in {cityName}</Button>
      </div>
    </main>
  );
}
