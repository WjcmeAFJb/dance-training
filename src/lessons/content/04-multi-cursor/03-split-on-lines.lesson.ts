import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-split-on-lines",
  folder: "04-multi-cursor",
  title: "Split on lines: <a-s>",
  blurb:
    "The fastest way to get one cursor per line. After a multi-line selection, `<a-s>` splits at every newline.",
  est_minutes: 4,
  teaches: ["kak.normal.selections.split.lines"],
  initial: {
    text: "TODO: refactor parser\nTODO: write tests\nTODO: ship it\nTODO: celebrate\n",
  },
  steps: [
    {
      narrate:
        "Select all four lines with {{key:dance.select.buffer}}. We need a multi-line selection before splitting.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "Now press {{key:dance.selections.splitLines}}. Each line becomes its own selection — four cursors, one per line.",
      hint: "Kakoune calls this `<a-s>`. Think *split on `\\n`*.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "With a cursor on every line, press {{key:dance.modes.insert.lineStart}} to enter Insert at line start, type `- `, then Escape. You've turned every line into a bullet, in two keystrokes after the split.",
      goal: { kind: "text-matches", pattern: /^- TODO: refactor parser$/m },
    },
    {
      narrate:
        "This pattern — select-buffer, split-lines, insert-line-start — is the bread-and-butter of multi-cursor work in Kak.",
      goal: {
        kind: "any",
        goals: [
          { kind: "mode-is", mode: "normal" },
          { kind: "text-matches", pattern: /^- TODO/m },
        ],
      },
    },
  ],
};
