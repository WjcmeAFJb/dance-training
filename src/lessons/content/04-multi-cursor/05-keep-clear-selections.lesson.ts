import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "05-keep-clear-selections",
  folder: "04-multi-cursor",
  title: "Keep main, drop main: , and <a-,>",
  blurb:
    "Two surgical commands for trimming the selection set: `,` keeps only the main cursor; `<a-,>` removes it.",
  est_minutes: 4,
  requires: ["kak.normal.selections.split.lines"],
  teaches: ["kak.normal.selections.keepMain", "kak.normal.selections.removeMain"],
  initial: {
    text: "first line\nsecond line\nthird line\nfourth line\n",
  },
  steps: [
    {
      narrate:
        "Select the buffer with {{key:dance.select.buffer}} then split per-line with {{key:dance.selections.splitLines}}. Four cursors active.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Press {{key:dance.selections.clear.secondary}} (Kak's `,`). All cursors except the **main** one disappear — useful when you've over-selected and want to start fresh from the primary.",
      hint: "Mnemonic: comma = pause. Pause everyone except the main speaker.",
      goal: { kind: "command-fired", id: "dance.selections.clear.secondary" },
    },
    {
      narrate:
        "Reset and split-lines again. Now press {{key:dance.selections.clear.main}} (Kak's `<a-,>`). The opposite — the **main** cursor is removed and another takes over as main.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.selections.clear.main" },
    },
    {
      narrate:
        "Combined with {{key:dance.selections.rotate.selections}} (next lesson), `<a-,>` lets you walk a list and prune cursors as you go.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.selections.clear.main" },
          { kind: "command-fired", id: "dance.selections.clear.secondary" },
        ],
      },
    },
  ],
};
