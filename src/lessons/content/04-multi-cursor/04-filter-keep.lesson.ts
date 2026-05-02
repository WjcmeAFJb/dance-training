import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-filter-keep",
  folder: "04-multi-cursor",
  title: "Filter selections: <a-k> and <a-K>",
  blurb:
    "Once you have many cursors, narrow the herd. `<a-k>` keeps only matches; `<a-K>` keeps only non-matches.",
  est_minutes: 5,
  requires: ["kak.normal.selections.split.lines"],
  teaches: ["kak.normal.selections.filterKeep", "kak.normal.selections.filterDrop"],
  initial: {
    text: "user_id\nuser_name\nuser_email\norder_id\norder_total\nproduct_sku\n",
  },
  steps: [
    {
      narrate:
        "Select the whole buffer with {{key:dance.select.buffer}}, then split per-line with {{key:dance.selections.splitLines}}. Six cursors, one per row.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Press {{key:dance.selections.filter.regexp}} and type `^user_`. Only the three `user_*` lines remain selected — the others are dropped.",
      hint: "This is the **keep** filter. The regex must match somewhere inside each selection.",
      goal: { kind: "command-fired", id: "dance.selections.filter.regexp" },
    },
    {
      narrate:
        "Reset and split again. This time press {{key:dance.selections.filter.regexp.inverse}} with regex `^user_` — the inverse keeps everything **not** user-prefixed.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.selections.filter.regexp.inverse" },
    },
    {
      narrate:
        "Compose: split-lines, then alternate filter/inverse to whittle a many-cursor selection down to exactly the rows you want. No clicking, no Ctrl-D spam.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.selections.filter.regexp" },
          { kind: "command-fired", id: "dance.selections.filter.regexp.inverse" },
        ],
      },
    },
  ],
};
