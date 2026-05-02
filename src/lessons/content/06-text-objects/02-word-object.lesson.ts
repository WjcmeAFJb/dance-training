import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-word-object",
  folder: "06-text-objects",
  title: "Word object: <a-i>w and <a-a>w",
  blurb:
    "Select the word the cursor sits in — no walking, no counting. Inner is just the word; whole grabs the trailing space too.",
  est_minutes: 3,
  requires: ["kak.normal.seek.object.inner"],
  teaches: ["kak.normal.seek.object.inner", "kak.normal.seek.object.outer"],
  initial: {
    text: "the quick brown fox jumps over the lazy dog\n",
    selections: [{ anchor: { line: 0, col: 10 }, active: { line: 0, col: 11 } }],
  },
  steps: [
    {
      narrate:
        "Cursor is parked inside **brown**. Open the inner-object menu with {{key:dance.seek.askObject.inner}}.",
      hint: "Default: {{kakkey:<a-i>}}.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate:
        "Press `w` to pick the word class. The selection should now be exactly `brown` — letters only, no spaces.",
      goal: { kind: "text-matches", pattern: /brown/ },
    },
    {
      narrate:
        "Now try the whole-word version: {{key:dance.seek.askObject}} then `w`. This grabs the word **and** the trailing whitespace.",
      hint: "Default prefix: {{kakkey:<a-a>}}.",
      goal: { kind: "command-fired", id: "dance.seek.askObject" },
    },
    {
      narrate:
        "Inner = the noun. Whole = the noun and its breath. Mostly you'll want inner; whole is handy when deleting because it cleans up the gap.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
