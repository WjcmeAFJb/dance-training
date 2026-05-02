import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-insert-register-c-r",
  folder: "07-registers",
  title: "<c-r> in insert mode: pull a register",
  blurb:
    "While typing, `<c-r>` followed by a register name dumps that register's contents at the cursor. Vim's classic move, ported to Kak.",
  est_minutes: 3,
  requires: ["kak.normal.register.select"],
  teaches: [],
  initial: {
    text: "Header: \nFooter\n",
    selections: [{ anchor: { line: 0, col: 8 }, active: { line: 0, col: 9 } }],
  },
  steps: [
    {
      narrate:
        "First, get something into a register. Select line 1: {{key:dance.select.line.below}}, then yank to `a`: {{key:dance.selectRegister}} `a` {{key:dance.selections.saveText}}.",
      goal: {
        kind: "any",
        goals: [
          { kind: "register", name: "a", equals: "Header: \n" },
          { kind: "command-fired", id: "dance.selections.saveText" },
        ],
      },
    },
    {
      narrate:
        "Move to the end of `Header: ` and enter insert mode: {{key:dance.modes.insert.lineEnd}}.",
      goal: { kind: "mode-is", mode: "insert" },
    },
    {
      narrate:
        "Now press {{kakkey:<c-r>}} (Ctrl+R), then `a` — register `a` is dumped at the cursor. Watch the line stutter as it pastes itself.",
      hint: "Vim users: same chord. Dance routes this through VS Code's keybinding layer.",
      goal: { kind: "text-matches", pattern: /Header: Header:/ },
    },
    {
      narrate:
        'Tip: `<c-r>` works for *any* register including the default. Insert-mode pasting from the system clipboard is `<c-r>` then `"`.',
      goal: { kind: "mode-is", mode: "insert" },
    },
  ],
};
