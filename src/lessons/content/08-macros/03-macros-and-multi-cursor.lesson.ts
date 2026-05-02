import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-macros-and-multi-cursor",
  folder: "08-macros",
  title: "Macros on multi-cursor selections",
  blurb:
    "Recording happens once, on the main cursor. Replay runs the recorded steps **per** cursor — so you can record a fix once and apply it to every selection.",
  est_minutes: 5,
  requires: ["kak.normal.macro.play"],
  teaches: [],
  initial: {
    text: "name = alice\nname = bob\nname = carol\nname = dan\n",
  },
  steps: [
    {
      narrate:
        "Make a cursor on every line: select the first ({{key:dance.select.line.below}}) then split-lines on the buffer. First {{key:dance.select.buffer}} to grab everything, then {{key:dance.selections.splitLines}}.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Now reduce each selection to its cursor: {{key:dance.selections.reduce}}. You should have four blinking carets, one per line.",
      goal: { kind: "command-fired", id: "dance.selections.reduce" },
    },
    {
      narrate:
        "Start recording: {{key:dance.history.recording.start}}. Important: while recording with multiple cursors, the recorder watches the **main** cursor only.",
      goal: { kind: "command-fired", id: "dance.history.recording.start" },
    },
    {
      narrate:
        "Record a tiny edit: enter insert mode ({{key:dance.modes.insert.lineEnd}}), append a `;`, escape, then stop with {{key:dance.history.recording.stop}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.stop" },
    },
    {
      narrate:
        "Replay with {{key:dance.history.recording.play}}. The recorded edit runs **once per cursor** — every line gets a `;` appended.",
      hint: "This is one of Kak's signature moves: multi-cursor + macro = batch transformation, no scripting required.",
      goal: { kind: "text-matches", pattern: /alice;[\s\S]*bob;[\s\S]*carol;[\s\S]*dan;/ },
    },
  ],
};
