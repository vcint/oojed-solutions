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
  const orderedCandidates = [rawParam, cookieCity];

  // Try to find a match in our known cities list
  for (const candidate of orderedCandidates) {
    if (!candidate) continue;
    const slugCandidate = toCitySlug(candidate);
    if (!slugCandidate) continue;
    const matched = knownCities.find((city) => toCitySlug(city) === slugCandidate);
    if (matched) return matched;
  }

  // If no match found in service areas, always default to Pune
  return DEFAULT_CITY;
};

export async function generateStaticParams() {
  return data.services.map((s: any) => ({ slug: s.slug }));
}

type MetadataParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined> | undefined>;
};

export async function generateMetadata({ params, searchParams }: MetadataParams): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const resolvedSearchParams = await (searchParams ?? Promise.resolve(undefined));
  const slug = String(rawSlug || '').toLowerCase();

  // Get city from query parameter or use default
  const cityParam = resolvedSearchParams ?
    (Array.isArray(resolvedSearchParams.city) ? resolvedSearchParams.city[0] : resolvedSearchParams.city)
    : undefined;
  const cityForMeta = cityParam ?
    (knownCities.find(c => toCitySlug(c) === toCitySlug(cityParam)) || normalizeCity(cityParam) || DEFAULT_CITY)
    : DEFAULT_CITY;

  const svc = data.services.find((s: any) => String(s.slug || '').toLowerCase() === slug);
  if (!svc) return { title: 'Service' };

  // Ensure the brand name is present in page titles for consistent SEO
  let title = fillCity(svc.metaTitle || svc.name, cityForMeta);
  if (!/oojed/i.test(title)) {
    title = `${title} — OOJED`;
  }
  const description = fillCity(svc.metaDescription || svc.short || svc.long, cityForMeta);
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
  const cookieStore = await cookies();
  const cookieCity = cookieStore.get(CITY_COOKIE)?.value;
  const searchObj = resolvedSearchParams || {};
  const cityName = resolveCityFromParams(searchObj, cookieCity);
  const citySlug = toCitySlug(cityName);
  const svc = data.services.find((s: any) => String(s.slug || '').toLowerCase() === slug);
  if (!svc) {
    return (
      <main className="container py-12 pt-28 md:pt-36">
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
    <main className="relative overflow-hidden pt-28 pb-16 md:pt-36">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#eef4ff] to-white dark:from-[#040d1e] dark:via-[#08162c] dark:to-[#040b18] pointer-events-none" />
      <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-[#c9dcff]/45 blur-3xl dark:bg-[#123062]/45" />
      <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-[#b3efff]/35 blur-3xl dark:bg-[#0d2b52]/50" />

      <div className="container relative py-16 text-slate-700 dark:text-slate-200">
        <div className="space-y-8">
          <nav className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/services" className="hover:underline">Services</Link>
            <span className="opacity-60">/</span>
            <span className="font-medium text-slate-900 dark:text-white">{svc.name}</span>
          </nav>

          {/* Breadcrumb JSON-LD for this service page */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://oojed.com/services' },
                { '@type': 'ListItem', position: 2, name: svc.name, item: `https://oojed.com/services/${encodedSlug}` },
              ],
            })
          }} />

          <div className="glass-panel p-6 md:p-7 space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{svc.name}</h1>
            {introCopy && (
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-200">
                {introCopy}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-400">
              <span>{cityName}</span>
              <span className="opacity-50">|</span>
              <span>Full lifecycle support</span>
              <span className="opacity-50">|</span>
              <span>Distributor backed</span>
            </div>
          </div>
          {images && images.length > 0 && (
            <div className="mt-6">
              <ImageGallery images={images} alt={svc.name} />
            </div>
          )}

          {showMetaCopy && (
            <div className="glass-panel p-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-200">
              {metaCopy}
            </div>
          )}
          {showLongCopy && (
            <div className="glass-panel p-6 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {longCopy}
            </div>
          )}

          <section className="glass-panel mt-6 p-6 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
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

          {Array.isArray((svc as any).highlights) && (svc as any).highlights.length > 0 && (
            <section className="glass-panel mt-6 p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                What you get with {svc.name.toLowerCase()}
              </h2>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {(svc as any).highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                    <span>{fillCity(h, cityName)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQPage JSON-LD if service has FAQs (and visible accordion) */}
          {Array.isArray((svc as any).faqs) && (svc as any).faqs.length > 0 && (
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: (svc as any).faqs.map((f: any) => ({ '@type': 'Question', name: fillCity(f.q, cityName), acceptedAnswer: { '@type': 'Answer', text: fillCity(f.a, cityName) } })),
                })
              }} />

              <section className="glass-panel mt-8 p-6 md:p-8" aria-labelledby="service-faqs">
                <h2 id="service-faqs" className="text-xl font-semibold text-slate-900 dark:text-white">Frequently asked questions</h2>
                <div className="mt-4 text-slate-700 dark:text-slate-200">
                  <FaqAccordion items={(svc as any).faqs.map((f: any) => ({ q: fillCity(f.q, cityName), a: fillCity(f.a, cityName) }))} idPrefix={`svc-faq-${slugForId}-${toCitySlug(cityName)}`} />
                </div>
              </section>
            </>
          )}

          {/* Related product categories with descriptive anchors */}
          <section className="glass-panel mt-8 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Related product categories</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li><Link href={`/products/solar-water-heaters?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-white dark:hover:text-[#84c2ff]">Solar Water Heaters — ETC/FPC systems with installation &amp; AMC</Link></li>
              <li><Link href={`/products/led-lighting?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-white dark:hover:text-[#84c2ff]">LED Street &amp; Flood Lighting — IP65, surge protected</Link></li>
              <li><Link href={`/products/solar-pumps?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-white dark:hover:text-[#84c2ff]">Solar Water Pumps — correctly sized head/flow with MPPT/VFD</Link></li>
            </ul>
          </section>

          <div className="glass-panel mt-8 flex flex-wrap items-center gap-3 p-6 text-sm text-slate-700 dark:text-slate-200">
            <span>Ready to mobilise in {cityName}? Our delivery desk will share timelines, documentation checklists and a costed proposal.</span>
            <Button href={`/contact?city=${encodeURIComponent(citySlug)}`} variant="gradient">
              Request this service in {cityName}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
