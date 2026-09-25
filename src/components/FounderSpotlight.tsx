"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FounderSpotlight() {
  return (
    <section className="relative py-4 md:py-8">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/5] max-w-[360px] overflow-hidden rounded-2xl border border-black/5">
              <Image
                src="/team/jaspal-patil.webp"
                alt="Jaspal Patil, Founder & CEO of IndiskaAI"
                fill
                sizes="(max-width: 1024px) 60vw, 320px"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="kicker mb-3">Leadership</div>
            <h2 className="font-display text-[1.9rem] md:text-[2.3rem] leading-[1.05] tracking-tightest text-ink">
              Jaspal Patil
            </h2>
            <div className="text-[0.72rem] tracking-[0.16em] uppercase text-ink-muted mt-2 mb-6">
              Founder &amp; CEO, IndiskaAI
            </div>

            <div className="space-y-4 text-ink-soft text-[1.02rem] leading-[1.65] max-w-[62ch]">
              <p>
                Jaspal Patil, PhD, is the Founder &amp; CEO of IndiskaAI, with
                over 20 years of overall experience spanning pharmaceutical
                sciences, biomedical research, biotechnology, biologics, and
                drug discovery. He holds a degree in Pharmaceutical Sciences
                and a PhD in Biomedical Sciences, with expertise in biologics
                and therapeutic development.
              </p>
              <p>
                He is building IndiskaAI at the intersection of artificial
                intelligence, computational biology, and drug discovery,
                developing intelligent and data-driven approaches to address
                complex challenges in modern pharmaceutical R&amp;D and
                accelerate the identification and development of promising
                therapeutic candidates.
              </p>
              <p>
                Together with the IndiskaAI team, he is working toward a
                future where AI-powered technologies enable faster, smarter,
                and more efficient drug discovery, helping translate
                scientific insights into innovative therapeutic solutions.
              </p>
            </div>

            <a
              href="https://in.linkedin.com/in/jaspalpatil"
              target="_blank"
              rel="noreferrer"
              className="cta cta-ghost mt-8"
              aria-label="View Jaspal Patil's LinkedIn profile (opens in a new tab)"
            >
              View LinkedIn Profile
              <span className="cta-arrow">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
