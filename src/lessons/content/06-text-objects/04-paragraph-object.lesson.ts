import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-paragraph-object",
  folder: "06-text-objects",
  title: "Paragraph object: <a-i>p and <a-a>p",
  blurb: "A paragraph is a run of non-empty lines, terminated by a blank line.",
  est_minutes: 3,
  requires: ["kak.normal.seek.object.inner"],
  teaches: ["kak.normal.seek.object.inner", "kak.normal.seek.object.outer"],
  initial: {
    text:
      "First paragraph line one.\n" +
      "First paragraph line two.\n" +
      "\n" +
      "Second paragraph alone.\n" +
      "\n" +
      "Third paragraph line one.\n" +
      "Third paragraph line two.\n",
    selections: [{ anchor: { line: 3, col: 0 }, active: { line: 3, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Cursor is on the second paragraph (the lonely line). Press {{key:dance.seek.askObject.inner}} to open the inner-object menu.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate:
        "Pick paragraph with `p`. Selection should cover `Second paragraph alone.` — just the body, no surrounding blank lines.",
      goal: { kind: "text-matches", pattern: /Second paragraph alone\./ },
    },
    {
      narrate:
        "Now the whole variant: {{key:dance.seek.askObject}} `p`. This pulls the trailing blank line into the selection — the wrapper.",
      hint: "Use the whole variant when you're about to delete; it tidies the blank-line gap.",
      goal: { kind: "command-fired", id: "dance.seek.askObject" },
    },
    {
      narrate:
        "Last touch: try {{key:dance.edit.yank-delete}} now. The paragraph (with its trailing blank) is gone and yanked.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.edit.yank-delete" },
          { kind: "text-matches", pattern: /Third paragraph/ },
        ],
      },
    },
  ],
};
