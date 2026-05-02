import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-named-registers",
  folder: "07-registers",
  title: 'Named registers: "<r> prefix',
  blurb:
    'Press `"`, then a letter, then a yank — text lands in that register, not the clipboard. Like Vim\'s `"a y`.',
  est_minutes: 4,
  requires: ["kak.normal.selections.yank"],
  teaches: ["kak.normal.register.select"],
  initial: {
    text: "First chunk: alpha bravo.\nSecond chunk: charlie delta.\n",
  },
  steps: [
    {
      narrate: "Select the first line: {{key:dance.select.line.below}}.",
      goal: { kind: "command-fired", id: "dance.select.line.below" },
    },
    {
      narrate:
        "Press {{key:dance.selectRegister}} — this opens a one-shot prompt asking for the register name.",
      hint: 'Default key: {{kakkey:"}}. The next keystroke names the register, *not* the action.',
      goal: { kind: "command-fired", id: "dance.selectRegister" },
    },
    {
      narrate:
        "Type `a` to choose register `a`. Then yank with {{key:dance.selections.saveText}} — the line goes into register `a`, not the clipboard.",
      goal: {
        kind: "any",
        goals: [
          { kind: "register", name: "a", equals: "First chunk: alpha bravo.\n" },
          { kind: "command-fired", id: "dance.selections.saveText" },
        ],
      },
    },
    {
      narrate:
        "Move to the next line and select it: {{key:dance.select.down.jump}} then {{key:dance.select.line.below}}.",
      goal: { kind: "command-fired", id: "dance.select.line.below", count: 2 },
    },
    {
      narrate:
        "Now yank again — but this time without the prefix. It goes to the default register (clipboard), leaving register `a` untouched.",
      hint: "Use named registers to keep multiple chunks alive at the same time, like in Vim.",
      goal: { kind: "command-fired", id: "dance.selections.saveText" },
    },
  ],
};
