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
  coverageTrack: CoverageTrack,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
