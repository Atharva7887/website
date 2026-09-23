/**
 * Original scientific illustrations for the service pages.
 *
 * All of these are hand-drawn inline SVG in the IndiskaAI palette — no stock
 * photography, no third-party assets. They are schematic rather than
 * data-derived: the point is that a visitor recognises the concept at a
 * glance, so shapes follow the real biology (antigen meets the Fab tips, not
 * the Fc stem; a ligand sits in a pocket; DNA strands cross where a duplex
 * crosses) without pretending to depict a specific structure or result.
 *
 * Motion lives in CSS classes (`sci-*` in globals.css) so it costs no
 * JavaScript and switches off under prefers-reduced-motion. Every SVG is
 * decorative — ScienceFigure carries the accessible description.
 */

const NAVY = "#1E5BA8";
const GOLD = "#F4C430";
const INK = "#1A1A1A";

const NAVY_FILL = "rgba(30,91,168,0.10)";
const NAVY_FILL_2 = "rgba(30,91,168,0.18)";
const GOLD_FILL = "rgba(244,196,48,0.25)";
const INK_FILL = "rgba(26,26,26,0.07)";
const INK_LINE = "rgba(26,26,26,0.22)";

const S = {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

/* ─────────────────────────── Docking system types ─────────────────────── */

/**
 * Globular protein whose right flank folds inward into an open binding
 * cleft — the mouth spans y 72→96 and reaches back to x≈104, deep enough
 * for a ligand to sit inside it rather than beside it.
 */
function PocketBody({ fill = NAVY_FILL }: { fill?: string }) {
  return (
    <path
      d="M150 52 C148 62 148 68 146 72 C132 78 104 74 104 84 C104 94 132 90 146 96 C148 100 148 106 150 112 C146 132 112 144 80 139 C40 133 22 104 26 76 C30 44 66 24 104 24 C136 24 150 36 150 52 Z"
      fill={fill}
      stroke={NAVY}
      strokeWidth="1.6"
      {...S}
    />
  );
}

/** Small molecule: aromatic ring plus a short substituent. */
function Ligand({ x = 0, y = 0, accent = GOLD }: { x?: number; y?: number; accent?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 -11 L9.5 -5.5 L9.5 5.5 L0 11 L-9.5 5.5 L-9.5 -5.5 Z"
        fill={GOLD_FILL}
        stroke={accent}
        strokeWidth="1.6"
        {...S}
      />
      <circle cx="0" cy="0" r="3.4" fill="none" stroke={accent} strokeWidth="1.2" />
      <path d="M9.5 -5.5 L19 -11" stroke={accent} strokeWidth="1.6" {...S} />
      <circle cx="21" cy="-12" r="3" fill={accent} />
    </g>
  );
}

export function ProteinSmallMolecule() {
  return (
    <Svg>
      <PocketBody />
      <Ligand x={124} y={84} />
      <path d="M112 72 L118 77 M112 96 L118 91" stroke={GOLD} strokeWidth="1.3" strokeDasharray="2 3" {...S} />
    </Svg>
  );
}

export function ProteinProtein() {
  const seam = "M120 25 C132 45 108 60 120 80 C132 100 108 115 120 135";
  return (
    <Svg>
      <path
        d={`${seam} C80 148 30 128 26 80 C22 32 80 12 120 25 Z`}
        fill={NAVY_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path
        d={`${seam} C160 148 212 128 214 80 C216 32 160 12 120 25 Z`}
        fill={INK_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path d={seam} stroke={GOLD} strokeWidth="2.4" {...S} />
      <circle cx="122" cy="52" r="2.6" fill={GOLD} />
      <circle cx="118" cy="80" r="2.6" fill={GOLD} />
      <circle cx="122" cy="108" r="2.6" fill={GOLD} />
    </Svg>
  );
}

/** Y-shaped immunoglobulin: antigen contacts the two Fab tips, never the Fc. */
export function AntibodyAntigen() {
  return (
    <Svg>
      <ellipse cx="120" cy="34" rx="50" ry="21" fill={INK_FILL} stroke={NAVY} strokeWidth="1.6" />
      <path d="M92 44 C104 52 136 52 148 44" stroke={GOLD} strokeWidth="2.2" {...S} />

      <path d="M120 96 L84 52" stroke={NAVY} strokeWidth="7" {...S} />
      <path d="M120 96 L156 52" stroke={NAVY} strokeWidth="7" {...S} />
      <path d="M120 96 L120 146" stroke={NAVY} strokeWidth="9" {...S} />

      <circle cx="84" cy="50" r="6" fill={GOLD} stroke={INK} strokeWidth="1.2" />
      <circle cx="156" cy="50" r="6" fill={GOLD} stroke={INK} strokeWidth="1.2" />
      <path d="M102 74 L138 74" stroke="rgba(250,247,240,0.9)" strokeWidth="2" {...S} />
    </Svg>
  );
}

export function ProteinPeptide() {
  return (
    <Svg>
      <path
        d="M36 34 C24 60 24 104 38 130 C62 150 178 150 202 130 C216 104 216 60 204 34 C178 16 62 16 36 34 Z"
        fill={NAVY_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path
        d="M58 82 C58 68 74 62 92 62 L148 62 C166 62 182 68 182 82 C182 96 166 102 148 102 L92 102 C74 102 58 96 58 82 Z"
        fill="rgba(250,247,240,0.75)"
        stroke={INK_LINE}
        strokeWidth="1.2"
        {...S}
      />
      {[78, 100, 122, 144, 166].map((cx, i) => (
        <circle key={cx} cx={cx} cy="82" r="8" fill={i === 2 ? GOLD : GOLD_FILL} stroke={GOLD} strokeWidth="1.5" />
      ))}
      <path d="M86 82 L92 82 M108 82 L114 82 M130 82 L136 82 M152 82 L158 82" stroke={GOLD} strokeWidth="1.6" {...S} />
    </Svg>
  );
}

/** Duplex drawn as two mirrored waves — they cross where a real duplex crosses. */
function Duplex({ accent = false }: { accent?: boolean }) {
  return (
    <g>
      <path d="M18 100 Q40.5 55 63 100 T108 100 T153 100 T198 100" stroke={NAVY} strokeWidth="2.2" {...S} />
      <path d="M18 100 Q40.5 145 63 100 T108 100 T153 100 T198 100" stroke={NAVY} strokeWidth="2.2" {...S} />
      {[40.5, 85.5, 130.5, 175.5].map((x, i) => (
        <path
          key={x}
          d={`M${x} 77.5 L${x} 122.5`}
          stroke={accent && i === 2 ? GOLD : INK_LINE}
          strokeWidth={accent && i === 2 ? 2.4 : 1.6}
          {...S}
        />
      ))}
    </g>
  );
}

export function ProteinDNA() {
  return (
    <Svg>
      <Duplex accent />
      <path
        d="M112 62 C96 56 96 30 118 24 C142 17 166 26 168 46 C170 62 150 70 132 66 Z"
        fill={NAVY_FILL_2}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path d="M128 68 L130 78" stroke={GOLD} strokeWidth="1.6" strokeDasharray="2 3" {...S} />
    </Svg>
  );
}

export function ProteinRNA() {
  return (
    <Svg>
      <path d="M26 138 C56 138 66 120 66 104 L66 72" stroke={NAVY} strokeWidth="2.2" {...S} />
      <path d="M92 138 C92 120 92 104 92 72" stroke={NAVY} strokeWidth="2.2" {...S} />
      <path d="M66 72 C66 44 92 44 92 72" stroke={NAVY} strokeWidth="2.2" {...S} />
      {[126, 112, 98, 84].map((y) => (
        <path key={y} d={`M68 ${y} L90 ${y}`} stroke={INK_LINE} strokeWidth="1.5" {...S} />
      ))}
      <path
        d="M118 56 C106 40 122 20 146 22 C176 24 194 44 188 66 C182 88 146 92 130 76 Z"
        fill={NAVY_FILL_2}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path d="M96 58 L120 54 M96 70 L118 68" stroke={GOLD} strokeWidth="1.5" strokeDasharray="2 3" {...S} />
      <circle cx="79" cy="52" r="7" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.5" />
    </Svg>
  );
}

/* ───────────────────────────── Concept figures ────────────────────────── */

/** Residue letters folding into a helix — the sequence→structure step. */
export function SequenceToStructure() {
  return (
    <Svg>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={20 + i * 17}
          y="68"
          width="13"
          height="24"
          rx="3"
          fill={i % 2 ? NAVY_FILL_2 : NAVY_FILL}
          stroke={NAVY}
          strokeWidth="1.3"
        />
      ))}
      <path d="M112 80 L136 80" stroke={GOLD} strokeWidth="2" {...S} />
      <path d="M130 74 L136 80 L130 86" stroke={GOLD} strokeWidth="2" {...S} />
      <path
        d="M170 132 C204 122 204 100 172 94 C140 88 140 64 174 56 C204 49 204 30 176 24"
        stroke={NAVY}
        strokeWidth="7"
        {...S}
      />
      <path
        d="M170 132 C204 122 204 100 172 94 C140 88 140 64 174 56 C204 49 204 30 176 24"
        stroke={GOLD}
        strokeWidth="1.6"
        strokeDasharray="3 7"
        {...S}
      />
    </Svg>
  );
}

/** Ranked docking output: faded rejected poses, one selected. */
export function DockingPoses() {
  return (
    <Svg>
      <PocketBody />
      <g opacity="0.32">
        <Ligand x={192} y={44} accent={INK} />
        <Ligand x={198} y={122} accent={INK} />
      </g>
      <Ligand x={124} y={84} />
      <circle cx="124" cy="84" r="25" stroke={GOLD} strokeWidth="1.4" strokeDasharray="3 4" />
      <path d="M178 52 L150 74 M182 116 L152 96" stroke={INK_LINE} strokeWidth="1.2" strokeDasharray="3 4" {...S} />
    </Svg>
  );
}

/** Static frame versus a sampled trajectory — the MD "why". */
const TRACE =
  "M24 126 C44 112 56 130 72 120 C88 110 100 128 116 118 C132 108 144 126 160 116 C176 106 192 122 216 112";

export function TrajectoryMotion() {
  return (
    <Svg>
      <g className="sci-drift">
        <ellipse cx="86" cy="70" rx="42" ry="34" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.6" />
        <circle cx="112" cy="86" r="9" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.6" />
      </g>
      <ellipse cx="86" cy="70" rx="42" ry="34" stroke={INK_LINE} strokeWidth="1.2" strokeDasharray="3 4" />

      <path d="M24 134 L216 134" stroke={INK_LINE} strokeWidth="1.2" {...S} />
      <path d={TRACE} stroke={NAVY} strokeWidth="2" {...S} />
      <path className="sci-trace" d={TRACE} stroke={GOLD} strokeWidth="2.4" {...S} />
      <circle className="sci-travel" cx="0" cy="0" r="3.4" fill={GOLD} stroke={INK} strokeWidth="1" />
    </Svg>
  );
}

/** Wild-type versus variant at a single position. */
export function MutationVariant() {
  return (
    <Svg>
      {[0, 1].map((row) => (
        <g key={row} transform={`translate(0 ${row * 62})`}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const swapped = row === 1 && i === 3;
            return (
              <rect
                key={i}
                x={34 + i * 28}
                y="36"
                width="22"
                height="26"
                rx="4"
                fill={swapped ? GOLD_FILL : NAVY_FILL}
                stroke={swapped ? GOLD : NAVY}
                strokeWidth={swapped ? 2 : 1.3}
              />
            );
          })}
        </g>
      ))}
      <path d="M120 74 L120 92" stroke={GOLD} strokeWidth="1.8" strokeDasharray="3 3" {...S} />
    </Svg>
  );
}

/** Energy landscape with a marked minimum. */
export function EnergyLandscape() {
  return (
    <Svg>
      <path d="M26 30 L26 134 L214 134" stroke={INK_LINE} strokeWidth="1.3" {...S} />
      <path
        d="M38 44 C66 48 74 96 96 100 C118 104 122 62 146 62 C170 62 176 118 200 122"
        stroke={NAVY}
        strokeWidth="2.2"
        {...S}
      />
      <circle cx="96" cy="100" r="5.5" fill={GOLD} stroke={INK} strokeWidth="1.2" />
      <path d="M96 106 L96 134" stroke={GOLD} strokeWidth="1.4" strokeDasharray="3 3" {...S} />
    </Svg>
  );
}

/* ──────────────────────────── Interaction types ───────────────────────── */

function Atom({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill={fill} stroke={NAVY} strokeWidth="1.6" />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="14"
        fontFamily="var(--font-inter), sans-serif"
        fill={INK}
      >
        {label}
      </text>
    </g>
  );
}

export function HydrogenBond() {
  return (
    <Svg>
      <Atom x={56} y={80} label="N" fill={NAVY_FILL} />
      <circle cx="98" cy="80" r="10" fill="rgba(250,247,240,0.9)" stroke={NAVY} strokeWidth="1.4" />
      <text x="98" y="85" textAnchor="middle" fontSize="11" fontFamily="var(--font-inter), sans-serif" fill={INK}>
        H
      </text>
      <path d="M73 80 L88 80" stroke={NAVY} strokeWidth="1.8" {...S} />
      <path d="M110 80 L166 80" stroke={GOLD} strokeWidth="2.4" strokeDasharray="3 5" {...S} />
      <Atom x={184} y={80} label="O" fill={GOLD_FILL} />
    </Svg>
  );
}

export function SaltBridge() {
  return (
    <Svg>
      <circle cx="62" cy="80" r="24" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.6" />
      <path d="M52 80 L72 80 M62 70 L62 90" stroke={NAVY} strokeWidth="2.4" {...S} />
      <circle cx="178" cy="80" r="24" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.6" />
      <path d="M168 80 L188 80" stroke={INK} strokeWidth="2.4" {...S} />
      <path d="M90 80 L150 80" stroke={GOLD} strokeWidth="2.4" strokeDasharray="3 5" {...S} />
    </Svg>
  );
}

export function HydrophobicContact() {
  return (
    <Svg>
      <circle cx="82" cy="80" r="26" fill={INK_FILL} stroke={NAVY} strokeWidth="1.6" strokeDasharray="4 4" />
      <circle cx="158" cy="80" r="26" fill={INK_FILL} stroke={NAVY} strokeWidth="1.6" strokeDasharray="4 4" />
      {[64, 80, 96].map((y) => (
        <path key={y} d={`M110 ${y} L130 ${y}`} stroke={GOLD} strokeWidth="1.6" strokeDasharray="1 4" {...S} />
      ))}
      <circle cx="120" cy="80" r="44" stroke={INK_LINE} strokeWidth="1.1" strokeDasharray="2 5" />
    </Svg>
  );
}

/** Residue-by-residue contact matrix with a hot cluster. */
export function InterfaceMap() {
  const hot = new Set(["2-2", "2-3", "3-2", "3-3", "4-3"]);
  return (
    <Svg>
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => {
          const key = `${r}-${c}`;
          const isHot = hot.has(key);
          const mild = (r + c) % 3 === 0;
          return (
            <rect
              key={key}
              x={62 + c * 20}
              y={22 + r * 20}
              width="17"
              height="17"
              rx="2.5"
              fill={isHot ? GOLD : mild ? NAVY_FILL_2 : "rgba(26,26,26,0.04)"}
              stroke={INK_LINE}
              strokeWidth="0.8"
            />
          );
        })
      )}
      <path d="M56 22 L56 138 L182 138" stroke={INK_LINE} strokeWidth="1.2" {...S} />
    </Svg>
  );
}

/* ───────────────────────────────── Genomics ───────────────────────────── */

/** Short reads piled on a reference; the gold column is the variant call. */
export function SequencingReads() {
  const reads = [
    { x: 30, y: 52, w: 74 },
    { x: 84, y: 68, w: 86 },
    { x: 46, y: 84, w: 96 },
    { x: 108, y: 100, w: 78 },
    { x: 66, y: 116, w: 88 },
  ];
  return (
    <Svg>
      <path d="M20 34 L220 34" stroke={NAVY} strokeWidth="3" {...S} />
      {reads.map((r) => (
        <g key={`${r.x}-${r.y}`}>
          <rect x={r.x} y={r.y} width={r.w} height="9" rx="4.5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.1" />
          {r.x < 124 && r.x + r.w > 124 && <rect x="120" y={r.y} width="8" height="9" rx="2" fill={GOLD} />}
        </g>
      ))}
      <path d="M124 34 L124 132" stroke={GOLD} strokeWidth="1.4" strokeDasharray="3 4" {...S} />
      <circle cx="124" cy="34" r="4.5" fill={GOLD} stroke={INK} strokeWidth="1.1" />
    </Svg>
  );
}

function PedigreeShape({ x, y, kind, filled }: { x: number; y: number; kind: "square" | "circle"; filled?: boolean }) {
  const fill = filled ? GOLD_FILL : "rgba(250,247,240,0.9)";
  const stroke = filled ? GOLD : NAVY;
  return kind === "square" ? (
    <rect x={x - 17} y={y - 17} width="34" height="34" rx="4" fill={fill} stroke={stroke} strokeWidth="2" />
  ) : (
    <circle cx={x} cy={y} r="17" fill={fill} stroke={stroke} strokeWidth="2" />
  );
}

export function PedigreeSingleton() {
  return (
    <Svg>
      <PedigreeShape x={120} y={80} kind="square" filled />
      <path d="M120 101 L120 126" stroke={NAVY} strokeWidth="1.6" {...S} />
      <rect x={86} y={126} width="68" height="14" rx="7" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.3" />
    </Svg>
  );
}

export function PedigreeDuo() {
  return (
    <Svg>
      <PedigreeShape x={78} y={48} kind="circle" />
      <path d="M78 65 L78 88 L150 88" stroke={NAVY} strokeWidth="1.6" {...S} />
      <PedigreeShape x={168} y={88} kind="square" filled />
      <path d="M168 109 L168 130" stroke={NAVY} strokeWidth="1.6" {...S} />
      <rect x={134} y={130} width="68" height="13" rx="6.5" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.3" />
    </Svg>
  );
}

export function PedigreeTrio() {
  return (
    <Svg>
      <PedigreeShape x={62} y={44} kind="circle" />
      <PedigreeShape x={178} y={44} kind="square" />
      <path d="M62 61 L62 76 L178 76 L178 61" stroke={NAVY} strokeWidth="1.6" {...S} />
      <path d="M120 76 L120 96" stroke={NAVY} strokeWidth="1.6" {...S} />
      <PedigreeShape x={120} y={114} kind="square" filled />
    </Svg>
  );
}

export function VariantReport() {
  return (
    <Svg>
      <rect x="58" y="22" width="124" height="118" rx="8" fill="rgba(250,247,240,0.9)" stroke={NAVY} strokeWidth="1.6" />
      {[46, 64, 82, 100, 118].map((y, i) => (
        <g key={y}>
          {i === 2 && <rect x="66" y={y - 9} width="108" height="18" rx="4" fill={GOLD_FILL} />}
          <path d={`M74 ${y} L${i === 2 ? 156 : 140} ${y}`} stroke={i === 2 ? GOLD : INK_LINE} strokeWidth={i === 2 ? 2.4 : 1.8} {...S} />
        </g>
      ))}
      <circle cx="166" cy="82" r="4" fill={GOLD} />
    </Svg>
  );
}

/* ─────────────────────────── Biomarkers & libraries ───────────────────── */

/** Correlation network with a prioritised sub-cluster. */
export function BiomarkerNetwork() {
  const nodes = [
    { x: 54, y: 46, hot: false },
    { x: 104, y: 30, hot: true },
    { x: 152, y: 52, hot: true },
    { x: 196, y: 38, hot: false },
    { x: 78, y: 92, hot: false },
    { x: 126, y: 84, hot: true },
    { x: 178, y: 104, hot: false },
    { x: 50, y: 130, hot: false },
    { x: 112, y: 134, hot: false },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [4, 5], [5, 6], [4, 7], [5, 8], [6, 2], [7, 8],
  ];
  return (
    <Svg>
      {edges.map(([a, b]) => {
        const hot = nodes[a].hot && nodes[b].hot;
        return (
          <path
            key={`${a}-${b}`}
            d={`M${nodes[a].x} ${nodes[a].y} L${nodes[b].x} ${nodes[b].y}`}
            stroke={hot ? GOLD : INK_LINE}
            strokeWidth={hot ? 2 : 1.1}
            {...S}
          />
        );
      })}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.hot ? 9 : 6.5}
          fill={n.hot ? GOLD : NAVY_FILL_2}
          stroke={n.hot ? INK : NAVY}
          strokeWidth="1.4"
        />
      ))}
    </Svg>
  );
}

/** Repertoire diversity: many variants, a handful prioritised. */
export function LibraryDiversity() {
  const bars = [28, 52, 38, 70, 44, 86, 34, 62, 48, 92, 40, 58, 76, 36, 66, 50];
  const hot = new Set([5, 9, 12]);
  return (
    <Svg>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={22 + i * 13}
          y={128 - h}
          width="8"
          height={h}
          rx="4"
          fill={hot.has(i) ? GOLD : NAVY_FILL_2}
          stroke={hot.has(i) ? GOLD : NAVY}
          strokeWidth="1.1"
        />
      ))}
      <path d="M18 132 L226 132" stroke={INK_LINE} strokeWidth="1.2" {...S} />
    </Svg>
  );
}

/** One parent sequence diversified into scored variants. */
export function LeadOptimization() {
  return (
    <Svg>
      <rect x="20" y="66" width="44" height="28" rx="6" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.6" />
      {[38, 80, 122].map((y, i) => (
        <g key={y}>
          <path d={`M66 80 C92 80 92 ${y + 12} 112 ${y + 12}`} stroke={INK_LINE} strokeWidth="1.3" {...S} />
          <rect
            x="112"
            y={y}
            width="40"
            height="24"
            rx="5"
            fill={i === 1 ? GOLD_FILL : "rgba(26,26,26,0.05)"}
            stroke={i === 1 ? GOLD : INK_LINE}
            strokeWidth={i === 1 ? 2 : 1.2}
          />
        </g>
      ))}
      <path d="M154 92 C176 92 176 80 194 80" stroke={GOLD} strokeWidth="2" {...S} />
      <rect x="194" y="66" width="30" height="28" rx="6" fill={GOLD} stroke={INK} strokeWidth="1.3" />
    </Svg>
  );
}

/** A single starting sequence resolving to one lead. */
export function SingleLead() {
  return (
    <Svg>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={30 + i * 15}
          y="50"
          width="11"
          height="22"
          rx="3"
          fill={NAVY_FILL}
          stroke={NAVY}
          strokeWidth="1.2"
        />
      ))}
      <path d="M78 84 L78 100" stroke={GOLD} strokeWidth="2" {...S} />
      <path d="M72 94 L78 100 L84 94" stroke={GOLD} strokeWidth="2" {...S} />
      <g transform="translate(150 84) scale(0.62)">
        <path d="M0 40 L-42 -6" stroke={NAVY} strokeWidth="11" {...S} />
        <path d="M0 40 L42 -6" stroke={NAVY} strokeWidth="11" {...S} />
        <path d="M0 40 L0 90" stroke={NAVY} strokeWidth="13" {...S} />
        <circle cx="-42" cy="-8" r="9" fill={GOLD} stroke={INK} strokeWidth="1.8" />
        <circle cx="42" cy="-8" r="9" fill={GOLD} stroke={INK} strokeWidth="1.8" />
      </g>
      <rect x="30" y="104" width="80" height="12" rx="6" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.3" />
    </Svg>
  );
}

/** Generative design: target epitope in, candidate binders out. */
export function DeNovoDesign() {
  return (
    <Svg>
      <path
        d="M22 52 C14 78 22 110 44 124 C60 134 76 128 78 112 C80 98 66 92 66 78 C66 62 80 58 78 44 C76 30 44 32 22 52 Z"
        fill={NAVY_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <path d="M70 66 C82 70 82 88 70 92" stroke={GOLD} strokeWidth="2.6" {...S} />

      <rect x="98" y="58" width="44" height="44" rx="10" fill="rgba(250,247,240,0.9)" stroke={NAVY} strokeWidth="1.6" />
      <circle className="sci-pulse" cx="120" cy="80" r="11" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.8" />
      <path d="M142 80 L164 80" stroke={GOLD} strokeWidth="2" {...S} />
      <path d="M158 74 L164 80 L158 86" stroke={GOLD} strokeWidth="2" {...S} />

      {[42, 80, 118].map((y) => (
        <g key={y} transform={`translate(196 ${y}) scale(0.34)`}>
          <path d="M0 40 L-42 -6" stroke={NAVY} strokeWidth="14" {...S} />
          <path d="M0 40 L42 -6" stroke={NAVY} strokeWidth="14" {...S} />
          <path d="M0 40 L0 88" stroke={NAVY} strokeWidth="16" {...S} />
        </g>
      ))}
    </Svg>
  );
}

/** Antigen surface with mapped binding regions. */
export function EpitopeMap() {
  return (
    <Svg>
      <path
        d="M56 44 C34 66 34 106 58 126 C86 148 156 148 186 124 C210 104 208 62 182 42 C152 20 82 20 56 44 Z"
        fill={NAVY_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      <ellipse cx="94" cy="72" rx="22" ry="15" fill={GOLD_FILL} stroke={GOLD} strokeWidth="2" />
      <ellipse cx="156" cy="104" rx="18" ry="13" fill={GOLD_FILL} stroke={GOLD} strokeWidth="2" />
      <ellipse cx="148" cy="60" rx="13" ry="10" fill="rgba(26,26,26,0.06)" stroke={INK_LINE} strokeWidth="1.4" />
      <circle cx="94" cy="72" r="3" fill={GOLD} />
      <circle cx="156" cy="104" r="3" fill={GOLD} />
    </Svg>
  );
}

/** Parallel research tracks converging on a single outcome. */
export function ResearchWorkflow() {
  return (
    <Svg>
      <circle cx="34" cy="80" r="11" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.6" />
      {[38, 80, 122].map((y) => (
        <g key={y}>
          <path d={`M45 80 C68 80 68 ${y} 92 ${y}`} stroke={INK_LINE} strokeWidth="1.4" {...S} />
          <rect x="92" y={y - 12} width="42" height="24" rx="6" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.4" />
          <path d={`M134 ${y} C158 ${y} 158 80 180 80`} stroke={INK_LINE} strokeWidth="1.4" {...S} />
        </g>
      ))}
      <circle cx="194" cy="80" r="14" fill={GOLD_FILL} stroke={GOLD} strokeWidth="2" />
      <circle cx="194" cy="80" r="5" fill={GOLD} />
    </Svg>
  );
}

/** Computational design handing off to a structured development track. */
export function DevelopmentPipeline() {
  return (
    <Svg>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={22 + i * 54}
            y={i === 3 ? 56 : 62}
            width="40"
            height={i === 3 ? 48 : 36}
            rx="8"
            fill={i === 3 ? GOLD_FILL : NAVY_FILL}
            stroke={i === 3 ? GOLD : NAVY}
            strokeWidth={i === 3 ? 2 : 1.5}
          />
          {i < 3 && (
            <path d={`M66 ${80} L${70 + i * 54} 80`} transform={`translate(${i * 54} 0)`} stroke={INK_LINE} strokeWidth="1.6" {...S} />
          )}
        </g>
      ))}
      <path d="M22 122 L202 122" stroke={INK_LINE} strokeWidth="1.2" strokeDasharray="3 4" {...S} />
      <circle cx="202" cy="122" r="4" fill={GOLD} />
    </Svg>
  );
}

/* ─────────────────────────── Story frames ─────────────────────────────── */

/** Ligand still outside the pocket, approaching — the first docking frame. */
export function LigandApproach() {
  return (
    <Svg>
      <PocketBody />
      <g className="sci-approach">
        <Ligand x={196} y={60} />
      </g>
      <path d="M186 74 C176 82 166 86 156 86" stroke={GOLD} strokeWidth="1.4" strokeDasharray="3 5" {...S} />
      <path d="M160 81 L155 86 L161 90" stroke={GOLD} strokeWidth="1.4" {...S} />
    </Svg>
  );
}

/** Two contact traces over simulated time: one persists, one decays. */
export function ContactPersistence() {
  const kept = "M30 50 C44 46 52 54 66 48 C80 42 90 52 104 47 C118 42 128 52 142 46 C156 41 170 50 184 45 C198 41 206 48 214 46";
  const lost = "M30 58 C40 60 46 82 58 92 C70 102 84 108 100 112 C120 116 150 118 214 120";
  return (
    <Svg>
      <path d="M26 24 L26 132 L218 132" stroke={INK_LINE} strokeWidth="1.3" {...S} />
      <rect x="26" y="38" width="192" height="20" fill={GOLD_FILL} opacity="0.6" />
      <path d={lost} stroke="rgba(26,26,26,0.35)" strokeWidth="2" strokeDasharray="4 4" {...S} />
      <path d={kept} stroke={NAVY} strokeWidth="2.4" {...S} />
      <path className="sci-trace" d={kept} stroke={GOLD} strokeWidth="2" {...S} />
      <circle cx="214" cy="46" r="4.5" fill={GOLD} stroke={INK} strokeWidth="1.1" />
      <circle cx="214" cy="120" r="4" fill="rgba(250,247,240,1)" stroke={INK_LINE} strokeWidth="1.4" />
    </Svg>
  );
}

/** Many candidates in, a few prioritised out. */
export function ScreeningFunnel() {
  const dots = [
    [42, 30], [62, 22], [84, 34], [104, 20], [128, 30], [150, 22], [172, 32], [194, 24],
    [52, 44], [76, 48], [100, 40], [124, 46], [148, 42], [172, 48], [190, 40],
  ];
  return (
    <Svg>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.1" />
      ))}
      <path d="M34 58 L206 58 L144 100 L144 120 L96 120 L96 100 Z" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.6" {...S} />
      {[108, 120, 132].map((x) => (
        <circle key={x} className="sci-pulse" cx={x} cy="140" r="6" fill={GOLD} stroke={INK} strokeWidth="1.1" />
      ))}
      <path d="M120 120 L120 130" stroke={GOLD} strokeWidth="1.6" strokeDasharray="2 3" {...S} />
    </Svg>
  );
}

/** Raw FASTQ records: header, bases, quality — the genomics starting point. */
export function FastqFile() {
  return (
    <Svg>
      <rect x="44" y="18" width="152" height="124" rx="8" fill="rgba(250,247,240,0.95)" stroke={NAVY} strokeWidth="1.6" />
      <path d="M44 38 L196 38" stroke={INK_LINE} strokeWidth="1.1" />
      <circle cx="58" cy="28" r="3" fill={GOLD} />
      <circle cx="68" cy="28" r="3" fill={NAVY_FILL_2} />
      {[52, 86, 120].map((y) => (
        <g key={y}>
          <rect x="58" y={y} width="34" height="6" rx="3" fill={NAVY} opacity="0.55" />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={58 + i * 9}
              y={y + 11}
              width="6"
              height="7"
              rx="1.5"
              fill={i === 7 && y === 86 ? GOLD : i % 3 === 0 ? NAVY_FILL_2 : NAVY_FILL}
            />
          ))}
        </g>
      ))}
    </Svg>
  );
}

/** Samples × features matrix with a coherent signal block. */
export function SampleMatrix() {
  return (
    <Svg>
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 10 }).map((_, c) => {
          const hot = c >= 3 && c <= 5 && r >= 2 && r <= 4;
          const v = ((r * 7 + c * 3) % 5) / 5;
          return (
            <rect
              key={`${r}-${c}`}
              x={30 + c * 18}
              y={24 + r * 18}
              width="15"
              height="15"
              rx="2.5"
              fill={hot ? GOLD : `rgba(30,91,168,${0.06 + v * 0.18})`}
            />
          );
        })
      )}
      <rect x="82" y="58" width="57" height="57" rx="4" stroke={INK} strokeWidth="1.2" strokeDasharray="3 3" />
      <path d="M26 138 L214 138" stroke={INK_LINE} strokeWidth="1.2" {...S} />
    </Svg>
  );
}

/** k-fold cross-validation plus a held-out independent cohort. */
export function ValidationFolds() {
  return (
    <Svg>
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          {[0, 1, 2, 3, 4].map((c) => (
            <rect
              key={c}
              x={24 + c * 26}
              y={22 + r * 20}
              width="22"
              height="14"
              rx="3"
              fill={c === r ? GOLD : NAVY_FILL_2}
              stroke={c === r ? GOLD : NAVY}
              strokeWidth="1"
            />
          ))}
        </g>
      ))}
      <path d="M160 22 L160 118" stroke={INK_LINE} strokeWidth="1.2" strokeDasharray="3 4" {...S} />
      <rect x="172" y="42" width="44" height="56" rx="6" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.8" />
      <path d="M184 70 L191 77 L205 62" stroke={INK} strokeWidth="1.8" {...S} />
      <path d="M24 136 L150 136" stroke={NAVY} strokeWidth="1.4" {...S} />
      <path d="M172 136 L216 136" stroke={GOLD} strokeWidth="1.4" {...S} />
    </Svg>
  );
}

/** Genome with exons pulled down by capture probes. */
export function ExomeCapture() {
  const exons = [[34, 16], [70, 10], [98, 22], [146, 14], [178, 20]];
  return (
    <Svg>
      <path d="M20 46 L220 46" stroke={NAVY} strokeWidth="2.4" {...S} />
      {exons.map(([x, w]) => (
        <rect key={x} x={x} y="39" width={w} height="14" rx="3" fill={GOLD} stroke={INK} strokeWidth="0.9" />
      ))}
      {exons.map(([x, w]) => (
        <g key={`p${x}`}>
          <path d={`M${x + w / 2} 56 L${x + w / 2} 92`} stroke={GOLD} strokeWidth="1.3" strokeDasharray="2 3" {...S} />
          <rect x={x} y="96" width={w} height="10" rx="3" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.2" />
          <circle cx={x + w / 2} cy="118" r="4" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.2" />
        </g>
      ))}
      <path d="M20 132 L220 132" stroke={INK_LINE} strokeWidth="1.1" strokeDasharray="3 4" {...S} />
    </Svg>
  );
}

/** Read depth across an exon with a variant position marked. */
export function CoverageTrack() {
  const bars = [10, 18, 30, 44, 58, 66, 70, 72, 71, 69, 66, 60, 50, 36, 22, 12];
  return (
    <Svg>
      {bars.map((h, i) => (
        <rect key={i} x={30 + i * 11.5} y={120 - h} width="9" height={h} rx="2" fill={i === 8 ? GOLD : NAVY_FILL_2} stroke={i === 8 ? GOLD : NAVY} strokeWidth="0.9" />
      ))}
      <path d="M26 120 L218 120" stroke={INK_LINE} strokeWidth="1.2" {...S} />
      <rect x="64" y="130" width="112" height="10" rx="3" fill={GOLD} stroke={INK} strokeWidth="0.9" />
      <path d="M26 132 L64 132 M176 132 L218 132" stroke={NAVY} strokeWidth="2" {...S} />
      <path d="M126 24 L126 44" stroke={GOLD} strokeWidth="1.6" {...S} />
      <circle cx="126" cy="20" r="4.5" fill={GOLD} stroke={INK} strokeWidth="1.1" />
    </Svg>
  );
}

/* ─────────────────────── Dynamics & candidate evaluation ─────────────── */

const BACKBONE = "M22 96 C40 70 58 64 74 80 C90 96 104 60 122 58 C140 56 150 88 168 86 C186 84 198 60 218 66";

/** An ensemble of trajectory frames: the core overlaps, loops and termini spread. */
export function StructuralFluctuation() {
  const frames = [
    { d: "M22 104 C40 74 58 66 74 80 C90 96 104 50 122 50 C140 50 150 90 168 88 C186 86 196 50 218 52", o: 0.32 },
    { d: "M22 86 C40 66 58 62 74 80 C90 96 104 70 122 66 C140 62 150 86 168 84 C186 82 200 72 218 82", o: 0.32 },
    { d: BACKBONE, o: 1 },
  ];
  const rmsf = [8, 14, 6, 4, 5, 18, 26, 12, 5, 4, 6, 9, 20, 30];
  return (
    <Svg>
      {frames.map((f, i) => (
        <path
          key={i}
          className={i < 2 ? "sci-wobble" : undefined}
          style={i === 1 ? { animationDelay: "-1.6s" } : undefined}
          d={f.d}
          stroke={i === 2 ? NAVY : NAVY}
          strokeOpacity={f.o}
          strokeWidth={i === 2 ? 4 : 3}
          {...S}
        />
      ))}
      <circle cx="122" cy="58" r="5" fill={GOLD} stroke={INK} strokeWidth="1.1" />
      <path d="M22 146 L218 146" stroke={INK_LINE} strokeWidth="1.1" {...S} />
      {rmsf.map((h, i) => (
        <rect key={i} x={24 + i * 14} y={146 - h} width="9" height={h} rx="2" fill={h > 16 ? GOLD : NAVY_FILL_2} stroke={h > 16 ? GOLD : NAVY} strokeWidth="0.8" />
      ))}
    </Svg>
  );
}

/** One static structure → movement → three conformational states, with the state visited over time beneath. */
export function ConformationalEnsemble() {
  const stat = "M14 70 C22 44 36 40 44 56 C52 72 62 44 72 50";
  const states = [
    { d: "M124 58 C134 30 150 26 160 44 C170 62 184 30 198 34 C210 38 214 52 224 46", c: NAVY, o: 1, cls: "" },
    { d: "M124 64 C134 44 150 44 160 58 C170 72 184 60 198 66 C210 72 214 84 224 80", c: GOLD, o: 1, cls: "sci-wobble" },
    { d: "M124 52 C134 22 150 14 160 32 C170 50 184 20 198 20 C210 20 214 30 224 22", c: NAVY, o: 0.35, cls: "sci-wobble" },
  ];
  return (
    <Svg>
      <path d={stat} stroke={NAVY} strokeWidth="4" {...S} />
      <text x="44" y="96" textAnchor="middle" fontSize="8.5" letterSpacing="1.1" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">STATIC</text>
      <path d="M84 56 L108 56" stroke={GOLD} strokeWidth="1.8" {...S} />
      <path d="M102 50 L108 56 L102 62" stroke={GOLD} strokeWidth="1.8" {...S} />
      {states.map((s, i) => (
        <path key={i} className={s.cls || undefined} style={i === 2 ? { animationDelay: "-1.6s" } : undefined} d={s.d} stroke={s.c} strokeOpacity={s.o} strokeWidth={i === 0 ? 3.4 : 2.8} {...S} />
      ))}
      <text x="174" y="96" textAnchor="middle" fontSize="8.5" letterSpacing="1.1" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">STATES</text>
      <path d="M14 142 L226 142" stroke={INK_LINE} strokeWidth="1" {...S} />
      {[112, 124, 136].map((y, i) => (
        <text key={y} x="8" y={y + 3} fontSize="7" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">S{i + 1}</text>
      ))}
      <path d="M18 112 L60 112 L60 124 L96 124 L96 112 L130 112 L130 136 L162 136 L162 124 L198 124 L198 112 L226 112" stroke={NAVY} strokeWidth="1.6" {...S} />
      <path className="sci-trace" d="M18 112 L60 112 L60 124 L96 124 L96 112 L130 112 L130 136 L162 136 L162 124 L198 124 L198 112 L226 112" stroke={GOLD} strokeWidth="1.8" {...S} />
    </Svg>
  );
}

/** Three candidates, three persistence traces: one holds, two fade. */
export function CandidateCompare() {
  const rows = [
    { y: 36, d: "M70 40 C90 36 110 42 130 38 C150 34 170 40 214 37", good: true, label: "A" },
    { y: 80, d: "M70 76 C90 90 110 74 130 88 C150 100 170 82 214 94", good: false, label: "B" },
    { y: 124, d: "M70 118 C84 124 98 138 118 142 C140 146 170 146 214 146", good: false, label: "C" },
  ];
  return (
    <Svg>
      {rows.map((r) => (
        <g key={r.label}>
          <rect x="22" y={r.y - 14} width="30" height="28" rx="7" fill={r.good ? GOLD : NAVY_FILL} stroke={r.good ? INK : NAVY} strokeWidth="1.2" />
          <text x="37" y={r.y + 5} textAnchor="middle" fontSize="13" fontFamily="var(--font-inter), sans-serif" fill={INK}>{r.label}</text>
          <path d={`M66 ${r.y + 16} L218 ${r.y + 16}`} stroke={INK_LINE} strokeWidth="0.9" strokeDasharray="2 4" {...S} />
          <path d={r.d} stroke={r.good ? NAVY : "rgba(26,26,26,0.38)"} strokeWidth={r.good ? 2.4 : 1.8} {...S} />
        </g>
      ))}
    </Svg>
  );
}

/** Compound library streaming toward a target pocket; one settles in. */
export function VirtualScreening() {
  const lib = [[30, 34], [52, 24], [40, 58], [64, 46], [28, 86], [56, 78], [44, 112], [66, 104], [34, 132]];
  return (
    <Svg>
      <path
        d="M226 52 C224 62 224 68 222 72 C208 78 180 74 180 84 C180 94 208 90 222 96 C224 100 224 106 226 112 C222 132 188 144 156 139 C132 135 118 116 118 84 C118 52 140 24 172 24 C206 24 226 36 226 52 Z"
        fill={NAVY_FILL}
        stroke={NAVY}
        strokeWidth="1.6"
        {...S}
      />
      {lib.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7} L${x + 6} ${y - 3.5} L${x + 6} ${y + 3.5} L${x} ${y + 7} L${x - 6} ${y + 3.5} L${x - 6} ${y - 3.5} Z`}
          fill={i === 3 ? GOLD_FILL : "rgba(26,26,26,0.05)"}
          stroke={i === 3 ? GOLD : INK_LINE}
          strokeWidth="1.2"
        />
      ))}
      <path d="M80 84 C110 84 140 84 170 84" stroke={GOLD} strokeWidth="1.4" strokeDasharray="3 5" {...S} />
      <g className="sci-enter">
        <path d="M200 77 L207 81 L207 88 L200 92 L193 88 L193 81 Z" fill={GOLD} stroke={INK} strokeWidth="1.1" />
      </g>
    </Svg>
  );
}

/** Predicted-score ranking: bar length is the computational score, not a measured affinity. */
export function CandidateRanking() {
  const bars = [
    { l: "A", w: 150 },
    { l: "B", w: 118 },
    { l: "C", w: 86 },
    { l: "D", w: 58 },
  ];
  return (
    <Svg>
      <text x="24" y="22" fontSize="9" letterSpacing="1.4" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">PREDICTED SCORE</text>
      {bars.map((b, i) => (
        <g key={b.l}>
          <text x="30" y={50 + i * 28} textAnchor="middle" fontSize="12" fontFamily="var(--font-inter), sans-serif" fill={INK}>{b.l}</text>
          <rect x="44" y={38 + i * 28} width={b.w} height="16" rx="4" fill={i === 0 ? GOLD : NAVY_FILL_2} stroke={i === 0 ? GOLD : NAVY} strokeWidth="1" />
        </g>
      ))}
      <path d="M44 32 L44 150" stroke={INK_LINE} strokeWidth="1.1" {...S} />
    </Svg>
  );
}

/** Biological data narrowing through pathway signals to a few candidate targets. */
export function TargetIdentification() {
  const pts = [[26, 30], [40, 52], [30, 76], [48, 98], [28, 120], [44, 136], [58, 40], [60, 116]];
  const path = [[110, 44], [128, 80], [110, 116]];
  return (
    <Svg>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1" />
      ))}
      <path d="M72 80 L92 80" stroke={GOLD} strokeWidth="1.6" {...S} />
      <path d="M88 75 L93 80 L88 85" stroke={GOLD} strokeWidth="1.6" {...S} />
      <path d="M110 44 L128 80 L110 116 M128 80 L156 80" stroke={INK_LINE} strokeWidth="1.4" {...S} />
      {path.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.4" />
      ))}
      <circle cx="128" cy="80" r="8" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.6" />
      <path d="M156 80 L176 80" stroke={GOLD} strokeWidth="1.6" {...S} />
      <path d="M172 75 L177 80 L172 85" stroke={GOLD} strokeWidth="1.6" {...S} />
      <circle className="sci-pulse" cx="200" cy="62" r="12" fill={GOLD_FILL} stroke={GOLD} strokeWidth="2" />
      <circle cx="200" cy="62" r="4.5" fill={GOLD} />
      <circle cx="200" cy="104" r="10" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.4" />
    </Svg>
  );
}

/** Antibody and an engineered variant overlaid for structural comparison. */
export function BiologicsEngineering() {
  return (
    <Svg>
      <g transform="translate(70 90) scale(0.9)">
        <path d="M0 40 L-40 -10" stroke={NAVY} strokeWidth="9" {...S} />
        <path d="M0 40 L40 -10" stroke={NAVY} strokeWidth="9" {...S} />
        <path d="M0 40 L0 80" stroke={NAVY} strokeWidth="11" {...S} />
        <circle cx="-40" cy="-12" r="7" fill={GOLD} stroke={INK} strokeWidth="1.3" />
        <circle cx="40" cy="-12" r="7" fill={GOLD} stroke={INK} strokeWidth="1.3" />
      </g>
      <path d="M118 80 L138 80" stroke={GOLD} strokeWidth="1.8" {...S} />
      <path d="M132 74 L138 80 L132 86" stroke={GOLD} strokeWidth="1.8" {...S} />
      <g transform="translate(180 90) scale(0.9)">
        <path d="M0 40 L-40 -10 M0 40 L40 -10 M0 40 L0 80" stroke={NAVY} strokeOpacity="0.28" strokeWidth="9" {...S} />
        <path d="M0 40 L-36 -14" stroke={NAVY} strokeWidth="4" strokeDasharray="4 4" {...S} />
        <path d="M0 40 L44 -6" stroke={NAVY} strokeWidth="4" strokeDasharray="4 4" {...S} />
        <circle cx="-36" cy="-16" r="7" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.8" />
        <circle cx="44" cy="-8" r="7" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.8" />
      </g>
    </Svg>
  );
}

/** A small analysis panel: deviation and per-residue fluctuation traces. */
export function TrajectoryAnalysis() {
  return (
    <Svg>
      <rect x="18" y="16" width="204" height="60" rx="6" fill="rgba(250,247,240,0.9)" stroke={INK_LINE} strokeWidth="1" />
      <path d="M28 66 C44 60 52 34 70 32 C88 30 110 34 130 32 C150 30 180 34 212 31" stroke={NAVY} strokeWidth="2" {...S} />
      <rect x="18" y="86" width="204" height="60" rx="6" fill="rgba(250,247,240,0.9)" stroke={INK_LINE} strokeWidth="1" />
      <path d="M28 136 L40 128 L50 134 L60 110 L70 132 L84 130 L96 134 L108 104 L118 128 L132 132 L148 130 L160 116 L172 134 L188 132 L200 98 L212 128" stroke={GOLD} strokeWidth="1.8" {...S} />
    </Svg>
  );
}

/* ─────────────────────────── Oncology genomics ───────────────────────── */

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Tumour tissue with atypical cells, feeding a targeted gene panel. */
export function TumourPanel() {
  const cells = [
    [40, 44, 0], [62, 36, 0], [84, 48, 1], [46, 70, 0], [70, 66, 1], [92, 76, 1],
    [38, 96, 0], [62, 96, 0], [86, 104, 1], [50, 122, 0], [74, 124, 0],
  ];
  const genes = [44, 70, 96, 122];
  return (
    <Svg>
      <path d="M22 56 C20 30 60 18 90 26 C118 34 124 70 116 100 C108 132 70 146 42 136 C18 126 24 82 22 56 Z" fill="rgba(244,196,48,0.10)" stroke={NAVY} strokeWidth="1.5" {...S} />
      {cells.map(([x, y, t], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={t ? 9 : 8} fill={t ? GOLD_FILL : "rgba(250,247,240,0.9)"} stroke={t ? GOLD : NAVY} strokeWidth="1.1" />
          <circle cx={x + (t ? 1 : 0)} cy={y} r={t ? 4.2 : 3} fill={t ? GOLD : NAVY_FILL_2} />
        </g>
      ))}
      <path d="M128 80 L146 80" stroke={GOLD} strokeWidth="1.8" {...S} />
      <path d="M140 74 L146 80 L140 86" stroke={GOLD} strokeWidth="1.8" {...S} />
      {genes.map((y, i) => (
        <g key={y}>
          <path d={`M156 ${y} L220 ${y}`} stroke={NAVY} strokeWidth="1.6" {...S} />
          <rect x={166 + (i % 2) * 10} y={y - 5} width="26" height="10" rx="3" fill={GOLD} stroke={INK} strokeWidth="0.8" />
        </g>
      ))}
    </Svg>
  );
}

function Bases({ y, seq, hot = [], gap = [] }: { y: number; seq: string; hot?: number[]; gap?: number[] }) {
  return (
    <g>
      {seq.split("").map((b, i) => {
        const isGap = gap.includes(i);
        const isHot = hot.includes(i);
        return (
          <g key={i}>
            <rect x={28 + i * 23} y={y} width="19" height="26" rx="4" fill={isHot ? GOLD : isGap ? "rgba(26,26,26,0.04)" : NAVY_FILL} stroke={isHot ? INK : isGap ? INK_LINE : NAVY} strokeWidth="1" strokeDasharray={isGap ? "3 3" : undefined} />
            <text x={37.5 + i * 23} y={y + 18} textAnchor="middle" fontSize="13" fontFamily={MONO} fill={isGap ? "#9A9A9A" : INK}>{isGap ? "–" : b}</text>
          </g>
        );
      })}
    </g>
  );
}

/** Reference vs variant: one base changed. */
export function SnvChange() {
  return (
    <Svg>
      <text x="28" y="34" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">REFERENCE</text>
      <Bases y={40} seq="ACTGACG" />
      <text x="28" y="100" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">VARIANT</text>
      <Bases y={106} seq="ACCGACG" hot={[2]} />
      <path d="M83.5 68 L83.5 104" stroke={GOLD} strokeWidth="1.4" strokeDasharray="2 3" {...S} />
    </Svg>
  );
}

/** Reference vs variant: three bases deleted. */
export function IndelChange() {
  return (
    <Svg>
      <text x="28" y="34" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">REFERENCE</text>
      <Bases y={40} seq="ACGTACGT" hot={[4, 5]} />
      <text x="28" y="100" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">VARIANT · DELETION</text>
      <Bases y={106} seq="ACGTACGT" gap={[4, 5]} />
    </Svg>
  );
}

/** Normal, amplified and deleted copy number shown as coverage depth. */
export function CopyNumber() {
  const rows = [
    { l: "NORMAL", w: 84, c: NAVY_FILL_2, s: NAVY },
    { l: "AMPLIFICATION", w: 176, c: GOLD, s: INK },
    { l: "DELETION", w: 40, c: "rgba(26,26,26,0.08)", s: INK_LINE },
  ];
  return (
    <Svg>
      {rows.map((r, i) => (
        <g key={r.l}>
          <text x="28" y={30 + i * 44} fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">{r.l}</text>
          <rect x="28" y={36 + i * 44} width={r.w} height="16" rx="4" fill={r.c} stroke={r.s} strokeWidth="1" />
        </g>
      ))}
    </Svg>
  );
}

/** Two genes joined at a breakpoint into a fusion. */
export function GeneFusion() {
  return (
    <Svg>
      <rect x="22" y="34" width="70" height="20" rx="5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.3" />
      <text x="57" y="48" textAnchor="middle" fontSize="11" fontFamily="var(--font-inter), sans-serif" fill={INK}>Gene A</text>
      <rect x="22" y="106" width="70" height="20" rx="5" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.3" />
      <text x="57" y="120" textAnchor="middle" fontSize="11" fontFamily="var(--font-inter), sans-serif" fill={INK}>Gene B</text>
      <path d="M92 44 C120 44 116 80 138 80 M92 116 C120 116 116 80 138 80" stroke={INK_LINE} strokeWidth="1.5" {...S} />
      <rect x="138" y="68" width="42" height="24" rx="5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1.3" />
      <rect x="180" y="68" width="42" height="24" rx="5" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.3" />
      <path d="M180 62 L180 98" stroke={INK} strokeWidth="1.6" strokeDasharray="2 2" {...S} />
      <text x="180" y="112" textAnchor="middle" fontSize="8.5" letterSpacing="1" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">BREAKPOINT</text>
    </Svg>
  );
}

/** Screening: many panel regions, a few hotspot positions checked. */
export function HotspotScreening() {
  return (
    <Svg>
      {[36, 64, 92, 120].map((y, r) => (
        <g key={y}>
          <path d={`M24 ${y} L216 ${y}`} stroke={NAVY} strokeOpacity="0.35" strokeWidth="6" {...S} />
          {[0, 1, 2, 3, 4, 5].map((c) => {
            const hot = (r === 0 && c === 2) || (r === 1 && c === 4) || (r === 3 && c === 1);
            return <circle key={c} cx={40 + c * 32} cy={y} r={hot ? 7 : 3} fill={hot ? GOLD : NAVY} stroke={hot ? INK : "none"} strokeWidth="1" />;
          })}
        </g>
      ))}
      <circle className="sci-pulse" cx="104" cy="36" r="12" stroke={GOLD} strokeWidth="1.5" />
    </Svg>
  );
}

/** Tumour-only: candidate calls filtered against population and panel-of-normals resources. */
export function TumourOnly() {
  const calls = [[34, 40], [58, 30], [46, 62], [70, 54], [36, 88], [62, 84], [50, 112], [74, 118]];
  return (
    <Svg>
      {calls.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={NAVY_FILL_2} stroke={NAVY} strokeWidth="1" />
      ))}
      <path d="M96 30 L150 30 L136 80 L136 132 L110 132 L110 80 Z" fill={NAVY_FILL} stroke={NAVY} strokeWidth="1.4" {...S} />
      <text x="123" y="60" textAnchor="middle" fontSize="7.5" letterSpacing="0.8" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">FILTERS</text>
      <path d="M152 80 L172 80" stroke={GOLD} strokeWidth="1.6" {...S} />
      <path d="M166 75 L172 80 L166 85" stroke={GOLD} strokeWidth="1.6" {...S} />
      {[64, 96].map((y) => (
        <circle key={y} cx="196" cy={y} r="8" fill={GOLD_FILL} stroke={GOLD} strokeWidth="1.6" strokeDasharray="3 2" />
      ))}
      <text x="196" y="124" textAnchor="middle" fontSize="7.5" letterSpacing="0.8" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">LIKELY</text>
    </Svg>
  );
}

/** Tumour and matched normal aligned for direct comparison. */
export function TumourNormal() {
  const tumour = [3, 6, 9];
  const normal = [6];
  return (
    <Svg>
      <text x="22" y="40" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">TUMOUR</text>
      <text x="22" y="100" fontSize="9" letterSpacing="1.2" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">NORMAL</text>
      {[48, 108].map((y, row) => (
        <g key={y}>
          <path d={`M22 ${y} L218 ${y}`} stroke={NAVY} strokeWidth="2.4" {...S} />
          {(row === 0 ? tumour : normal).map((i) => (
            <circle key={i} cx={22 + i * 19} cy={y} r="6" fill={row === 0 && i !== 6 ? GOLD : NAVY_FILL_2} stroke={row === 0 && i !== 6 ? INK : NAVY} strokeWidth="1.1" />
          ))}
        </g>
      ))}
      {tumour.map((i) => (
        <path key={i} d={`M${22 + i * 19} 56 L${22 + i * 19} 100`} stroke={i === 6 ? INK_LINE : GOLD} strokeWidth="1.2" strokeDasharray="2 3" {...S} />
      ))}
      <text x="22" y="140" fontSize="8.5" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">Gold: tumour only · grey link: shared (inherited)</text>
    </Svg>
  );
}

/** Variant allele fraction across timepoints: persisting, clearing, emerging. */
export function VariantTrajectory() {
  const xs = [48, 120, 192];
  return (
    <Svg>
      <path d="M30 20 L30 128 L214 128" stroke={INK_LINE} strokeWidth="1.2" {...S} />
      {xs.map((x, i) => (
        <g key={x}>
          <path d={`M${x} 124 L${x} 132`} stroke={INK_LINE} strokeWidth="1.2" {...S} />
          <text x={x} y="146" textAnchor="middle" fontSize="10" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">T{i + 1}</text>
        </g>
      ))}
      <path d="M48 48 L120 52 L192 50" stroke={NAVY} strokeWidth="2.2" {...S} />
      <path d="M48 70 L120 100 L192 120" stroke="rgba(26,26,26,0.35)" strokeWidth="2" strokeDasharray="4 3" {...S} />
      <path d="M48 124 L120 96 L192 40" stroke={GOLD} strokeWidth="2.4" {...S} />
      {[[192, 50, NAVY], [192, 120, "rgba(26,26,26,0.35)"], [192, 40, GOLD]].map(([x, y, c]) => (
        <circle key={`${y}`} cx={x as number} cy={y as number} r="4.5" fill={c as string} stroke={INK} strokeWidth="0.8" />
      ))}
      <text x="40" y="16" fontSize="8.5" letterSpacing="1" fontFamily="var(--font-inter), sans-serif" fill="#6B6B6B">VAF</text>
    </Svg>
  );
}

/* ───────────────────────────────── Registry ───────────────────────────── */

export const ILLUSTRATIONS = {
  proteinSmallMolecule: ProteinSmallMolecule,
  proteinProtein: ProteinProtein,
  antibodyAntigen: AntibodyAntigen,
  proteinPeptide: ProteinPeptide,
  proteinDNA: ProteinDNA,
  proteinRNA: ProteinRNA,
  sequenceToStructure: SequenceToStructure,
  dockingPoses: DockingPoses,
  trajectoryMotion: TrajectoryMotion,
  mutationVariant: MutationVariant,
  energyLandscape: EnergyLandscape,
  hydrogenBond: HydrogenBond,
  saltBridge: SaltBridge,
  hydrophobicContact: HydrophobicContact,
  interfaceMap: InterfaceMap,
  sequencingReads: SequencingReads,
  pedigreeSingleton: PedigreeSingleton,
  pedigreeDuo: PedigreeDuo,
  pedigreeTrio: PedigreeTrio,
  variantReport: VariantReport,
  biomarkerNetwork: BiomarkerNetwork,
  libraryDiversity: LibraryDiversity,
  leadOptimization: LeadOptimization,
  researchWorkflow: ResearchWorkflow,
  singleLead: SingleLead,
  deNovoDesign: DeNovoDesign,
  epitopeMap: EpitopeMap,
  developmentPipeline: DevelopmentPipeline,
  ligandApproach: LigandApproach,
  contactPersistence: ContactPersistence,
  screeningFunnel: ScreeningFunnel,
  fastqFile: FastqFile,
  sampleMatrix: SampleMatrix,
  validationFolds: ValidationFolds,
  exomeCapture: ExomeCapture,
  structuralFluctuation: StructuralFluctuation,
  conformationalEnsemble: ConformationalEnsemble,
  candidateCompare: CandidateCompare,
  virtualScreening: VirtualScreening,
  candidateRanking: CandidateRanking,
  targetIdentification: TargetIdentification,
  biologicsEngineering: BiologicsEngineering,
  trajectoryAnalysis: TrajectoryAnalysis,
  tumourPanel: TumourPanel,
  snvChange: SnvChange,
  indelChange: IndelChange,
  copyNumber: CopyNumber,
  geneFusion: GeneFusion,
  hotspotScreening: HotspotScreening,
  tumourOnly: TumourOnly,
  tumourNormal: TumourNormal,
  variantTrajectory: VariantTrajectory,
  coverageTrack: CoverageTrack,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
