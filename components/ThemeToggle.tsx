"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const onPref = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (mq && mq.addEventListener) mq.addEventListener("change", onPref);
    return () => { if (mq && mq.removeEventListener) mq.removeEventListener("change", onPref); };
  }, []);

  return (
    <button
      aria-label="Toggle color theme"
      title="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path d="M21.64 13.64A9 9 0 1 1 10.36 2.36 7 7 0 0 0 21.64 13.64z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 3.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.25A.75.75 0 0 1 12 3.5zM12 18.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5c0-.414.336-.75.75-.75zM4.47 4.47a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L4.47 5.53a.75.75 0 0 1 0-1.06zM17.41 17.41a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06zM3.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H4.25A.75.75 0 0 1 3.5 12zM18.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 18.5 12zM4.47 19.53a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06L5.53 19.53a.75.75 0 0 1-1.06 0zM17.41 6.59a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06L18.47 6.59a.75.75 0 0 1-1.06 0zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" />
          </svg>
        )}
      </motion.div>
    </button>
  );
}
