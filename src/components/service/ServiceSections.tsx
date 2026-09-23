import Link from "next/link";
import ScienceFigure from "@/components/science/ScienceFigure";
import type { IllustrationName } from "@/components/science/Illustrations";
import { SERVICE_GROUPS, servicesInGroup, type ServiceEntry } from "@/lib/services-data";

export const WRAP = "mx-auto max-w-[1400px] px-6 md:px-10";

export function SectionHead({ title, lede, kicker, id }: { title: string; lede?: string; kicker?: string; id?: string }) {
  return (
    <div className="reveal mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {kicker && <div className="kicker mb-3">{kicker}</div>}
        <h2 id={id} className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink max-w-[22ch]">
          {title}
        </h2>
      </div>
      {lede && <p className="text-ink-soft text-[0.95rem] leading-[1.55] md:max-w-[40ch]">{lede}</p>}
    </div>
  );
}

export function Section({ children, band, id }: { children: React.ReactNode; band?: "tint" | "navy"; id?: string }) {
  const bg = band === "tint" ? "bg-cream-200/45 border-y border-black/5" : band === "navy" ? "bg-navy-900 text-cream-100" : "";
  return (
    <section id={id} className={`py-16 md:py-24 scroll-mt-24 ${bg}`}>
      <div className={WRAP}>{children}</div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="border-t border-black/10">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-black/10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-ink text-[1rem] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden className="text-navy text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <div className="pb-5 -mt-1 text-ink-soft text-[0.92rem] leading-[1.6] max-w-[62ch]">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Dark closing band: headline, primary action, Home, and the other services in the group. */
export function ServiceCTA({
  service,
  title,
  lede,
  ctaHref = "/partner",
  ctaLabel,
  background,
}: {
  service: ServiceEntry;
  title: React.ReactNode;
  lede?: string;
  ctaHref?: string;
  ctaLabel?: string;
  background?: IllustrationName;
}) {
  const group = SERVICE_GROUPS.find((g) => g.id === service.group);
  const related = servicesInGroup(service.group).filter((s) => s.slug !== service.slug);
  return (
    <section className="py-16 md:py-24">
      <div className={WRAP}>
        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 md:p-14 text-cream-100 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(closest-side, #F4C430, transparent 70%)" }} />
          {background && (
            <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 w-[70%] max-w-[640px] opacity-[0.12] invert">
              <ScienceFigure name={background} description="" padded={false} className="border-0 bg-transparent" />
            </div>
          )}
          <div className="relative lg:col-span-7">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.04] tracking-tightest max-w-[20ch]">{title}</h2>
            {lede && <p className="mt-4 text-cream-100/70 max-w-[42ch] leading-[1.6]">{lede}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={ctaHref} className="cta cta-light">
                {ctaLabel ?? service.ctaLabel ?? "Enquire about this service"}
                <span className="cta-arrow">→</span>
              </Link>
              <Link href="/" className="cta cta-ghost !text-cream-100 !border-cream-100/20 hover:!bg-cream-100 hover:!text-ink">
                Home
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <aside className="relative lg:col-span-5">
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-cream-100/50 mb-4">
                {group ? `More in ${group.label.toLowerCase()}` : "Other services"}
              </div>
              <ul>
                {related.map((s) => (
                  <li key={s.slug} className="border-t border-cream-100/10">
                    <Link href={`/services/${s.slug}`} className="group flex items-center gap-4 py-3">
                      <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100 p-1">
                        <ScienceFigure name={s.art} description="" padded={false} className="h-full w-full border-0" />
                      </span>
                      <span className="flex-1 font-display text-[1.05rem] leading-[1.15] tracking-tightest transition-colors duration-300 group-hover:text-gold">
                        {s.title}
                      </span>
                      <span aria-hidden className="text-cream-100/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
