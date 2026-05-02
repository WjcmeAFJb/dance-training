import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "00-orientation",
  folder: "99-golf",
  title: "Vim Golf — orientation",
  blurb:
    "How to read the demo cards, why we don't translate to your bindings automatically, and what to expect.",
  est_minutes: 2,
  teaches: [],
  initial: { text: "Press any motion key to advance.\n" },
  steps: [
    {
      narrate:
        "Each demo shows the **input**, the **target output**, and Kakoune's **canonical solution**. The solution is shown verbatim because most golf solutions use Kak-only commands (e.g. `:colon` mode, shell pipes).",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.select.right.jump" },
          { kind: "command-fired", id: "dance.select.down.jump" },
        ],
      },
    },
    {
      narrate:
        "When you visit a demo, try the keystrokes in your own editor — VS Code with Dance, or real Kakoune. If you finish faster, please open a PR.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.select.left.jump" },
          { kind: "command-fired", id: "dance.modes.insert.before" },
        ],
      },
    },
  ],
};
