import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "07-align",
  folder: "04-multi-cursor",
  title: "Align selections: &",
  blurb:
    "Insert spaces before each selection until all start in the same column. Tabular data in two keystrokes.",
  est_minutes: 5,
  requires: ["kak.normal.selections.select.regex"],
  teaches: ["kak.normal.edit.align"],
  initial: {
    text: "id = 1\nname = 'alice'\nemail = 'a@example.com'\nage = 42\n",
  },
  steps: [
    {
      narrate:
        "We want every `=` lined up. First, select the buffer with {{key:dance.select.buffer}}, then press {{key:dance.selections.select}} and enter the regex `=`. Four cursors, one per `=` sign.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Now press {{key:dance.edit.align}}. Dance pads each selection with spaces until all start in the same column.",
      hint: "Kak's `&` is the same key. The chip will show your binding if you've remapped it.",
      goal: { kind: "command-fired", id: "dance.edit.align" },
    },
    {
      narrate:
        "Check your buffer — every `=` should now sit in the same column. The four lines align like a config file.",
      goal: { kind: "text-matches", pattern: /name +=/ },
    },
    {
      narrate:
        "Tip: the regex doesn't have to be the equals sign. Any landmark works — `:`, `// `, function-arrow `=>`, your call.",
      goal: { kind: "command-fired", id: "dance.edit.align" },
    },
  ],
};
