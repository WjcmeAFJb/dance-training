// Pipe-expression evaluator. Mirrors what Dance ships in real VS Code:
// each selection text is fed through a JavaScript expression where:
//   $    — the selection text (string)
//   $$   — all selections joined with newline
//   i    — selection index (0-based)
//   n    — total number of selections
//   _    — the current selection's whole-line context (rare, kept for parity)
//
// We also accept three convenience prefixes:
//   /regex/replacement[/flags]   — JS string.replace
//   #shellish                    — small subset of coreutils (sort/uniq/upper/lower/trim/wc/cat/rev/sed/awk-print/tr)
//   plain expr                    — evaluated as JS

export interface PipeContext {
  selectionText: string;
  selectionIndex: number;
  totalSelections: number;
  allSelections: string[];
}

export function evalPipe(expr: string, ctx: PipeContext): string {
  const trimmed = expr.trim();
  if (!trimmed) return ctx.selectionText;

  // /pattern/replacement[/flags] — `g` is implied; user may add i/m/s/u/y.
  if (trimmed.startsWith("/")) {
    const parts = splitRegexLiteral(trimmed);
    if (parts) {
      const { pattern, replacement, flags } = parts;
      const merged = (flags ?? "").includes("g") ? (flags ?? "g") : `g${flags ?? ""}`;
      try {
        return ctx.selectionText.replace(new RegExp(pattern, merged), replacement);
      } catch {
        return ctx.selectionText;
      }
    }
  }

  // #shellish
  if (trimmed.startsWith("#")) {
    return runShellish(trimmed.slice(1).trim(), ctx);
  }

  // JS expression
  try {
    const fn = new Function(
      "$",
      "$$",
      "i",
      "n",
      "_",
      `"use strict"; const result = (${trimmed}); return result === undefined ? $ : String(result);`,
    ) as ($: string, $$: string, i: number, n: number, _: string) => string;
    const result = fn(
      ctx.selectionText,
      ctx.allSelections.join("\n"),
      ctx.selectionIndex,
      ctx.totalSelections,
      ctx.selectionText,
    );
    return result;
  } catch {
    return ctx.selectionText;
  }
}

function splitRegexLiteral(
  s: string,
): { pattern: string; replacement: string; flags?: string } | undefined {
  const parts: string[] = [];
  let cur = "";
  let escaped = false;
  for (let i = 1; i < s.length; i++) {
    const c = s[i]!;
    if (escaped) {
      cur += c;
      escaped = false;
      continue;
    }
    if (c === "\\") {
      cur += c;
      escaped = true;
      continue;
    }
    if (c === "/") {
      parts.push(cur);
      cur = "";
      if (parts.length === 2) {
        cur = s.slice(i + 1);
        parts.push(cur);
        break;
      }
      continue;
    }
    cur += c;
  }
  if (parts.length < 2) return undefined;
  if (parts.length === 2) parts.push("");
  const result: { pattern: string; replacement: string; flags?: string } = {
    pattern: parts[0]!,
    replacement: parts[1]!,
  };
  if (parts[2]) result.flags = parts[2];
  return result;
}

// Shellish — a tiny subset of coreutils that covers the vast majority of
// Vim-Golf pipe usage. Only operates on the selection text; never touches
// the filesystem or processes.
function runShellish(line: string, ctx: PipeContext): string {
  // Split on `|` outside quotes.
  const stages = splitTopLevel(line, "|");
  let buf = ctx.selectionText;
  for (const stage of stages) {
    buf = applyStage(stage.trim(), buf);
  }
  return buf;
}

function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (c === "'" && !inDouble) inSingle = !inSingle;
    else if (c === '"' && !inSingle) inDouble = !inDouble;
    if (!inSingle && !inDouble && s.slice(i, i + sep.length) === sep) {
      out.push(cur);
      cur = "";
      i += sep.length - 1;
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function tokeniseArgs(line: string): string[] {
  // shell-lite tokenizer: words separated by whitespace; '...' and "..." quoting.
  const out: string[] = [];
  let cur = "";
  let q: '"' | "'" | "" = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (q) {
      if (c === q) q = "";
      else cur += c;
      continue;
    }
    if (c === '"' || c === "'") {
      q = c as '"' | "'";
      continue;
    }
    if (/\s/.test(c)) {
      if (cur) out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

function applyStage(stage: string, input: string): string {
  if (!stage) return input;
  const args = tokeniseArgs(stage);
  const cmd = args[0] ?? "";
  switch (cmd) {
    case "cat":
      return input;
    case "sort": {
      const lines = input.split("\n");
      const reverse = args.includes("-r");
      const numeric = args.includes("-n");
      const unique = args.includes("-u");
      let s = [...lines].sort((a, b) => (numeric ? Number(a) - Number(b) : a.localeCompare(b)));
      if (reverse) s.reverse();
      if (unique) {
        const seen = new Set<string>();
        s = s.filter((l) => (seen.has(l) ? false : (seen.add(l), true)));
      }
      return s.join("\n");
    }
    case "uniq": {
      const lines = input.split("\n");
      const out: string[] = [];
      for (const l of lines) {
        if (out[out.length - 1] !== l) out.push(l);
      }
      return out.join("\n");
    }
    case "rev":
      return input
        .split("\n")
        .map((l) => [...l].reverse().join(""))
        .join("\n");
    case "wc": {
      const flag = args[1];
      const lines = input.split("\n").length;
      const words = input.split(/\s+/).filter(Boolean).length;
      const chars = input.length;
      if (flag === "-l") return String(lines);
      if (flag === "-w") return String(words);
      if (flag === "-c") return String(chars);
      return `${lines} ${words} ${chars}`;
    }
    case "tr": {
      const a = args[1] ?? "";
      const b = args[2] ?? "";
      if (a === "a-z" && b === "A-Z") return input.toUpperCase();
      if (a === "A-Z" && b === "a-z") return input.toLowerCase();
      // Naive byte-by-byte transliteration.
      const map = new Map<string, string>();
      for (let i = 0; i < a.length; i++) map.set(a[i]!, b[i] ?? "");
      return [...input].map((c) => map.get(c) ?? c).join("");
    }
    case "head": {
      const n = nFlag(args, 10);
      return input.split("\n").slice(0, n).join("\n");
    }
    case "tail": {
      const n = nFlag(args, 10);
      const lines = input.split("\n");
      return lines.slice(Math.max(0, lines.length - n)).join("\n");
    }
    case "sed": {
      // sed 's/pat/repl/flags' (single substitution form)
      const expr = args[1] ?? "";
      if (!expr.startsWith("s")) return input;
      const sep = expr[1] ?? "/";
      const parts = expr.slice(2).split(sep);
      const pattern = parts[0] ?? "";
      const replacement = parts[1] ?? "";
      const flags = parts[2] ?? "g";
      try {
        return input.replace(new RegExp(pattern, flags), replacement);
      } catch {
        return input;
      }
    }
    case "awk": {
      // awk '{print $N}' single-field projection
      const prog = args[1] ?? "";
      const m = prog.match(/\{\s*print\s+\$(\d+)\s*\}/);
      if (!m) return input;
      const idx = Number(m[1]);
      return input
        .split("\n")
        .map((l) => l.split(/\s+/).filter(Boolean)[idx - 1] ?? "")
        .join("\n");
    }
    case "grep": {
      // First non-flag positional argument is the pattern.
      const pat = args.slice(1).find((a) => !a.startsWith("-")) ?? "";
      const inv = args.includes("-v");
      try {
        const re = new RegExp(pat);
        return input
          .split("\n")
          .filter((l) => (inv ? !re.test(l) : re.test(l)))
          .join("\n");
      } catch {
        return input;
      }
    }
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "trim":
      return input
        .split("\n")
        .map((l) => l.trim())
        .join("\n");
    default:
      return input;
  }
}

function nFlag(args: string[], def: number): number {
  const i = args.indexOf("-n");
  if (i < 0) return def;
  return Number(args[i + 1] ?? def) || def;
}
