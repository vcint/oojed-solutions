"use client";
import data from "@/data/site.json";
import { motion } from "framer-motion";
import { FiAward, FiShield, FiBarChart2, FiUsers } from "react-icons/fi";

const benefitMetrics = [
  { value: "10+ years", label: "Solar and lighting delivery pedigree" },
  { value: "125+", label: "Cities and towns serviced across West India" },
  { value: "360-degree", label: "Lifecycle ownership from design to AMC" },
];

export default function Benefits() {
  return (
    <section id="benefits" className="section relative overflow-hidden bg-transparent">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 via-slate-100/50 to-transparent dark:from-slate-950 dark:via-slate-900/60 pointer-events-none" />
      <div className="absolute -right-32 top-10 w-72 h-72 bg-[#e0ecff] dark:bg-[#13315c]/60 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 bg-[#f5f8ff] dark:bg-[#1c2f4f]/60 blur-3xl rounded-full pointer-events-none" />

      <div className="container relative grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-12 items-start">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#102a6d] text-white px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
            <FiShield className="h-3.5 w-3.5" />
            Why partners choose OOJED
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            OEM-driven reliability with the customer experience of the best national solar brands
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            India's best EPCs proved that solar can be transparent, design-led and trustworthy. OOJED brings the same polish while distributing top-tier OEM systems, fabricating critical spare parts and BOS components, and maintaining projects across Maharashtra.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {benefitMetrics.map((metric) => (
              <div key={metric.label} className="glass-panel p-5">
                <div className="text-2xl font-semibold text-[#102a6d] dark:text-[#9cbcff]">{metric.value}</div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 uppercase tracking-[0.3em]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
            <FiBarChart2 className="h-3.5 w-3.5" />
            Proof points
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Residential societies, MSME units, hospitality groups and civic bodies rely on OOJED for predictable project outcomes, transparent pricing and sustained performance.
          </p>
          <div className="mt-6 space-y-4">
            <div className="glass-panel flex items-center gap-3 px-4 py-3">
              <FiAward className="h-4 w-4 text-[#102a6d] dark:text-[#9cbcff]" />
              <span className="text-sm text-slate-700 dark:text-slate-200">MNRE and DISCOM compliant designs vetted for rooftop, ground-mount and lighting applications.</span>
            </div>
            <div className="glass-panel flex items-center gap-3 px-4 py-3">
              <FiUsers className="h-4 w-4 text-[#102a6d] dark:text-[#9cbcff]" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Dedicated PMO and customer success desk mirroring best-in-class homeowner journeys.</span>
            </div>
            <div className="glass-panel flex items-center gap-3 px-4 py-3">
              <FiShield className="h-4 w-4 text-[#102a6d] dark:text-[#9cbcff]" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Warranty-backed assemblies, remote diagnostics and SLA-bound AMC with in-house spares.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray((data as any).values) &&
            (data as any).values.map((value: string, index: number) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{value}</div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
