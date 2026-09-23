"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ILLUSTRATIONS, type IllustrationName } from "./Illustrations";

export type StoryFrame = { art: IllustrationName; title: string; caption: string };

const FRAME_MS = 3600;

/**
 * A short "video" built from our own schematics: frames advance like a clip,
 * with play/pause and step controls. No media download, no licensing
 * question, and it only runs while on screen. Reduced-motion visitors get it
 * paused on frame one and step through by hand.
 */
export default function MotionStory({
  label,
  frames,
  description,
}: {
  label: string;
  frames: StoryFrame[];
  description: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduceMotion) setPlaying(false);
  }, [reduceMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && inView;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % frames.length), FRAME_MS);
    return () => window.clearTimeout(t);
  }, [running, index, frames.length]);

  const frame = frames[index];
  const Art = ILLUSTRATIONS[frame.art];

  return (
    <figure
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-cream-50 to-cream-200/60 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`block h-2 w-2 rounded-full bg-gold ${running ? "sci-pulse" : ""}`} />
          <span className="truncate text-[0.7rem] tracking-[0.12em] uppercase text-ink-muted">{label}</span>
        </div>
        <span className="shrink-0 text-[0.7rem] tracking-[0.12em] uppercase text-ink-muted tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")} · Schematic
        </span>
      </div>

      <div role="img" aria-label={description} className="relative aspect-[3/2] px-6 pt-6 md:px-10 md:pt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            <Art />
          </motion.div>
        </AnimatePresence>
      </div>

      <figcaption className="px-5 pb-5 pt-3 md:px-8" aria-live={running ? "off" : "polite"}>
        <div className="font-display text-[1.15rem] leading-tight tracking-tightest text-ink">{frame.title}</div>
        <p className="mt-1 text-[0.85rem] leading-[1.5] text-ink-soft min-h-[2.6em]">{frame.caption}</p>
      </figcaption>

      <div className="flex items-center gap-3 px-5 pb-5 md:px-8">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause sequence" : "Play sequence"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream-100 transition-colors hover:bg-navy"
        >
          {playing ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /><rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M3 1.5 L10.5 6 L3 10.5 Z" fill="currentColor" /></svg>
          )}
        </button>
        <ol className="flex flex-1 gap-1.5">
          {frames.map((f, i) => (
            <li key={f.title} className="flex-1">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Step ${i + 1}: ${f.title}`}
                aria-current={i === index ? "step" : undefined}
                className="group block w-full py-2"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-black/10">
                  {i < index && <span className="absolute inset-0 bg-navy" />}
                  {i === index && (
                    <motion.span
                      key={`${index}-${running}`}
                      className="absolute inset-y-0 left-0 bg-gold"
                      initial={{ width: running ? "0%" : "100%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: running ? FRAME_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
