import data from '@/data/site.json';
import TrustBar from '@/components/TrustBar';

export const metadata = {
  title: 'About — OOJED',
  description: data.about ? (String(data.about).slice(0, 160)) : 'About OOJED',
  alternates: { canonical: 'https://oojed.com/about' },
};

// const leadership = [
//   {
//     name: 'Omkar Bhilare',
//     role: 'Founder & Managing Director',
//     bio: 'Heads strategy and product innovation, ensuring every system is engineered for long-term performance in Indian conditions.',
//   },
//   {
//     name: 'Neha Patil',
//     role: 'Director – Projects & Delivery',
//     bio: 'Leads cross-functional project teams, driving predictable execution, safety compliance and client communication.',
//   },
//   {
//     name: 'Rohit Kulkarni',
//     role: 'Director – Service & AMC',
//     bio: 'Oversees after-sales support, spares logistics and AMC programmes across Maharashtra and neighbouring states.',
//   },
// ];

const milestones = [
  { year: '2014', detail: 'OOJED incorporated in Pune; first 10,000 LPD solar water heater commissioned.' },
  { year: '2017', detail: 'Expanded to EPC for rooftop solar power plants with in-house design and procurement teams.' },
  { year: '2019', detail: 'Launched LED street / high-mast lighting vertical, securing multi-city municipal contracts.' },
  { year: '2021', detail: 'Established AMC command centre and spares hub enabling sub-24-hour response in major cities.' },
  { year: '2024', detail: 'Crossed 25 MWp rooftop solar capacity delivered and 400+ sites under structured AMC plans.' },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/10.webp"
            alt="OOJED field work montage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative container py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm">About OOJED</h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Simple, smart and reliable clean-energy solutions since 2014. We design, manufacture, install and maintain solar systems and LED lighting engineered for Indian conditions.
          </p>
        </div>
      </section>

      {/* Mission & overview */}
      <section className="container py-12 text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6 leading-relaxed">
            <p>{data.about}</p>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Our mission</h2>
              <p className="mt-3">
                {data.mission || 'To help homes and businesses cut energy costs with simple, smart and reliable clean-energy solutions across India.'}
              </p>
            </div>
            <TrustBar />
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick facts</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Founded: 2014</li>
                <li>Headquarters: Pune, Maharashtra</li>
                <li>Coverage: Maharashtra + neighbouring states</li>
                <li>Focus: Solar heaters, rooftop PV, pumps, LED lighting</li>
                <li>Services: EPC, retrofits, repair, AMC, spares</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">What makes us different</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Engineering-first mindset with detailed proposals.</li>
                <li>• Locally deployed teams for faster mobilisation and service.</li>
                <li>• Transparent project reporting and warranty management.</li>
                <li>• Stocked spares + dedicated AMC desk for rapid turnarounds.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-slate-50 dark:bg-slate-900 py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Milestones on our journey</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6 text-sm text-slate-700 dark:text-slate-300">
            {milestones.map((item) => (
              <div key={item.year} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-5 shadow-sm">
                <div className="text-[#102a6d] dark:text-[#9cc0ff] font-semibold text-lg">{item.year}</div>
                <p className="mt-3 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="container py-12 text-slate-700 dark:text-slate-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Capabilities across the lifecycle</h2>
            <p className="mt-4 leading-relaxed">
              We operate a tightly integrated delivery model. Engineering, procurement, logistics, field execution and service are managed under one roof, eliminating the friction that usually plagues multi-vendor solar projects.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>• Pre-sales audits, feasibility analysis and ROI modelling.</li>
              <li>• Detailed engineering with structural, electrical and plumbing drawings.</li>
              <li>• Procurement partnerships with BIS / MNRE certified OEMs.</li>
              <li>• Project management and HSE-compliant execution teams.</li>
              <li>• After-sales support, remote monitoring and spare-part logistics.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Industries we serve</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                'Residential societies & townships',
                'Hotels, hospitals & hostels',
                'Manufacturing & process industry',
                'Educational campuses',
                'Government & municipal infrastructure',
                'Agriculture & rural pumping',
              ].map((label) => (
                <div key={label} className="rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-3">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {/* <section className="bg-white py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Leadership team</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((member) => (
              <div key={member.name} className="rounded-xl border border-slate-200 bg-white/80 shadow-sm p-6">
                <div className="text-lg font-semibold text-slate-900">{member.name}</div>
                <div className="text-sm text-[#102a6d] mt-1">{member.role}</div>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Image strip */}
      <section className="container pb-12">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">In the field</h2>
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

      {/* Sustainability & commitments */}
      <section className="bg-slate-50 dark:bg-slate-900 py-12">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Sustainability commitments</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li>• Prioritising BIS / MNRE certified products and recyclable packaging.</li>
              <li>• Conducting energy literacy sessions and handover workshops for every client team.</li>
              <li>• Maintaining e-waste partnerships for safe disposal of end-of-life components.</li>
              <li>• Tracking annual energy savings and avoided emissions for AMC customers.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quality & safety</h3>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Every site follows a detailed HSE checklist including scaffolding, electrical isolation, fall protection and permit-to-work protocols. Internal quality auditors sign off before handover, ensuring systems perform from day one.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• BIS / MNRE-compliant supply chain</li>
              <li>• IEC 62446 testing for PV installations</li>
              <li>• NABL calibration partners for instrumentation</li>
              <li>• OSHA-aligned safety training modules</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container pb-16">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Our values</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-slate-700 dark:text-slate-300">
          {data.values && data.values.map((v: string) => (
            <li key={v} className="rounded-md border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800 p-4">{v}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
