// Validates every lesson against the canonical Dance and Kakoune catalogs.
// Exits 1 if any lesson references an unknown command/action id, or if
// `command-fired` goals reference unknown Dance ids.
//
// Run via: pnpm tsx scripts/validate-lessons.ts

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readdir, readFile } from "node:fs/promises";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function loadIds(file: string, regex: RegExp): Promise<Set<string>> {
  const text = await readFile(resolve(ROOT, file), "utf8");
  const out = new Set<string>();
  for (const m of text.matchAll(regex)) out.add(m[1]!);
  return out;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith(".lesson.ts")) out.push(p);
  }
  return out;
}

const main = async (): Promise<void> => {
  const danceIds = await loadIds("src/data/danceCommands.ts", /id:\s*"(dance\.[^"]+)"/g);
  const kakIds = await loadIds("src/data/kakReference.ts", /"(kak\.[^"]+)"/g);
  const discIds = await loadIds("src/data/discrepancies.ts", /id:\s*"(disc\.[^"]+)"/g);

  console.log(
    `loaded ${danceIds.size} dance ids, ${kakIds.size} kak ids, ${discIds.size} discrepancy ids`,
  );

  const lessonFiles = await walk(resolve(ROOT, "src/lessons/content"));
  console.log(`scanning ${lessonFiles.length} lesson files…`);

  type Issue = { file: string; kind: string; id: string };
  const issues: Issue[] = [];

  for (const file of lessonFiles) {
    const src = await readFile(file, "utf8");
    // {{key:dance.foo}}
    for (const m of src.matchAll(/\{\{key:([^}]+)\}\}/g)) {
      const id = m[1]!.trim();
      if (id === "..." || id === "…") continue; // pedagogical placeholders
      if (!danceIds.has(id)) issues.push({ file, kind: "key (Dance)", id });
    }
    // {{action:kak.foo}}
    for (const m of src.matchAll(/\{\{action:([^}]+)\}\}/g)) {
      const id = m[1]!.trim();
      if (id === "..." || id === "…") continue;
      if (!kakIds.has(id)) issues.push({ file, kind: "action (Kak)", id });
    }
    // teaches/requires arrays
    for (const m of src.matchAll(/(teaches|requires)\s*:\s*\[([\s\S]*?)\]/g)) {
      for (const idMatch of m[2]!.matchAll(/"([^"]+)"/g)) {
        const id = idMatch[1]!;
        if (!kakIds.has(id)) issues.push({ file, kind: `${m[1]} (Kak)`, id });
      }
    }
    // discrepancies arrays
    for (const m of src.matchAll(/discrepancies\s*:\s*\[([\s\S]*?)\]/g)) {
      for (const idMatch of m[1]!.matchAll(/"([^"]+)"/g)) {
        const id = idMatch[1]!;
        if (!discIds.has(id)) issues.push({ file, kind: "discrepancy", id });
      }
    }
    // command-fired ids
    for (const m of src.matchAll(/kind:\s*"command-fired"\s*,\s*id:\s*"([^"]+)"/g)) {
      const id = m[1]!;
      // Allow dance.* (validated against canonical) and any user-defined sub-ids.
      if (id.startsWith("dance.") && !danceIds.has(id))
        issues.push({ file, kind: "command-fired (Dance)", id });
    }
  }

  if (issues.length === 0) {
    console.log("✓ all lesson references resolve");
    return;
  }
  console.log(`\n✗ ${issues.length} unknown reference${issues.length === 1 ? "" : "s"}:`);
  const grouped: Record<string, Issue[]> = {};
  for (const i of issues) {
    const rel = i.file.replace(ROOT + "/", "");
    grouped[rel] ??= [];
    grouped[rel]!.push(i);
  }
  for (const [file, items] of Object.entries(grouped)) {
    console.log(`\n  ${file}`);
    for (const it of items) console.log(`    [${it.kind}] ${it.id}`);
  }
  process.exit(1);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
