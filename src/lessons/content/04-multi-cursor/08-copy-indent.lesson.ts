import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "08-copy-indent",
  folder: "04-multi-cursor",
  title: "Copy indentation: <a-&>",
  blurb:
    "Sister to `&`. Copy the **main** selection's leading indent to every other selection. Useful after pasting code from elsewhere.",
  est_minutes: 4,
  requires: ["kak.normal.selections.split.lines"],
  teaches: ["kak.normal.edit.copyIndent"],
  initial: {
    text: "    fn first() {}\nfn second() {}\nfn third() {}\nfn fourth() {}\n",
  },
  steps: [
    {
      narrate:
        "Line 1 has the indent we want; lines 2-4 are flush left. Select the buffer with {{key:dance.select.buffer}} and split per line with {{key:dance.selections.splitLines}}.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Now press {{key:dance.edit.copyIndentation}}. Dance reads the indent off the **main** selection (line 1) and applies it to all the rest.",
      hint: "If the main isn't on the well-indented line, rotate with {{key:dance.selections.rotate.selections}} until it is.",
      goal: { kind: "command-fired", id: "dance.edit.copyIndentation" },
    },
    {
      narrate: "All four `fn` declarations should now share the same four-space indent.",
      goal: { kind: "text-matches", pattern: /^ {4}fn second/m },
    },
    {
      narrate:
        "Pair with `&` and split-lines as the indent toolkit. Together they handle most reformatting jobs without reaching for a formatter.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.edit.copyIndentation" },
          { kind: "text-matches", pattern: /^ {4}fn fourth/m },
        ],
      },
    },
  ],
};
