import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-replay-on-counts",
  folder: "08-macros",
  title: "Replay with a count: 5Q",
  blurb: "Prefix the play key with a digit to replay N times. Same idea as Vim's `5@q`.",
  est_minutes: 4,
  requires: ["kak.normal.macro.play"],
  teaches: ["kak.normal.macro.play"],
  initial: {
    text: "line one\nline two\nline three\nline four\nline five\nline six\n",
  },
  steps: [
    {
      narrate: "Start recording: {{key:dance.history.recording.start}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.start" },
    },
    {
      narrate:
        "Record a single-line transformation: select the line ({{key:dance.select.line.below}}), uppercase it ({{key:dance.edit.case.toUpper}}), move down ({{key:dance.select.down.jump}}). Then stop with {{key:dance.history.recording.stop}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.stop" },
    },
    {
      narrate:
        "Now press `5` then {{key:dance.history.recording.play}}. The count prefix tells Dance to replay 5 times — the next 5 lines get uppercased.",
      hint: "Number keys feed `dance.updateCount` until you press an action. Try `3Q`, `10Q` — same shape.",
      goal: {
        kind: "all",
        goals: [
          { kind: "command-fired", id: "dance.history.recording.play" },
          { kind: "text-matches", pattern: /LINE TWO/ },
          { kind: "text-matches", pattern: /LINE FIVE/ },
        ],
      },
    },
    {
      narrate:
        "Counts also stack with most other Dance commands: `5j`, `3w`, `10x`. The macro count is no different.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
