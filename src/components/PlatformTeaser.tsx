"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PLATFORM } from "@/lib/platform-data";
import ScienceFigure from "@/components/science/ScienceFigure";

/**
 * Homepage teaser for the Platform section — products, the named
 * lead-optimization pipeline, and the computational toolkit. Sits
 * alongside the Services teaser rather than replacing it: two
 * different things IndiskaAI does (services vs. software we build
 * and run ourselves).
 */
export default function PlatformTeaser() {
  return (
    <section id="platform-teaser" className="relative py-20 md:py-28 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Supporting visual first on this one for rhythm variety vs. the Services teaser */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 lg:order-1 overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_30px_70px_-45px_rgba(16,53,101,0.55)]"
            role="img"
            aria-label="Schematic of a structure-analysis workspace: an antibody–antigen complex beside a residue contact map and metric traces"
          >
            {/* Product-style workspace, drawn from our own schematics rather than a stock photo. */}
            <div className="flex items-center gap-2 border-b border-black/5 bg-cream-100 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-black/15" />
              <span className="h-2 w-2 rounded-full bg-black/15" />
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="ml-2 text-[0.64rem] tracking-[0.12em] uppercase text-ink-muted">Workspace · schematic</span>
            </div>
            <div className="grid grid-cols-12">
              <div aria-hidden className="col-span-3 hidden sm:flex flex-col gap-1.5 border-r border-black/5 p-3">
                {["Contacts", "CDRs", "Epitope", "Clustering", "QC"].map((t, i) => (
                  <span key={t} className={`rounded-md px-2 py-1.5 text-[0.7rem] ${i === 2 ? "bg-navy/10 text-navy" : "text-ink-muted"}`}>{t}</span>
                ))}
              </div>
              <div className="col-span-12 sm:col-span-9 grid grid-cols-2 gap-px bg-black/5">
                <div className="bg-cream-50 p-4"><ScienceFigure name="antibodyAntigen" description="" padded={false} className="aspect-[3/2] border-0 bg-transparent" /></div>
                <div className="bg-cream-50 p-4"><ScienceFigure name="interfaceMap" description="" padded={false} className="aspect-[3/2] border-0 bg-transparent" /></div>
                <div className="col-span-2 bg-cream-50 p-4"><ScienceFigure name="contactPersistence" description="" padded={false} className="aspect-[5/1] border-0 bg-transparent" /></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 lg:order-2"
          >
            <div className="kicker mb-5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
              Platform
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.98] tracking-tightest text-ink">
              Software we build{" "}
              <span className="italic text-navy">and run ourselves.</span>
            </h2>
            <p className="mt-5 text-ink-soft text-[1.02rem] leading-[1.6] max-w-[42ch]">
              Alongside our discovery services: two applications, an API
              platform, a named lead-optimization pipeline, and the
              computational toolkit behind our de novo design and genomics
              work.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {PLATFORM.map((p) => (
                <Link
                  key={p.slug}
                  href={`/platform/${p.slug}`}
                  className="text-[0.72rem] tracking-[0.06em] uppercase rounded-full border border-black/10 px-3 py-1.5 text-ink-muted bg-cream-50/50 transition-colors duration-300 hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
                >
                  {p.title}
                </Link>
              ))}
            </div>

            <Link href="/platform" className="cta cta-ghost mt-8">
              See the platform
              <span className="cta-arrow">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
