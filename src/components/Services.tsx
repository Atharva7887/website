"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SERVICES } from "@/lib/services-data";

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
              Libraries, discovery, engineering, and AI-driven data, deployed
              as a pipeline, a program, or a standalone engagement.
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

          {/* Supporting visual — a physical model of a protein complex, makes "structure" tangible */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1707863080685-177f4f6e850d?auto=format&fit=crop&q=80&w=2000"
              alt="Physical model of a multi-chain protein complex surface structure"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,26,26,0) 60%, rgba(26,26,26,0.28) 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
