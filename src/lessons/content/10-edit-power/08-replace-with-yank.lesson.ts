import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "08-replace-with-yank",
  folder: "10-edit-power",
  title: "Replace with yank: R",
  blurb:
    "Yank once, replace many. `R` swaps the current selection for the clipboard's contents — without losing what was there.",
  est_minutes: 5,
  requires: ["kak.normal.selections.yank", "kak.normal.search.next.add"],
  teaches: ["kak.normal.edit.yank.replace"],
  discrepancies: ["disc.register.default"],
  initial: {
    text:
      "Xhe Quick Brown Fox Jumps Over The Lazy Dog.\n" +
      "The Xuick Brown Fox Jumps Over The Lazy Dog.\n" +
      "The Quick Xrown Fox Jumps Over The Lazy Dog.\n",
  },
  steps: [
    {
      narrate:
        "Park on `T` of the **second** line (it's already the right letter). Yank it with {{key:dance.selections.saveText}} (`y`). The clipboard now holds `T`.",
      goal: { kind: "command-fired", id: "dance.selections.saveText" },
    },
    {
      narrate:
        "Now select all the `X` characters. Quickest way: press {{key:dance.search}}, type `X`, Enter — first match selected. Then {{key:dance.search.next.add}} twice to add the other two.",
      goal: { kind: "command-fired", id: "dance.search.next.add", count: 2 },
    },
    {
      narrate:
        "With three `X`s selected, press {{key:dance.edit.yank-replace}} ({{kakkey:R}}). Each selection becomes `T` — the yank's contents, not its characters one-by-one.",
      hint: "Don't confuse with lowercase `r` (replace each *character*). `R` replaces the *whole selection* with the yank.",
      goal: { kind: "text-matches", pattern: /^The Quick Brown/m },
    },
    {
      narrate:
        "Verify: every line should start with `The Quick Brown` now. One yank, three replacements.",
      goal: {
        kind: "all",
        goals: [
          { kind: "text-matches", pattern: /^The Quick Brown Fox/m },
          { kind: "text-matches", pattern: /^The Quick Brown Fox Jumps/m },
        ],
      },
    },
    {
      narrate:
        "**Chained recipe:** search for the wrong thing → `n` repeatedly to gather copies → yank a single correct example → `R`. It's `:%s/wrong/right/g` without leaving the buffer.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
