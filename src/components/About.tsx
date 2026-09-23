"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import ScienceFigure from "@/components/science/ScienceFigure";
import { GlyphTile } from "@/components/science/Glyphs";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" ref={sectionRef} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 lg:items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
              About IndiskaAI
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-[0.98] tracking-tightest text-ink">
              Built by people who have done the bench{" "}
              <span className="italic text-navy">and</span> the bits.
            </h2>

            {/* "The bench and the bits", drawn: molecular engineering beside computation. */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {[
                { name: "libraryDiversity" as const, label: "Molecular engineering", d: "Antibody library diversity distribution" },
                { name: "sequenceToStructure" as const, label: "Computation", d: "A sequence resolving into a predicted structure" },
              ].map((f) => (
                <figure key={f.label}>
                  <ScienceFigure name={f.name} description={f.d} className="aspect-[4/3]" />
                  <figcaption className="mt-2 text-[0.66rem] tracking-[0.12em] uppercase text-ink-muted">{f.label}</figcaption>
                </figure>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-ink text-[1.35rem] md:text-[1.7rem] leading-[1.3] tracking-tight max-w-[34ch]"
            >
              IndiskaAI builds antibody libraries and intelligent discovery
              platforms for biopharma and biotechnology partners.
            </motion.p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { glyph: "search" as const, title: "The problem", body: "Screening millions of candidates with limited precision is slow and costly." },
                { glyph: "structure" as const, title: "Our approach", body: "Molecular engineering and sequencing, with AI models layered on top." },
                { glyph: "validate" as const, title: "Quality throughout", body: "Checks across library construction, screening, and analysis." },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.08 }}
                  className="rounded-2xl border border-black/[0.06] bg-cream-50/70 p-5"
                >
                  <GlyphTile name={c.glyph} tone="navy" />
                  <h3 className="mt-4 font-display text-[1.15rem] leading-tight tracking-tightest text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-ink-soft text-[0.88rem] leading-[1.5]">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
          {[
            {
              num: "01",
              label: "Vision",
              headline: (
                <>
                  Fewer wells.
                  <br />
                  <span className="italic text-navy">More hypotheses.</span>
                </>
              ),
              body: "We believe the next generation of antibody discovery gets won computationally, before a single well is screened, not after millions of them.",
            },
            {
              num: "02",
              label: "Mission",
              headline: (
                <>
                  Build the tools.
                  <br />
                  <span className="italic text-navy">Run the programs.</span>
                </>
              ),
              body: "We build the AI models, pipelines, and platform that make that possible today, and put them to work for biopharma partners who cannot afford a twelve-year timeline.",
            },
          ].map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="relative bg-cream-100 p-8 md:p-12"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="kicker text-navy/70">
                  {block.num} {block.label}
                </span>
                <span className="block h-px flex-1 bg-black/10" />
              </div>

              <h3 className="font-display text-[1.85rem] md:text-[2.2rem] leading-[1.08] tracking-tightest text-ink mb-5">
                {block.headline}
              </h3>
              <p className="text-ink-soft leading-[1.65] max-w-[46ch]">
                {block.body}
              </p>

              {/* Static accent line, matches the gold/navy brand gradient without a hover interaction */}
              <span className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-navy to-gold" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
