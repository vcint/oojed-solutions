"use client";
import React, { useState } from 'react';

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({
  items,
  singleOpen = false,
  idPrefix = 'faq',
}: {
  items: FaqItem[];
  singleOpen?: boolean;
  idPrefix?: string;
}) {
  const [open, setOpen] = useState<Record<number, boolean>>(() => ({}));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const isOpen = !!prev[i];
      if (singleOpen) {
        // close others, toggle this one
        return isOpen ? {} : { [i]: true };
      }
      return { ...prev, [i]: !isOpen };
    });
  };

  return (
    <div className="mt-4 divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden dark:divide-white/10 dark:border-white/15">
      {items.map((it, i) => {
        const headingId = `${idPrefix}-q-${i}`;
        const panelId = `${idPrefix}-a-${i}`;
        const isOpen = !!open[i];
        return (
          <div key={i} className="bg-white dark:bg-[#0b1729]">
            <h3>
              <button
                id={headingId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm md:text-base font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-white dark:hover:bg-white/5 dark:focus:ring-[#5ea8ff]/40"
              >
                <span>{it.q}</span>
                <svg
                  className={`ml-4 h-5 w-5 transform transition-transform duration-150 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              className={`px-4 pb-4 text-sm md:text-base text-slate-700 dark:text-slate-200 ${isOpen ? 'block' : 'hidden'}`}
            >
              <div className="pt-2">{it.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
