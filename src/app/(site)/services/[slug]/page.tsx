import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHead, FaqList, ServiceCTA } from "@/components/service/ServiceSections";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ExternalVideoCard from "@/components/ExternalVideoCard";
import ScienceFigure, { MetricCard } from "@/components/science/ScienceFigure";
import MotionStory from "@/components/science/MotionStory";
import VisualPipeline from "@/components/science/VisualPipeline";
import PersistenceComparison from "@/components/science/PersistenceComparison";
import Glyph, { GlyphTile } from "@/components/science/Glyphs";
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
  "intro", "flow", "highlights", "workflow", "analyses", "comparison", "closingFlow",
  "io", "applications", "gettingStarted", "videos", "faq", "note",
];

function CardGroup({ group }: { group: ServiceCardGroup }) {
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
            {!glyph && card.illustration && (
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
    </Section>
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
                <MediaFigure id={r.media} className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`} frameClassName="max-h-[460px]" />
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
        </Section>
      );

    case "highlights":
      if (!service.highlights?.length) return null;
      return (
        <Section key={key}>
          <div className="kicker mb-6">{service.highlightsLabel ?? "At a glance"}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {service.highlights.map((h) => (
              <div key={h.label} className="reveal flex items-start gap-5 rounded-2xl border border-black/5 bg-cream-50 p-6 md:p-8">
                {h.glyph && <GlyphTile name={h.glyph} size="lg" tone="navy" />}
                <div>
                  <div className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-none tracking-tightest text-navy">{h.value}</div>
                  <div className="mt-2 text-[0.68rem] tracking-[0.14em] uppercase text-ink-muted">{h.label}</div>
                  <p className="mt-2 text-ink-soft text-[0.88rem] leading-[1.5] max-w-[40ch]">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      );

    case "analyses":
      if (!service.analyses?.length) return null;
      return (
        <Section key={key}>
          <SectionHead
            title={service.analysesLabel ?? "What we analyse"}
            lede="Profiles are schematic illustrations of each metric, not data from a project run."
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 border-t border-l border-black/5 rounded-2xl overflow-hidden">
            {service.analyses.map((a) => (
              <MetricCard key={a.name} name={a.name} meaning={a.meaning} spark={a.spark} />
            ))}
          </div>
        </Section>
      );

    case "comparison":
      if (!service.comparison) return null;
      return (
        <Section key={key} band="navy">
          <div className="mb-10 md:mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <div className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">Illustrative example</div>
              <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest">
                {service.comparison.label}
              </h2>
            </div>
            <p className="lg:col-span-5 text-cream-100/75 text-[0.95rem] leading-[1.55]">{service.comparison.lede}</p>
          </div>
          <PersistenceComparison />
          <p className="mt-6 text-[0.78rem] leading-[1.5] text-cream-100/60 max-w-[70ch]">
            Schematic profiles generated for illustration — not results from any project or client system. A profile
            is one input to the next decision, not a verdict on binding.
          </p>
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
          <SectionHead title={service.inputs ? "What goes in, what comes out" : "What you receive"} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {service.inputs && (
              <>
                <div className="lg:col-span-4 rounded-2xl border border-black/5 bg-cream-50 p-6">
                  <div className="kicker mb-5">What we need from you</div>
                  <ul className="space-y-4">
                    {service.inputs.map((i) => (
                      <li key={i.title} className="flex items-center gap-4 text-[0.92rem] text-ink">
                        <GlyphTile name={i.glyph} size="sm" />
                        {i.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div aria-hidden className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center gap-2 text-navy">
                  <span className="text-[0.6rem] tracking-[0.14em] uppercase text-ink-muted [writing-mode:vertical-rl] rotate-180">IndiskaAI analysis</span>
                  <span className="text-2xl text-gold-600">→</span>
                </div>
              </>
            )}
            {/* Deliverables framed as a results window, so outputs read as artefacts rather than a list. */}
            <div className={`${service.inputs ? "lg:col-span-7" : "lg:col-span-12"} overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]`}>
              <div className="flex items-center gap-2 border-b border-black/5 bg-cream-100 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-black/15" />
                <span className="h-2 w-2 rounded-full bg-black/15" />
                <span className="h-2 w-2 rounded-full bg-gold" />
                <span className="ml-2 text-[0.66rem] tracking-[0.12em] uppercase text-ink-muted">Deliverables</span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-black/5">
                {service.deliverables.map((d) => (
                  <li key={d.title} className="flex flex-col gap-3 bg-cream-50 p-5">
                    <Glyph name={d.glyph} className="h-10 w-10" />
                    <span className="text-[0.88rem] leading-[1.35] text-ink">{d.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
              Common questions
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

      <ServiceCTA service={service} title={<>Have a target <span className="italic text-gold">in mind?</span></>} lede="Tell us what you're working on and we'll scope the right analysis." />

      <Reveal />
    </main>
  );
}
