"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MD_CHARTS, type MdChartKey } from "./MdCharts";

export type AnalysisItem = { name: string; meaning: string; detail?: string; chart?: MdChartKey };

/**
 * Analysis metrics as an explorable list. Desktop: hover, focus or click a row
 * to show its explanation and illustrative plot in the side panel. Below `lg`:
 * tap to expand in place (one open at a time). Nothing is hover-only — every
 * row is a real button, so keyboard and touch reach the same content.
 */
export default function AnalysisExplorer({ items }: { items: AnalysisItem[] }) {
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const on = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      <ul className="lg:col-span-5 overflow-hidden rounded-2xl border border-black/[0.08] bg-cream-50/60">
        {items.map((item, i) => {
          const isActive = active === i;
          const isOpen = open === i;
          const regionId = `${uid}-region-${i}`;
          return (
            <li key={item.name} className="border-b border-black/[0.06] last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={regionId}
                onClick={() => {
                  setActive(i);
                  setOpen((o) => (o === i ? null : i));
                }}
                onFocus={() => setActive(i)}
                onMouseEnter={() => canHover && setActive(i)}
                className={`group relative flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 ${
                  isActive ? "lg:bg-cream-50" : "hover:bg-cream-50/80"
                }`}
              >
                <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] bg-navy transition-opacity duration-300 ${isActive ? "lg:opacity-100" : "opacity-0"}`} />
                <span className="min-w-0">
                  <span className={`block font-display text-[1.12rem] leading-tight tracking-tightest transition-colors ${isActive ? "lg:text-navy" : ""} text-ink`}>
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-[0.86rem] text-ink-soft">{item.meaning}</span>
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-navy transition-transform duration-300 ${isOpen ? "rotate-90 lg:rotate-0" : ""} ${isActive ? "lg:translate-x-1" : ""}`}
                >
                  →
                </span>
              </button>

              {/* Inline disclosure for touch / narrow screens. */}
              <div id={regionId} role="region" aria-label={item.name} className="lg:hidden">
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="inline"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <Detail item={item} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop side panel, following hover / focus / click. */}
      <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-28" aria-live="polite">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} {...fade} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <Detail item={items[active]} large />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Detail({ item, large = false }: { item: AnalysisItem; large?: boolean }) {
  const chart = item.chart ? MD_CHARTS[item.chart] : undefined;
  return (
    <div className={large ? "p-7" : "px-5 pb-5"}>
      {large && (
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.6rem] leading-tight tracking-tightest text-ink">{item.name}</h3>
          <span className="text-[0.66rem] uppercase tracking-[0.12em] text-ink-muted">Illustrative plot</span>
        </div>
      )}
      {item.detail && <p className={`${large ? "mt-2 text-[0.98rem]" : "text-[0.9rem]"} leading-[1.55] text-ink-soft max-w-[56ch]`}>{item.detail}</p>}
      {chart && (
        <figure role="img" aria-label={`${item.name}, illustrative example: ${chart.alt}`} className={`${large ? "mt-6" : "mt-4"} rounded-xl border border-black/5 bg-cream-100/60 p-3`}>
          {chart.chart}
          {!large && <figcaption className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">Illustrative plot</figcaption>}
        </figure>
      )}
    </div>
  );
}
