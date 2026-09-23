// Cut the structure out of each supplied docking-type card image for public/docking-types.
// Usage: node scripts/cutout-docking-types.mjs <dir with 2.png..7.png card images>
// Source images are not committed.
//
// crop the visual half, flood-fill the light background from the borders,
// feather + de-halo the edge, trim, and export a transparent WebP.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire("C:/website/Indiskaai-website/package.json");
const sharp = require("sharp");

const SRC = process.argv[2];
const OUT = "C:/website/Indiskaai-website/public/docking-types";
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  ["2.png", "protein-small-molecule"],
  ["3.png", "protein-protein"],
  ["4.png", "antibody-antigen"],
  ["5.png", "protein-peptide"],
  ["6.png", "protein-dna"],
  ["7.png", "protein-rna"],
];

const BG = [246, 247, 251];

for (const [file, name] of JOBS) {
  const img = sharp(path.join(SRC, file));
  const meta = await img.metadata();
  const cropW = Math.round(meta.width * 0.53);
  const { data, info } = await img
    .extract({ left: 0, top: 0, width: cropW, height: meta.height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => (y * W + x) * 4;

  // How "not background" a pixel is: colourful or dark ⇒ 1.
  const score = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return Math.min(1, Math.max((mx - mn - 14) / 26, (205 - mn) / 45));
  };

  // Flood-fill background from the crop border through low-score pixels.
  const bg = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (bg[k]) continue;
    if (score(px(x, y)) >= 0.5) continue;
    bg[k] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // Alpha: background 0; a 2px edge band feathered by score; interior opaque.
  const near = (x, y, r) => {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && bg[yy * W + xx]) return true;
      }
    return false;
  };
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = px(x, y), k = y * W + x;
      let a = 1;
      if (bg[k]) a = 0;
      else if (near(x, y, 2)) a = Math.max(0.15, Math.min(1, score(i) * 1.15));
      if (a > 0 && a < 1) {
        for (let c = 0; c < 3; c++) {
          const v = (data[i + c] - (1 - a) * BG[c]) / a;
          data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
        }
      }
      data[i + 3] = Math.round(a * 255);
      if (a > 0.3) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }

  // Drop stray text glyphs from the card heading: small, dark, desaturated
  // components. Colourful molecular fragments are always kept.
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  for (let s = 0; s < W * H; s++) {
    if (label[s] !== -1 || data[s * 4 + 3] === 0) continue;
    const id = comps.length;
    const q = [s];
    label[s] = id;
    let n = 0, sat = 0, mxs = 0;
    const members = [];
    while (q.length) {
      const k = q.pop();
      members.push(k);
      n++;
      const i = k * 4;
      const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]);
      sat += mx - mn;
      mxs += mx;
      const x = k % W, y = (k / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const kk = yy * W + xx;
        if (label[kk] === -1 && data[kk * 4 + 3] > 0) { label[kk] = id; q.push(kk); }
      }
    }
    const cx = members.reduce((s, k) => s + (k % W), 0) / n;
    comps.push({ n, sat: sat / n, mx: mxs / n, cx, members });
  }
  const largest = Math.max(...comps.map((c) => c.n));
  let dropped = 0;
  for (const c of comps) {
    const texty = c.sat < 60 && c.mx < 195;
    const inTextColumn = c.cx > W * 0.86;
    if (c.n < largest * 0.02 && (texty || inTextColumn)) {
      for (const k of c.members) data[k * 4 + 3] = 0;
      dropped++;
    }
  }
  minX = W; minY = H; maxX = 0; maxY = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (data[px(x, y) + 3] > 77) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
  if (dropped) console.log(`  ${name}: removed ${dropped} text fragment(s)`);

  const pad = 4;
  const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
  const width = Math.min(W - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(H - top, maxY - minY + 1 + pad * 2);
  const out = sharp(data, { raw: { width: W, height: H, channels: 4 } }).extract({ left, top, width, height });
  await out.clone().webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(OUT, `${name}.webp`));
  
  const st = fs.statSync(path.join(OUT, `${name}.webp`));
  console.log(name, `${width}x${height}`, `${(st.size / 1024).toFixed(1)} KB webp`);
}
