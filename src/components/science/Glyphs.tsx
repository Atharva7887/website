/**
 * Small concept glyphs (48×48) for workflow steps, question cards, inputs and
 * deliverables — the places a full illustration would be too heavy but a bare
 * number says nothing. Same palette and stroke language as Illustrations.tsx.
 * Always decorative: the adjacent title carries the meaning.
 */

const NAVY = "#1E5BA8";
const GOLD = "#F4C430";
const NF = "rgba(30,91,168,0.12)";
const GF = "rgba(244,196,48,0.3)";
const LINE = "rgba(26,26,26,0.25)";

const s = { stroke: NAVY, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const g = { ...s, stroke: GOLD, strokeWidth: 2 } as const;
const l = { ...s, stroke: LINE, strokeWidth: 1.3 } as const;

const GLYPHS = {
  target: (<><circle cx="24" cy="24" r="16" {...s} fill={NF} /><circle cx="24" cy="24" r="9" {...s} /><circle cx="24" cy="24" r="3.5" fill={GOLD} /></>),
  sequence: (<>{[6, 15, 24, 33].map((x, i) => <rect key={x} x={x} y="18" width="8" height="12" rx="2" {...(i === 2 ? g : s)} fill={i === 2 ? GF : NF} />)}</>),
  structure: (<><path d="M14 40 C34 36 34 28 16 25 C0 22 12 12 32 10" {...s} strokeWidth={4} /><path d="M14 40 C34 36 34 28 16 25 C0 22 12 12 32 10" {...g} strokeWidth={1.2} strokeDasharray="2 4" /></>),
  prep: (<><path d="M10 30 C6 18 16 8 26 10 C38 12 42 24 36 32 C30 40 14 40 10 30 Z" {...s} fill={NF} /><circle cx="36" cy="12" r="3" fill={GOLD} /><circle cx="42" cy="22" r="2" fill={GOLD} /><circle cx="8" cy="14" r="2" fill={GOLD} /></>),
  dock: (<><path d="M6 12 C20 10 22 18 22 24 C22 30 20 38 6 36 Z" {...s} fill={NF} /><path d="M42 14 C30 14 28 20 28 24 C28 28 30 34 42 34 Z" {...s} fill={GF} stroke={GOLD} /><path d="M23 24 L27 24" {...g} strokeDasharray="1 2" /></>),
  pose: (<><path d="M24 12 L33 17 L33 29 L24 34 L15 29 L15 17 Z" {...g} fill={GF} /><circle cx="24" cy="23" r="3.5" {...g} strokeWidth={1.2} /><path d="M33 17 L40 12" {...g} /></>),
  rank: (<>{[30, 22, 15, 9].map((h, i) => <rect key={i} x={8 + i * 9} y={40 - h} width="6" height={h} rx="2" {...(i === 0 ? g : s)} fill={i === 0 ? GF : NF} />)}<path d="M6 42 L42 42" {...l} /></>),
  cluster: (<>{[[14, 16], [19, 12], [17, 21], [32, 30], [36, 26], [30, 36], [34, 35]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={i < 3 ? GOLD : NF} {...(i < 3 ? {} : s)} />)}<circle cx="17" cy="16" r="9" {...l} strokeDasharray="2 3" /></>),
  select: (<><circle cx="24" cy="24" r="16" {...s} fill={NF} /><path d="M16 24 L22 30 L33 18" {...g} strokeWidth={2.6} /></>),
  interaction: (<><circle cx="13" cy="24" r="7" {...s} fill={NF} /><circle cx="35" cy="24" r="7" {...g} fill={GF} /><path d="M20 24 L28 24" {...g} strokeDasharray="2 3" /></>),
  visualise: (<><path d="M24 8 L38 16 L38 32 L24 40 L10 32 L10 16 Z" {...s} fill={NF} /><path d="M10 16 L24 24 L38 16 M24 24 L24 40" {...s} /><circle cx="24" cy="24" r="2.5" fill={GOLD} /></>),
  report: (<><rect x="12" y="7" width="24" height="34" rx="3" {...s} fill="rgba(250,247,240,0.9)" /><path d="M17 15 L31 15 M17 21 L31 21 M17 27 L26 27" {...l} /><rect x="17" y="31" width="14" height="4" rx="1" fill={GOLD} /></>),
  table: (<><rect x="8" y="10" width="32" height="28" rx="3" {...s} fill={NF} /><path d="M8 19 L40 19 M8 28 L40 28 M19 10 L19 38 M30 10 L30 38" {...s} strokeWidth={1.1} /><rect x="20" y="20" width="9" height="7" fill={GF} /></>),
  map: (<>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={9 + c * 11} y={9 + r * 11} width="9" height="9" rx="2" fill={(r === 1 && c > 0) || (r === 2 && c === 1) ? GOLD : NF} {...l} strokeWidth={0.8} />))}</>),
  compare: (<><rect x="9" y="18" width="10" height="22" rx="2" {...s} fill={NF} /><rect x="29" y="10" width="10" height="30" rx="2" {...g} fill={GF} /><path d="M14 10 L22 10 M26 44 L34 44" {...l} /></>),
  stable: (<><path d="M6 38 L42 38" {...l} /><path d="M6 30 C12 26 14 18 20 20 C26 22 34 20 42 21" {...s} strokeWidth={2} /><path d="M30 8 L34 12 L41 5" {...g} /></>),
  persist: (<><path d="M6 38 L42 38" {...l} />{[8, 14, 20, 26, 32, 38].map((x) => <circle key={x} cx={x} cy="24" r="2.6" fill={GOLD} />)}<path d="M8 24 L38 24" {...g} strokeWidth={1} /></>),
  residues: (<>{[8, 17, 26, 35].map((x, i) => <circle key={x} cx={x + 2} cy={i % 2 ? 20 : 28} r="5" {...(i === 2 ? g : s)} fill={i === 2 ? GOLD : NF} />)}<path d="M10 28 L19 20 L28 28 L37 20" {...l} /></>),
  rearrange: (<><path d="M36 16 A14 14 0 0 0 12 20" {...s} strokeWidth={2} /><path d="M12 32 A14 14 0 0 0 36 28" {...g} /><path d="M36 9 L36 16 L29 16 M12 39 L12 32 L19 32" {...s} /></>),
  equilibrate: (<><rect x="20" y="6" width="8" height="26" rx="4" {...s} fill={NF} /><circle cx="24" cy="36" r="6" {...g} fill={GF} /><path d="M24 30 L24 16" {...g} /><path d="M32 12 L37 12 M32 18 L36 18 M32 24 L37 24" {...l} /></>),
  production: (<><rect x="10" y="10" width="28" height="28" rx="4" {...s} fill={NF} /><path d="M20 18 L30 24 L20 30 Z" {...g} fill={GOLD} />{[16, 24, 32].map((v) => <path key={v} d={`M${v} 6 L${v} 10 M${v} 38 L${v} 42 M6 ${v} L10 ${v} M38 ${v} L42 ${v}`} {...l} />)}</>),
  trajectory: (<><path d="M6 38 L42 38" {...l} /><path d="M6 30 C12 18 18 34 24 24 C30 14 36 28 42 16" {...s} strokeWidth={2} /><circle cx="24" cy="24" r="3.2" fill={GOLD} /></>),
  energy: (<><path d="M8 8 L8 40 L42 40" {...l} /><path d="M10 12 C16 14 16 32 22 32 C28 32 28 20 32 20 C36 20 36 30 42 30" {...s} strokeWidth={2} /><circle cx="22" cy="32" r="3" fill={GOLD} /></>),
  qc: (<><circle cx="21" cy="21" r="11" {...s} fill={NF} /><path d="M29 29 L40 40" {...s} strokeWidth={3} /><path d="M16 21 L20 25 L27 17" {...g} /></>),
  fastq: (<><rect x="10" y="6" width="28" height="36" rx="3" {...s} fill="rgba(250,247,240,0.9)" />{[13, 19, 25, 31].map((y, i) => <path key={y} d={`M15 ${y} L${i % 2 ? 29 : 33} ${y}`} {...(i === 1 ? g : l)} strokeWidth={2.2} strokeDasharray="2 1.5" />)}</>),
  align: (<><path d="M6 12 L42 12" {...s} strokeWidth={2.6} />{[[8, 20, 20], [16, 27, 22], [11, 34, 26]].map(([x, y, w]) => <rect key={y} x={x} y={y} width={w} height="4" rx="2" {...s} strokeWidth={1} fill={NF} />)}<path d="M24 12 L24 40" {...g} strokeWidth={1.2} strokeDasharray="2 2" /></>),
  variant: (<>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={6 + i * 8} y="16" width="6" height="16" rx="1.5" {...(i === 2 ? g : s)} fill={i === 2 ? GOLD : NF} strokeWidth={1.1} />)}<path d="M24 8 L24 13 M24 35 L24 40" {...g} /></>),
  annotate: (<><path d="M8 10 L26 10 L40 24 L26 38 L8 38 Z" {...s} fill={NF} /><circle cx="16" cy="18" r="3" fill={GOLD} /><path d="M15 28 L28 28" {...l} /></>),
  classify: (<>{[0, 1, 2].map((i) => <rect key={i} x={6 + i * 13} y={22} width="10" height="18" rx="2" {...(i === 0 ? g : s)} fill={i === 0 ? GF : NF} />)}<path d="M24 6 L24 16 M24 16 L11 20 M24 16 L37 20" {...l} /><circle cx="24" cy="6" r="2.5" fill={GOLD} /></>),
  data: (<><ellipse cx="24" cy="12" rx="14" ry="5" {...s} fill={NF} /><path d="M10 12 L10 36 C10 42 38 42 38 36 L38 12" {...s} /><path d="M10 24 C10 30 38 30 38 24" {...s} /><circle cx="30" cy="33" r="2.5" fill={GOLD} /></>),
  signal: (<><path d="M6 40 L42 40" {...l} /><path d="M6 34 L12 32 L16 36 L20 14 L24 34 L28 30 L32 33 L36 22 L42 34" {...s} /><circle cx="20" cy="14" r="3" fill={GOLD} /></>),
  network: (<>{[[12, 12, 24, 22], [24, 22, 36, 12], [24, 22, 16, 36], [24, 22, 36, 34], [12, 12, 16, 36]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} {...(i < 2 ? g : l)} strokeWidth={i < 2 ? 1.6 : 1.1} />)}{[[12, 12], [36, 12], [16, 36], [36, 34]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" {...s} fill={NF} />)}<circle cx="24" cy="22" r="4.5" fill={GOLD} /></>),
  pathway: (<><path d="M8 34 C16 34 16 14 24 14 C32 14 32 34 40 34" {...s} strokeWidth={1.8} /><circle cx="8" cy="34" r="3.5" {...s} fill={NF} /><circle cx="24" cy="14" r="4" fill={GOLD} /><circle cx="40" cy="34" r="3.5" {...s} fill={NF} /></>),
  shortlist: (<><path d="M10 12 L32 12 M10 22 L28 22 M10 32 L24 32" {...l} strokeWidth={2} /><path d="M37 26 L39.5 31 L45 31.5 L41 35 L42 40.5 L37 38 L32 40.5 L33 35 L29 31.5 L34.5 31 Z" {...g} fill={GOLD} strokeWidth={1} /></>),
  validate: (<><rect x="10" y="8" width="28" height="32" rx="3" {...s} fill={NF} /><path d="M15 17 L18 20 L23 14 M15 29 L18 32 L23 26" {...g} /><path d="M27 17 L33 17 M27 29 L33 29" {...l} /></>),
  library: (<>{[14, 22, 18, 30, 16, 26, 20].map((h, i) => <rect key={i} x={6 + i * 5.4} y={40 - h} width="3.6" height={h} rx="1.8" fill={i === 3 ? GOLD : NF} {...(i === 3 ? {} : s)} strokeWidth={0.9} />)}</>),
  search: (<>{[[10, 12], [16, 30], [34, 38], [38, 14], [12, 40]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill={NF} {...s} strokeWidth={0.9} />)}<circle cx="23" cy="21" r="9" {...s} fill="rgba(250,247,240,0.8)" /><circle cx="23" cy="21" r="2.6" fill={GOLD} /><path d="M30 28 L38 36" {...s} strokeWidth={2.6} /></>),
  candidate: (<><path d="M24 6 L40 24 L24 42 L8 24 Z" {...g} fill={GF} /><path d="M24 14 L32 24 L24 34 L16 24 Z" {...s} fill={NF} /></>),
  lead: (<><path d="M24 10 L38 24 L24 38 L10 24 Z" fill={GOLD} {...g} stroke="#1A1A1A" strokeWidth={1.2} />{[[24, 3, 24, 6], [45, 24, 42, 24], [24, 45, 24, 42], [3, 24, 6, 24]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} {...g} />)}</>),
  objective: (<><path d="M12 42 L12 6" {...s} strokeWidth={2} /><path d="M12 8 L36 8 L30 15 L36 22 L12 22" {...g} fill={GF} /></>),
  share: (<><path d="M10 26 L10 38 L38 38 L38 26" {...s} /><path d="M24 30 L24 8 M16 16 L24 8 L32 16" {...g} strokeWidth={2.2} /></>),
  orientation: (<><path d="M14 30 C8 22 14 10 24 10 C34 10 40 22 34 30 C28 38 20 38 14 30 Z" {...s} fill={NF} /><path d="M38 38 A18 18 0 0 1 8 36" {...g} /><path d="M8 30 L8 36 L14 36" {...g} /></>),
  pocket: (<><path d="M36 14 C34 18 24 18 24 24 C24 30 34 30 36 34 C32 42 12 44 8 30 C4 16 18 4 36 14 Z" {...s} fill={NF} /><circle cx="31" cy="24" r="4" fill={GOLD} /></>),
  hotspot: (<><path d="M10 30 C6 16 18 6 30 9 C42 12 44 28 36 36 C28 44 14 42 10 30 Z" {...s} fill={NF} /><circle cx="26" cy="22" r="7" fill={GF} /><circle cx="26" cy="22" r="3" fill={GOLD} /><circle cx="17" cy="30" r="2" fill={GOLD} /></>),
  epitope: (<><path d="M10 30 C6 16 18 6 30 9 C42 12 44 28 36 36 C28 44 14 42 10 30 Z" {...s} fill={NF} /><ellipse cx="20" cy="20" rx="6" ry="4.5" {...g} fill={GF} /><ellipse cx="31" cy="31" rx="5" ry="4" {...g} fill={GF} /></>),
  interface: (<><path d="M24 6 C30 14 18 20 24 28 C30 36 18 40 24 44" {...g} strokeWidth={2.6} /><path d="M20 8 C8 12 6 36 20 42" {...s} /><path d="M28 8 C40 12 42 36 28 42" {...s} /></>),
  sar: (<><path d="M18 14 L26 18.5 L26 27.5 L18 32 L10 27.5 L10 18.5 Z" {...s} fill={NF} /><path d="M26 18.5 L34 14 M26 27.5 L34 32" {...s} /><circle cx="37" cy="12" r="4" fill={GOLD} /><circle cx="37" cy="34" r="4" {...g} fill={GF} /></>),
  model: (<><path d="M12 38 C32 34 32 26 14 23 C0 20 12 10 32 8" {...s} strokeWidth={3.4} /><rect x="30" y="30" width="14" height="4" rx="2" fill={NF} /><rect x="30" y="30" width="9" height="4" rx="2" fill={GOLD} /></>),
  complex: (<><path d="M24 8 C16 8 8 14 8 24 C8 34 16 40 24 40 C20 32 20 16 24 8 Z" {...s} fill={NF} /><path d="M26 8 C34 8 40 14 40 24 C40 34 34 40 26 40 C30 32 30 16 26 8 Z" {...g} fill={GF} /></>),
  milestone: (<><path d="M6 36 L42 36" {...l} strokeDasharray="2 3" />{[10, 24, 38].map((x, i) => <g key={x}><path d={`M${x} 36 L${x} ${16 + i * 0}`} {...s} /><path d={`M${x} 16 L${x + 8} 19 L${x} 22`} {...(i === 2 ? g : s)} fill={i === 2 ? GOLD : NF} /></g>)}</>),
  developability: (<><path d="M8 34 A16 16 0 0 1 40 34" {...s} strokeWidth={4} stroke={NF} /><path d="M8 34 A16 16 0 0 1 32 20" {...g} strokeWidth={4} /><path d="M24 34 L32 22" {...s} strokeWidth={2} /><circle cx="24" cy="34" r="3" fill={NAVY} /></>),
  optimise: (<>{[12, 24, 36].map((x, i) => <g key={x}><path d={`M${x} 8 L${x} 40`} {...l} /><circle cx={x} cy={[28, 16, 22][i]} r="4.5" {...(i === 1 ? g : s)} fill={i === 1 ? GOLD : NF} /></g>)}</>),
  characterise: (<><path d="M24 6 L41 18 L35 38 L13 38 L7 18 Z" {...l} /><path d="M24 12 L36 20 L31 33 L16 34 L12 20 Z" {...s} fill={NF} /><circle cx="36" cy="20" r="2.6" fill={GOLD} /></>),
  handoff: (<><rect x="26" y="12" width="16" height="24" rx="3" {...g} fill={GF} /><path d="M6 24 L22 24 M16 18 L22 24 L16 30" {...s} strokeWidth={2} /></>),
  person: (<><circle cx="24" cy="16" r="7" {...s} fill={NF} /><path d="M10 40 C10 30 38 30 38 40" {...s} /><rect x="16" y="37" width="16" height="5" rx="2.5" fill={GOLD} /></>),
  inheritance: (<><circle cx="12" cy="12" r="5.5" {...s} fill="rgba(250,247,240,0.9)" /><rect x="30.5" y="6.5" width="11" height="11" rx="2" {...s} fill="rgba(250,247,240,0.9)" /><path d="M12 18 L12 23 L36 23 L36 18 M24 23 L24 30" {...s} /><rect x="18.5" y="30" width="11" height="11" rx="2" {...g} fill={GOLD} /></>),
  gpu: (<><rect x="8" y="14" width="32" height="20" rx="3" {...s} fill={NF} /><rect x="14" y="19" width="10" height="10" rx="1.5" fill={GOLD} /><path d="M28 20 L35 20 M28 24 L35 24 M28 28 L35 28" {...l} /></>),
  range: (<><path d="M6 30 L42 30" {...l} />{[6, 42].map((x) => <path key={x} d={`M${x} 24 L${x} 36`} {...s} />)}<rect x="12" y="27" width="22" height="6" rx="3" fill={GOLD} /><path d="M6 16 L42 16" {...s} strokeDasharray="2 3" /></>),
  /* Omics modalities */
  dna: (<><path d="M14 6 C34 16 14 32 34 42" {...s} strokeWidth={2} /><path d="M34 6 C14 16 34 32 14 42" {...g} />{[12, 20, 28, 36].map((y) => <path key={y} d={`M18 ${y} L30 ${y}`} {...l} />)}</>),
  rna: (<><path d="M6 30 C12 18 18 18 24 26 C30 34 36 34 42 20" {...s} strokeWidth={2} />{[10, 18, 26, 34].map((x, i) => <path key={x} d={`M${x} ${[25, 20, 29, 30][i]} L${x} ${[33, 12, 37, 22][i]}`} {...(i === 2 ? g : l)} />)}</>),
  protein: (<><path d="M10 30 C4 18 14 6 26 8 C38 10 44 22 38 32 C32 42 16 42 10 30 Z" {...s} fill={NF} /><path d="M16 26 C20 16 28 30 32 20" {...g} /></>),
  metabolite: (<><path d="M16 12 L23 16 L23 24 L16 28 L9 24 L9 16 Z" {...s} fill={NF} /><path d="M32 22 L38 25.5 L38 32.5 L32 36 L26 32.5 L26 25.5 Z" {...g} fill={GF} /><path d="M23 24 L26 25.5" {...s} /></>),
  cell: (<><circle cx="24" cy="24" r="17" {...s} fill={NF} /><circle cx="21" cy="21" r="6.5" {...g} fill={GF} /><circle cx="32" cy="31" r="2" fill={NAVY} /><circle cx="15" cy="32" r="1.6" fill={NAVY} /></>),
  immune: (<><path d="M24 26 L14 12 M24 26 L34 12 M24 26 L24 42" {...s} strokeWidth={3.4} /><circle cx="14" cy="11" r="3.2" fill={GOLD} /><circle cx="34" cy="11" r="3.2" fill={GOLD} /></>),
  imaging: (<><rect x="7" y="9" width="34" height="30" rx="3" {...s} fill="rgba(250,247,240,0.9)" /><path d="M13 32 C18 22 22 30 26 22 C30 14 34 26 36 20" {...s} /><circle cx="26" cy="22" r="3.4" fill={GOLD} /></>),
  /* Biomarker decision types */
  diagnostic: (<><circle cx="21" cy="21" r="11" {...s} fill={NF} /><path d="M29 29 L40 40" {...s} strokeWidth={3} /><path d="M21 15 L21 27 M15 21 L27 21" {...g} /></>),
  prognostic: (<><path d="M6 40 L42 40" {...l} /><path d="M8 34 C16 32 20 24 28 20 C34 17 38 12 40 8" {...s} strokeWidth={2} strokeDasharray="0" /><path d="M34 8 L40 8 L40 14" {...g} /></>),
  predictive: (<><path d="M8 24 L20 24" {...s} strokeWidth={2} /><path d="M20 24 C26 24 26 12 34 12 M20 24 C26 24 26 36 34 36" {...l} /><circle cx="38" cy="12" r="4" fill={GOLD} /><circle cx="38" cy="36" r="4" {...s} fill={NF} /><circle cx="8" cy="24" r="3" fill={NAVY} /></>),
  pharmacodynamic: (<><circle cx="24" cy="24" r="15" {...s} fill={NF} /><circle cx="24" cy="24" r="4" fill={GOLD} /><path d="M4 24 L12 24 L15 18 L18 30 L21 24" {...g} /></>),
  monitoring: (<><path d="M6 40 L42 40" {...l} />{[[10, 30], [18, 26], [26, 28], [34, 18], [40, 14]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.8" fill={x === 40 ? GOLD : NAVY} />)}<path d="M10 30 L18 26 L26 28 L34 18 L40 14" {...l} /></>),
  safety: (<><path d="M24 6 L38 12 L38 24 C38 33 31 39 24 42 C17 39 10 33 10 24 L10 12 Z" {...s} fill={NF} /><path d="M24 16 L24 27" {...g} strokeWidth={2.6} /><circle cx="24" cy="33" r="1.8" fill={GOLD} /></>),
  risk: (<><circle cx="15" cy="16" r="5" {...s} fill={NF} /><circle cx="33" cy="16" r="5" {...g} fill={GF} /><path d="M6 38 C6 28 24 28 24 38 M24 38 C24 28 42 28 42 38" {...l} /><path d="M33 26 L33 30" {...g} /></>),
} as const;

export type GlyphName = keyof typeof GLYPHS;

export default function Glyph({
  name,
  className = "h-12 w-12",
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
      {GLYPHS[name]}
    </svg>
  );
}

/** Glyph in the standard soft tile used on cards and pipeline steps. */
export function GlyphTile({
  name,
  size = "md",
  tone = "cream",
}: {
  name: GlyphName;
  size?: "sm" | "md" | "lg";
  tone?: "cream" | "navy";
}) {
  const box = { sm: "h-10 w-10 rounded-xl", md: "h-14 w-14 rounded-2xl", lg: "h-[4.5rem] w-[4.5rem] rounded-2xl" }[size];
  const icon = { sm: "h-7 w-7", md: "h-10 w-10", lg: "h-12 w-12" }[size];
  const bg = tone === "navy" ? "bg-navy/[0.07] border-navy/15" : "bg-cream-50 border-black/[0.06]";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center border ${bg} ${box}`}>
      <Glyph name={name} className={icon} />
    </span>
  );
}
