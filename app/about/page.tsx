import data from '@/data/site.json';
import TrustBar from '@/components/TrustBar';
import Button from '@/components/Button';

export const metadata = {
  title: 'About OOJED',
  description: data.about ? String(data.about).slice(0, 160) : 'About OOJED',
  alternates: { canonical: 'https://oojed.com/about' },
};

const heroMetrics = [
  { value: '11+', label: 'Years in clean energy' },
  { value: '80+', label: 'Active AMC sites' },
  { value: '2MW+', label: 'Power generated' },
];

const positioningStatements = [
  'Retailer and distributor of BIS-compliant solar water heating, rooftop PV, pumping and LED lighting portfolios.',
  'Regional fulfilment hubs in Pune, Aurangabad, Nashik and Kolhapur ensure responsive supply and service.',
  'In-house fabrication of critical spare parts and BOS assemblies keeps downtime under tight control.',
];

const missionHighlights = [
  'Transparent engineering proposals with ROI modelling and subsidy guidance.',
  'Dedicated project, procurement and AMC desks for a single escalation ladder.',
  'Glassboard-style progress tracking that keeps management and facility teams aligned.',
  'Technicians trained for pressurised systems, electrical safety and specialist lift plans.',
];

const lifecyclePillars = [
  {
    title: 'Structured discovery',
    detail:
      'Load assessment, hot water demand mapping, shading studies and financial benchmarking aligned to on-ground realities.',
  },
  {
    title: 'Engineering & procurement',
    detail:
      'Internal design desks produce structural, electrical and plumbing drawings while sourcing vetted OEM hardware and BOS kits.',
  },
  {
    title: 'Deployment discipline',
    detail:
      'Project managers coordinate logistics, safety protocols, statutory permissions and commissioning checklists for predictable handovers.',
  },
  {
    title: 'Lifecycle care',
    detail:
      'AMC command centre manages preventive visits, remote diagnostics, stocked spares and emergency callouts across Maharashtra.',
  },
];

const deliveryStages = [
  {
    step: '01',
    title: 'Discover & benchmark',
    copy: 'Site surveys, consumption analysis, earthing health and shading imagery inform right-fit system sizing.',
  },
  {
    step: '02',
    title: 'Engineer & customise',
    copy: 'Structural vetting, controller selection and fabrication of bespoke spares provide readiness for commissioning.',
  },
  {
    step: '03',
    title: 'Deploy & commission',
    copy: 'Dedicated crews execute lift plans, electrical tie-ins and start-up tests with OEM sign-off.',
  },
  {
    step: '04',
    title: 'Support & optimise',
    copy: 'Ticketing, visit calendars and performance dashboards keep assets productive long after handover.',
  },
];

const milestones = [
  {
    year: '2014',
    detail: 'OOJED incorporates in Pune and completes its first 10,000 LPD solar water-heating retrofit as a distributor.',
  },
  {
    year: '2017',
    detail: 'Expansion into rooftop solar EPC with internal engineering, procurement and logistics desks.',
  },
  {
    year: '2019',
    detail: 'Launch of LED street and high-mast lighting vertical supporting multi-city municipal programmes.',
  },
  {
    year: '2021',
    detail: 'AMC command centre established with stocked spare hubs enabling sub-24-hour callbacks.',
  },
  {
    year: '2024',
    detail: 'Crossed 2+ MW delivered with 80+ active AMC sites across Maharashtra and neighbouring states.',
  },
];

const coverageHighlights = [
  { label: 'Pune HQ', detail: 'Central operations, warehousing and engineering desk.' },
  { label: 'Aurangabad hub', detail: 'Quick-turnaround spare-part fabrication and AMC dispatch.' },
  { label: 'Nashik outpost', detail: 'Industrial and hospitality servicing for the Nashik belt.' },
  { label: 'Kolhapur crew', detail: 'Dedicated support for cooperatives and agro installations.' },
];

const verticals = [
  {
    title: 'Solar water heating',
    copy: 'Pressurised & non-pressurised systems, retrofits, descale kits, GI/SS fabrication and maintenance spares.',
  },
  {
    title: 'Rooftop solar EPC',
    copy: 'System sizing, BOS sourcing, structure design, subsidy documentation and turnkey commissioning.',
  },
  {
    title: 'Solar pumping',
    copy: 'AC/DC pumps, controller integration, HDPE/GI piping and farmer-ready turnkey kits with training.',
  },
  {
    title: 'LED & smart lighting',
    copy: 'High-mast, street and industrial luminaires with adaptive controls, audits and warranty-backed service.',
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-[#f5f7ff] dark:bg-[#030614]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(15,63,166,0.08),transparent_42%),radial-gradient(circle_at_88%_12%,rgba(0,168,255,0.1),transparent_46%),linear-gradient(140deg,#f4f7ff_0%,#ffffff_45%,#eef4ff_100%)] dark:bg-[radial-gradient(circle_at_18%_10%,rgba(35,88,190,0.18),transparent_55%),radial-gradient(circle_at_78%_0%,rgba(18,53,120,0.32),transparent_60%),linear-gradient(165deg,#02040d_0%,#040b19_52%,#010207_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30 dark:from-[#030710]/50 dark:via-transparent dark:to-[#010309]/70" />
      <div className="pointer-events-none absolute -left-32 top-32 h-72 w-72 rounded-full bg-[#cddcff]/40 blur-3xl dark:bg-[#0f2350]/35" />
      <div className="pointer-events-none absolute bottom-12 -right-24 h-80 w-80 rounded-full bg-[#b6f0ff]/40 blur-3xl dark:bg-[#091c33]/45" />

      <section className="relative overflow-hidden pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.96) 0%,rgba(232,237,252,0.78) 42%,transparent 72%),radial-gradient(circle_at_85%_8%,rgba(214,233,255,0.6) 0%,transparent 58%),linear-gradient(135deg,#f7f9ff 0%,#edf2ff 50%,#f7faff 100%)] dark:bg-[radial-gradient(circle_at_20%_12%,rgba(48,112,220,0.25) 0%,rgba(6,16,38,0.9) 50%,transparent 80%),radial-gradient(circle_at_80%_8%,rgba(15,69,182,0.2) 0%,rgba(3,8,20,0.92) 65%),linear-gradient(155deg,#050b17 0%,#030812 55%,#010307 100%)]" />
          <div className="absolute inset-0 bg-white/70 mix-blend-soft-light dark:bg-[#02030b]/60" />
        </div>

        <div className="container relative px-4 text-slate-800 dark:text-slate-100 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-10 md:gap-12 lg:gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
            <div className="glass-panel space-y-6 bg-white/95 p-7 text-slate-800 shadow-[0_35px_90px_rgba(15,63,166,0.18)] dark:bg-white/5 dark:text-slate-100 dark:shadow-[0_45px_110px_rgba(0,0,0,0.55)] md:p-9">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.42em] text-slate-600 shadow-[0_10px_30px_rgba(15,63,166,0.12)] dark:bg-white/15 dark:text-white/90">
                About OOJED
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl lg:text-[2.75rem] lg:leading-snug">
                  Clean energy retail, distribution and lifecycle care built for Maharashtra
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 md:text-lg">
                  We help cooperatives, industries, hospitality and civic bodies deploy solar assets with confidence. By pairing
                  OEM-certified products, regional distribution, in-house fabrication and accountable AMC, OOJED keeps systems
                  productive long after installation.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {positioningStatements.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border glass-panel p-5 dark:bg-white/5 dark:border-white/15 shadow-[0_18px_50px_rgba(15,63,166,0.12)] backdrop-blur dark:text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/contact" variant="gradient" className="px-6 py-2.5">
                  Speak with our specialists
                </Button>
                <Button href="/services" variant="surface" className="px-6 py-2.5 text-slate-900 dark:text-white">
                  Explore services
                </Button>
              </div>
            </div>

            <div className="glass-panel space-y-6 bg-white/95 p-7 shadow-[0_32px_80px_rgba(15,63,166,0.15)] dark:bg-slate-900/60 dark:shadow-[0_40px_100px_rgba(0,0,0,0.55)] md:p-9">
              <h2 className="text-xs font-semibold uppercase tracking-[0.42em] text-slate-500 dark:text-slate-300">
                Impact snapshot
              </h2>
              <div className="mt-6 grid gap-4 sm:gap-5">
                {heroMetrics.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/70 px-5 py-4 glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15"
                  >
                    <span className="text-sm uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="text-xl font-semibold text-[#00dd60] dark:text-[#00e85d]">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                Every engagement follows a PMP-led playbook with stocked spares, transparent SLAs and escalation paths that keep
                stakeholders aligned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(238,243,255,0.95)_0%,rgba(227,235,255,0.72)_42%,rgba(218,229,255,0.48)_100%)] dark:bg-[linear-gradient(180deg,rgba(3,11,26,0.92)_0%,rgba(5,24,46,0.88)_42%,rgba(6,32,58,0.82)_100%)]" />
        <div className="container relative">
          <div className="glass-panel space-y-6 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why we started OOJED</h2>
            <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
              Back in 2014, solar in Maharashtra was full of big promises and disappointing results. Families paid good money for systems that leaked, failed during monsoon, or needed constant repairs. That didn't sit right with us.
            </p>
            <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
              OOJED was born from a simple belief: Maharashtrians deserve solar solutions that actually work through monsoon rains, hard water, and unreliable grid power. We're here to deliver solar water heaters, rooftop power plants, pumps, and LED lighting that you can count on, year after year.
            </p>
            <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200"><strong>What makes us different:</strong></p>
            <ul className="list-disc ml-6 text-base leading-relaxed text-slate-800 dark:text-slate-200 space-y-2">
              {data.values.map((v) => (
                <li key={v} className="font-semibold">{v}</li>
              ))}
            </ul>
            <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
              We fabricate critical spares and BOS components in-house, so you're never waiting weeks for a replacement tube or bracket. From the first survey to years of AMC visits, our local teams stick with you.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(238,243,255,0.95)_0%,rgba(227,235,255,0.72)_42%,rgba(218,229,255,0.48)_100%)] dark:bg-[linear-gradient(180deg,rgba(3,11,26,0.92)_0%,rgba(5,24,46,0.88)_42%,rgba(6,32,58,0.82)_100%)]" />
        <div className="container relative space-y-12 text-slate-800 dark:text-slate-100">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
            <div className="glass-panel space-y-6 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                A retailer's agility with an engineer's discipline
              </h2>
              <p className="text-base leading-relaxed text-slate-800 dark:text-white">{data.about}</p>
              <p className="text-base leading-relaxed text-slate-800 dark:text-white">
                We are not manufacturing panels or water heaters. Our role is to curate proven OEM hardware, fabricate the
                spares that matter, and orchestrate design, deployment and long-term support through one accountable partner.
              </p>
              <TrustBar />
            </div>

            <aside className="space-y-6">
              <div className="glass-panel space-y-4 p-6 md:p-7 dark:bg-white/5 dark:border-white/15">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mission</h3>
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  {data.mission ||
                    'Deliver dependable solar assets for Maharashtra by blending trusted OEM hardware with accountable on-ground teams.'}
                </p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {missionHighlights.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-slate-800 dark:text-slate-100">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0f3fa6] dark:bg-[#5ea8ff]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel space-y-4 p-6 md:p-7 dark:bg-white/5 dark:border-white/15">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Regional coverage</h3>
                <div className="space-y-3 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  {coverageHighlights.map((item) => (
                    <div key={item.label} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.label}:</span>
                      <span>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="glass-panel space-y-6 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                  Capabilities across the lifecycle
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  A single desk owns engineering, procurement, logistics, commissioning and AMC, bringing clarity to every
                  milestone.
                </p>
              </div>
              <Button href="/services" variant="surface" className="px-6 py-2.5 text-slate-900 dark:text-white">
                View delivery playbooks
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {lifecyclePillars.map((item) => (
                <div key={item.title} className="glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20">
        <div className="container relative text-slate-800 dark:text-slate-100">
          <div className="glass-panel space-y-10 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">How we work with you</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  A four-stage rhythm keeps procurement, installation and ongoing care connected for every stakeholder.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {deliveryStages.map((stage) => (
                <div key={stage.step} className="glass-panel p-5 shadow-none dark:bg-white/5 dark:border-white/15">
                  <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                    {stage.step}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{stage.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-100">{stage.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20">
        <div className="container relative text-slate-800 dark:text-slate-100">
          <div className="glass-panel space-y-8 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">Milestones we are proud of</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  A decade-long journey shaped by engineering discipline, retail reliability and client trust.
                </p>
              </div>
              <Button href="/services" variant="surface" className="px-6 py-2.5 text-slate-900 dark:text-white">
                Explore case studies
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {milestones.map((item) => (
                <div key={item.year} className="glass-panel p-6 space-y-3 dark:bg-white/5 dark:border-white/15">
                  <div className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{item.year}</div>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20 pt-10 md:pb-24 md:pt-12">
        <div className="container relative space-y-10 text-slate-800 dark:text-slate-100">
          <div className="glass-panel space-y-6 p-6 md:p-8 dark:bg-white/5 dark:border-white/15">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
                  Product &amp; service verticals
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  Retail shelves, distribution arms and on-ground teams tuned for cooperatives, industries, hospitality and
                  institutions.
                </p>
              </div>
              <Button href="/products" variant="gradient" className="px-6 py-2.5">
                Browse the catalog
              </Button>
            </div>

            <div className="grid gap-4 text-sm leading-relaxed md:grid-cols-2 lg:grid-cols-4">
              {verticals.map((item) => (
                <div key={item.title} className="glass-panel p-5 text-slate-800 shadow-none dark:bg-white/5 dark:border-white/15 dark:text-slate-100">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel overflow-hidden p-6 md:p-8 dark:bg-black dark:border-white/15">
            <div className="relative isolate rounded-[2rem] border  px-6 py-10 text-slate-800 dark:text-white">
              <div className="pointer-events-none absolute -top-20 right-10 h-40 w-40 rounded-full bg-grey/80 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-6 h-32 w-32 rounded-full bg-slate/70 blur-2xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl space-y-3">
                  <h2 className="text-2xl font-semibold md:text-3xl">
                    Let's blueprint your next solar or lighting rollout
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-400 md:text-base">
                    Share your site brief and our specialists will map the right OEM hardware, fabrication support and AMC coverage
                    for a smooth launch.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button href="/contact" variant="gradient" className="px-6 py-2.5">
                    Book a consultation
                  </Button>
                  <Button
                    href="tel:+919511229430"
                    variant="surface"
                    className="px-6 py-2.5"
                  >
                    Call +91 95112 29430
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
