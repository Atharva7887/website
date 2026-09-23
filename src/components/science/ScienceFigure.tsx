import { ILLUSTRATIONS, type IllustrationName } from "./Illustrations";

/**
 * Frames one of the original SVG illustrations. The SVGs are decorative, so
 * the accessible name lives here — a short description of what the figure
 * shows, which is what a screen reader announces in place of the drawing.
 */
export default function ScienceFigure({
  name,
  description,
  className = "",
  padded = true,
}: {
  name: IllustrationName;
  description: string;
  className?: string;
  padded?: boolean;
}) {
  const Art = ILLUSTRATIONS[name];
  // An empty description marks the figure as decorative — it sits next to a
  // heading and sentence that already say the same thing, so announcing it
  // again is noise.
  const decorative = description.trim() === "";
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : description}
      aria-hidden={decorative || undefined}
      className={`relative overflow-hidden rounded-2xl border border-black/5 bg-cream-50 ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      <Art />
    </div>
  );
}

/* ─────────────────────────── Metric sparklines ────────────────────────── */

/**
 * Illustrative shapes only — these are drawn to convey what each metric looks
 * like in profile, not plotted from any run. Labelled as schematic in the UI
 * so they are never mistaken for project data.
 */
const SPARKS: Record<string, string> = {
  rise: "M2 26 C10 24 14 12 22 10 C30 8 38 11 46 10 C54 9 62 11 70 10",
  spiky: "M2 24 L8 12 L12 22 L18 6 L24 20 L30 14 L36 24 L42 9 L48 21 L54 16 L60 25 L66 13 L70 20",
  flat: "M2 17 C12 16 18 19 26 17 C34 15 42 18 50 17 C58 16 64 18 70 17",
  decay: "M2 8 C12 9 18 16 26 18 C34 20 42 22 50 23 C58 24 64 25 70 25",
  steps: "M2 24 L14 24 L14 14 L26 14 L26 20 L38 20 L38 9 L50 9 L50 17 L62 17 L62 12 L70 12",
  arc: "M2 26 C14 6 26 4 36 14 C46 24 58 26 70 8",
};

export function MetricCard({
  name,
  meaning,
  spark = "flat",
}: {
  name: string;
  meaning: string;
  spark?: keyof typeof SPARKS | string;
}) {
  const d = SPARKS[spark] ?? SPARKS.flat;
  return (
    <div className="group border-r border-b border-black/5 p-6 transition-colors duration-500 hover:bg-cream-50">
      <svg
        viewBox="0 0 72 32"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="mb-4 h-8 w-full"
        preserveAspectRatio="none"
      >
        <path d="M2 30 L70 30" stroke="rgba(26,26,26,0.16)" strokeWidth="1" />
        <path
          d={d}
          stroke="#1E5BA8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="transition-colors duration-500 group-hover:stroke-[#D9A91A]"
        />
      </svg>
      <div className="font-medium text-ink text-[0.95rem]">{name}</div>
      <p className="mt-1 text-ink-soft text-[0.85rem] leading-[1.45]">{meaning}</p>
    </div>
  );
}
