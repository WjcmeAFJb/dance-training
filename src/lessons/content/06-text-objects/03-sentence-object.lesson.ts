import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-sentence-object",
  folder: "06-text-objects",
  title: "Sentence object: <a-i>s",
  blurb:
    "A sentence ends at `.`, `!`, or `?` followed by space or newline. Both Kak and Dance use the same regex — behaviour matches.",
  est_minutes: 3,
  requires: ["kak.normal.seek.object.inner"],
  teaches: ["kak.normal.seek.object.inner"],
  initial: {
    text: "First sentence. Second sentence! Third one? And a fourth.\n",
    selections: [{ anchor: { line: 0, col: 20 }, active: { line: 0, col: 21 } }],
  },
  steps: [
    {
      narrate:
        "Cursor is somewhere inside the second sentence. Press {{key:dance.seek.askObject.inner}} to open the menu.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate:
        "Pick the sentence class with `s`. The selection should cover **`Second sentence!`** without leading whitespace.",
      hint: "Both Dance and Kak detect sentences via the same `[.!?]\\s+` regex; you'll get matching results in both editors.",
      goal: { kind: "text-matches", pattern: /Second sentence!/ },
    },
    {
      narrate:
        "Now the whole variant: {{key:dance.seek.askObject}} `s`. This pulls the trailing space into the selection so deleting cleans up the gap.",
      goal: { kind: "command-fired", id: "dance.seek.askObject" },
    },
    {
      narrate:
        "Tip: chain it with delete — {{key:dance.edit.yank-delete}} after the object call wipes the sentence and yanks it.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
