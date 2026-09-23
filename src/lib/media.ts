/**
 * Asset inventory — every raster/vector/video asset the site shows, with its
 * provenance. Check here before adding a visual: reuse beats a near-duplicate.
 *
 * Structure renders are drawn by IndiskaAI from Protein Data Bank coordinates
 * (PDB data is CC0 / public domain). The generator is `scripts/render-pdb.mjs`;
 * raw .pdb files are not committed. Interface residues are computed from the
 * deposited coordinates (any atom within 4.5 Å of the partner chain).
 * Motion inside the SVGs is illustrative, not simulated.
 *
 * Schematic SVG illustrations live in components/science/Illustrations.tsx and
 * are original; they are not listed here.
 */

export type MediaAsset = {
  src: string;
  kind: "structure" | "video";
  alt: string;
  width: number;
  height: number;
  /** Visible credit line. */
  credit: string;
  creditUrl?: string;
  source: string;
  license: string;
  usedOn: string[];
};

const pdb = (id: string) => `https://www.rcsb.org/structure/${id}`;

export const MEDIA = {
  antibodyVideo: {
    src: "/hero-video.mp4",
    kind: "video",
    alt: "Rendered antibody with an antigen bound between its arms, slowly rotating",
    width: 1280,
    height: 720,
    credit: "IndiskaAI render · illustrative",
    source: "Existing project asset (public/hero-video.mp4)",
    license: "Project-owned",
    usedOn: ["/services/antibody-discovery (hero)"],
  },
  iggAntibody: {
    src: "/structures/igg-antibody-1igt.svg",
    kind: "structure",
    alt: "Space-filling render of an intact IgG antibody: heavy chains in navy, light chains in pale blue, glycans in gold",
    width: 640,
    height: 889,
    credit: "Rendered by IndiskaAI from PDB 1IGT",
    creditUrl: pdb("1IGT"),
    source: "RCSB PDB 1IGT (intact IgG2a)",
    license: "PDB data CC0; render original",
    usedOn: ["/services/antibody-discovery"],
  },
  iggVariable: {
    src: "/structures/igg-variable-domains-1igt.svg",
    kind: "structure",
    alt: "Intact IgG antibody with its variable domains at the tips of both arms highlighted in gold",
    width: 640,
    height: 889,
    credit: "Rendered by IndiskaAI from PDB 1IGT · variable-domain boundaries approximate",
    creditUrl: pdb("1IGT"),
    source: "RCSB PDB 1IGT",
    license: "PDB data CC0; render original",
    usedOn: ["/services/ai-assisted-antibody-libraries"],
  },
  fabLysozyme: {
    src: "/structures/fab-lysozyme-3hfm.svg",
    kind: "structure",
    alt: "Antibody Fab (navy) bound to lysozyme (sand); contacting residues on both sides highlighted in gold",
    width: 640,
    height: 1103,
    credit: "Rendered by IndiskaAI from PDB 3HFM · interface computed at 4.5 Å",
    creditUrl: pdb("3HFM"),
    source: "RCSB PDB 3HFM (HyHEL-10 Fab–lysozyme)",
    license: "PDB data CC0; render original",
    usedOn: [
      "/services/structural-analysis",
      "/services/molecular-docking (Residue-Level Interaction Mapping card)",
      "/services/molecular-dynamics (Antibody–Antigen Dynamics card)",
    ],
  },
  proteaseLigand: {
    src: "/structures/protease-ligand-1hsg.svg",
    kind: "structure",
    alt: "Cutaway of HIV-1 protease (navy) with a small-molecule inhibitor (gold) settling into its central pocket",
    width: 640,
    height: 366,
    credit: "Rendered by IndiskaAI from PDB 1HSG · cutaway view, motion illustrative",
    creditUrl: pdb("1HSG"),
    source: "RCSB PDB 1HSG (HIV-1 protease + indinavir)",
    license: "PDB data CC0; render original",
    usedOn: ["/services/molecular-docking (hero)"],
  },
  barnaseBarstar: {
    src: "/structures/barnase-barstar-1brs.svg",
    kind: "structure",
    alt: "Barnase (navy) and barstar (sand) meeting at a protein–protein interface highlighted in gold",
    width: 640,
    height: 352,
    credit: "Rendered by IndiskaAI from PDB 1BRS · interface computed at 4.5 Å, motion illustrative",
    creditUrl: pdb("1BRS"),
    source: "RCSB PDB 1BRS (barnase–barstar)",
    license: "PDB data CC0; render original",
    usedOn: ["/services/molecular-docking (Binding Interface Characterization card)"],
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof MEDIA;
