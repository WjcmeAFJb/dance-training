import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 559c30948ef59c0eb7000002
// in:  five `* item` lines
// out: item1,item2,item3,item4,item5
// cmd: 4CLd<a-J>r,

export const lesson: Lesson = {
  id: "02-bullets-to-csv",
  folder: "99-golf",
  title: "Golf: bullet list → comma-separated values",
  blurb:
    "Five `* itemN` lines collapsed into a single CSV line. Demonstrates `C` (copy below), `<a-J>` (join + select seams), and `r,` (replace).",
  est_minutes: 5,
  requires: [
    "kak.normal.selections.copy.below",
    "kak.normal.edit.join.select",
    "kak.normal.edit.replace",
  ],
  teaches: ["kak.normal.selections.copy.below", "kak.normal.edit.join.select"],
  initial: {
    text: "* item1\n* item2\n* item3\n* item4\n* item5\n",
  },
  steps: [
    {
      narrate:
        "Target: `item1,item2,item3,item4,item5`. The Kak solution is `4CLd<a-J>r,` — eight chords. Strategy: get a cursor on each `* ` prefix, delete them, then join the lines with commas.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "On line 0, press {{key:dance.selections.copy}} ({{kakkey:C}}) **four times** to mirror the selection on lines 1-4. Five cursors, all on the `*` character.",
      hint: "In the original golf this is `4C` — the `4` is a count prefix. With your bindings, you may need to press the key four times in a row.",
      goal: {
        kind: "command-fired",
        id: "dance.selections.copy",
        count: 4,
      },
    },
    {
      narrate:
        "Each cursor sits on `*`. Extend each to the end of its `* ` prefix with {{key:dance.select.right.extend}} ({{kakkey:L}}) — capital L grows the selection rightwards by one cell at all five cursors at once.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.select.right.extend" },
          { kind: "command-fired", id: "dance.select.lineEnd" },
        ],
      },
    },
    {
      narrate:
        "With `* ` selected on every line, press {{key:dance.edit.delete}} ({{kakkey:d}}) — every prefix vanishes. Buffer should now be `item1\\nitem2\\n…item5\\n`.",
      goal: { kind: "text-matches", pattern: /^item1\nitem2\nitem3\nitem4\nitem5/ },
    },
    {
      narrate:
        "Select all five lines and press {{key:dance.edit.join.select}} ({{kakkey:<a-J>}}) — collapses to one line, leaves the inserted spaces selected.",
      goal: { kind: "command-fired", id: "dance.edit.join.select" },
    },
    {
      narrate:
        "Four spaces selected. Press {{key:dance.edit.replaceCharacters}} (`r`) and type `,`. Done.",
      goal: { kind: "text-equals", expected: "item1,item2,item3,item4,item5\n" },
    },
  ],
};
