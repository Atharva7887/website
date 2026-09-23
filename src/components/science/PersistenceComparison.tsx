/**
 * Three illustrative interaction-persistence profiles, side by side. The
 * curves are generated from a seeded function — deliberately schematic, never
 * plotted from a run — and the panel says so. Profiles describe simulated
 * behaviour; the copy never turns them into verdicts on binding.
 */

type Series = { base: number; drift: number; noise: number; decay?: number };
type Profile = {
  key: string;
  status: "persistent" | "intermittent" | "transient";
  title: string;
  subtitle: string;
  series: [Series, Series, Series];
  observations: string[];
};

const PROFILES: Profile[] = [
  {
    key: "a",
    status: "persistent",
    title: "Persistent contacts",
    subtitle: "Pose retained across the run",
    series: [
      { base: 0.8, drift: 0, noise: 0.05 },
      { base: 0.62, drift: 0, noise: 0.05 },
      { base: 0.28, drift: 0, noise: 0.03 },
    ],
    observations: ["Low, stable RMSD", "Key contacts maintained", "Consistent energetic profile"],
  },
  {
    key: "b",
    status: "intermittent",
    title: "Intermittent contacts",
    subtitle: "Partial retention, contacts cycle",
    series: [
      { base: 0.35, drift: 0.05, noise: 0.14 },
      { base: 0.5, drift: 0.08, noise: 0.14 },
      { base: 0.18, drift: 0, noise: 0.1 },
    ],
    observations: ["Moderate RMSD fluctuation", "Contacts form and break", "Marginal energetic profile"],
  },
  {
    key: "c",
    status: "transient",
    title: "Transient contacts",
    subtitle: "Starting pose not maintained",
    series: [
      { base: 0.85, drift: 0, noise: 0.06, decay: 0.12 },
      { base: 0.7, drift: 0, noise: 0.05, decay: 0.08 },
      { base: 0.5, drift: 0, noise: 0.04, decay: 0.05 },
    ],
    observations: ["Rising RMSD, drift from start", "Key contacts lost early", "Unfavourable energetic profile"],
  },
];

const COLORS = ["#1E5BA8", "#D9A91A", "#3E9E7A"];
const LEGEND = ["H-bonds", "Hydrophobic", "Salt bridges"];

function seeded(seed: number) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}

function path(s: Series, seed: number, w: number, h: number) {
  const rnd = seeded(seed);
  const n = 70;
  const pts: string[] = [];
  let smooth = 0;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    smooth = smooth * 0.55 + (rnd() - 0.5) * 0.45;
    const trend = s.decay ? 0.12 + (s.base - 0.12) * Math.exp(-t / s.decay) : s.base + s.drift * Math.sin(t * 9);
    const v = Math.min(0.98, Math.max(0.02, trend + smooth * s.noise * 2));
    pts.push(`${(t * w).toFixed(1)} ${(h - v * h).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function StatusMark({ status }: { status: Profile["status"] }) {
  if (status === "persistent")
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#1E5BA8" /><path d="M6 10 L9 13 L14.5 7" stroke="#FAF7F0" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    );
  if (status === "intermittent")
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#F4C430" /><path d="M6 10 L14 10" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" /></svg>
    );
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="#1A1A1A" strokeWidth="1.4" strokeDasharray="2.5 2" /><path d="M7 7 L13 13 M13 7 L7 13" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" /></svg>
  );
}

function Chart({ profile, seedBase }: { profile: Profile; seedBase: number }) {
  const W = 260;
  const H = 90;
  return (
    <svg viewBox={`-26 -6 ${W + 34} ${H + 30}`} className="w-full h-auto" aria-hidden="true" focusable="false">
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <path d={`M0 ${H - v * H} L${W} ${H - v * H}`} stroke="rgba(26,26,26,0.08)" strokeWidth="1" />
          <text x="-6" y={H - v * H + 3} fontSize="8" textAnchor="end" fill="#6B6B6B">{v.toFixed(1)}</text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <text key={t} x={t * W} y={H + 14} fontSize="8" textAnchor="middle" fill="#6B6B6B">
          {Math.round(t * 500)}
        </text>
      ))}
      <text x={W / 2} y={H + 24} fontSize="7.5" textAnchor="middle" fill="#6B6B6B">time (ns, illustrative)</text>
      {profile.series.map((s, i) => (
        <path key={i} d={path(s, seedBase + i * 97, W, H)} stroke={COLORS[i]} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

export default function PersistenceComparison() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {PROFILES.map((p, idx) => (
          <article key={p.key} className="rounded-2xl bg-cream-50 p-5 md:p-6 border border-black/5">
            <header className="flex items-start gap-3">
              <StatusMark status={p.status} />
              <div>
                <h3 className="font-display text-[1.15rem] leading-tight tracking-tightest text-ink">{p.title}</h3>
                <p className="mt-0.5 text-[0.78rem] text-ink-muted">{p.subtitle}</p>
              </div>
            </header>

            <div className="mt-5">
              <div className="mb-1 text-[0.62rem] tracking-[0.12em] uppercase text-ink-muted">Contact occupancy over time</div>
              <Chart profile={p} seedBase={(idx + 3) * 1013} />
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {LEGEND.map((l, i) => (
                  <span key={l} className="inline-flex items-center gap-1.5 text-[0.7rem] text-ink-muted">
                    <span className="h-[2px] w-3 rounded" style={{ background: COLORS[i] }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <ul className="mt-5 space-y-2 border-t border-black/5 pt-4">
              {p.observations.map((o) => (
                <li key={o} className="flex items-center gap-2.5 text-[0.84rem] text-ink-soft">
                  <span className="scale-75"><StatusMark status={p.status} /></span>
                  {o}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
