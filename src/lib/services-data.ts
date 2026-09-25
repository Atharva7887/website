import type { IllustrationName } from "@/components/science/Illustrations";
import type { GlyphName } from "@/components/science/Glyphs";
import type { StoryFrame } from "@/components/science/MotionStory";
import type { ExternalVideo } from "@/components/ExternalVideoCard";
import type { MediaId } from "@/lib/media";
import type { MdPlotKey } from "@/components/md/MdPlots";
import type { MdSceneKey } from "@/components/md/scenes";
import type { DockSceneKey } from "@/components/docking/dockScenes";

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
 * - Story frames and analysis plots are schematic, never plotted from real
 *   runs, and are labelled as such in the UI.
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
  /** A real-data render instead of a schematic — see src/lib/media.ts. */
  media?: MediaId;
  /** An animated, illustrative MD scene (components/md) in place of a still figure. */
  scene?: MdSceneKey;
  /** A docking visual (components/docking): a real-structure scene, or the illustrative comparison. */
  dock?: DockSceneKey | "compare";
  /** Short evidence line under the title, e.g. "Real structure · PDB 1HSG". */
  caption?: string;
  glyph?: GlyphName;
  /** Tiny visual chain under the figure, e.g. ["Reads", "Lineages", "Candidates"]. */
  path?: string[];
};

export type ServiceCardGroup = {
  id: string;
  label: string;
  lede?: string;
  /** "glyph" renders an icon tile; "row" is a horizontal image-left card for renders; "scene" is a visual-first product card around an animated MD scene; "feature" is a 2×2 grid of large docking visuals. */
  variant?: "illustrated" | "glyph" | "row" | "scene" | "feature";
  cards: ServiceCard[];
  /** Compact chip row under the grid for secondary capabilities. */
  chips?: { label: string; items: string[] };
};

/** An analysis concept; `chart` opens an animated illustrative plot when the item is explored. */
export type ServiceAnalysis = { name: string; meaning: string; detail?: string; chart?: MdPlotKey };
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
  | "workflow"
  | "analyses"
  | "closingFlow"
  | "io"
  | "deliverables"
  | "applications"
  | "gettingStarted"
  | "videos"
  | "faq"
  | "note";

export type ServiceEntry = {
  slug: string;
  title: string;
  /** Shorter/qualified label for the Nav dropdown, e.g. "Genomics — Oncology". */
  navLabel?: string;
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
  /** An animated 3D MD scene for the hero (components/md); takes precedence over `story`. */
  heroScene?: MdSceneKey;
  /** Real-structure rows, rendered image-beside-text and alternating sides. */
  realImages?: { media?: MediaId; scene?: MdSceneKey; art?: IllustrationName; artCaption?: string; kicker: string; title: string; body: string }[];
  /** Page has its own route under app/(site)/services; excluded from [slug]. */
  custom?: boolean;
  significance?: string;
  significanceLabel?: string;
  flow?: ServiceStep[];
  flowLabel?: string;
  cardGroups?: ServiceCardGroup[];
  workflow?: ServiceStep[];
  workflowLabel?: string;
  /** One-line statement set under the workflow. */
  workflowClosing?: string;
  analyses?: ServiceAnalysis[];
  analysesLabel?: string;
  closingFlow?: { label: string; steps: ServiceStep[]; body: string };
  applications?: string[];
  inputs?: ServiceItem[];
  /** Reassurance under the inputs, e.g. "Not sure what files you have?…" */
  inputsNote?: string;
  /** The computational steps between inputs and outputs, shown in the IO section. */
  ioProcess?: string[];
  deliverables?: ServiceItem[];
  faqs?: { q: string; a: string }[];
  faqTitle?: string;
  videos?: ExternalVideo[];
  note?: string;
  gettingStarted?: ServiceStep[];
  ctaLabel?: string;
  /** Service-specific closing CTA — every page should answer "why contact us for THIS?". */
  ctaTitle?: string;
  ctaDescription?: string;
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
    ctaTitle: "Looking to explore antibody sequence space?",
    ctaDescription: "Build and evaluate computationally designed antibody diversity around your target and discovery objective.",
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
    ctaTitle: "Have an antibody discovery challenge?",
    ctaDescription: "AI-assisted computational workflows designed to explore, prioritise, and refine antibody candidates from your available starting data.",
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
          { title: "Lead Optimization Data", subtitle: "Prior campaign data", body: "Existing variant or enrichment data informs the next designs.", media: "leadOptimizationScene", path: ["Parent", "Variants", "Optimised"] },
          { title: "NGS Data", subtitle: "Sequencing datasets", body: "Repertoire or panning output is clustered and mined for lineages.", media: "ngsDataScene", path: ["Reads", "Diversity", "Candidates"] },
          { title: "De Novo", subtitle: "No starting antibody", body: "Binders are generated computationally against a specified epitope.", media: "deNovoScene", path: ["Target", "Generation", "Candidates"] },
          { title: "Epitope Identification", subtitle: "Epitope-focused", body: "The antigen surface is mapped first, then design is aimed at it.", media: "epitopeIdScene", path: ["Surface", "Regions", "Epitope"] },
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
    ctaTitle: "Need better data behind your next antibody decision?",
    ctaDescription: "Curated sequences, computational assessment, and transparent ranking criteria, packaged for your discovery workflow.",
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
    ctaTitle: "Have a structure to understand?",
    ctaDescription: "Combine structural prediction, docking, and dynamic analysis to investigate how molecular systems behave beyond a static model.",
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
    ctaTitle: "Have a structure to investigate?",
    ctaDescription: "Explore predicted binding poses, interfaces, and residue-level interactions with a docking workflow designed around your molecular system.",
    group: "computational",
    art: "proteinProtein",
    artDescription: "Two protein surfaces meeting along a complementary interface with contact points marked",
    summary: "Candidate binding poses and interface maps, ranked and explained.",
    description:
      "Structure-based docking to predict candidate binding poses and characterise interfaces. It generates and ranks structural hypotheses — not evidence that binding occurs.",
    heroMedia: "proteaseLigand",
    cardGroups: [
      {
        id: "analyse",
        label: "What we analyse",
        variant: "feature",
        cards: [
          { title: "Binding-Pose Prediction", caption: "Real structure · PDB 1HSG", body: "Predict how a ligand orients and settles within a protein's binding pocket, ranking plausible poses by score and key contacts.", dock: "pose" },
          { title: "Binding Interface Characterization", caption: "Real structure · PDB 1BRS", body: "Identify where two proteins meet, mapping interface residues within 4.5 Å and the hydrogen bonds and salt bridges that hold the complex together.", dock: "interface" },
          { title: "Residue-Level Interaction Mapping", caption: "Real structure · PDB 3HFM", body: "Resolve the interface pair by pair, from each contacting residue to its partner, contact type and distance in ångströms.", dock: "residues" },
          { title: "Comparative Candidate Analysis", caption: "Illustrative data", body: "Compare docking outcomes for the parent, benchmark and AI-assisted candidates side by side to see which variants perform best.", dock: "compare" },
        ],
        chips: {
          label: "Also available",
          items: ["Hotspot analysis", "Epitope / paratope mapping", "SAR interpretation across a ligand series", "AlphaFold model assessment"],
        },
      },
      {
        id: "types",
        label: "Docking types",
        lede: "Six system types, each with its own sampling and scoring considerations.",
        variant: "row",
        cards: [
          { title: "Protein–Small Molecule", body: "Pocket-directed docking with interaction breakdown.", media: "dockSmallMolecule" },
          { title: "Protein–Protein", body: "Association modes and interface characterisation.", media: "dockProteinProtein" },
          { title: "Antibody–Antigen", body: "CDR-aware docking of the paratope–epitope interface.", media: "dockAntibodyAntigen" },
          { title: "Protein–Peptide", body: "Peptide binding modes and interactions, allowing for backbone flexibility.", media: "dockProteinPeptide" },
          { title: "Protein–DNA", body: "DNA recognition and binding-interface analysis, including groove contacts.", media: "dockProteinDNA" },
          { title: "Protein–RNA", body: "RNA interaction modes and interface mapping, allowing for RNA flexibility.", media: "dockProteinRNA" },
        ],
      },
    ],
    workflowLabel: "Our workflow",
    workflow: [
      { title: "Structure Preparation", body: "Target and partner are processed, with the binding site defined where applicable.", glyph: "prep" },
      { title: "Candidate Pose Generation", body: "Binding orientations are sampled and evaluated with the selected docking method.", glyph: "dock" },
      { title: "Pose Selection", body: "Representative poses are shortlisted by score, clustering, and structural assessment.", glyph: "select" },
      { title: "Interface Characterization", body: "Interface residues and predicted interactions of the selected complex are characterised.", glyph: "interface" },
    ],
    workflowClosing: "From predicted binding poses to structural insights for drug discovery.",
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
      { title: "Protein sequence", glyph: "sequence" },
      { title: "Protein structure / predicted structure", glyph: "structure" },
      { title: "Antibody heavy / light chains", glyph: "immune" },
      { title: "Known binding-site information", glyph: "target" },
      { title: "Peptide / ligand structure", glyph: "sar" },
      { title: "Relevant constraints", glyph: "objective" },
      { title: "Candidate molecules", glyph: "candidate" },
    ],
    ioProcess: ["Structure preparation", "Docking"],
    deliverables: [
      { title: "Ranked candidate poses", glyph: "rank" },
      { title: "Complex structures", glyph: "complex" },
      { title: "Interface maps", glyph: "map" },
      { title: "Residue interaction tables", glyph: "table" },
      { title: "Pose comparisons", glyph: "compare" },
      { title: "Structural visualisations", glyph: "visualise" },
      { title: "Analysis report", glyph: "report" },
    ],
    faqs: [
      { q: "Is a docking score a binding affinity?", a: "No. Scores rank poses within a run; they are not affinities and shouldn't be compared across systems." },
      { q: "Can you dock into a predicted structure?", a: "Yes, after assessing model confidence around the site — low-confidence regions are flagged before docking." },
      { q: "When should MD follow docking?", a: "When the decision depends on whether a pose is maintained, or when several poses score similarly." },
    ],
    layout: ["cards:analyse", "cards:types", "workflow", "closingFlow", "io", "applications", "faq", "note"],
    note: "A high-scoring pose is a structural hypothesis, not a demonstration that two molecules bind, and docking scores are not affinities.",
    ctaLabel: "Talk to our computational biology team",
  },
  {
    slug: "molecular-dynamics",
    title: "Molecular Dynamics Simulation",
    group: "computational",
    art: "structuralFluctuation",
    artDescription: "Overlaid trajectory frames of a protein backbone with a per-residue flexibility profile beneath",
    summary: "From static poses to dynamic behaviour.",
    description:
      "Simulation of stability and interaction persistence over time. A docked pose is a single frame; a trajectory shows whether it holds together.",
    heroScene: "heroComplex",
    significanceLabel: "Why molecular dynamics?",
    significance: "A static structure can't tell a persistent interaction from one that merely looks right in a single frame.",
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
        label: "Our MD services",
        lede: "The molecular systems we simulate. Drag a model to turn it.",
        variant: "scene",
        cards: [
          { title: "Protein", body: "Stability, flexibility and domain motion over time.", scene: "protein" },
          { title: "Protein–Ligand", body: "How a bound ligand and its pocket contacts behave through the run.", scene: "proteinLigand" },
          { title: "Protein–Protein", body: "Interface contacts and how consistently they hold.", scene: "proteinProtein" },
          { title: "Antibody–Antigen", body: "CDR loop flexibility and paratope–epitope contacts.", scene: "antibodyAntigen" },
          { title: "Mutation / Variant", body: "Matched wild-type and variant runs, compared side by side.", scene: "mutationVariant" },
          { title: "Free-Energy", body: "Sampling of energetic states, reported comparatively.", scene: "freeEnergy" },
        ],
      },
      {
        id: "applications",
        label: "Applications of molecular dynamics",
        cards: [
          { title: "Docking Pose Validation", body: "Test whether a docked pose stays stable and its interactions persist over time.", scene: "proteinLigand" },
          { title: "Antibody–Antigen Dynamics", body: "Characterise Fv–antigen interfaces, CDR contacts, and binding behaviour through the run.", media: "fabLysozyme" },
          { title: "Protein–Protein Interaction Analysis", body: "Follow interface stability, residue contacts, and hydrogen-bond networks across the trajectory.", scene: "proteinProtein" },
          { title: "Candidate Prioritization", body: "Separate candidates on stability, interaction persistence, and energetics to support experimental selection.", illustration: "candidateCompare" },
          { title: "Mutation & Variant Analysis", body: "Evaluate how sequence changes affect stability, flexibility, and binding interfaces.", scene: "mutationVariant" },
          { title: "Binding & Free-Energy Analysis", body: "Estimate binding contributions with MM-PBSA/MM-GBSA and residue-level decomposition.", scene: "freeEnergy" },
          { title: "Protein Stability & Conformational Dynamics", body: "Capture flexibility and conformational states that a single static structure can't show.", illustration: "structuralFluctuation" },
          { title: "Mechanistic & Structural Studies", body: "Uncover dynamic interaction networks and conformational transitions behind molecular recognition.", illustration: "trajectoryMotion" },
          { title: "Lead Optimization", body: "Compare binding modes and dynamic behaviour across a candidate series to guide design.", illustration: "leadOptimization" },
          { title: "Biologics & Protein Engineering", body: "Assess engineered antibodies and proteins for interface behaviour and stability.", illustration: "biologicsEngineering" },
        ],
      },
    ],
    realImages: [
      {
        scene: "protein",
        artCaption: "Illustrative MD simulation: thermal fluctuation of the whole chain, with one domain swinging about the gold hinge loop. Drag to turn.",
        kicker: "Conformational dynamics",
        title: "Protein Stability & Conformational Dynamics",
        body: "A crystal or docked structure is one snapshot. Over a trajectory the same protein flexes, rearranges and moves between conformational states — which MD resolves and quantifies.",
      },
    ],
    workflowLabel: "End-to-end MD package",
    workflow: [
      { title: "System Preparation", body: "The structure is protonated, solvated, and parameterised with a suitable force field.", glyph: "prep" },
      { title: "Equilibration", body: "Minimisation, heating, and density equilibration bring the system to stable conditions.", glyph: "equilibrate" },
      { title: "Production Simulation", body: "A GPU-accelerated run at the agreed length and replicate count.", glyph: "production" },
      { title: "Trajectory Analysis", body: "Deviation, flexibility, contacts, and collective motion are quantified.", glyph: "signal" },
      { title: "Energetic Analysis", body: "End-state free-energy estimates, where appropriate, for comparison.", glyph: "energy" },
      { title: "Reporting", body: "Protocol, results, figures, and limitations in one report.", glyph: "report" },
    ],
    analysesLabel: "What we analyse",
    analyses: [
      { name: "RMSD", meaning: "Overall structural deviation", detail: "Measures overall structural deviation relative to a reference structure across the trajectory.", chart: "rmsd" },
      { name: "RMSF", meaning: "Residue-level flexibility", detail: "Measures residue-level fluctuations and highlights regions with greater molecular flexibility.", chart: "rmsf" },
      { name: "Radius of Gyration", meaning: "Molecular compactness", detail: "Describes changes in the overall compactness of the simulated system.", chart: "rg" },
      { name: "SASA", meaning: "Solvent exposure", detail: "Evaluates solvent-accessible surface area and changes in molecular exposure during the trajectory.", chart: "sasa" },
      { name: "Hydrogen Bonds", meaning: "Interaction persistence", detail: "Tracks hydrogen-bond formation and persistence between relevant interacting groups.", chart: "hbonds" },
      { name: "Contacts / Interaction Persistence", meaning: "Residue interaction persistence", detail: "Tracks residue or molecular contacts and how consistently interactions are maintained over time.", chart: "contacts" },
      { name: "PCA", meaning: "Collective motion", detail: "Examines dominant collective motions and major conformational changes across the simulation.", chart: "pca" },
      { name: "MM-PBSA / MM-GBSA", meaning: "Binding-related energetic analysis", detail: "Estimates binding-related energetic contributions for suitable simulated complexes and can support comparative analysis.", chart: "mmpbsa" },
    ],
    deliverables: [
      { title: "Trajectory", glyph: "trajectory" },
      { title: "Analysis results", glyph: "signal" },
      { title: "Scientific visualisations", glyph: "visualise" },
      { title: "Interaction analysis", glyph: "interaction" },
      { title: "Energetic analysis, where applicable", glyph: "energy" },
      { title: "Final report", glyph: "report" },
    ],
    faqTitle: "Frequently Asked Questions — Molecular Dynamics Simulation",
    faqs: [
      {
        q: "What is Molecular Dynamics (MD) simulation?",
        a: "Molecular Dynamics is a computational approach that simulates the movement and interactions of atoms over time, providing insights into molecular stability, flexibility, binding behavior, and conformational changes.",
      },
      {
        q: "How does MD complement molecular docking?",
        a: "Docking provides a static prediction of a possible binding pose, while MD evaluates how that pose behaves dynamically. It can assess structural stability, interaction persistence, interface changes, and energetic properties throughout the simulation.",
      },
      {
        q: "What simulation timescales do you offer?",
        a: "We offer GPU-accelerated simulations ranging from 10 ns to 500 ns, with simulation length selected according to the molecular system, project objectives, and required level of dynamic analysis.",
      },
      {
        q: "What insights can be obtained from an MD simulation?",
        a: "MD simulations can provide insights into structural stability, residue flexibility, interaction persistence, hydrogen bonds, salt bridges, interface behavior, conformational changes, and binding energetics, supported by analyses such as RMSD, RMSF, SASA, contact analysis, and MM-PBSA/MM-GBSA.",
      },
    ],
    layout: ["intro", "cards:questions", "cards:services", "workflow", "analyses", "cards:applications", "real", "deliverables", "faq"],
    ctaTitle: "Have a target in mind?",
    ctaDescription: "Customized MD simulations designed to reveal stability, interactions, and molecular behavior over time.",
    ctaLabel: "Talk to our computational biology team",
  },
  {
    slug: "genomics",
    title: "Genomics",
    navLabel: "Genomics — Whole Exome Sequencing",
    group: "computational",
    custom: true,
    art: "exomeCapture",
    artDescription: "Exons captured from a genome, sequenced as reads, with a variant marked",
    summary: "Whole exome sequencing analysis — raw FASTQ to an annotated, classified variant report.",
    description: "Bioinformatics analysis of exome sequencing data, from raw reads to a classified variant report.",
    ctaLabel: "Request analysis",
  },
  {
    slug: "genomics/oncology-somatic-variant-analysis",
    title: "Oncology: Somatic Variant Analysis",
    navLabel: "Genomics — Oncology: Somatic Variants",
    group: "computational",
    custom: true,
    art: "tumourPanel",
    artDescription: "A tumour sample, targeted panel regions, and sequencing reads with somatic variant positions marked",
    summary: "Tumour panel sequencing analysis — raw FASTQ to an annotated, tiered variant report.",
    description: "Bioinformatics analysis of targeted oncology panel data, returning prioritised somatic variants with allele fractions and supporting evidence.",
    ctaLabel: "Request analysis",
  },
  {
    slug: "biomarker-identification",
    title: "Biomarker Identification",
    group: "computational",
    custom: true,
    art: "biomarkerNetwork",
    artDescription: "Correlation network of molecular features with a prioritised sub-cluster highlighted",
    summary: "RNA sequencing data in. Survival-linked gene signatures out.",
    description: "A compact, cross-validated gene signature from raw RNA-seq reads and patient survival data.",
    ctaLabel: "Partner with us",
  },
  {
    slug: "rd-services",
    title: "R&D Services",
    ctaTitle: "Have a research problem that spans methods?",
    ctaDescription: "A research strategy that connects the right computational methods to your target, format, and development challenge.",
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
    ctaTitle: "Moving from discovery to development?",
    ctaDescription: "Computational support for evaluating, optimising, and advancing candidates toward the next stage of development.",
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
