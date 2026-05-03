// Look up the user's binding(s) for a given Dance command id, considering
// negation rules and `when` clauses.

import type { ResolvedBinding } from "./types.ts";
import type { DanceMode } from "../emulator/types.ts";
import { evaluateWhen, type WhenContext } from "./whenClause.ts";

export interface BindingLookup {
  disabled: boolean;
  matches: ResolvedBinding[];
}

export function whenContextFor(mode: DanceMode): WhenContext {
  return {
    values: {
      // Always true in our app.
      editorTextFocus: true,
      editorFocus: true,
      // We don't ship jumpy2 / vspacecode / whichkey overlays.
      "jumpy2.jump-mode": false,
      "jumpy2.isActive": false,
      whichkeyVisible: false,
      whichkeyActive: false,
      vspacecodeVisible: false,
      // No list-style focus (file explorer, etc.) in our editor.
      listFocus: false,
      treestickyScroll: false,
      // No nested input focus inside Monaco for normal/select operations.
      inputFocus: false,
      // Dance state.
      "dance.mode": mode,
    },
  };
}

export function findBindingsFor(
  command: string,
  bindings: readonly ResolvedBinding[],
  mode: DanceMode = "normal",
): BindingLookup {
  const ctx = whenContextFor(mode);
  const matches: ResolvedBinding[] = [];
  let disabled = false;
  for (const b of bindings) {
    if (b.command !== command) continue;
    if (!evaluateWhen(b.when, ctx)) continue;
    if (b.isNegation) {
      disabled = true;
      continue;
    }
    matches.push(b);
  }
  matches.sort((a, b) => a.sequence.length - b.sequence.length || a.raw.length - b.raw.length);
  return { disabled, matches };
}

export function preferredBinding(
  command: string,
  bindings: readonly ResolvedBinding[],
  mode: DanceMode = "normal",
): ResolvedBinding | undefined {
  return findBindingsFor(command, bindings, mode).matches[0];
}

/**
 * Pick the best binding matching the pressed chord history. Filters by
 * `when` clause (using `mode`), prefers Dance commands over jumpy/whichkey,
 * and discards negated bindings.
 */
export function findActiveBindingForChord(
  chordHistory: import("./types.ts").KeyChord[],
  bindings: readonly ResolvedBinding[],
  mode: DanceMode,
): { match?: ResolvedBinding; partial: boolean } {
  const ctx = whenContextFor(mode);
  let partial = false;
  let exact: ResolvedBinding | undefined;
  let exactRank = Infinity;
  for (const b of bindings) {
    if (b.isNegation) continue;
    if (!evaluateWhen(b.when, ctx)) continue;
    const len = b.sequence.length;
    if (len === chordHistory.length && sequencesEqual(b.sequence, chordHistory)) {
      const rank = bindingRank(b);
      if (rank < exactRank) {
        exact = b;
        exactRank = rank;
      }
    } else if (
      len > chordHistory.length &&
      sequencesEqual(b.sequence.slice(0, chordHistory.length), chordHistory)
    ) {
      partial = true;
    }
  }
  return exact ? { match: exact, partial } : { partial };
}

function sequencesEqual(a: import("./types.ts").KeySeq, b: import("./types.ts").KeySeq): boolean {
  if (a.length !== b.length) return false;
  return a.every((c, i) => {
    const o = b[i];
    if (!o) return false;
    if (c.modifiers.length !== o.modifiers.length) return false;
    for (let j = 0; j < c.modifiers.length; j++) {
      if (c.modifiers[j] !== o.modifiers[j]) return false;
    }
    if (c.key.kind !== o.key.kind) return false;
    if (c.key.kind === "code" && o.key.kind === "code") return c.key.code === o.key.code;
    if (c.key.kind === "char" && o.key.kind === "char") return c.key.char === o.key.char;
    if (c.key.kind === "named" && o.key.kind === "named") return c.key.name === o.key.name;
    return false;
  });
}

function bindingRank(b: ResolvedBinding): number {
  // Lower is better.
  // Strong preference for our own emulator commands; then anything dance.*; then everything else.
  if (b.command.startsWith("dance.")) return 0;
  if (/^cursor[A-Z]/.test(b.command)) return 1; // VS Code cursor commands we can map
  return 10;
}
