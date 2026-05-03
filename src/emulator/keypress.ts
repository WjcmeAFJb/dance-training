// Translate a real KeyboardEvent into our internal KeyChord, then look up the
// matching ResolvedBinding and call dispatch.

import type { KeyChord, KeySeq, Modifier } from "../bindings/types.ts";
import type { ResolvedBinding } from "../bindings/types.ts";
import { dispatch } from "./dance.ts";
import type { DanceMode, EditorState } from "./types.ts";
import { findActiveBindingForChord } from "../bindings/findBinding.ts";

export interface KeyEventLike {
  code: string;
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

export function eventToChord(ev: KeyEventLike): KeyChord {
  const modifiers: Modifier[] = [];
  if (ev.ctrlKey) modifiers.push("ctrl");
  if (ev.shiftKey) modifiers.push("shift");
  if (ev.altKey) modifiers.push("alt");
  if (ev.metaKey) modifiers.push("cmd");

  if (ev.code.startsWith("Key") || ev.code.startsWith("Digit") || isPunctCode(ev.code)) {
    return { modifiers, key: { kind: "code", code: ev.code } };
  }
  // Named keys.
  const namedMap: Record<string, KeyChord["key"]> = {
    Escape: { kind: "named", name: "escape" },
    Tab: { kind: "named", name: "tab" },
    Enter: { kind: "named", name: "enter" },
    Space: { kind: "named", name: "space" },
    Backspace: { kind: "named", name: "backspace" },
    Delete: { kind: "named", name: "delete" },
    Insert: { kind: "named", name: "insert" },
    Home: { kind: "named", name: "home" },
    End: { kind: "named", name: "end" },
    PageUp: { kind: "named", name: "pageup" },
    PageDown: { kind: "named", name: "pagedown" },
    ArrowUp: { kind: "named", name: "up" },
    ArrowDown: { kind: "named", name: "down" },
    ArrowLeft: { kind: "named", name: "left" },
    ArrowRight: { kind: "named", name: "right" },
  };
  const named = namedMap[ev.code];
  if (named) return { modifiers, key: named };

  // Function keys.
  const fMatch = ev.code.match(/^F(\d+)$/);
  if (fMatch) {
    return { modifiers, key: { kind: "named", name: `f${fMatch[1]}` as never } };
  }

  return { modifiers, key: { kind: "char", char: ev.key } };
}

function isPunctCode(code: string): boolean {
  return [
    "Comma",
    "Period",
    "Slash",
    "Backslash",
    "Quote",
    "Backquote",
    "Semicolon",
    "Equal",
    "Minus",
    "BracketLeft",
    "BracketRight",
    "IntlBackslash",
    "IntlYen",
  ].includes(code);
}

export function chordsEqual(a: KeyChord, b: KeyChord): boolean {
  if (a.modifiers.length !== b.modifiers.length) return false;
  for (let i = 0; i < a.modifiers.length; i++) {
    if (a.modifiers[i] !== b.modifiers[i]) return false;
  }
  if (a.key.kind !== b.key.kind) return false;
  if (a.key.kind === "code" && b.key.kind === "code") return a.key.code === b.key.code;
  if (a.key.kind === "char" && b.key.kind === "char") return a.key.char === b.key.char;
  if (a.key.kind === "named" && b.key.kind === "named") return a.key.name === b.key.name;
  return false;
}

export function sequencesEqual(a: KeySeq, b: KeySeq): boolean {
  if (a.length !== b.length) return false;
  return a.every((c, i) => {
    const other = b[i];
    return other ? chordsEqual(c, other) : false;
  });
}

/**
 * Find the binding whose stored sequence matches the chord we just observed,
 * possibly continuing a previously buffered prefix. Filters by `when` clause
 * using the current Dance mode and prefers dance.* / cursor* commands.
 */
export function findMatchingBinding(
  chordHistory: KeyChord[],
  bindings: readonly ResolvedBinding[],
  mode: DanceMode = "normal",
): { match?: ResolvedBinding; partial: boolean } {
  return findActiveBindingForChord(chordHistory, bindings, mode);
}

export function applyBinding(state: EditorState, b: ResolvedBinding): EditorState {
  if (b.command === "dance.run" && typeof b.args === "object" && b.args) {
    const args = b.args as { commands?: unknown; code?: unknown };
    // Form 1: dance.run with an array of [command, args] tuples.
    if (Array.isArray(args.commands)) {
      let s = state;
      for (const entry of args.commands) {
        if (Array.isArray(entry) && typeof entry[0] === "string") {
          const id = entry[0].startsWith(".") ? `dance${entry[0]}` : entry[0];
          s = dispatch(s, id, entry[1]);
        }
      }
      return s;
    }
    // Form 2: dance.run with a JS code string (or array of lines).
    // We don't run JS — we extract every executeCommand('id') call and pick
    // the most relevant one (preferring the dance.* variant over a VS Code
    // built-in equivalent). This covers the common Dance-setup pattern of
    //   if (repetitions > 1) executeCommand('dance.foo', { count: repetitions })
    //   else executeCommand('cursorBuiltin')
    if (args.code !== undefined) {
      const code = Array.isArray(args.code) ? args.code.join("\n") : String(args.code);
      const ids = extractExecuteCommandIds(code);
      const dancePreferred = ids.find((id) => id.startsWith("dance."));
      const picked = dancePreferred ?? ids[0];
      if (picked) {
        const mapped = mapVsCodeCommand(picked);
        return dispatch(state, mapped, undefined);
      }
    }
    // Unhandled dance.run form: log so verifiers can react, but no state mutation.
    return dispatch(state, "dance.run", b.args);
  }
  return dispatch(state, b.command, b.args);
}

const EXECUTE_CMD_RE = /executeCommand\s*\(\s*['"`]([^'"`]+)['"`]/g;

function extractExecuteCommandIds(code: string): string[] {
  const out: string[] = [];
  let m;
  while ((m = EXECUTE_CMD_RE.exec(code)) !== null) {
    if (m[1]) out.push(m[1]);
  }
  return out;
}

const VSCODE_TO_DANCE: Record<string, string> = {
  cursorDown: "dance.select.down.jump",
  cursorUp: "dance.select.up.jump",
  cursorLeft: "dance.select.left.jump",
  cursorRight: "dance.select.right.jump",
  cursorDownSelect: "dance.select.down.extend",
  cursorUpSelect: "dance.select.up.extend",
  cursorLeftSelect: "dance.select.left.extend",
  cursorRightSelect: "dance.select.right.extend",
  cursorHome: "dance.select.lineStart",
  cursorEnd: "dance.select.lineEnd",
  cursorTop: "dance.select.firstLine.jump",
  cursorBottom: "dance.select.lastLine.jump",
  cursorWordLeft: "dance.seek.word.backward",
  cursorWordRight: "dance.seek.word",
  cursorWordEndRight: "dance.seek.wordEnd",
  cursorPageUp: "dance.select.firstVisibleLine.jump",
  cursorPageDown: "dance.select.lastVisibleLine.jump",
  undo: "dance.history.undo",
  redo: "dance.history.redo",
};

function mapVsCodeCommand(id: string): string {
  return VSCODE_TO_DANCE[id] ?? id;
}
