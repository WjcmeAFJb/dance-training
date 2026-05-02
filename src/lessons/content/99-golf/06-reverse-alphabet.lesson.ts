import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 4d1aaf2fb11838287d000036
// in:  abcdefghijklmnopqrstuvwxyz
// out: zyxwvutsrqponmlkjihgfedcba
// cmd: <a-l>QHdpQ24q

export const lesson: Lesson = {
  id: "06-reverse-alphabet",
  folder: "99-golf",
  title: "Golf: reverse a string with a 24-replay macro",
  blurb:
    "Take `abc…xyz` and produce `zyx…cba`. The Kak solution records a one-step macro and replays it 24 times — a beautiful tiny exercise in `Q`/`q`.",
  est_minutes: 7,
  requires: [
    "kak.normal.macro.start",
    "kak.normal.macro.play",
    "kak.normal.edit.yank.delete",
    "kak.normal.edit.paste.before",
  ],
  teaches: ["kak.normal.macro.start", "kak.normal.macro.play"],
  discrepancies: ["disc.macro.q"],
  initial: {
    text: "abcdefghijklmnopqrstuvwxyz",
    selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Goal: `zyxwvutsrqponmlkjihgfedcba`. Kak solution: `<a-l>QHdpQ24q`. Strategy: select the line, start a macro, do *one* swap (cut a char, paste it before the previous char), then replay 24 times.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Move to line end with {{key:dance.select.lineEnd}} ({{kakkey:<a-l>}}). Cursor sits on `z`.",
      goal: { kind: "command-fired", id: "dance.select.lineEnd" },
    },
    {
      narrate:
        "Start recording with {{key:dance.history.recording.start}} ({{kakkey:Q}} in Kakoune, {{kakkey:q}} in Dance — see the discrepancy badge). The status bar should show `recording`.",
      hint: "If the chip shows `q`, that's the start key in Dance. If you see `Q`, your bindings follow the Kak convention. Same effect either way.",
      goal: { kind: "command-fired", id: "dance.history.recording.start" },
    },
    {
      narrate:
        "Inside the macro: {{key:dance.select.left.extend}} ({{kakkey:H}}) to grab the previous char, then {{key:dance.edit.yank-delete}} ({{kakkey:d}}) to cut it, then {{key:dance.edit.paste.before}} ({{kakkey:P}}) to paste before. Net effect: the cursor's char and its left neighbour swap.",
      goal: {
        kind: "all",
        goals: [
          { kind: "command-fired", id: "dance.select.left.extend" },
          { kind: "command-fired", id: "dance.edit.yank-delete" },
        ],
      },
    },
    {
      narrate:
        "Stop recording with {{key:dance.history.recording.stop}}. Macro is now stored. Replay it 24 times with a count: type `24` then {{key:dance.history.recording.play}} ({{kakkey:q}} in Kak, big `Q` in Dance).",
      hint: "Don't have a count keybind? Press the play key 24 times by hand — the macro reverses two letters each press.",
      goal: { kind: "command-fired", id: "dance.history.recording.play" },
    },
    {
      narrate:
        "Each replay swaps the next pair, walking right-to-left across the alphabet. After 24 plays the whole word is reversed.",
      goal: { kind: "text-equals", expected: "zyxwvutsrqponmlkjihgfedcba" },
    },
    {
      narrate:
        "**The lesson:** small macros + counts beat clever one-liners. The whole solution is 12 chords, more than half of which is the count `24`.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
