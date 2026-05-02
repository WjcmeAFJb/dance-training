// Top-level loader for the user's keybindings.json.
//
// The file is hand-edited JSONC (with // line comments), so we strip comments
// before parsing. We then normalise into ResolvedBinding[].

import { parseSequence } from "./parseKey.ts";
import type { MenuItem, RawBinding, ResolvedBinding } from "./types.ts";

/** Strip JSONC line and block comments. */
export function stripJsonComments(input: string): string {
  let out = "";
  let i = 0;
  let inString = false;
  let stringQuote: '"' | "'" | "" = "";
  while (i < input.length) {
    const c = input[i] ?? "";
    if (inString) {
      out += c;
      if (c === "\\" && input[i + 1] !== undefined) {
        out += input[i + 1];
        i += 2;
        continue;
      }
      if (c === stringQuote) {
        inString = false;
        stringQuote = "";
      }
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      stringQuote = c as '"' | "'";
      out += c;
      i++;
      continue;
    }
    if (c === "/" && input[i + 1] === "/") {
      while (i < input.length && input[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && input[i + 1] === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Strip JSONC comments and trailing commas. */
export function parseJsonc<T>(input: string): T {
  const noComments = stripJsonComments(input);
  // Remove trailing commas in arrays/objects.
  const noTrailing = noComments.replace(/,(\s*[\]}])/g, "$1");
  return JSON.parse(noTrailing) as T;
}

export interface ParseError {
  index: number;
  raw: unknown;
  message: string;
}

export interface ParseResult {
  bindings: ResolvedBinding[];
  errors: ParseError[];
  /** SHA-1-ish hash so the UI can dedupe re-uploads of the same file. */
  digest: string;
}

export async function parseUserKeybindings(jsonc: string): Promise<ParseResult> {
  const arr = parseJsonc<RawBinding[]>(jsonc);
  const bindings: ResolvedBinding[] = [];
  const errors: ParseError[] = [];

  for (let i = 0; i < arr.length; i++) {
    const raw = arr[i];
    if (!raw || typeof raw.key !== "string" || typeof raw.command !== "string") {
      errors.push({ index: i, raw, message: "missing 'key' or 'command'" });
      continue;
    }
    try {
      const sequence = parseSequence(raw.key);
      const isNegation = raw.command.startsWith("-");
      const command = isNegation ? raw.command.slice(1) : raw.command;
      const isDanceCommand = command === "dance" || command.startsWith("dance.");
      const args = "args" in raw ? raw.args : undefined;
      const when = raw.when;
      const menuName = extractMenuName(command, args);
      const menuItems = extractMenuItems(command, args);

      const r: ResolvedBinding = {
        raw: raw.key,
        sequence,
        command,
        ...(args !== undefined ? { args } : {}),
        ...(when !== undefined ? { when } : {}),
        isNegation,
        isDanceCommand,
        ...(menuName !== undefined ? { menuName } : {}),
        ...(menuItems !== undefined ? { menuItems } : {}),
      };
      bindings.push(r);
    } catch (e) {
      errors.push({
        index: i,
        raw,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const digest = await sha1(jsonc);
  return { bindings, errors, digest };
}

function extractMenuName(command: string, args: unknown): string | undefined {
  if (command !== "dance.openMenu") return undefined;
  if (typeof args !== "object" || args === null) return undefined;
  const m = (args as { menu?: unknown }).menu;
  if (typeof m === "string") return m;
  if (typeof m === "object" && m !== null) return "<inline>";
  const input = (args as { input?: unknown }).input;
  if (typeof input === "string") return input;
  return undefined;
}

function extractMenuItems(command: string, args: unknown): Record<string, MenuItem> | undefined {
  if (command !== "dance.openMenu") return undefined;
  if (typeof args !== "object" || args === null) return undefined;
  const menu = (args as { menu?: unknown }).menu;
  if (!menu || typeof menu !== "object") return undefined;
  const items = (menu as { items?: unknown }).items;
  if (!items || typeof items !== "object") return undefined;
  const out: Record<string, MenuItem> = {};
  for (const [k, v] of Object.entries(items as Record<string, unknown>)) {
    if (
      v &&
      typeof v === "object" &&
      typeof (v as { text?: unknown }).text === "string" &&
      typeof (v as { command?: unknown }).command === "string"
    ) {
      const vv = v as { text: string; command: string; args?: unknown };
      out[k] = {
        text: vv.text,
        command: vv.command,
        ...(vv.args !== undefined ? { args: vv.args } : {}),
      };
    }
  }
  return out;
}

async function sha1(s: string): Promise<string> {
  if (typeof globalThis.crypto?.subtle?.digest === "function") {
    const enc = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest("SHA-1", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback simple hash for environments without subtle.crypto (vitest jsdom).
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
