import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "08-extending-objects",
  folder: "06-text-objects",
  title: "Object endpoints: start, end, extend",
  blurb:
    "Dance splits each object pick into select / select-to-start / select-to-end / extend variants. Same menu, different boundary.",
  est_minutes: 5,
  requires: ["kak.normal.seek.object.inner"],
  teaches: [],
  initial: {
    text: "alpha beta gamma delta epsilon\n",
    selections: [{ anchor: { line: 0, col: 12 }, active: { line: 0, col: 13 } }],
  },
  steps: [
    {
      narrate:
        "Cursor sits in **gamma**. `dance.seek.askObject.inner` selects the whole word; the **start/end** variants only move one side of the selection.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate: "Pick `w` after the menu opens — selection should snap to `gamma`.",
      goal: { kind: "text-matches", pattern: /gamma/ },
    },
    {
      narrate:
        "Now run `dance.seek.askObject.inner.start.extend` from the palette. It takes the **left** boundary of the object and pushes the cursor to it, **extending** the existing selection.",
      hint: "Use this when you want to grow a selection up to (but not including) the next object boundary.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.seek.askObject.inner.start.extend" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Mirror with `dance.seek.askObject.inner.end.extend` — push the active end to the **right** boundary.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.seek.askObject.inner.end.extend" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Putting it together: bind start/end variants to fast keys when you grow selections often. The whole-object variants (`dance.seek.askObject.start`, `.end`) work the same on the wrapper-included pick.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
