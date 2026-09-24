/**
 * The three structure scenes for Docking → What we analyse, ported from the
 * supplied pages. Each is built from a real PDB entry:
 *   pose      — 1HSG: HIV-1 protease; indinavir samples trial poses, then settles
 *               into its deposited position; pocket residues and H-bonds appear.
 *   interface — 1BRS: barstar approaches barnase; interface residues (≤ 4.5 Å)
 *               and polar contacts (≤ 3.5 Å) light up.
 *   residues  — 3HFM: HyHEL-10 Fv–lysozyme; the interface is walked pair by pair
 *               with contact type and distance.
 * Contacts and distances are computed from the coordinates. The trial-pose
 * docking scores are illustrative and labelled so.
 */
import * as THREE from "three";
import {
  DOCK, EL, BACKBONE, seg, ease, clamp, residues, assignSS, segments, ribbonMesh, blendRibbons, openDir, centroid,
  bondsOf, sideLines, stick, dashes, CYL, type Atom, type Residue, type parse,
} from "./pdb";

export type DockSceneKey = "pose" | "interface" | "residues";
export const DOCK_PDB: Record<DockSceneKey, string> = { pose: "1HSG", interface: "1BRS", residues: "3HFM" };

export type DockScene = {
  root: THREE.Group;
  rad: number;
  camY: number;
  /** A representative moment for the reduced-motion still. */
  still: number;
  update: (t: number, cam: THREE.Camera, w: number, h: number) => void;
};

type Data = ReturnType<typeof parse>;
type Overlay = { layer: HTMLElement; setChip: (t: string) => void };

const V3 = THREE.Vector3;
const ribMat = () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0, side: THREE.DoubleSide });
const LABEL = "absolute -translate-x-1/2 -translate-y-[125%] whitespace-nowrap rounded-md border border-black/10 bg-[#FFFDF8] px-2 py-1 font-sans text-[11px] leading-tight text-ink shadow-sm transition-opacity duration-300 motion-reduce:transition-none";

function label(layer: HTMLElement, text: string) {
  const e = document.createElement("div");
  e.className = LABEL;
  e.textContent = text;
  e.style.opacity = "0";
  layer.appendChild(e);
  return e;
}

const tmp = new V3();
/** Project a point in `space` onto the overlay; hide it when it's behind the molecule. */
function place(e: HTMLElement, v: THREE.Vector3, space: THREE.Object3D, cam: THREE.Camera, w: number, h: number, show: boolean, depth: number) {
  tmp.copy(v).applyMatrix4(space.matrixWorld);
  const front = tmp.z > depth;
  tmp.project(cam);
  e.style.left = `${(tmp.x * 0.5 + 0.5) * w}px`;
  e.style.top = `${(-tmp.y * 0.5 + 0.5) * h}px`;
  e.style.opacity = show && front ? "1" : "0";
}

const pdbRes = (r: Residue) => `${r.resn} ${r.resi}`;

/* ---------- 1HSG: binding-pose prediction ---------- */

function pose(data: Data, ov: Overlay): DockScene {
  const CFG = { ligand: "MK1", chainColors: [DOCK.sky, DOCK.navy], pocket: DOCK.sandDeep, lig: DOCK.gold, poses: ["−6.8", "−7.4", "−8.1"], top: "−9.6", hbondCut: 3.5, pocketCut: 4.5, spin: 0.22 };
  const root = new THREE.Group(), g = new THREE.Group();
  root.add(g);
  const res = residues(data.atoms);
  assignSS(res, data.ss);
  const prot = res.filter((r) => !r.het), protAtoms = data.atoms.filter((a) => !a.het);
  let ligRes = res.filter((r) => r.het && r.resn === CFG.ligand);
  if (!ligRes.length) ligRes = res.filter((r) => r.het && r.list.length >= 6).sort((a, b) => b.list.length - a.list.length).slice(0, 1);
  const lig = ligRes.length ? ligRes[0].list : [];
  const center = centroid(protAtoms);
  const Lc = lig.length ? centroid(lig) : center.clone();
  // Turn the pocket mouth towards the viewer's upper side.
  const out = new V3(0, 1, 0.25).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(openDir(protAtoms, Lc, 30, 5), out);
  data.atoms.forEach((a) => a.p.sub(center).applyQuaternion(q));
  Lc.sub(center).applyQuaternion(q);

  const chains = [...new Set(prot.map((r) => r.chain))];
  const cc = (ch: string) => CFG.chainColors[chains.indexOf(ch) % CFG.chainColors.length];
  const rm = ribMat();
  segments(res).forEach((s) => g.add(new THREE.Mesh(ribbonMesh(s, cc(s[0].chain)), rm)));
  prot.forEach((r) => { let md = 1e9; r.list.forEach((a) => lig.forEach((b) => { md = Math.min(md, a.p.distanceTo(b.p)); })); r.md = md; });
  const pocket = new Set(prot.filter((r) => (r.md ?? 1e9) < CFG.pocketCut).map((r) => r.k));
  g.add(sideLines(prot, (r) => cc(r.chain), (r) => pocket.has(r.k), 0.75));

  const CY = CYL(), SP = new THREE.SphereGeometry(1, 14, 10), mc: Record<string, THREE.MeshStandardMaterial> = {};
  const mat = (h: string, fade = false) => (mc[h + (fade ? "o" : "")] ||= new THREE.MeshStandardMaterial({ color: h, roughness: 0.4, metalness: 0, transparent: fade, opacity: 1 }));
  const ec = (a: Atom, carbon: string) => (a.el === "C" ? carbon : EL[a.el] ?? carbon);
  const pk = new THREE.Group();
  g.add(pk);
  prot.forEach((r) => {
    if (!pocket.has(r.k)) return;
    bondsOf(r.list.filter((a) => !BACKBONE.includes(a.name))).forEach(([a, b]) => {
      const m = a.p.clone().add(b.p).multiplyScalar(0.5);
      stick(CY, a.p, m, 0.13, mat(ec(a, CFG.pocket), true), pk);
      stick(CY, m, b.p, 0.13, mat(ec(b, CFG.pocket), true), pk);
    });
  });
  const lgGrp = new THREE.Group();
  g.add(lgGrp);
  lig.forEach((a) => {
    const m = new THREE.Mesh(SP, mat(ec(a, CFG.lig)));
    m.position.copy(a.p).sub(Lc);
    m.scale.setScalar(0.3);
    lgGrp.add(m);
  });
  bondsOf(lig).forEach(([a, b]) => {
    const pa = a.p.clone().sub(Lc), pb = b.p.clone().sub(Lc), m = pa.clone().add(pb).multiplyScalar(0.5);
    stick(CY, pa, m, 0.2, mat(ec(a, CFG.lig)), lgGrp);
    stick(CY, m, pb, 0.2, mat(ec(b, CFG.lig)), lgGrp);
  });

  // Up to four ligand–protein polar contacts, one per residue, shortest first.
  type HB = { a: Atom; b: Atom; r: Residue; d: number; lab?: HTMLElement; anchor?: THREE.Vector3 };
  const HBs: HB[] = [];
  const polL = lig.filter((a) => a.el === "N" || a.el === "O"), seen = new Set<string>(), cand: HB[] = [];
  prot.forEach((r) => r.list.forEach((b) => { if (b.el !== "N" && b.el !== "O") return; polL.forEach((a) => { const d = a.p.distanceTo(b.p); if (d < CFG.hbondCut) cand.push({ a, b, r, d }); }); }));
  cand.sort((x, y) => x.d - y.d).forEach((h) => { if (seen.has(h.r.k) || HBs.length >= 4) return; seen.add(h.r.k); HBs.push(h); });
  const hbMat = new THREE.MeshBasicMaterial({ color: DOCK.goldDeep, transparent: true, opacity: 0 });
  const hbG = new THREE.Group();
  g.add(hbG);
  HBs.forEach((h) => {
    dashes(CY, h.a.p, h.b.p, 0.07, hbMat, hbG);
    h.lab = label(ov.layer, `${pdbRes(h.r)}${chains.length > 1 ? ` (${h.r.chain})` : ""} · ${h.d.toFixed(1)} Å`);
    h.anchor = h.b.p.clone().lerp(h.a.p, 0.5);
  });

  let rad = 0;
  prot.forEach((r) => { if (r.at.CA) rad = Math.max(rad, r.at.CA.p.length()); });
  rad += 3;
  const E = (a: number, b: number, c: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(a, b, c));
  const side = new V3().crossVectors(out, new V3(1, 0, 0)).normalize(), side2 = new V3().crossVectors(out, side);
  const at = (k: number, s1: number, s2: number) => Lc.clone().addScaledVector(out, k).addScaledVector(side, s1).addScaledVector(side2, s2);
  type Key = { p: THREE.Vector3; q: THREE.Quaternion; s: number };
  const far: Key = { p: at(rad * 1.6, 6, 4), q: E(1.2, 0.4, 2.6), s: 0 };
  const tr: Key[] = [{ p: at(11, 3, 2), q: E(0.9, 2.1, 0.3), s: 1 }, { p: at(7, -2.5, 1.5), q: E(2.4, 0.4, 1.7), s: 1 }, { p: at(3.5, 1, -1.5), q: E(0.3, 3.0, 2.2), s: 1 }];
  const nat: Key = { p: Lc.clone(), q: new THREE.Quaternion(), s: 1 };
  const K: [number, Key][] = [[0, far], [1.6, tr[0]], [2.3, tr[0]], [3.3, tr[1]], [4.0, tr[1]], [5.0, tr[2]], [5.7, tr[2]], [7.2, nat], [11.5, nat], [12.5, far]];
  const T = 12.5;
  const pkMats = Object.entries(mc).filter(([k]) => k.endsWith("o")).map(([, m]) => m);
  const P = new V3(), Q = new THREE.Quaternion(), spinQ = new THREE.Quaternion(), spinAx = new V3(0.3, 1, 0.2).normalize();

  return {
    root, rad, camY: 0.08, still: 9,
    update(t, cam, w, h) {
      const u = t % T;
      let k = 0;
      while (k < K.length - 2 && u > K[k + 1][0]) k++;
      const [ta, A] = K[k], [tb, B] = K[k + 1], f = ease(seg(u, ta, tb));
      P.copy(A.p).lerp(B.p, f);
      Q.copy(A.q).slerp(B.q, f);
      lgGrp.quaternion.copy(spinQ.setFromAxisAngle(spinAx, u < 1.6 ? (1.6 - u) * 2 : 0).multiply(Q));
      lgGrp.position.copy(P);
      lgGrp.scale.setScalar(Math.max(0.001, A.s + (B.s - A.s) * f));
      const dock = ease(seg(u, 7.0, 7.9)) * (1 - ease(seg(u, 11.4, 12.1)));
      pkMats.forEach((m) => (m.opacity = 0.25 + 0.75 * dock));
      hbMat.opacity = dock;
      if (u < 1.6) ov.setChip("Sampling binding poses");
      else if (u < 6.4) { const i = u < 2.9 ? 0 : u < 4.6 ? 1 : 2; ov.setChip(`Pose ${i + 1} of 20 · docking score ${CFG.poses[i]} (illustrative)`); }
      else if (u < 11.5) ov.setChip(`Top-ranked pose · docking score ${CFG.top} (illustrative) · ${HBs.length} H-bond${HBs.length === 1 ? "" : "s"} · ${pocket.size} pocket residues`);
      else ov.setChip("Real structure · PDB 1HSG");
      root.rotation.y = t * CFG.spin;
      root.updateMatrixWorld(true);
      HBs.forEach((x) => place(x.lab!, x.anchor!, g, cam, w, h, dock > 0.6, -rad * 0.35));
    },
  };
}

/* ---------- shared interface detection (grid-hashed, 4.5 Å) ---------- */

function interfaceOf(aA: Atom[], aB: Atom[], resOf: Map<Atom, Residue>, cut: number, visit: (a: Atom, b: Atom, d: number) => void) {
  const grid = new Map<string, Atom[]>(), key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  aB.forEach((b) => { const k = key(Math.floor(b.p.x / cut), Math.floor(b.p.y / cut), Math.floor(b.p.z / cut)); (grid.get(k) ?? grid.set(k, []).get(k)!).push(b); });
  const ifs = new Set<string>();
  aA.forEach((a) => {
    const x = Math.floor(a.p.x / cut), y = Math.floor(a.p.y / cut), z = Math.floor(a.p.z / cut);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const L = grid.get(key(x + dx, y + dy, z + dz));
      if (!L) continue;
      for (const b of L) {
        const d = a.p.distanceTo(b.p);
        if (d >= cut) continue;
        ifs.add(resOf.get(a)!.k);
        ifs.add(resOf.get(b)!.k);
        visit(a, b, d);
      }
    }
  });
  return ifs;
}
const polar = (a: Atom) => a.el === "N" || a.el === "O";

/* ---------- 1BRS: binding interface characterization ---------- */

function iface(data: Data, ov: Overlay): DockScene {
  const CFG = { chainA: "A", chainB: "D", nameA: "barnase", nameB: "Barstar", colorA: DOCK.navy, colorB: DOCK.sand, hi: DOCK.gold, cut: 4.5, hb: 3.5, maxLabels: 3, separation: 26, spin: 0.2 };
  const root = new THREE.Group(), g = new THREE.Group();
  root.add(g);
  const all = residues(data.atoms);
  assignSS(all, data.ss);
  const rA = all.filter((r) => !r.het && r.chain === CFG.chainA), rB = all.filter((r) => !r.het && r.chain === CFG.chainB);
  const aA = rA.flatMap((r) => r.list), aB = rB.flatMap((r) => r.list);
  const cA = centroid(aA), cB = centroid(aB);
  const mid = cA.clone().add(cB).multiplyScalar(0.5), q = new THREE.Quaternion().setFromUnitVectors(cB.clone().sub(cA).normalize(), new V3(1, 0, 0));
  aA.concat(aB).forEach((a) => a.p.sub(mid).applyQuaternion(q));
  const cBn = centroid(aB);
  const resOf = new Map<Atom, Residue>();
  all.forEach((r) => r.list.forEach((a) => resOf.set(a, r)));
  type HB = { a: Atom; b: Atom; d: number; ra: Residue; rb: Residue; lab?: HTMLElement; anchor?: THREE.Vector3 };
  const pol: HB[] = [];
  const ifs = interfaceOf(aA, aB, resOf, CFG.cut, (a, b, d) => { if (d < CFG.hb && d > 2.3 && polar(a) && polar(b)) pol.push({ a, b, d, ra: resOf.get(a)!, rb: resOf.get(b)! }); });
  const ifA = new Set(rA.filter((r) => ifs.has(r.k)).map((r) => r.k)), ifB = new Set(rB.filter((r) => ifs.has(r.k)).map((r) => r.k));
  pol.sort((x, y) => x.d - y.d);
  const HBs: HB[] = [], seenP = new Set<string>();
  pol.forEach((h) => { const k = h.ra.k + "|" + h.rb.k; if (seenP.has(k)) return; seenP.add(k); HBs.push(h); });

  const gA = new THREE.Group(), gB = new THREE.Group();
  g.add(gA, gB);
  const ribs: THREE.BufferGeometry[] = [], rm = ribMat();
  const addRibbons = (res: Residue[], color: string, set: Set<string>, grp: THREE.Group) =>
    segments(res).forEach((s) => { const geo = ribbonMesh(s, color, (r) => (set.has(r.k) ? CFG.hi : null)); ribs.push(geo); grp.add(new THREE.Mesh(geo, rm)); });
  addRibbons(rA, CFG.colorA, ifA, gA);
  addRibbons(rB, CFG.colorB, ifB, gB);
  gA.add(sideLines(rA, () => CFG.colorA, (r) => ifA.has(r.k), 0.7));
  gB.add(sideLines(rB, () => CFG.colorB, (r) => ifB.has(r.k), 0.7));
  const CY = CYL(), mc: Record<string, THREE.MeshStandardMaterial> = {};
  const mat = (h: string) => (mc[h] ||= new THREE.MeshStandardMaterial({ color: h, roughness: 0.4, metalness: 0, transparent: true, opacity: 0.3 }));
  const addSticks = (res: Residue[], set: Set<string>, grp: THREE.Group) =>
    res.forEach((r) => {
      if (!set.has(r.k)) return;
      bondsOf(r.list.filter((a) => !BACKBONE.includes(a.name))).forEach(([a, b]) => {
        const m = a.p.clone().add(b.p).multiplyScalar(0.5);
        stick(CY, a.p, m, 0.14, mat(EL[a.el] ?? DOCK.goldDeep), grp);
        stick(CY, m, b.p, 0.14, mat(EL[b.el] ?? DOCK.goldDeep), grp);
      });
    });
  addSticks(rA, ifA, gA);
  addSticks(rB, ifB, gB);
  const hbMat = new THREE.MeshBasicMaterial({ color: DOCK.goldDeep, transparent: true, opacity: 0 });
  const hbG = new THREE.Group();
  g.add(hbG);
  HBs.forEach((h) => dashes(CY, h.a.p, h.b.p, 0.07, hbMat, hbG));
  HBs.slice(0, CFG.maxLabels).forEach((h) => {
    h.lab = label(ov.layer, `${pdbRes(h.ra)} (${h.ra.chain})  ↔  ${pdbRes(h.rb)} (${h.rb.chain}) · ${h.d.toFixed(1)} Å`);
    h.anchor = h.a.p.clone().lerp(h.b.p, 0.5);
  });
  let rad = 0;
  aA.concat(aB).forEach((a) => (rad = Math.max(rad, a.p.length())));
  rad = rad * 0.85 + CFG.separation * 0.35;
  const stickMats = Object.values(mc), ax = new V3(0.2, 1, 0.3).normalize(), T = 12, nIf = ifA.size + ifB.size;
  let lastH = -1;
  const setIface = (h: number) => { if (Math.abs(h - lastH) < 0.01) return; lastH = h; blendRibbons(ribs, h); };
  const labs = HBs.filter((x) => x.lab);

  return {
    root, rad, camY: 0.08, still: 6,
    update(t, cam, w, hh) {
      const u = t % T;
      const sep = u < 3.5 ? 1 - ease(u / 3.5) : u > 10.3 ? ease(seg(u, 10.3, 12)) : 0, d = CFG.separation * sep;
      gB.quaternion.setFromAxisAngle(ax, 1.1 * sep);
      tmp.copy(cBn).applyQuaternion(gB.quaternion);
      gB.position.copy(cBn).sub(tmp).add(new V3(d, 0, 0));
      const h = ease(seg(u, 3.4, 4.4)) * (1 - ease(seg(u, 9.8, 10.5)));
      setIface(h);
      stickMats.forEach((m) => (m.opacity = 0.08 + 0.92 * h));
      hbMat.opacity = h;
      ov.setChip(u < 3.5 ? `${CFG.nameB} approaching ${CFG.nameA}` : h > 0.5 ? `${nIf} interface residues (≤ ${CFG.cut} Å) · ${HBs.length} H-bonds / salt bridges (≤ ${CFG.hb} Å)` : "Real structure · PDB 1BRS");
      root.rotation.y = 0.55 * Math.sin(t * CFG.spin);
      root.rotation.x = 0.12 * Math.sin(t * 0.17);
      root.updateMatrixWorld(true);
      const maxShown = w < 520 ? 1 : CFG.maxLabels; // narrow cards: one label, so the complex stays visible
      labs.forEach((x, i) => place(x.lab!, x.anchor!, g, cam, w, hh, h > 0.6 && i < maxShown, -rad * 0.4));
      // Nudge overlapping labels apart vertically.
      const vl = labs.filter((x) => x.lab!.style.opacity === "1").map((x) => ({ e: x.lab!, x: parseFloat(x.lab!.style.left), y: parseFloat(x.lab!.style.top) })).sort((p, r) => p.y - r.y);
      for (let i = 1; i < vl.length; i++) for (let j = 0; j < i; j++) if (Math.abs(vl[i].x - vl[j].x) < 230 && vl[i].y - vl[j].y < 27) { vl[i].y = vl[j].y + 27; vl[i].e.style.top = `${vl[i].y}px`; }
    },
  };
}

/* ---------- 3HFM: residue-level interaction mapping ---------- */

function residuesScene(data: Data, ov: Overlay): DockScene {
  const CFG = { fab: ["H", "L"], antigen: "Y", chainName: { H: "H", L: "L", Y: "Ag" } as Record<string, string>, colors: { H: DOCK.navy, L: DOCK.sky, Y: DOCK.sand } as Record<string, string>, hi: DOCK.gold, cut: 4.5, contact: 4.0, polar: 3.5, pairs: 6, dwell: 3.0, sway: 0.5 };
  const root = new THREE.Group(), g = new THREE.Group();
  root.add(g);
  const all = residues(data.atoms);
  assignSS(all, data.ss);
  const rF = all.filter((r) => !r.het && CFG.fab.includes(r.chain)), rG = all.filter((r) => !r.het && r.chain === CFG.antigen);
  const aF = rF.flatMap((r) => r.list), aG = rG.flatMap((r) => r.list);
  const cF = centroid(aF), cG = centroid(aG);
  const q = new THREE.Quaternion().setFromUnitVectors(cG.clone().sub(cF).normalize(), new V3(0, 1, 0));
  const mid = cF.clone().add(cG).multiplyScalar(0.5);
  aF.concat(aG).forEach((a) => a.p.sub(mid).applyQuaternion(q));
  const resOf = new Map<Atom, Residue>();
  all.forEach((r) => r.list.forEach((a) => resOf.set(a, r)));
  type Pair = { a: Atom; b: Atom; d: number; ra: Residue; rb: Residue; polar: boolean; dash?: THREE.Group; anchor?: THREE.Vector3; txt?: string };
  const best = new Map<string, Pair>();
  const ifs = interfaceOf(aF, aG, resOf, CFG.cut, (a, b, d) => {
    if (d >= CFG.contact || d <= 2.3) return;
    const ra = resOf.get(a)!, rb = resOf.get(b)!, k = ra.k + "|" + rb.k, cur = best.get(k), p = polar(a) && polar(b) && d < CFG.polar;
    if (!cur || (p && !cur.polar) || (p === cur.polar && d < cur.d)) best.set(k, { a, b, d, ra, rb, polar: p });
  });
  // Polar contacts first, then shortest; each residue used once.
  const cand = [...best.values()].sort((x, y) => Number(y.polar) - Number(x.polar) || x.d - y.d), pairs: Pair[] = [], usedA = new Set<string>(), usedB = new Set<string>();
  for (const p of cand) { if (usedA.has(p.ra.k) || usedB.has(p.rb.k)) continue; usedA.add(p.ra.k); usedB.add(p.rb.k); pairs.push(p); if (pairs.length >= CFG.pairs) break; }

  const ribs: THREE.BufferGeometry[] = [], rm = ribMat();
  segments(rF.concat(rG)).forEach((s) => { const geo = ribbonMesh(s, CFG.colors[s[0].chain] ?? DOCK.sky, (r) => (ifs.has(r.k) ? CFG.hi : null)); ribs.push(geo); g.add(new THREE.Mesh(geo, rm)); });
  g.add(sideLines(rF.concat(rG), (r) => CFG.colors[r.chain] ?? DOCK.sky, (r) => ifs.has(r.k), 0.6));
  const CY = CYL(), resMats = new Map<string, THREE.MeshStandardMaterial[]>(), glow = new THREE.Color(DOCK.gold);
  rF.concat(rG).forEach((r) => {
    if (!ifs.has(r.k)) return;
    const mats: Record<string, THREE.MeshStandardMaterial> = {};
    const m = (h: string) => (mats[h] ||= new THREE.MeshStandardMaterial({ color: h, roughness: 0.4, metalness: 0, transparent: true, opacity: 0, emissive: glow, emissiveIntensity: 0 }));
    bondsOf(r.list.filter((a) => !BACKBONE.includes(a.name) || a.name === "CA")).forEach(([a, b]) => {
      const mm = a.p.clone().add(b.p).multiplyScalar(0.5);
      stick(CY, a.p, mm, 0.14, m(EL[a.el] ?? DOCK.goldDeep), g);
      stick(CY, mm, b.p, 0.14, m(EL[b.el] ?? DOCK.goldDeep), g);
    });
    resMats.set(r.k, Object.values(mats));
  });
  const dashMat = new THREE.MeshBasicMaterial({ color: DOCK.goldDeep, transparent: true, opacity: 0 });
  pairs.forEach((p) => {
    p.dash = new THREE.Group();
    dashes(CY, p.a.p, p.b.p, 0.08, dashMat, p.dash);
    p.dash.visible = false;
    g.add(p.dash);
    p.anchor = p.a.p.clone().lerp(p.b.p, 0.5);
    const cn = CFG.chainName;
    p.txt = `${pdbRes(p.ra)} (${cn[p.ra.chain] ?? p.ra.chain})  ↔  ${pdbRes(p.rb)} (${cn[p.rb.chain] ?? p.rb.chain}) · ${p.d.toFixed(1)} Å`;
  });
  const lab = label(ov.layer, "");
  let rad = 0;
  aF.concat(aG).forEach((a) => (rad = Math.max(rad, a.p.length())));
  rad *= 1.02; // whole Fab–lysozyme complex in frame (the source cropped the constant domains)
  const intro = 1.5, nIf = ifs.size;
  let lastH = -1, cur = -1;

  return {
    root, rad, camY: 0.06, still: intro + CFG.dwell * 0.45,
    update(t, cam, w, hh) {
      const h = ease(seg(t, 0.2, intro));
      if (Math.abs(h - lastH) >= 0.01) { lastH = h; blendRibbons(ribs, h); }
      let k = -1, ph = 0;
      if (t > intro && pairs.length) { const tt = t - intro; k = Math.floor(tt / CFG.dwell) % pairs.length; ph = (tt % CFG.dwell) / CFG.dwell; }
      const pulse = k < 0 ? 0 : Math.sin(Math.PI * clamp(ph * 1.15));
      resMats.forEach((ms, key) => { const on = k >= 0 && (pairs[k].ra.k === key || pairs[k].rb.k === key); ms.forEach((m) => { m.opacity = h * (on ? 1 : 0.3); m.emissiveIntensity = on ? 0.35 * pulse : 0; }); });
      if (k !== cur) { if (cur >= 0) pairs[cur].dash!.visible = false; cur = k; if (k >= 0) { pairs[k].dash!.visible = true; lab.textContent = pairs[k].txt!; } }
      dashMat.opacity = pulse;
      ov.setChip(k < 0 ? `Real structure · PDB 3HFM · ${nIf} interface residues` : `Contact ${k + 1} of ${pairs.length} · ${pairs[k].polar ? "polar contact (H-bond / salt bridge)" : "van der Waals contact"}`);
      root.rotation.y = CFG.sway * Math.sin(t * 0.2);
      root.rotation.x = 0.1 * Math.sin(t * 0.15);
      root.updateMatrixWorld(true);
      if (k >= 0) place(lab, pairs[k].anchor!, g, cam, w, hh, ph > 0.06 && ph < 0.88, -rad * 0.5);
      else lab.style.opacity = "0";
    },
  };
}

export const DOCK_BUILDERS: Record<DockSceneKey, (d: Data, ov: Overlay) => DockScene> = { pose, interface: iface, residues: residuesScene };
