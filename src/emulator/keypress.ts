// Translate a real KeyboardEvent into our internal KeyChord, then look up the
// matching ResolvedBinding and call dispatch.

import type { KeyChord, KeySeq, Modifier } from "../bindings/types.ts";
import type { ResolvedBinding } from "../bindings/types.ts";
import { dispatch } from "./dance.ts";
import type { EditorState } from "./types.ts";

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
 * possibly continuing a previously buffered prefix.
 */
export function findMatchingBinding(
  chordHistory: KeyChord[],
  bindings: readonly ResolvedBinding[],
): { match?: ResolvedBinding; partial: boolean } {
  let partial = false;
  for (const b of bindings) {
    if (b.isNegation) continue;
    if (b.sequence.length === chordHistory.length && sequencesEqual(b.sequence, chordHistory)) {
      return { match: b, partial: false };
    }
    if (
      b.sequence.length > chordHistory.length &&
      sequencesEqual(b.sequence.slice(0, chordHistory.length), chordHistory)
    ) {
      partial = true;
    }
  }
  return { partial };
}

export function applyBinding(state: EditorState, b: ResolvedBinding): EditorState {
  // dance.run with sub-commands: dispatch each in turn.
  if (b.command === "dance.run" && typeof b.args === "object" && b.args) {
    const commands = (b.args as { commands?: unknown }).commands;
    if (Array.isArray(commands)) {
      let s = state;
      for (const entry of commands) {
        if (Array.isArray(entry) && typeof entry[0] === "string") {
          const id = entry[0].startsWith(".") ? `dance${entry[0]}` : entry[0];
          s = dispatch(s, id, entry[1]);
        }
      }
      return s;
    }
    return dispatch(state, "dance.run", b.args);
  }
  return dispatch(state, b.command, b.args);
}
