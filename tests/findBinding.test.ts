// Verifies findActiveBindingForChord skips inactive `when` clauses (jumpy,
// list focus, wrong dance.mode) and prefers the dance.* binding among
// matches.

import { describe, expect, it } from "vitest";
import { findMatchingBinding } from "@/emulator/keypress.ts";
import { parseSequence } from "@/bindings/parseKey.ts";
import type { ResolvedBinding } from "@/bindings/types.ts";

const make = (raw: string, command: string, when?: string): ResolvedBinding => {
  const r: ResolvedBinding = {
    raw,
    sequence: parseSequence(raw),
    command,
    isNegation: false,
    isDanceCommand: command.startsWith("dance."),
  };
  if (when !== undefined) r.when = when;
  return r;
};

const bindings = [
  make("[KeyJ]", "jumpy2.n", "editorTextFocus && jumpy2.jump-mode"),
  make("[KeyJ]", "list.focusFirst", "listFocus && !inputFocus"),
  make(
    "[KeyJ]",
    "dance.select.left.jump",
    "editorTextFocus && !jumpy2.jump-mode && dance.mode == 'normal'",
  ),
  make("[KeyJ]", "list.collapse", "listFocus && !inputFocus && !listSelectionNavigation"),
  make("[KeyJ]", "whichkey.triggerKey", "whichkeyVisible"),
];

describe("findMatchingBinding (mode-aware)", () => {
  it("picks the dance.* binding from a list with multiple [KeyJ] entries", () => {
    const chord = parseSequence("[KeyJ]");
    const r = findMatchingBinding(chord, bindings, "normal");
    expect(r.match?.command).toBe("dance.select.left.jump");
  });

  it("falls back to no match when not in normal mode and no other binding applies", () => {
    const chord = parseSequence("[KeyJ]");
    const r = findMatchingBinding(chord, bindings, "insert");
    expect(r.match).toBeUndefined();
  });

  it("respects negation entries (skips disabled bindings)", () => {
    const negation: ResolvedBinding = {
      raw: "[KeyJ]",
      sequence: parseSequence("[KeyJ]"),
      command: "dance.select.left.jump",
      when: "editorTextFocus && dance.mode == 'normal'",
      isNegation: true,
      isDanceCommand: true,
    };
    const r = findMatchingBinding(parseSequence("[KeyJ]"), [negation, ...bindings], "normal");
    // Still matches because the non-negated binding survives.
    expect(r.match?.command).toBe("dance.select.left.jump");
  });
});
