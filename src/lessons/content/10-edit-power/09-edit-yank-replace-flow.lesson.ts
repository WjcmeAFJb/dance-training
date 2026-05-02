import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "09-edit-yank-replace-flow",
  folder: "10-edit-power",
  title: "Workflow: align, join, replace — together",
  blurb:
    "A short walkthrough that strings four edit power-ups into one refactor: align, copy-indent, join with selected seams, replace.",
  est_minutes: 7,
  requires: [
    "kak.normal.edit.align",
    "kak.normal.edit.join.select",
    "kak.normal.edit.yank.replace",
  ],
  teaches: ["kak.normal.edit.align", "kak.normal.edit.join.select"],
  initial: {
    text:
      "const config = {\n" +
      "host = 'localhost'\n" +
      "port = 5432\n" +
      "user = 'admin'\n" +
      "db = 'production'\n" +
      "}\n",
    selections: [{ anchor: { line: 1, col: 0 }, active: { line: 4, col: 18 } }],
  },
  steps: [
    {
      narrate:
        "Selection covers the four `key = value` lines. The block is unindented. First fix: copy the indent off line 0 across the rest. Press {{key:dance.select.buffer}}, then {{key:dance.selections.splitLines}}.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Now {{key:dance.edit.copyIndentation}} ({{kakkey:<a-&>}}) — but the main selection is line 0, which has no indent. Rotate selections with {{key:dance.selections.rotate.selections}} once so a configured line is main, then copy.",
      hint: "If alignment is the only thing you want, skip this step and go straight to the next.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Reset to the original. Now align the `=`s: {{key:dance.select.buffer}} → {{key:dance.selections.select}} `=` → {{key:dance.edit.align}}. Three keystrokes for tabular config.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.edit.align" },
    },
    {
      narrate:
        "Inspect — every `=` should now sit at the same column. `host`/`port`/`user`/`db` lined up.",
      goal: { kind: "text-matches", pattern: /port = /m },
    },
    {
      narrate:
        "Suppose you now want all four key-values **on one line**, comma-separated. Select the four lines (lines 1-4) and press {{key:dance.edit.join.select}} ({{kakkey:<a-J>}}) — joins with spaces, leaves them selected.",
      reset: {
        text:
          "const config = {\n" +
          "  host = 'localhost'\n" +
          "  port = 5432\n" +
          "  user = 'admin'\n" +
          "  db = 'production'\n" +
          "}\n",
        selections: [{ anchor: { line: 1, col: 0 }, active: { line: 4, col: 19 } }],
      },
      goal: { kind: "command-fired", id: "dance.edit.join.select" },
    },
    {
      narrate:
        "With seam-spaces selected, press {{key:dance.edit.replaceCharacters}} (`r`) and type `,`. Single line, comma-separated. The whole transformation cost about ten keystrokes.",
      goal: { kind: "text-matches", pattern: /'localhost',/ },
    },
    {
      narrate:
        "**The pattern**: split a problem into selections-first, edit-second. Multi-cursor + align + join-select handles maybe half of the formatting jobs you'd reach for a regex for.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
