import Benefits from '@/components/Benefits';
import data from '@/data/site.json';
import Link from 'next/link';

export const metadata = {
  title: 'Why Choose OOJED — Experience, Quality & Support',
  description: 'Discover why businesses and housing societies across Maharashtra trust OOJED for solar water heating, rooftop solar, pumps and LED lighting projects.',
  alternates: { canonical: 'https://oojed.com/why-us' },
};

const differentiators = [
  {
    title: 'Engineering-first proposals',
    body: 'Every engagement begins with a detailed survey, load assessment and ROI model. No copy-paste configurations or hidden vendor markups.',
  },
  {
    title: 'Predictable project delivery',
    body: 'Dedicated project managers, photo-logged progress, safety protocols and municipal/DISCOM coordination keep schedules on track.',
  },
  {
    title: 'Lifecycle care & AMC',
    body: 'Structured maintenance plans, stocked spares, 24/7 escalation for AMC clients and remote monitoring assistance after commissioning.',
  },
];

export default function WhyUsPage() {
  return (
    <main className="bg-white dark:bg-[#01030c]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/4.webp" alt="OOJED project montage" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative container py-20 sm:py-28">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm">Why customers choose OOJED</h1>
          <p className="mt-4 max-w-2xl text-white/90">
            We combine practical field engineering with transparent commercial models, so solar projects deliver the savings and uptime you expect. Here’s what sets us apart when you compare EPC and AMC partners.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              11+ years of solar & LED projects
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              2+ MW rooftop solar delivered
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              80+ sites under active AMC
            </span>
          </div>
        </div>
      </section>

      <section className="container py-16 grid gap-8 md:grid-cols-3 text-slate-700 dark:text-slate-300">
        {differentiators.map((item) => (
          <div key={item.title} className="rounded-2xl glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      <Benefits />

      <section className="container py-16 grid gap-10 lg:grid-cols-2 text-slate-700 dark:text-slate-300">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Trusted by housing societies, MSMEs and civic bodies</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            {data?.about}
          </p>
        </div>
        <div className="rounded-2xl glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15 space-y-4">
          <div>
            <div className="text-slate-900 dark:text-white font-semibold">Service excellence</div>
            <p className="mt-1">Daily progress reports, escalation ladders, safety compliance and training for on-site operations teams.</p>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold">Documentation & compliance</div>
            <p className="mt-1">Engineering drawings, subsidy/net-metering paperwork and detailed handover kits prepared for every project.</p>
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-semibold">AMC & spares coverage</div>
            <p className="mt-1">Dedicated AMC desk with stocked spares, remote monitoring assistance and 24/7 emergency support for contracted clients.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="container flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Ready to compare proposals?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              Share your requirement and we’ll prepare an assessment within one business day. We can benchmark existing quotes or help you scope from scratch.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102a6d] text-white font-semibold px-6 py-2.5 shadow hover:bg-[#0c3a99]"
          >
            Talk to our engineers
          </Link>
        </div>
      </section>
    </main>
  );
}
