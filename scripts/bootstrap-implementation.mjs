/**
 * One-time bootstrap script that writes the full First Dose implementation.
 * Run: node scripts/bootstrap-implementation.mjs
 */
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

// --- gitignore ---
const giPath = path.join(root, ".gitignore");
const gi = fs.readFileSync(giPath, "utf8");
if (!gi.includes("data/")) {
  fs.appendFileSync(giPath, "\n# Local case JSON storage\ndata/\n");
}

console.log("Bootstrap starting...");
console.log("Use write-files.mjs parts for full content");
