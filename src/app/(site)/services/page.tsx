import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ScienceFigure from "@/components/science/ScienceFigure";
import MotionStory from "@/components/science/MotionStory";
import { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
import { SERVICE_GROUPS, servicesInGroup, getService } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI-assisted antibody libraries, antibody discovery, structural analysis, molecular docking, molecular dynamics, genomics, biomarker discovery, and product development — the services IndiskaAI offers biopharma and biotechnology partners.",
};

/** Where each service sits along a discovery programme. */
const STAGES: { title: string; glyph: GlyphName; slugs: string[] }[] = [
  { title: "Target & data", glyph: "target", slugs: ["genomics", "biomarker-identification"] },
  { title: "Discovery", glyph: "library", slugs: ["ai-assisted-antibody-libraries", "antibody-discovery", "ai-antibody-data-packages"] },
  { title: "Structure & interaction", glyph: "dock", slugs: ["structural-analysis", "molecular-docking"] },
  { title: "Dynamics & evaluation", glyph: "trajectory", slugs: ["molecular-dynamics"] },
  { title: "Development", glyph: "handoff", slugs: ["product-development", "rd-services"] },
];

const pillars: { title: string; body: string; glyph: GlyphName }[] = [
  { title: "Scientific depth", body: "Antibody discovery, structural biology, and genomics expertise.", glyph: "structure" },
  { title: "Modern computation", body: "Sequencing, simulation, and AI methods combined.", glyph: "gpu" },
  { title: "Scoped to you", body: "Each engagement is built around your question.", glyph: "objective" },
  { title: "Stated limits", body: "Every result ships with what it does not establish.", glyph: "validate" },
];

export default function ServicesPage() {
  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Services" }]}
        eyebrow="What we offer"
        title={
          <>
            Antibody discovery, <span className="italic text-navy">engineered.</span>
          </>
        }
        lede="Libraries, discovery, structural science, genomics, and development — as a pipeline or a standalone engagement."
        cta={
          <Link href="/partner" className="cta">
            Partner with us
            <span className="cta-arrow">→</span>
          </Link>
        }
        aside={
          <MotionStory
            label="Target to development"
            description="An antigen surface, a sequence library, a docked pose, a simulated trajectory, and a development pipeline"
            frames={[
              { art: "epitopeMap", title: "Target", caption: "Map the antigen surface and candidate epitopes." },
              { art: "libraryDiversity", title: "Discover", caption: "Search a characterised sequence space." },
              { art: "dockingPoses", title: "Dock", caption: "Rank candidate binding poses." },
              { art: "trajectoryMotion", title: "Simulate", caption: "Test whether interactions persist." },
              { art: "developmentPipeline", title: "Develop", caption: "Hand off a shortlist with its evidence." },
            ]}
          />
        }
      />

      {/* Discovery map — which service answers which stage. */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="rounded-3xl border border-black/5 bg-cream-50 p-6 md:p-10">
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.05] tracking-tightest text-ink">
                Where each service fits
              </h2>
              <p className="text-ink-muted text-[0.88rem] md:max-w-[36ch]">Start at any stage — most programmes use two or three.</p>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {STAGES.map((stage, i) => (
                <li key={stage.title} className="relative">
                  {i < STAGES.length - 1 && (
                    <span aria-hidden className="hidden lg:block absolute top-7 left-[4.25rem] right-[-0.75rem] h-px bg-navy/20" />
                  )}
                  <div className="relative flex items-center gap-3 lg:block">
                    <GlyphTile name={stage.glyph} tone="navy" />
                    <div className="lg:mt-4">
                      <div className="text-[0.62rem] tracking-[0.14em] uppercase text-navy/60">Stage {i + 1}</div>
                      <h3 className="font-display text-[1.1rem] leading-tight tracking-tightest text-ink">{stage.title}</h3>
                    </div>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5 lg:flex-col lg:items-start">
                    {stage.slugs.map((slug) => {
                      const s = getService(slug);
                      if (!s) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/services/${slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-cream-100 px-3 py-1.5 text-[0.78rem] text-ink transition-colors hover:border-navy/30 hover:bg-navy/5 hover:text-navy"
                          >
                            {s.title}
                            <span aria-hidden className="text-gold-600">→</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-16 md:space-y-24">
          {SERVICE_GROUPS.map((group) => {
            const items = servicesInGroup(group.id);
            return (
              <div key={group.id}>
                <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <h2 className="font-display text-[1.6rem] md:text-[2rem] leading-[1.05] tracking-tightest text-ink">{group.label}</h2>
                  <p className="text-ink-soft text-[0.95rem] leading-[1.55] md:max-w-[44ch]">{group.lede}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {items.map((s, i) => {
                    // A lone last card spans the row as a horizontal feature instead of leaving a hole.
                    const feature = items.length % 2 === 1 && i === items.length - 1;
                    return (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className={`group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-cream-50/60 p-6 md:p-8 transition-all duration-500 hover:-translate-y-0.5 hover:border-navy/20 hover:bg-cream-50 hover:shadow-[0_18px_40px_-28px_rgba(16,53,101,0.5)] ${
                          feature ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-10 md:items-center" : ""
                        }`}
                      >
                        <ScienceFigure
                          name={s.art}
                          description=""
                          className={`h-44 md:h-56 bg-cream-100 transition-transform duration-700 group-hover:-translate-y-1 ${feature ? "mb-6 md:mb-0" : "mb-7"}`}
                        />
                        <div>
                          <div className="flex items-baseline gap-4 mb-4">
                            <span className="kicker text-navy/70">{String(i + 1).padStart(2, "0")}</span>
                            <span className="block h-px flex-1 bg-black/10 transition-colors duration-700 group-hover:bg-navy/30" />
                          </div>
                          <h3 className="font-display text-[1.5rem] md:text-[1.85rem] leading-[1.05] tracking-tightest text-ink mb-2.5 transition-colors duration-500 group-hover:text-navy">
                            {s.title}
                          </h3>
                          <p className="text-ink-soft text-[0.95rem] leading-[1.55] max-w-[40ch]">{s.summary}</p>
                          <span className="mt-6 inline-flex items-center gap-2 text-[0.85rem] font-medium text-navy">
                            Explore
                            <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream-200/45 border-y border-black/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2 className="font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-[0.98] tracking-tightest text-ink mb-12 max-w-[20ch]">
            Built for scientific <span className="italic text-navy">confidence.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border border-black/5 bg-cream-50 p-6">
                <GlyphTile name={p.glyph} tone="navy" />
                <h3 className="mt-5 font-display text-[1.2rem] leading-[1.1] tracking-tightest text-ink">{p.title}</h3>
                <p className="mt-2 text-ink-soft text-[0.9rem] leading-[1.5]">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-black/10 pt-8">
            <p className="text-ink-soft max-w-[44ch] leading-[1.6]">
              Have a target or programme in mind? We&apos;ll scope the right service.
            </p>
            <Link href="/partner" className="cta">
              Partner with us
              <span className="cta-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
