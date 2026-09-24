"use client";

/**
 * Illustrative MD analysis plots for "What we analyse", rebuilt from the
 * supplied analyse-plots pages as React SVG (no WebGL): a time-series line
 * chart, grouped bars, a scrolling contact raster and a PCA scatter.
 *
 * The curves are seeded shapes with gentle live noise — they show what each
 * analysis looks like, never a result. The three series are neutral example
 * candidates; nothing here implies one method or candidate is better.
 */
import { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

export type MdPlotKey = "rmsd" | "rmsf" | "rg" | "sasa" | "hbonds" | "contacts" | "pca" | "mmpbsa";

type Key = "a" | "b" | "c";
type Series = { key: Key; name: string; color: string; dash?: string };
const SERIES: Series[] = [
  { key: "a", name: "Candidate A", color: "#1E5BA8" },
  { key: "b", name: "Candidate B", color: "#D9A91A", dash: "6 4" },
  { key: "c", name: "Candidate C", color: "#6B6B6B" },
];

const GRID = "rgba(26,26,26,0.07)";
const AXIS = "rgba(26,26,26,0.28)";
const TICK = "#6B6B6B";
const REGION = "#F1ECE1";

type Draw = (T: number, dt: number) => void;

const rnd = (s: number) => () => ((s = (Math.imul(s ^ (s >>> 15), 1 | s) + 0x6d2b79f5) | 0), ((s ^ (s >>> 7)) >>> 0) / 4294967296);
const gauss = (r: () => number) => { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * r()); };
const fx = (v: number, d = 1) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(d);
function arNoise(n: number, phi: number, sig: number, seed: number) {
  const r = rnd(seed);
  let a = 0;
  return Array.from({ length: n }, () => (a = phi * a + gauss(r) * sig));
}
/** Catmull-Rom through the points, as cubic Béziers. */
function smoothPath(P: [number, number][]) {
  if (!P.length) return "";
  let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2, k = 1 / 6;
    d += `C${(p1[0] + (p2[0] - p0[0]) * k).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * k).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * k).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * k).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
/** Rounded-end bar anchored flat on the baseline. */
function barPath(x: number, y0: number, w: number, y1: number, r = 3, horiz = false) {
  if (!horiz) {
    const up = y1 < y0, h = Math.abs(y1 - y0), rr = Math.min(r, h, w / 2);
    if (h < 0.5) return "";
    return up
      ? `M${x} ${y0}V${y1 + rr}Q${x} ${y1} ${x + rr} ${y1}H${x + w - rr}Q${x + w} ${y1} ${x + w} ${y1 + rr}V${y0}Z`
      : `M${x} ${y0}V${y1 - rr}Q${x} ${y1} ${x + rr} ${y1}H${x + w - rr}Q${x + w} ${y1} ${x + w} ${y1 - rr}V${y0}Z`;
  }
  const [yy, x0, hh, x1] = [x, y0, w, y1];
  const L = Math.abs(x1 - x0), rr = Math.min(r, L, hh / 2);
  if (L < 0.5) return "";
  return `M${x0} ${yy}H${x1 - rr}Q${x1} ${yy} ${x1} ${yy + rr}V${yy + hh - rr}Q${x1} ${yy + hh} ${x1 - rr} ${yy + hh}H${x0}Z`;
}

/** Runs `draw` every frame while the plot is on screen; one still frame under reduced motion. */
function useLoop(el: RefObject<SVGSVGElement>, draw: MutableRefObject<Draw>, deps: unknown[]) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    draw.current(0, 0);
    if (reduced) return;
    let vis = true, raf = 0, T = 0, last = performance.now();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; });
    io.observe(node);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!vis || document.hidden) return;
      T += dt;
      draw.current(T, dt);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}

const set = (e: Element | null | undefined, a: Record<string, string | number>) => {
  if (e) for (const k in a) e.setAttribute(k, String(a[k]));
};

type Margin = { l: number; r: number; t: number; b: number };

function AxisLabels({ W, H, M, xLabel, yLabel }: { W: number; H: number; M: Margin; xLabel?: string; yLabel?: string }) {
  return (
    <>
      {xLabel && <text x={(M.l + W - M.r) / 2} y={H - 3} fontSize={11} fill="#4A4A4A" textAnchor="middle">{xLabel}</text>}
      {yLabel && <text fontSize={11} fill="#4A4A4A" textAnchor="middle" transform={`translate(12 ${(M.t + H - M.b) / 2}) rotate(-90)`}>{yLabel}</text>}
    </>
  );
}

/* ---------- time-series line chart (RMSD, Rg, SASA) ---------- */

type LineCfg = {
  x0: number; x1: number; y0: number; y1: number; yTicks: number[]; yFmt: (v: number) => string; xTicks: number[];
  xLabel: string; yLabel: string;
  data: Record<Key, { f: (x: number) => number; env: (x: number) => number; noise: number; sd: number; drift: number; dph: number }>;
};

function LineChart({ o, W, H }: { o: LineCfg; W: number; H: number }) {
  const narrow = W < 440;
  const M = { l: 46, r: narrow ? 36 : 78, t: 10, b: 36 };
  const N = narrow ? 120 : 200;
  const xs = useMemo(() => Array.from({ length: N }, (_, i) => o.x0 + ((o.x1 - o.x0) * i) / (N - 1)), [o, N]);
  const S = useMemo(
    () => SERIES.map((s, k) => ({ ...s, ...o.data[s.key], noiseA: arNoise(N, 0.8, 1, 101 + k * 37), ph: Array.from({ length: N }, rnd(7 + k)).map((v) => v * 6.283) })),
    [o, N],
  );
  const X = (v: number) => M.l + ((v - o.x0) / (o.x1 - o.x0)) * (W - M.l - M.r);
  const Y = (v: number) => M.t + (1 - (v - o.y0) / (o.y1 - o.y0)) * (H - M.t - M.b);
  const svg = useRef<SVGSVGElement>(null);
  const lines = useRef<(SVGPathElement | null)[]>([]), bands = useRef<(SVGPathElement | null)[]>([]), labs = useRef<(SVGTextElement | null)[]>([]);
  const draw = useRef<Draw>(() => {});
  draw.current = (T) => {
    const ys: { k: number; y: number }[] = [];
    S.forEach((s, k) => {
      const drift = s.drift * Math.sin(T * 0.3 + s.dph);
      const cur = xs.map((x, i) => s.f(x) + s.noise * s.noiseA[i] * (0.8 + 0.35 * Math.sin(T * 1.05 + s.ph[i])) + drift * s.env(x));
      set(lines.current[k], { d: smoothPath(xs.map((x, i) => [X(x), Y(cur[i])])) });
      const up: [number, number][] = [], dn: [number, number][] = [];
      xs.forEach((x, i) => {
        if (i % 4) return;
        const sd = s.sd * s.env(x) * (0.92 + 0.08 * Math.sin(T * 0.5 + i * 0.07));
        up.push([X(x), Y(s.f(x) + sd)]);
        dn.push([X(x), Y(s.f(x) - sd)]);
      });
      set(bands.current[k], { d: smoothPath(up) + "L" + smoothPath(dn.reverse()).slice(1) + "Z" });
      ys.push({ k, y: Y(cur.slice(-24).reduce((a, b) => a + b, 0) / 24) });
    });
    ys.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ys.length; i++) if (ys[i].y - ys[i - 1].y < 14) ys[i].y = ys[i - 1].y + 14;
    ys.forEach((q) => set(labs.current[q.k], { x: W - M.r + 7, y: q.y }));
  };
  useLoop(svg, draw, [W, H]);
  return (
    <svg ref={svg} width={W} height={H} className="block overflow-visible" aria-hidden="true" focusable="false">
      {o.yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke={GRID} />
          <text x={M.l - 8} y={Y(v)} fontSize={10.5} fill={TICK} textAnchor="end" dominantBaseline="middle">{o.yFmt(v)}</text>
        </g>
      ))}
      {o.xTicks.map((v) => <text key={v} x={X(v)} y={H - M.b + 16} fontSize={10.5} fill={TICK} textAnchor="middle">{v}</text>)}
      <path d={`M${M.l} ${M.t}V${H - M.b}H${W - M.r}`} stroke={AXIS} strokeWidth={1.2} fill="none" />
      <AxisLabels W={W} H={H} M={M} xLabel={o.xLabel} yLabel={o.yLabel} />
      {S.map((s, k) => <path key={`b${s.key}`} ref={(e) => { bands.current[k] = e; }} fill={s.color} fillOpacity={0.12} />)}
      {S.map((s, k) => (
        <path key={`l${s.key}`} ref={(e) => { lines.current[k] = e; }} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dash} />
      ))}
      {!narrow && S.map((s, k) => (
        <text key={`t${s.key}`} ref={(e) => { labs.current[k] = e; }} fontSize={11} fontWeight={600} fill={s.color} dominantBaseline="middle">{s.name.replace("Candidate ", "")}</text>
      ))}
    </svg>
  );
}

/* ---------- grouped bars (RMSF, MM-PBSA vertical; H-bonds horizontal) ---------- */

type BarCfg = {
  cats: string[]; shortCats?: string[]; horizontal?: boolean; v0: number; v1: number; base?: number; ticks: number[]; fmt: (v: number) => string;
  xLabel?: string; yLabel?: string; margin?: Partial<Margin>; regions?: { from: number; to: number; label: string }[];
  values: Record<Key, number[]>; err?: Record<Key, number[]>; wobble: number;
};

function BarChart({ o, W, H }: { o: BarCfg; W: number; H: number }) {
  const narrow = W < 440;
  const hz = !!o.horizontal;
  const cats = narrow && o.shortCats ? o.shortCats : o.cats;
  const M: Margin = { l: 46, r: 16, t: o.regions ? 24 : 10, b: 36, ...o.margin, ...(hz ? { l: narrow ? 64 : 124 } : {}) };
  const span = hz ? H - M.t - M.b : W - M.l - M.r;
  const step = span / cats.length;
  const P = (i: number) => (hz ? M.t : M.l) + (i + 0.5) * step;
  const Vs = (v: number) => (hz ? M.l + ((v - o.v0) / (o.v1 - o.v0)) * (W - M.l - M.r) : M.t + (1 - (v - o.v0) / (o.v1 - o.v0)) * (H - M.t - M.b));
  const phase = useMemo(() => { const r = rnd(55); return o.cats.map(() => SERIES.map(() => r() * 6.283)); }, [o]);
  const svg = useRef<SVGSVGElement>(null);
  const bars = useRef<(SVGPathElement | null)[]>([]), errs = useRef<(SVGPathElement | null)[]>([]);
  const draw = useRef<Draw>(() => {});
  const base = Vs(o.base ?? 0);
  draw.current = (T) => {
    const gw = step * (hz ? 0.8 : 0.82), n = SERIES.length, bw = Math.max(2, (gw - (n - 1) * 2) / n);
    SERIES.forEach((s, k) =>
      o.cats.forEach((_, i) => {
        const v = o.values[s.key][i] * (1 + o.wobble * Math.sin(T * (0.7 + 0.13 * k) + phase[i][k]));
        const p0 = P(i) - gw / 2 + k * (bw + 2), idx = k * o.cats.length + i;
        set(bars.current[idx], { d: barPath(p0, base, bw, Vs(v), Math.min(3, bw / 2), hz) });
        if (o.err) {
          const e = o.err[s.key][i], a = Vs(v - e), z = Vs(v + e), m = p0 + bw / 2, cw = Math.min(3, bw / 2);
          set(errs.current[idx], { d: hz ? `M${a} ${m}H${z}M${a} ${m - cw}V${m + cw}M${z} ${m - cw}V${m + cw}` : `M${m} ${a}V${z}M${m - cw} ${a}H${m + cw}M${m - cw} ${z}H${m + cw}` });
        }
      }),
    );
  };
  useLoop(svg, draw, [W, H]);
  const every = !hz && step < 30 ? 2 : 1;
  return (
    <svg ref={svg} width={W} height={H} className="block overflow-visible" aria-hidden="true" focusable="false">
      {o.regions?.map((g) => {
        const a = P(g.from) - step / 2 + 2, z = P(g.to) + step / 2 - 2;
        return (
          <g key={g.label}>
            <rect x={a} y={M.t - 20} width={z - a} height={H - M.t - M.b + 20} rx={8} fill={REGION} />
            <text x={(a + z) / 2} y={M.t - 8} fontSize={9.5} fontWeight={600} letterSpacing="0.08em" fill="#9A9385" textAnchor="middle">{g.label}</text>
          </g>
        );
      })}
      {o.ticks.map((v) =>
        hz ? (
          <g key={v}>
            <line y1={M.t} y2={H - M.b} x1={Vs(v)} x2={Vs(v)} stroke={GRID} />
            <text y={H - M.b + 16} x={Vs(v)} fontSize={10.5} fill={TICK} textAnchor="middle">{o.fmt(v)}</text>
          </g>
        ) : (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={Vs(v)} y2={Vs(v)} stroke={GRID} />
            <text x={M.l - 8} y={Vs(v)} fontSize={10.5} fill={TICK} textAnchor="end" dominantBaseline="middle">{o.fmt(v)}</text>
          </g>
        ),
      )}
      {cats.map((c, i) =>
        i % every ? null : hz ? (
          <text key={c} x={M.l - 8} y={P(i)} fontSize={10} fill="#5E5A52" textAnchor="end" dominantBaseline="middle">{c}</text>
        ) : (
          <text key={c} x={P(i)} y={H - M.b + 15} fontSize={10} fill="#5E5A52" textAnchor="middle">{c}</text>
        ),
      )}
      {hz ? (
        <path d={`M${base} ${M.t}V${H - M.b}H${W - M.r}`} stroke={AXIS} strokeWidth={1.2} fill="none" />
      ) : (
        <>
          <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke={AXIS} strokeWidth={1.2} />
          <line x1={M.l} x2={W - M.r} y1={base} y2={base} stroke={AXIS} strokeWidth={1.2} strokeDasharray={o.v0 < 0 ? "4 4" : undefined} />
        </>
      )}
      <AxisLabels W={W} H={H} M={M} xLabel={o.xLabel} yLabel={o.yLabel} />
      {SERIES.map((s, k) => o.cats.map((_, i) => <path key={`${s.key}${i}`} ref={(e) => { bars.current[k * o.cats.length + i] = e; }} fill={s.color} fillOpacity={0.95} />))}
      {o.err && SERIES.map((s, k) => o.cats.map((_, i) => <path key={`e${s.key}${i}`} ref={(e) => { errs.current[k * o.cats.length + i] = e; }} stroke="#5E5A52" strokeWidth={1.1} fill="none" strokeLinecap="round" />))}
    </svg>
  );
}

/* ---------- contact persistence raster, scrolling like a live trajectory ---------- */

type RasterCfg = { rows: string[]; p: Record<Key, number[]> };

function Raster({ o, W, H }: { o: RasterCfg; W: number; H: number }) {
  const C = W < 440 ? 24 : 36, K = SERIES.length;
  const M: Margin = { l: 42, r: 40, t: 6, b: 36 };
  const gap = 8, rh = (H - M.t - M.b - gap * (o.rows.length - 1)) / (o.rows.length * K), cw = (W - M.l - M.r) / C;
  const Yr = (i: number, k: number) => M.t + i * (K * rh + gap) + k * rh;
  const sim = useMemo(() => {
    const r = rnd(909);
    const state = o.rows.map(() => SERIES.map(() => r() < 0.5));
    const next = (i: number, k: number) => {
      const p = o.p[SERIES[k].key][i], kk = 0.32;
      const on = state[i][k] ? r() < 1 - (1 - p) * kk : r() < p * kk;
      state[i][k] = on;
      return on;
    };
    return { next, grid: o.rows.map((_, i) => SERIES.map((_, k) => Array.from({ length: C + 1 }, () => next(i, k)))), shift: 0 };
  }, [o, C]);
  const svg = useRef<SVGSVGElement>(null);
  const cells = useRef<(SVGRectElement | null)[]>([]), occ = useRef<(SVGTextElement | null)[]>([]);
  const draw = useRef<Draw>(() => {});
  draw.current = (_, dt) => {
    sim.shift += dt * 1.1;
    if (sim.shift >= 1) {
      sim.shift -= 1;
      sim.grid.forEach((row, i) => row.forEach((c, k) => { c.shift(); c.push(sim.next(i, k)); }));
    }
    o.rows.forEach((_, i) =>
      SERIES.forEach((_, k) => {
        const g = sim.grid[i][k];
        g.forEach((v, c) => {
          const e = cells.current[(i * K + k) * (C + 1) + c];
          set(e, { x: M.l + (c - sim.shift) * cw + 1, y: Yr(i, k) + 1, visibility: v ? "visible" : "hidden" });
        });
        const t = occ.current[i * K + k];
        if (t) t.textContent = Math.round((g.filter(Boolean).length / (C + 1)) * 100) + "%";
      }),
    );
  };
  useLoop(svg, draw, [W, H]);
  const clip = `clip-raster-${W}`;
  return (
    <svg ref={svg} width={W} height={H} className="block overflow-visible" aria-hidden="true" focusable="false">
      <defs><clipPath id={clip}><rect x={M.l} y={0} width={W - M.l - M.r} height={H} /></clipPath></defs>
      {o.rows.map((name, i) => (
        <g key={name}>
          <rect x={M.l} y={Yr(i, 0) - 2} width={W - M.l - M.r} height={K * rh + 4} rx={6} fill={REGION} />
          <text x={M.l - 10} y={Yr(i, 0) + (K * rh) / 2} fontSize={10} fill="#5E5A52" textAnchor="end" dominantBaseline="middle">{name}</text>
          {SERIES.map((s, k) => (
            <text key={s.key} ref={(e) => { occ.current[i * K + k] = e; }} x={W - M.r + 6} y={Yr(i, k) + rh / 2} fontSize={9} fill={TICK} dominantBaseline="middle" />
          ))}
        </g>
      ))}
      <g clipPath={`url(#${clip})`}>
        {o.rows.map((_, i) =>
          SERIES.map((s, k) =>
            Array.from({ length: C + 1 }, (_, c) => (
              <rect
                key={`${i}${s.key}${c}`}
                ref={(e) => { cells.current[(i * K + k) * (C + 1) + c] = e; }}
                width={Math.max(1, cw - 2)}
                height={Math.max(1, rh - 2)}
                rx={Math.min(2.5, rh / 3)}
                fill={s.color}
                fillOpacity={0.92}
              />
            )),
          ),
        )}
      </g>
      <line x1={M.l} x2={W - M.r} y1={H - M.b + 2} y2={H - M.b + 2} stroke={AXIS} strokeWidth={1.2} />
      {[0, 25, 50, 75, 100].map((v) => <text key={v} x={M.l + (v / 100) * (W - M.l - M.r)} y={H - M.b + 17} fontSize={10.5} fill={TICK} textAnchor="middle">{v}</text>)}
      <AxisLabels W={W} H={H} M={M} xLabel="Time (ns)" />
    </svg>
  );
}

/* ---------- PCA scatter with basins and 1.5σ ellipses ---------- */

type Basin = { x: number; y: number; sx: number; sy: number; rho?: number; n: number };
type ScatterCfg = { x0: number; x1: number; y0: number; y1: number; xTicks: number[]; yTicks: number[]; jit: number; xLabel: string; yLabel: string; basins: Record<Key, Basin[]> };

function Scatter({ o, W, H }: { o: ScatterCfg; W: number; H: number }) {
  const M: Margin = { l: 46, r: 14, t: 10, b: 36 };
  const X = (v: number) => M.l + ((v - o.x0) / (o.x1 - o.x0)) * (W - M.l - M.r);
  const Y = (v: number) => M.t + (1 - (v - o.y0) / (o.y1 - o.y0)) * (H - M.t - M.b);
  const { pts, groups } = useMemo(() => {
    const pts: { k: number; g: number; bx: number; by: number; ph: number; w: number; x: number; y: number }[] = [];
    const groups: { g: number; k: number }[] = [];
    SERIES.forEach((s, k) => {
      const r = rnd(300 + k * 17);
      o.basins[s.key].forEach((b) => {
        // Small transit clusters get no ellipse.
        const g = b.n >= 12 ? groups.push({ g: groups.length, k }) - 1 : -1;
        for (let i = 0; i < b.n; i++) {
          const u = gauss(r), v = gauss(r);
          pts.push({ k, g, bx: b.x + u * b.sx, by: b.y + v * b.sy + u * (b.rho ?? 0) * b.sy, ph: r() * 6.283, w: 0.5 + r() * 0.6, x: 0, y: 0 });
        }
      });
    });
    return { pts, groups };
  }, [o]);
  const svg = useRef<SVGSVGElement>(null);
  const dots = useRef<(SVGCircleElement | null)[]>([]), ells = useRef<(SVGEllipseElement | null)[]>([]);
  const draw = useRef<Draw>(() => {});
  draw.current = (T) => {
    const acc: Record<number, { x: number; y: number }[]> = {};
    groups.forEach(({ g }) => (acc[g] = []));
    pts.forEach((p, i) => {
      p.x = p.bx + o.jit * Math.sin(T * p.w + p.ph);
      p.y = p.by + o.jit * Math.cos(T * p.w * 0.9 + p.ph * 1.3);
      set(dots.current[i], { cx: X(p.x), cy: Y(p.y) });
      if (p.g >= 0) acc[p.g].push(p);
    });
    groups.forEach(({ g }, j) => {
      const a = acc[g];
      const mx = a.reduce((q, p) => q + p.x, 0) / a.length, my = a.reduce((q, p) => q + p.y, 0) / a.length;
      const sx = Math.sqrt(a.reduce((q, p) => q + (p.x - mx) ** 2, 0) / a.length), sy = Math.sqrt(a.reduce((q, p) => q + (p.y - my) ** 2, 0) / a.length);
      set(ells.current[j], { cx: X(mx), cy: Y(my), rx: Math.abs(X(mx + 1.5 * sx) - X(mx)), ry: Math.abs(Y(my + 1.5 * sy) - Y(my)) });
    });
  };
  useLoop(svg, draw, [W, H]);
  return (
    <svg ref={svg} width={W} height={H} className="block overflow-visible" aria-hidden="true" focusable="false">
      {o.yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke={GRID} />
          <text x={M.l - 8} y={Y(v)} fontSize={10.5} fill={TICK} textAnchor="end" dominantBaseline="middle">{fx(v, 0)}</text>
        </g>
      ))}
      {o.xTicks.map((v) => <text key={v} x={X(v)} y={H - M.b + 16} fontSize={10.5} fill={TICK} textAnchor="middle">{fx(v, 0)}</text>)}
      <line x1={X(0)} x2={X(0)} y1={M.t} y2={H - M.b} stroke={GRID} strokeDasharray="3 4" />
      <path d={`M${M.l} ${M.t}V${H - M.b}H${W - M.r}`} stroke={AXIS} strokeWidth={1.2} fill="none" />
      <AxisLabels W={W} H={H} M={M} xLabel={o.xLabel} yLabel={o.yLabel} />
      {groups.map(({ g, k }, j) => (
        <ellipse key={g} ref={(e) => { ells.current[j] = e; }} fill={SERIES[k].color} fillOpacity={0.08} stroke={SERIES[k].color} strokeOpacity={0.7} strokeWidth={1.1} strokeDasharray="4 4" />
      ))}
      {pts.map((p, i) => <circle key={i} ref={(e) => { dots.current[i] = e; }} r={3.1} fill={SERIES[p.k].color} fillOpacity={0.8} stroke="#FAF7F0" strokeWidth={0.9} />)}
    </svg>
  );
}

/* ---------- the eight analyses (curve shapes from the supplied plots) ---------- */

const rise = (r0: number, p: number, tau: number, extra?: (x: number) => number) => (x: number) => r0 + (p - r0) * (1 - Math.exp(-x / tau)) + (extra ? extra(x) : 0);
const settle = (a: number, b: number, tau: number, trend = 0) => (x: number) => b + (a - b) * Math.exp(-x / tau) + (trend * x) / 100;
const decay = (a: number, b: number, tau: number) => (x: number) => b + (a - b) * Math.exp(-x / tau);
const envRise = (tau: number) => (x: number) => 1 - Math.exp(-x / tau);
const envFrom = (floor: number, tau: number) => (x: number) => floor + (1 - floor) * (1 - Math.exp(-x / tau));
const TIME_TICKS = [0, 20, 40, 60, 80, 100];

const RMSD: LineCfg = {
  x0: 0, x1: 100, y0: 0, y1: 3.5, yTicks: [0, 1, 2, 3], yFmt: (v) => v.toFixed(1), xTicks: TIME_TICKS, xLabel: "Time (ns)", yLabel: "RMSD (Å)",
  data: {
    a: { f: rise(0.3, 2.42, 7, (x) => 0.2 / (1 + Math.exp(-(x - 58) / 3))), env: envRise(7), noise: 0.075, sd: 0.2, drift: 0.05, dph: 0 },
    b: { f: rise(0.3, 2.05, 6), env: envRise(6), noise: 0.065, sd: 0.16, drift: 0.04, dph: 1.7 },
    c: { f: rise(0.3, 1.55, 5), env: envRise(5), noise: 0.05, sd: 0.11, drift: 0.03, dph: 3.1 },
  },
};
const RG: LineCfg = {
  x0: 0, x1: 100, y0: 1.8, y1: 2.0, yTicks: [1.8, 1.85, 1.9, 1.95, 2.0], yFmt: (v) => v.toFixed(2), xTicks: TIME_TICKS, xLabel: "Time (ns)", yLabel: "Rg (nm)",
  data: {
    a: { f: settle(1.905, 1.955, 12, 0.012), env: envFrom(0.6, 8), noise: 0.0065, sd: 0.014, drift: 0.004, dph: 0 },
    b: { f: settle(1.905, 1.925, 10), env: envFrom(0.6, 8), noise: 0.0055, sd: 0.011, drift: 0.003, dph: 1.4 },
    c: { f: settle(1.9, 1.872, 8), env: envFrom(0.6, 8), noise: 0.0045, sd: 0.008, drift: 0.0025, dph: 2.6 },
  },
};
const SASA: LineCfg = {
  x0: 0, x1: 100, y0: 94, y1: 116, yTicks: [94, 100, 106, 112], yFmt: (v) => String(v), xTicks: TIME_TICKS, xLabel: "Time (ns)", yLabel: "SASA (nm²)",
  data: {
    a: { f: decay(112.5, 106.2, 45), env: envFrom(0.7, 10), noise: 0.55, sd: 1.1, drift: 0.35, dph: 0 },
    b: { f: decay(110.8, 104.1, 40), env: envFrom(0.7, 10), noise: 0.5, sd: 0.95, drift: 0.3, dph: 1.3 },
    c: { f: decay(107.5, 99.2, 35), env: envFrom(0.7, 10), noise: 0.42, sd: 0.75, drift: 0.25, dph: 2.4 },
  },
};
const RMSF: BarCfg = {
  cats: ["L4", "S25", "G26", "Y27", "T28", "S31", "Y32", "W47", "I51", "S52", "G54", "Y59", "R94", "D99", "G100", "Y101", "F102", "W103"],
  v0: 0, v1: 3.5, ticks: [0, 1, 2, 3], fmt: (v) => v.toFixed(1), xLabel: "Residue", yLabel: "RMSF (Å)", margin: { b: 38 }, wobble: 0.035,
  regions: [{ from: 2, to: 6, label: "LOOP 1" }, { from: 8, to: 11, label: "LOOP 2" }, { from: 13, to: 16, label: "LOOP 3" }],
  values: {
    a: [1.05, 0.72, 1.32, 1.58, 1.46, 1.62, 1.2, 0.48, 0.92, 1.3, 1.48, 0.88, 0.62, 2.35, 2.98, 2.62, 1.72, 0.64],
    b: [0.98, 0.68, 1.18, 1.4, 1.3, 1.44, 1.08, 0.46, 0.86, 1.18, 1.32, 0.8, 0.58, 1.95, 2.44, 2.18, 1.46, 0.6],
    c: [0.92, 0.62, 0.98, 1.12, 1.06, 1.18, 0.9, 0.42, 0.76, 0.98, 1.08, 0.7, 0.54, 1.28, 1.62, 1.44, 1.02, 0.55],
  },
};
const HBONDS: BarCfg = {
  cats: ["Y32 OH · E45 OE1", "R58 NH2 · D72 OD2", "Y101 OH · K49 NZ", "S31 OG · N47 OD1", "D99 OD1 · R22 NH1"],
  shortCats: ["Y32–E45", "R58–D72", "Y101–K49", "S31–N47", "D99–R22"],
  horizontal: true, v0: 0, v1: 100, ticks: [0, 25, 50, 75, 100], fmt: (v) => `${v}%`, xLabel: "Occupancy (% of frames)", margin: { r: 18 }, wobble: 0.025,
  values: { a: [82, 71, 44, 26, 12], b: [86, 76, 55, 33, 18], c: [94, 88, 78, 58, 41] },
};
const MMPBSA: BarCfg = {
  cats: ["Y32", "W50", "Y52", "R58", "D99", "Y101", "F102"],
  v0: -6, v1: 1.5, base: 0, ticks: [-6, -4.5, -3, -1.5, 0, 1.5], fmt: (v) => fx(v, 1), xLabel: "Residue (per-residue decomposition)", yLabel: "ΔG (kcal/mol)", wobble: 0.03,
  values: { a: [-3.4, -2.8, -1.9, -1.2, 0.7, -0.6, -2.1], b: [-3.7, -3.0, -2.1, -1.5, 0.4, -0.9, -2.3], c: [-4.9, -3.6, -2.7, -2.4, -0.5, -1.8, -2.9] },
  err: { a: [0.5, 0.45, 0.4, 0.35, 0.3, 0.3, 0.4], b: [0.45, 0.4, 0.35, 0.3, 0.28, 0.3, 0.35], c: [0.35, 0.3, 0.3, 0.28, 0.22, 0.25, 0.3] },
};
const CONTACTS: RasterCfg = {
  rows: ["Y32", "R58", "Y101", "D99", "S31"],
  p: { a: [0.86, 0.72, 0.44, 0.3, 0.18], b: [0.9, 0.78, 0.55, 0.38, 0.24], c: [0.97, 0.92, 0.8, 0.64, 0.48] },
};
const PCA: ScatterCfg = {
  x0: -6, x1: 6, y0: -4, y1: 4, xTicks: [-6, -3, 0, 3, 6], yTicks: [-4, -2, 0, 2, 4], jit: 0.09, xLabel: "PC1 (nm)", yLabel: "PC2 (nm)",
  basins: {
    a: [{ x: -2.6, y: -1.2, sx: 1.05, sy: 0.75, rho: 0.25, n: 46 }, { x: 3.0, y: 1.5, sx: 0.9, sy: 0.7, n: 30 }, { x: 0.3, y: 0.1, sx: 0.9, sy: 0.5, rho: 0.4, n: 8 }],
    b: [{ x: -2.0, y: -0.7, sx: 0.85, sy: 0.65, rho: 0.2, n: 52 }, { x: 2.1, y: 1.3, sx: 0.6, sy: 0.5, n: 16 }],
    c: [{ x: -1.1, y: 0.9, sx: 0.45, sy: 0.38, rho: 0.1, n: 62 }],
  },
};

type Swatch = "line" | "box" | "dot";
type PlotDef = { swatch: Swatch; foot: string; alt: string; render: (W: number, H: number) => ReactNode };

export const MD_PLOTS: Record<MdPlotKey, PlotDef> = {
  rmsd: {
    swatch: "line", foot: "Backbone Cα · mean ± SD across replicas (shaded)",
    alt: "RMSD against simulated time for three example candidates; each rises during equilibration, then fluctuates around a plateau.",
    render: (W, H) => <LineChart o={RMSD} W={W} H={H} />,
  },
  rmsf: {
    swatch: "box", foot: "Cα RMSF per residue · loop regions shaded",
    alt: "Per-residue RMSF bars for three example candidates; the shaded loop regions fluctuate more than the rest of the chain.",
    render: (W, H) => <BarChart o={RMSF} W={W} H={H} />,
  },
  rg: {
    swatch: "line", foot: "Protein heavy atoms · mean ± SD across replicas (shaded)",
    alt: "Radius of gyration against simulated time for three example candidates, each settling to a steady compactness.",
    render: (W, H) => <LineChart o={RG} W={W} H={H} />,
  },
  sasa: {
    swatch: "line", foot: "Total SASA · mean ± SD across replicas (shaded)",
    alt: "Solvent-accessible surface area against simulated time for three example candidates, drifting slowly as the systems relax.",
    render: (W, H) => <LineChart o={SASA} W={W} H={H} />,
  },
  hbonds: {
    swatch: "box", foot: "Donor–acceptor ≤ 3.5 Å, angle ≥ 150° · share of frames",
    alt: "Horizontal bars of hydrogen-bond occupancy for five example donor–acceptor pairs across three example candidates.",
    render: (W, H) => <BarChart o={HBONDS} W={W} H={H} />,
  },
  contacts: {
    swatch: "box", foot: "Contact = heavy atom within 4.5 Å · % = occupancy in the visible window",
    alt: "A scrolling timeline of residue contacts for three example candidates; filled cells mark frames where a contact is present.",
    render: (W, H) => <Raster o={CONTACTS} W={W} H={H} />,
  },
  pca: {
    swatch: "dot", foot: "Cα covariance · projected frames · dashed ellipses = 1.5 σ",
    alt: "Frames projected onto the first two principal components; points cluster into basins, one example candidate visiting two.",
    render: (W, H) => <Scatter o={PCA} W={W} H={H} />,
  },
  mmpbsa: {
    swatch: "box", foot: "Per-residue energy decomposition · error bars = SD",
    alt: "Per-residue energy contributions for three example candidates; bars below zero are favourable contributions.",
    render: (W, H) => <BarChart o={MMPBSA} W={W} H={H} />,
  },
};

function Legend({ swatch }: { swatch: Swatch }) {
  return (
    <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.72rem] text-ink-soft" aria-hidden="true">
      {SERIES.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <svg width="18" height="10">
            {swatch === "box" ? <rect x="2" y="0" width="12" height="10" rx="2.5" fill={s.color} />
              : swatch === "dot" ? <circle cx="8" cy="5" r="4" fill={s.color} fillOpacity={0.85} />
              : <line x1="1" y1="5" x2="17" y2="5" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" strokeDasharray={s.dash} />}
          </svg>
          {s.name}
        </li>
      ))}
    </ul>
  );
}

/** One analysis plot, sized to its container. */
export default function MdPlot({ plot, height }: { plot: MdPlotKey; height: number }) {
  const def = MD_PLOTS[plot];
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div>
      <Legend swatch={def.swatch} />
      <div ref={box} style={{ height }} className="w-full">{W > 0 && def.render(W, height)}</div>
      <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[0.68rem] leading-snug text-ink-muted">
        <span>{def.foot}</span>
        <span className="uppercase tracking-[0.1em]">Illustrative visualization</span>
      </div>
    </div>
  );
}
