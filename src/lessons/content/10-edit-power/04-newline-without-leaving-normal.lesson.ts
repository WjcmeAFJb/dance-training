import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-newline-without-leaving-normal",
  folder: "10-edit-power",
  title: "Open lines silently: <a-o> and <a-O>",
  blurb:
    "Insert a blank line above or below — without dropping into Insert mode. Lowercase = below, uppercase = above; Alt = stay in Normal.",
  est_minutes: 4,
  teaches: ["kak.normal.edit.newLine.below", "kak.normal.edit.newLine.above"],
  initial: {
    text: "alpha\nbeta\ngamma\n",
    selections: [{ anchor: { line: 1, col: 0 }, active: { line: 1, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Cursor is on **beta**. Plain {{kakkey:o}} opens a line below **and** drops you into Insert. Press {{key:dance.edit.newLine.below}} ({{kakkey:<a-o>}}) instead — line opens, but you stay in Normal.",
      goal: {
        kind: "all",
        goals: [
          { kind: "text-matches", pattern: /alpha\nbeta\n\ngamma/ },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "And the upward variant: {{key:dance.edit.newLine.above}} ({{kakkey:<a-O>}}) inserts a blank line **above** the cursor, no Insert mode.",
      reset: {
        text: "alpha\nbeta\ngamma\n",
        selections: [{ anchor: { line: 1, col: 0 }, active: { line: 1, col: 1 } }],
      },
      goal: {
        kind: "all",
        goals: [
          { kind: "text-matches", pattern: /alpha\n\nbeta/ },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Why bother staying in Normal? Because you can chain. Press {{key:dance.edit.newLine.below}} three times to add three blank lines under `beta` in one breath.",
      reset: {
        text: "alpha\nbeta\ngamma\n",
        selections: [{ anchor: { line: 1, col: 0 }, active: { line: 1, col: 1 } }],
      },
      goal: { kind: "command-fired", id: "dance.edit.newLine.below", count: 3 },
    },
    {
      narrate:
        "The Alt versions also play well with multi-cursor: split a buffer per-line, hit {{key:dance.edit.newLine.below}} once, get a double-spaced output. The Insert variants would interrupt with a prompt instead.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
