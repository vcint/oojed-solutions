import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-slate-900 flex items-center">
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center sm:text-left flex flex-col sm:flex-row items-center gap-10">
        <div className="sm:w-1/2">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#102a6d] dark:text-[#5ea8ff]">404</h1>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">We couldn&apos;t find that page</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
            The link you followed may be broken or the page may have been moved during a recent refresh. Use the options below to continue exploring the site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] dark:bg-[#5ea8ff] text-white font-semibold px-5 py-2.5 shadow hover:bg-[#0c3a99] dark:hover:bg-[#4a9eff]">
              Return home
            </Link>
            <Link href="/why-us" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              Why OOJED
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              Talk to us
            </Link>
          </div>
        </div>
        <div className="sm:w-1/2 w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div className="font-semibold text-slate-900 dark:text-white uppercase tracking-widest text-xs">
              Quick links
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-[#102a6d] dark:hover:text-[#5ea8ff] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#102a6d] dark:hover:text-[#5ea8ff] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-[#102a6d] dark:hover:text-[#5ea8ff] transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#102a6d] dark:hover:text-[#5ea8ff] transition-colors">
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
