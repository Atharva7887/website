"use client";

/**
 * Comparative candidate analysis, rebuilt from the supplied
 * comparative-candidate-graph page as a responsive SVG. Each dot is one
 * top-ranked pose, the band its spread and the bar the candidate's overall
 * result. All values are illustrative and labelled so inside the figure.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CANDIDATES = [
  { name: "Parent candidate", short: "Parent", color: "#1E5BA8", value: 0.46, spread: 0.07 },
  { name: "Benchmark candidate", short: "Benchmark", color: "#6B6B6B", value: 0.6, spread: 0.06, dashed: true },
  { name: "AI-assisted candidate 1", short: "AI-assisted 1", color: "#D9A91A", value: 0.86, spread: 0.045 },
  { name: "AI-assisted candidate 2", short: "AI-assisted 2", color: "#7FA3D1", value: 0.76, spread: 0.055 },
];
const POSES = 12;

function rng(s: number) {
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function CandidateComparison({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(0);
  const [H, setH] = useState(0);
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { setW(Math.floor(e.contentRect.width)); setH(Math.floor(e.contentRect.height)); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    // Replay the reveal when the card is hovered or focused.
    const card = el.closest(".group");
    let timer = 0;
    const replay = () => { if (reduced) return; setOn(false); window.clearTimeout(timer); timer = window.setTimeout(() => setOn(true), 60); };
    card?.addEventListener("mouseenter", replay);
    card?.addEventListener("focusin", replay);
    return () => { ro.disconnect(); io.disconnect(); window.clearTimeout(timer); card?.removeEventListener("mouseenter", replay); card?.removeEventListener("focusin", replay); };
  }, [reduced]);

  const dots = useMemo(
    () => CANDIDATES.map((c, i) => { const r = rng(31 + i * 557); return Array.from({ length: POSES }, () => { let u = 0; for (let q = 0; q < 4; q++) u += r(); return { v: c.value + (u - 2) * c.spread * 0.9, dy: r() - 0.5 }; }); }),
    [],
  );

  const narrow = W < 460;
  // axisH leaves room for the axis labels plus the legend chip beneath them.
  const ml = narrow ? 92 : 172, mr = 18, mt = 40, axisH = 84;
  const rowH = Math.max(34, Math.min(62, (H - mt - axisH) / CANDIDATES.length));
  const pw = Math.max(10, W - ml - mr), ay = mt + CANDIDATES.length * rowH;
  const X = (v: number) => ml + Math.max(0, Math.min(1, v)) * pw;
  const shown = on || reduced;
  const tr = (css: string) => (reduced ? undefined : css);

  return (
    <div ref={box} role="img" aria-label="Illustrative comparison of docking results for a parent, a benchmark and two AI-assisted candidates; each dot is one top-ranked pose and the bar the candidate's overall result" className={`relative overflow-hidden bg-gradient-to-br from-cream-100 to-[#EEE7D8] ${className}`}>
      <span className="absolute right-3 top-3 rounded-full border border-black/10 bg-[#FFFDF8]/90 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Illustrative data</span>
      {W > 0 && H > 0 && (
        <svg width={W} height={H} className="block" aria-hidden="true" focusable="false">
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={X(i / 5)} x2={X(i / 5)} y1={mt} y2={ay} stroke="rgba(26,26,26,0.07)" />)}
          {CANDIDATES.map((c, i) => {
            const cy = mt + i * rowH + rowH / 2, bh = Math.min(28, rowH - 8);
            return (
              <g key={c.name}>
                <text x={ml - 12} y={cy + 4} textAnchor="end" fontSize={narrow ? 10.5 : 12.5} fontWeight={500} fill="#2D323C">{narrow ? c.short : c.name}</text>
                <rect x={ml} y={cy - bh / 2} width={pw} height={bh} rx={7} fill="#EFEBE2" />
                <rect x={X(c.value - c.spread * 1.6)} y={cy - bh / 2} width={X(c.value + c.spread * 1.6) - X(c.value - c.spread * 1.6)} height={bh} rx={7} fill={c.color} style={{ opacity: shown ? 0.18 : 0, transition: tr("opacity .6s ease") }} />
                <rect x={ml} y={cy - 3.5} height={7} rx={3.5} fill={c.color} opacity={c.dashed ? 0.55 : 0.9} width={shown ? X(c.value) - ml : 0} style={{ transition: tr(`width 1.1s cubic-bezier(.2,.7,.2,1) ${i * 0.22}s`) }} />
                {dots[i].map((d, k) => (
                  <circle key={k} cx={X(d.v)} cy={cy + d.dy * (bh - 8)} r={narrow ? 3.2 : 3.8} fill={c.color} stroke="#FFFDF8" strokeWidth={1} style={{ opacity: shown ? 0.8 : 0, transition: tr(`opacity .4s ease ${i * 0.22 + 0.35 + k * 0.04}s`) }} />
                ))}
                <circle cx={X(c.value)} cy={cy} r={narrow ? 6.5 : 8} fill="#FFFDF8" stroke={c.color} strokeWidth={2.6} strokeDasharray={c.dashed ? "4 3" : undefined} style={{ opacity: shown ? 1 : 0, transition: tr(`opacity .4s ease ${i * 0.22 + 0.5}s`) }} />
              </g>
            );
          })}
          <line x1={ml} x2={ml + pw} y1={ay} y2={ay} stroke="rgba(26,26,26,0.28)" />
          <text x={ml} y={ay + 17} fontSize={10.5} fill="#6B6B6B">Lower</text>
          <text x={ml + pw} y={ay + 17} fontSize={10.5} fill="#6B6B6B" textAnchor="end">Higher</text>
          <text x={ml + pw / 2} y={ay + 36} fontSize={11} fill="#4A4A4A" textAnchor="middle">Docking performance →</text>
        </svg>
      )}
      <div aria-hidden className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-xl border border-black/10 bg-[#FFFDF8]/90 px-3 py-1 text-[11px] leading-snug text-ink-muted">
        Top-ranked poses per candidate (dots) · overall result (bar)
      </div>
    </div>
  );
}
