import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-tab-spaces",
  folder: "10-edit-power",
  title: "Tabs ↔ spaces: @ (Kak only)",
  blurb:
    "Kakoune's `@` walks every selection and rewrites tabs to/from spaces using the current `tabstop`. Dance has no equivalent — use VS Code's command instead.",
  est_minutes: 3,
  teaches: ["kak.normal.edit.tabExpand"],
  discrepancies: ["disc.tabstop.@"],
  initial: {
    text: "\tfirst\tword\n\tsecond\tword\n  third  word\n",
  },
  steps: [
    {
      narrate:
        "In Kakoune, select the buffer with {{key:dance.select.buffer}} and press {{kakkey:@}}. Each tab becomes the equivalent run of spaces (or vice-versa, depending on `expandtab`). It's two keystrokes.",
      hint: "If `expandtab` is on, tabs become spaces; if off, runs of spaces collapse to a tab. Configurable, deterministic.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "**Dance has nothing for this.** The chip will be empty — there is no `dance.edit.tabExpand`. Open the chip's discrepancy badge to see the workaround.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "VS Code ships **`Convert Indentation to Spaces`** and **`Convert Indentation to Tabs`** in the command palette. They work buffer-wide and respect `editor.tabSize`. Bind them to `@` if you want the muscle memory.",
      hint: 'Add a keybinding in your `keybindings.json`: `{ "key": "@", "command": "editor.action.indentationToSpaces", "when": "dance.mode == \'normal\'" }`.',
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "If you need *selection-scoped* tab expansion (Kak's actual semantics), wrap a small JS helper into `dance.run` — `$.replace(/\\t/g, ' '.repeat(tabSize))` is enough for most uses.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
