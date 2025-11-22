import fs from 'fs/promises';
import path from 'path';
import data from '@/data/site.json';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/Button';
import FaqAccordion from '@/components/FaqAccordion';
import { cookies } from 'next/headers';

const DEFAULT_CITY = 'Pune';
const CITY_COOKIE = 'oojed_city';

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

const buildSlug = (s: string) => String(s || '').replace(/\s+/g, '-').toLowerCase();
const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const toCitySlug = (value?: string | null) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const knownCities: string[] = Array.isArray((data as any).cities) ? (data as any).cities : [];

const normalizeCity = (value?: string | null) => {
  if (!value) return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

type SearchParams = Record<string, string | string[] | undefined>;

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

async function getImagesFor(base: 'products' | 'services', slug: string) {
  const publicDir = path.join(process.cwd(), 'public');
  const decoded = String(slug || '').trim().replace(/^\/+|\/+$/g, '');

  const candidate = path.join(publicDir, base, decoded);
  let stat = await fs.stat(candidate).catch(() => null);
  if (stat && stat.isDirectory()) {
    const files = (await fs.readdir(candidate)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f)).sort();
    return files.map((f) => encodeURI(`/${base}/${decoded}/${f}`));
  }

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

type MetadataParams = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined> | undefined>;
};

export async function generateMetadata({ params, searchParams }: MetadataParams) {
  const resolvedParams = await params;
  const resolvedSearchParams = await (searchParams ?? Promise.resolve(undefined));
  const slug = String(resolvedParams.slug || '').toLowerCase();

  // Get city from query parameter or use default
  const cityParam = resolvedSearchParams ?
    (Array.isArray(resolvedSearchParams.city) ? resolvedSearchParams.city[0] : resolvedSearchParams.city)
    : undefined;
  const cityForMeta = cityParam ?
    (knownCities.find(c => toCitySlug(c) === toCitySlug(cityParam)) || normalizeCity(cityParam) || DEFAULT_CITY)
    : DEFAULT_CITY;

  const cat = (data as any).categories?.find((c: any) => buildSlug(String(c.slug || c.name)) === slug);
  if (!cat) return { title: 'Product — OOJED' } as any;

  // Use the actual city from URL in meta tags
  const title = fillCity(cat.metaTitle || `${cat.name} — OOJED`, cityForMeta);
  const description = fillCity(cat.metaDescription || cat.desc || cat.long || `Explore ${cat.name} from OOJED.`, cityForMeta);
  const url = `https://oojed.com/products/${encodeURIComponent(slug)}`;
  const keywords = Array.isArray(cat.keywords) ? cat.keywords.map((k: string) => fillCity(k, cityForMeta)) : undefined;

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

type PageProps = {
  params?: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParams | undefined>;
};

export default async function ProductPage({ params, searchParams }: PageProps) {
  if (!params) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">
          We couldn't resolve this product. <Link href="/">Return home</Link>.
        </p>
      </main>
    );
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await (searchParams ?? Promise.resolve(undefined));
  const slug = String(resolvedParams.slug || '').toLowerCase();
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
  const cookieStore = await Promise.resolve(cookies());
  const cookieCity = cookieStore.get(CITY_COOKIE)?.value;
  const cityName = resolveCityFromParams(resolvedSearchParams, cookieCity);
  const citySlug = toCitySlug(cityName);

  const introCopy = fillCity(cat.metaDescription || cat.desc || cat.long || '', cityName);
  const metaCopy = fillCity(cat.metaDescription || '', cityName);
  const longCopy = fillCity(cat.long || '', cityName);
  const showIntro = introCopy.trim().length > 0;
  const showMetaCopy = metaCopy && metaCopy !== introCopy;
  const showLongCopy = longCopy && longCopy !== introCopy;

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#eef4ff] to-white dark:from-[#040d1e] dark:via-[#08162c] dark:to-[#040b18] pointer-events-none" />
      <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-[#c9dcff]/45 blur-3xl dark:bg-[#123062]/45" />
      <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-[#b3efff]/35 blur-3xl dark:bg-[#0d2b52]/50" />

      <div className="container relative py-16 text-slate-700 dark:text-slate-200">
        <div className="space-y-8">
          <nav className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-[#9ab7da]">
            <Link href="/products" className="hover:underline">Products</Link>
            <span className="opacity-60">/</span>
            <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
          </nav>

          <div className="glass-panel p-6 md:p-7 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{cat.name}</h1>
            {showIntro && (
              <p className="text-base md:text-lg text-slate-600 dark:text-[#bcd5f5]">
                {introCopy}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-[#7da6db]">
              <span>{cityName}</span>
              <span className="opacity-50">|</span>
              <span>OEM partnerships</span>
              <span className="opacity-50">|</span>
              <span>Full lifecycle support</span>
            </div>
          </div>

          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Products', item: 'https://oojed.com/products' },
                { '@type': 'ListItem', position: 2, name: cat.name, item: `https://oojed.com/products/${encodeURIComponent(slug)}` },
              ],
            })
          }} />

          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OfferCatalog',
              name: cat.name,
              description: fillCity(cat.metaDescription || cat.desc || undefined, cityName),
              url: `https://oojed.com/products/${encodeURIComponent(slug)}`,
              itemListElement: Array.isArray(cat.items) ? cat.items.map((label: string, idx: number) => ({
                '@type': 'OfferCatalog',
                name: fillCity(label, cityName),
                position: idx + 1,
              })) : undefined,
            })
          }} />

          {images && images.length > 0 && (
            <div className="mt-6">
              <ImageGallery images={images} alt={cat.name} />
            </div>
          )}

          {showMetaCopy && (
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">{metaCopy}</p>
          )}
          {showLongCopy && (
            <div className="glass-panel mt-6 p-6 text-sm leading-relaxed text-slate-700 dark:text-[#bcd5f5]">
              {longCopy}
            </div>
          )}

          <section className="glass-panel mt-6 p-6 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-[#bcd5f5]">
            <p>
              {fillCity(`We source and assemble ${cat.name.toLowerCase()} using component partners who meet BIS, MNRE and ISO standards, then configure the solution to match Indian site realities. From plumbing interfaces to mounting structures and electrical protections, every element is pre-engineered so installation is swift and repeatable even on challenging rooftops or industrial layouts.`, cityName)}
            </p>
            <p>
              {fillCity(`During specification we look beyond nameplate ratings. Heat losses, flow rates, wiring runs, surge protection, water quality and future expansion needs are all factored into the bill of materials. The result is a system that performs exactly as promised, with fewer callbacks and a lower lifetime cost of ownership.`, cityName)}
            </p>
            <p>
              {fillCity(`After commissioning you get access to spare-part support, AMC visits and remote guidance from OOJED experts. Documentation packs include wiring diagrams, plumbing schematics, preventive maintenance checklists and warranty contacts so facility teams can operate with confidence.`, cityName)}
            </p>
          </section>

          <section className="glass-panel mt-6 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Why organisations choose {cat.name.toLowerCase()} from OOJED</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-[#bcd5f5]">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                <span>{fillCity(`Seasoned engineering support for sizing, layout optimisation and subsidy/net-metering paperwork when applicable.`, cityName)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                <span>{fillCity(`Rapid deployment model with pre-tested assemblies, trained technicians and safety-compliant work practices.`, cityName)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                <span>{fillCity(`Lifecycle services covering warranty claims, emergency callouts and structured AMC programs tailored to usage intensity.`, cityName)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                <span>{fillCity(`Transparent reporting with performance baselines, O&M logs and upgrade recommendations to keep your asset productive.`, cityName)}</span>
              </li>
            </ul>
          </section>

          {cat.items && cat.items.length > 0 && (
            <section className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Representative items</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-[#bcd5f5]">
                {cat.items.map((it: string) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                    <span>{fillCity(it, cityName)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cat.__optional && cat.__optional.quickSpecs && (
            <section className="glass-panel p-6 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick specs</h2>
              <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-[#bcd5f5]">
                {Object.entries(cat.__optional.quickSpecs).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6">
                    <span className="font-semibold text-slate-900 dark:text-white">{k}</span>
                    <span className="text-right">{fillCity(String((v as any) || ''), cityName)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cat.highlights && cat.highlights.length > 0 && (
            <section className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-[#bcd5f5]">
                {cat.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                    <span>{fillCity(h, cityName)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {((cat as any).__optional?.faq || (cat as any).faqs) && (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: ((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({
                      '@type': 'Question',
                      name: fillCity(f.q, cityName),
                      acceptedAnswer: { '@type': 'Answer', text: fillCity(f.a, cityName) },
                    })),
                  })
                }}
              />

              <section className="glass-panel mt-8 p-6 md:p-8" aria-labelledby="product-faqs">
                <h2 id="product-faqs" className="text-xl font-semibold text-slate-900 dark:text-white">Frequently asked questions</h2>
                <div className="mt-4 text-slate-700 dark:text-[#bcd5f5]">
                  <FaqAccordion items={((cat as any).__optional?.faq || (cat as any).faqs || []).map((f: any) => ({ q: fillCity(f.q, cityName), a: fillCity(f.a, cityName) }))} idPrefix={`prod-faq-${encodeURIComponent(slug)}`} />
                </div>
              </section>
            </>
          )}

          <section className="glass-panel mt-8 p-6 space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Related services</h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-[#bcd5f5]">
              <li><Link href={`/services/installation?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-[#5ea8ff]">Solar installation & commissioning services</Link></li>
              <li><Link href={`/services/amc?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-[#5ea8ff]">Annual Maintenance Contracts (AMC) for solar systems</Link></li>
              <li><Link href={`/services/repair?city=${encodeURIComponent(citySlug)}`} className="text-[#0f3fa6] hover:underline dark:text-[#5ea8ff]">Repair and service for {cat.name.toLowerCase()}</Link></li>
            </ul>
          </section>

          <div className="glass-panel mt-8 p-6 flex flex-wrap items-center gap-3">
            <div className="text-sm text-slate-700 dark:text-[#bcd5f5]">
              Ready for numbers? Share your load profile and receive an engineered quote within one business day.
            </div>
            <Button href={`/contact?city=${encodeURIComponent(citySlug)}`} variant="gradient">Contact us for pricing &amp; sizing</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

