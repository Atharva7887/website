"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "@/components/TextReveal";
import { useRef } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-32 pb-32 md:pb-24"
    >
      {/* Generative protein-structure backdrop */}
      <motion.div
        style={{ y: yParallax }}
        className="pointer-events-none absolute inset-0 md:left-auto md:right-[-4%] md:w-[58%] z-[11] opacity-60 md:opacity-100 flex items-center justify-center"
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1637929476734-bd7f5f78e40a?auto=format&fit=crop&q=80&w=2000"
            alt="Generative rendering of a DNA double-helix structure"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Soft edge fade so the image blends into the page */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(250,247,240,1) 85%)",
            }}
          />
        </div>
      </motion.div>

      {/* Radial wash — different framing per breakpoint so the copy stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 md:hidden"
        style={{
          background:
            "radial-gradient(85% 60% at 50% 32%, rgba(250,247,240,0) 0%, rgba(250,247,240,0.55) 55%, rgba(250,247,240,0.96) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden md:block"
        style={{
          background:
            "radial-gradient(60% 70% at 18% 50%, rgba(250,247,240,0.96) 0%, rgba(250,247,240,0.78) 35%, rgba(250,247,240,0) 70%)",
        }}
      />

      <div className="relative z-30 mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="kicker"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
          AI-accelerated antibody discovery
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-display mt-6 max-w-[18ch] text-[clamp(2.6rem,7.4vw,6.6rem)] leading-[0.96] tracking-tightest text-ink"
        >
          From sequence
          <br />
          to{" "}
          <span className="relative inline-block">
            <em className="not-italic font-display italic">therapeutic</em>
            <motion.svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 320 14"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.path
                d="M2 9 C 80 2, 200 14, 318 6"
                stroke="#F4C430"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </span>
          ,
          <br />
          accelerated.
        </motion.h1>

        <TextReveal
          as="p"
          text="IndiskaAI builds antibody libraries and intelligent discovery platforms, combining molecular engineering, AI-driven data analysis, and modern sequencing technology to help biopharma partners find promising candidates faster."
          className="mt-8 max-w-[46ch] text-[1.06rem] md:text-[1.15rem] leading-[1.55] text-ink-soft"
          delay={0.4}
        />

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#capabilities" className="cta">
            Explore our work
            <span className="cta-arrow">→</span>
          </a>
          <a href="/partner" className="cta cta-ghost">
            Partner with us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
