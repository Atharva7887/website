// Renders PDB coordinates into Goodsell-style space-filling SVGs for public/structures.
// Usage: node scripts/render-pdb.mjs <dir containing 1IGT.pdb 3HFM.pdb 1HSG.pdb 1BRS.pdb>
// Source files: https://files.rcsb.org/download/<ID>.pdb (PDB data is CC0). Not committed.
import fs from "node:fs";
import path from "node:path";

const PDB_DIR = path.resolve(process.argv[2] ?? "pdb");
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../public/structures");
fs.mkdirSync(OUT, { recursive: true });

function parse(id) {
  const atoms = [];
  for (const line of fs.readFileSync(path.join(PDB_DIR, `${id}.pdb`), "utf8").split(/\r?\n/)) {
    if (line.startsWith("ENDMDL")) break;
    const rec = line.slice(0, 6).trim();
    if (rec !== "ATOM" && rec !== "HETATM") continue;
    const resn = line.slice(17, 20).trim();
    if (resn === "HOH") continue;
    const el = (line.slice(76, 78).trim() || line.slice(12, 14).trim()[0]).toUpperCase();
    if (el === "H") continue;
    const alt = line[16];
    if (alt !== " " && alt !== "A") continue;
    atoms.push({
      het: rec === "HETATM",
      name: line.slice(12, 16).trim(),
      resn,
      chain: line[21],
      resi: parseInt(line.slice(22, 26), 10),
      x: +line.slice(30, 38), y: +line.slice(38, 46), z: +line.slice(46, 54),
      b: +line.slice(60, 66) || 0,
    });
  }
  return atoms;
}

function center(atoms) {
  const n = atoms.length;
  const c = atoms.reduce((a, p) => ({ x: a.x + p.x / n, y: a.y + p.y / n, z: a.z + p.z / n }), { x: 0, y: 0, z: 0 });
  for (const p of atoms) { p.x -= c.x; p.y -= c.y; p.z -= c.z; }
}

// Principal axes via power iteration, so the longest dimension lies horizontal.
function pcaAlign(atoms) {
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of atoms) {
    const v = [p.x, p.y, p.z];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += v[i] * v[j];
  }
  const axes = [];
  let M = C.map((r) => r.slice());
  for (let k = 0; k < 2; k++) {
    let v = [1, 0.3, 0.2];
    for (let it = 0; it < 200; it++) {
      const w = [0, 1, 2].map((i) => M[i][0] * v[0] + M[i][1] * v[1] + M[i][2] * v[2]);
      const n = Math.hypot(...w); v = w.map((x) => x / n);
    }
    const lam = [0, 1, 2].reduce((s, i) => s + v[i] * (M[i][0] * v[0] + M[i][1] * v[1] + M[i][2] * v[2]), 0);
    axes.push(v);
    M = M.map((r, i) => r.map((x, j) => x - lam * v[i] * v[j]));
  }
  const [a, b] = axes;
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  for (const p of atoms) {
    const v = [p.x, p.y, p.z];
    p.x = v[0] * a[0] + v[1] * a[1] + v[2] * a[2];
    p.y = v[0] * b[0] + v[1] * b[1] + v[2] * b[2];
    p.z = v[0] * c[0] + v[1] * c[1] + v[2] * c[2];
  }
}

function rotate(atoms, { x = 0, y = 0, z = 0 }) {
  const r = (d) => (d * Math.PI) / 180;
  for (const p of atoms) {
    let { x: X, y: Y, z: Z } = p;
    [Y, Z] = [Y * Math.cos(r(x)) - Z * Math.sin(r(x)), Y * Math.sin(r(x)) + Z * Math.cos(r(x))];
    [X, Z] = [X * Math.cos(r(y)) + Z * Math.sin(r(y)), -X * Math.sin(r(y)) + Z * Math.cos(r(y))];
    [X, Y] = [X * Math.cos(r(z)) - Y * Math.sin(r(z)), X * Math.sin(r(z)) + Y * Math.cos(r(z))];
    Object.assign(p, { x: X, y: Y, z: Z });
  }
}

/** Residues in `setA` chains with any atom within `cut` Å of an atom in `setB` chains. */
function interfaceResidues(atoms, chainsA, chainsB, cut = 4.5) {
  const A = atoms.filter((p) => chainsA.includes(p.chain) && !p.het);
  const B = atoms.filter((p) => chainsB.includes(p.chain) && !p.het);
  const cell = cut;
  const grid = new Map();
  const key = (x, y, z) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  for (const p of B) { const k = key(p.x, p.y, p.z); (grid.get(k) ?? grid.set(k, []).get(k)).push(p); }
  const out = new Set();
  for (const p of A) {
    const [i, j, k] = [p.x, p.y, p.z].map((v) => Math.floor(v / cell));
    outer: for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      for (const q of grid.get(`${i + a},${j + b},${k + c}`) ?? []) {
        if ((p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 < cut * cut) { out.add(`${p.chain}${p.resi}`); break outer; }
      }
    }
  }
  return out;
}

function mix(hex, t, to = [250, 247, 240]) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (to[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const dark = (hex, t) => mix(hex, t, [20, 24, 40]);

function render(id, atoms, { colorOf, groupOf = () => "", radius = 1.8, px = 0.7, style = "", title, file, width = 640, moving = false }) {
  // Coarse z-buffer: keep only atoms that are front-most somewhere within their disk.
  const minX = Math.min(...atoms.map((p) => p.x)) - radius, maxX = Math.max(...atoms.map((p) => p.x)) + radius;
  const minY = Math.min(...atoms.map((p) => p.y)) - radius, maxY = Math.max(...atoms.map((p) => p.y)) + radius;
  const W = Math.ceil((maxX - minX) / px), H = Math.ceil((maxY - minY) / px);
  const zbuf = new Float32Array(W * H).fill(-Infinity), owner = new Int32Array(W * H).fill(-1);
  atoms.forEach((p, idx) => {
    const r = p.r ?? radius;
    const cx = (p.x - minX) / px, cy = (maxY - p.y) / px, rp = r / px;
    for (let yy = Math.max(0, Math.floor(cy - rp)); yy <= Math.min(H - 1, Math.ceil(cy + rp)); yy++)
      for (let xx = Math.max(0, Math.floor(cx - rp)); xx <= Math.min(W - 1, Math.ceil(cx + rp)); xx++) {
        const d2 = (xx - cx) ** 2 + (yy - cy) ** 2;
        if (d2 > rp * rp) continue;
        const zs = p.z + Math.sqrt(rp * rp - d2) * px;
        const k = yy * W + xx;
        if (zs > zbuf[k]) { zbuf[k] = zs; owner[k] = idx; }
      }
  });
  // Animated groups are never culled — hidden atoms can come into view as they move.
  const visible = new Set(owner);
  const keep = atoms.filter((p, i) => visible.has(i) || (moving && groupOf(p)));
  keep.sort((a, b) => a.z - b.z);
  const zMin = Math.min(...keep.map((p) => p.z)), zMax = Math.max(...keep.map((p) => p.z));
  const f = (v) => Math.round(v * 10) / 10;
  const groups = new Map();
  for (const p of keep) {
    const g = groupOf(p);
    const depth = (zMax - p.z) / (zMax - zMin || 1);
    const base = colorOf(p);
    const fill = mix(base, depth * 0.38);
    const s = `<circle cx="${f(p.x - minX)}" cy="${f(maxY - p.y)}" r="${f(p.r ?? radius)}" fill="${fill}" stroke="${dark(base, 0.35)}"/>`;
    (groups.get(g) ?? groups.set(g, []).get(g)).push(s);
  }
  const vw = f(maxX - minX), vh = f(maxY - minY);
  let body = "";
  for (const [g, list] of groups) body += g ? `<g class="${g}">${list.join("")}</g>` : list.join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${width}" height="${Math.round((width * vh) / vw)}"><title>${title}</title><style>circle{stroke-width:.22}${style}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${body}</svg>`;
  fs.writeFileSync(path.join(OUT, file), svg);
  console.log(file, `${keep.length}/${atoms.length} atoms`, `${(svg.length / 1024).toFixed(0)} KB`, `aspect ${(vw / vh).toFixed(2)}`);
}

const NAVY = "#1E5BA8", NAVY_L = "#7FA6DA", GOLD = "#F4C430", GOLD_D = "#C9920F", SAND = "#D8CFBD", INK = "#3A3A3A";

/* 1IGT — intact IgG2a. Heavy chains navy, light chains pale navy, glycans gold. */
{
  const a = parse("1IGT"); center(a); pcaAlign(a); rotate(a, { z: 90, x: 20 });
  render("1IGT", a, {
    file: "igg-antibody-1igt.svg",
    title: "Intact IgG antibody, PDB 1IGT",
    radius: 2.0, px: 0.9,
    colorOf: (p) => (p.het ? GOLD : p.chain === "B" || p.chain === "D" ? NAVY : NAVY_L),
  });
}

/* 1IGT again — variable domains (approximate Fv boundaries) in gold: where library diversity lives. */
{
  const a = parse("1IGT"); center(a); pcaAlign(a); rotate(a, { z: 90, x: 20 });
  const fv = (p) => !p.het && ((["A", "C"].includes(p.chain) && p.resi <= 107) || (["B", "D"].includes(p.chain) && p.resi <= 117));
  render("1IGT", a, {
    file: "igg-variable-domains-1igt.svg",
    title: "Intact IgG antibody with variable domains highlighted, PDB 1IGT",
    radius: 2.0, px: 0.9,
    colorOf: (p) => (fv(p) ? (["B", "D"].includes(p.chain) ? GOLD_D : GOLD) : p.het ? SAND : ["B", "D"].includes(p.chain) ? NAVY : NAVY_L),
    groupOf: (p) => (fv(p) ? "fv" : ""),
    style: ".fv{animation:pulse 3.6s ease-in-out infinite}@keyframes pulse{50%{opacity:.6}}",
  });
}

/* 3HFM — HyHEL-10 Fab bound to lysozyme; computed paratope/epitope in gold. */
{
  const a = parse("3HFM"); center(a); pcaAlign(a); rotate(a, { z: -90, x: 25 });
  const epi = interfaceResidues(a, ["Y"], ["H", "L"]);
  const para = interfaceResidues(a, ["H", "L"], ["Y"]);
  const k = (p) => `${p.chain}${p.resi}`;
  render("3HFM", a, {
    file: "fab-lysozyme-3hfm.svg",
    title: "Antibody Fab bound to lysozyme with epitope and paratope highlighted, PDB 3HFM",
    colorOf: (p) => (p.chain === "Y" ? (epi.has(k(p)) ? GOLD_D : SAND) : para.has(k(p)) ? GOLD : p.chain === "H" ? NAVY : NAVY_L),
    groupOf: (p) => (epi.has(k(p)) || para.has(k(p)) ? "iface" : ""),
    style: ".iface{animation:pulse 3.2s ease-in-out infinite}@keyframes pulse{50%{opacity:.55}}",
  });
  console.log("  3HFM epitope residues:", epi.size, "paratope residues:", para.size);
}

/* 1HSG — HIV-1 protease with bound indinavir (MK1). Cutaway over the pocket. */
{
  const a = parse("1HSG"); center(a); pcaAlign(a); rotate(a, { x: -90 });
  const lig = a.filter((p) => p.resn === "MK1");
  const lc = lig.reduce((s, p) => ({ x: s.x + p.x / lig.length, y: s.y + p.y / lig.length, z: s.z + p.z / lig.length }), { x: 0, y: 0, z: 0 });
  const cut = a.filter((p) => p.resn === "MK1" || !(p.z > lc.z + 1 && Math.hypot(p.x - lc.x, p.y - lc.y) < 13));
  for (const p of cut) if (p.resn === "MK1") p.z += 40;
  render("1HSG", cut, {
    file: "protease-ligand-1hsg.svg",
    title: "HIV-1 protease with bound ligand, cutaway view, PDB 1HSG",
    colorOf: (p) => (p.resn === "MK1" ? GOLD : p.chain === "A" ? NAVY : NAVY_L),
    groupOf: (p) => (p.resn === "MK1" ? "lig" : ""), moving: true,
    style: ".lig{animation:dock 7s cubic-bezier(.16,1,.3,1) infinite}@keyframes dock{0%{transform:translate(38px,-26px);opacity:0}12%{opacity:1}45%,88%{transform:none;opacity:1}100%{transform:none;opacity:0}}",
  });
}

/* 1BRS — barnase (A) with barstar (D). Barstar docks in; interface highlighted. */
{
  const all = parse("1BRS");
  const a = all.filter((p) => (p.chain === "A" || p.chain === "D") && !p.het);
  center(a); pcaAlign(a); rotate(a, { x: 90 });
  const iA = interfaceResidues(a, ["A"], ["D"]), iD = interfaceResidues(a, ["D"], ["A"]);
  const k = (p) => `${p.chain}${p.resi}`;
  render("1BRS", a, {
    file: "barnase-barstar-1brs.svg",
    title: "Barnase and barstar protein–protein complex with the interface highlighted, PDB 1BRS",
    colorOf: (p) => (p.chain === "A" ? (iA.has(k(p)) ? GOLD_D : NAVY) : iD.has(k(p)) ? GOLD : SAND),
    groupOf: (p) => (p.chain === "D" ? "partner" : ""), moving: true,
    style: ".partner{animation:assoc 8s cubic-bezier(.16,1,.3,1) infinite}@keyframes assoc{0%{transform:translate(24px,0)}40%,85%{transform:none}100%{transform:translate(24px,0)}}",
  });
}
