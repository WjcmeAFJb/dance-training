import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-macro-on-named-register",
  folder: "08-macros",
  title: "Macros stored in named registers",
  blurb: 'Like Vim: prefix the record (or play) with `"<r>` to keep multiple macros alive at once.',
  est_minutes: 4,
  requires: ["kak.normal.macro.play", "kak.normal.register.select"],
  teaches: [],
  initial: {
    text: "alpha\nbeta\ngamma\ndelta\nepsilon\nzeta\n",
  },
  steps: [
    {
      narrate:
        "Stash an **uppercase** macro in register `u`. Press {{key:dance.selectRegister}} `u`, then start recording: {{key:dance.history.recording.start}}.",
      hint: "The register prefix routes the next macro command — record or play — to that name.",
      goal: { kind: "command-fired", id: "dance.history.recording.start" },
    },
    {
      narrate:
        "Record: select the line ({{key:dance.select.line.below}}), uppercase ({{key:dance.edit.case.toUpper}}), move down ({{key:dance.select.down.jump}}). Stop with {{key:dance.history.recording.stop}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.stop" },
    },
    {
      narrate:
        "Now record a **lowercase** macro into register `l`. Same rhythm: {{key:dance.selectRegister}} `l`, {{key:dance.history.recording.start}}, then your edit.",
      goal: { kind: "command-fired", id: "dance.history.recording.start", count: 2 },
    },
    {
      narrate:
        "Inside the recording: {{key:dance.select.line.below}}, {{key:dance.edit.case.toLower}}, {{key:dance.select.down.jump}}. Then {{key:dance.history.recording.stop}}.",
      goal: { kind: "command-fired", id: "dance.history.recording.stop", count: 2 },
    },
    {
      narrate:
        "Replay register `u`: {{key:dance.selectRegister}} `u` then {{key:dance.history.recording.play}}. Replay `l` the same way. Two distinct macros, alive side-by-side.",
      hint: "This is the trick to keep an `uppercase`, a `lowercase`, a `wrap-in-quotes`, and a `delete-trailing-space` macro all on different letters.",
      goal: { kind: "command-fired", id: "dance.history.recording.play" },
    },
    {
      narrate:
        'Pattern: `"<r>` is the universal namespace operator. It works on yank, paste, save-selections, **and** macros — same prefix, different verbs.',
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
