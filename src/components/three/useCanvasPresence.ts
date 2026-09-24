"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Viewport lifecycle for WebGL visuals: `near` (within about a screen) decides
 * whether the canvas exists at all, `visible` whether its loop runs. `lite`
 * flags touch / low-core devices for cheaper rendering.
 */
export function useCanvasPresence(ref: RefObject<HTMLElement>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setLite(window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency ?? 8) <= 4);
    const mountIO = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "100% 0px" });
    const runIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    mountIO.observe(el);
    runIO.observe(el);
    return () => { mountIO.disconnect(); runIO.disconnect(); };
  }, [ref]);

  return { near, visible, lite };
}
