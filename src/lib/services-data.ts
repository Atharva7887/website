import type { IllustrationName } from "@/components/science/Illustrations";
import type { GlyphName } from "@/components/science/Glyphs";
import type { StoryFrame } from "@/components/science/MotionStory";
import type { ExternalVideo } from "@/components/ExternalVideoCard";
import type { MediaId } from "@/lib/media";

/**
 * IndiskaAI's service lines. Shared by the Nav "Services" dropdown, the
 * /services hub page, and the /services/[slug] detail pages.
 *
 * Copy discipline (deliberate — please keep it):
 * - Pages are built SHOW → EXPLAIN → GUIDE. Every card, step, input and
 *   deliverable carries a glyph or illustration; text is one sentence.
 * - If a section looks empty, add a visual, not a paragraph.
 *
 * Accuracy notes (keep these in mind before editing copy):
 * - Everything here is computational. We do not run a wet lab, hold clinical
 *   accreditation, or issue diagnostic results — never imply otherwise, and
 *   never quote turnaround times or accuracy figures.
 * - Structure prediction yields candidate models; docking yields candidate
 *   poses; MD describes behaviour over a simulated trajectory. None of the
 *   three is experimental proof of binding. The hedging is deliberate.
 * - Sparklines, story frames and comparison charts are schematic, never
 *   plotted from real runs, and are labelled as such in the UI.
 * - `videos` must only hold embeddable videos on their owner's channel with
 *   credit — see ExternalVideoCard.
 */

export type ServiceGroup = "discovery" | "computational" | "programs";

export type ServiceStep = {
  title: string;
  body?: string;
  glyph?: GlyphName;
  art?: IllustrationName;
};

export type ServiceCard = {
  title: string;
  subtitle?: string;
  body: string;
  illustration?: IllustrationName;
  glyph?: GlyphName;
  /** Tiny visual chain under the figure, e.g. ["Reads", "Lineages", "Candidates"]. */
  path?: string[];
};

export type ServiceCardGroup = {
  id: string;
  label: string;
  lede?: string;
  /** "glyph" renders an icon tile instead of a full illustration. */
  variant?: "illustrated" | "glyph";
  cards: ServiceCard[];
};

export type ServiceAnalysis = { name: string; meaning: string; spark?: string };
export type ServiceHighlight = { value: string; label: string; body: string; glyph?: GlyphName };
export type ServiceItem = { title: string; glyph: GlyphName };

/**
 * Section keys for the detail page. Pages set their own order so they don't
 * all read as the same template; `cards:<id>` places one card group.
 */
export type SectionKey =
  | "intro"
  | "story"
  | "real"
  | "flow"
  | `cards:${string}`
  | "highlights"
  | "workflow"
  | "analyses"
  | "comparison"
  | "closingFlow"
  | "io"
  | "applications"
  | "gettingStarted"
  | "videos"
  | "faq"
  | "note";

export type ServiceEntry = {
  slug: string;
  title: string;
  /** One line — cards, nav dropdown, hero lede. */
  summary: string;
  /** One or two sentences. Never a paragraph. */
  description: string;
  group: ServiceGroup;
  /** Original SVG illustration used on the hub card. */
  art: IllustrationName;
  artDescription: string;
  /** Short looping schematic "video" — in the hero, or as a section when `heroMedia` takes the hero. */
  story?: { label: string; description: string; frames: StoryFrame[] };
  /** A real-data visual (PDB render / project video) for the hero. */
  heroMedia?: MediaId;
  /** Real-structure rows, rendered image-beside-text and alternating sides. */
  realImages?: { media: MediaId; kicker: string; title: string; body: string }[];
  /** Page has its own route under app/(site)/services; excluded from [slug]. */
  custom?: boolean;
  significance?: string;
  significanceLabel?: string;
  flow?: ServiceStep[];
  flowLabel?: string;
  cardGroups?: ServiceCardGroup[];
  workflow?: ServiceStep[];
  workflowLabel?: string;
  analyses?: ServiceAnalysis[];
  analysesLabel?: string;
  comparison?: { label: string; lede: string };
  closingFlow?: { label: string; steps: ServiceStep[]; body: string };
  applications?: string[];
  inputs?: ServiceItem[];
  deliverables?: ServiceItem[];
  highlights?: ServiceHighlight[];
  highlightsLabel?: string;
  faqs?: { q: string; a: string }[];
  videos?: ExternalVideo[];
  note?: string;
  gettingStarted?: ServiceStep[];
  ctaLabel?: string;
  layout?: SectionKey[];
};

const STANDARD_START: ServiceStep[] = [
  { title: "Share your starting point", body: "Target, structures, sequences, or data — whatever you already have.", glyph: "share" },
  { title: "Define the question", body: "We agree what decision the analysis needs to inform.", glyph: "objective" },
  { title: "Receive decision-ready outputs", body: "Results, figures, and a report stating what they do and don't show.", glyph: "report" },
];

export const SERVICES: ServiceEntry[] = [
  {
    slug: "ai-assisted-antibody-libraries",
    title: "AI-Assisted Antibody Libraries",
    group: "discovery",
    art: "libraryDiversity",
    artDescription: "Repertoire of sequence variants shown as a bar distribution, with a few prioritised",
    summary: "Explore diverse antibody sequence space with computational design.",
    description:
      "Libraries designed and quality-controlled computationally, then read back by sequencing. Diversity is shaped deliberately rather than left to the construction protocol.",
    story: {
      label: "Sequence space",
      description: "Sequence diversity narrowing through computational screening to a few prioritised candidates",
      frames: [
        { art: "libraryDiversity", title: "Sequence diversity", caption: "The library is characterised across the whole repertoire." },
        { art: "screeningFunnel", title: "Search the space", caption: "Computational filters narrow what is worth screening." },
        { art: "leadOptimization", title: "Prioritise leads", caption: "The strongest candidates are carried forward with their data." },
      ],
    },
    significanceLabel: "Why libraries matter",
    significance: "The library is the search space — its diversity sets the ceiling on what any screen can find.",
    flowLabel: "From diversity to leads",
    flow: [
      { title: "Sequence diversity", body: "Designed variation across the CDRs.", art: "libraryDiversity", glyph: "library" },
      { title: "Search space", body: "Diversity checked, not assumed.", art: "sampleMatrix", glyph: "search" },
      { title: "Candidate discovery", body: "Screens draw on a well-characterised pool.", art: "screeningFunnel", glyph: "candidate" },
      { title: "Lead prioritisation", body: "Sequencing data ranks what comes back.", art: "leadOptimization", glyph: "lead" },
    ],
    gettingStarted: [
      { title: "Share target / starting data", body: "Target class, format, and any prior sequences.", glyph: "share" },
      { title: "Define the discovery objective", body: "We scope diversity strategy and quality checks around it.", glyph: "objective" },
      { title: "Explore prioritised candidates", body: "The library arrives with its characterisation data.", glyph: "shortlist" },
    ],
    realImages: [
      {
        media: "iggVariable",
        kicker: "On a real antibody",
        title: "Diversity lives at the tips.",
        body: "Library variation is designed into the variable domains — gold here — where the antibody meets its antigen. The constant regions stay fixed.",
      },
    ],
    layout: ["intro", "real", "flow", "gettingStarted", "note"],
    ctaLabel: "Talk to us about a library",
  },
  {
    slug: "antibody-discovery",
    title: "Antibody Discovery",
    group: "discovery",
    art: "antibodyAntigen",
    artDescription: "Y-shaped antibody engaging an antigen at the tips of both Fab arms",
    summary: "Identify promising candidates against challenging targets.",
    description:
      "Pipelines that combine libraries, sequencing, and computational analysis. The route is chosen to match the starting material you already have.",
    story: {
      label: "Discovery, in four frames",
      description: "Sequence diversity, computational screening, modelled binding, and a lead carried forward",
      frames: [
        { art: "libraryDiversity", title: "Sequence diversity", caption: "Start from a broad, characterised repertoire." },
        { art: "screeningFunnel", title: "AI screening", caption: "Models rank sequences before anything is tested." },
        { art: "antibodyAntigen", title: "Candidates", caption: "Shortlisted binders are modelled against the antigen." },
        { art: "singleLead", title: "Lead", caption: "One well-evidenced lead moves forward." },
      ],
    },
    cardGroups: [
      {
        id: "pathways",
        label: "Five ways a programme can start",
        lede: "Pick the card that looks like what you have today.",
        cards: [
          { title: "Single Lead", subtitle: "One sequence", body: "One sequence seeds variant generation and ranking.", illustration: "singleLead", path: ["Sequence", "Variants", "Lead"] },
          { title: "Lead Optimization Data", subtitle: "Prior campaign data", body: "Existing variant or enrichment data informs the next designs.", illustration: "leadOptimization", path: ["Parent", "Variants", "Optimised"] },
          { title: "NGS Data", subtitle: "Sequencing datasets", body: "Repertoire or panning output is clustered and mined for lineages.", illustration: "sequencingReads", path: ["Reads", "Diversity", "Candidates"] },
          { title: "De Novo", subtitle: "No starting antibody", body: "Binders are generated computationally against a specified epitope.", illustration: "deNovoDesign", path: ["Target", "Generation", "Candidates"] },
          { title: "Epitope Identification", subtitle: "Epitope-focused", body: "The antigen surface is mapped first, then design is aimed at it.", illustration: "epitopeMap", path: ["Surface", "Regions", "Epitope"] },
        ],
      },
    ],
    heroMedia: "antibodyVideo",
    realImages: [
      {
        media: "iggAntibody",
        kicker: "The molecule we engineer",
        title: "Four chains, two binding sites.",
        body: "Two heavy chains (navy) and two light chains (pale blue) form each antibody. Discovery works on the variable ends of both arms; everything downstream depends on getting those right.",
      },
    ],
    gettingStarted: STANDARD_START,
    layout: ["cards:pathways", "story", "real", "intro", "gettingStarted", "note"],
    note: "These are the computational entry points our pipelines accept. What gets validated experimentally, and by whom, is agreed per programme.",
  },
  {
    slug: "ai-antibody-data-packages",
    title: "AI Antibody Data Packages",
    group: "discovery",
    art: "leadOptimization",
    artDescription: "A parent sequence branching into scored variants, with the best-ranked one carried forward",
    summary: "AI-driven antibody data for better-informed discovery decisions.",
    description:
      "Sequence data, computational analysis, and ranking delivered as one package. Built to complement experimental workflows, not replace them.",
    significanceLabel: "Why packages",
    significance: "A ranking is only useful when the criteria behind it are explicit — so they ship with the data.",
    flowLabel: "What a package contains",
    flow: [
      { title: "Sequence data", body: "Curated antibody sequences in scope.", glyph: "sequence" },
      { title: "Computational analysis", body: "Structural and sequence-level assessment.", glyph: "structure" },
      { title: "Ranking", body: "Candidates ordered on stated criteria.", glyph: "rank" },
      { title: "Packaged dataset", body: "Versioned, documented, ready to use.", glyph: "data" },
    ],
    deliverables: [
      { title: "Annotated sequence set", glyph: "sequence" },
      { title: "Ranked candidate table", glyph: "table" },
      { title: "Method & criteria notes", glyph: "report" },
    ],
    gettingStarted: STANDARD_START,
    layout: ["intro", "flow", "io", "gettingStarted", "note"],
    note: "Rankings are computational and reflect the stated criteria; they are inputs to experimental prioritisation, not measured affinities.",
  },
  {
    slug: "structural-analysis",
    title: "Structural Analysis",
    group: "computational",
    art: "sequenceToStructure",
    artDescription: "A residue sequence folding into an alpha-helical structure",
    summary: "Sequence to structure to interaction — a staged workflow.",
    description:
      "A staged pipeline, not one technique. Each stage answers something the previous one cannot, and each carries its own assumptions.",
    significanceLabel: "Why stages matter",
    significance: "Treating prediction, docking, and simulation as interchangeable is the most common way structural work goes wrong.",
    story: {
      label: "Sequence to insight",
      description: "A sequence folding into a model, docked with a partner, simulated, and analysed residue by residue",
      frames: [
        { art: "sequenceToStructure", title: "Predict", caption: "A sequence becomes candidate models with confidence attached." },
        { art: "dockingPoses", title: "Dock", caption: "Candidate binding orientations are sampled and ranked." },
        { art: "trajectoryMotion", title: "Simulate", caption: "MD tests whether the arrangement holds over time." },
        { art: "interfaceMap", title: "Analyse", caption: "Contacts are enumerated residue by residue." },
      ],
    },
    flowLabel: "The pipeline",
    flow: [
      { title: "Sequence", body: "The starting input, as supplied.", art: "fastqFile", glyph: "sequence" },
      { title: "Structural prediction", body: "Candidate models with per-residue confidence.", art: "sequenceToStructure", glyph: "model" },
      { title: "Molecular docking", body: "How two molecules might associate.", art: "dockingPoses", glyph: "dock" },
      { title: "Molecular dynamics", body: "Whether the complex holds up over time.", art: "trajectoryMotion", glyph: "trajectory" },
      { title: "Interaction analysis", body: "Which residues define the interface.", art: "interfaceMap", glyph: "map" },
      { title: "Research insight", body: "What to test next, and why.", art: "researchWorkflow", glyph: "lead" },
    ],
    applications: ["Drug discovery", "Biologics", "Antibody engineering", "Protein engineering", "Structure-based design"],
    inputs: [
      { title: "Sequence(s) or structure files", glyph: "sequence" },
      { title: "Partner molecule, if any", glyph: "complex" },
      { title: "The question to answer", glyph: "objective" },
    ],
    deliverables: [
      { title: "Candidate models + confidence", glyph: "model" },
      { title: "Ranked poses & complexes", glyph: "rank" },
      { title: "Trajectories (if MD in scope)", glyph: "trajectory" },
      { title: "Residue interaction tables", glyph: "table" },
      { title: "Structural visualisations", glyph: "visualise" },
      { title: "Analysis report", glyph: "report" },
    ],
    realImages: [
      {
        media: "fabLysozyme",
        kicker: "What interaction analysis shows",
        title: "The interface, residue by residue.",
        body: "On this antibody–lysozyme complex, every residue within 4.5 Å of the partner is gold — the epitope on one side, the paratope on the other. This is the level our interaction tables report.",
      },
    ],
    layout: ["flow", "intro", "real", "io", "applications", "note"],
    note: "Prediction produces candidate models; docking and MD ask different questions of them. Neither establishes biological truth on its own — results are computational evidence for experimental follow-up.",
    ctaLabel: "Talk to our computational biology team",
  },
  {
    slug: "molecular-docking",
    title: "Molecular Docking",
    group: "computational",
    art: "proteinProtein",
    artDescription: "Two protein surfaces meeting along a complementary interface with contact points marked",
    summary: "Candidate binding poses and interface maps, ranked and explained.",
    description:
      "Structure-based docking to predict candidate binding poses and characterise interfaces. It generates and ranks structural hypotheses — not evidence that binding occurs.",
    story: {
      label: "Protein meets partner",
      description: "A ligand approaching a pocket, candidate poses sampled, one pose selected, and its interface mapped",
      frames: [
        { art: "ligandApproach", title: "Approach", caption: "Partner and target are prepared and brought together." },
        { art: "dockingPoses", title: "Candidate poses", caption: "Orientations are sampled across the site, then ranked." },
        { art: "proteinSmallMolecule", title: "Selected pose", caption: "A shortlisted pose, sitting in the pocket." },
        { art: "interfaceMap", title: "Interface highlighted", caption: "The residues across the interface, mapped." },
      ],
    },
    cardGroups: [
      {
        id: "why",
        label: "Why docking?",
        variant: "glyph",
        cards: [
          { title: "Binding orientation", body: "How a partner could plausibly sit in the site.", glyph: "orientation" },
          { title: "Interface exploration", body: "Pockets, patches, and epitope regions characterised.", glyph: "pocket" },
          { title: "Interaction mapping", body: "The residues that sit across the interface.", glyph: "interaction" },
          { title: "Candidate comparison", body: "Rank a design series before committing to testing.", glyph: "compare" },
        ],
      },
      {
        id: "types",
        label: "Docking types",
        lede: "Six system types, each with its own sampling and scoring considerations.",
        cards: [
          { title: "Protein–Small Molecule", body: "Pocket-directed docking with interaction breakdown.", illustration: "proteinSmallMolecule" },
          { title: "Protein–Protein", body: "Association modes and interface characterisation.", illustration: "proteinProtein" },
          { title: "Antibody–Antigen", body: "CDR-aware docking of the paratope–epitope interface.", illustration: "antibodyAntigen" },
          { title: "Protein–Peptide", body: "Flexible docking where backbone freedom matters.", illustration: "proteinPeptide" },
          { title: "Protein–DNA", body: "Duplex association with groove and electrostatic contacts.", illustration: "proteinDNA" },
          { title: "Protein–RNA", body: "Association that allows for RNA flexibility.", illustration: "proteinRNA" },
        ],
      },
      {
        id: "specialised",
        label: "Specialised analysis",
        variant: "glyph",
        cards: [
          { title: "Residue interaction analysis", body: "Per-residue contacts, by type.", glyph: "residues" },
          { title: "Hotspot analysis", body: "Residues that dominate the interface.", glyph: "hotspot" },
          { title: "Epitope / paratope mapping", body: "The surfaces each partner engages.", glyph: "epitope" },
          { title: "Interface analysis", body: "Shape, burial, and complementarity.", glyph: "interface" },
          { title: "SAR interpretation", body: "Where applicable, across a ligand series.", glyph: "sar" },
          { title: "AlphaFold model assessment", body: "Where applicable, before docking into a model.", glyph: "model" },
        ],
      },
    ],
    workflowLabel: "Our workflow",
    workflow: [
      { title: "Structure preparation", body: "Cleaned, protonated, assessed.", glyph: "prep" },
      { title: "Docking", body: "Poses sampled across the site.", glyph: "dock" },
      { title: "Ranking & clustering", body: "Poses grouped into binding modes.", glyph: "cluster" },
      { title: "Candidate selection", body: "Score, population, plausibility.", glyph: "select" },
      { title: "Interaction analysis", body: "Each pose broken into contacts.", glyph: "interaction" },
      { title: "Visualisation", body: "Complexes and key contacts.", glyph: "visualise" },
      { title: "Report", body: "Methods, results, limitations.", glyph: "report" },
    ],
    analysesLabel: "What we analyse",
    analyses: [
      { name: "Binding pose", meaning: "Candidate orientation", spark: "arc" },
      { name: "Docking score", meaning: "Ranking distribution", spark: "steps" },
      { name: "Hydrogen bonds", meaning: "Donor–acceptor contacts", spark: "spiky" },
      { name: "Salt bridges", meaning: "Charged-pair contacts", spark: "steps" },
      { name: "Hydrophobic contacts", meaning: "Non-polar packing", spark: "flat" },
      { name: "Buried surface", meaning: "Interface area", spark: "rise" },
    ],
    closingFlow: {
      label: "Docking and MD together",
      steps: [
        { title: "Docking", glyph: "dock" },
        { title: "Candidate poses", glyph: "pose" },
        { title: "Molecular dynamics", glyph: "trajectory" },
        { title: "Interaction persistence", glyph: "persist" },
      ],
      body: "Docking proposes poses; simulation tests whether they hold. MD does not automatically validate a pose.",
    },
    applications: ["Drug discovery", "Biologics", "Antibody engineering", "Peptide therapeutics", "Protein engineering", "Molecular recognition"],
    inputs: [
      { title: "Target structure or sequence", glyph: "structure" },
      { title: "Partner(s): ligand, protein, peptide, nucleic acid", glyph: "complex" },
      { title: "Known site or residues, if any", glyph: "target" },
    ],
    deliverables: [
      { title: "Ranked poses", glyph: "rank" },
      { title: "Complex structures", glyph: "complex" },
      { title: "Interaction tables", glyph: "table" },
      { title: "Interface maps", glyph: "map" },
      { title: "Visualisations", glyph: "visualise" },
      { title: "Analysis report", glyph: "report" },
    ],
    faqs: [
      { q: "Is a docking score a binding affinity?", a: "No. Scores rank poses within a run; they are not affinities and shouldn't be compared across systems." },
      { q: "Can you dock into a predicted structure?", a: "Yes, after assessing model confidence around the site — low-confidence regions are flagged before docking." },
      { q: "When should MD follow docking?", a: "When the decision depends on whether a pose is maintained, or when several poses score similarly." },
    ],
    heroMedia: "proteaseLigand",
    realImages: [
      {
        media: "barnaseBarstar",
        kicker: "Protein–protein",
        title: "Two surfaces, one interface.",
        body: "Barnase and barstar, a textbook tight complex. Gold marks the residues each partner buries against the other — what an interface map summarises for a docked pose.",
      },
      {
        media: "fabLysozyme",
        kicker: "Antibody–antigen",
        title: "Epitope and paratope.",
        body: "For antibodies, the question is which antigen surface the CDRs engage. Docking proposes it; the contacts are then enumerated so the result is interpretable, not just a score.",
      },
    ],
    layout: ["cards:why", "story", "cards:types", "real", "workflow", "cards:specialised", "analyses", "closingFlow", "io", "applications", "faq", "note"],
    note: "A high-scoring pose is a structural hypothesis, not a demonstration that two molecules bind, and docking scores are not affinities.",
    ctaLabel: "Talk to our computational biology team",
  },
  {
    slug: "molecular-dynamics",
    title: "Molecular Dynamics Simulation",
    group: "computational",
    art: "trajectoryMotion",
    artDescription: "A protein complex in motion above a sampled trajectory trace with a travelling marker",
    summary: "From static poses to dynamic behaviour.",
    description:
      "GPU-accelerated simulation of stability and interaction persistence. A docked pose is a single frame; a trajectory shows whether it holds together.",
    story: {
      label: "Static pose to trajectory",
      description: "A static complex set in motion, sampled over a trajectory, with persistent contacts separated from transient ones",
      frames: [
        { art: "proteinSmallMolecule", title: "Static complex", caption: "A docked pose: one frame, no time." },
        { art: "trajectoryMotion", title: "Trajectory", caption: "The system moves under a force field; the trace samples the run." },
        { art: "contactPersistence", title: "Interaction persistence", caption: "Some contacts hold; others fade early." },
        { art: "energyLandscape", title: "Energetics", caption: "Where appropriate, end-state estimates compare candidates." },
      ],
    },
    significanceLabel: "Why molecular dynamics?",
    significance: "A static structure can't tell a persistent interaction from one that merely looks right in a single frame.",
    flowLabel: "The conceptual step",
    flow: [
      { title: "Static", body: "A single docked frame.", glyph: "pose" },
      { title: "Simulation", body: "Solvated, equilibrated, run.", glyph: "production" },
      { title: "Trajectory", body: "Nanoseconds of sampled motion.", glyph: "trajectory" },
      { title: "Dynamic behaviour", body: "What persists, what moves.", glyph: "persist" },
    ],
    cardGroups: [
      {
        id: "questions",
        label: "Questions we answer",
        lede: "Analytical questions about the simulated system — not guaranteed outcomes.",
        variant: "glyph",
        cards: [
          { title: "Is the pose stable?", body: "Is the starting arrangement maintained, or does it drift?", glyph: "stable" },
          { title: "Do interactions persist?", body: "Which contacts survive a meaningful fraction of the run.", glyph: "persist" },
          { title: "Which residues matter?", body: "Per-residue involvement across the trajectory.", glyph: "residues" },
          { title: "Does the complex rearrange?", body: "Whether it settles into a different binding mode.", glyph: "rearrange" },
          { title: "How do candidates compare?", body: "Relative behaviour under matched conditions.", glyph: "compare" },
        ],
      },
      {
        id: "services",
        label: "MD services",
        cards: [
          { title: "Protein", body: "Stability, flexibility, and domain motion.", illustration: "trajectoryMotion" },
          { title: "Protein–Ligand", body: "Pose retention and contact persistence.", illustration: "proteinSmallMolecule" },
          { title: "Protein–Protein", body: "Interface stability across the run.", illustration: "proteinProtein" },
          { title: "Antibody–Antigen", body: "CDR flexibility and paratope–epitope contacts.", illustration: "antibodyAntigen" },
          { title: "Mutation / Variant", body: "Matched wild-type and variant runs, compared.", illustration: "mutationVariant" },
          { title: "Free Energy", body: "End-state estimates, reported comparatively.", illustration: "energyLandscape" },
        ],
      },
    ],
    comparison: {
      label: "What a trajectory can separate",
      lede: "Three candidates can look equally plausible as static poses. Simulated over time, their contact profiles often diverge.",
    },
    highlightsLabel: "Simulation range",
    highlights: [
      { value: "10–500 ns", label: "Typical production range", body: "Indicative — length is set per project by system size and question.", glyph: "range" },
      { value: "GPU", label: "Accelerated engine", body: "What makes replicates and multi-candidate comparisons practical.", glyph: "gpu" },
    ],
    workflowLabel: "End-to-end MD package",
    workflow: [
      { title: "Preparation", body: "Protonation, solvation, force field.", glyph: "prep" },
      { title: "Equilibration", body: "Minimise, heat, equilibrate density.", glyph: "equilibrate" },
      { title: "Production", body: "Agreed length and replicates.", glyph: "production" },
      { title: "Analysis", body: "Deviation, flexibility, contacts.", glyph: "signal" },
      { title: "Energetics", body: "End-state estimates where apt.", glyph: "energy" },
      { title: "Reporting", body: "Protocol, results, limitations.", glyph: "report" },
    ],
    analysesLabel: "What we analyse",
    analyses: [
      { name: "RMSD", meaning: "Structural deviation", spark: "rise" },
      { name: "RMSF", meaning: "Residue flexibility", spark: "spiky" },
      { name: "Radius of gyration", meaning: "Compactness", spark: "flat" },
      { name: "SASA", meaning: "Solvent exposure", spark: "decay" },
      { name: "Hydrogen bonds", meaning: "H-bond occupancy", spark: "steps" },
      { name: "Contacts", meaning: "Residue interactions", spark: "spiky" },
      { name: "Interaction persistence", meaning: "Contact lifetime", spark: "decay" },
      { name: "PCA", meaning: "Collective motion", spark: "arc" },
      { name: "MM-PBSA / MM-GBSA", meaning: "Comparative energy estimate", spark: "decay" },
    ],
    applications: ["Drug discovery", "Biologics", "Antibody engineering", "Protein engineering", "Structure-based design"],
    inputs: [
      { title: "Starting structure or docked complex", glyph: "complex" },
      { title: "Ligand parameters, if non-standard", glyph: "sar" },
      { title: "Candidates to compare", glyph: "compare" },
    ],
    deliverables: [
      { title: "Trajectory", glyph: "trajectory" },
      { title: "Analysis & plots", glyph: "signal" },
      { title: "Visualisations", glyph: "visualise" },
      { title: "Energetics, where in scope", glyph: "energy" },
      { title: "Final report", glyph: "report" },
    ],
    faqs: [
      { q: "How long should a simulation be?", a: "It depends on the system and question. We set length and replicate count per project and state the rationale." },
      { q: "Does a stable trajectory prove binding?", a: "No. It is supporting computational evidence under a chosen force field, not experimental confirmation." },
      { q: "Are MM-PBSA / MM-GBSA values absolute affinities?", a: "No. We report them comparatively, across candidates simulated under matched conditions." },
    ],
    realImages: [
      {
        media: "ubiquitinB",
        kicker: "Flexibility, on a real structure",
        title: "Not every region moves alike.",
        body: "Ubiquitin coloured by crystallographic B-factor: the rigid core is navy, the mobile C-terminal tail gold. A crystal gives this static hint; per-residue RMSF from a trajectory measures it under simulation.",
      },
    ],
    layout: ["intro", "flow", "cards:questions", "comparison", "real", "cards:services", "workflow", "analyses", "highlights", "io", "faq", "note"],
    note: "MD describes behaviour under a chosen force field over a finite trajectory. A stable run is supporting computational evidence, not confirmation of a biological interaction, and free-energy estimates are comparative rather than absolute.",
    ctaLabel: "Talk to our computational biology team",
  },
  {
    slug: "genomics",
    title: "Genomics",
    group: "computational",
    custom: true,
    art: "exomeCapture",
    artDescription: "Exons captured from a genome, sequenced as reads, with a variant marked",
    summary: "Whole exome sequencing analysis — raw FASTQ to an annotated, classified variant report.",
    description: "Bioinformatics analysis of exome sequencing data, from raw reads to a classified variant report.",
    ctaLabel: "Request analysis",
  },
  {
    slug: "biomarker-identification",
    title: "Biomarker Identification",
    group: "computational",
    custom: true,
    art: "biomarkerNetwork",
    artDescription: "Correlation network of molecular features with a prioritised sub-cluster highlighted",
    summary: "Sequencing data in. Defensible biomarker signatures out.",
    description: "Ranked, cross-validated biomarker panels from sequencing and multi-omics data.",
    ctaLabel: "Partner with us",
  },
  {
    slug: "rd-services",
    title: "R&D Services",
    group: "programs",
    art: "researchWorkflow",
    artDescription: "A branching research workflow with parallel tracks converging on a single outcome",
    summary: "Customised research and development across antibody engineering.",
    description:
      "Research strategies built around your targets, formats, and development challenges — from early concept through characterisation and optimisation.",
    significanceLabel: "Why a programme",
    significance: "Hard problems rarely fit one service; the strategy that connects the methods matters most.",
    flowLabel: "How an engagement runs",
    flow: [
      { title: "Scope", body: "Target, format, and constraints.", glyph: "objective" },
      { title: "Strategy", body: "Which methods answer the question.", glyph: "pathway" },
      { title: "Iterate", body: "Design, analyse, refine.", glyph: "rearrange" },
      { title: "Characterise", body: "Computational assessment of candidates.", glyph: "characterise" },
      { title: "Report", body: "Evidence, gaps, next steps.", glyph: "report" },
    ],
    gettingStarted: STANDARD_START,
    layout: ["intro", "flow", "gettingStarted"],
  },
  {
    slug: "product-development",
    title: "Product Development",
    group: "programs",
    art: "developmentPipeline",
    artDescription: "A staged development pipeline with the final stage highlighted as a handoff point",
    summary: "From computational design into a structured development workflow.",
    description:
      "Discovery produces candidates; development decides which are worth carrying forward, and on what evidence. Computational and advisory, designed to hand off cleanly.",
    story: {
      label: "Design to development",
      description: "Parallel research tracks converging, variants optimised, and a staged development pipeline ending in a handoff",
      frames: [
        { art: "researchWorkflow", title: "Discovery inputs", caption: "Candidates from our pipelines or your own programme." },
        { art: "leadOptimization", title: "Optimisation", caption: "Targeted iteration on liabilities and stability." },
        { art: "developmentPipeline", title: "Handoff", caption: "A shortlist with the evidence — and gaps — stated." },
      ],
    },
    significanceLabel: "From design to development",
    significance: "A candidate that scores well is not the same as a candidate worth developing.",
    flowLabel: "The path",
    flow: [
      { title: "Discovery", body: "Candidates in, from any source.", art: "screeningFunnel", glyph: "search" },
      { title: "Design", body: "Sequence and structure assessment.", art: "sequenceToStructure", glyph: "structure" },
      { title: "Optimisation", body: "Liabilities, stability, humanness.", art: "leadOptimization", glyph: "optimise" },
      { title: "Characterisation", body: "Modelling that informs a decision.", art: "trajectoryMotion", glyph: "characterise" },
      { title: "Development support", body: "What to test first, and why.", art: "developmentPipeline", glyph: "handoff" },
    ],
    applications: ["Biologics programmes", "Antibody engineering", "Protein engineering", "Early development decision support"],
    deliverables: [
      { title: "Prioritised shortlist", glyph: "shortlist" },
      { title: "Developability assessment", glyph: "developability" },
      { title: "Structural package", glyph: "structure" },
      { title: "Optimisation history", glyph: "milestone" },
      { title: "Decision memo", glyph: "report" },
      { title: "Versioned data handoff", glyph: "handoff" },
    ],
    layout: ["flow", "intro", "io", "applications", "note"],
    note: "Computational and advisory work. IndiskaAI does not provide wet-lab manufacturing, process development, GMP, clinical, or regulatory services.",
    ctaLabel: "Talk to us about a programme",
  },
];

export function getService(slug: string): ServiceEntry | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/**
 * The /services hub and the Nav dropdown both render these groups in order,
 * so the services read as three coherent blocks rather than one long grid.
 */
export const SERVICE_GROUPS: {
  id: ServiceGroup;
  label: string;
  lede: string;
}[] = [
  { id: "discovery", label: "Antibody discovery", lede: "Libraries, discovery pathways, and the data behind them." },
  { id: "computational", label: "Computational science", lede: "Structure, docking, simulation, genomics, and biomarkers." },
  { id: "programs", label: "Programmes & development", lede: "Longer engagements, from research through to development handoff." },
];

export function servicesInGroup(group: ServiceGroup): ServiceEntry[] {
  return SERVICES.filter((s) => s.group === group);
}
