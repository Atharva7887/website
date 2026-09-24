"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PLATFORM } from "@/lib/platform-data";

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
            className="lg:col-span-7 lg:order-1 relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=2000"
              alt="Glowing golden particle rendering of a DNA double helix"
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
