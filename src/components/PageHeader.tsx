"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import BackButton from "./BackButton";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export default function PageHeader({
  eyebrow,
  title,
  lede,
  cta,
  aside,
  crumbs,
}: {
  /** Trail after Home, e.g. [{label:"Services",href:"/services"},{label:"Genomics"}]. */
  crumbs?: { label: string; href?: string }[];
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Optional action row beneath the lede. */
  cta?: React.ReactNode;
  /** Optional hero visual. When present the header becomes a split layout. */
  aside?: React.ReactNode;
}) {
  const split = !!aside;

  return (
    <header className="relative pt-40 md:pt-48 pb-20 md:pb-28">
      {/* Soft gradient orb echoing the home page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #1E5BA8, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <BackButton />
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="text-[0.8rem] text-ink-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-navy transition-colors">Home</Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <span aria-hidden className="text-black/20">/</span>
                    {c.href && i < crumbs.length - 1 ? (
                      <Link href={c.href} className="hover:text-navy transition-colors">{c.label}</Link>
                    ) : i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-ink-soft">{c.label}</span>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        <div
          className={
            split
              ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              : ""
          }
        >
          <div className={split ? "lg:col-span-6" : ""}>
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="kicker"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
              {eyebrow}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className={`font-display mt-5 leading-[0.98] tracking-tightest text-ink ${
                split
                  ? "text-[clamp(2.2rem,5vw,4.2rem)] max-w-[15ch]"
                  : "text-[clamp(2.4rem,6.4vw,5.8rem)] max-w-[18ch]"
              }`}
            >
              {title}
            </motion.h1>

            {lede && (
              <motion.p
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="mt-6 text-ink-soft text-[1.06rem] md:text-[1.14rem] leading-[1.55] max-w-[52ch]"
              >
                {lede}
              </motion.p>
            )}

            {cta && (
              <motion.div
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                {cta}
              </motion.div>
            )}
          </div>

          {split && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="lg:col-span-6"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
