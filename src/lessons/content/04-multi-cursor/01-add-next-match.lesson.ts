import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-add-next-match",
  folder: "04-multi-cursor",
  title: "Add next match: n vs N",
  blurb:
    "After a search, `n` jumps to the next match (one cursor); `N` adds it (two cursors). Capitalisation is multiplicity.",
  est_minutes: 5,
  requires: ["kak.normal.search.forward"],
  teaches: ["kak.normal.search.next", "kak.normal.search.next.add"],
  initial: {
    text: "foo bar foo baz foo qux foo end\n",
  },
  steps: [
    {
      narrate:
        "Start a forward search with {{key:dance.search}}, type `foo`, then press Enter. Your selection lands on the **first** `foo`.",
      hint: "If your binding is custom, check the chip — it shows your actual key. Otherwise this is {{kakkey:/}}.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
    {
      narrate:
        "Now press {{key:dance.search.next}} to **jump** to the next `foo`. Notice the previous selection is gone — there is still only one cursor.",
      goal: { kind: "command-fired", id: "dance.search.next" },
    },
    {
      narrate:
        "Reset and try the additive form: search `foo` again, then press {{key:dance.search.next.add}}. The new match is **added** as a second selection — two cursors now.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.search.next.add" },
    },
    {
      narrate:
        "Keep pressing {{key:dance.search.next.add}} until **all four** instances of `foo` are selected. The status bar should read `4 sels`.",
      reset: { text: "foo bar foo baz foo qux foo end\n" },
      hint: "Search for `foo`, then mash {{key:dance.search.next.add}} three more times.",
      goal: { kind: "command-fired", id: "dance.search.next.add", count: 3 },
    },
    {
      narrate:
        "With every `foo` selected, type `FOO` (after pressing {{key:dance.edit.yank-delete-insert}} to enter Insert) — every cursor edits in lock-step. This is the multi-cursor superpower.",
      goal: {
        kind: "any",
        goals: [
          { kind: "text-matches", pattern: /FOO/ },
          { kind: "command-fired", id: "dance.edit.yank-delete-insert" },
        ],
      },
    },
  ],
};
