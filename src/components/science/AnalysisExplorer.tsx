"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MdPlot, { MD_PLOTS, type MdPlotKey } from "@/components/md/MdPlots";

export type AnalysisItem = { name: string; meaning: string; detail?: string; chart?: MdPlotKey };

/**
 * Analysis metrics as an editorial list. Desktop: hover, focus or click a row
 * to show its animated illustrative plot and explanation in the side panel.
 * Below `lg`: tap to expand in place (one open at a time). Nothing is
 * hover-only — every row is a real button, so keyboard (Enter / Space) and
 * touch reach the same content. Only the shown plot is mounted.
 */
export default function AnalysisExplorer({ items }: { items: AnalysisItem[] }) {
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const [canHover, setCanHover] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const sync = () => { setCanHover(hover.matches); setWide(lg.matches); };
    sync();
    hover.addEventListener("change", sync);
    lg.addEventListener("change", sync);
    return () => { hover.removeEventListener("change", sync); lg.removeEventListener("change", sync); };
  }, []);

  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      <ul className="lg:col-span-4 overflow-hidden rounded-2xl border border-black/[0.08] bg-cream-50/60">
        {items.map((item, i) => {
          const isActive = active === i;
          const isOpen = open === i;
          const regionId = `${uid}-region-${i}`;
          return (
            <li key={item.name} className="border-b border-black/[0.06] last:border-b-0">
              <button
                type="button"
                aria-expanded={wide ? isActive : isOpen}
                aria-controls={wide ? `${uid}-panel` : regionId}
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
                <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] bg-navy opacity-0 transition-opacity duration-300 ${isActive ? "lg:opacity-100" : ""}`} />
                <span className="min-w-0">
                  <span className={`block font-display text-[1.12rem] leading-tight tracking-tightest text-ink transition-colors ${isActive ? "lg:text-navy" : ""}`}>
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-[0.86rem] text-ink-soft">{item.meaning}</span>
                </span>
                <span
                  aria-hidden
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[1.05rem] leading-none transition-all duration-300 ${
                    isOpen ? "rotate-45 lg:rotate-0" : ""
                  } ${isActive ? "lg:border-navy lg:bg-navy lg:text-cream-50" : ""} border-navy/25 text-navy`}
                >
                  +
                </span>
              </button>

              {/* Inline disclosure for touch / narrow screens. */}
              <div id={regionId} role="region" aria-label={item.name} className="lg:hidden">
                <AnimatePresence initial={false}>
                  {!wide && isOpen && (
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
      <div id={`${uid}-panel`} className="hidden lg:block lg:col-span-8 lg:sticky lg:top-28" aria-live="polite">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]">
          <AnimatePresence mode="wait" initial={false}>
            {wide && (
              <motion.div key={active} {...fade} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <Detail item={items[active]} large />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Detail({ item, large = false }: { item: AnalysisItem; large?: boolean }) {
  const plot = item.chart ? MD_PLOTS[item.chart] : undefined;
  return (
    <div className={large ? "p-7" : "px-5 pb-5"}>
      {large && (
        <div className="border-b border-black/[0.07] pb-4">
          <h3 className="font-display text-[1.6rem] leading-tight tracking-tightest text-ink">{item.name}</h3>
          <p className="mt-0.5 text-[0.92rem] text-navy">{item.meaning}</p>
        </div>
      )}
      {item.chart && plot && (
        <figure
          role="img"
          aria-label={`${item.name}, illustrative MD analysis: ${plot.alt}`}
          className={`${large ? "mt-5" : "mt-1"} rounded-xl border border-black/5 bg-white/60 p-3 md:p-4`}
        >
          <MdPlot plot={item.chart} height={large ? 270 : 220} />
        </figure>
      )}
      {item.detail && <p className={`${large ? "mt-5 text-[0.98rem]" : "mt-4 text-[0.9rem]"} leading-[1.55] text-ink-soft max-w-[60ch]`}>{item.detail}</p>}
    </div>
  );
}
