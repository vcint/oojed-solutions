import site from '@/data/site.json';
import Link from 'next/link';

export const metadata = {
  title: 'Service Areas — OOJED',
  description: 'Cities we serve in Maharashtra for solar water heaters, pumps, LED lighting, and installation/AMC services.',
  alternates: { canonical: 'https://oojed.com/locations' },
};

export default function LocationsIndex() {
  const cities: string[] = Array.isArray((site as any).cities) ? (site as any).cities : [];
  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold">Service Areas in Maharashtra</h1>
      <p className="mt-3 text-slate-700">We serve customers across Maharashtra. Explore city-specific pages below.</p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cities.map((c) => (
          <li key={c}>
            <Link href={`/locations/${toSlug(c)}`} className="block rounded-md border p-4 hover:bg-slate-50">
              <span className="font-semibold">{c}</span>
              <span className="block text-sm text-slate-600">Solar heaters, pumps, LED lighting, installation & AMC</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

