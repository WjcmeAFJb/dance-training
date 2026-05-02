import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "05-replace-by-yank",
  folder: "05-search-replace",
  title: "Replace by yank: y, /, R",
  blurb:
    "Kakoune has no `:s/foo/bar/g`. The idiomatic substitute is: yank the **replacement**, search the **target**, then `R` to paste-replace.",
  est_minutes: 6,
  requires: ["kak.normal.selections.yank", "kak.normal.search.forward"],
  teaches: ["kak.normal.edit.yank.replace"],
  discrepancies: ["disc.register.default"],
  initial: {
    text: "REPLACEMENT_TEXT\n\nfoo bar foo baz foo qux\n",
  },
  steps: [
    {
      narrate:
        "Step 1 — get the replacement onto the yank register. Move to line 1, select the word `REPLACEMENT_TEXT` (use {{key:dance.seek.wordEnd}}), then press {{key:dance.selections.saveText}} (Kak's `y`).",
      hint: "Reminder from the discrepancy callout: Dance's `y` writes to the **system clipboard**, not Kak's internal `\"` register. Same workflow, different storage.",
      goal: { kind: "command-fired", id: "dance.selections.saveText" },
    },
    {
      narrate:
        "Step 2 — find every target. Move to line 3, then press {{key:dance.search}}, type `foo`, Enter. Then {{key:dance.search.next.add}} twice to capture all three `foo`s as a multi-selection.",
      goal: { kind: "command-fired", id: "dance.search.next.add", count: 2 },
    },
    {
      narrate:
        "Step 3 — replace. Press {{key:dance.edit.yank-replace}} (Kak's `R`). Every selected `foo` is replaced by the yanked `REPLACEMENT_TEXT`.",
      hint: "`R` = **R**eplace-with-yank. Capital because it's destructive of selection text, not just cursor.",
      goal: { kind: "command-fired", id: "dance.edit.yank-replace" },
    },
    {
      narrate:
        "All three `foo`s should now read `REPLACEMENT_TEXT`. No regex prompt, no `:s` mode — just yank-search-replace.",
      goal: { kind: "text-matches", pattern: /REPLACEMENT_TEXT bar REPLACEMENT_TEXT/ },
    },
    {
      narrate:
        "This pattern is everywhere in Kak workflows. Once you internalise it, the absence of `:s/foo/bar/g` stops feeling like a missing feature.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
