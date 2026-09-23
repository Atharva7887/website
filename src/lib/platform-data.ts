import type { IllustrationName } from "@/components/science/Illustrations";

/**
 * IndiskaAI's software products, named pipelines, and computational
 * toolkit — distinct from the antibody library/discovery services in
 * services-data.ts. Shared by the Nav "Platform" dropdown, the
 * /platform hub page, and the /platform/[slug] detail pages.
 *
 * Accuracy notes carried over from the internal product brief this was
 * drafted from (keep these in mind before editing copy):
 * - The lead-optimization pipeline is NOT de novo design. It starts
 *   from an existing, phage-display-validated parent antibody. Never
 *   call it "de novo."
 * - Everything in the lead-optimization pipeline is in-silico to date.
 *   No wet-lab binding data (SPR/BLI/ELISA) exists yet for any
 *   AI-generated candidate. Say "computational" / "in-silico," never
 *   "validated," when describing candidates.
 * - Germinal is the toolkit's one verified, actively-maintained anchor.
 *   The rest of the tool catalog is the team's own account of a
 *   broader toolkit, not individually verified — presented as a
 *   capability catalog, not a claim that every tool is in production.
 */

export type PlatformKind = "product" | "pipeline" | "toolkit";

export type PlatformStage = { title: string; body: string };
export type PlatformProgram = { name: string; body: string };
export type PlatformToolCategory = {
  category: string;
  tools: { name: string; body: string }[];
};

export type PlatformEntry = {
  slug: string;
  title: string;
  kind: PlatformKind;
  kindLabel: string;
  /** Short line — nav dropdown, hub cards, homepage references. */
  summary: string;
  /** Main descriptive paragraph(s) on the detail page. */
  description: string;
  art: IllustrationName;
  artDescription: string;
  capabilities?: string[];
  stages?: PlatformStage[];
  programs?: PlatformProgram[];
  validationNote?: string;
  toolCategories?: PlatformToolCategory[];
};

export const PLATFORM: PlatformEntry[] = [
  {
    slug: "structure-suite",
    title: "IndiskaAI Structure Suite",
    kind: "product",
    kindLabel: "Product",
    summary:
      "A one-click, mostly-offline application for antibody structure and interaction analysis.",
    art: "antibodyAntigen",
    artDescription: "Antibody engaging an antigen at its Fab tips, the kind of complex Structure Suite analyses",
    description:
      "IndiskaAI Structure Suite is a one-click, mostly-offline desktop and web application for antibody structure and interaction analysis. It runs entirely on the local machine except for two capabilities that reach the internet: fetching a structure by PDB ID, and an optional AI-assisted insights panel.",
    capabilities: [
      "Contacts analysis",
      "Filter",
      "CDR classification",
      "Structural comparison (RMSD, TM-score, clash-score benchmarking)",
      "Epitope mapping",
      "Numbering",
      "PDB ↔ CDR mapping",
      "Clustering",
      "Alignment",
      "Mutation engineering",
      "Structure renumbering",
      "Structure QC",
      "Developability profile",
      "Persistent workspace",
      "AI Insights",
    ],
  },
  {
    slug: "antibody-engineering-platform",
    title: "Antibody Engineering Platform",
    kind: "product",
    kindLabel: "Product",
    summary:
      "A single REST API wrapping a suite of sequence and structure design models.",
    art: "sequenceToStructure",
    artDescription: "A sequence resolving into a predicted structure, as the design models behind the API do",
    description:
      "Our Antibody Engineering Platform exposes a suite of sequence and structure design models behind a single REST API, distinct from Structure Suite's analysis and QC focus. It wraps ProteinMPNN, LigandMPNN, AntiFold, Boltz, ESM3, IgLM, AbLang, and Arpeggio-style contact extraction, plus CD-HIT, MMseqs2, and Clustal Omega clustering and an ANARCI numbering endpoint, so design and scoring workflows can be built on top of one consistent interface.",
    capabilities: [
      "ProteinMPNN & LigandMPNN inverse folding",
      "AntiFold antibody-specific design",
      "Boltz & ESM3 structure prediction",
      "IgLM & AbLang sequence generation",
      "Arpeggio-style contact extraction",
      "CD-HIT / MMseqs2 / Clustal Omega clustering",
      "ANARCI numbering endpoint",
    ],
  },
  {
    slug: "mutantgen-platform",
    title: "MutantGen Platform",
    kind: "product",
    kindLabel: "Product",
    summary:
      "Combinatorial mutation generation and large-scale developability scoring.",
    art: "mutationVariant",
    artDescription: "Wild-type and variant sequences compared at a single mutated position",
    description:
      "MutantGen Platform generates combinatorial antibody sequence mutations and screens millions of resulting variants through multi-threaded biochemical filtering (pI, GRAVY, Levenshtein distance), then ranks them with a large-scale ESM-1v and Random Forest developability and ΔΔG scorer. It runs alongside Structure Suite's own Mutation Engineering capability as a separate, higher-throughput tool for exploring much larger variant spaces.",
    capabilities: [
      "Combinatorial mutation generation",
      "Multi-threaded biochemical filtering (pI, GRAVY, Levenshtein distance)",
      "ESM-1v zero-shot mutational scoring",
      "Random Forest developability & ΔΔG prediction",
      "Millions-of-variants scale screening",
    ],
  },
  {
    slug: "lead-optimization-pipeline",
    title: "Antibody Lead Optimization",
    kind: "pipeline",
    kindLabel: "Named Pipeline",
    summary:
      "Computational affinity maturation: starting from a validated parent antibody, not from nothing.",
    art: "leadOptimization",
    artDescription: "A parent antibody diversified into scored variants, with the best-ranked carried forward",
    description:
      "This is not de novo generation. The pipeline starts from an existing, phage-display-validated antibody and computationally diversifies its light chain to find improved binders, closer in spirit to AI-driven lead optimization than to designing a binder from scratch. The same target-agnostic codebase has been rearchitected across five generations (v2 through v6) rather than forked per target; version 5 identified and corrected a real scoring bias in an earlier ML component along the way.",
    programs: [
      {
        name: "CD28",
        body: "A T-cell co-stimulatory receptor. Both agonist and antagonist formats have been explored.",
      },
      {
        name: "IL-2Rβ / CD122",
        body: "Run in parallel to the CD28 program, using the same pipeline.",
      },
    ],
    stages: [
      { title: "Numbering", body: "ANARCI (IMGT scheme) applied to the parent sequence and every generated variant." },
      { title: "Feature extraction", body: "AbLang2 embeddings computed over the numbered sequence." },
      { title: "ML scoring", body: "A CatBoost classifier trained on real NGS phage-panning enrichment data produces a composite score per variant." },
      { title: "Candidate generation", body: "PSSM sampling and ESM-2 masked-LM resampling, seeded from the same phage-display repertoire." },
      { title: "Structure prediction", body: "ABodyBuilder3, AlphaFold2-Multimer, and ESM3 fold each candidate's Fv." },
      { title: "Co-folding against target", body: "Boltz-2 constrained co-folding, scored via Arpeggio-style interchain contact analysis." },
      { title: "Physics-based docking", body: "Schrödinger docking with MM-GBSA rescoring on the top-ranked shortlist." },
      { title: "Developability gates", body: "Humanness, liability, and novelty filters before a candidate advances." },
      { title: "Functional assay (planned)", body: "A Jurkat-Luc reporter assay to confirm agonist vs. antagonist activity, not yet run." },
    ],
    validationNote:
      "Every result to date is in-silico. No wet-lab binding data (SPR, BLI, or ELISA) exists yet for any AI-generated candidate. CD28 has produced a 21-candidate shortlist now under external physics-docking review; IL-2Rβ has one top candidate with a docking-confirmed salt-bridge contact. The only wet-lab-validated sequence anywhere in the pipeline is the original phage-display parent antibody.",
  },
  {
    slug: "de-novo-design-toolkit",
    title: "De Novo Design Toolkit",
    kind: "toolkit",
    kindLabel: "Computational Toolkit",
    summary:
      "Epitope-targeted generation of new binders where no starting antibody exists.",
    art: "deNovoDesign",
    artDescription: "A target epitope feeding a generative model that proposes candidate binders",
    description:
      "Where the lead-optimization pipeline improves an existing antibody, this toolkit designs new binders against a specified epitope with no starting sequence at all. Its verified, actively-maintained anchor is Germinal: a three-step process (hallucination via ColabDesign, selective sequence redesign via AbMPNN, and cofolding against the target via AlphaFold3, Chai, or Protenix) used to design epitope-targeted nanobodies and scFvs. The broader tool categories below reflect the team's wider computational toolkit, used across multiple programs rather than tied to one pipeline; treat this as a capability catalog rather than a claim that every tool listed is in simultaneous production use.",
    toolCategories: [
      {
        category: "Sequence processing",
        tools: [
          { name: "ANARCI", body: "Numbers antibody sequences using IMGT, Chothia, Kabat." },
          { name: "ANARCII", body: "Alignment-free antibody/TCR numbering." },
          { name: "SCALOP", body: "Canonical loop structure annotation." },
        ],
      },
      {
        category: "NGS processing",
        tools: [
          { name: "MMseqs2", body: "Fast clustering of large NGS FASTA sets." },
          { name: "IgBLAST", body: "Germline alignment and immune repertoire annotation." },
          { name: "MiXCR", body: "V(D)J repertoire processing and clonotype analysis." },
          { name: "CD-HIT", body: "Sequence clustering and redundancy removal." },
        ],
      },
      {
        category: "Embeddings & language models",
        tools: [
          { name: "AntiBERTy", body: "Antibody language model for embeddings and filtering." },
          { name: "IgLM", body: "Synthetic antibody sequence generation." },
          { name: "ESM-2", body: "General protein embeddings; supports structure-aware tasks in some workflows." },
          { name: "ESM-1v", body: "Zero-shot mutational effect prediction." },
          { name: "p-IgGen", body: "Paired antibody sequence generation." },
        ],
      },
      {
        category: "Structure prediction",
        tools: [
          { name: "IgFold", body: "Fast Fv folding." },
          { name: "ABodyBuilder3 / ABodyBuilder2", body: "Antibody (and TCR/BCR, v3) structure prediction." },
          { name: "NanoBodyBuilder2", body: "Nanobody/VHH structure prediction." },
          { name: "Boltz-2", body: "Biomolecular complex folding." },
          { name: "Chai-1", body: "Multimodal biomolecular complex prediction." },
          { name: "AlphaFold 2 / 3", body: "Monomer/multimer folding; complex- and ligand-aware prediction (v3)." },
        ],
      },
      {
        category: "Developability & humanization",
        tools: [
          { name: "TAP", body: "Therapeutic Antibody Profiler." },
          { name: "Humatch / Hu-mAb", body: "Antibody humanization and humanization proposals." },
          { name: "BioPhi", body: "Humanization and developability optimization." },
        ],
      },
      {
        category: "Design & inverse folding",
        tools: [
          { name: "AntiFold", body: "Antibody-specific inverse folding." },
          { name: "ProteinMPNN", body: "General inverse folding." },
          { name: "RFdiffusion", body: "De novo structural generation." },
        ],
      },
      {
        category: "Docking",
        tools: [
          { name: "HADDOCK 3", body: "Information-driven flexible docking." },
          { name: "SnugDock", body: "High-resolution antibody-antigen docking." },
          { name: "ClusPro Antibody Mode", body: "Antibody-antigen docking." },
        ],
      },
      {
        category: "Thermodynamics & MD",
        tools: [
          { name: "OpenMM", body: "GPU-accelerated relaxation and molecular dynamics." },
          { name: "GROMACS", body: "High-performance MD simulation." },
          { name: "FoldX", body: "Fast mutational ΔΔG estimation." },
          { name: "Rosetta ddG", body: "Mutation stability scoring." },
        ],
      },
    ],
  },
  {
    slug: "genomics-biomarkers",
    title: "Genomics & Biomarkers",
    kind: "toolkit",
    kindLabel: "Computational Toolkit",
    summary:
      "Biomarker identification, MD simulations, interaction analysis, docking, and germline analysis.",
    art: "biomarkerNetwork",
    artDescription: "A correlation network of molecular features with a prioritised cluster",
    description:
      "Alongside our antibody work, we run computational genomics and biomarker pipelines: biomarker identification, molecular dynamics simulations, interaction analysis, docking, and germline analysis. This capability area is newer than our antibody pipelines and is presented here at a summary level while the team documents it in the same depth as the lead-optimization pipeline and de novo toolkit above.",
    capabilities: [
      "Biomarker identification",
      "Molecular dynamics (MD) simulations",
      "Interaction analysis",
      "Docking",
      "Germline analysis",
    ],
  },
];

export function getPlatformEntry(slug: string): PlatformEntry | undefined {
  return PLATFORM.find((p) => p.slug === slug);
}

export const PLATFORM_PRODUCTS = PLATFORM.filter((p) => p.kind === "product");
export const PLATFORM_PIPELINES = PLATFORM.filter((p) => p.kind === "pipeline");
export const PLATFORM_TOOLKITS = PLATFORM.filter((p) => p.kind === "toolkit");
