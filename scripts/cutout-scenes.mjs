// Cut full-scene AI renders for public/generated (Antibody Discovery pathway cards).
// Usage: node scripts/cutout-scenes.mjs <dir with the 4 source PNGs> <out dir>
// Source PNGs are not committed; renders are AI-generated (not real structures).
//
// Cut full-scene AI renders: remove a near-white background, keep every
// element in the frame (these are multi-object compositions, not single
// silhouettes), tight-crop to content, feather the edge, export transparent
// WebP. Companion to cutout-docking-types.mjs, which crops to one object.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire("C:/website/Indiskaai-website/package.json");
const sharp = require("sharp");

const SRC = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  ["Lead optimized.png", "lead-optimization-data"],
  ["De Novo.png", "ngs-data"],
  ["Epitope Identification.png", "de-novo-design"],
  ["Agent Image - Clean_ premium 3D scientific molecular visualization_ pharmaceutical drug-discovery so.png", "epitope-identification"],
];

for (const [file, name] of JOBS) {
  const img = sharp(path.join(SRC, file));
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => (y * W + x) * 4;

  // "Not background" score: colourful (any saturation) or noticeably darker than white.
  const score = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return Math.min(1, Math.max((mx - mn - 10) / 30, (247 - mn) / 70));
  };

  const bg = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x += 2) stack.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y += 2) stack.push([0, y], [W - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (bg[k]) continue;
    if (score(px(x, y)) >= 0.5) continue;
    bg[k] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

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
      else if (near(x, y, 2)) a = Math.max(0.12, Math.min(1, score(i) * 1.15));
      if (a > 0 && a < 1) {
        const BG = [250, 247, 240];
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

  const pad = 14;
  const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
  const width = Math.min(W - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(H - top, maxY - minY + 1 + pad * 2);
  const cropped = sharp(data, { raw: { width: W, height: H, channels: 4 } }).extract({ left, top, width, height });

  const target = 900; // downscale from 2752px source — card-grid width, not full-bleed hero
  await cropped.clone().resize({ width: Math.min(target, width) }).webp({ quality: 82, alphaQuality: 85 }).toFile(path.join(OUT, `${name}.webp`));
  const st = fs.statSync(path.join(OUT, `${name}.webp`));
  console.log(name, `${width}x${height} -> webp`, `${(st.size / 1024).toFixed(1)} KB`, `aspect ${(width / height).toFixed(2)}`);
}
