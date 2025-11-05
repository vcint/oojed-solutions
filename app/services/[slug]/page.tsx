import fs from 'fs/promises';
import path from 'path';
import data from '@/data/site.json';
import Link from 'next/link';
import { cookies } from 'next/headers';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import FaqAccordion from '@/components/FaqAccordion';
import type { Metadata } from 'next';

const DEFAULT_CITY = 'Pune';
const CITY_COOKIE = 'oojed_city';
const toCitySlug = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
const knownCities: string[] = Array.isArray((data as any).cities) ? (data as any).cities : [];

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

type SearchParams = Record<string, string | string[] | undefined>;
type ParamsPromise = Promise<{ slug: string }>;
type SearchParamsPromise = Promise<SearchParams | undefined>;

const normalizeCity = (value?: string | null) => {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const resolveCityFromParams = (searchParams?: SearchParams, cookieCity?: string | null) => {
  const rawParam = searchParams ? (Array.isArray(searchParams.city) ? searchParams.city[0] : searchParams.city) : undefined;
  const orderedCandidates = [rawParam, cookieCity, DEFAULT_CITY];
  for (const candidate of orderedCandidates) {
    if (!candidate) continue;
    const slugCandidate = toCitySlug(candidate);
    if (!slugCandidate) continue;
    const matched = knownCities.find((city) => toCitySlug(city) === slugCandidate);
    if (matched) return matched;
    const normalized = normalizeCity(candidate);
    if (normalized) return normalized;
  }
  return DEFAULT_CITY;
};

export async function generateStaticParams() {
  return data.services.map((s: any) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: ParamsPromise }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = String(rawSlug || '').toLowerCase();
  const svc = data.services.find((s: any) => String(s.slug || '').toLowerCase() === slug);
  if (!svc) return { title: 'Service' };
  // Ensure the brand name is present in page titles for consistent SEO
  let title = fillCity(svc.metaTitle || svc.name);
  if (!/oojed/i.test(title)) {
    title = `${title} — OOJED`;
  }
  const description = fillCity(svc.metaDescription || svc.short || svc.long);
  const url = `https://oojed.com/services/${encodeURIComponent(rawSlug)}`;
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

// Do not declare an explicit PageProps type here — Next.js inserts a build-time
// compatibility check that can be brittle across versions. Accept a generic
// props object and resolve `params`/`searchParams` whether they're Promises
// (as some Next.js runtimes provide) or plain objects.
export default async function ServicePage(props: any) {
  const { params, searchParams } = props || {};
  const resolvedParams = params instanceof Promise ? await params : params;
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const slug = String(resolvedParams?.slug || '').toLowerCase();
  const cookieStore = await Promise.resolve(cookies());
  const cookieCity = cookieStore.get(CITY_COOKIE)?.value;
  const searchObj = resolvedSearchParams || {};
  const cityName = resolveCityFromParams(searchObj, cookieCity);
  const citySlug = toCitySlug(cityName);
  const svc = data.services.find((s: any) => String(s.slug || '').toLowerCase() === slug);
  if (!svc) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-4">We couldn't find the requested service. <Link href="/">Return home</Link>.</p>
      </main>
    );
  }

  const canonicalSlug = String(svc.slug || slug);
  const encodedSlug = encodeURIComponent(canonicalSlug);
  const slugForId = toCitySlug(canonicalSlug);
  const images = await getImagesFor('services', canonicalSlug);
  const introCopy = fillCity(svc.short || svc.metaDescription || svc.long || ``, cityName);
  const metaCopy = fillCity(svc.metaDescription || ``, cityName);
  const longCopy = fillCity(svc.long || ``, cityName);
  const showMetaCopy = metaCopy && metaCopy !== introCopy;
  const showLongCopy = longCopy && longCopy !== introCopy;

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
            { '@type': 'ListItem', position: 2, name: svc.name, item: `https://oojed.com/services/${encodedSlug}` },
          ],
        }) }} />

        <h1 className="text-3xl font-bold">{svc.name}</h1>
        {/* SEO: keyword-rich intro to assist indexing */}
        {introCopy && (
          <p className="mt-3 text-lg text-slate-700">{introCopy}</p>
        )}
        {images && images.length > 0 && (
          <div className="mt-6">
            <ImageGallery images={images} alt={svc.name} />
          </div>
        )}

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
            {fillCity(`Every ${svc.name.toLowerCase()} engagement in {{city}} starts with a collaborative workshop where we document constraints, energy targets and stakeholder expectations. This discovery phase enables our design desk to propose sizing, layouts and commercial models that achieve the desired payback without compromising reliability.`, cityName)}
          </p>
          <p>
            {fillCity(`Once designs are agreed, our local execution team in {{city}} prepares a clear mobilisation calendar covering procurement, statutory permissions, scaffolding, electrical and plumbing hooks, trials and hand-over. Daily progress updates, photo logs and site reports keep you in control even when work is underway across multiple rooftops or facilities.`, cityName)}
          </p>
          <p>
            {fillCity(`Post commissioning, we stay in close contact. Performance analytics, seasonal tune-ups and training refreshers for your operations staff ensure the system keeps delivering the promised savings. If alerts or breakdowns occur, a dedicated support lane for {{city}} customers gets you a technician with genuine spare parts in the shortest possible time.`, cityName)}
          </p>
        </section>

        <section className="mt-6 border rounded-lg bg-white/60 px-5 py-4">
          <h2 className="text-xl font-semibold">What you get with {svc.name.toLowerCase()}</h2>
          <ul className="list-disc list-inside mt-3 space-y-2 text-slate-700">
            <li>{fillCity(`Tailored engineering package covering drawings, single-line diagrams, data sheets and a transparent bill of materials ready for approvals in {{city}}.`, cityName)}</li>
            <li>{fillCity(`Dedicated project manager, WhatsApp group and escalation matrix so decisions are never delayed during on-site execution in {{city}}.`, cityName)}</li>
            <li>{fillCity(`Comprehensive documentation kit with warranty cards, service schedule and AMC options to keep your system compliant and efficient.`, cityName)}</li>
            <li>{fillCity(`Priority service response, remote troubleshooting support and proactive performance audits scheduled across the year.`, cityName)}</li>
          </ul>
        </section>
        {svc.highlights && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <ul className="list-disc list-inside mt-2">
              {svc.highlights.map((h: string) => (
                <li key={h}>{fillCity(h, cityName)}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQPage JSON-LD if service has FAQs (and visible accordion) */}
        {Array.isArray((svc as any).faqs) && (svc as any).faqs.length > 0 && (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: (svc as any).faqs.map((f: any) => ({ '@type': 'Question', name: fillCity(f.q, cityName), acceptedAnswer: { '@type': 'Answer', text: fillCity(f.a, cityName) } })),
            }) }} />

            <section className="mt-8" aria-labelledby="service-faqs">
              <h2 id="service-faqs" className="text-xl font-semibold">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion items={(svc as any).faqs.map((f: any) => ({ q: fillCity(f.q, cityName), a: fillCity(f.a, cityName) }))} idPrefix={`svc-faq-${slugForId}-${toCitySlug(cityName)}`} />
              </div>
            </section>
          </>
        )}

        {/* Related product categories with descriptive anchors */}
        <section className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Related product categories</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><Link href={`/products/solar-water-heaters?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Solar Water Heaters — ETC/FPC systems with installation & AMC</Link></li>
            <li><Link href={`/products/led-lighting?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">LED Street & Flood Lighting — IP65, surge protected</Link></li>
            <li><Link href={`/products/solar-pumps?city=${encodeURIComponent(citySlug)}`} className="text-blue-700 hover:underline">Solar Water Pumps — correctly sized head/flow with MPPT/VFD</Link></li>
          </ul>
        </section>

        <div className="mt-8">
          <Button href={`/contact?city=${encodeURIComponent(citySlug)}`} variant="primary">
            Request this service in {cityName}
          </Button>
        </div>
      </div>
    </main>
  );
}
