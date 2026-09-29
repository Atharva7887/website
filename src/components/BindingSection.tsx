"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BindingScene = dynamic(() => import("./BindingScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <ProgressBar />
    </div>
  ),
});

function ProgressBar() {
  return (
    <div className="w-40 h-[3px] rounded-full bg-ink/10 overflow-hidden">
      <motion.div
        className="h-full bg-gold"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function BindingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Section spans 3 viewport heights; track from when it enters top to when sticky leaves.
    offset: ["start start", "end end"],
  });

  // Three text "beats" that fade in/out at different progress checkpoints.
  const beat1Opacity = useTransform(scrollYProgress, [0.0, 0.06, 0.22, 0.3], [0, 1, 1, 0]);
  const beat2Opacity = useTransform(scrollYProgress, [0.3, 0.38, 0.55, 0.62], [0, 1, 1, 0]);
  const beat3Opacity = useTransform(scrollYProgress, [0.62, 0.7, 0.95, 1], [0, 1, 1, 1]);

  const beats = [
    {
      step: "Step 01: Apart",
      kickerClass: "text-navy",
      opacity: beat1Opacity,
      title: <>An antigen and a candidate antibody, in solution.</>,
      body: "Two structures, ten thousand possible orientations. Brute-force docking can't see the right one; it has to be reasoned about.",
    },
    {
      step: "Step 02: Approach",
      kickerClass: "text-navy",
      opacity: beat2Opacity,
      title: <>Our models predict the productive trajectory.</>,
      body: "Structural priors plus learned interaction potentials yield the pose, the interface residues, and a calibrated affinity estimate, before any wet-lab spend.",
    },
    {
      step: "Step 03: Bound",
      kickerClass: "text-gold-700",
      opacity: beat3Opacity,
      title: (
        <>
          A locked complex.{" "}
          <em className="italic text-navy">Validated in silico.</em>
        </>
      ),
      body: "This is IndiskaAI's edge: structurally-grounded affinity prediction that closes the loop between sequence design and experimentally-confirmed binding.",
    },
  ];

  return (
    <section
      id="binding"
      ref={ref}
      className="relative bg-cream-100"
      style={{ height: "320vh" }}
    >
      {/* Sticky stage that holds the canvas + overlays.
          Note: explicit z-index hierarchy — canvas at 0, gradient wash at 1,
          text overlays at 10. Nav (z-50 in the layout) stays above all. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden isolate">
        {/* The 3D scene receives the live scroll MotionValue */}
        <div className="absolute inset-0 z-0">
          <BindingScene progress={scrollYProgress} />
        </div>

        {/* Top/bottom wash so 3D fades into the page edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,247,240,0.9) 0%, rgba(250,247,240,0) 24%, rgba(250,247,240,0) 76%, rgba(250,247,240,0.95) 100%)",
          }}
        />
        {/* Left-side radial wash (desktop only) so the text column never
            collides with the 3D, even if the antigen/antibody approach center.
            On mobile the 3D occupies the upper half and text the lower half
            (handled by the text panel's own padding), so this wash is hidden. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
          style={{
            background:
              "radial-gradient(48% 80% at 12% 50%, rgba(250,247,240,0.96) 0%, rgba(250,247,240,0.7) 38%, rgba(250,247,240,0) 70%)",
          }}
        />

        {/* Section header — pinned top-left, well clear of the fixed Nav */}
        <div className="pointer-events-none absolute top-28 md:top-36 left-0 right-0 z-10">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="kicker">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
              Molecular interaction
            </div>
            <h2 className="font-display mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.1] tracking-tightest text-ink max-w-[20ch]">
              Watch a binding event,{" "}
              <span className="italic text-navy">scroll by scroll.</span>
            </h2>
          </div>
        </div>

        {/* Three text beats stacked at the same anchor, crossfaded by scroll */}
        <div className="pointer-events-none absolute inset-0 flex items-end md:items-center pb-20 md:pb-0 z-10">
          <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10">
            <div className="relative md:max-w-[34ch] min-h-[230px] md:min-h-[300px]">
              {beats.map((b, i) => (
                <motion.div
                  key={i}
                  style={{ opacity: b.opacity }}
                  className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-0"
                >
                  <div className={`kicker mb-3 ${b.kickerClass}`}>{b.step}</div>
                  <h3 className="font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.05] tracking-tightest text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-5 text-ink-soft text-[1rem] md:text-[1.08rem] leading-[1.55]">
                    {b.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden md:block z-10">
          <div className="h-40 w-[2px] bg-ink/10 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-navy to-gold"
              style={{
                scaleY: scrollYProgress,
                transformOrigin: "top",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
