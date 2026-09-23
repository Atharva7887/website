import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MotionStory from "@/components/science/MotionStory";
import ScienceFigure from "@/components/science/ScienceFigure";
import VisualPipeline, { type PipelineStep } from "@/components/science/VisualPipeline";
import { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
import type { IllustrationName } from "@/components/science/Illustrations";
import { Section, SectionHead, ServiceCTA } from "@/components/service/ServiceSections";
import { getService } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "AI-Assisted Biomarker Identification",
  description:
    "Sequencing data in. Defensible biomarker signatures out. Cross-validated biomarker panels from sequencing and multi-omics data, plus AI-assisted target-to-candidate analysis.",
};

const SOURCES = [
  { label: "Gene" },
  { label: "Transcript" },
  { label: "Protein" },
  { label: "Metabolite" },
  { label: "Cell population" },
  { label: "Imaging feature" },
];

const READS = [
  { q: "Is disease present?", glyph: "diagnostic" as GlyphName },
  { q: "How is it likely to behave?", glyph: "prognostic" as GlyphName },
  { q: "Is a treatment working?", glyph: "pharmacodynamic" as GlyphName },
];

const TYPES: { type: string; tells: string; glyph: GlyphName }[] = [
  { type: "Diagnostic", tells: "Whether a disease is present, and which relevant state or subtype.", glyph: "diagnostic" },
  { type: "Prognostic", tells: "How a patient is likely to progress, regardless of treatment.", glyph: "prognostic" },
  { type: "Predictive", tells: "Whether a patient is likely to respond to a specific therapy.", glyph: "predictive" },
  { type: "Pharmacodynamic / Response", tells: "Whether a treatment is engaging its target or producing the expected biological effect.", glyph: "pharmacodynamic" },
  { type: "Monitoring", tells: "How a disease or response changes over time.", glyph: "monitoring" },
  { type: "Safety", tells: "Potential treatment-related harm, ideally before toxicity is clinically apparent.", glyph: "safety" },
  { type: "Susceptibility / Risk", tells: "Who may be at increased risk of developing a disease.", glyph: "risk" },
];

const MODALITIES: { name: string; sub: string; glyph: GlyphName }[] = [
  { name: "Genomics", sub: "DNA / variants", glyph: "dna" },
  { name: "Transcriptomics", sub: "RNA / expression", glyph: "rna" },
  { name: "Proteomics", sub: "Protein abundance", glyph: "protein" },
  { name: "Metabolomics", sub: "Metabolites", glyph: "metabolite" },
  { name: "Cellular", sub: "Cell populations", glyph: "cell" },
  { name: "Immune", sub: "Immune signatures", glyph: "immune" },
  { name: "Imaging", sub: "Spatial / imaging features", glyph: "imaging" },
];

const PIPELINES: { title: string; lede: string; steps: PipelineStep[]; capabilities: string[] }[] = [
  {
    title: "RNA-Seq Analysis Pipeline",
    lede: "Raw FASTQ to an interpreted result, version-controlled at every step.",
    steps: [
      { title: "FASTQ", glyph: "fastq" },
      { title: "QC", glyph: "qc" },
      { title: "Alignment", glyph: "align" },
      { title: "Quantification", glyph: "rank" },
      { title: "Differential expression", glyph: "compare" },
      { title: "Pathways", glyph: "pathway" },
      { title: "Interpretation", glyph: "report" },
    ],
    capabilities: [
      "Quality control, trimming, alignment, and quantification",
      "Differential expression, pathway and gene-set enrichment",
      "Cell-type deconvolution and immune profiling",
      "Fusion, splice-variant and isoform-level analysis",
      "Batch-effect correction across cohorts and sites",
      "Submission-ready figures, tables, and a versioned report",
    ],
  },
  {
    title: "Biomarker Discovery Pipeline",
    lede: "Takes processed data, finds the signature, then stress-tests it before reviewers do.",
    steps: [
      { title: "Data", glyph: "data" },
      { title: "Features", glyph: "map" },
      { title: "Candidates", glyph: "candidate" },
      { title: "ML selection", glyph: "classify" },
      { title: "Validation", glyph: "validate" },
      { title: "Compact panel", glyph: "shortlist" },
      { title: "Evidence", glyph: "report" },
    ],
    capabilities: [
      "Candidate marker identification across single and multi-omics inputs",
      "Machine-learning feature selection down to a compact, assay-ready panel",
      "Cross-validation, plus validation on an independent cohort where one is available",
      "Survival, response, and patient-stratification modelling",
      "Panel scoring on effect size, robustness, and assay feasibility",
      "A ranked shortlist with the evidence — and the limits — for every marker",
    ],
  },
];

const EVIDENCE: { title: string; body: string; glyph: GlyphName }[] = [
  { title: "Cross-validated", body: "Selection is repeated across folds of the discovery cohort, so a marker must hold up on data it wasn't chosen from.", glyph: "rearrange" },
  { title: "Independent cohort", body: "Where a second cohort exists, the locked panel is scored on it untouched.", glyph: "validate" },
  { title: "Limits stated", body: "Each marker ships with effect size, stability, and what the data can't support.", glyph: "report" },
];

/** Six measurable sources converging on one signal; labels live in the SVG so they stay aligned at any width. */
function SignalDiagram() {
  const rowH = 40;
  return (
    <svg viewBox="0 0 440 250" className="h-auto w-full" role="img" aria-labelledby="sig-title">
      <title id="sig-title">A gene, transcript, protein, metabolite, cell population, or imaging feature can each provide the measurable biomarker signal</title>
      {SOURCES.map((s, i) => {
        const y = 22 + i * rowH;
        const hot = i === 2;
        return (
          <g key={s.label}>
            <rect x="2" y={y - 14} width="150" height="28" rx="14" fill={hot ? "rgba(244,196,48,0.28)" : "rgba(30,91,168,0.07)"} stroke={hot ? "#F4C430" : "rgba(30,91,168,0.35)"} />
            <circle cx="18" cy={y} r="4" fill={hot ? "#D9A91A" : "#1E5BA8"} />
            <text x="30" y={y + 5} fontSize="14" fill="#1A1A1A" fontFamily="var(--font-inter), sans-serif">{s.label}</text>
            <path d={`M152 ${y} C240 ${y} 262 122 332 122`} fill="none" stroke={hot ? "#F4C430" : "rgba(26,26,26,0.22)"} strokeWidth={hot ? 2.2 : 1.3} strokeLinecap="round" />
          </g>
        );
      })}
      <circle className="sci-pulse" cx="370" cy="122" r="36" fill="rgba(244,196,48,0.25)" stroke="#F4C430" strokeWidth="2" />
      <circle cx="370" cy="122" r="12" fill="#F4C430" stroke="#1A1A1A" strokeWidth="1.2" />
      <text x="370" y="180" fontSize="12" textAnchor="middle" fill="#6B6B6B" letterSpacing="1.4" fontFamily="var(--font-inter), sans-serif">SIGNAL</text>
    </svg>
  );
}

type Stage = {
  title: string;
  method: string;
  body: string;
  art: IllustrationName;
  chain?: string[];
  link?: { href: string; label: string };
  caption?: string;
};

/** Target → candidate workflow. Each stage states its method; none claims efficacy. */
const STAGES: Stage[] = [
  {
    title: "Drug Target Identification",
    method: "AI-assisted",
    body: "Identify and prioritise candidate targets from available biological evidence and project-specific data.",
    art: "targetIdentification",
    chain: ["Biological data", "Disease / pathway signals", "Candidate targets"],
  },
  {
    title: "Structure-Based Virtual Screening",
    method: "AI / computational screening",
    body: "A compound library is screened computationally against the target's binding site.",
    art: "virtualScreening",
    chain: ["Target structure", "Compound library", "Ranked candidates"],
  },
  {
    title: "Candidate Prioritisation",
    method: "Predicted scoring",
    body: "Top-ranked compounds are prioritised by the selected scoring function and predicted binding metrics.",
    art: "candidateRanking",
    caption: "Predicted / computational ranking — not experimental affinity.",
  },
  {
    title: "Structural Docking",
    method: "Structure-based",
    body: "Shortlisted candidates are docked to generate and rank predicted binding poses.",
    art: "dockingPoses",
    chain: ["Target + candidate", "Predicted poses", "Pose ranking"],
    link: { href: "/services/molecular-docking", label: "Molecular Docking" },
  },
  {
    title: "Molecular Dynamics",
    method: "Physics-based simulation",
    body: "Selected poses are simulated to assess stability, interaction persistence, and conformational behaviour.",
    art: "trajectoryMotion",
    chain: ["Selected poses", "MD trajectory", "Dynamic behaviour"],
    link: { href: "/services/molecular-dynamics", label: "Molecular Dynamics" },
  },
  {
    title: "Comparative Analysis",
    method: "Comparative",
    body: "Candidates are compared on structural, dynamic, and energetic evidence to support downstream selection.",
    art: "candidateCompare",
  },
];

const TERMS: { term: string; def: string }[] = [
  { term: "Biomarker identification", def: "Finding measurable biological signatures and candidate markers." },
  { term: "Drug target identification", def: "Identifying and prioritising biological targets relevant to a disease or therapeutic hypothesis." },
  { term: "Virtual screening", def: "Searching a compound set computationally against a target." },
  { term: "Docking", def: "Predicting candidate binding poses and interactions." },
  { term: "Molecular dynamics", def: "Evaluating the dynamic behaviour of selected modelled systems." },
  { term: "Comparative analysis", def: "Comparing candidates on computational structural and dynamic evidence." },
];

/** Illustrative decision matrix: 3 = strong, 2 = mixed, 1 = weak. */
const CRITERIA = ["Stability", "Interaction persistence", "Structural behaviour", "Energetic metrics", "Interface analysis"];
const CANDIDATES: { name: string; scores: number[]; rank: number }[] = [
  { name: "Candidate A", scores: [3, 3, 3, 2, 3], rank: 1 },
  { name: "Candidate B", scores: [2, 2, 3, 3, 2], rank: 2 },
  { name: "Candidate C", scores: [1, 1, 2, 2, 1], rank: 3 },
];
const LEVEL = ["", "Weak", "Mixed", "Strong"];

function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${i <= n ? (n === 3 ? "bg-gold" : "bg-cream-100") : "bg-cream-100/15"}`} />
      ))}
    </span>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="7.5" fill="#1E5BA8" />
      <path d="M4.8 8.2 L7 10.3 L11.3 5.8" stroke="#FAF7F0" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BiomarkerPage() {
  const service = getService("biomarker-identification");
  if (!service) notFound();

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Services", href: "/services" }, { label: "Biomarker Identification" }]}
        eyebrow="Computational science"
        title="AI-Assisted Biomarker Identification"
        lede="Sequencing data in. Defensible biomarker signatures out."
        cta={
          <>
            <Link href="/partner" className="cta">
              Partner with us
              <span className="cta-arrow">→</span>
            </Link>
            <Link href="/services" className="cta cta-ghost">All services</Link>
          </>
        }
        aside={
          <MotionStory
            label="Data to signature"
            description="A samples-by-features matrix, a correlation network, a funnel to candidates, and cross-validation folds"
            frames={[
              { art: "sampleMatrix", title: "Data", caption: "Sequencing and multi-omics data, after QC and normalisation." },
              { art: "biomarkerNetwork", title: "Signals", caption: "Correlated features cluster into candidate signals." },
              { art: "screeningFunnel", title: "Selection", caption: "Feature selection narrows to a compact panel." },
              { art: "validationFolds", title: "Stress-test", caption: "Cross-validation, then an independent cohort where one exists." },
            ]}
          />
        }
      />

      {/* The intro statement, laid out as its three parts rather than one paragraph. */}
      <Section>
        <p className="reveal font-display text-ink text-[1.3rem] md:text-[1.75rem] leading-[1.3] tracking-tight max-w-[44ch]">
          IndiskaAI turns raw sequencing and multi-omics data into ranked, cross-validated biomarker panels.
        </p>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { k: "In", t: "Raw sequencing & multi-omics data", g: "data" as GlyphName },
            { k: "Through", t: "Pipelines we developed in-house", g: "production" as GlyphName },
            { k: "Out", t: "Ranked panels, with the evidence behind every call", g: "shortlist" as GlyphName },
          ].map((s, i) => (
            <li key={s.k} className="relative flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-cream-50/70 p-5">
              <GlyphTile name={s.g} tone="navy" />
              <div>
                <div className="kicker text-navy/70">{s.k}</div>
                <div className="mt-1 text-ink text-[0.98rem] leading-snug">{s.t}</div>
              </div>
              {i < 2 && <span aria-hidden className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-gold-600 text-lg">→</span>}
            </li>
          ))}
        </ol>
      </Section>

      {/* What a biomarker is: many measurable sources, one signal, a decision. */}
      <Section band="tint">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-black/5 bg-cream-50 p-5 md:p-7">
              <SignalDiagram />
              <ol className="mt-6 grid grid-cols-3 gap-2 text-center" aria-label="From signal to decision">
                {["Measurable signal", "Biological state", "Decision / stratification"].map((t, i) => (
                  <li key={t} className={`rounded-xl px-2 py-3 text-[0.74rem] leading-tight ${i === 0 ? "bg-gold/25 text-ink" : i === 1 ? "bg-navy/10 text-ink" : "bg-ink text-cream-100"}`}>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <SectionHead title="What a biomarker is" />
            <p className="-mt-4 text-ink text-[1.05rem] leading-[1.6] max-w-[48ch]">
              Any measurable characteristic — a gene, a transcript, a protein, a metabolite, a cell population, an imaging
              feature — that gives an objective read on biology.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {READS.map((r) => (
                <li key={r.q} className="rounded-xl border border-black/[0.06] bg-cream-50 p-4">
                  <GlyphTile name={r.glyph} size="sm" tone="navy" />
                  <div className="mt-3 text-[0.9rem] leading-snug text-ink">{r.q}</div>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-l-2 border-gold pl-5">
              <div className="kicker mb-1.5">The value is timing</div>
              <p className="text-ink-soft text-[0.95rem] leading-[1.6] max-w-[52ch]">
                A biomarker isn&apos;t the clinical outcome. It&apos;s the measurable signal that can help predict, stratify, or
                monitor that outcome earlier, and in smaller cohorts, than waiting for the outcome itself. Used well, it can
                improve trial design, patient stratification, and development decisions.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Types: a table where there's room, an accordion where there isn't. */}
      <Section>
        <SectionHead title="Types of biomarkers" lede="Classified by the decision they support — not only by the technology that measures them." />
        <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10">
          <table className="w-full text-left">
            <caption className="sr-only">Biomarker types and the decision each supports</caption>
            <thead className="bg-cream-200/60">
              <tr>
                <th scope="col" className="w-[34%] px-6 py-3.5 kicker text-ink">Type</th>
                <th scope="col" className="px-6 py-3.5 kicker text-ink">What it tells you</th>
              </tr>
            </thead>
            <tbody>
              {TYPES.map((t) => (
                <tr key={t.type} className="border-t border-black/[0.06] bg-cream-50/60 transition-colors hover:bg-cream-50">
                  <th scope="row" className="px-6 py-4 font-normal">
                    <span className="flex items-center gap-3">
                      <GlyphTile name={t.glyph} size="sm" tone="navy" />
                      <span className="font-display text-[1.1rem] tracking-tightest text-ink">{t.type}</span>
                    </span>
                  </th>
                  <td className="px-6 py-4 text-ink-soft text-[0.95rem] leading-[1.5]">{t.tells}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden border-t border-black/10">
          {TYPES.map((t) => (
            <details key={t.type} className="group border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                <GlyphTile name={t.glyph} size="sm" tone="navy" />
                <span className="flex-1 font-display text-[1.08rem] tracking-tightest text-ink">{t.type}</span>
                <span aria-hidden className="text-navy text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 pl-[3.25rem] text-ink-soft text-[0.92rem] leading-[1.55]">{t.tells}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Modalities */}
      <Section band="tint">
        <SectionHead title="Measured across modalities" lede="The same categories can be investigated through very different data types." />
        <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {MODALITIES.map((m) => (
            <li key={m.name} className="rounded-2xl border border-black/[0.06] bg-cream-50 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-navy/20">
              <GlyphTile name={m.glyph} tone="navy" />
              <div className="mt-4 text-[0.66rem] tracking-[0.12em] uppercase text-navy">{m.name}</div>
              <div className="mt-1 text-[0.86rem] leading-snug text-ink">{m.sub}</div>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-display text-[1.15rem] md:text-[1.3rem] leading-snug tracking-tight text-ink max-w-[50ch]">
          Choosing the right modality for the biological question is a central part of biomarker programme design.
        </p>
      </Section>

      {/* What we provide — two substantial capability cards. */}
      <Section>
        <SectionHead title="What we provide" kicker="Developed and operated in-house" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {PIPELINES.map((p, idx) => (
            <article key={p.title} className="relative overflow-hidden rounded-3xl border border-black/[0.08] bg-cream-50 p-6 md:p-9 shadow-[0_24px_60px_-44px_rgba(16,53,101,0.45)]">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${idx === 0 ? "bg-navy" : "bg-gold"}`} />
              <div className="kicker text-navy/70">0{idx + 1}</div>
              <h3 className="mt-2 font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.05] tracking-tightest text-ink">{p.title}</h3>
              <p className="mt-3 text-ink-soft text-[0.98rem] leading-[1.55] max-w-[46ch]">{p.lede}</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8">
                <div aria-label={`${p.title} stages`}>
                  <VisualPipeline steps={p.steps} vertical />
                </div>
                <ul className="space-y-3.5 md:border-l md:border-black/[0.06] md:pl-8">
                  {p.capabilities.map((c) => (
                    <li key={c} className="flex gap-3 text-[0.92rem] leading-[1.5] text-ink">
                      <Check />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Evidence: how a signature is stress-tested. */}
      <Section band="tint">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHead title="Stress-tested before it's reported" kicker="Evidence & validation" />
            <ul className="-mt-2 space-y-4">
              {EVIDENCE.map((e) => (
                <li key={e.title} className="flex gap-4">
                  <GlyphTile name={e.glyph} size="sm" tone="navy" />
                  <div>
                    <div className="font-display text-[1.1rem] tracking-tightest text-ink">{e.title}</div>
                    <p className="mt-0.5 text-ink-soft text-[0.9rem] leading-[1.5]">{e.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <figure className="lg:col-span-7">
            <ScienceFigure
              name="validationFolds"
              description="Five cross-validation folds, each holding out a different part of the discovery cohort, beside a separate independent cohort"
              className="p-6 md:p-10"
            />
            <figcaption className="mt-2.5 text-[0.72rem] text-ink-muted">
              Each row holds out a different fold (gold); the separate block is an independent cohort. Schematic.
            </figcaption>
          </figure>
        </div>
        <div className="mt-12 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-6 max-w-[80ch]">
          <GlyphTile name="validate" size="sm" />
          <div>
            <div className="kicker mb-2 text-ink">Scope &amp; limitations</div>
            <p className="text-ink-soft text-[0.92rem] leading-[1.6]">
              This is exploratory research. Computationally identified candidates require independent experimental and
              clinical validation before supporting any diagnostic or treatment decision.
            </p>
          </div>
        </div>
      </Section>

      {/* AI-assisted drug-discovery analysis — a separate track that biomarker evidence can feed. */}
      <Section id="drug-discovery">
        <div className="mb-10 md:mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="kicker mb-3">AI-assisted drug-discovery analysis</div>
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest text-ink max-w-[20ch]">
              From biological evidence to prioritised candidates
            </h2>
          </div>
          <p className="lg:col-span-5 text-ink-soft text-[0.95rem] leading-[1.55]">
            Biomarkers describe a disease state. When a programme moves toward therapeutics, the same evidence can inform
            target hypotheses — and a structure-guided workflow then prioritises candidate molecules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-ink px-4 py-2 text-[0.82rem] font-medium text-cream-100">Biological data</span>
          <span aria-hidden className="h-px flex-1 bg-navy/20" />
        </div>

        <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {STAGES.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-2xl border border-black/[0.07] bg-cream-50 p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-navy px-2 text-[0.74rem] font-medium tabular-nums text-cream-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-navy/15 bg-navy/[0.05] px-2.5 py-1 text-[0.7rem] tracking-[0.04em] text-navy">{s.method}</span>
              </div>
              <ScienceFigure name={s.art} description="" className="mt-4 h-36 bg-cream-100" />
              <h3 className="mt-4 font-display text-[1.22rem] leading-tight tracking-tightest text-ink">{s.title}</h3>
              <p className="mt-1.5 text-ink-soft text-[0.9rem] leading-[1.5]">{s.body}</p>
              {s.chain && (
                <div aria-hidden className="mt-3 flex flex-wrap items-center gap-1 text-[0.72rem] tracking-[0.04em] uppercase text-navy">
                  {s.chain.map((c, j) => (
                    <span key={c} className="flex items-center gap-1">
                      <span className="rounded-full bg-navy/[0.07] px-2 py-0.5">{c}</span>
                      {j < s.chain!.length - 1 && <span className="text-gold-600">→</span>}
                    </span>
                  ))}
                </div>
              )}
              {s.caption && <p className="mt-3 text-[0.76rem] text-ink-muted">{s.caption}</p>}
              {s.link && (
                <Link href={s.link.href} className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-navy hover:text-ink">
                  See {s.link.label}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-navy/20" />
          <span className="rounded-full bg-gold px-4 py-2 text-[0.82rem] font-medium text-ink">Candidate prioritisation</span>
        </div>

        <details className="group mt-10 rounded-2xl border border-black/10 bg-cream-50/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-ink [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.1rem] tracking-tightest">How these terms differ</span>
            <span aria-hidden className="text-navy text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 px-5 pb-5">
            {TERMS.map((t) => (
              <div key={t.term} className="border-t border-black/[0.06] pt-3">
                <dt className="text-[0.9rem] font-medium text-ink">{t.term}</dt>
                <dd className="mt-0.5 text-[0.86rem] text-ink-soft">{t.def}</dd>
              </div>
            ))}
          </dl>
        </details>
      </Section>

      {/* Decision: what the workflow hands over — a ranked shortlist with its evidence. */}
      <Section band="navy">
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="text-[0.72rem] tracking-[0.18em] uppercase text-gold mb-3">Illustrative example</div>
            <h2 className="font-display text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.02] tracking-tightest">Candidate prioritisation</h2>
          </div>
          <p className="lg:col-span-5 text-cream-100/75 text-[0.95rem] leading-[1.55]">
            The output is a comparative ranking and the evidence behind it — a basis for choosing what to test experimentally.
          </p>
        </div>

        <div className="hidden md:block overflow-hidden rounded-2xl border border-cream-100/10">
          <table className="w-full text-left">
            <caption className="sr-only">Illustrative comparison of three candidates across five computational criteria, with a comparative rank</caption>
            <thead className="bg-cream-100/[0.06]">
              <tr>
                <th scope="col" className="px-5 py-3.5 text-[0.7rem] tracking-[0.12em] uppercase text-cream-100/60 font-medium">Candidate</th>
                {CRITERIA.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3.5 text-[0.7rem] tracking-[0.1em] uppercase text-cream-100/60 font-medium">{c}</th>
                ))}
                <th scope="col" className="px-5 py-3.5 text-[0.7rem] tracking-[0.12em] uppercase text-gold font-medium">Comparative rank</th>
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map((c) => (
                <tr key={c.name} className="border-t border-cream-100/10">
                  <th scope="row" className="px-5 py-4 font-display text-[1.05rem] font-normal tracking-tightest">{c.name}</th>
                  {c.scores.map((s, i) => (
                    <td key={CRITERIA[i]} className="px-4 py-4">
                      <Dots n={s} />
                      <span className="sr-only">{LEVEL[s]}</span>
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.85rem] font-medium ${c.rank === 1 ? "bg-gold text-ink" : "bg-cream-100/10 text-cream-100"}`}>
                      {c.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden space-y-3">
          {CANDIDATES.map((c) => (
            <li key={c.name} className="rounded-2xl border border-cream-100/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-[1.1rem] tracking-tightest">{c.name}</span>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.85rem] font-medium ${c.rank === 1 ? "bg-gold text-ink" : "bg-cream-100/10"}`}>
                  <span className="sr-only">Rank </span>{c.rank}
                </span>
              </div>
              <dl className="mt-3 space-y-2">
                {CRITERIA.map((cr, i) => (
                  <div key={cr} className="flex items-center justify-between gap-3 text-[0.85rem]">
                    <dt className="text-cream-100/75">{cr}</dt>
                    <dd className="flex items-center gap-2"><Dots n={c.scores[i]} /><span className="sr-only">{LEVEL[c.scores[i]]}</span></dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[0.78rem] leading-[1.5] text-cream-100/60 max-w-[74ch]">
          Illustrative — not results from any project. Rankings rest on computational evidence (predicted scores, simulated
          behaviour); they are not measured affinities and do not predict efficacy.
        </p>
      </Section>

      <ServiceCTA
        service={service}
        title="Send us your study design and we'll tell you what is realistically discoverable in it."
        ctaLabel="Partner with us"
        background="biomarkerNetwork"
      />

      <Reveal />
    </main>
  );
}
