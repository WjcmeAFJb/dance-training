import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-default-register-clipboard",
  folder: "07-registers",
  title: "The default register is the OS clipboard",
  blurb:
    'Yank in Dance and the text lands on your system clipboard — paste anywhere. Kak keeps an internal `"` register; Dance routes through the OS.',
  est_minutes: 4,
  teaches: ["kak.normal.selections.yank", "kak.normal.edit.paste.after"],
  discrepancies: ["disc.register.default"],
  initial: {
    text: "Copy me to the clipboard.\nThen paste me below.\n",
  },
  steps: [
    {
      narrate:
        "Select the first line. The simplest way: {{key:dance.select.line.below}} — line-select, line-extend.",
      goal: { kind: "command-fired", id: "dance.select.line.below" },
    },
    {
      narrate:
        "Yank with {{key:dance.selections.saveText}}. In Dance this calls VS Code's clipboard API — try Cmd/Ctrl+V in another app and the line will paste.",
      hint: "Default key: {{kakkey:y}}.",
      goal: { kind: "command-fired", id: "dance.selections.saveText" },
    },
    {
      narrate: "Move down a line: {{key:dance.select.down.jump}}.",
      goal: { kind: "command-fired", id: "dance.select.down.jump" },
    },
    {
      narrate:
        "Now paste with {{key:dance.edit.paste.after}}. The yanked line should appear after the cursor.",
      hint: "Default: {{kakkey:p}}. Dance reads from the OS clipboard, so anything you copied **outside** VS Code pastes too.",
      goal: { kind: "text-matches", pattern: /Copy me[\s\S]*Copy me/ },
    },
    {
      narrate:
        "This is the big shift from Kak: yank is bidirectional with the system clipboard. If you want isolation, name a register (next lesson).",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
