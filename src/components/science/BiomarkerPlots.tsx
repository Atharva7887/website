/**
 * Illustrative sample-output figures for biomarker/expression pages: a
 * volcano plot and an expression heatmap. Static seeded SVG (no live data,
 * no animation) — they show what the output looks like, never a result.
 */

const NAVY = "#1E5BA8";
const GOLD = "#D9A91A";
const MUTED = "rgba(26,26,26,0.22)";

function rnd(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 1 | s) + 0x6d2b79f5) | 0;
    return ((s ^ (s >>> 7)) >>> 0) / 4294967296;
  };
}
function gauss(r: () => number) {
  let u = 0;
  while (!u) u = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * r());
}

const LABELLED_GENES = ["BRCA-19A", "TP-53X", "MYC-7B", "EGFR-2C", "KRAS-4D", "PTEN-8E"];

export function VolcanoPlot() {
  const W = 460, H = 300;
  const M = { l: 44, r: 16, t: 14, b: 36 };
  const x0 = -6, x1 = 6, y0 = 0, y1 = 10;
  const X = (v: number) => M.l + ((v - x0) / (x1 - x0)) * (W - M.l - M.r);
  const Y = (v: number) => M.t + (1 - (v - y0) / (y1 - y0)) * (H - M.t - M.b);

  const r = rnd(2024);
  const points: { x: number; y: number; c: string; label?: string }[] = [];
  for (let i = 0; i < 220; i++) {
    const lfc = gauss(r) * 1.4;
    const sig = Math.max(0, gauss(r) * 1.6 + Math.abs(lfc) * 1.1);
    const up = lfc > 1 && sig > 2.5;
    const down = lfc < -1 && sig > 2.5;
    points.push({ x: lfc, y: Math.min(y1, sig), c: up ? GOLD : down ? NAVY : "rgba(26,26,26,0.22)" });
  }
  // A handful of clearly labelled extremes, on both sides.
  LABELLED_GENES.forEach((label, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const lfc = side * (2.4 + r() * 2.4);
    const sig = 6.5 + r() * 3;
    points.push({ x: lfc, y: Math.min(y1, sig), c: side > 0 ? GOLD : NAVY, label });
  });

  const yTicks = [0, 2.5, 5, 7.5, 10];
  const xTicks = [-6, -3, 0, 3, 6];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Volcano plot: fold change against statistical significance for every gene, with the strongest genes labelled">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke="rgba(26,26,26,0.07)" />
          <text x={M.l - 8} y={Y(v)} fontSize={9.5} fill="#6B6B6B" textAnchor="end" dominantBaseline="middle">{v}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={v} x={X(v)} y={H - M.b + 15} fontSize={9.5} fill="#6B6B6B" textAnchor="middle">{v}</text>
      ))}
      <line x1={X(-1)} x2={X(-1)} y1={M.t} y2={H - M.b} stroke={MUTED} strokeDasharray="2 3" />
      <line x1={X(1)} x2={X(1)} y1={M.t} y2={H - M.b} stroke={MUTED} strokeDasharray="2 3" />
      <path d={`M${M.l} ${M.t}V${H - M.b}H${W - M.r}`} stroke="rgba(26,26,26,0.28)" strokeWidth={1} fill="none" />
      <text x={(M.l + W - M.r) / 2} y={H - 4} fontSize={10} fill="#4A4A4A" textAnchor="middle">log2 fold change</text>
      <text fontSize={10} fill="#4A4A4A" textAnchor="middle" transform={`translate(12 ${(M.t + H - M.b) / 2}) rotate(-90)`}>−log10 p-value</text>
      {points.map((p, i) => (
        <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={p.label ? 3.4 : 2.4} fill={p.c} fillOpacity={p.label ? 0.95 : 0.55} stroke={p.label ? "#FAF7F0" : "none"} strokeWidth={0.8} />
      ))}
      {points
        .filter((p) => p.label)
        .map((p) => (
          <text key={p.label} x={X(p.x) + (p.x > 0 ? 5 : -5)} y={Y(p.y) - 5} fontSize={9} fontWeight={600} fill="#1A1A1A" textAnchor={p.x > 0 ? "start" : "end"}>
            {p.label}
          </text>
        ))}
    </svg>
  );
}

export function ExpressionHeatmap() {
  const rows = 18, cols = 22;
  const cellW = 15, cellH = 12, gap = 1;
  const M = { l: 4, r: 4, t: 14, b: 4 };
  const W = M.l + M.r + cols * (cellW + gap);
  const H = M.t + M.b + rows * (cellH + gap);
  const r = rnd(707);
  const groupOf = (c: number) => (c < cols / 2 ? "a" : "b");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Expression heatmap: top changing genes across every sample, coloured by relative expression, grouped by sample condition">
      {Array.from({ length: cols }, (_, c) => (
        <rect key={`grp${c}`} x={M.l + c * (cellW + gap)} y={0} width={cellW} height={8} rx={2} fill={groupOf(c) === "a" ? GOLD : NAVY} fillOpacity={0.85} />
      ))}
      {Array.from({ length: rows }, (_, row) => {
        const rowBias = gauss(rnd(row + 1)) * 0.6;
        return Array.from({ length: cols }, (_, c) => {
          const grp = groupOf(c);
          const base = grp === "a" ? rowBias + 0.7 : rowBias - 0.7;
          const z = Math.max(-2.5, Math.min(2.5, base + gauss(r) * 0.7));
          const t = (z + 2.5) / 5;
          const color = t < 0.5 ? NAVY : GOLD;
          const opacity = Math.abs(t - 0.5) * 1.7 + 0.15;
          return (
            <rect
              key={`${row}-${c}`}
              x={M.l + c * (cellW + gap)}
              y={M.t + row * (cellH + gap)}
              width={cellW}
              height={cellH}
              rx={1.5}
              fill={color}
              fillOpacity={Math.min(0.95, opacity)}
            />
          );
        });
      })}
    </svg>
  );
}
