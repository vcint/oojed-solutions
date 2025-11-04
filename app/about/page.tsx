import data from '@/data/site.json';
import TrustBar from '@/components/TrustBar';

export const metadata = {
  title: 'About — OOJED',
  description: data.about ? (String(data.about).slice(0, 160)) : 'About OOJED',
  alternates: { canonical: 'https://oojed.com/about' },
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/10.webp" alt="OOJED field work montage" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative container py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm">About OOJED</h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Simple, smart and reliable clean‑energy solutions since 2014. We design, manufacture, install and maintain solar systems and LED lighting engineered for Indian conditions.
          </p>
        </div>
      </section>

      {/* Company narrative */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              {data.about}
            </div>
            <TrustBar />
          </div>
          <aside>
            <div className="rounded-lg border bg-white/50 p-4">
              <h2 className="text-lg font-semibold">Quick facts</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Founded: 2014</li>
                <li>Coverage: Maharashtra and nearby</li>
                <li>Core: Solar heaters, pumps, PV, LED lighting</li>
                <li>Support: Installation, Repair, AMC</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Image strip */}
      <section className="container pb-12">
        <h2 className="text-xl font-semibold">In the field</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <figure className="rounded-lg overflow-hidden border bg-white">
            <img src="/2.webp" alt="Solar project install" className="w-full h-48 object-cover" loading="lazy" />
          </figure>
          <figure className="rounded-lg overflow-hidden border bg-white">
            <img src="/4.webp" alt="Quality checks and commissioning" className="w-full h-48 object-cover" loading="lazy" />
          </figure>
          <figure className="rounded-lg overflow-hidden border bg-white">
            <img src="/7.webp" alt="LED lighting deployment" className="w-full h-48 object-cover" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* Values */}
      <section className="container pb-16">
        <h2 className="text-xl font-semibold">Our values</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {data.values && data.values.map((v: string) => (
            <li key={v} className="rounded-md border bg-white/50 p-4 text-slate-800">{v}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
