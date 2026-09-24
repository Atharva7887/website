"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

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

            {/* Structural biology lab — grounds the "bench" half of the claim */}
            <div className="mt-10 relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1630959305790-4c956ce6c0b6?auto=format&fit=crop&q=80&w=1200"
                alt="Scientist examining a sample under a microscope in a structural biology laboratory"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,26,26,0) 55%, rgba(26,26,26,0.32) 100%)",
                }}
              />
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6 text-ink-soft text-[1.06rem] md:text-[1.12rem] leading-[1.65]">
            {[
              <p key="p1">
                IndiskaAI is a biotechnology company advancing antibody
                engineering, discovery, and next-generation therapeutic
                research. We build high-quality antibody libraries and
                intelligent discovery platforms for biopharma and
                biotechnology partners.
              </p>,
              <p key="p2">
                Discovering effective antibodies is slow and costly: traditional
                methods mean screening <em>millions</em> of candidates with
                limited precision, and predicting stability, safety, and
                manufacturability early in development remains difficult. We
                built IndiskaAI to close that gap.
              </p>,
              <p key="p3">
                Our approach combines advanced molecular engineering,
                data-driven analysis, and modern sequencing technology, with
                AI models and computational tools layered on top, to support
                quality control throughout library construction, screening,
                and validation.
              </p>,
            ].map((el, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
              >
                {el}
              </motion.div>
            ))}
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
