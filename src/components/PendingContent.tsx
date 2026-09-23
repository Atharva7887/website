/**
 * Draft copy that states an operational, legal, or clinical commitment the
 * business has not yet confirmed (turnaround, data handling, ownership,
 * clinical use). Visible in development for review; never rendered in a
 * production build, so an unconfirmed promise can't ship by accident.
 */
export default function PendingContent({
  topic,
  children,
}: {
  topic: string;
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="rounded-xl border-2 border-dashed border-[#C2410C]/50 bg-[#C2410C]/[0.04] p-4 text-[0.86rem] leading-[1.55] text-ink-soft">
      <div className="mb-1.5 text-[0.66rem] font-semibold tracking-[0.14em] uppercase text-[#C2410C]">
        Content requires business confirmation · {topic} · hidden in production
      </div>
      {children}
    </div>
  );
}

export const SHOW_PENDING = process.env.NODE_ENV !== "production";
