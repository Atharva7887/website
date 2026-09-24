/**
 * PDB → Three.js toolkit for the docking scenes: parser, residue grouping,
 * secondary structure, cartoon ribbons, sticks and dashed contacts. Ported
 * from the supplied "Docking 4 _3D image" pages (Three.js r128) to the
 * project's `three`. Coordinates are real (trimmed PDB files in public/pdb);
 * everything derived — pockets, interfaces, contact distances — is computed
 * from them, never typed in.
 */
import * as THREE from "three";

export type Atom = { het: boolean; name: string; resn: string; chain: string; resi: number; ic: string; p: THREE.Vector3; el: string };
export type Residue = { k: string; chain: string; resi: number; resn: string; het: boolean; at: Record<string, Atom>; list: Atom[]; ss?: "H" | "E" | "L"; md?: number };
type SS = { type: "H" | "E"; chain: string; a: number; b: number };

const V3 = THREE.Vector3;
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Brand-mapped palette (secondary sand / element colours only where chemistry needs them). */
export const DOCK = {
  navy: "#1E5BA8",
  sky: "#7FA3D1",
  sand: "#B3A994",
  sandDeep: "#8F8570",
  gold: "#F4C430",
  goldDeep: "#D6A21E",
  N: "#3F6BD8",
  O: "#D6604D",
  S: "#D9B400",
} as const;
export const EL: Record<string, string> = { N: DOCK.N, O: DOCK.O, S: DOCK.S };

export function parse(t: string) {
  const atoms: Atom[] = [], ss: SS[] = [];
  for (const l of t.split("\n")) {
    const rec = l.slice(0, 6);
    if (rec === "ENDMDL") break;
    if (rec === "HELIX ") { ss.push({ type: "H", chain: l[19], a: parseInt(l.slice(21, 25)), b: parseInt(l.slice(33, 37)) }); continue; }
    if (rec === "SHEET ") { ss.push({ type: "E", chain: l[21], a: parseInt(l.slice(22, 26)), b: parseInt(l.slice(33, 37)) }); continue; }
    if (rec !== "ATOM  " && rec !== "HETATM") continue;
    const alt = l[16];
    if (alt && alt !== " " && alt !== "A") continue;
    const e = (l.slice(76, 78).trim() || l.slice(12, 14).trim()).toUpperCase().replace(/[^A-Z]/g, "");
    if (e === "H" || e === "D") continue;
    const resn = l.slice(17, 20).trim();
    if (resn === "HOH" || resn === "WAT") continue;
    atoms.push({
      het: rec === "HETATM", name: l.slice(12, 16).trim(), resn, chain: l[21], resi: parseInt(l.slice(22, 26)), ic: l[26] || " ",
      p: new V3(parseFloat(l.slice(30, 38)), parseFloat(l.slice(38, 46)), parseFloat(l.slice(46, 54))), el: e,
    });
  }
  return { atoms, ss };
}

const TEXT = new Map<string, Promise<string>>();
/** Fetch once per session; callers re-parse, since scenes transform atom positions in place. */
export async function loadPdb(id: string) {
  if (!TEXT.has(id)) TEXT.set(id, fetch(`/pdb/${id}.pdb`).then((r) => { if (!r.ok) throw new Error(`PDB ${id}: ${r.status}`); return r.text(); }));
  return parse(await TEXT.get(id)!);
}

export function residues(atoms: Atom[]) {
  const m = new Map<string, Residue>(), order: Residue[] = [];
  atoms.forEach((a) => {
    const k = a.chain + ":" + a.resi + a.ic;
    if (!m.has(k)) { const r: Residue = { k, chain: a.chain, resi: a.resi, resn: a.resn, het: a.het, at: {}, list: [] }; m.set(k, r); order.push(r); }
    const r = m.get(k)!;
    r.at[a.name] = a;
    r.list.push(a);
  });
  return order;
}

export function assignSS(res: Residue[], ss: SS[]) {
  if (ss.length) {
    res.forEach((r) => { r.ss = "L"; for (const s of ss) if (s.chain === r.chain && r.resi >= s.a && r.resi <= s.b) { r.ss = s.type; break; } });
    return;
  }
  const byChain: Record<string, Residue[]> = {};
  res.forEach((r) => { if (r.at.CA) (byChain[r.chain] ||= []).push(r); });
  Object.values(byChain).forEach((c) => {
    c.forEach((r) => (r.ss = "L"));
    for (let i = 0; i + 3 < c.length; i++) {
      const d3 = c[i].at.CA.p.distanceTo(c[i + 3].at.CA.p), d2 = c[i].at.CA.p.distanceTo(c[i + 2].at.CA.p);
      if (d3 > 4.6 && d3 < 5.6 && d2 > 5.2 && d2 < 6.0) for (let k = 0; k < 4; k++) c[i + k].ss = "H";
    }
    for (let i = 0; i + 2 < c.length; i++) { if (c[i].ss !== "L") continue; if (c[i].at.CA.p.distanceTo(c[i + 2].at.CA.p) > 6.3) c[i].ss = "E"; }
    for (let i = 1; i + 1 < c.length; i++) if (c[i].ss === "E" && c[i - 1].ss !== "E" && c[i + 1].ss !== "E") c[i].ss = "L";
  });
}

export function segments(res: Residue[]) {
  const segs: Residue[][] = [];
  let cur: Residue[] = [];
  res.forEach((r) => {
    if (r.het || !r.at.CA) return;
    const prev = cur[cur.length - 1];
    if (prev && (prev.chain !== r.chain || prev.at.CA.p.distanceTo(r.at.CA.p) > 4.3)) { if (cur.length > 2) segs.push(cur); cur = []; }
    cur.push(r);
  });
  if (cur.length > 2) segs.push(cur);
  return segs;
}

/** Cartoon ribbon for one chain segment; `altFn` gives a per-residue highlight colour to blend towards. */
export function ribbonMesh(sg: Residue[], color: string, altFn?: (r: Residue) => string | null) {
  const n = sg.length, pts = sg.map((r) => r.at.CA.p), G: THREE.Vector3[] = [];
  let pg: THREE.Vector3 | null = null;
  sg.forEach((r) => {
    let g: THREE.Vector3 | null = null;
    if (r.at.O && r.at.C) g = r.at.O.p.clone().sub(r.at.C.p).normalize();
    if (!g) g = pg ? pg.clone() : new V3(0, 1, 0);
    if (pg && g.dot(pg) < 0) g.negate();
    G.push(g);
    pg = g;
  });
  const cv = new THREE.CatmullRomCurve3(pts, false, "centripetal"), SPR = 8, N = (n - 1) * SPR + 1;
  const P: THREE.Vector3[] = [], T: THREE.Vector3[] = [], Wd: number[] = [], Ht: number[] = [], AR: boolean[] = [], Sd: THREE.Vector3[] = [];
  for (let j = 0; j < N; j++) {
    const u = j / (N - 1), fi = u * (n - 1), i0 = Math.min(Math.floor(fi), n - 1), i1 = Math.min(i0 + 1, n - 1), f = fi - i0, a = sg[i0].ss, b = sg[i1].ss;
    let w = 0.32, h = 0.32, ar = false;
    if (a === "H" && b === "H") { w = 1.45; h = 0.3; }
    else if (a === "E" && b === "E") { w = 1.25; h = 0.3; if (i1 === n - 1 || sg[i1 + 1].ss !== "E") { w = 2.05 * (1 - f) + 0.3 * f; ar = true; } }
    P.push(cv.getPoint(u)); T.push(cv.getTangent(u).normalize()); Wd.push(w); Ht.push(h); AR.push(ar);
    Sd.push(G[i0].clone().lerp(G[i1], f));
  }
  const sm = (A: number[]) => A.map((x, j) => { if (AR[j]) return x; let s = 0, c = 0; for (let k = -4; k <= 4; k++) { const q = j + k; if (q < 0 || q >= N || AR[q]) continue; s += A[q]; c++; } return s / c; });
  const W = sm(Wd), H = sm(Ht);
  const S: THREE.Vector3[] = [];
  let ps: THREE.Vector3 | null = null;
  for (let j = 0; j < N; j++) {
    let s = Sd[j].clone().addScaledVector(T[j], -Sd[j].dot(T[j]));
    if (s.lengthSq() < 1e-6) s = ps ? ps.clone() : new V3(0, 1, 0);
    s.normalize();
    if (ps && s.dot(ps) < 0) s.negate();
    S.push(s);
    ps = s;
  }
  const M = 12, pos = new Float32Array(N * M * 3), col = new Float32Array(N * M * 3), base = new Float32Array(N * M * 3), alt = new Float32Array(N * M * 3), idx: number[] = [];
  const c = new THREE.Color(color), a2c = new THREE.Color();
  for (let j = 0; j < N; j++) {
    const t = T[j], s = new V3();
    for (let k = -3; k <= 3; k++) s.add(S[Math.max(0, Math.min(N - 1, j + k))]);
    s.addScaledVector(t, -s.dot(t)).normalize();
    const nr = new V3().crossVectors(t, s);
    const ac = altFn ? altFn(sg[Math.min(Math.round(j / SPR), n - 1)]) : null;
    const a2 = ac ? a2c.set(ac) : c;
    for (let k = 0; k < M; k++) {
      const ph = (k / M) * Math.PI * 2, p = P[j].clone().addScaledVector(s, W[j] * Math.cos(ph)).addScaledVector(nr, H[j] * Math.sin(ph)), o = (j * M + k) * 3;
      pos[o] = p.x; pos[o + 1] = p.y; pos[o + 2] = p.z;
      col[o] = base[o] = c.r; col[o + 1] = base[o + 1] = c.g; col[o + 2] = base[o + 2] = c.b;
      alt[o] = a2.r; alt[o + 1] = a2.g; alt[o + 2] = a2.b;
    }
  }
  for (let j = 0; j < N - 1; j++) for (let k = 0; k < M; k++) { const a = j * M + k, b = j * M + ((k + 1) % M), cc = (j + 1) * M + k, d = (j + 1) * M + ((k + 1) % M); idx.push(a, cc, b, b, cc, d); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.userData = { base, alt };
  return g;
}

/** Blend every ribbon's colours between base (0) and highlight (1). */
export function blendRibbons(ribs: THREE.BufferGeometry[], h: number) {
  ribs.forEach((geo) => {
    const { base, alt } = geo.userData as { base: Float32Array; alt: Float32Array };
    const c = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < c.length; i++) c[i] = base[i] + (alt[i] - base[i]) * h;
    geo.attributes.color.needsUpdate = true;
  });
}

export function bondsOf(list: Atom[]) {
  const B: [Atom, Atom][] = [];
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const d = list[i].p.distanceTo(list[j].p); if (d < 1.95 && d > 0.4) B.push([list[i], list[j]]); }
  return B;
}

/** Direction from `c` with the fewest atoms in a cylinder — the pocket mouth. */
export function openDir(atoms: Atom[], c: THREE.Vector3, len: number, rad: number) {
  let best = new V3(0, 1, 0), bc = 1e9;
  const N = 90;
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), ph = i * 2.399963, d = new V3(Math.cos(ph) * r, y, Math.sin(ph) * r);
    let n = 0;
    for (const a of atoms) { const v = a.p.clone().sub(c), t = v.dot(d); if (t < 0 || t > len) continue; if (v.lengthSq() - t * t < rad * rad) n++; }
    if (n < bc) { bc = n; best = d; }
  }
  return best;
}

export const BACKBONE = ["N", "C", "O", "OXT"];
export const centroid = (A: Atom[]) => { const c = new V3(); A.forEach((a) => c.add(a.p)); return c.divideScalar(Math.max(1, A.length)); };

/** Thin side-chain lines for everything off the interface. */
export function sideLines(res: Residue[], colorOf: (r: Residue) => string, skip: (r: Residue) => boolean, opacity: number) {
  const lp: number[] = [], lc: number[] = [], c = new THREE.Color();
  res.forEach((r) => {
    if (skip(r)) return;
    c.set(colorOf(r)).multiplyScalar(0.8);
    bondsOf(r.list.filter((a) => !BACKBONE.includes(a.name))).forEach(([a, b]) => { lp.push(a.p.x, a.p.y, a.p.z, b.p.x, b.p.y, b.p.z); lc.push(c.r, c.g, c.b, c.r, c.g, c.b); });
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(lc, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity }));
}

const UP = new V3(0, 1, 0);
export const CYL = () => new THREE.CylinderGeometry(1, 1, 1, 10);

export function stick(geo: THREE.BufferGeometry, a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material, parent: THREE.Object3D) {
  const d = b.clone().sub(a), L = d.length();
  if (L < 0.01) return;
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.scale.set(r, L, r);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
  parent.add(m);
}

/** Dashed contact between two points (H-bond / salt bridge). */
export function dashes(geo: THREE.BufferGeometry, a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material, parent: THREE.Object3D) {
  const d = b.clone().sub(a), L = d.length(), dir = d.clone().normalize(), n = 6, sg = L / (n * 2 - 1);
  for (let k = 0; k < n; k++) {
    const s = a.clone().addScaledVector(dir, sg * 2 * k), e = s.clone().addScaledVector(dir, sg);
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(s).add(e).multiplyScalar(0.5);
    m.scale.set(r, sg, r);
    m.quaternion.setFromUnitVectors(UP, dir);
    parent.add(m);
  }
}

export function disposeTree(root: THREE.Object3D) {
  const seen = new Set<unknown>();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry && !seen.has(m.geometry)) { seen.add(m.geometry); m.geometry.dispose(); }
    const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
    mats.forEach((x) => { if (!seen.has(x)) { seen.add(x); x.dispose(); } });
  });
}
