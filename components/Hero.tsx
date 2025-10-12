"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/site.json";
import HeroCarousel from "./HeroCarousel";
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-head", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power2.out" });
      gsap.fromTo(".hero-sub", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, delay: .12, ease: "power2.out" });
      gsap.fromTo(".hero-cta", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, delay: .22, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} id="home" className="section pt-28 relative overflow-hidden">
      <HeroCarousel />
      <div className="container grid md:grid-cols-2 items-center gap-10 relative">
        <div>
          {/* <span className="badge">Since 2014</span> */}
          <h1 className="hero-head text-4xl md:text-6xl font-black tracking-tight mt-4">
            {data.hero.headline}
          </h1>
          <p className="hero-sub text-lg md:text-xl text-slate-600 mt-4">{data.hero.sub}</p>
          <div className="hero-cta mt-8 flex gap-4">
            <a href={data.hero.ctaPrimary.href} className="btn-primary">{data.hero.ctaPrimary.label}</a>
            <a href={data.hero.ctaSecondary.href} className="btn-outline">Our Products</a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <li className="card p-4">Solar Water Heaters</li>
            <li className="card p-4">LED Street Lights</li>
            <li className="card p-4">Solar Pumps</li>
            <li className="card p-4">Poles & Masts</li>
          </ul>
        </div>
        <div className="card p-6 md:p-8">
          <div className="aspect-[4/3] rounded-md bg-slate-50 grid place-items-center">
            <div className="text-center px-4">
              <img src="/placeholder-illustration.svg" alt="solar illustration" className="mx-auto w-48 h-auto" />
              <div className="mt-4 font-semibold text-lg">Clean energy for homes & businesses</div>
              <div className="text-slate-600 text-sm mt-2">On-grid/Off-grid solar, heaters, pumps & LED</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
