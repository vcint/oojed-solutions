import fs from 'fs/promises';
import path from 'path';
import data from '@/data/site.json';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import FaqAccordion from '@/components/FaqAccordion';

const DEFAULT_CITY = 'Pune';
const DEFAULT_CITY_SLUG = 'pune';
const fillCity = (text: any, city?: string) => {
  if (text == null) return text;
  const c = String(city || DEFAULT_CITY);
  try {
    return String(text)
      .replace(/\{\{\s*city\s*\}\}/gi, c)
      .replace(/Pune,\s*Maharashtra/gi, `${c}, Maharashtra`)
      .replace(/\bPune\b/gi, c);
  } catch (e) {
    return text;
  }
};

// inline param types to avoid Next.js PageProps generic conflicts

const buildSlug = (s: string) => String(s || '').replace(/\s+/g, '-').toLowerCase();

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
  const categories = Array.isArray((data as any).categories) ? (data as any).categories : [];
  return categories.map((c: any) => ({ slug: buildSlug(String(c.slug || c.name || '')) }));
}

export async function generateMetadata({ params }: { params: any }) {
  const slug = String(params.slug || '').toLowerCase();
  const cat = (data as any).categories?.find((c: any) => buildSlug(String(c.slug || c.name)) === slug);
  if (!cat) return { title: 'Product — OOJED' } as any;
  const title = fillCity(cat.metaTitle || `${cat.name} — OOJED`);
  const description = fillCity(cat.metaDescription || cat.desc || cat.long || `Explore ${cat.name} from OOJED.`);
  const url = `https://oojed.com/products/${encodeURIComponent(slug)}`;
  const keywords = Array.isArray(cat.keywords) ? cat.keywords.map((k: string) => fillCity(k)) : undefined;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'OOJED',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'og:site_name': 'OOJED',
    },
  } as any;
}

export default async function ProductPage({ params }: { params: any }) {
  const slug = String(params.slug || '').toLowerCase();
  const cat = (data.categories || []).find((c: any) => buildSlug(String(c.slug || c.name)) === slug);

  if (!cat) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">We couldn't find the requested product. <Link href="/">Return home</Link>.</p>
      </main>
    );
  }

  const images = await getImagesFor('products', slug);
  const introCopy = fillCity(cat.metaDescription || cat.desc || cat.long || '');
  const metaCopy = fillCity(cat.metaDescription || '');
  const longCopy = fillCity(cat.long || '');
  const showIntro = introCopy.trim().length > 0;
  const showMetaCopy = metaCopy && metaCopy !== introCopy;
  const showLongCopy = longCopy && longCopy !== introCopy;

  return (
    <main className="container py-12">
      <div className="max-w-3xl">
        <nav className="text-sm text-slate-500 mb-3">
          <Link href="/products" className="hover:underline">Products</Link>
          <span className="mx-2">/</span>
          <span className="font-medium">{cat.name}</span>
        </nav>

        <h1 className="text-3xl font-bold">{cat.name}</h1>
        {/* SEO: keyword-rich intro to assist indexing */}
        {showIntro && (
          <p className="mt-3 text-lg text-slate-700">
            {introCopy}
          </p>
        )}
        {/* BreadcrumbList JSON-LD for better context */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Products', item: 'https://oojed.com/products' },
            { '@type': 'ListItem', position: 2, name: cat.name, item: `https://oojed.com/products/${encodeURIComponent(slug)}` },
          ],
        }) }} />

        {/* ItemList/OfferCatalog JSON-LD describing the category and representative items */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: cat.name,
    description: fillCity(cat.metaDescription || cat.desc || undefined),
          url: `https://oojed.com/products/${encodeURIComponent(slug)}`,
          itemListElement: Array.isArray(cat.items) ? cat.items.map((label: string, idx: number) => ({
            '@type': 'OfferCatalog',
            name: label,
            position: idx + 1,
          })) : undefined,
        }) }} />
        {images && images.length > 0 && (
          <div className="mt-6">
            <ImageGallery images={images} alt={cat.name} />
          </div>
        )}

        {/* Expanded narrative */}
        {showMetaCopy && (
          <p className="mt-4 text-lg text-slate-700">{metaCopy}</p>
        )}
        {showLongCopy && (
          <div className="mt-6 text-slate-700 leading-relaxed">
            {longCopy}
          </div>
        )}

        <section className="mt-6 space-y-4 text-slate-700 leading-relaxed">
          <p>
            {fillCity(`We source and assemble ${cat.name.toLowerCase()} using component partners who meet BIS, MNRE and ISO standards, then configure the solution to match Indian site realities. From plumbing interfaces to mounting structures and electrical protections, every element is pre-engineered so installation is swift and repeatable even on challenging rooftops or industrial layouts.`)}
          </p>
          <p>
            {fillCity(`During specification we look beyond nameplate ratings. Heat losses, flow rates, wiring runs, surge protection, water quality and future expansion needs are all factored into the bill of materials. The result is a system that performs exactly as promised, with fewer callbacks and a lower lifetime cost of ownership.`)}
          </p>
          <p>
            {fillCity(`After commissioning you get access to spare-part support, AMC visits and remote guidance from OOJED experts. Documentation packs include wiring diagrams, plumbing schematics, preventive maintenance checklists and warranty contacts so facility teams can operate with confidence.`)}
          </p>
        </section>

        <section className="mt-6 border rounded-lg bg-white/60 px-5 py-4">
          <h2 className="text-xl font-semibold">Why organisations choose {cat.name.toLowerCase()} from OOJED</h2>
          <ul className="list-disc list-inside mt-3 space-y-2 text-slate-700">
            <li>{fillCity(`Seasoned engineering support for sizing, layout optimisation and subsidy/net-metering paperwork when applicable.`)}</li>
            <li>{fillCity(`Rapid deployment model with pre-tested assemblies, trained technicians and safety-compliant work practices.`)}</li>
            <li>{fillCity(`Lifecycle services covering warranty claims, emergency callouts and structured AMC programs tailored to usage intensity.`)}</li>
            <li>{fillCity(`Transparent reporting with performance baselines, O&M logs and upgrade recommendations to keep your asset productive.`)}</li>
          </ul>
        </section>

        {cat.items && cat.items.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">Representative items</h2>
            <ul className="list-disc list-inside mt-2">
              {cat.items.map((it: string) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>
        )}

        {/* render quick specs if available */}
        {cat.__optional && cat.__optional.quickSpecs && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">Quick specs</h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(cat.__optional.quickSpecs).map(([k, v]) => (
                <div key={k} className="text-sm">
                  <div className="font-semibold">{k}</div>
                  <div className="muted">{String((v as any) || '')}</div>
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
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ JSON-LD + visible accordion: placed after product details so it doesn't interrupt the intro */}
        {((cat as any).__optional?.faq || (cat as any).faqs) && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: ((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({
                  '@type': 'Question',
                  name: fillCity(f.q),
                  acceptedAnswer: { '@type': 'Answer', text: fillCity(f.a) },
                })),
              }) }}
            />

            <section className="mt-8" aria-labelledby="product-faqs">
              <h2 id="product-faqs" className="text-xl font-semibold">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion items={((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({ q: fillCity(f.q), a: fillCity(f.a) }))} idPrefix={`prod-faq-${encodeURIComponent(slug)}`} />
              </div>
            </section>
          </>
        )}

        {/* Related services with descriptive anchors */}
        <section className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Related services</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><Link href={`/services/installation?city=${encodeURIComponent(DEFAULT_CITY_SLUG)}`} className="text-blue-700 hover:underline">Solar installation & commissioning services</Link></li>
            <li><Link href={`/services/amc?city=${encodeURIComponent(DEFAULT_CITY_SLUG)}`} className="text-blue-700 hover:underline">Annual Maintenance Contracts (AMC) for solar systems</Link></li>
            <li><Link href={`/services/repair?city=${encodeURIComponent(DEFAULT_CITY_SLUG)}`} className="text-blue-700 hover:underline">Repair and service for {cat.name.toLowerCase()}</Link></li>
          </ul>
        </section>

        <div className="mt-8">
          <Button href={`/contact?city=${encodeURIComponent(DEFAULT_CITY_SLUG)}`} variant="primary">Contact us for pricing &amp; sizing</Button>
        </div>
      </div>
    </main>
  );
}
