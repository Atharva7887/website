// Trim RCSB PDB files to what the docking "What we analyse" scenes read, for public/pdb.
// Usage: node scripts/trim-pdb.mjs <dir containing 1HSG.pdb 1BRS.pdb 3HFM.pdb>
// Source: https://files.rcsb.org/download/<ID>.pdb (PDB data is CC0). Keeps HELIX/SHEET
// records and heavy-atom ATOM/HETATM lines (altloc A, no water) for the listed chains.
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(process.argv[2] ?? "pdb");
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../public/pdb");
fs.mkdirSync(OUT, { recursive: true });

const JOBS = { "1HSG": ["A", "B"], "1BRS": ["A", "D"], "3HFM": ["H", "L", "Y"] };

for (const [id, chains] of Object.entries(JOBS)) {
  const keep = [`REMARK   0 ${id} from RCSB PDB (CC0), trimmed to chains ${chains.join(",")} for IndiskaAI docking visuals`];
  for (const l of fs.readFileSync(path.join(SRC, `${id}.pdb`), "utf8").split(/\r?\n/)) {
    const rec = l.slice(0, 6);
    if (rec === "ENDMDL") break;
    if (rec === "HELIX " && chains.includes(l[19])) { keep.push(l); continue; }
    if (rec === "SHEET " && chains.includes(l[21])) { keep.push(l); continue; }
    if (rec !== "ATOM  " && rec !== "HETATM") continue;
    if (!chains.includes(l[21])) continue;
    const alt = l[16];
    if (alt && alt !== " " && alt !== "A") continue;
    const resn = l.slice(17, 20).trim();
    if (resn === "HOH" || resn === "WAT") continue;
    const el = (l.slice(76, 78).trim() || l.slice(12, 14).trim()).toUpperCase().replace(/[^A-Z]/g, "");
    if (el === "H" || el === "D") continue;
    keep.push(l.slice(0, 54).padEnd(76) + l.slice(76, 78));
  }
  keep.push("END");
  const file = path.join(OUT, `${id}.pdb`);
  fs.writeFileSync(file, keep.join("\n") + "\n");
  console.log(id, keep.length, "lines", (fs.statSync(file).size / 1024).toFixed(1), "KB");
}
