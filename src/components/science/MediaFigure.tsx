import { MEDIA, type MediaId } from "@/lib/media";
import LoopVideo from "./LoopVideo";

/**
 * A real-data visual (PDB render or project video) with its credit line.
 * SVG renders are served as <img>, so their built-in CSS motion runs without
 * shipping any JavaScript and stops under prefers-reduced-motion.
 */
export default function MediaFigure({
  id,
  className = "",
  frameClassName = "",
  priority = false,
}: {
  id: MediaId;
  className?: string;
  /** Sizing for the visual itself, e.g. a max height. */
  frameClassName?: string;
  priority?: boolean;
}) {
  const m = MEDIA[id];
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-2xl border border-black/5 ${m.kind === "video" ? "bg-ink" : "bg-gradient-to-br from-cream-50 to-cream-200/70 p-6 md:p-8"}`}>
        {m.kind === "video" ? (
          <LoopVideo src={m.src} label={m.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.src}
            alt={m.alt}
            width={m.width}
            height={m.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`mx-auto h-auto w-full object-contain ${frameClassName}`}
          />
        )}
      </div>
      <figcaption className="mt-2.5 text-[0.72rem] leading-[1.45] text-ink-muted">
        {"creditUrl" in m ? (
          <a href={m.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-2 hover:text-navy">
            {m.credit}
          </a>
        ) : (
          m.credit
        )}
      </figcaption>
    </figure>
  );
}
