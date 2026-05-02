import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-record-and-play",
  folder: "08-macros",
  title: "Record and replay: q / Q",
  blurb:
    "Hit `q` to start recording, `q` again to stop. `Q` plays it back. In Dance the start/stop are separate commands.",
  est_minutes: 5,
  teaches: ["kak.normal.macro.start", "kak.normal.macro.stop", "kak.normal.macro.play"],
  discrepancies: ["disc.macro.q"],
  initial: {
    text: "todo: write tests\ntodo: refactor api\ntodo: update docs\ntodo: ship it\n",
  },
  steps: [
    {
      narrate: "Press {{key:dance.history.recording.start}} to begin recording.",
      hint: "Kak toggles record/stop on a single key ({{kakkey:q}}). Dance has two commands: {{action:kak.normal.macro.start}} and {{action:kak.normal.macro.stop}} — most users bind both to `q`.",
      goal: { kind: "command-fired", id: "dance.history.recording.start" },
    },
    {
      narrate:
        "Now do a small edit: select the first line ({{key:dance.select.line.below}}), uppercase it ({{key:dance.edit.case.toUpper}}), move to the next ({{key:dance.select.down.jump}}).",
      goal: { kind: "text-matches", pattern: /TODO: WRITE TESTS/ },
    },
    {
      narrate:
        "Stop recording: {{key:dance.history.recording.stop}}. The macro is now stored in the default register.",
      goal: { kind: "command-fired", id: "dance.history.recording.stop" },
    },
    {
      narrate:
        "Replay it on the next line with {{key:dance.history.recording.play}}. Watch the line uppercase itself.",
      hint: "Default key: {{kakkey:Q}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.play" },
    },
    {
      narrate:
        "That's the loop: record once, replay forever. Coming up: replay with a count, on multiple cursors, and to named registers.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
