import fs from 'fs/promises';
import path from 'path';
import data from '@/data/site.json';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';

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
  const title = cat.metaTitle || `${cat.name} — OOJED`;
  const description = cat.metaDescription || cat.desc || cat.long || `Explore ${cat.name} from OOJED.`;
  const url = `https://oojed.com/products/${encodeURIComponent(slug)}`;
  const keywords = Array.isArray(cat.keywords) ? cat.keywords : undefined;
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

  return (
    <main className="container py-12">
      <div className="max-w-3xl">
        <nav className="text-sm text-slate-500 mb-3">
          <Link href="/products" className="hover:underline">Products</Link>
          <span className="mx-2">/</span>
          <span className="font-medium">{cat.name}</span>
        </nav>

        <h1 className="text-3xl font-bold">{cat.name}</h1>
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
          description: cat.metaDescription || cat.desc || undefined,
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

        {/* FAQPage JSON-LD if FAQs are present in data */}
        {((cat as any)?.__optional?.faq || (cat as any)?.faqs) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: ((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }),
            }}
          />
        )}

        {cat.metaDescription && <p className="mt-4 text-lg text-slate-700">{cat.metaDescription}</p>}
        {cat.long && <div className="mt-6 text-slate-700 leading-relaxed">{cat.long}</div>}

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

        {/* Related services with descriptive anchors */}
        <section className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Related services</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><Link href="/services/installation" className="text-blue-700 hover:underline">Solar installation & commissioning services (Pune, Maharashtra)</Link></li>
            <li><Link href="/services/amc" className="text-blue-700 hover:underline">Annual Maintenance Contracts (AMC) for solar systems</Link></li>
            <li><Link href="/services/repair" className="text-blue-700 hover:underline">Repair and service for {cat.name.toLowerCase()}</Link></li>
          </ul>
        </section>

        <div className="mt-8">
          <Button href="/contact" variant="primary">Contact us for pricing &amp; sizing</Button>
        </div>
      </div>
    </main>
  );
}
