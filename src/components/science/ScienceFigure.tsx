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
