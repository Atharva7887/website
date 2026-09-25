import { client, isSanityConfigured } from "./client";
import {
  CAPABILITIES_QUERY,
  RESEARCH_QUERY,
  SITE_SETTINGS_QUERY,
  STATS_QUERY,
  TEAM_QUERY,
} from "./queries";

export type CapabilityDoc = {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  tags?: string[];
  order?: number;
};

export type StatDoc = {
  _id?: string;
  value: string;
  label: string;
  order?: number;
};

export type TeamMemberDoc = {
  _id?: string;
  name: string;
  role: string;
  bio?: string;
  accent?: "navy" | "gold";
  /**
   * Group values:
   * - "Leadership" / "Science & Engineering" — current schema
   * - "leadership" / "team" — legacy values (still tolerated; matched case-insensitively)
   */
  group?: string;
  order?: number;
  image?: { asset?: { _ref?: string } } | null;
  linkedinUrl?: string;
};

export type EmailEntry = { label: string; address: string };
export type SocialLink = { label: string; url: string };

export type SiteSettings = {
  emailAddresses?: EmailEntry[];
  officeAddress?: string;
  addressLink?: string;
  phone?: string;
  socialLinks?: SocialLink[];
  careersStatus?: string;
};

export type ResearchCategory = "Benchmark" | "Whitepaper" | "Case Study";

export type ResearchEntryDoc = {
  _id?: string;
  title: string;
  authors?: string;
  abstract?: string;
  category: ResearchCategory;
  date?: string; // ISO date e.g. "2026-04-15"
  venue?: string;
  featured?: boolean;
  pdfUrl?: string | null;
};

/* -------------------------- Defaults (offline-safe) ------------------------- */

const DEFAULT_CAPABILITIES: CapabilityDoc[] = [
  {
    title: "Structure Prediction",
    description:
      "Atom-level structure inference for antibodies, nanobodies, and their complexes, built on AlphaFold 3, Boltz-2 and our internal benchmarks.",
    tags: ["AlphaFold 3", "Boltz-2", "ABodyBuilder3"],
    order: 1,
  },
  {
    title: "Generative Design",
    description:
      "Epitope-targeted design of new antibody and nanobody binders where no starting sequence exists, anchored by our Germinal pipeline.",
    tags: ["Germinal", "RFdiffusion", "AbMPNN"],
    order: 2,
  },
  {
    title: "Lead Optimization",
    description:
      "Affinity maturation from a validated parent antibody, ranked through ML scoring and physics-based docking rather than a blind screen.",
    tags: ["CatBoost", "ESM-2", "MM-GBSA"],
    order: 3,
  },
  {
    title: "Foundation Modeling",
    description:
      "Fine-tuning of antibody-specific language models on sequence, structure, and repertoire data, owned end-to-end.",
    tags: ["AbLang", "IgLM", "ESM-2"],
    order: 4,
  },
];

const DEFAULT_STATS: StatDoc[] = [
  { value: "10¹³", label: "Possible sequences in the human antibody repertoire", order: 1 },
  { value: "Millions", label: "Candidates typically screened per discovery campaign", order: 2 },
  { value: "12yr", label: "Average bench-to-bedside timeline today", order: 3 },
];

/* Research defaults are *only* used when Sanity isn't configured at all
   (i.e. no projectId env var). When Sanity is configured but returns no
   docs, the page will render its own "no research published yet" empty state. */
const DEFAULT_RESEARCH: ResearchEntryDoc[] = [
  {
    category: "Benchmark",
    title:
      "Benchmarking AlphaFold 3 vs. Specialist Folders on Antibody-Antigen Complexes",
    authors: "IndiskaAI Research",
    venue: "Internal technical report",
    date: "2026-04-15",
    abstract:
      "We compare AlphaFold 3 against specialist antibody-structure models on a held-out set of 142 published Ab-Ag complexes, measured by interface DockQ, CDR-H3 accuracy, and binding-mode classification.",
  },
  {
    category: "Benchmark",
    title:
      "Boltz-2 Pose Recovery on a Targeted Kinase Set vs. Industrial Docking Stacks",
    authors: "IndiskaAI Research",
    venue: "Internal technical report",
    date: "2026-02-08",
    abstract:
      "Pose-recovery and pose-ranking comparison of Boltz-2 against three production docking pipelines across a curated 84-target kinase set with co-crystal ground truth.",
  },
  {
    category: "Whitepaper",
    title:
      "From Sequence to Therapeutic: A Reference Pipeline for Generative Discovery",
    authors: "IndiskaAI",
    venue: "Whitepaper",
    date: "2025-09-30",
    abstract:
      "A short reference architecture for closed-loop generative discovery: target hypothesis, structural modeling, pocket-conditioned generation, FEP-aware optimization, and developability filtering.",
  },
];

const DEFAULT_TEAM: TeamMemberDoc[] = [
  {
    name: "Jaspal Patil",
    role: "Founder & CEO",
    bio: "20+ years across pharmaceutical sciences, biomedical research, and drug discovery. Building IndiskaAI at the intersection of AI, computational biology, and therapeutic development.",
    accent: "navy",
    group: "leadership",
    order: 1,
    linkedinUrl: "https://in.linkedin.com/in/jaspalpatil",
  },
  {
    name: "—",
    role: "Founding Scientist (Open)",
    bio: "Hiring. If you've shipped at the intersection of generative AI and therapeutic discovery, write to us.",
    accent: "gold",
    group: "team",
    order: 2,
  },
  {
    name: "—",
    role: "Research Scientist (Open)",
    bio: "Hiring. Structural biology background, comfort with modern structure prediction and physics-aware refinement.",
    accent: "navy",
    group: "team",
    order: 3,
  },
  {
    name: "—",
    role: "ML Engineer (Open)",
    bio: "Hiring. Deep PyTorch, distributed training, and an instinct for empirical rigor.",
    accent: "gold",
    group: "team",
    order: 4,
  },
];

/* ------------------------------ Fetchers ----------------------------------- */

async function safeFetch<T>(query: string, fallback: T[]): Promise<T[]> {
  if (!isSanityConfigured || !client) return fallback;
  try {
    const result = await client.fetch<T[]>(query, {}, { next: { revalidate: 60 } });
    if (!result || result.length === 0) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

export function getCapabilities() {
  return safeFetch<CapabilityDoc>(CAPABILITIES_QUERY, DEFAULT_CAPABILITIES);
}

export function getStats() {
  return safeFetch<StatDoc>(STATS_QUERY, DEFAULT_STATS);
}

export function getTeamMembers() {
  return safeFetch<TeamMemberDoc>(TEAM_QUERY, DEFAULT_TEAM);
}

/* -------------------------------- Site settings -------------------------------- */

const DEFAULT_SETTINGS: Required<SiteSettings> = {
  emailAddresses: [
    { label: "General", address: "hello@indiskaai.com" },
    { label: "Partnerships", address: "partner@indiskaai.com" },
    { label: "Careers", address: "careers@indiskaai.com" },
    { label: "Research", address: "research@indiskaai.com" },
  ],
  officeAddress:
    "Office No. 1001, Gaurav Icon Tower,\nOpposite Tip Top Hotel, Wakad,\nPune - 411057, Maharashtra, India",
  addressLink: "",
  phone: "+91 7397967203",
  socialLinks: [
    { label: "LinkedIn", url: "#" },
    { label: "X / Twitter", url: "#" },
    { label: "Careers", url: "/careers" },
  ],
  careersStatus: "",
};

/**
 * Settings fetcher. Defensive merge with defaults so any missing field — or
 * a deleted field in Sanity — never breaks the footer or pages that depend
 * on contact info.
 */
export async function getSiteSettings(): Promise<Required<SiteSettings>> {
  if (!isSanityConfigured || !client) return DEFAULT_SETTINGS;
  try {
    const result = await client.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    if (!result) return DEFAULT_SETTINGS;
    return {
      emailAddresses:
        result.emailAddresses && result.emailAddresses.length > 0
          ? result.emailAddresses
          : DEFAULT_SETTINGS.emailAddresses,
      officeAddress: result.officeAddress || DEFAULT_SETTINGS.officeAddress,
      addressLink: result.addressLink || DEFAULT_SETTINGS.addressLink,
      phone: result.phone || DEFAULT_SETTINGS.phone,
      socialLinks:
        result.socialLinks && result.socialLinks.length > 0
          ? result.socialLinks
          : DEFAULT_SETTINGS.socialLinks,
      careersStatus: result.careersStatus || DEFAULT_SETTINGS.careersStatus,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Looks up an email by label (case-insensitive). Falls back to the first
 * configured email, then to a hardcoded default — so pages always have a
 * mailto: target even if Sanity is misconfigured.
 */
export function emailFor(
  settings: Pick<SiteSettings, "emailAddresses">,
  label: string
): string {
  const all = settings.emailAddresses ?? [];
  const match = all.find(
    (e) => e.label?.toLowerCase() === label.toLowerCase()
  );
  return match?.address ?? all[0]?.address ?? "hello@indiskaai.com";
}

/**
 * Research entries — different fallback semantics from the others.
 *
 * - When Sanity is **not** configured: returns DEFAULT_RESEARCH so dev/preview
 *   has placeholder content.
 * - When Sanity **is** configured: returns whatever Sanity has, including an
 *   empty array. The page is responsible for rendering the empty state.
 *
 * Network/CDN errors fall back to DEFAULT_RESEARCH so a transient outage
 * never blanks the page.
 */
export async function getResearchEntries(): Promise<ResearchEntryDoc[]> {
  if (!isSanityConfigured || !client) return DEFAULT_RESEARCH;
  try {
    const result = await client.fetch<ResearchEntryDoc[]>(
      RESEARCH_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    return result ?? [];
  } catch {
    return DEFAULT_RESEARCH;
  }
}
