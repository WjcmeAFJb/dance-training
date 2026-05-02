import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "10-merge-and-sort",
  folder: "04-multi-cursor",
  title: "Merge contiguous, sort selections",
  blurb:
    "Tidy your cursor set: `<a-_>` collapses adjacent selections; `dance.selections.sort` reorders by their content.",
  est_minutes: 5,
  requires: ["kak.normal.selections.split.lines"],
  teaches: ["kak.normal.selections.merge"],
  initial: {
    text: "gamma\nalpha\ndelta\nbeta\n",
  },
  steps: [
    {
      narrate:
        "Select the buffer and split per line: {{key:dance.select.buffer}} then {{key:dance.selections.splitLines}}. Four selections, in document order.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "First, merging. If two selections touch (or overlap), {{key:dance.selections.merge}} folds them into one. Useful after rotations or careless `N` presses leave duplicates.",
      hint: "Try selecting the buffer and pressing {{key:dance.selections.merge}} — multiple line selections become one. Reset to continue.",
      goal: { kind: "command-fired", id: "dance.selections.merge" },
    },
    {
      narrate:
        "Now the sort. **Heads up**: `dance.selections.sort` has **no Kakoune equivalent** as a default keybinding — Kak users typically pipe through `| sort`. Dance gives you a real command, but you need to bind it yourself or invoke it from the command palette.",
      reset: "initial",
      goal: { kind: "any", goals: [{ kind: "mode-is", mode: "normal" }] },
    },
    {
      narrate:
        "With four split-line selections, run `dance.selections.sort` (Cmd-Shift-P → 'Sort selections', or your binding). The selection contents reorder alphabetically.",
      hint: "If you haven't bound it, the chip {{key:dance.selections.sort}} will look unbound — that's the point of this lesson.",
      goal: { kind: "command-fired", id: "dance.selections.sort" },
    },
    {
      narrate:
        "Together, `merge` and `sort` are the cleanup crew you reach for once your multi-cursor structure stops being pretty.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.selections.merge" },
          { kind: "command-fired", id: "dance.selections.sort" },
        ],
      },
    },
  ],
};
