"use client";
import data from "@/data/site.json";
import { usePrefersReducedMotion, LazyMotionDiv } from "./LazyMotion";
import { FiAward, FiShield, FiBarChart2, FiUsers } from "react-icons/fi";

const benefitMetrics = [
  { value: "10+ years", label: "Solar and lighting delivery pedigree" },
  { value: "125+", label: "Cities and towns serviced across West India" },
  { value: "360-degree", label: "Lifecycle ownership from design to AMC" },
];

export default function Benefits() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="benefits" className="section relative overflow-hidden bg-secondary/5 py-20 md:py-24">
      <div className="container relative grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-12 items-start">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-sm">
            <FiShield className="h-3.5 w-3.5" />
            Why families and businesses choose us
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-foreground leading-tight">
            The care of a local business. The quality of the best national brands.
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            We've learned what matters from working with hundreds of Maharashtra families and business owners: solar should work through monsoon, survive hard water, and keep running when grid power fails. That's exactly what we deliver, with the honest service you'd expect from neighbors, not a faceless corporation.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
            {benefitMetrics.map((metric) => (
              <div key={metric.label} className="glass p-5 rounded-xl">
                <div className="text-2xl font-semibold text-primary">{metric.value}</div>
                <div className="mt-2 text-xs text-muted-foreground uppercase tracking-[0.3em]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 md:p-8 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <FiBarChart2 className="h-3.5 w-3.5" />
            Proof points
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Your neighbors, fellow business owners, and local authorities trust us because we show up when promised, explain things in plain language, and stick around long after installation day.
          </p>
          <div className="mt-6 space-y-4">
            <div className="glass flex items-center gap-3 px-4 py-3 rounded-lg">
              <FiAward className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">MNRE and DISCOM compliant designs vetted for rooftop, ground-mount and lighting applications.</span>
            </div>
            <div className="glass flex items-center gap-3 px-4 py-3 rounded-lg">
              <FiUsers className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Dedicated PMO and customer success desk mirroring best-in-class homeowner journeys.</span>
            </div>
            <div className="glass flex items-center gap-3 px-4 py-3 rounded-lg">
              <FiShield className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Warranty-backed assemblies, remote diagnostics and SLA-bound AMC with in-house spares.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative mt-12">
        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray((data as any).values) &&
            (data as any).values.map((value: string, index: number) => {
              const motionProps = prefersReducedMotion
                ? { initial: { opacity: 1, y: 0 } }
                : {
                  initial: { opacity: 0, y: 12 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.3, delay: index * 0.03 },
                };

              return (
                <LazyMotionDiv
                  key={value}
                  {...motionProps}
                  className="glass glass-hover p-6 rounded-xl"
                >
                  <div className="text-sm text-muted-foreground leading-relaxed">{value}</div>
                </LazyMotionDiv>
              );
            })}
        </div>
      </div>
    </section>
  );
}
