import Link from "next/link";
import ScienceFigure from "@/components/science/ScienceFigure";
import type { IllustrationName } from "@/components/science/Illustrations";
import Glyph, { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
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

export type IoItem = { title: string; glyph: GlyphName; detail?: string };

/**
 * What comes in → the computation → what goes out. Outputs sit in a results
 * window so they read as artefacts; `outputsExtra` (example plots or a report
 * mock) is shown inside that window, above the deliverable tiles.
 */
export function InputsOutputs({
  inputs,
  process,
  outputs,
  outputsExtra,
  inputsNote,
  title = "What comes in, what goes out",
}: {
  inputs?: IoItem[];
  process?: string[];
  outputs: IoItem[];
  outputsExtra?: React.ReactNode;
  inputsNote?: string;
  title?: string;
}) {
  return (
    <>
      <SectionHead title={inputs ? title : "What you receive"} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {inputs && (
          <>
            <div className="lg:col-span-3 flex flex-col rounded-2xl border border-black/5 bg-cream-50 p-6">
              <h3 className="kicker mb-5 text-ink">What comes in</h3>
              <ul className="space-y-3.5">
                {inputs.map((i) => (
                  <li key={i.title} className="flex items-center gap-3.5 text-[0.9rem] leading-snug text-ink">
                    <GlyphTile name={i.glyph} size="sm" />
                    {i.title}
                  </li>
                ))}
              </ul>
              {inputsNote && (
                <p className="mt-6 flex items-start gap-2 rounded-xl bg-gold/10 p-3 text-[0.8rem] leading-[1.45] text-ink-soft">
                  <span aria-hidden className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-gold" />
                  {inputsNote}
                </p>
              )}
            </div>
            <div className="lg:col-span-2 flex flex-col items-stretch justify-center gap-2" aria-label="Computational analysis">
              <span aria-hidden className="text-center text-gold-600 text-xl lg:hidden">↓</span>
              {(process ?? ["IndiskaAI analysis"]).map((p, i, arr) => (
                <div key={p} className="flex flex-col items-center gap-2">
                  <span className="w-full rounded-xl bg-navy px-3 py-3 text-center text-[0.82rem] font-medium leading-snug text-cream-100">{p}</span>
                  {i < arr.length - 1 && <span aria-hidden className="text-gold-600">↓</span>}
                </div>
              ))}
              <span aria-hidden className="text-center text-gold-600 text-xl lg:hidden">↓</span>
            </div>
          </>
        )}
        <div className={`${inputs ? "lg:col-span-7" : "lg:col-span-12"} overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]`}>
          <div className="flex items-center gap-2 border-b border-black/5 bg-cream-100 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-gold" />
            <h3 className="ml-2 text-[0.7rem] tracking-[0.12em] uppercase text-ink-muted">What goes out</h3>
          </div>
          {outputsExtra && <div className="border-b border-black/5">{outputsExtra}</div>}
          <ul className="grid grid-cols-2 sm:grid-cols-3 -mb-px -mr-px">
            {outputs.map((d) => (
              <li key={d.title} className="flex flex-col gap-3 border-b border-r border-black/5 bg-cream-50 p-5">
                <Glyph name={d.glyph} className="h-10 w-10" />
                <span className="text-[0.88rem] leading-[1.35] text-ink">{d.title}</span>
                {d.detail && <span className="-mt-1.5 text-[0.78rem] leading-[1.4] text-ink-muted">{d.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
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
