/**
 * The six MD system scenes, ported from the supplied md-sim-visuals pages.
 * Each builder returns plain Three.js groups plus a per-frame update; the R3F
 * wrapper (MdCanvas) owns the renderer, camera, rotation and labels.
 *
 * Concepts kept from the source: protein = thermal fluctuation + hinge domain
 * motion; protein–ligand = ligand breathing in a helical pocket with H-bond
 * contacts forming and breaking; protein–protein = interface side chains and
 * transient contacts; antibody–antigen = Fab with flexible CDR loops touching
 * an epitope; mutation = matched WT vs variant with raised local flexibility;
 * free energy = a walker sampling two basins across a barrier.
 */
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import {
  PAL, V, lerp, smooth, helix, strand, connect, tail, centroid, transformRes, mat, alphaBeta,
  MolBuilder, Contacts, shadowDisc, halo, solvent, type Res, type Seg, type V3,
} from "./molecular";

export type MdSceneKey = "protein" | "proteinLigand" | "proteinProtein" | "antibodyAntigen" | "mutationVariant" | "freeEnergy" | "heroComplex";

export type SceneLabel = { text: string; pos: [number, number, number]; space: "root" | "pivot"; tone: "navy" | "gold" | "ghost" };

export type BuiltScene = {
  root: THREE.Group;
  pivot: THREE.Group;
  view: { ext: { w: number; h: number; d: number }; elev: number; center: V3; fov: number };
  motion: { spin: number | "rock"; rock?: number; base?: number; axis: "x" | "y" };
  labels: SceneLabel[];
  update: (t: number, amp: number, dragYaw: number) => void;
};

type Ctx = { root: THREE.Group; pivot: THREE.Group; lite: boolean };

const pivotAbout = (out: THREE.Matrix4, p: V3, e: THREE.Euler, shift = V()) => {
  const r = new THREE.Matrix4().makeRotationFromEuler(e);
  return out
    .makeTranslation(p.x + shift.x, p.y + shift.y, p.z + shift.z)
    .multiply(r)
    .multiply(new THREE.Matrix4().makeTranslation(-p.x, -p.y, -p.z));
};

function protein({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const segs: Seg[] = [];
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4, s = k % 2 ? -1 : 1;
    segs.push({ res: helix(V(-12 + 5.2 * Math.cos(a), 0, 5.2 * Math.sin(a)), V(0.1 * s, s, 0.06), 15, { phase: k * 1.3 }) });
  }
  // The hinge loop (gold) carries domain B, which swings as a rigid body.
  Object.assign(segs[3], { loopColor: PAL.gold, loopMob: 1.4, extra: 1, loopGroup: 1 });
  const cB = V(11, 0, 0);
  ([[-1.5, 1], [-0.5, -1], [0.5, 1], [1.5, -1]] as const).forEach(([xi, d]) =>
    segs.push({ res: strand(cB.clone().add(V(xi * 4.8, 0, 0)), V(0, d, 0), 6, V(0, 0, 1), { group: 1 }) }),
  );
  segs.push({ res: helix(cB.clone().add(V(0, 0, -9)), V(0.35, 1, 0), 14, { group: 1, phase: 0.8 }) });
  let res = connect(segs, { center: V(), seed: 5 });
  res = tail(res, false, V(-0.4, -1, 0.3).normalize(), 4, { seed: 2 });
  res = tail(res, true, V(0.4, 1, 0.2).normalize(), 5, { seed: 8 });
  const J = new MolBuilder().ribbon(res, { H: PAL.navy, E: PAL.navy2, C: PAL.sky }).build();
  pivot.add(J.mesh);
  shadowDisc(root, -20, 26, 16);
  const water = solvent(pivot, lite ? 45 : 90, 24, 34, { seed: 4 });
  const gm = { 1: new THREE.Matrix4() }, hinge = V(), e = new THREE.Euler();
  return {
    view: { ext: { w: 25, h: 21, d: 26 }, elev: 0.18, center: V(), fov: 24 },
    motion: { spin: 0.13, axis: "y" },
    update(t, amp) {
      pivotAbout(gm[1], hinge, e.set(0.07 * Math.sin(t * 0.37 + 1), 0, 0.16 * Math.sin(t * 0.55)));
      J.update(t, amp, gm);
      water(t);
    },
  };
}

function proteinLigand({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const RING = 10;
  const segs: Seg[] = [];
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3, s = k % 2 ? -1 : 1;
    const tilt = V(-Math.sin(a) * 0.22 * s, s, Math.cos(a) * 0.22 * s);
    segs.push({ res: helix(V(RING * Math.cos(a), 0, RING * Math.sin(a)), tilt, 16, { phase: k * 0.9 }) });
  }
  let res = connect(segs, { center: V(), seed: 9 });
  res = tail(res, true, V(0.3, 1, 0.5).normalize(), 4, { seed: 3 });
  res = tail(res, false, V(-0.3, -1, 0.2).normalize(), 3, { seed: 6 });
  const b = new MolBuilder();
  b.ribbon(res, { H: PAL.navy, E: PAL.navy2, C: PAL.sky });

  // Ligand (group 2): aromatic ring – amide – pyridine – carboxylate, standing in the channel.
  type El = "C" | "N" | "O";
  const L: { p: V3; el: El }[] = [], LB: [number, number][] = [];
  const lc = V(0, 4.5, 0);
  const atom = (x: number, y: number, z: number, el: El) => (L.push({ p: V(x, y, z).add(lc), el }), L.length - 1);
  const ring = (cx: number, cy: number, rot: number, hetero: number[]) => {
    const ids: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + rot;
      ids.push(atom(cx + 1.39 * Math.cos(a), cy + 1.39 * Math.sin(a), 0.3 * Math.sin(a * 2), hetero.includes(i) ? "N" : "C"));
    }
    for (let i = 0; i < 6; i++) LB.push([ids[i], ids[(i + 1) % 6]]);
    return ids;
  };
  const r1 = ring(0, -3.2, Math.PI / 2, []);
  const c7 = atom(0, -0.4, 0, "C"); LB.push([r1[0], c7]);
  const o7 = atom(1.1, 0.2, 0.2, "O"); LB.push([c7, o7]);
  const n8 = atom(-1.1, 0.4, -0.1, "N"); LB.push([c7, n8]);
  const r2 = ring(-1.2, 3.1, -Math.PI / 2 + 0.2, [3]); LB.push([n8, r2[0]]);
  const f1 = atom(1.2, -5.8, 0.4, "O"); LB.push([r1[3], f1]);
  const cx = atom(-2.4, 6.6, 0.2, "C"); LB.push([r2[3], cx]);
  const ox1 = atom(-3.6, 6.2, 0.6, "O"), ox2 = atom(-2.2, 7.9, -0.3, "O"); LB.push([cx, ox1], [cx, ox2]);
  const colOf = (e: El) => (e === "C" ? PAL.gold : e === "N" ? PAL.navy : PAL.red);
  const ids = L.map((a) => b.anchor(a.p, 0.25, 2));
  L.forEach((a, i) => b.sphere(a.p, a.el === "C" ? 0.5 : 0.56, colOf(a.el), ids[i], lite ? 10 : 14));
  LB.forEach(([i, j]) => b.cylinder(L[i].p, L[j].p, 0.2, colOf(L[i].el), ids[i], ids[j], colOf(L[j].el)));

  // Pocket side chains reaching toward ligand heteroatoms.
  const hetero = L.map((_, i) => i).filter((i) => L[i].el !== "C");
  const pairs: [number, number, number][] = [];
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3, inward = V(-Math.cos(a), 0, -Math.sin(a));
    let best: Res | null = null, bs = -9;
    res.forEach((r) => {
      if (r.ss !== "H") return;
      if (Math.abs(r.p.x - RING * Math.cos(a)) > 4 || Math.abs(r.p.z - RING * Math.sin(a)) > 4) return;
      const sc = r.side.dot(inward) - Math.abs(r.p.y - (lc.y + (k - 2.5) * 1.8)) * 0.15;
      if (sc > bs) { bs = sc; best = r; }
    });
    if (!best) continue;
    const from: Res = best;
    let tgt = hetero[0], td = 1e9;
    hetero.forEach((i) => { const d = L[i].p.distanceTo(from.p); if (d < td) { td = d; tgt = i; } });
    const sc = b.sidechain(from, L[tgt].p.clone().sub(from.p), 3, PAL.skyLight, { tip: k % 2 ? PAL.navy : PAL.red, root: PAL.sky });
    pairs.push([sc.tip, ids[tgt], k]);
  }
  const J = b.build();
  pivot.add(J.mesh);
  const H = new Contacts(pivot, 200, PAL.goldDeep, 0.17);
  pairs.forEach(([a, l, k]) => H.add(J, a, J, l, { keep: k === 4 ? 0.1 : 0.75, w: 0.6 + k * 0.13 }));
  const glow = halo(pivot, "rgba(244,196,48,0.35)", 16);
  glow.position.copy(lc);
  shadowDisc(root, -17, 20, 20);
  const water = solvent(pivot, lite ? 35 : 70, 20, 30, { seed: 12 });
  const gm = { 2: new THREE.Matrix4() }, e = new THREE.Euler(), d = V();
  return {
    view: { ext: { w: 20, h: 18, d: 22 }, elev: 0.42, center: V(0, 1, 0), fov: 24 },
    motion: { spin: 0.12, axis: "y" },
    update(t, amp) {
      d.set(0.35 * Math.sin(t * 0.8), 0.4 * Math.sin(t * 0.5 + 2), 0.35 * Math.sin(t * 0.63 + 1));
      pivotAbout(gm[2], lc, e.set(0.09 * Math.sin(t * 0.7), 0.25 * Math.sin(t * 0.31), 0.08 * Math.sin(t * 0.9 + 1)), d);
      J.update(t, amp, gm);
      H.update(t);
      water(t);
      glow.material.opacity = 0.7 + 0.3 * Math.sin(t * 1.3);
    },
  };
}

const pick = (res: Res[], c: V3, dir: V3, n: number) =>
  res.map((r) => ({ r, s: r.p.clone().sub(c).dot(dir) })).sort((a, b) => b.s - a.s).slice(0, n).map((o) => o.r);

function proteinProtein({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const A = alphaBeta({ seed: 11, H: PAL.navy, E: PAL.navy2, C: PAL.sky, M: mat(0.3, 0.2, 0, -14, 0, 0) });
  const B = alphaBeta({ seed: 23, H: PAL.warmDeep, E: PAL.warm, C: PAL.warmPale, M: mat(-0.5, Math.PI + 0.4, 0.2, 14, 0, 0) });
  B.forEach((r) => (r.group = 1));
  const cA = centroid(A), cB = centroid(B);
  const iA = pick(A, cA, V(1, 0, 0), 7), iB = pick(B, cB, V(-1, 0, 0), 7);
  // Slide B so the interface side-chain tips sit a few Å apart.
  const maxA = Math.max(...iA.map((r) => r.p.x)), minB = Math.min(...iB.map((r) => r.p.x));
  const shift = maxA + 3.2 * 3 - minB;
  B.forEach((r) => (r.p.x += shift));
  const b = new MolBuilder();
  b.ribbon(A);
  b.ribbon(B);
  const scA = iA.map((r) => b.sidechain(r, V(1, 0, 0).lerp(r.p.clone().sub(cA).normalize(), 0.3), 2, PAL.gold, { tip: PAL.navy, root: PAL.navy2 }));
  const cB2 = centroid(B);
  const scB = iB.map((r) => b.sidechain(r, V(-1, 0, 0).lerp(r.p.clone().sub(cB2).normalize(), 0.3), 2, PAL.gold, { tip: PAL.red, root: PAL.warm }));
  const J = b.build();
  pivot.add(J.mesh);
  const H = new Contacts(pivot, 260, PAL.goldDeep, 0.17);
  scA.forEach((sa, i) => {
    let best = 0, bd = 1e9;
    scB.forEach((sb, j) => { const d = sa.tipPos.distanceTo(sb.tipPos); if (d < bd) { bd = d; best = j; } });
    if (bd < 9) H.add(J, sa.tip, J, scB[best].tip, { keep: i % 3 === 2 ? 0.15 : 0.7 });
  });
  const mid = (maxA + minB + shift) / 2;
  const g1 = halo(pivot, "rgba(244,196,48,0.28)", 26);
  g1.position.set(mid, 0, 0);
  shadowDisc(root, -19, 34, 14);
  const water = solvent(pivot, lite ? 45 : 90, 26, 36, { seed: 31, flat: 0.8 });
  const gm = { 1: new THREE.Matrix4() }, piv = V(mid, 0, 0), e = new THREE.Euler(), d = V();
  return {
    view: { ext: { w: 34, h: 18, d: 24 }, elev: 0.1, center: V(), fov: 24 },
    motion: { spin: 0.16, axis: "x" },
    update(t, amp) {
      pivotAbout(gm[1], piv, e.set(0.05 * Math.sin(t * 0.5), 0.04 * Math.sin(t * 0.41 + 1), 0.06 * Math.sin(t * 0.33 + 2)), d.set(0.3 * Math.sin(t * 0.6), 0, 0));
      J.update(t, amp, gm);
      H.update(t);
      water(t);
      g1.material.opacity = 0.75 + 0.25 * Math.sin(t);
    },
  };
}

function antibodyAntigen({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const S = 4.8;
  type Strand = [string, number, number, number];
  const V_: Strand[] = [["A", 1, 1.5, -1], ["B", 1, 0.5, 1], ["C", -1, 0.5, -1], ["C'", -1, -0.5, 1], ["C''", -1, -1.5, -1], ["D", 1, -1.5, 1], ["E", 1, -0.5, -1], ["F", -1, 1.5, 1], ["G", -1, 2.5, -1]];
  const C_: Strand[] = [["A", 1, 1.5, -1], ["B", 1, 0.5, 1], ["C", -1, 0.5, -1], ["D", 1, -1.5, 1], ["E", 1, -0.5, -1], ["F", -1, 1.5, 1], ["G", -1, 2.5, -1]];
  // Ig fold; the loops after strands B, C' and F become the gold CDR loops.
  const igDomain = (isV: boolean, M: THREE.Matrix4, o: { col: number; h3: number }): Seg[] => {
    const cdr: Record<string, [number, string]> = { B: [1, "CDR1"], "C'": [0, "CDR2"], F: [o.h3, "CDR3"] };
    return (isV ? V_ : C_).map(([nm, sh, xi, d]) => {
      const res = strand(V((xi - 0.5) * S, 0, sh * 5), V(0, d, 0), isV ? 8 : 7, V(0, 0, sh), { color: o.col });
      transformRes(res, M);
      const seg: Seg = { res, loopColor: o.col, loopMob: 0.9, bulge: V(0, d, 0).transformDirection(M), amt: 2.2 };
      if (isV && cdr[nm]) Object.assign(seg, { extra: cdr[nm][0] + 1, loopColor: PAL.gold, loopMob: 2.3, tag: cdr[nm][1], amt: 3 });
      return seg;
    });
  };
  const heavy = { col: PAL.navy, h3: 3 }, light = { col: 0x6e97d2, h3: 1 };
  const VH = igDomain(true, mat(0, -0.95, 0.06, -10, 16, 0), heavy);
  const CH1 = igDomain(false, mat(0, -0.95, -0.12, -9.5, -17, 1.5), heavy);
  const VL = igDomain(true, mat(0, 0.95, -0.06, 10, 16, 0), light);
  const CL = igDomain(false, mat(0, 0.95, 0.12, 9.5, -17, 1.5), light);
  [VH, VL].forEach((d) => Object.assign(d[d.length - 1], { bulge: V(0, -1, 0), amt: 3, loopColor: heavy.col, extra: 1 }));
  VL[VL.length - 1].loopColor = light.col;
  let Hc = connect(VH.concat(CH1), { seed: 3 }), Lc = connect(VL.concat(CL), { seed: 4 });
  Hc = tail(Hc, true, V(0.3, -1, 0.2).normalize(), 4, { color: heavy.col, seed: 9 });
  Lc = tail(Lc, true, V(-0.3, -1, 0.2).normalize(), 3, { color: light.col, seed: 10 });

  // Antigen sits above the paratope.
  const Ag = alphaBeta({ seed: 41, H: PAL.warmDeep, E: PAL.warm, C: PAL.warmPale, M: mat(Math.PI / 2 + 0.2, 0.5, 0, 0, 0, 0) });
  Ag.forEach((r) => { r.group = 1; r.mob *= 0.8; });
  const heavySet = new Set(Hc);
  const tips: Record<string, Res> = {};
  Hc.concat(Lc).filter((r) => r.tag).forEach((r) => {
    const k = r.tag! + (heavySet.has(r) ? "H" : "L");
    if (!tips[k] || r.p.y > tips[k].p.y) tips[k] = r;
  });
  const tipList = Object.values(tips);
  const topY = Math.max(...tipList.map((r) => r.p.y));
  const agMin = Math.min(...Ag.map((r) => r.p.y)), agC = centroid(Ag);
  Ag.forEach((r) => { r.p.y += topY + 8.2 - agMin; r.p.x -= agC.x; r.p.z -= agC.z; });
  const b = new MolBuilder();
  b.ribbon(Hc);
  b.ribbon(Lc);
  b.ribbon(Ag);
  const paratope = tipList.map((r) => b.sidechain(r, V(0, 1, 0), 2, PAL.gold, { tip: PAL.navy, root: PAL.goldDeep }));
  const used = new Set<Res>();
  const epi = paratope.map((p) => {
    let best = Ag[0], bd = 1e9;
    Ag.forEach((r) => { if (used.has(r) || r.ss === "E") return; const d = r.p.distanceTo(p.tipPos); if (d < bd) { bd = d; best = r; } });
    used.add(best);
    return b.sidechain(best, p.tipPos.clone().sub(best.p), 2, 0xe9d9a6, { tip: PAL.red, root: PAL.warm });
  });
  const J = b.build();
  const inner = new THREE.Group();
  inner.rotation.z = -Math.PI / 2;
  inner.position.x = -(topY + 12) / 2 + 6;
  inner.add(J.mesh);
  pivot.add(inner);
  const H = new Contacts(inner, 300, PAL.goldDeep, 0.17);
  paratope.forEach((p, i) => H.add(J, p.tip, J, epi[i].tip, { keep: i === 2 ? 0.1 : 0.65 }));
  const g = halo(inner, "rgba(244,196,48,0.3)", 30);
  g.position.set(0, topY + 4, 0);
  shadowDisc(root, -22, 50, 12);
  const water = solvent(pivot, lite ? 50 : 100, 34, 44, { seed: 51, flat: 0.6 });
  const gm = { 1: new THREE.Matrix4() }, pv = V(0, topY + 5, 0), e = new THREE.Euler(), d = V();
  return {
    view: { ext: { w: 52, h: 22, d: 26 }, elev: 0.08, center: V(), fov: 24 },
    motion: { spin: "rock", rock: 0.45, base: 1.2, axis: "x" },
    update(t, amp) {
      pivotAbout(gm[1], pv, e.set(0.05 * Math.sin(t * 0.43), 0.08 * Math.sin(t * 0.29), 0.05 * Math.sin(t * 0.5 + 1)), d.set(0, 0.35 * Math.sin(t * 0.7), 0));
      J.update(t, amp, gm);
      H.update(t);
      water(t);
      g.material.opacity = 0.7 + 0.3 * Math.sin(t * 1.1);
    },
  };
}

function mutationVariant({ root, pivot }: Ctx): Partial<BuiltScene> {
  const SITE = 58; // loop at the top of the sheet
  const make = (isVar: boolean) => {
    const res = alphaBeta({ seed: 11, H: PAL.navy, E: PAL.navy2, C: PAL.sky, M: mat(0.25, 0, 0, 0, 0, 0) });
    const site = res[SITE];
    // Variant: flexibility raised around the mutated residue, fading with distance.
    if (isVar) res.forEach((r) => { const d = r.p.distanceTo(site.p); if (d < 12) r.mob *= lerp(2.6, 1, d / 12); });
    const b = new MolBuilder();
    b.ribbon(res);
    const out = site.p.clone().sub(centroid(res)).normalize();
    const sc = isVar
      ? b.sidechain(site, out, 5, PAL.gold, { tip: PAL.goldDeep, tipR: 0.62, root: PAL.goldDeep })
      : b.sidechain(site, out, 2, PAL.skyLight, { tip: PAL.sky, root: PAL.sky });
    const J = b.build();
    const g = new THREE.Group();
    g.add(J.mesh);
    const h = halo(g, isVar ? "rgba(244,196,48,0.6)" : "rgba(142,174,219,0.35)", isVar ? 11 : 7);
    h.position.copy(sc.tipPos);
    return { J, g, h, sc };
  };
  const wt = make(false), vr = make(true);
  wt.g.position.x = -17;
  vr.g.position.x = 17;
  pivot.add(wt.g, vr.g);
  shadowDisc(root, -18, 16, 12).position.x = -17;
  shadowDisc(root, -18, 16, 12).position.x = 17;
  return {
    view: { ext: { w: 36, h: 18, d: 22 }, elev: 0.14, center: V(0, -2.5, 0), fov: 24 },
    motion: { spin: 0, axis: "y" },
    labels: [
      { text: "Wild type", pos: [-17, 18, 0], space: "root", tone: "navy" },
      { text: "Variant", pos: [17, 18, 0], space: "root", tone: "gold" },
    ],
    update(t, amp, dragYaw) {
      wt.g.rotation.y = vr.g.rotation.y = t * 0.18 + dragYaw;
      pivot.rotation.y = 0;
      wt.J.update(t, amp);
      vr.J.update(t, amp);
      vr.h.material.opacity = 0.65 + 0.35 * Math.sin(t * 2.2);
      vr.J.pos(vr.sc.tip, vr.h.position);
      wt.J.pos(wt.sc.tip, wt.h.position);
    },
  };
}

function freeEnergy({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const g2 = (x: number, z: number, cx: number, cz: number, s: number) => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * s * s));
  const F = (x: number, z: number) =>
    0.75 * (7 - 10 * g2(x, z, -13, -3, 6.5) - 12.5 * g2(x, z, 12, 2, 6) - 4.5 * g2(x, z, -1, -12, 5) + 0.9 * Math.sin(0.33 * x + 0.6) * Math.cos(0.29 * z) + 0.0018 * (x * x + z * z));
  const N = lite ? 110 : 170, SZ = 64;
  const geo = new THREE.PlaneGeometry(SZ, SZ, N, N);
  geo.rotateX(-Math.PI / 2);
  const P = geo.attributes.position;
  let lo = 1e9, hi = -1e9;
  for (let i = 0; i < P.count; i++) {
    const y = F(P.getX(i), P.getZ(i));
    P.setY(i, y);
    lo = Math.min(lo, y); hi = Math.max(hi, y);
  }
  geo.computeVertexNormals();
  // Height-coloured landscape with contour lines, faded out at the rim.
  const surf = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        lo: { value: lo }, hi: { value: hi },
        cLo: { value: new THREE.Color(0x3f72be) }, cMid: { value: new THREE.Color(0xc9d7ec) }, cHi: { value: new THREE.Color(0xf3eee3) },
        line: { value: new THREE.Color(PAL.navy) },
      },
      vertexShader: `varying float vH; varying vec3 vN; varying vec2 vXZ;
        void main(){ vH=position.y; vXZ=position.xz; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float lo,hi; uniform vec3 cLo,cMid,cHi,line; varying float vH; varying vec3 vN; varying vec2 vXZ;
        void main(){
          float k=(vH-lo)/(hi-lo);
          vec3 c = k<0.45 ? mix(cLo,cMid,smoothstep(0.0,0.45,k)) : mix(cMid,cHi,smoothstep(0.45,1.0,k));
          vec3 L=normalize(vec3(0.3,0.9,0.5)); float d=max(dot(normalize(vN),L),0.0); c*=0.72+0.32*d;
          float h=vH*1.25; float w=abs(fract(h-0.5)-0.5)/max(fwidth(h),1e-4); float ln=1.0-min(w,1.0);
          c=mix(c,line,ln*0.42);
          float r=length(vXZ); float a=1.0-smoothstep(${(SZ / 2 - 9).toFixed(1)},${(SZ / 2 - 1).toFixed(1)},r);
          gl_FragColor=vec4(c,a);
          #include <colorspace_fragment>
        }`,
    }),
  );
  pivot.add(surf);
  shadowDisc(root, lo - 3, 34, 30);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 18), new THREE.MeshStandardMaterial({ color: PAL.gold, emissive: PAL.gold, emissiveIntensity: 0.25, roughness: 0.35 }));
  pivot.add(ball);
  const glow = halo(pivot, "rgba(244,196,48,0.55)", 7);
  const TRL = lite ? 70 : 110;
  const trail = new THREE.InstancedMesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshStandardMaterial({ color: PAL.goldDeep, roughness: 0.5 }), TRL);
  pivot.add(trail);
  const hist: V3[] = [];
  const dropG = new THREE.BufferGeometry().setFromPoints([V(), V()]);
  const drop = new THREE.Line(dropG, new THREE.LineDashedMaterial({ color: PAL.goldDeep, dashSize: 0.6, gapSize: 0.5 }));
  pivot.add(drop);
  const A = V(-13, 0, -3), B = V(12, 0, 2), TS = V(-1, 0, -9);
  const ou = V(), ouv = V();
  let lastT = -1;
  const path = (u: number, from: V3, to: V3, via: V3) => { const w = 1 - u; return from.clone().multiplyScalar(w * w).addScaledVector(via, 2 * w * u).addScaledVector(to, u * u); };
  const CY = 16;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = V(), tmp = V();
  let prevT = 0;
  return {
    view: { ext: { w: 31, h: 17, d: 16 }, elev: 0.95, center: V(0, -2, 1), fov: 24 },
    motion: { spin: "rock", rock: 0.35, axis: "y" },
    labels: [
      { text: "State A", pos: [A.x, F(A.x, A.z) + 5.5, A.z], space: "pivot", tone: "navy" },
      { text: "State B", pos: [B.x, F(B.x, B.z) + 5.5, B.z], space: "pivot", tone: "gold" },
      { text: "Barrier", pos: [TS.x + 1, F(TS.x + 1, TS.z * 0.6) + 3.5, TS.z * 0.6], space: "pivot", tone: "ghost" },
    ],
    update(t) {
      // Ornstein–Uhlenbeck jitter around a scripted A → B → A path.
      const dt = Math.min(0.05, Math.max(0, t - prevT));
      prevT = t;
      ouv.x += -ou.x * 1.6 * dt + (Math.random() - 0.5) * 9 * Math.sqrt(dt);
      ouv.z += -ou.z * 1.6 * dt + (Math.random() - 0.5) * 9 * Math.sqrt(dt);
      ou.x += ouv.x * dt; ou.z += ouv.z * dt;
      ouv.multiplyScalar(0.9);
      const c = t % CY;
      let p: V3;
      if (c < 5.5) p = A.clone();
      else if (c < 8) p = path(smooth(5.5, 8, c), A, B, TS.clone().multiplyScalar(1.6));
      else if (c < 13.5) p = B.clone();
      else p = path(smooth(13.5, 16, c), B, A, V(0, 0, 8));
      const amp = c < 5.5 || (c >= 8 && c < 13.5) ? 2.3 : 0.8;
      p.x += ou.x * amp; p.z += ou.z * amp;
      p.y = F(p.x, p.z) + 1.05;
      ball.position.copy(p);
      glow.position.copy(p);
      glow.material.opacity = 0.7 + 0.3 * Math.sin(t * 3);
      if (t - lastT > 0.06 || lastT < 0) { hist.unshift(p.clone()); if (hist.length > TRL) hist.pop(); lastT = t; }
      for (let i = 0; i < TRL; i++) {
        const h = hist[i] ?? p;
        sc.setScalar(hist[i] ? 1 - i / TRL : 0);
        m4.compose(tmp.set(h.x, h.y - 0.75, h.z), q, sc);
        trail.setMatrixAt(i, m4);
      }
      trail.instanceMatrix.needsUpdate = true;
      const dp = dropG.attributes.position as THREE.BufferAttribute;
      dp.setXYZ(0, p.x, p.y, p.z);
      dp.setXYZ(1, p.x, lo - 3, p.z);
      dp.needsUpdate = true;
      drop.computeLineDistances();
    },
  };
}

/**
 * MD page hero: an original α/β protein (blue helices, gold β-strand arrows,
 * light loops) holding a ball-and-stick ligand inside a translucent pocket
 * surface — art-directed from a supplied reference render, not a specific
 * PDB entry. Motion is deliberately small: thermal fluctuation, the ligand
 * breathing in place, a slow shimmer along the strands, a gentle orbit.
 */
function heroComplex({ root, pivot, lite }: Ctx): Partial<BuiltScene> {
  const BLUE = 0x2e78c2, LOOP = 0xe6e3dc, STRAND = PAL.gold;
  const P = V(0, 0, 3); // pocket centre
  const H = (c: V3, d: V3, n: number, ph = 0): Seg => ({ res: helix(c, d, n, { phase: ph, color: BLUE }) });
  const E = (c: V3, d: V3, nrm: V3): Seg => ({ res: strand(c, d, 6, nrm, { color: STRAND }) });
  const face = V(0.25, 0, 1);
  const segs: Seg[] = [
    H(V(-4, 16, -2), V(1, 0.05, 0), 14, 0.2),
    E(V(-15, 1, 5), V(0.25, -1, 0), V(0.2, 0, 1)),
    E(V(-10.5, 0, 6), V(-0.25, 1, 0), V(0.2, 0, 1)),
    H(V(-19, 3, -3), V(0.3, -1, 0), 13, 1.1),
    H(V(-8, -16, 0), V(1, -0.25, 0), 13, 2.0),
    E(V(7, -1, 4), V(0.05, 1, 0), face),
    E(V(11.6, 0, 3.4), V(-0.05, -1, 0), face),
    H(V(1, 7, -7), V(0.1, 1, 0.2), 13, 0.6),
    E(V(16.2, 1, 2.6), V(0.08, 1, 0), face),
    E(V(20.8, 0, 1.6), V(-0.08, -1, 0), face),
    H(V(15, -13, -5), V(0.3, 1, 0), 12, 1.7),
    H(V(8, -19, 2), V(1, 0.2, 0), 11, 2.4),
  ];
  let res = connect(segs, { center: V(), seed: 17, loopColor: LOOP });
  res = tail(res, false, V(-0.2, 1, 0.3).normalize(), 3, { color: LOOP, seed: 4 });
  res = tail(res, true, V(0.3, -1, 0.2).normalize(), 3, { color: LOOP, seed: 9 });
  const b = new MolBuilder();
  b.ribbon(res, { H: BLUE, E: STRAND, C: LOOP });

  // Pocket-lining side chains, faint inside the surface.
  const lining = res.filter((r) => r.ss !== "C").map((r) => ({ r, d: r.p.distanceTo(P) })).sort((x, y) => x.d - y.d).slice(0, 5);
  const liningTips = lining.map(({ r }, i) => b.sidechain(r, P.clone().sub(r.p), 3, 0xb9b3a6, { tip: i % 2 ? PAL.navy : PAL.red, root: 0xcfc9bc, mobMul: 0.6 }).tipPos);

  // Original ligand (CPK colours): carbamoyl – phosphonate – amide – N-oxide – phosphonate – triazole – carboxylate.
  type El = "C" | "N" | "O" | "P" | "H";
  const COL: Record<El, number> = { C: 0x8c8c8c, N: 0x3f6bd8, O: 0xdf4a3c, P: 0xe8892b, H: 0xf2f2f2 };
  const RAD: Record<El, number> = { C: 0.55, N: 0.55, O: 0.55, P: 0.66, H: 0.34 };
  const L: { p: V3; el: El }[] = [], LB: [number, number][] = [];
  const at = (x: number, y: number, z: number, el: El) => (L.push({ p: V(x, y, z).add(P), el }), L.length - 1);
  const bond = (a: number, c: number) => LB.push([a, c]);
  const c1 = at(-5.6, 1.0, 0.2, "C"); bond(c1, at(-5.2, 2.3, 0.4, "O")); { const n = at(-6.9, 0.6, 0, "N"); bond(c1, n); bond(n, at(-7.6, 1.2, 0.2, "H")); bond(n, at(-7.2, -0.3, -0.2, "H")); }
  const n2 = at(-4.4, 0.2, 0.1, "N"); bond(c1, n2); bond(n2, at(-4.2, -0.4, 0.9, "H"));
  const p1 = at(-3.1, -0.6, -0.1, "P"); bond(n2, p1); bond(p1, at(-3.3, -1.9, 0.5, "O")); bond(p1, at(-2.8, -0.9, -1.5, "O")); bond(p1, at(-3.9, 0.1, -1.0, "O"));
  const c3 = at(-1.8, 0.2, 0.3, "C"); bond(p1, c3); bond(c3, at(-1.9, 1.1, 1.1, "O")); bond(c3, at(-1.5, 0.9, -0.4, "H"));
  const n4 = at(-0.6, -0.4, 0.4, "N"); bond(c3, n4); bond(n4, at(-0.6, -1.6, 0.7, "O"));
  const p2 = at(0.8, 0.1, 0.1, "P"); bond(n4, p2); bond(p2, at(0.7, 0.6, -1.3, "O")); bond(p2, at(1.0, 1.3, 0.9, "O"));
  const c11 = at(1.3, -1.3, -0.4, "C"); bond(p2, c11); bond(c11, at(1.1, -1.6, -1.4, "H"));
  const c12 = at(2.4, -2.1, 0.1, "C"); bond(c11, c12); bond(c12, at(2.5, -3.2, -0.3, "O")); bond(c12, at(3.1, -1.8, 0.9, "H"));
  // Triazole ring off P2.
  const ring: number[] = [];
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.6; ring.push(at(3.7 + 1.15 * Math.cos(a), 0.9 + 1.15 * Math.sin(a), 0.2 * Math.sin(2 * a), i < 3 ? "N" : "C")); }
  ring.forEach((a, i) => bond(a, ring[(i + 1) % 5]));
  bond(p2, ring[2]);
  bond(ring[0], at(4.9, -0.2, 0.3, "H"));
  bond(ring[1], at(3.8, 2.9, 0.1, "H"));
  const cx = at(6.3, 1.9, 0.2, "C"); bond(ring[4], cx); bond(cx, at(7.3, 1.2, 0.5, "O")); { const oh = at(6.5, 3.2, -0.1, "O"); bond(cx, oh); bond(oh, at(7.4, 3.5, 0, "H")); }
  const ids = L.map((a) => b.anchor(a.p, 0.15, 2));
  L.forEach((a, i) => b.sphere(a.p, RAD[a.el], COL[a.el], ids[i], lite ? 10 : 16));
  LB.forEach(([i, j]) => b.cylinder(L[i].p, L[j].p, 0.19, COL[L[i].el], ids[i], ids[j], COL[L[j].el]));
  const J = b.build();
  pivot.add(J.mesh);

  // Strand "arrows": remember their vertices so a slow shimmer can flow along them.
  const colAttr = J.mesh.geometry.attributes.color as THREE.BufferAttribute;
  const cArr = colAttr.array as Float32Array, gold = new THREE.Color(STRAND);
  const strandIdx: number[] = [];
  for (let i = 0; i < colAttr.count; i++) if (Math.abs(cArr[3 * i] - gold.r) < 1e-4 && Math.abs(cArr[3 * i + 1] - gold.g) < 1e-4 && Math.abs(cArr[3 * i + 2] - gold.b) < 1e-4) strandIdx.push(i);

  // Translucent pocket surface: a blended isosurface around the ligand and its lining.
  const S = 13, res3 = lite ? 36 : 52;
  const surfMat = new THREE.MeshStandardMaterial({ color: 0xe9d8b8, roughness: 0.55, metalness: 0, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
  const surf = new MarchingCubes(res3, surfMat, false, false, 60000);
  surf.isolation = 80;
  surf.position.copy(P);
  surf.scale.setScalar(S);
  const ball = (p: V3, r: number) => {
    const u = p.clone().sub(P).divideScalar(2 * S).addScalar(0.5);
    // A high `subtract` keeps each blob's field local, so the surface stays
    // lumpy and hugs the ligand instead of merging into one smooth capsule.
    const d = r / (2 * S), SUB = 60;
    surf.addBall(u.x, u.y, u.z, d * d * (80 + SUB), SUB);
  };
  L.filter((a) => a.el !== "H").forEach((a) => ball(a.p, 2.6));
  liningTips.forEach((p) => ball(p, 3.1));
  surf.update();
  surf.renderOrder = 2;
  pivot.add(surf);

  shadowDisc(root, -22, 26, 14);
  const water = solvent(pivot, lite ? 30 : 60, 26, 36, { seed: 8 });
  const gm = { 2: new THREE.Matrix4() }, e = new THREE.Euler(), d = V();
  return {
    // Framed close on the pocket, as in the reference; outer helices may run off the edge.
    view: { ext: { w: 15.5, h: 12, d: 16 }, elev: 0.1, center: V(0, 0, 0), fov: 24 },
    motion: { spin: "rock", rock: 0.42, axis: "y" },
    update(t, amp) {
      d.set(0.18 * Math.sin(t * 0.7), 0.15 * Math.sin(t * 0.5 + 2), 0.12 * Math.sin(t * 0.6 + 1));
      pivotAbout(gm[2], P, e.set(0.04 * Math.sin(t * 0.6), 0.08 * Math.sin(t * 0.33), 0.04 * Math.sin(t * 0.8 + 1)), d);
      J.update(t, amp * 0.4, gm);
      for (let k = 0; k < strandIdx.length; k++) {
        const i = strandIdx[k], f = 0.9 + 0.12 * Math.sin(t * 1.6 - k * 0.004);
        cArr[3 * i] = gold.r * f; cArr[3 * i + 1] = gold.g * f; cArr[3 * i + 2] = gold.b * f;
      }
      colAttr.needsUpdate = true;
      surfMat.opacity = 0.4 + 0.05 * Math.sin(t * 0.9);
      water(t);
    },
  };
}

const BUILDERS: Record<MdSceneKey, (c: Ctx) => Partial<BuiltScene>> = {
  protein, proteinLigand, proteinProtein, antibodyAntigen, mutationVariant, freeEnergy, heroComplex,
};

export function buildScene(key: MdSceneKey, lite: boolean): BuiltScene {
  const root = new THREE.Group(), pivot = new THREE.Group();
  root.add(pivot);
  const s = BUILDERS[key]({ root, pivot, lite });
  return { root, pivot, labels: [], ...s } as BuiltScene;
}

/** Auto-rotation / rocking plus the viewer's drag offset. */
export function applyMotion(s: BuiltScene, t: number, yaw: number, pitch: number) {
  const m = s.motion;
  const auto = (m.base ?? 0) + (m.spin === "rock" ? Math.sin(t * 0.25) * (m.rock ?? 0.5) : t * m.spin);
  if (m.axis === "y") {
    s.pivot.rotation.y = auto + yaw;
    s.root.rotation.x = pitch;
  } else {
    s.pivot.rotation.x = auto + pitch * 2;
    s.root.rotation.y = yaw;
  }
}
