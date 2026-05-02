import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "07-tree-sitter-syntax",
  folder: "06-text-objects",
  title: "Tree-sitter syntax objects (experimental)",
  blurb:
    "Dance ships an AST-aware object family Kak doesn't have. Pick the node, climb the tree, hop siblings.",
  est_minutes: 5,
  requires: ["kak.normal.seek.object.inner"],
  teaches: [],
  discrepancies: ["disc.objects.tree"],
  initial: {
    text:
      "function add(a, b) {\n" +
      "  const sum = a + b;\n" +
      "  return sum;\n" +
      "}\n" +
      "\n" +
      "function mul(a, b) {\n" +
      "  return a * b;\n" +
      "}\n",
    selections: [{ anchor: { line: 1, col: 14 }, active: { line: 1, col: 15 } }],
  },
  steps: [
    {
      narrate:
        "The classic `<a-i>` family uses regex pairs — same as Kakoune. Dance also exposes `dance.seek.syntax.*`, a tree-sitter family that picks the AST node at the cursor.",
      hint: "These commands aren't bound by default. Use the command palette: `Dance: Select syntax object`.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Run **{{action:kak.normal.seek.object.inner}}** for comparison: `<a-i>` `b` would grab a `(...)` pair via regex.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Now invoke `dance.seek.syntax.experimental` from the palette. It snaps the selection to the smallest AST node containing the cursor — for `a + b` that's the binary expression.",
      hint: "If the command is greyed out, your file's language has no tree-sitter grammar registered.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.seek.syntax.experimental" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Climb up with `dance.seek.syntax.parent.experimental` — selection should grow to the whole statement (`const sum = a + b;`).",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.seek.syntax.parent.experimental" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Hop to the next sibling (`return sum;`) with `dance.seek.syntax.next.experimental`. This is structural movement — no regex, no counting.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.seek.syntax.next.experimental" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Bind these to keys you like. A common scheme: leader-prefixed `<space>oo`, `<space>op`, `<space>on`. Tree-sitter objects beat regex pairs for code; keep regex objects for prose.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
