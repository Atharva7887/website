"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Short muted loop. Only plays while on screen, never autoplays for
 * reduced-motion visitors, and always offers a pause control.
 * `#t=0.1` makes the browser paint the first frame as a poster.
 */
export default function LoopVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [wantPlay, setWantPlay] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduceMotion) setWantPlay(false);
  }, [reduceMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (wantPlay && inView) v.play().catch(() => setWantPlay(false));
    else v.pause();
  }, [wantPlay, inView]);

  return (
    <div className="relative aspect-video">
      <video
        ref={ref}
        src={`${src}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => setWantPlay((p) => !p)}
        aria-label={wantPlay ? "Pause video" : "Play video"}
        className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/90 text-ink shadow transition-colors hover:bg-gold"
      >
        {wantPlay ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /><rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" aria-hidden="true"><path d="M3 1.5 L10.5 6 L3 10.5 Z" fill="currentColor" /></svg>
        )}
      </button>
    </div>
  );
}
