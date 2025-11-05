import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50 flex items-center">
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center sm:text-left flex flex-col sm:flex-row items-center gap-10">
        <div className="sm:w-1/2">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#102a6d]">404</h1>
          <p className="mt-3 text-2xl font-semibold text-slate-900">We couldn&apos;t find that page</p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            The link you followed may be broken or the page may have been moved during a recent refresh. Use the options below to continue exploring the site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] text-white font-semibold px-5 py-2.5 shadow hover:bg-[#0c3a99]">
              Return home
            </Link>
            <Link href="/why-us" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Why OOJED
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Talk to us
            </Link>
          </div>
        </div>
        <div className="sm:w-1/2 w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-900 uppercase tracking-widest text-xs">
              Quick links
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-[#102a6d] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#102a6d] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-[#102a6d] transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#102a6d] transition-colors">
                  About OOJED
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
