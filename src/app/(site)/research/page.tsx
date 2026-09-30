import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import {
  emailFor,
  getResearchEntries,
  getSiteSettings,
  type ResearchCategory,
  type ResearchEntryDoc,
} from "../../../../sanity/lib/fetch";
import { isSanityConfigured } from "../../../../sanity/lib/client";

export const metadata: Metadata = {
  title: "Research",
  description:
    "IndiskaAI research notes, internal benchmarks, whitepapers, and case studies.",
};

const pillTone: Record<ResearchCategory, string> = {
  Benchmark: "bg-navy text-cream-100",
  Whitepaper: "bg-ink text-cream-100",
  "Case Study": "bg-gold text-ink",
};

function formatDate(iso?: string) {
  if (!iso) return null;
  // Treat the date as calendar-only — avoid timezone shifts.
  const [y, m] = iso.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (!y || !m) return iso;
  const monthIdx = Number(m) - 1;
  if (monthIdx < 0 || monthIdx > 11) return iso;
  return `${monthNames[monthIdx]} ${y}`;
}

function PdfIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 1 v8" />
      <path d="M3 5.5 L7 9.5 L11 5.5" />
      <path d="M2 12 H12" />
    </svg>
  );
}

function ResearchRow({ entry }: { entry: ResearchEntryDoc }) {
  return (
    <li className="border-b border-black/10 py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        <div className="md:col-span-2">
          <span
            className={`inline-block text-[0.68rem] tracking-[0.18em] uppercase rounded-full px-3 py-1 ${pillTone[entry.category]}`}
          >
            {entry.category}
          </span>
          {entry.date && (
            <div className="kicker mt-4 text-ink-muted">{formatDate(entry.date)}</div>
          )}
          {entry.featured && (
            <div className="kicker mt-2 text-gold-700">Featured</div>
          )}
        </div>

        <div className="md:col-span-7">
          <h2 className="font-display text-[1.6rem] md:text-[2.2rem] leading-[1.1] tracking-tightest text-ink">
            {entry.title}
          </h2>
          {(entry.authors || entry.venue) && (
            <div className="mt-3 text-[0.95rem] text-ink-muted">
              {entry.authors}
              {entry.authors && entry.venue ? " · " : ""}
              {entry.venue && <em className="italic">{entry.venue}</em>}
            </div>
          )}
          {entry.abstract && (
            <p className="mt-5 text-ink-soft leading-[1.65] max-w-[64ch]">
              {entry.abstract}
            </p>
          )}
        </div>

        <div className="md:col-span-3 flex md:justify-end items-start">
          {entry.pdfUrl ? (
            <a
              href={entry.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-ink/15 text-ink rounded-full px-5 py-3 text-[0.9rem] transition-colors hover:bg-ink hover:text-cream-100"
            >
              <PdfIcon />
              Download PDF
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/80 border border-black/5 text-ink-muted text-[0.7rem] tracking-[0.18em] uppercase select-none">
              <span className="block h-1.5 w-1.5 rounded-full bg-gold" />
              Under review
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function EmptyState({ researchEmail }: { researchEmail: string }) {
  return (
    <div className="border border-black/10 rounded-2xl bg-cream-50 px-6 md:px-12 py-16 md:py-24 text-center max-w-3xl mx-auto">
      <div className="kicker mb-4">Research log</div>
      <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
        No research published{" "}
        <span className="italic text-navy">yet.</span>
      </h2>
      <p className="mt-6 text-ink-soft leading-[1.65] max-w-[52ch] mx-auto">
        We post benchmarks, whitepapers, and case studies here as they&apos;re
        ready. Want to be on the list when the next one drops?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={`mailto:${researchEmail}`} className="cta">
          Email {researchEmail}
          <span className="cta-arrow">→</span>
        </a>
        {isSanityConfigured && (
          <a href="/studio" className="cta cta-ghost">
            Publish first entry
          </a>
        )}
      </div>
    </div>
  );
}

const infrastructure: { label: string; value: string; detail: string }[] = [
  {
    label: "Compute",
    value: "NVIDIA A6000 / A5000",
    detail:
      "Multi-GPU clusters running our foundation-model training and structure-prediction jobs.",
  },
  {
    label: "Simulation",
    value: "OpenMM · GROMACS",
    detail:
      "Molecular-dynamics and FEP runs for refinement, binding-affinity estimation, and selectivity analysis.",
  },
  {
    label: "Stack",
    value: "PyTorch · JAX · CUDA",
    detail:
      "Owned ML stack: distributed training, mixed-precision, and reproducible experiment lineage end-to-end.",
  },
];

function TechnicalInfrastructure() {
  return (
    <section className="border-t border-black/10 mt-12 pt-20 md:pt-28 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-4">
          <div className="kicker mb-4">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy mr-2 align-middle" />
            Technical infrastructure
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
            The hardware behind the{" "}
            <span className="italic text-navy">work.</span>
          </h2>
          <p className="mt-5 text-ink-soft leading-[1.6] max-w-[34ch]">
            Our research runs on dedicated compute. Every benchmark you see on
            this page was produced in-house, on infrastructure we own and
            instrument.
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5 rounded-xl overflow-hidden">
          {infrastructure.map((it) => (
            <div
              key={it.label}
              className="bg-cream-100 p-7 md:p-8 hover:bg-cream-50 transition-colors"
            >
              <div className="kicker text-ink-muted mb-3">{it.label}</div>
              <div className="font-display text-[1.4rem] md:text-[1.55rem] leading-[1.1] tracking-tightest text-ink mb-3">
                {it.value}
              </div>
              <p className="text-ink-soft text-[0.94rem] leading-[1.55]">
                {it.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ResearchPage() {
  const [entries, settings] = await Promise.all([
    getResearchEntries(),
    getSiteSettings(),
  ]);
  const researchEmail = emailFor(settings, "Research");
  const showEmptyState = entries.length === 0;

  return (
    <main className="relative">
      <PageHeader
        eyebrow="Research"
        title={
          <>
            Notes from the{" "}
            <span className="italic text-navy">work itself.</span>
          </>
        }
        lede="Internal benchmarks, short technical reports, and case studies from the research desk. We publish what we'd want to read in our own field."
      />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          {showEmptyState ? (
            <EmptyState researchEmail={researchEmail} />
          ) : (
            <ul className="border-t border-black/10">
              {entries.map((entry) => (
                <ResearchRow key={entry._id ?? entry.title} entry={entry} />
              ))}
            </ul>
          )}

          {!showEmptyState && (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-7">
                <h3 className="font-display text-[1.6rem] md:text-[2.2rem] leading-[1.05] tracking-tightest text-ink max-w-[20ch]">
                  Want to be notified when we publish?
                </h3>
              </div>
              <div className="md:col-span-5 md:text-right">
                <a href={`mailto:${researchEmail}`} className="cta">
                  Email {researchEmail}
                  <span className="cta-arrow">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="divider mx-auto max-w-[1400px]" />

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <TechnicalInfrastructure />
        </div>
      </section>
    </main>
  );
}
