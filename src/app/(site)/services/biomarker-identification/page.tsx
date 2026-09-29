import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MotionStory from "@/components/science/MotionStory";
import { VolcanoPlot, ExpressionHeatmap } from "@/components/science/BiomarkerPlots";
import { GlyphTile, type GlyphName } from "@/components/science/Glyphs";
import { Section, SectionHead, ServiceCTA } from "@/components/service/ServiceSections";
import { getService } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "AI-Assisted Biomarker Identification",
  description:
    "RNA sequencing data in. Survival-linked gene signatures out. A compact, cross-validated gene signature from raw RNA-seq reads and patient survival data.",
};

const WHY_QUESTIONS = ["Who has it?", "Who will progress?", "Who will respond?"];

const FUNNEL: { n: string; title: string; body: string; glyph: GlyphName }[] = [
  { n: "1", title: "Input data", body: "Sequencing reads from patient samples", glyph: "fastq" },
  { n: "2", title: "Signal", body: "Genes whose activity differs between patient groups", glyph: "signal" },
  { n: "3", title: "Processing", body: "Noise filtered out, the signal tested and modelled", glyph: "qc" },
  { n: "4", title: "Marker", body: "A small set of genes that tracks the outcome", glyph: "shortlist" },
  { n: "5", title: "Decision", body: "Patients stratified, trials designed, treatment tracked", glyph: "handoff" },
];

type Assist = {
  marker: string;
  question: string;
  howWeAssist: string;
  studyNeeds: string;
  scope: "Full pipeline" | "Candidate genes";
  glyph: GlyphName;
};

const ASSIST: Assist[] = [
  {
    marker: "Prognostic",
    question: "How will patients progress?",
    howWeAssist: "We take your cohort through the full pipeline to a compact gene signature associated with survival, and a risk score for each patient.",
    studyNeeds: "RNA-seq samples with survival time and event status for each patient.",
    scope: "Full pipeline",
    glyph: "prognostic",
  },
  {
    marker: "Diagnostic",
    question: "Is the disease present?",
    howWeAssist: "We compare diseased and healthy samples to identify candidate genes that separate them, with pathway context.",
    studyNeeds: "RNA-seq samples from disease and control groups.",
    scope: "Candidate genes",
    glyph: "diagnostic",
  },
  {
    marker: "Predictive",
    question: "Who will respond to treatment?",
    howWeAssist: "We compare responders with non-responders to identify candidate genes linked to treatment response.",
    studyNeeds: "Pre-treatment samples with known response status.",
    scope: "Candidate genes",
    glyph: "predictive",
  },
  {
    marker: "Response",
    question: "Is the treatment having an effect?",
    howWeAssist: "We compare treated and untreated samples to show which genes and pathways the treatment changes.",
    studyNeeds: "Treated and untreated (or before and after) samples.",
    scope: "Candidate genes",
    glyph: "pharmacodynamic",
  },
  {
    marker: "Monitoring",
    question: "How is the disease changing over time?",
    howWeAssist: "We compare samples across time points to identify genes whose activity follows disease course.",
    studyNeeds: "Samples collected at two or more time points.",
    scope: "Candidate genes",
    glyph: "monitoring",
  },
];

type Package = {
  kicker: string;
  title: string;
  body: string;
  receive: string[];
  note?: string;
};

const END_TO_END: Package = {
  kicker: "End to end",
  title: "Prognostic Biomarker Discovery",
  body: "From raw RNA sequencing reads to a compact gene signature associated with patient survival.",
  receive: [
    "Candidate prognostic genes",
    "The final gene signature with hazard ratios",
    "A risk score for each patient",
    "A written report with result tables and figures",
  ],
  note: "Requires survival data for each patient.",
};

const STAGE_PACKAGES: Package[] = [
  {
    kicker: "Data processing",
    title: "Sequencing Data Quality Assessment",
    body: "Find out whether your RNA-seq data is fit for analysis before investing further.",
    receive: ["Per-sample quality report", "A summary of any issues found"],
  },
  {
    kicker: "Data processing",
    title: "RNA-Seq Data Processing",
    body: "Raw sequencing reads turned into an analysis-ready gene expression matrix.",
    receive: ["Gene-level counts matrix", "A processing quality summary"],
  },
  {
    kicker: "Expression analysis",
    title: "Differential Expression & Pathway Analysis",
    body: "Identify the genes that change between your groups and the pathways behind them.",
    receive: ["Gene list with fold changes and adjusted p-values", "Enriched pathways, and plots"],
  },
];

type PipelineStep = { n: number; title: string };
const STAGE_1: PipelineStep[] = [
  { n: 1, title: "Quality check" },
  { n: 2, title: "Alignment" },
  { n: 3, title: "Quantification" },
];
const STAGE_2: PipelineStep[] = [
  { n: 4, title: "Differential expression" },
  { n: 5, title: "Pathway enrichment" },
];
const STAGE_3: PipelineStep[] = [
  { n: 6, title: "Survival screening" },
  { n: 7, title: "Feature selection" },
  { n: 8, title: "Signature modelling" },
];

const READING_GUIDE = [
  { label: "Right side, red", body: "Genes more active in your first group." },
  { label: "Left side, blue", body: "Genes more active in your second group." },
  { label: "Higher up", body: "Stronger statistical support for the change." },
];

const EVIDENCE: { title: string; body: string; glyph: GlyphName }[] = [
  { title: "Cross-validated selection", body: "Genes are selected with cross-validation, so the signature isn't tuned to one arrangement of the data.", glyph: "rearrange" },
  { title: "Independent of clinical factors", body: "The final genes are tested alongside clinical variables such as age and stage, so their value is their own.", glyph: "validate" },
  { title: "Limits stated", body: "Every result comes with its effect size, statistical support, and what the data can't support.", glyph: "report" },
];

type WorkOption = { option: string; provide: string; services: string };
const WORK_OPTIONS: WorkOption[] = [
  { option: "Complete biomarker discovery", provide: "Raw sequencing files + survival data", services: "All stages" },
  { option: "Discovery from counts", provide: "Gene counts matrix + survival data", services: "Stages 2–3" },
  { option: "Expression analysis only", provide: "Gene counts matrix", services: "Stage 2" },
  { option: "Data quality check", provide: "Raw sequencing files or counts matrix", services: "Stages 1–2" },
];

const WHAT_WE_NEED = [
  "RNA sequencing files (FASTQ) or a gene counts matrix",
  "Sample information, including each sample's group",
  "For prognostic work: survival time and event status per patient",
];

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="7.5" fill="#1E5BA8" />
      <path d="M4.8 8.2 L7 10.3 L11.3 5.8" stroke="#FAF7F0" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackageCard({ p, featured }: { p: Package; featured?: boolean }) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
        featured ? "border-black/[0.08] bg-cream-50 shadow-[0_24px_60px_-44px_rgba(16,53,101,0.45)] lg:col-span-3" : "border-black/[0.07] bg-cream-50 lg:col-span-1"
      }`}
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${featured ? "bg-navy" : "bg-gold"}`} />
      <div className="kicker text-navy/70">{p.kicker}</div>
      <h3 className={`mt-2 font-display leading-[1.05] tracking-tightest text-ink ${featured ? "text-[clamp(1.4rem,2.6vw,1.9rem)]" : "text-[1.25rem]"}`}>{p.title}</h3>
      <p className="mt-3 text-ink-soft text-[0.94rem] leading-[1.55] max-w-[52ch]">{p.body}</p>

      <div className="mt-6">
        <div className="kicker mb-3 text-ink-muted">You receive</div>
        <ul className="space-y-2.5">
          {p.receive.map((r) => (
            <li key={r} className="flex gap-3 text-[0.9rem] leading-[1.5] text-ink">
              <Check />
              {r}
            </li>
          ))}
        </ul>
      </div>
      {p.note && <p className="mt-5 text-[0.78rem] text-ink-muted">{p.note}</p>}
    </article>
  );
}

function StageColumn({ title, steps, tint }: { title: string; steps: PipelineStep[]; tint: "navy" | "gold" }) {
  return (
    <div className="flex flex-col rounded-2xl border border-black/[0.07] bg-cream-50 p-5 md:p-6">
      <div className={`kicker mb-4 ${tint === "navy" ? "text-navy/70" : "text-gold-600"}`}>{title}</div>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.n} className="flex items-center gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-medium tabular-nums ${tint === "navy" ? "bg-navy text-cream-100" : "bg-gold text-ink"}`}>
              {s.n}
            </span>
            <span className="text-[0.92rem] leading-snug text-ink">{s.title}</span>
          </li>
        ))}
      </ol>
    </div>
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
        lede="RNA sequencing data in. Survival-linked gene signatures out."
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
            label="Reads to signature"
            description="Raw sequencing reads, a correlation network of candidate signals, a funnel narrowing to a compact panel, and cross-validation folds"
            frames={[
              { art: "sampleMatrix", title: "In", caption: "Raw reads from your samples, with patient survival information." },
              { art: "biomarkerNetwork", title: "Through", caption: "Our biomarker discovery pipeline, developed and run in-house." },
              { art: "screeningFunnel", title: "Narrowing", caption: "Feature selection narrows to a compact signature." },
              { art: "validationFolds", title: "Out", caption: "A compact gene signature, with the evidence behind every gene that made the cut." },
            ]}
          />
        }
      />

      {/* Why it matters */}
      <Section>
        <SectionHead title="Every disease leaves a trace in the data" kicker="Why it matters" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <p className="lg:col-span-7 text-ink text-[1.05rem] leading-[1.65] max-w-[58ch]">
            Long before an outcome shows up in the clinic, cells are already behaving differently. Some genes work harder,
            others fall silent, whole pathways shift. Captured in the right data and read carefully, that difference
            becomes something you can measure, compare and act on. It gives you an early answer to three questions:
          </p>
          <ul className="lg:col-span-5 space-y-3">
            {WHY_QUESTIONS.map((q) => (
              <li key={q} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-cream-50 px-5 py-4 font-display text-[1.1rem] tracking-tightest text-ink">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Input data -> Signal -> Processing -> Marker -> Decision */}
      <Section band="tint">
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FUNNEL.map((f) => (
            <li key={f.n} className="relative flex flex-col rounded-2xl border border-black/[0.06] bg-cream-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[0.72rem] font-medium tabular-nums text-cream-100">{f.n}</span>
                <GlyphTile name={f.glyph} size="sm" tone="navy" />
              </div>
              <div className="mt-4 font-display text-[1.05rem] tracking-tightest text-ink">{f.title}</div>
              <p className="mt-1.5 text-ink-soft text-[0.86rem] leading-[1.45]">{f.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 border-l-2 border-gold pl-5 max-w-[70ch]">
          <div className="kicker mb-1.5">The value is timing</div>
          <p className="text-ink-soft text-[0.95rem] leading-[1.6]">
            Waiting for survival outcomes takes years and large cohorts. A well-supported gene signature can point to
            high-risk patients from samples you already have, so trial design and development decisions move sooner.
          </p>
        </div>
      </Section>

      {/* How we can assist your research */}
      <Section>
        <SectionHead
          title="How we can assist your research"
          kicker="For your research"
          lede="Different research questions call for different markers. Tell us what you need to find, and we shape the analysis around your study design."
        />
        <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10">
          <table className="w-full text-left">
            <caption className="sr-only">Biomarker types we support, how we assist, what the study needs, and the scope of work</caption>
            <thead className="bg-cream-200/60">
              <tr>
                <th scope="col" className="w-[16%] px-5 py-3.5 kicker text-ink">Marker you need</th>
                <th scope="col" className="w-[34%] px-5 py-3.5 kicker text-ink">How we assist</th>
                <th scope="col" className="w-[32%] px-5 py-3.5 kicker text-ink">What your study needs</th>
                <th scope="col" className="px-5 py-3.5 kicker text-ink">Scope</th>
              </tr>
            </thead>
            <tbody>
              {ASSIST.map((a) => (
                <tr key={a.marker} className="border-t border-black/[0.06] bg-cream-50/60 align-top transition-colors hover:bg-cream-50">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="flex items-center gap-3">
                      <GlyphTile name={a.glyph} size="sm" tone="navy" />
                      <span>
                        <span className="block font-display text-[1.05rem] tracking-tightest text-ink">{a.marker}</span>
                        <span className="block text-[0.78rem] text-ink-muted">{a.question}</span>
                      </span>
                    </span>
                  </th>
                  <td className="px-5 py-4 text-ink-soft text-[0.9rem] leading-[1.5]">{a.howWeAssist}</td>
                  <td className="px-5 py-4 text-ink-soft text-[0.9rem] leading-[1.5]">{a.studyNeeds}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[0.74rem] font-medium ${a.scope === "Full pipeline" ? "bg-gold/20 text-ink" : "bg-navy/10 text-navy"}`}>
                      {a.scope}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden border-t border-black/10">
          {ASSIST.map((a) => (
            <details key={a.marker} className="group border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                <GlyphTile name={a.glyph} size="sm" tone="navy" />
                <span className="flex-1">
                  <span className="block font-display text-[1.05rem] tracking-tightest text-ink">{a.marker}</span>
                  <span className="block text-[0.78rem] text-ink-muted">{a.question}</span>
                </span>
                <span aria-hidden className="text-navy text-xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <div className="pb-4 pl-[3.25rem] space-y-2">
                <p className="text-ink-soft text-[0.9rem] leading-[1.5]">{a.howWeAssist}</p>
                <p className="text-ink-muted text-[0.82rem] leading-[1.5]">Needs: {a.studyNeeds}</p>
                <span className={`inline-flex rounded-full px-3 py-1 text-[0.74rem] font-medium ${a.scope === "Full pipeline" ? "bg-gold/20 text-ink" : "bg-navy/10 text-navy"}`}>
                  {a.scope}
                </span>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-6 text-ink-soft text-[0.9rem]">
          New to biomarker types? Read our guide to biomarker types on the{" "}
          <Link href="/research" className="text-navy underline underline-offset-2 hover:text-ink">Research page</Link>.
        </p>
      </Section>

      {/* What we provide */}
      <Section band="tint">
        <SectionHead title="What we provide" kicker="Developed and operated in-house" lede="Take the complete biomarker discovery service, or start from whichever stage your data is at." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <PackageCard p={END_TO_END} featured />
          {STAGE_PACKAGES.map((p) => (
            <PackageCard key={p.title} p={p} />
          ))}
        </div>
      </Section>

      {/* How we discover biomarkers: eight steps, three stages */}
      <Section>
        <SectionHead
          title="How we discover biomarkers"
          kicker="Our platform"
          lede="Every project runs through our biomarker discovery pipeline. An RNA-seq pipeline sits inside it, preparing your data before expression analysis and survival modelling begin."
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-ink px-4 py-2 text-[0.82rem] font-medium text-cream-100">RNA sequencing reads</span>
          <span className="rounded-full border border-navy/20 bg-navy/[0.05] px-4 py-2 text-[0.82rem] font-medium text-navy">Clinical survival data</span>
          <span aria-hidden className="h-px flex-1 bg-navy/20" />
          <span className="text-[0.72rem] tracking-[0.14em] uppercase text-ink-muted">Eight steps, three stages</span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <StageColumn title="Stage 1 · inside the platform · RNA-seq pipeline" steps={STAGE_1} tint="navy" />
          <StageColumn title="Stage 2 · Expression analysis" steps={STAGE_2} tint="navy" />
          <StageColumn title="Stage 3 · Biomarker modelling" steps={STAGE_3} tint="gold" />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-navy/20" />
          <span className="rounded-full bg-gold px-4 py-2 text-[0.82rem] font-medium text-ink">Prognostic gene signature</span>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-[0.9rem] leading-[1.5] text-ink-soft">
          <p><span className="font-medium text-ink">RNA-seq pipeline:</span> raw reads are checked, mapped and counted into a clean gene expression matrix.</p>
          <p><span className="font-medium text-ink">Expression analysis:</span> genes that differ between groups are found and placed in their biological context.</p>
          <p><span className="font-medium text-ink">Biomarker modelling:</span> those genes are tested against survival and narrowed to a small, independent signature.</p>
        </div>
      </Section>

      {/* Sample outputs: volcano plot + expression heatmap */}
      <Section band="tint">
        <SectionHead title="Results you can see, not just read" kicker="Sample outputs" lede="Every expression analysis comes with clear figures, so you can see what changed and where to look next." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <figure className="rounded-2xl border border-black/[0.07] bg-cream-50 p-6">
            <VolcanoPlot />
            <figcaption className="mt-4">
              <div className="font-display text-[1.05rem] tracking-tightest text-ink">Volcano plot</div>
              <p className="mt-1 text-ink-soft text-[0.86rem] leading-[1.5]">
                Every gene in one view: how much it changes between groups, and how strong the evidence is. The strongest
                genes are labelled.
              </p>
            </figcaption>
          </figure>
          <figure className="rounded-2xl border border-black/[0.07] bg-cream-50 p-6">
            <ExpressionHeatmap />
            <figcaption className="mt-4">
              <div className="font-display text-[1.05rem] tracking-tightest text-ink">Expression heatmap</div>
              <p className="mt-1 text-ink-soft text-[0.86rem] leading-[1.5]">
                The top changing genes across every sample, showing how consistently each group behaves.
              </p>
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {READING_GUIDE.map((r) => (
            <div key={r.label} className="rounded-xl border border-black/[0.06] bg-cream-50 p-4">
              <div className="text-[0.78rem] font-medium tracking-[0.04em] uppercase text-navy">{r.label}</div>
              <p className="mt-1.5 text-ink-soft text-[0.88rem] leading-[1.5]">{r.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.78rem] text-ink-muted">Figures shown use simulated data for illustration. They are not results from any client project.</p>
      </Section>

      {/* Evidence */}
      <Section>
        <SectionHead title="Built to hold up" kicker="Evidence" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EVIDENCE.map((e) => (
            <div key={e.title} className="rounded-2xl border border-black/[0.06] bg-cream-50 p-6">
              <GlyphTile name={e.glyph} size="sm" tone="navy" />
              <div className="mt-4 font-display text-[1.1rem] tracking-tightest text-ink">{e.title}</div>
              <p className="mt-1.5 text-ink-soft text-[0.9rem] leading-[1.5]">{e.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/5 p-6 max-w-[80ch]">
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

      {/* Getting started */}
      <Section band="tint">
        <SectionHead title="How to work with us" kicker="Getting started" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 hidden md:block overflow-hidden rounded-2xl border border-black/10">
            <table className="w-full text-left">
              <caption className="sr-only">Ways to work with us, what you provide, and which service stages are included</caption>
              <thead className="bg-cream-200/60">
                <tr>
                  <th scope="col" className="px-5 py-3.5 kicker text-ink">Option</th>
                  <th scope="col" className="px-5 py-3.5 kicker text-ink">You provide</th>
                  <th scope="col" className="px-5 py-3.5 kicker text-ink">Services</th>
                </tr>
              </thead>
              <tbody>
                {WORK_OPTIONS.map((o) => (
                  <tr key={o.option} className="border-t border-black/[0.06] bg-cream-50/60 transition-colors hover:bg-cream-50">
                    <th scope="row" className="px-5 py-4 font-display text-[1rem] font-normal tracking-tightest text-ink">{o.option}</th>
                    <td className="px-5 py-4 text-ink-soft text-[0.9rem] leading-[1.5]">{o.provide}</td>
                    <td className="px-5 py-4 text-ink-soft text-[0.9rem] leading-[1.5]">{o.services}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="lg:col-span-8 md:hidden space-y-3">
            {WORK_OPTIONS.map((o) => (
              <li key={o.option} className="rounded-2xl border border-black/[0.07] bg-cream-50 p-4">
                <div className="font-display text-[1.05rem] tracking-tightest text-ink">{o.option}</div>
                <dl className="mt-2 space-y-1 text-[0.86rem]">
                  <div className="flex gap-2"><dt className="text-ink-muted">You provide:</dt><dd className="text-ink-soft">{o.provide}</dd></div>
                  <div className="flex gap-2"><dt className="text-ink-muted">Services:</dt><dd className="text-ink-soft">{o.services}</dd></div>
                </dl>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-4 rounded-2xl border border-black/[0.06] bg-cream-50 p-6">
            <div className="kicker mb-3 text-ink">What we need from you</div>
            <ul className="space-y-3">
              {WHAT_WE_NEED.map((w) => (
                <li key={w} className="flex gap-3 text-[0.88rem] leading-[1.5] text-ink">
                  <Check />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <ServiceCTA
        service={service}
        title="Have a biomarker question?"
        lede="Tell us about your study and data, and we'll suggest where to start."
        ctaLabel="Partner with us"
        background="biomarkerNetwork"
      />

      <Reveal />
    </main>
  );
}
