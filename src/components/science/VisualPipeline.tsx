"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ILLUSTRATIONS, type IllustrationName } from "./Illustrations";
import { GlyphTile, type GlyphName } from "./Glyphs";

export type PipelineStep = {
  title: string;
  body?: string;
  glyph?: GlyphName;
  /** A full illustration instead of a glyph — for pipelines that are the page's centrepiece. */
  art?: IllustrationName;
};

/**
 * Numbered stage-by-stage pipeline. Horizontal with a connecting rail from
 * `lg` up; a vertical timeline below that, so a seven-stage pipeline never
 * squeezes into unreadable columns on a tablet or phone.
 */
export default function VisualPipeline({
  steps,
  tone = "light",
  vertical = false,
}: {
  steps: PipelineStep[];
  tone?: "light" | "dark";
  /** Always a vertical timeline — for pipelines inside a narrow card. */
  vertical?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const hasArt = !vertical && steps.some((s) => s.art);
  const dark = tone === "dark";
  const lg = (cls: string) => (vertical ? "" : cls);

  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
      className={`relative grid grid-cols-1 gap-0 ${lg("lg:gap-5 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]")}`}
      style={{ ["--n" as string]: steps.length }}
    >
      {steps.map((step, i) => {
        const Art = !vertical && step.art ? ILLUSTRATIONS[step.art] : null;
        const last = i === steps.length - 1;
        return (
          <motion.li
            key={step.title}
            variants={{
              hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className={`relative flex gap-5 ${vertical ? "pb-5" : "pb-8"} ${lg("lg:flex-col lg:gap-0 lg:pb-0")}`}
          >
            {/* Rail: vertical on mobile, horizontal on desktop. */}
            {!last && (
              <span
                aria-hidden
                className={`absolute left-7 top-16 bottom-1 w-px ${lg("lg:top-7 lg:bottom-auto lg:left-[4.5rem] lg:right-[-1.25rem] lg:h-px lg:w-auto")} ${
                  hasArt ? "lg:hidden" : ""
                } ${dark ? "bg-cream-100/20" : "bg-navy/20"}`}
              />
            )}

            {Art ? (
              <div className="hidden lg:block">
                <div className={`relative overflow-hidden rounded-2xl border p-3 ${dark ? "border-cream-100/10 bg-cream-100" : "border-black/5 bg-cream-50"}`}>
                  <Art />
                  <span className="absolute left-3 top-3 rounded-full bg-ink px-2 py-0.5 text-[0.62rem] font-medium tabular-nums text-cream-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                {!last && (
                  <span aria-hidden className="absolute right-[-1.05rem] top-[22%] text-gold-600">→</span>
                )}
              </div>
            ) : null}

            <div className={`relative z-10 ${Art ? "lg:hidden" : ""}`}>
              <div className="relative">
                <GlyphTile name={step.glyph ?? "target"} tone={dark ? "cream" : "navy"} />
                <span className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.6rem] font-medium tabular-nums ${dark ? "bg-gold text-ink" : "bg-ink text-cream-100"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className={`min-w-0 pt-1 ${lg("lg:pt-5")}`}>
              <h3 className={`font-display text-[1.08rem] leading-[1.15] tracking-tightest ${dark ? "text-cream-100" : "text-ink"}`}>
                {step.title}
              </h3>
              {step.body && (
                <p className={`mt-1.5 text-[0.86rem] leading-[1.5] ${dark ? "text-cream-100/70" : "text-ink-soft"}`}>
                  {step.body}
                </p>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
