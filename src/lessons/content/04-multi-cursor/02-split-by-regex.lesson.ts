import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-split-by-regex",
  folder: "04-multi-cursor",
  title: "s and S: select-within and split-by",
  blurb:
    "`s` keeps everything matching a regex inside your selection. `S` keeps everything **between** matches. Two sides of the same coin.",
  est_minutes: 6,
  requires: ["kak.normal.search.forward"],
  teaches: ["kak.normal.selections.select.regex", "kak.normal.selections.split.regex"],
  initial: {
    text: "alpha, beta, gamma, delta, epsilon\nzeta, eta, theta\n",
  },
  steps: [
    {
      narrate:
        "First, select the whole buffer with {{key:dance.select.buffer}}. We need a non-empty selection for `s`/`S` to operate on.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "Now press {{key:dance.selections.select}} (Kak's `s`), type the regex `\\w+`, and confirm. Each word becomes its own selection — eight cursors total.",
      hint: "`s` reads: *select within selections*. The regex matches inside the current selection only.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Reset. Re-select the buffer with {{key:dance.select.buffer}}, then try {{key:dance.selections.split}} (the capital `S`) with regex `,\\s*`. This time you get the **non-comma** chunks — words plus the linebreak.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.selections.split" },
    },
    {
      narrate:
        "Mental model: `s` keeps **what matches**, `S` keeps **what's between matches**. Same regex, opposite output.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.selections.select" },
          { kind: "command-fired", id: "dance.selections.split" },
        ],
      },
    },
    {
      narrate:
        "Practice: select the buffer, press {{key:dance.selections.select}}, type `[a-z]+a\\b` to grab only words ending in `a`. You should end up with a handful of selections.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.selections.select", count: 1 },
    },
  ],
};
