/**
 * Procedural molecule toolkit for the MD scenes: secondary-structure
 * generators, a ribbon/atom/bond mesh builder whose vertices are tied to
 * anchors, a smooth thermal displacement field, flickering contact dots,
 * drifting solvent. Ported from the supplied md-sim-visuals (Three.js r128
 * standalone pages) to the project's `three` package.
 *
 * Everything here is illustrative geometry — no real coordinates, no force
 * field. Client-only: textures are drawn on a <canvas>.
 */
import * as THREE from "three";

export const PAL = {
  navy: 0x1e5ba8,
  navy2: 0x3d72bd,
  sky: 0x8eaedb,
  skyLight: 0xc9d7ec,
  warm: 0xb3a994,
  warmDeep: 0x8f8570,
  warmPale: 0xcfc7b6,
  gold: 0xf4c430,
  goldDeep: 0xd6a21e,
  red: 0xd6604d,
} as const;

export type V3 = THREE.Vector3;
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function basisFor(d: V3): [V3, V3] {
  const a = Math.abs(d.x) < 0.9 ? V(1, 0, 0) : V(0, 1, 0);
  const u = V().crossVectors(d, a).normalize();
  const v = V().crossVectors(d, u).normalize();
  return [u, v];
}

/** Smooth thermal displacement field — shared by every vertex, so bonded parts move together. */
function disp(x: number, y: number, z: number, t: number, o: V3) {
  o.x = Math.sin(0.23 * y + 0.5 * x + 1.7 * t) + 0.6 * Math.sin(0.41 * z + 1.1 - 2.3 * t) + 0.5 * Math.sin(0.9 * x + 0.3 * z + 3.1 * t) + 0.35 * Math.sin(1.6 * y + 0.4 * z + 5.3 * t);
  o.y = Math.sin(0.29 * z + 0.4 * y + 1.3 * t + 2.0) + 0.6 * Math.sin(0.37 * x - 2.1 * t) + 0.5 * Math.sin(0.8 * y + 0.2 * x - 2.9 * t) + 0.35 * Math.sin(1.5 * z + 0.3 * x + 4.7 * t);
  o.z = Math.sin(0.31 * x + 0.6 * z - 1.5 * t + 4.0) + 0.6 * Math.sin(0.43 * y + 1.9 * t + 0.7) + 0.5 * Math.sin(0.85 * z + 0.4 * y + 3.3 * t) + 0.35 * Math.sin(1.7 * x + 0.2 * y - 5.1 * t);
  return o.multiplyScalar(0.4);
}

/* ---------- residues: CA position + side orientation ---------- */

export type Res = {
  p: V3;
  side: V3;
  ss: "H" | "E" | "C";
  color?: number;
  mob: number;
  group: number;
  tag?: string;
};

export type Seg = {
  res: Res[];
  bulge?: V3;
  amt?: number;
  extra?: number;
  loopColor?: number;
  loopMob?: number;
  loopGroup?: number;
  tag?: string;
};

type ResOpts = { color?: number; mob?: number; group?: number; phase?: number };

export function helix(center: V3, dir: V3, n: number, o: ResOpts = {}): Res[] {
  dir = dir.clone().normalize();
  const [u, v] = basisFor(dir);
  const ph = o.phase ?? 0;
  const start = center.clone().addScaledVector(dir, (-(n - 1) * 1.5) / 2);
  const out: Res[] = [];
  for (let i = 0; i < n; i++) {
    const a = ph + i * 1.745;
    const rad = u.clone().multiplyScalar(Math.cos(a)).addScaledVector(v, Math.sin(a));
    out.push({ p: start.clone().addScaledVector(dir, 1.5 * i).addScaledVector(rad, 2.3), side: rad, ss: "H", color: o.color, mob: o.mob ?? 0.35, group: o.group ?? 0 });
  }
  return out;
}

export function strand(center: V3, dir: V3, n: number, normal: V3, o: ResOpts = {}): Res[] {
  dir = dir.clone().normalize();
  normal = normal.clone().normalize();
  const start = center.clone().addScaledVector(dir, (-(n - 1) * 3.3) / 2);
  const out: Res[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ p: start.clone().addScaledVector(dir, 3.3 * i).addScaledVector(normal, i % 2 ? 0.35 : -0.35), side: normal.clone(), ss: "E", color: o.color, mob: o.mob ?? 0.3, group: o.group ?? 0 });
  }
  return out;
}

export function centroid(res: Res[]) {
  const c = V();
  res.forEach((r) => c.add(r.p));
  return c.multiplyScalar(1 / res.length);
}

/** Join secondary-structure elements with curved loops. */
export function connect(segs: Seg[], o: { center?: V3; seed?: number; loopColor?: number; loopMob?: number } = {}): Res[] {
  const all = segs.flatMap((s) => s.res);
  const center = o.center ?? centroid(all);
  const R = rng(o.seed ?? 7);
  const out: Res[] = [];
  segs.forEach((s, k) => {
    s.res.forEach((r) => out.push(r));
    if (k === segs.length - 1) return;
    const a = s.res[s.res.length - 1], b = segs[k + 1].res[0];
    const mid = a.p.clone().add(b.p).multiplyScalar(0.5);
    const d = a.p.distanceTo(b.p);
    const bdir = s.bulge ? s.bulge.clone().normalize() : mid.clone().sub(center).normalize();
    const amt = (s.amt ?? 1.5 + 0.3 * d) + (s.extra ?? 0) * 1.1;
    const ctrl = mid.clone().addScaledVector(bdir, amt * 2);
    const bez = (u: number) => {
      const w = 1 - u;
      return a.p.clone().multiplyScalar(w * w).addScaledVector(ctrl, 2 * w * u).addScaledVector(b.p, u * u);
    };
    let L = 0, prev = a.p;
    for (let i = 1; i <= 40; i++) { const q = bez(i / 40); L += q.distanceTo(prev); prev = q; }
    const n = Math.max(1, Math.round(L / 3.7) - 1 + (s.extra ?? 0));
    for (let i = 1; i <= n; i++) {
      const u = i / (n + 1);
      const p = bez(u);
      p.x += (R() - 0.5) * 0.8; p.y += (R() - 0.5) * 0.8; p.z += (R() - 0.5) * 0.8;
      let side = a.side.clone().lerp(b.side, u);
      if (side.lengthSq() < 1e-4) side = V(0, 1, 0);
      side.normalize();
      out.push({ p, side, ss: "C", color: s.loopColor ?? o.loopColor, mob: s.loopMob ?? o.loopMob ?? 1, group: s.loopGroup ?? a.group, tag: s.tag });
    }
  });
  return out;
}

/** Floppy terminus. */
export function tail(res: Res[], atEnd: boolean, dir: V3, n: number, o: { color?: number; mob?: number; seed?: number } = {}): Res[] {
  const R = rng(o.seed ?? 3);
  const ref = atEnd ? res[res.length - 1] : res[0];
  const out: Res[] = [];
  let p = ref.p.clone();
  for (let i = 0; i < n; i++) {
    p = p.clone().addScaledVector(dir, 3.2).add(V((R() - 0.5) * 2.4, (R() - 0.5) * 2.4, (R() - 0.5) * 2.4));
    out.push({ p, side: ref.side.clone(), ss: "C", color: o.color, mob: o.mob ?? 1.6, group: ref.group });
  }
  return atEnd ? res.concat(out) : out.reverse().concat(res);
}

export function transformRes(res: Res[], M: THREE.Matrix4) {
  res.forEach((r) => { r.p.applyMatrix4(M); r.side.transformDirection(M); });
  return res;
}

export function mat(rx = 0, ry = 0, rz = 0, tx = 0, ty = 0, tz = 0) {
  return new THREE.Matrix4().compose(V(tx, ty, tz), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), V(1, 1, 1));
}

/** Rossmann-like α/β domain: four parallel strands, helices on both faces. */
export function alphaBeta(o: { seed?: number; H?: number; E?: number; C?: number; M?: THREE.Matrix4 } = {}): Res[] {
  const s = 4.8;
  const E = (xi: number): Seg => ({ res: strand(V(xi * s, 0, 0), V(0, 1, 0), 6, V(0, 0, 1), { color: o.E }) });
  const H = (xi: number, z: number, ph: number): Seg => ({ res: helix(V(xi * s, 0, z), V(0.08, -1, 0), 13, { phase: ph, color: o.H }) });
  const segs = [E(-0.5), H(-1.1, 9.5, 0.3), E(-1.5), H(-0.5, -9.5, 1.2), E(0.5), H(1.1, 9.5, 2.1), E(1.5), H(1.0, -9.5, 0.7)];
  let res = connect(segs, { seed: o.seed ?? 11, loopColor: o.C, center: V(0, 0, 0) });
  res = tail(res, false, V(-0.3, -1, 0.4).normalize(), 3, { color: o.C, seed: (o.seed ?? 1) + 5 });
  res = tail(res, true, V(0.5, 1, -0.2).normalize(), 3, { color: o.C, seed: (o.seed ?? 1) + 9 });
  if (o.M) transformRes(res, o.M);
  return res;
}

/* ---------- mesh builder: ribbons, atoms, bonds; each vertex tied to an anchor ---------- */

export class MolBuilder {
  P: number[] = []; Cc: number[] = []; An: number[] = []; I: number[] = [];
  A: number[] = []; M: number[] = []; G: number[] = [];

  anchor(p: V3, m = 1, g = 0) {
    this.A.push(p.x, p.y, p.z); this.M.push(m); this.G.push(g);
    return this.M.length - 1;
  }

  private v(p: V3, c: THREE.Color, a: number) {
    this.P.push(p.x, p.y, p.z); this.Cc.push(c.r, c.g, c.b); this.An.push(a);
  }

  ribbon(res: Res[], pal: Partial<Record<Res["ss"], number>> = {}) {
    const N = res.length, S = 6, K = 12;
    const col = (r: Res) => new THREE.Color(r.color ?? pal[r.ss] ?? PAL.navy);
    const curve = new THREE.CatmullRomCurve3(res.map((r) => r.p), false, "catmullrom", 0.5);
    const Mx = (N - 1) * S + 1;
    const pts: V3[] = [];
    for (let j = 0; j < Mx; j++) pts.push(curve.getPoint(j / (Mx - 1)));
    const dims = (r: Res): [number, number, number] => (r.ss === "H" ? [1.4, 0.32, 3.4] : r.ss === "E" ? [1.05, 0.32, 3.4] : [0.36, 0.36, 2]);
    const base = this.P.length / 3;
    let prev: V3 | null = null;
    const T = V(), W = V();
    for (let j = 0; j < Mx; j++) {
      const fi = j / S, i0 = Math.min(Math.floor(fi), N - 2), f = fi - i0;
      const r0 = res[i0], r1 = res[i0 + 1];
      T.subVectors(pts[Math.min(j + 1, Mx - 1)], pts[Math.max(j - 1, 0)]).normalize();
      let side = r0.side.clone().multiplyScalar(1 - f).addScaledVector(r1.side, f);
      side.addScaledVector(T, -side.dot(T));
      if (side.lengthSq() < 1e-6) side = prev ? prev.clone() : basisFor(T)[0];
      side.normalize();
      if (prev && side.dot(prev) < 0) side.negate();
      prev = side;
      W.crossVectors(T, side).normalize();
      const d0 = dims(r0), d1 = dims(r1);
      let w = lerp(d0[0], d1[0], f), h = lerp(d0[1], d1[1], f);
      const pe = lerp(d0[2], d1[2], f);
      if (r0.ss === "E" && r1.ss !== "E") { w = lerp(1.85, 0.36, f); h = lerp(0.32, 0.36, f); }
      const rr = f < 0.5 ? r0 : r1;
      const c = col(rr);
      const a = this.anchor(pts[j], lerp(r0.mob, r1.mob, f), rr.group);
      for (let k = 0; k < K; k++) {
        const th = (2 * Math.PI * k) / K, cs = Math.cos(th), sn = Math.sin(th);
        const X = Math.sign(cs) * Math.pow(Math.abs(cs), 2 / pe), Y = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / pe);
        this.v(pts[j].clone().addScaledVector(W, w * X).addScaledVector(side, h * Y), c, a);
      }
    }
    for (let j = 0; j < Mx - 1; j++)
      for (let k = 0; k < K; k++) {
        const a = base + j * K + k, b = base + j * K + ((k + 1) % K), c = a + K, d = b + K;
        this.I.push(a, c, b, b, c, d);
      }
    return this;
  }

  sphere(p: V3, r: number, color: number, anchorId: number, seg = 12) {
    const g = new THREE.SphereGeometry(r, seg, Math.max(6, (seg * 0.7) | 0));
    const pos = g.attributes.position, c = new THREE.Color(color), base = this.P.length / 3;
    for (let i = 0; i < pos.count; i++) this.v(V(pos.getX(i) + p.x, pos.getY(i) + p.y, pos.getZ(i) + p.z), c, anchorId);
    const ix = g.index!.array;
    for (let i = 0; i < ix.length; i++) this.I.push(base + ix[i]);
    g.dispose();
    return this;
  }

  cylinder(a: V3, b: V3, r: number, color: number, aA: number, aB: number, colorB?: number) {
    const len = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(r, r, 1, 8, 1, true);
    const pos = g.attributes.position;
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const cA = new THREE.Color(color), cB = new THREE.Color(colorB ?? color), base = this.P.length / 3;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      this.v(V(pos.getX(i), y * len, pos.getZ(i)).applyQuaternion(q).add(mid), y > 0 ? cB : cA, y > 0 ? aB : aA);
    }
    const ix = g.index!.array;
    for (let i = 0; i < ix.length; i++) this.I.push(base + ix[i]);
    g.dispose();
    return this;
  }

  /** Stick side chain from a residue along `dir`; returns the atoms' anchor ids. */
  sidechain(res: Res, dir: V3, n: number, color: number, o: { tip?: number; tipR?: number; root?: number; mobMul?: number } = {}) {
    dir = dir.clone().normalize();
    const [u] = basisFor(dir);
    const ids: number[] = [], ps: V3[] = [];
    let p = res.p.clone();
    const mob = (res.mob ?? 1) * (o.mobMul ?? 1.15), g = res.group;
    for (let k = 0; k <= n; k++) {
      if (k > 0) p = p.clone().addScaledVector(dir, 1.35).addScaledVector(u, k % 2 ? 0.55 : -0.55);
      const id = this.anchor(p, mob, g);
      ids.push(id); ps.push(p);
      if (k > 0) this.sphere(p, k === n ? (o.tipR ?? 0.5) : 0.42, k === n ? (o.tip ?? color) : color, id, 10);
      if (k > 0) this.cylinder(ps[k - 1], p, 0.17, k === 1 ? (o.root ?? color) : color, ids[k - 1], id, color);
    }
    return { ids, tip: ids[ids.length - 1], tipPos: ps[ps.length - 1] };
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.Cc, 3));
    g.setIndex(this.I);
    g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.52, metalness: 0, side: THREE.DoubleSide });
    return new Jiggle(new THREE.Mesh(g, m), this);
  }
}

/** Moves every vertex with its anchor: thermal field × mobility, plus optional per-group rigid motion. */
export class Jiggle {
  mesh: THREE.Mesh;
  private base: Float32Array; private anc: Uint32Array; private A: Float32Array;
  private Mb: Float32Array; private G: Uint8Array; private D: Float32Array;
  private o = V(); private v = V();

  constructor(mesh: THREE.Mesh, b: MolBuilder) {
    this.mesh = mesh;
    this.base = new Float32Array(b.P); this.anc = new Uint32Array(b.An); this.A = new Float32Array(b.A);
    this.Mb = new Float32Array(b.M); this.G = new Uint8Array(b.G); this.D = new Float32Array(b.A.length);
  }

  update(t: number, amp: number, gm: Record<number, THREE.Matrix4> = {}) {
    const { A, D, o, v } = this;
    for (let i = 0, n = this.Mb.length; i < n; i++) {
      const x = A[3 * i], y = A[3 * i + 1], z = A[3 * i + 2];
      v.set(x, y, z);
      const g = this.G[i];
      if (g && gm[g]) v.applyMatrix4(gm[g]);
      disp(x, y, z, t, o);
      const m = this.Mb[i] * amp;
      D[3 * i] = v.x + o.x * m - x; D[3 * i + 1] = v.y + o.y * m - y; D[3 * i + 2] = v.z + o.z * m - z;
    }
    const attr = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
    const P = attr.array as Float32Array, B = this.base, an = this.anc;
    for (let i = 0, n = an.length; i < n; i++) {
      const a = an[i] * 3;
      P[3 * i] = B[3 * i] + D[a]; P[3 * i + 1] = B[3 * i + 1] + D[a + 1]; P[3 * i + 2] = B[3 * i + 2] + D[a + 2];
    }
    attr.needsUpdate = true;
  }

  pos(id: number, out = V()) {
    return out.set(this.A[3 * id] + this.D[3 * id], this.A[3 * id + 1] + this.D[3 * id + 1], this.A[3 * id + 2] + this.D[3 * id + 2]);
  }
}

/** Dotted contact lines (H-bonds / salt bridges) that form and break over time. */
export class Contacts {
  im: THREE.InstancedMesh;
  private list: { ja: Jiggle; ia: number; jb: Jiggle; ib: number; w: number; ph: number; keep: number }[] = [];
  private a = V(); private b = V(); private p = V(); private s = V();
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion();
  private R = rng(77);

  constructor(parent: THREE.Object3D, private max = 300, color: number = PAL.goldDeep, r = 0.2) {
    this.im = new THREE.InstancedMesh(
      new THREE.SphereGeometry(r, 8, 6),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.4 }),
      max,
    );
    this.im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    parent.add(this.im);
  }

  add(ja: Jiggle, ia: number, jb: Jiggle, ib: number, o: { w?: number; ph?: number; keep?: number } = {}) {
    this.list.push({ ja, ia, jb, ib, w: o.w ?? 0.5 + this.R(), ph: o.ph ?? this.R() * 6.28, keep: o.keep ?? 0.6 });
  }

  update(t: number) {
    let k = 0;
    const { a, b, p, s, m, q } = this;
    for (const c of this.list) {
      c.ja.pos(c.ia, a); c.jb.pos(c.ib, b);
      const d = a.distanceTo(b);
      const vis = smooth(-0.15, 0.25, Math.sin(t * c.w + c.ph) * 0.5 + 0.5 * Math.sin(t * c.w * 0.37 + c.ph * 2) + c.keep - 0.5) * smooth(9, 6, d);
      const nb = Math.max(2, Math.floor(d / 0.75));
      for (let i = 1; i < nb && k < this.max; i++) {
        s.setScalar(vis);
        m.compose(p.copy(a).lerp(b, i / nb), q, s);
        this.im.setMatrixAt(k++, m);
      }
    }
    s.setScalar(0);
    m.compose(a, q, s);
    for (; k < this.max; k++) this.im.setMatrixAt(k, m);
    this.im.instanceMatrix.needsUpdate = true;
  }
}

/* ---------- soft sprites ---------- */

function radialTex(inner: string, outer: string, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function shadowDisc(parent: THREE.Object3D, y: number, rx: number, rz: number) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: radialTex("rgba(30,91,168,0.16)", "rgba(30,91,168,0)"), transparent: true, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.scale.set(rx * 2, rz * 2, 1);
  m.position.y = y;
  parent.add(m);
  return m;
}

export function halo(parent: THREE.Object3D, color = "rgba(244,196,48,0.55)", size = 8) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTex(color, "rgba(244,196,48,0)"), transparent: true, depthWrite: false }));
  s.scale.set(size, size, 1);
  parent.add(s);
  return s;
}

/** Drifting solvent molecules. */
export function solvent(parent: THREE.Object3D, n: number, rMin: number, rMax: number, o: { seed?: number; flat?: number } = {}) {
  const im = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.42, 8, 6),
    new THREE.MeshStandardMaterial({ color: PAL.sky, transparent: true, opacity: 0.45, roughness: 0.3 }),
    n,
  );
  const R = rng(o.seed ?? 21);
  const W = Array.from({ length: n }, () => {
    const d = V(R() - 0.5, (R() - 0.5) * (o.flat ?? 1), R() - 0.5).normalize();
    return { p: d.multiplyScalar(lerp(rMin, rMax, Math.sqrt(R()))), ph: [R() * 6.3, R() * 6.3, R() * 6.3], w: 0.4 + R() * 0.7 };
  });
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = V(1, 1, 1), p = V();
  const tick = (t: number) => {
    W.forEach((w, i) => {
      p.set(w.p.x + 1.6 * Math.sin(t * w.w + w.ph[0]), w.p.y + 1.6 * Math.sin(t * w.w * 1.1 + w.ph[1]), w.p.z + 1.6 * Math.sin(t * w.w * 0.9 + w.ph[2]));
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    });
    im.instanceMatrix.needsUpdate = true;
  };
  tick(0);
  parent.add(im);
  return tick;
}

/** Free every GPU resource under `root`. */
export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    mesh.geometry?.dispose();
    const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
    mats.forEach((m) => {
      (m as THREE.MeshBasicMaterial).map?.dispose();
      m.dispose();
    });
  });
}
