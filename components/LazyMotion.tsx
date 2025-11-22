"use client";
import React, { useEffect, useState } from "react";

// Allow any props (including motion props) but keep basic typing for DOM attributes
type AnyProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode } & { [key: string]: any };

let cached: any = null;

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function useMotionModule() {
  const [m, setM] = useState<any>(cached);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || m) return;
    let mounted = true;
    // Only load framer-motion on larger screens (desktop/tablet) and when motion is allowed to avoid unnecessary JS cost
    try {
      if (typeof window === "undefined") return;
      if (window.innerWidth <= 900) return; // skip loading on small screens
    } catch (e) {
      // fallback to not loading
      return;
    }
    import("framer-motion")
      .then((mod) => {
        if (!mounted) return;
        cached = mod;
        setM(mod);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      mounted = false;
    };
  }, [m, prefersReducedMotion]);
  return prefersReducedMotion ? null : m;
}

// common motion-only prop names to strip when falling back to a plain DOM element
const motionPropNames = new Set([
  "initial",
  "animate",
  "exit",
  "whileInView",
  "whileHover",
  "whileTap",
  "whileDrag",
  "variants",
  "transition",
  "layout",
  "layoutId",
  "custom",
  "onAnimationComplete",
  "onUpdate",
  "onViewportEnter",
  "onViewportLeave",
  "viewport",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "onDragStart",
  "onDragEnd",
  "onDrag",
  // framer props commonly used on components
  "key",
]);

function splitMotionProps(props: AnyProps) {
  const motion: Record<string, any> = {};
  const dom: Record<string, any> = {};
  Object.keys(props).forEach((k) => {
    if (motionPropNames.has(k)) motion[k] = props[k];
    else dom[k] = props[k];
  });
  return { motion, dom };
}

export function LazyMotionDiv(props: AnyProps) {
  const m = useMotionModule();
  const { motion, dom } = splitMotionProps(props);
  if (m && m.motion && m.motion.div) {
    const MotionDiv = m.motion.div as any;
    // pass both motion and DOM props to the motion component
    return <MotionDiv {...dom} {...motion} />;
  }
  // fallback: regular div with DOM-safe props only
  const { children } = dom;
  return <div {...(dom as any)}>{children}</div>;
}

export function LazyAnimatePresence({ children }: { children?: React.ReactNode }) {
  const m = useMotionModule();
  if (m && m.AnimatePresence) {
    const AP = m.AnimatePresence as any;
    return <AP initial={false} mode="sync">{children}</AP>;
  }
  // fallback: render children without animation
  return <>{children}</>;
}
