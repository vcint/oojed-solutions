import fs from 'fs/promises';
import path from 'path';
import data from '@/data/site.json';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';

const DEFAULT_CITY = 'Pune';
const fillCity = (text: any, city?: string) => {
  if (text == null) return text;
  const c = String(city || DEFAULT_CITY);
  try {
    return String(text).replace(/\{\{\s*city\s*\}\}/gi, c);
  } catch (e) {
    return text;
  }
};

export async function generateStaticParams() {
  return data.services.map((s: any) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: any }) {
  const svc = data.services.find((s: any) => s.slug === params.slug);
  if (!svc) return { title: 'Service' };
  // Ensure the brand name is present in page titles for consistent SEO
  let title = fillCity(svc.metaTitle || svc.name);
  if (!/oojed/i.test(title)) {
    title = `${title} — OOJED`;
  }
  const description = fillCity(svc.metaDescription || svc.short || svc.long);
  const url = `https://oojed.com/services/${encodeURIComponent(params.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'OOJED',
    },
  };
}

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

export default async function ServicePage({ params }: { params: any }) {
  const svc = data.services.find((s: any) => s.slug === params.slug);
  if (!svc) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-4">We couldn't find the requested service. <Link href="/">Return home</Link>.</p>
      </main>
    );
  }

  const images = await getImagesFor('services', params.slug);

  return (
    <main className="container py-12">
      <div className="max-w-3xl">
        <nav className="text-sm text-slate-500 mb-3">
          <Link href="/services" className="hover:underline">Services</Link>
          <span className="mx-2">/</span>
          <span className="font-medium">{svc.name}</span>
        </nav>

        {/* Breadcrumb JSON-LD for this service page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://oojed.com/services' },
            { '@type': 'ListItem', position: 2, name: svc.name, item: `https://oojed.com/services/${encodeURIComponent(params.slug)}` },
          ],
        }) }} />

        <h1 className="text-3xl font-bold">{svc.name}</h1>
        {/* SEO: keyword-rich intro to assist indexing */}
        {(svc.metaDescription || svc.long) && (
          <p className="mt-3 text-lg text-slate-700">{fillCity(svc.metaDescription || svc.long)}</p>
        )}
        {images && images.length > 0 && (
          <div className="mt-6">
            <ImageGallery images={images} alt={svc.name} />
          </div>
        )}

  {svc.metaDescription && <p className="mt-4 text-lg text-slate-700">{fillCity(svc.metaDescription)}</p>}
  {svc.long && <div className="mt-6 text-slate-700 leading-relaxed">{fillCity(svc.long)}</div>}

        {svc.highlights && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <ul className="list-disc list-inside mt-2">
              {svc.highlights.map((h: string) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQPage JSON-LD if service has FAQs */}
        {Array.isArray((svc as any).faqs) && (svc as any).faqs.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (svc as any).faqs.map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }) }} />
        )}

        {/* Related product categories with descriptive anchors */}
        <section className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Related product categories</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><Link href="/products/solar-water-heaters" className="text-blue-700 hover:underline">Solar Water Heaters — ETC/FPC systems with installation & AMC</Link></li>
            <li><Link href="/products/led-lighting" className="text-blue-700 hover:underline">LED Street & Flood Lighting — IP65, surge protected</Link></li>
            <li><Link href="/products/solar-pumps" className="text-blue-700 hover:underline">Solar Water Pumps — correctly sized head/flow with MPPT/VFD</Link></li>
          </ul>
        </section>

        <div className="mt-8">
          <Button href="/contact" variant="primary">Request this service</Button>
        </div>
      </div>
    </main>
  );
}
