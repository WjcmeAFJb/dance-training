// Auto-discovers all golf challenges in /data/golf/<id>/{in,out,cmd}.
// Each is exposed as a GolfDemo. Title is derived from a 1-line summary
// of in→out (we strip newlines, max 80 chars).

const inputs = import.meta.glob<string>("@data/golf/*/in", {
  eager: true,
  query: "?raw",
  import: "default",
});
const outputs = import.meta.glob<string>("@data/golf/*/out", {
  eager: true,
  query: "?raw",
  import: "default",
});
const cmds = import.meta.glob<string>("@data/golf/*/cmd", {
  eager: true,
  query: "?raw",
  import: "default",
});

export interface GolfDemo {
  id: string;
  title: string;
  input: string;
  output: string;
  cmd: string;
  /** Length in keystrokes (raw count after splitting). */
  length: number;
}

const ID_RE = /\/data\/golf\/([^/]+)\/(in|out|cmd)$/;

function idOf(path: string): string | undefined {
  return path.match(ID_RE)?.[1];
}

const inMap = new Map<string, string>();
const outMap = new Map<string, string>();
const cmdMap = new Map<string, string>();
for (const [path, content] of Object.entries(inputs)) {
  const id = idOf(path);
  if (id) inMap.set(id, content);
}
for (const [path, content] of Object.entries(outputs)) {
  const id = idOf(path);
  if (id) outMap.set(id, content);
}
for (const [path, content] of Object.entries(cmds)) {
  const id = idOf(path);
  if (id) cmdMap.set(id, content);
}

const all: GolfDemo[] = [];
for (const id of inMap.keys()) {
  const input = inMap.get(id);
  const output = outMap.get(id);
  const cmd = cmdMap.get(id);
  if (input === undefined || output === undefined || cmd === undefined) continue;
  all.push({
    id,
    title: titleFor(input, output),
    input,
    output,
    cmd: cmd.trim(),
    length: estimateKeystrokes(cmd),
  });
}

all.sort((a, b) => a.length - b.length);

export const GOLF_DEMOS: readonly GolfDemo[] = all;

export function findDemo(id: string): GolfDemo | undefined {
  return GOLF_DEMOS.find((d) => d.id === id);
}

function titleFor(input: string, output: string): string {
  const inLine = (input.split("\n")[0] ?? "").trim();
  const outLine = (output.split("\n")[0] ?? "").trim();
  const t = `${truncate(inLine, 30)} → ${truncate(outLine, 30)}`;
  return t || "Untitled";
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function estimateKeystrokes(cmd: string): number {
  // Count chords. A chord is either a <…> sequence or a single character.
  let count = 0;
  let i = 0;
  while (i < cmd.length) {
    if (cmd[i] === "<") {
      const close = cmd.indexOf(">", i + 1);
      if (close < 0) break;
      count++;
      i = close + 1;
      continue;
    }
    if (/\s/.test(cmd[i] ?? "")) {
      i++;
      continue;
    }
    count++;
    i++;
  }
  return count;
}
