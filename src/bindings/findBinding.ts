// Look up the user's binding(s) for a given Dance command id, considering
// negation rules and 'when' clauses.

import type { ResolvedBinding } from "./types.ts";

export interface BindingLookup {
  /** True if the user explicitly disabled the canonical binding (`-cmd`). */
  disabled: boolean;
  /** Active bindings (most-relevant first, normal-mode preferred). */
  matches: ResolvedBinding[];
}

const NORMAL_MODE_HINTS = ["dance.mode == 'normal'", 'dance.mode == "normal"'];

export function findBindingsFor(
  command: string,
  bindings: readonly ResolvedBinding[],
): BindingLookup {
  const matches: ResolvedBinding[] = [];
  let disabled = false;
  for (const b of bindings) {
    if (b.command !== command) continue;
    if (b.isNegation) {
      disabled = true;
      continue;
    }
    matches.push(b);
  }
  matches.sort(scoreBinding);
  return { disabled, matches };
}

function scoreBinding(a: ResolvedBinding, b: ResolvedBinding): number {
  // Normal mode bindings first; shorter sequences first; smaller raw string first.
  const aNormal = isNormalMode(a) ? 0 : 1;
  const bNormal = isNormalMode(b) ? 0 : 1;
  if (aNormal !== bNormal) return aNormal - bNormal;
  if (a.sequence.length !== b.sequence.length) return a.sequence.length - b.sequence.length;
  return a.raw.length - b.raw.length;
}

function isNormalMode(b: ResolvedBinding): boolean {
  if (!b.when) return true;
  for (const hint of NORMAL_MODE_HINTS) {
    if (b.when.includes(hint)) return true;
  }
  // No explicit normal hint, no other dance.mode mention → assume not normal-only.
  return !/dance\.mode\s*==/.test(b.when);
}

/** Get the *single* preferred binding for a command, if any. */
export function preferredBinding(
  command: string,
  bindings: readonly ResolvedBinding[],
): ResolvedBinding | undefined {
  return findBindingsFor(command, bindings).matches[0];
}
