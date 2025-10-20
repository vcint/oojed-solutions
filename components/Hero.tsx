"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/site.json";
import HeroCarousel from "./HeroCarousel";
// headline is rendered statically; typewriter component removed
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // subtle lift + fade for the heading container
      gsap.fromTo(
        ".hero-head",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.12, ease: "power2.out" }
      );
      // left-to-right reveal for the text using clip-path
      gsap.fromTo(
        ".hero-head .reveal",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.0, delay: 0.18, ease: "power2.out" }
      );
      gsap.fromTo(".hero-sub", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, delay: .36, ease: "power2.out" });
      gsap.fromTo(".hero-cta", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, delay: .56, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);
  

  return (
    <section ref={ref} id="home" className="section pt-28 relative overflow-hidden">
      <HeroCarousel />
      <div className="container grid md:grid-cols-2 items-center gap-10 relative">
        <div>
          {/* <span className="badge">Since 2014</span> */}
          <h1 className="hero-head text-4xl md:text-6xl font-black tracking-tight mt-4 overflow-hidden">
            <span className="reveal inline-block">{data.hero.headline}</span>
          </h1>
          <p className="hero-sub text-lg md:text-xl muted mt-4">{data.hero.sub}</p>
          <div className="hero-cta mt-8 flex gap-4">
            <a
              href={data.hero.ctaPrimary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#102a6d] to-[#0b4bd6] text-white font-semibold shadow-md px-5 py-2.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 md:px-6 md:py-3 dark:from-[#153e75] dark:to-[#2356a6] dark:shadow-none"
            >
              {data.hero.ctaPrimary.label}
            </a>
            <a
              href={data.hero.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#102a6d] border-2 border-[#102a6d] font-semibold shadow-sm px-5 py-2.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 md:px-6 md:py-3 dark:bg-transparent dark:text-white dark:border-white/30 dark:shadow-none"
            >
              Our Products
            </a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <li className="card p-4">Solar Water Heaters</li>
            <li className="card p-4">LED Street Lights</li>
            <li className="card p-4">Solar Pumps</li>
            <li className="card p-4">Poles & Masts</li>
            <li className="card p-4">Solar Spare Parts</li>
          </ul>
        </div>
        <div className="card p-6 md:p-8">
          <div className="aspect-[4/3] rounded-md bg-surface grid place-items-center">
            <div className="text-center px-4">
              <img src="/placeholder-illustration.svg" alt="solar illustration" className="mx-auto w-48 h-auto" />
              <div className="mt-4 font-semibold text-lg ui-text">Clean energy for homes & businesses</div>
              <div className="muted text-sm mt-2">On-grid/Off-grid solar, heaters, pumps & LED</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
