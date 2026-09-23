import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHead, FaqList, ServiceCTA, InputsOutputs } from "@/components/service/ServiceSections";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ExternalVideoCard from "@/components/ExternalVideoCard";
import ScienceFigure from "@/components/science/ScienceFigure";
import AnalysisExplorer from "@/components/science/AnalysisExplorer";
import { MEDIA, type MediaId } from "@/lib/media";
import MotionStory from "@/components/science/MotionStory";
import VisualPipeline from "@/components/science/VisualPipeline";
import { GlyphTile } from "@/components/science/Glyphs";
import MediaFigure from "@/components/science/MediaFigure";
import {
  SERVICES,
  SERVICE_GROUPS,
  getService,
  type SectionKey,
  type ServiceCardGroup,
  type ServiceEntry,
} from "@/lib/services-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.filter((s) => !s.custom).map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    openGraph: { title: `${service.title} — IndiskaAI`, description: service.summary, type: "article" },
  };
}

const DEFAULT_LAYOUT: SectionKey[] = [
  "intro", "flow", "workflow", "analyses", "closingFlow",
  "io", "applications", "gettingStarted", "videos", "faq", "note",
];

/** Horizontal render card: image on a soft circle to the left, text to the right. */
function RowCards({ group }: { group: ServiceCardGroup }) {
  return (
    <Section>
      <SectionHead title={group.label} lede={group.lede} />
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {group.cards.map((card) => {
          const m = card.media ? MEDIA[card.media] : undefined;
          return (
            <li
              key={card.title}
              className="group flex items-center gap-4 sm:gap-6 rounded-2xl border border-black/[0.06] bg-gradient-to-br from-cream-50 to-white/70 p-4 sm:p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-[0_18px_40px_-28px_rgba(16,53,101,0.5)]"
            >
              <div className="relative flex h-32 w-32 sm:h-36 sm:w-36 shrink-0 items-center justify-center">
                <span aria-hidden className="absolute inset-2 rounded-full bg-navy/[0.06]" />
                {m ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.src}
                    alt={m.alt}
                    width={m.width}
                    height={m.height}
                    loading="lazy"
                    decoding="async"
                    className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : card.illustration ? (
                  <ScienceFigure name={card.illustration} description="" padded={false} className="relative h-full w-full border-0 bg-transparent" />
                ) : null}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-[1.22rem] md:text-[1.35rem] leading-[1.1] tracking-tightest text-ink transition-colors duration-500 group-hover:text-navy">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-ink-soft text-[0.9rem] leading-[1.5]">{card.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.74rem] text-ink-muted">Illustrative renders of each system type.</p>
    </Section>
  );
}

function CardGroup({ group }: { group: ServiceCardGroup }) {
  if (group.variant === "row") return <RowCards group={group} />;
  const glyph = group.variant === "glyph";
  const cols =
    group.cards.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4"
    : group.cards.length === 5 ? "sm:grid-cols-2 lg:grid-cols-5"
    : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section>
      <SectionHead title={group.label} lede={group.lede} />
      <div className={`grid grid-cols-1 gap-4 md:gap-5 ${cols}`}>
        {group.cards.map((card) => (
          <article
            key={card.title}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-cream-50/70 p-5 md:p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-navy/20 hover:bg-cream-50 hover:shadow-[0_18px_40px_-28px_rgba(16,53,101,0.5)]"
          >
            {glyph && card.glyph && (
              <div className="mb-5">
                <GlyphTile name={card.glyph} tone="navy" />
              </div>
            )}
            {!glyph && card.media && <CardMedia id={card.media} />}
            {!glyph && !card.media && card.illustration && (
              <ScienceFigure name={card.illustration} description="" className="mb-5 h-40 md:h-44 bg-cream-100" />
            )}
            {card.path && (
              <div aria-hidden className="mb-4 flex flex-wrap items-center gap-1 text-[0.72rem] tracking-[0.05em] uppercase text-navy">
                {card.path.map((p, i) => (
                  <span key={p} className="flex items-center gap-1">
                    <span className="rounded-full bg-navy/[0.07] px-2 py-0.5">{p}</span>
                    {i < card.path!.length - 1 && <span className="text-gold-600">→</span>}
                  </span>
                ))}
              </div>
            )}
            <h3 className="font-display text-[1.2rem] md:text-[1.3rem] leading-[1.12] tracking-tightest text-ink transition-colors duration-500 group-hover:text-navy">
              {card.title}
            </h3>
            {card.subtitle && (
              <div className="mt-1.5 text-[0.72rem] tracking-[0.08em] uppercase text-navy/70">{card.subtitle}</div>
            )}
            <p className="mt-2 text-ink-soft text-[0.9rem] leading-[1.5]">{card.body}</p>
          </article>
        ))}
      </div>
      {group.chips && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="kicker mr-2">{group.chips.label}</span>
          {group.chips.items.map((c) => (
            <span key={c} className="rounded-full border border-navy/15 bg-navy/[0.04] px-3.5 py-1.5 text-[0.82rem] text-ink">
              {c}
            </span>
          ))}
        </div>
      )}
    </Section>
  );
}

/** A real structure render at card size, with its PDB credit. */
function CardMedia({ id }: { id: MediaId }) {
  const m = MEDIA[id];
  const pdbId = "creditUrl" in m ? m.creditUrl.split("/").pop() : undefined;
  return (
    <figure className="mb-5">
      <div className="flex h-40 md:h-44 items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-cream-50 to-cream-200/70 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.src} alt={m.alt} width={m.width} height={m.height} loading="lazy" decoding="async" className="h-full w-auto max-w-full object-contain" />
      </div>
      {pdbId && "creditUrl" in m && (
        <figcaption className="mt-1.5 text-[0.7rem] text-ink-muted">
          Real structure ·{" "}
          <a href={m.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-2 hover:text-navy">
            PDB {pdbId}
          </a>
        </figcaption>
      )}
    </figure>
  );
}

function renderSection(key: SectionKey, service: ServiceEntry): React.ReactNode {
  if (key.startsWith("cards:")) {
    const group = service.cardGroups?.find((g) => g.id === key.slice(6));
    return group ? <CardGroup key={key} group={group} /> : null;
  }

  switch (key) {
    case "story":
      if (!service.story || !service.heroMedia) return null;
      return (
        <Section key={key} band="tint">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="kicker mb-3">How it works</div>
              <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink max-w-[16ch]">
                {service.story.label}
              </h2>
              <ol className="mt-6 space-y-2.5">
                {service.story.frames.map((f, i) => (
                  <li key={f.title} className="flex items-baseline gap-3 text-[0.92rem] text-ink-soft">
                    <span className="kicker text-navy/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span><span className="text-ink font-medium">{f.title}.</span> {f.caption}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-7">
              <MotionStory label={service.story.label} frames={service.story.frames} description={service.story.description} />
            </div>
          </div>
        </Section>
      );

    case "real":
      if (!service.realImages?.length) return null;
      return (
        <Section key={key}>
          <div className="space-y-16 md:space-y-24">
            {service.realImages.map((r, i) => (
              <div key={r.title} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                  <div className="kicker mb-3">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold mr-2 align-middle" />
                    {r.kicker}
                  </div>
                  <h2 className="font-display text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.04] tracking-tightest text-ink max-w-[18ch]">
                    {r.title}
                  </h2>
                  <p className="mt-4 text-ink-soft text-[1rem] leading-[1.6] max-w-[44ch]">{r.body}</p>
                </div>
                {r.media ? (
                  <MediaFigure id={r.media} className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`} frameClassName="max-h-[460px]" />
                ) : r.art ? (
                  <figure className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                    <ScienceFigure name={r.art} description={`${r.title} ${r.body}`} className="p-6 md:p-10 bg-gradient-to-br from-cream-50 to-cream-200/70" />
                    {r.artCaption && <figcaption className="mt-2.5 text-[0.72rem] leading-[1.45] text-ink-muted">{r.artCaption}</figcaption>}
                  </figure>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      );

    case "intro":
      return (
        <Section key={key}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <p className="reveal lg:col-span-7 font-display text-ink text-[1.3rem] md:text-[1.7rem] leading-[1.3] tracking-tight max-w-[36ch]">
              {service.description}
            </p>
            {service.significance && (
              <div className="reveal lg:col-span-5 rounded-2xl border-l-2 border-gold bg-gold/[0.06] p-6">
                <div className="kicker mb-2">{service.significanceLabel ?? "Why it matters"}</div>
                <p className="text-ink text-[1rem] leading-[1.55]">{service.significance}</p>
              </div>
            )}
          </div>
        </Section>
      );

    case "flow":
      if (!service.flow?.length) return null;
      return (
        <Section key={key}>
          <SectionHead title={service.flowLabel ?? "How it works"} />
          <VisualPipeline steps={service.flow} />
        </Section>
      );

    case "workflow":
      if (!service.workflow?.length) return null;
      return (
        <Section key={key} band="tint">
          <SectionHead title={service.workflowLabel ?? "Our workflow"} kicker={`${service.workflow.length} stages`} />
          <VisualPipeline steps={service.workflow} />
          {service.workflowClosing && (
            <p className="mt-4 lg:mt-12 border-t border-black/10 pt-8 font-display text-[clamp(1.25rem,2.6vw,1.8rem)] leading-[1.25] tracking-tight text-ink max-w-[40ch]">
              {service.workflowClosing}
            </p>
          )}
        </Section>
      );

    case "analyses":
      if (!service.analyses?.length) return null;
      return (
        <Section key={key}>
          <SectionHead title={service.analysesLabel ?? "What we analyse"} />
          <AnalysisExplorer items={service.analyses} />
        </Section>
      );

    case "closingFlow":
      if (!service.closingFlow) return null;
      return (
        <Section key={key}>
          <div className="rounded-3xl border border-black/5 bg-cream-50 p-7 md:p-12">
            <div className="kicker mb-8">{service.closingFlow.label}</div>
            <VisualPipeline steps={service.closingFlow.steps} />
            <p className="mt-2 lg:mt-10 text-ink-soft text-[0.95rem] leading-[1.6] max-w-[58ch]">{service.closingFlow.body}</p>
          </div>
        </Section>
      );

    case "io":
      if (!service.deliverables?.length) return null;
      return (
        <Section key={key} band="tint">
          <InputsOutputs inputs={service.inputs} process={service.ioProcess} outputs={service.deliverables} inputsNote={service.inputsNote} />
        </Section>
      );

    case "deliverables":
      if (!service.deliverables?.length) return null;
      return (
        <Section key={key} band="tint">
          <SectionHead title="Deliverables" />
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {service.deliverables.map((d) => (
              <li key={d.title} className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-cream-50 p-5">
                <GlyphTile name={d.glyph} tone="navy" />
                <span className="text-[0.9rem] leading-[1.35] text-ink">{d.title}</span>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "applications":
      if (!service.applications?.length) return null;
      return (
        <Section key={key}>
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10 border-t border-black/10 pt-10">
            <h2 className="font-display text-[1.4rem] md:text-[1.7rem] leading-tight tracking-tightest text-ink shrink-0">Applications</h2>
            <div className="flex flex-wrap gap-2">
              {service.applications.map((a) => (
                <span key={a} className="text-[0.84rem] rounded-full border border-navy/15 bg-navy/[0.04] px-4 py-2 text-ink">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Section>
      );

    case "gettingStarted":
      if (!service.gettingStarted?.length) return null;
      return (
        <Section key={key} band="tint">
          <SectionHead title="Getting started with us" kicker="Three steps" />
          <VisualPipeline steps={service.gettingStarted} />
        </Section>
      );

    case "videos":
      if (!service.videos?.length) return null;
      return (
        <Section key={key}>
          <SectionHead title="Further viewing" lede="Third-party videos, embedded from their original source and credited." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {service.videos.map((v) => <ExternalVideoCard key={v.youtubeId} video={v} />)}
          </div>
        </Section>
      );

    case "faq":
      if (!service.faqs?.length) return null;
      return (
        <Section key={key}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <h2 className="lg:col-span-4 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.05] tracking-tightest text-ink">
              {service.faqTitle ?? "Common questions"}
            </h2>
            <div className="lg:col-span-8">
              <FaqList faqs={service.faqs} />
            </div>
          </div>
        </Section>
      );

    case "note":
      if (!service.note) return null;
      return (
        <Section key={key}>
          <div className="flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-6 md:p-8 max-w-[80ch]">
            <GlyphTile name="validate" size="sm" />
            <div>
              <div className="kicker mb-2 text-ink">Scope &amp; limitations</div>
              <p className="text-ink-soft text-[0.92rem] leading-[1.6]">{service.note}</p>
            </div>
          </div>
        </Section>
      );
  }
  return null;
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const group = SERVICE_GROUPS.find((g) => g.id === service.group);
  const layout = service.layout ?? DEFAULT_LAYOUT;

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
        eyebrow={group?.label ?? "What we offer"}
        title={service.title}
        lede={service.summary}
        cta={
          <>
            <Link href="/partner" className="cta">
              {service.ctaLabel ?? "Enquire about this service"}
              <span className="cta-arrow">→</span>
            </Link>
            <Link href="/services" className="cta cta-ghost">All services</Link>
          </>
        }
        aside={
          service.heroMedia ? (
            <MediaFigure id={service.heroMedia} priority frameClassName="max-h-[420px]" />
          ) : service.story ? (
            <MotionStory label={service.story.label} frames={service.story.frames} description={service.story.description} />
          ) : (
            <ScienceFigure name={service.art} description={service.artDescription} className="p-8" />
          )
        }
      />

      {layout.map((key) => renderSection(key, service))}

      <ServiceCTA service={service} title={service.ctaTitle ?? "Have a project in mind?"} lede={service.ctaDescription} />

      <Reveal />
    </main>
  );
}
