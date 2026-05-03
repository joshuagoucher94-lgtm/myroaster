/**
 * Regenerates `scripts/seed-sql/batches/batch-*.sql` from the catalogue export (for Supabase MCP / psql).
 * Run: npx tsx scripts/build-seed-batches.ts
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const full = execSync("npx tsx scripts/export-catalogue-seed-sql.ts", { cwd: root, encoding: "utf-8" });

const statements = full
  .trim()
  .replace(/^BEGIN;\s*\n?/i, "")
  .replace(/\n?COMMIT;\s*$/i, "")
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => `${s};`);

const maxChars = 3500;
const batches: string[] = [];
let cur: string[] = [];
let curLen = 0;

for (const st of statements) {
  const add = st.length + (cur.length ? 1 : 0);
  if (curLen + add > maxChars && cur.length) {
    batches.push(cur.join("\n"));
    cur = [];
    curLen = 0;
  }
  cur.push(st);
  curLen += st.length + 1;
}
if (cur.length) {
  batches.push(cur.join("\n"));
}

const outDir = join(root, "scripts", "seed-sql", "batches");
mkdirSync(outDir, { recursive: true });

for (let i = 0; i < batches.length; i++) {
  const n = String(i).padStart(2, "0");
  writeFileSync(join(outDir, `batch-${n}.sql`), batches[i] + "\n");
}

console.log(`Wrote ${batches.length} batch files to scripts/seed-sql/batches/`);
