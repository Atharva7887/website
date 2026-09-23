"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScienceFigure from "@/components/science/ScienceFigure";
import type { IllustrationName } from "@/components/science/Illustrations";
import { SERVICES } from "@/lib/services-data";

const TEASER_FIGURES: {
  name: IllustrationName;
  label: string;
  description: string;
}[] = [
  {
    name: "antibodyAntigen",
    label: "Discovery",
    description: "Antibody engaging an antigen at its Fab tips",
  },
  {
    name: "dockingPoses",
    label: "Docking",
    description: "Candidate ligand poses ranked within a binding pocket",
  },
  {
    name: "trajectoryMotion",
    label: "Simulation",
    description: "A complex drifting from its starting frame over a trajectory",
  },
  {
    name: "sequencingReads",
    label: "Genomics",
    description: "Sequencing reads aligned to a reference with a variant marked",
  },
];

/**
 * Condensed teaser for the /services hub — full descriptions live on the
 * dedicated pages (also reachable via the Nav "Services" dropdown), this
 * stays a short pointer plus a tag row naming each service line.
 */
export default function Services() {
  return (
    <section id="services" className="relative py-20 md:py-28 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
              What we offer
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.98] tracking-tightest text-ink">
              Antibody discovery,{" "}
              <span className="italic text-navy">engineered.</span>
            </h2>
            <p className="mt-5 text-ink-soft text-[1.02rem] leading-[1.6] max-w-[38ch]">
              Antibody libraries and discovery, structural and simulation
              science, genomics and biomarkers — deployed as a pipeline, a
              program, or a standalone engagement.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="text-[0.72rem] tracking-[0.06em] uppercase rounded-full border border-black/10 px-3 py-1.5 text-ink-muted bg-cream-50/50 transition-colors duration-300 hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
                >
                  {s.title}
                </Link>
              ))}
            </div>

            <Link href="/services" className="cta cta-ghost mt-8">
              See what we offer
              <span className="cta-arrow">→</span>
            </Link>
          </motion.div>

          {/* Supporting visual — four of the schematics from the service
              pages, so the breadth of the work reads at a glance. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 grid grid-cols-2 gap-px bg-black/5 border border-black/5 rounded-2xl overflow-hidden"
          >
            {TEASER_FIGURES.map((f) => (
              <div key={f.name} className="bg-cream-100 p-5 md:p-7">
                <ScienceFigure name={f.name} description={f.description} />
                <div className="mt-4 text-[0.68rem] tracking-[0.12em] uppercase text-ink-muted">
                  {f.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
