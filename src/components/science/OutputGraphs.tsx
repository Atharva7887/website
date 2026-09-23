/**
 * The plot formats an MD engagement returns, drawn from seeded functions so
 * they are deterministic and obviously generic. They show what each analysis
 * *looks like*, never a result — the panel is labelled that way, and each
 * chart carries a text equivalent for screen readers.
 */

const NAVY = "#1E5BA8";
const GOLD = "#D9A91A";
const MUTED = "#6B6B6B";
const GRID = "rgba(26,26,26,0.08)";

function seeded(seed: number) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}

const W = 220;
const H = 70;

/** Time-series in [0,1] from a shape function plus smoothed noise. */
function series(shape: (t: number) => number, noise: number, seed: number, n = 80) {
  const rnd = seeded(seed);
  let s = 0;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    s = s * 0.6 + (rnd() - 0.5) * 0.4;
    const v = Math.min(0.97, Math.max(0.03, shape(t) + s * noise));
    pts.push(`${(t * W).toFixed(1)} ${(H - v * H).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function Frame({ children, x = "time", y }: { children: React.ReactNode; x?: string; y: string }) {
  return (
    <svg viewBox={`-16 -4 ${W + 22} ${H + 20}`} className="h-auto w-full" aria-hidden="true" focusable="false">
      {[0, 0.5, 1].map((v) => (
        <path key={v} d={`M0 ${H - v * H} L${W} ${H - v * H}`} stroke={GRID} strokeWidth="1" />
      ))}
      <path d={`M0 0 L0 ${H} L${W} ${H}`} stroke="rgba(26,26,26,0.25)" strokeWidth="1" fill="none" />
      <text x={W / 2} y={H + 13} fontSize="8" textAnchor="middle" fill={MUTED}>{x}</text>
      <text x="-8" y={H / 2} fontSize="8" textAnchor="middle" fill={MUTED} transform={`rotate(-90 -8 ${H / 2})`}>{y}</text>
      {children}
    </svg>
  );
}

function Line({ d, color = NAVY, width = 1.5 }: { d: string; color?: string; width?: number }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />;
}

const RMSF = [0.3, 0.22, 0.18, 0.2, 0.16, 0.5, 0.72, 0.4, 0.2, 0.15, 0.14, 0.18, 0.28, 0.62, 0.35, 0.2, 0.16, 0.2, 0.3, 0.82];
const HBONDS = [0.95, 0.88, 0.62, 0.3, 0.12];
const ENERGY = [-0.8, -0.55, -0.35, -0.2, 0.12, -0.1, -0.42];

const CHARTS: { title: string; what: string; alt: string; chart: React.ReactNode }[] = [
  {
    title: "RMSD",
    what: "Structural deviation over time",
    alt: "Line rising early then plateauing, indicating the structure settles.",
    chart: (
      <Frame y="Å">
        <Line d={series((t) => 0.15 + 0.5 * (1 - Math.exp(-t * 8)), 0.12, 11)} />
      </Frame>
    ),
  },
  {
    title: "RMSF",
    what: "Per-residue flexibility",
    alt: "Bars low across the core with peaks at loop and terminal residues.",
    chart: (
      <Frame x="residue" y="Å">
        {RMSF.map((v, i) => (
          <rect key={i} x={i * 11 + 1} y={H - v * H} width="8" height={v * H} rx="1.5" fill={v > 0.45 ? GOLD : "rgba(30,91,168,0.35)"} />
        ))}
      </Frame>
    ),
  },
  {
    title: "Radius of gyration",
    what: "Compactness",
    alt: "Flat line with small fluctuations, indicating a compact structure.",
    chart: (
      <Frame y="nm">
        <Line d={series(() => 0.55, 0.08, 23)} />
      </Frame>
    ),
  },
  {
    title: "SASA",
    what: "Solvent-accessible surface",
    alt: "Line drifting slightly downward, indicating gradual burial.",
    chart: (
      <Frame y="nm²">
        <Line d={series((t) => 0.7 - 0.2 * t, 0.12, 37)} />
      </Frame>
    ),
  },
  {
    title: "Hydrogen-bond persistence",
    what: "Fraction of frames each H-bond is present",
    alt: "Five horizontal bars decreasing from near-complete to rare occupancy.",
    chart: (
      <Frame x="occupancy" y="pair">
        {HBONDS.map((v, i) => (
          <rect key={i} x="0" y={4 + i * 13} width={v * W} height="9" rx="2" fill={v > 0.5 ? NAVY : "rgba(30,91,168,0.3)"} />
        ))}
      </Frame>
    ),
  },
  {
    title: "Contact persistence",
    what: "Residue contacts across the run",
    alt: "Heat strip where some residue rows stay filled across time and others break up.",
    chart: (
      <Frame y="residue">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 22 }).map((_, c) => {
            const h = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
            const rnd = h - Math.floor(h);
            const keep = r < 2 ? 0.92 : r < 4 ? 0.75 - c * 0.03 : 0.25;
            return rnd < keep ? <rect key={`${r}-${c}`} x={c * 10} y={3 + r * 13.5} width="9" height="11" rx="1" fill={r < 2 ? NAVY : "rgba(30,91,168,0.35)"} /> : null;
          })
        )}
      </Frame>
    ),
  },
  {
    title: "MM-PBSA / MM-GBSA",
    what: "Per-residue energy contribution (comparative)",
    alt: "Bars mostly below zero for a few residues, showing favourable contributions, and one small positive bar.",
    chart: (
      <Frame x="residue" y="ΔG">
        <path d={`M0 ${H * 0.35} L${W} ${H * 0.35}`} stroke="rgba(26,26,26,0.3)" strokeWidth="1" strokeDasharray="2 3" />
        {ENERGY.map((v, i) => {
          const y0 = H * 0.35;
          const h = Math.abs(v) * H * 0.6;
          return <rect key={i} x={10 + i * 30} y={v < 0 ? y0 : y0 - h} width="18" height={h} rx="2" fill={v < 0 ? GOLD : "rgba(26,26,26,0.25)"} />;
        })}
      </Frame>
    ),
  },
];

export default function OutputGraphs() {
  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 -mb-px -mr-px">
        {CHARTS.map((c) => (
          <li key={c.title} className="border-b border-r border-black/5 bg-cream-50 p-4">
            <figure role="img" aria-label={`${c.title}: ${c.what}. Illustrative example — ${c.alt}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[0.9rem] font-medium text-ink">{c.title}</span>
                <span className="text-[0.66rem] uppercase tracking-[0.1em] text-ink-muted">Illustrative</span>
              </div>
              <div className="text-[0.76rem] text-ink-soft mb-2">{c.what}</div>
              {c.chart}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
