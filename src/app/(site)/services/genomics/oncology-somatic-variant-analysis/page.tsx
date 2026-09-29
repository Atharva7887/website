import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PendingContent, { SHOW_PENDING } from "@/components/PendingContent";
import MotionStory from "@/components/science/MotionStory";
import ScienceFigure from "@/components/science/ScienceFigure";
import VisualPipeline, { type PipelineStep } from "@/components/science/VisualPipeline";
import { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
import type { IllustrationName } from "@/components/science/Illustrations";
import { Section, SectionHead, FaqList, ServiceCTA, InputsOutputs, type IoItem } from "@/components/service/ServiceSections";
import GenomicsNav from "@/components/service/GenomicsNav";
import WesRequestForm, { SelectTestButton } from "@/components/service/WesRequestForm";
import { getService } from "@/lib/services-data";

const SLUG = "genomics/oncology-somatic-variant-analysis";

export const metadata: Metadata = {
  title: "Oncology: Somatic Variant Analysis",
  description:
    "Bioinformatics analysis of targeted tumour panel sequencing data, from raw FASTQ to an annotated, tiered somatic variant report with allele fractions and supporting evidence, for review by qualified clinical professionals.",
};

/*
 * Copy discipline for this page: the analysis identifies and annotates
 * candidate variants and supports clinical review. It never diagnoses,
 * never determines treatment, and every capability is qualified by panel
 * design and data quality.
 */

const EXAMPLE_GENES = ["EGFR", "KRAS", "BRAF", "ALK", "ERBB2", "TP53"];

const VARIANT_TYPES: { title: string; body: string; art: IllustrationName }[] = [
  { title: "SNVs", body: "Single-nucleotide changes identified within the covered genomic regions.", art: "snvChange" },
  { title: "Indels", body: "Insertions or deletions detected in covered regions.", art: "indelChange" },
  { title: "Copy number changes", body: "Changes in copy number inferred from sequencing coverage, where supported.", art: "copyNumber" },
];

const SUPPORTS = ["Different targeted panel designs", "Commercial or custom panels", "Standard NGS-generated data", "Solid tumour applications", "Haematological applications"];

const PIPELINE: PipelineStep[] = [
  { title: "Raw FASTQ", body: "Panel reads as supplied.", glyph: "fastq" },
  { title: "Quality assessment", body: "Read quality, depth, uniformity.", glyph: "qc" },
  { title: "Alignment / processing", body: "Mapped to the reference build.", glyph: "align" },
  { title: "Variant calling", body: "Candidate somatic variants called.", glyph: "variant" },
  { title: "Annotation", body: "Gene, consequence, cancer evidence.", glyph: "annotate" },
  { title: "Prioritisation", body: "Ranked by evidence and relevance.", glyph: "shortlist" },
  { title: "Tiered variant report", body: "Tiers, VAFs, and evidence.", glyph: "report" },
];

const ANALYSES: { name: string; body: string; art: IllustrationName; chain: string[]; note?: string }[] = [
  {
    name: "Screening Analysis",
    body: "Focused screening of tumour panel data for a defined set of potentially actionable alterations, such as hotspot variants in EGFR, KRAS and BRAF, with the option to extend to broader analysis on the same data.",
    art: "hotspotScreening",
    chain: ["FASTQ", "Targeted hotspots", "Focused result"],
  },
  {
    name: "Tumour-Only Analysis",
    body: "For tumour data without a matched normal. Population databases, panels of normals and other filters help separate likely somatic from inherited variation, with the basis of each call documented.",
    art: "tumourOnly",
    chain: ["FASTQ", "Filtering / annotation", "Likely somatic calls"],
    note: "Calls are likely somatic: inferred, not experimentally confirmed.",
  },
  {
    name: "Tumour–Normal Paired Analysis",
    body: "Tumour data analysed alongside matched normal data from the same patient. Direct comparison adds evidence for distinguishing tumour-acquired from inherited variation.",
    art: "tumourNormal",
    chain: ["Tumour + normal", "Comparison", "Somatic / germline interpretation"],
  },
];

const COVERS: { title: string; body: string; glyph: GlyphName }[] = [
  { title: "SNVs", body: "Single nucleotide variants, with variant allele fraction for relevant calls.", glyph: "variant" },
  { title: "Indels", body: "Insertions and deletions, including complex or multi-nucleotide changes.", glyph: "sequence" },
  { title: "CNVs", body: "Copy number alterations inferred from coverage.", glyph: "range" },
  { title: "TMB / MSI", body: "Tumour mutational burden and microsatellite instability estimates.", glyph: "signal" },
  { title: "Quality & coverage", body: "Coverage and quality assessment, with detection-limit information.", glyph: "qc" },
];

const TIERS: { tier: string; label: string; tone: string }[] = [
  { tier: "Tier I", label: "Strong clinical significance", tone: "bg-gold text-ink" },
  { tier: "Tier II", label: "Potential clinical significance", tone: "bg-gold/40 text-ink" },
  { tier: "Tier III", label: "Unknown clinical significance", tone: "bg-navy/15 text-ink" },
];
const INPUTS: IoItem[] = [
  { title: "FASTQ", glyph: "fastq" },
  { title: "BAM / CRAM", glyph: "align" },
  { title: "VCF", glyph: "variant" },
];

const OUTPUTS: IoItem[] = [
  { title: "Tiered variant report", glyph: "report", detail: "Annotated somatic findings, tiered by evidence." },
  { title: "Prioritised variant table", glyph: "table", detail: "Ranked calls, ready for review." },
  { title: "Variant allele fractions", glyph: "signal", detail: "With sequencing quality metrics per call." },
  { title: "Evidence & annotations", glyph: "annotate", detail: "Cancer and clinical evidence for each call." },
  { title: "Quality & coverage summary", glyph: "qc", detail: "Depth, uniformity, detection limits." },
  { title: "Filtered VCF", glyph: "variant", detail: "For your own pipelines and records." },
];

type Faq = { q: string; a: React.ReactNode; pending?: boolean };

const FAQS: Faq[] = [
  {
    q: "What is the difference between tumour-only and tumour–normal analysis?",
    a: "Tumour-only analysis uses tumour data without matched normal data and may use population databases, panels of normals and other filtering resources to identify likely somatic variants. Tumour–normal analysis compares tumour and matched normal data directly, providing additional evidence for distinguishing somatic from inherited variation.",
  },
  {
    q: "Can you analyse existing VCF or BAM files?",
    a: "Yes. Existing variant or alignment files can be analysed or reanalysed. The scope depends on the supplied files.",
  },
  {
    q: "What happens if no clinically relevant variant is detected?",
    a: "A negative result means that no reportable variant meeting the defined analysis and reporting criteria was identified. It does not exclude an alteration below the assay's detection limits, or one that cannot be reliably detected from the available data.",
  },
  {
    q: "Who owns the sequencing data and analysis results?",
    pending: true,
    a: (
      <PendingContent topic="Ownership">
        Draft: The client retains ownership of submitted sequencing data and project-generated analysis results, subject to
        the applicable service agreement and data-protection terms. Publish only once it matches the actual service
        agreement and privacy policy.
      </PendingContent>
    ),
  },
  {
    q: "Does the analysis determine treatment?",
    a: "No. The analysis provides genomic findings and supporting evidence for review by qualified clinical professionals. Treatment decisions remain the responsibility of the treating clinical team and should be made in the appropriate clinical context.",
  },
];

export default function OncologyPage() {
  const service = getService(SLUG);
  if (!service) notFound();
  const faqs = FAQS.filter((f) => SHOW_PENDING || !f.pending);

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Services", href: "/services" }, { label: "Genomics", href: "/services/genomics" }, { label: "Oncology" }]}
        eyebrow="Genomics · Oncology"
        title="Oncology: Somatic Variant Analysis"
        lede="Bioinformatics analysis of tumour panel sequencing data, from raw FASTQ files to a clinically annotated, tiered variant report."
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
            label="Tumour sample to report"
            description="A tumour sample, targeted panel regions, sequencing reads with a variant position, a single-base change, and an annotated report"
            frames={[
              { art: "tumourPanel", title: "Tumour sample", caption: "Tumour tissue is profiled with a targeted gene panel." },
              { art: "exomeCapture", title: "Targeted sequencing", caption: "Panel regions are captured and sequenced." },
              { art: "sequencingReads", title: "Sequencing reads", caption: "Reads are aligned against the reference." },
              { art: "snvChange", title: "Somatic variants", caption: "Candidate tumour-acquired changes are called." },
              { art: "variantReport", title: "Clinical annotation", caption: "Calls are annotated, tiered and prioritised." },
            ]}
          />
        }
      />

      <GenomicsNav current={`/services/${SLUG}`} />

      {/* What it is — short, with the example genes and reported fields made visual. */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <SectionHead title="What is Oncology Panel Data Analysis?" />
            <p className="-mt-4 font-display text-ink text-[1.2rem] md:text-[1.45rem] leading-[1.35] tracking-tight max-w-[40ch]">
              A bioinformatics service that turns targeted cancer panel data into a clinically annotated variant report.
            </p>
            <p className="mt-4 text-ink-soft text-[0.98rem] leading-[1.6] max-w-[52ch]">
              It identifies alterations acquired by the tumour across the genes the panel covers, and reports each with the
              evidence behind it, to support review by clinicians and molecular tumour boards.
            </p>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-black/[0.06] bg-cream-50 p-5 md:p-6">
              <div className="kicker mb-3">Genes a panel may cover: examples</div>
              <ul className="flex flex-wrap gap-2">
                {EXAMPLE_GENES.map((g) => (
                  <li key={g} className="rounded-lg border border-navy/15 bg-navy/[0.05] px-3 py-1.5 font-mono text-[0.9rem] text-navy">{g}</li>
                ))}
              </ul>
              <p className="mt-3 text-[0.8rem] text-ink-muted">Examples only; gene content depends on the panel used.</p>
            </div>
            <div className="rounded-2xl border border-black/[0.06] bg-cream-50 p-5 md:p-6">
              <div className="kicker mb-3">Each reported variant carries</div>
              <ul className="grid grid-cols-3 gap-2 text-center">
                {[["signal", "Allele fraction"], ["classify", "Clinical tier"], ["annotate", "Supporting evidence"]].map(([g, t]) => (
                  <li key={t} className="flex flex-col items-center gap-2 rounded-xl bg-cream-100 p-3 text-[0.82rem] text-ink">
                    <GlyphTile name={g as GlyphName} size="sm" tone="navy" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Variant types, shown rather than listed. */}
      <Section band="tint">
        <SectionHead title="Variant types" lede="What a tumour panel analysis looks for, where the panel design supports it." />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {VARIANT_TYPES.map((v) => (
            <li key={v.title} className="flex flex-col rounded-2xl border border-black/[0.06] bg-cream-50 p-5 md:p-6">
              <ScienceFigure name={v.art} description="" className="mb-5 h-40 bg-cream-100" />
              <h3 className="font-display text-[1.25rem] leading-tight tracking-tightest text-ink">{v.title}</h3>
              <p className="mt-1.5 text-ink-soft text-[0.9rem] leading-[1.5]">{v.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Our service — the pipeline is the centrepiece. */}
      <Section>
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-5">
            <div className="kicker mb-3">7 stages</div>
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink">Our Service</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-ink-soft text-[1rem] leading-[1.6] max-w-[62ch]">
              From raw FASTQ we carry out quality assessment, variant calling and annotation, and return a prioritised variant
              list with allele fractions and supporting evidence for each call.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Supported data">
              {SUPPORTS.map((s) => (
                <li key={s} className="rounded-full border border-navy/15 bg-navy/[0.04] px-3.5 py-1.5 text-[0.8rem] text-ink">{s}</li>
              ))}
            </ul>
            <p className="mt-2 text-[0.78rem] text-ink-muted">Subject to panel design, data quality and project requirements.</p>
          </div>
        </div>
        <VisualPipeline steps={PIPELINE} />
      </Section>

      {/* Analyses we offer — each can pre-fill the request form. */}
      <Section band="tint">
        <SectionHead title="Analyses we offer" lede="Three analysis designs, chosen by the samples and data available." />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ANALYSES.map((a, i) => (
            <li key={a.name} className="flex flex-col rounded-3xl border border-black/[0.08] bg-cream-50 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-5 items-start">
                <ScienceFigure name={a.art} description="" className="h-44 bg-cream-100" />
                <div>
                  <span className="kicker text-navy/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 font-display text-[1.4rem] leading-[1.08] tracking-tightest text-ink">{a.name}</h3>
                  <p className="mt-2 text-ink-soft text-[0.9rem] leading-[1.55]">{a.body}</p>
                </div>
              </div>
              <div aria-hidden className="mt-5 flex flex-wrap items-center gap-1 text-[0.72rem] tracking-[0.04em] uppercase text-navy">
                {a.chain.map((c, j) => (
                  <span key={c} className="flex items-center gap-1">
                    <span className="rounded-full bg-navy/[0.07] px-2 py-0.5">{c}</span>
                    {j < a.chain.length - 1 && <span className="text-gold-600">→</span>}
                  </span>
                ))}
              </div>
              {a.note && <p className="mt-3 text-[0.8rem] text-ink-muted">{a.note}</p>}
              <div className="mt-auto" />
              <SelectTestButton test={a.name} />
            </li>
          ))}
        </ol>
      </Section>

      {/* Coverage, with the qualifier stated once and prominently. */}
      <Section>
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink">What the Analysis Covers</h2>
          <p className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-gold/50 bg-gold/15 px-4 py-2 text-[0.84rem] font-medium text-ink">
            <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
            Where supported by panel design and data quality
          </p>
        </div>
        <ul className="flex flex-wrap gap-4">
          {COVERS.map((c) => (
            <li key={c.title} className="flex grow basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.75rem)] gap-4 rounded-2xl border border-black/[0.06] bg-cream-50/70 p-5">
              <GlyphTile name={c.glyph} tone="navy" />
              <div>
                <h3 className="font-display text-[1.12rem] leading-tight tracking-tightest text-ink">{c.title}</h3>
                <p className="mt-1 text-ink-soft text-[0.88rem] leading-[1.5]">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Tier definitions — the scale each reported variant is placed on. */}
      <Section band="tint">
        <SectionHead title="Tier definitions" lede="Each reported variant is assigned one tier." />
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TIERS.map((t) => (
            <div key={t.tier} className="rounded-2xl border border-black/[0.06] bg-cream-50 p-6">
              <dt>
                <span className={`inline-block rounded-full px-3 py-1 text-[0.8rem] font-medium ${t.tone}`}>{t.tier}</span>
                <span className="sr-only"> — </span>
              </dt>
              <dd className="mt-4 font-display text-[1.25rem] leading-tight tracking-tightest text-ink">{t.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* What comes in → what goes out. */}
      <Section>        <InputsOutputs
          inputs={INPUTS}
          process={["Quality & processing", "Variant calling", "Annotation & tiering"]}
          outputs={OUTPUTS}
        />
      </Section>

      {/* Request analysis */}
      <Section id="request" band="tint">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="kicker mb-3">Get started</div>
            <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] tracking-tightest text-ink">Request Analysis</h2>
            <p className="mt-4 text-ink-soft text-[1rem] leading-[1.6] max-w-[36ch]">
              Tell us about your requirement and our genomics team will respond with scope, turnaround and cost.
            </p>
            <div className="mt-8">
              <PendingContent topic="Form & terms">
                The form has no submission backend yet, and the &ldquo;applicable data protection and service terms&rdquo; the
                consent refers to are not published on the site. No compliance, accreditation, retention or encryption claims
                are made here until verified.
              </PendingContent>
            </div>
          </div>
          <div className="lg:col-span-8">
            <WesRequestForm
              defaultAnalysis="Oncology: Somatic Variant Analysis"
              consentLabel="I confirm that I am authorised to submit this data for bioinformatics analysis and agree to the applicable data protection and service terms."
            />
          </div>
        </div>
      </Section>

      {/* FAQ + scope */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <h2 className="lg:col-span-4 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.05] tracking-tightest text-ink">Common questions</h2>
          <div className="lg:col-span-8">
            <FaqList faqs={faqs} />
          </div>
        </div>
        <div className="mt-14 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-6 md:p-8 max-w-[80ch]">
          <GlyphTile name="validate" size="sm" />
          <div>
            <div className="kicker mb-2 text-ink">Scope &amp; limitations</div>
            <p className="text-ink-soft text-[0.92rem] leading-[1.6]">
              We analyse sequencing data generated elsewhere. Findings are provided for review by qualified clinical
              professionals; they are not a diagnosis and do not determine treatment. What can be detected depends on panel
              design, sequencing depth and data quality.
            </p>
            <div className="mt-3">
              <PendingContent topic="Clinical use">
                The hero says &ldquo;clinically annotated&rdquo; (annotated with clinical evidence). Confirm the intended-use
                position for clinical reporting, and any accreditation it depends on, before stronger clinical wording is used.
              </PendingContent>
            </div>
          </div>
        </div>
      </Section>

      <ServiceCTA
        service={service}
        title={<>Have tumour sequencing data <span className="italic text-gold">to analyse?</span></>}
        lede="Turn targeted oncology sequencing data into annotated and prioritised somatic variant findings for qualified clinical or research review."
        ctaHref="#request"
        ctaLabel="Request analysis"
        background="sequencingReads"
      />

      <Reveal />
    </main>
  );
}
