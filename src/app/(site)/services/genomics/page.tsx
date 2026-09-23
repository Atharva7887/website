import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PendingContent, { SHOW_PENDING } from "@/components/PendingContent";
import MotionStory from "@/components/science/MotionStory";
import ScienceFigure from "@/components/science/ScienceFigure";
import VisualPipeline from "@/components/science/VisualPipeline";
import Glyph, { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
import type { IllustrationName } from "@/components/science/Illustrations";
import { Section, SectionHead, FaqList, ServiceCTA } from "@/components/service/ServiceSections";
import WesRequestForm, { SelectTestButton } from "@/components/service/WesRequestForm";
import { getService } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Whole Exome Sequencing Analysis",
  description: "Bioinformatics analysis of exome sequencing data — from raw FASTQ files to an annotated, classified variant report.",
};

const COVERS: { title: string; glyph: GlyphName }[] = [
  { title: "Coding genes", glyph: "dna" },
  { title: "Splice junctions", glyph: "interface" },
  { title: "Variant detection", glyph: "variant" },
  { title: "Annotation", glyph: "annotate" },
  { title: "Interpretation", glyph: "report" },
];

const PIPELINE: { title: string; glyph: GlyphName }[] = [
  { title: "FASTQ", glyph: "fastq" },
  { title: "Quality", glyph: "qc" },
  { title: "Alignment", glyph: "align" },
  { title: "Variant calling", glyph: "variant" },
  { title: "Annotation", glyph: "annotate" },
  { title: "Classification", glyph: "classify" },
  { title: "Prioritisation", glyph: "shortlist" },
  { title: "Report", glyph: "report" },
];

const TESTS: { name: string; art: IllustrationName; path: string[]; body: string }[] = [
  { name: "Singleton Exome Analysis", art: "pedigreeSingleton", path: ["Patient", "Exome", "Variant analysis"], body: "Comprehensive exome analysis for an individual patient, covering coding regions across the exome." },
  { name: "Duo Exome Analysis", art: "pedigreeDuo", path: ["Parent + patient", "Inheritance"], body: "The patient analysed together with one parent, to help interpret how candidate variants were inherited." },
  { name: "Trio Exome Analysis", art: "pedigreeTrio", path: ["Parents + patient", "Inheritance"], body: "The patient analysed together with both parents, to support inheritance analysis and variant interpretation." },
];

const APPLICATIONS: { title: string; body: string; glyph: GlyphName }[] = [
  { title: "Complex or undiagnosed conditions", body: "Investigating possible genetic causes when earlier testing hasn't provided an answer.", glyph: "search" },
  { title: "Unusual or overlapping presentations", body: "Useful when more than one genetic condition could explain a phenotype.", glyph: "complex" },
  { title: "Developmental & neurodevelopmental conditions", body: "Supporting investigation of possible inherited causes.", glyph: "person" },
  { title: "Negative targeted testing", body: "Extending investigation across coding genes after a targeted approach was unrevealing.", glyph: "qc" },
  { title: "Family-based interpretation", body: "Parental samples help interpret how variants were inherited.", glyph: "inheritance" },
  { title: "Management & research decisions", body: "Findings may inform downstream clinical or research decisions, when interpreted appropriately.", glyph: "objective" },
];

const DELIVERABLES: { title: string; glyph: GlyphName }[] = [
  { title: "QC summary", glyph: "qc" },
  { title: "Processed alignments", glyph: "align" },
  { title: "Annotated variant calls", glyph: "annotate" },
  { title: "Prioritised variant list", glyph: "shortlist" },
  { title: "Inheritance analysis (duo / trio)", glyph: "inheritance" },
  { title: "Interpreted report", glyph: "report" },
];

type Faq = { q: string; a: React.ReactNode; pending?: boolean };

const FAQS: Faq[] = [
  { q: "What data do I need to provide?", a: "Raw FASTQ files are preferred. Aligned BAM/CRAM or a VCF can also be accepted, together with the capture kit or target regions and a short phenotype or research question — without patient identifiers." },
  { q: "Which sequencing platforms and capture kits do you support?", a: "Whole-exome data from standard short-read next-generation sequencing workflows and different capture designs, subject to data quality and project requirements. Tell us the platform and kit when you enquire." },
  { q: "Can you analyse data that was sequenced some time ago?", a: "Usually, yes. Older data is re-checked for quality and coverage first, and we'll tell you if anything limits what it can support." },
  { q: "Can you review an exome that has already been analysed elsewhere?", a: "Yes — reanalysis from raw or aligned data is possible, and annotation databases change over time. Supplying the earlier report helps us scope it." },
  { q: "What will I receive?", a: "A QC summary, annotated and classified variant calls, a prioritised variant list, inheritance analysis for duo and trio requests, and an interpreted report with the evidence behind each prioritised variant." },
  {
    q: "How long does the analysis take?",
    pending: true,
    a: <PendingContent topic="Turnaround">Draft: Singleton — 10 working days. Duo / Trio — 14 working days. Urgent analysis available by prior arrangement. Publish only once confirmed as a commitment.</PendingContent>,
  },
  { q: "What happens if no causative variant is identified?", a: "The report says so plainly and records the coverage and any limitations of the data. Reanalysis can be discussed later, as databases and knowledge change." },
  {
    q: "How is my data protected?",
    pending: true,
    a: <PendingContent topic="Data protection">Draft covers: encrypted transfer and storage, analyst-only access, a data protection agreement, coded (de-identified) data, and agreed retention / deletion terms. Needs confirmation against the actual privacy policy and contracts — no regulatory standard should be named until verified.</PendingContent>,
  },
  {
    q: "Who owns the results?",
    pending: true,
    a: <PendingContent topic="Ownership">Ownership wording has not been supplied or confirmed. Needs legal sign-off.</PendingContent>,
  },
  { q: "Who can request an analysis?", a: "Clinicians, hospitals and diagnostic laboratories, biotech and pharmaceutical companies, and research groups. Scope and intended use are agreed before work starts." },
];

export default function WesPage() {
  const service = getService("genomics");
  if (!service) notFound();
  const faqs = FAQS.filter((f) => SHOW_PENDING || !f.pending);

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Services", href: "/services" }, { label: "Genomics" }, { label: "Whole Exome Sequencing" }]}
        eyebrow="Genomics"
        title="Whole Exome Sequencing Analysis"
        lede="Bioinformatics analysis of exome sequencing data — from raw FASTQ files to an annotated, classified variant report."
        cta={
          <>
            <a href="#request" className="cta">
              Request analysis
              <span className="cta-arrow">→</span>
            </a>
            <Link href="/services" className="cta cta-ghost">All services</Link>
          </>
        }
        aside={
          <MotionStory
            label="DNA to variant"
            description="Exons captured from a genome, raw sequencing reads, reads aligned with a variant column, and an annotated report"
            frames={[
              { art: "exomeCapture", title: "Exome capture", caption: "Coding exons are pulled out of the genome for sequencing." },
              { art: "fastqFile", title: "Sequencing reads", caption: "Raw FASTQ records with per-base quality." },
              { art: "sequencingReads", title: "Variant analysis", caption: "A variant is called where reads consistently differ from the reference." },
              { art: "variantReport", title: "Report", caption: "Annotated, classified, with the evidence for each call." },
            ]}
          />
        }
      />

      {/* Overview: what an exome covers, shown before it's explained. */}
      <Section>
        <ol className="flex flex-wrap items-center gap-2 md:gap-3" aria-label="What the analysis covers">
          {COVERS.map((c, i) => (
            <li key={c.title} className="flex items-center gap-2 md:gap-3">
              <span className="flex items-center gap-2.5 rounded-full border border-navy/15 bg-navy/[0.04] py-1.5 pl-1.5 pr-4 text-[0.9rem] text-ink">
                <GlyphTile name={c.glyph} size="sm" />
                {c.title}
              </span>
              {i < COVERS.length - 1 && <span aria-hidden className="text-gold-600">+</span>}
            </li>
          ))}
        </ol>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <p className="reveal lg:col-span-6 font-display text-ink text-[1.25rem] md:text-[1.6rem] leading-[1.32] tracking-tight max-w-[36ch]">
            Whole exome sequencing reads the protein-coding regions of the genome and their splice junctions, so potentially
            disease-associated variants across many genes can be assessed in one analysis.
          </p>
          <figure className="lg:col-span-6">
            <ScienceFigure name="coverageTrack" description="Read depth rising and falling across an exon, with a variant position marked above the deepest region" className="p-6 md:p-8" />
            <figcaption className="mt-2.5 text-[0.72rem] text-ink-muted">
              Read depth across an exon. Coverage is checked before any variant is interpreted. Schematic.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* Our service: the full pipeline as the page's centrepiece. */}
      <Section band="tint">
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-5">
            <div className="kicker mb-3">8 stages</div>
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink">Our service</h2>
          </div>
          <div className="lg:col-span-7 space-y-3">
            <p className="text-ink-soft text-[1rem] leading-[1.6] max-w-[60ch]">
              Complete analysis of whole exome sequencing data — raw FASTQ through to an annotated, classified variant report.
              We work with exome data from standard next-generation sequencing workflows and different capture designs,
              subject to data quality and project requirements.
            </p>
            <PendingContent topic="Clinical use">
              Supplied copy says the report is &ldquo;for clinical or research use&rdquo;. The site currently states this is a
              research service, not a diagnostic test. Confirm the intended-use position (and any accreditation it depends
              on) before this wording goes live.
            </PendingContent>
          </div>
        </div>
        <VisualPipeline steps={PIPELINE} />
      </Section>

      {/* Test types */}
      <Section>
        <SectionHead title="Test types" lede="Whose data is analysed together changes what can be said about inheritance." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTS.map((t) => (
            <article key={t.name} className="flex flex-col rounded-3xl border border-black/[0.08] bg-cream-50 p-6 md:p-8">
              <ScienceFigure name={t.art} description="" className="h-44 bg-cream-100" />
              <div aria-hidden className="mt-5 flex flex-wrap items-center gap-1 text-[0.72rem] tracking-[0.05em] uppercase text-navy">
                {t.path.map((p, i) => (
                  <span key={p} className="flex items-center gap-1">
                    <span className="rounded-full bg-navy/[0.07] px-2 py-0.5">{p}</span>
                    {i < t.path.length - 1 && <span className="text-gold-600">→</span>}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 font-display text-[1.45rem] leading-[1.08] tracking-tightest text-ink">{t.name}</h3>
              <p className="mt-2 text-ink-soft text-[0.92rem] leading-[1.55]">{t.body}</p>
              <SelectTestButton test={t.name} />
            </article>
          ))}
        </div>
      </Section>

      {/* What you receive: deliverables beside an example report layout. */}
      <Section band="tint">
        <SectionHead title="What you receive" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ul className="lg:col-span-5 grid grid-cols-2 gap-3">
            {DELIVERABLES.map((d) => (
              <li key={d.title} className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-cream-50 p-4">
                <Glyph name={d.glyph} className="h-9 w-9" />
                <span className="text-[0.88rem] leading-snug text-ink">{d.title}</span>
              </li>
            ))}
          </ul>

          <figure className="lg:col-span-7 overflow-hidden rounded-2xl border border-black/10 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(16,53,101,0.45)]">
            <div className="flex items-center gap-2 border-b border-black/5 bg-cream-100 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-black/15" />
              <span className="h-2 w-2 rounded-full bg-black/15" />
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="ml-2 text-[0.64rem] tracking-[0.12em] uppercase text-ink-muted">Variant report · example layout</span>
            </div>
            <div className="p-5" aria-hidden>
              <div className="grid grid-cols-3 gap-3">
                {[["Mean depth", 78], ["≥20× coverage", 92], ["Reads passing QC", 96]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-cream-100 p-3">
                    <div className="text-[0.6rem] tracking-[0.1em] uppercase text-ink-muted">{k}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-black/10"><div className="h-1.5 rounded-full bg-navy" style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
              </div>
              <table className="mt-4 w-full text-left text-[0.78rem]">
                <thead className="text-[0.6rem] tracking-[0.1em] uppercase text-ink-muted">
                  <tr><th className="py-2 font-medium">Gene</th><th className="py-2 font-medium">Variant</th><th className="py-2 font-medium hidden sm:table-cell">Inheritance</th><th className="py-2 font-medium">Classification</th></tr>
                </thead>
                <tbody className="text-ink">
                  {[
                    ["Gene A", "c.•••>•", "De novo", "Likely pathogenic", "bg-gold/40"],
                    ["Gene B", "c.•••del", "Inherited", "Uncertain significance", "bg-navy/15"],
                    ["Gene C", "c.•••+•", "Inherited", "Likely benign", "bg-black/[0.06]"],
                  ].map(([g, v, inh, cls, tone]) => (
                    <tr key={g} className="border-t border-black/[0.06]">
                      <td className="py-2.5 font-medium">{g}</td>
                      <td className="py-2.5 font-mono text-ink-soft">{v}</td>
                      <td className="py-2.5 hidden sm:table-cell text-ink-soft">{inh}</td>
                      <td className="py-2.5"><span className={`rounded-full px-2 py-0.5 text-[0.7rem] ${tone}`}>{cls}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <figcaption className="border-t border-black/5 px-5 py-3 text-[0.72rem] text-ink-muted">
              Example layout with placeholder entries — not patient data or a real result.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* Applications */}
      <Section>
        <SectionHead title="Applications" lede="Potential applications — an analysis can't guarantee that a causative variant will be found." />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPLICATIONS.map((a) => (
            <li key={a.title} className="rounded-2xl border border-black/[0.06] bg-cream-50/70 p-5 md:p-6">
              <GlyphTile name={a.glyph} tone="navy" />
              <h3 className="mt-4 font-display text-[1.15rem] leading-tight tracking-tightest text-ink">{a.title}</h3>
              <p className="mt-1.5 text-ink-soft text-[0.9rem] leading-[1.5]">{a.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Request analysis — the page's conversion point. */}
      <Section band="tint" id="request">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="kicker mb-3">Get started</div>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] tracking-tightest text-ink">Request analysis</h2>
            <p className="mt-4 text-ink-soft text-[1rem] leading-[1.6] max-w-[36ch]">
              Tell us about your requirement and our genomics team will respond with scope, turnaround and cost.
            </p>
            <ol className="mt-8 space-y-3">
              {[["share", "Send your requirement"], ["objective", "We confirm scope and data needs"], ["report", "Analysis and report"]].map(([g, t], i) => (
                <li key={t} className="flex items-center gap-3 text-[0.9rem] text-ink">
                  <GlyphTile name={g as GlyphName} size="sm" tone="navy" />
                  <span><span className="kicker text-navy/70 mr-2">{i + 1}</span>{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 space-y-3">
              <PendingContent topic="Form & policies">
                The form has no submission backend yet (same as the Partner form), and there are no Terms or Privacy Policy
                pages for the consent checkbox to link to.
              </PendingContent>
            </div>
          </div>
          <div className="lg:col-span-8">
            <WesRequestForm defaultAnalysis="Whole Exome Sequencing Analysis" />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.05] tracking-tightest text-ink">Common questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs} />
          </div>
        </div>
        <div className="mt-14 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-6 md:p-8 max-w-[80ch]">
          <GlyphTile name="validate" size="sm" />
          <div>
            <div className="kicker mb-2 text-ink">Scope &amp; limitations</div>
            <p className="text-ink-soft text-[0.92rem] leading-[1.6]">
              We analyse sequencing data generated elsewhere — we do not operate a sequencing laboratory. This is a research
              service, not a diagnostic test, and interpretation depends on the quality and coverage of the data supplied.
            </p>
          </div>
        </div>
      </Section>

      <ServiceCTA
        service={service}
        title={<>Have exome data <span className="italic text-gold">to analyse?</span></>}
        ctaHref="#request"
        ctaLabel="Request analysis"
        background="sequencingReads"
      />

      <Reveal />
    </main>
  );
}
