import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "06-rotate-selections",
  folder: "04-multi-cursor",
  title: "Rotate cursors and contents: ( ) <a-(> <a-)>",
  blurb:
    "Two pairs of rotations. `(` `)` walk the *main* through the cursor list. `<a-(>` `<a-)>` shuffle the **text** between them.",
  est_minutes: 6,
  requires: ["kak.normal.selections.split.lines"],
  teaches: [
    "kak.normal.selections.rotate",
    "kak.normal.selections.rotate.reverse",
    "kak.normal.selections.rotate.contents",
    "kak.normal.selections.rotate.contents.reverse",
  ],
  initial: {
    text: "apple\nbanana\ncherry\ndate\n",
  },
  steps: [
    {
      narrate:
        "Select the buffer with {{key:dance.select.buffer}}, split per line with {{key:dance.selections.splitLines}}. Four selections.",
      goal: { kind: "command-fired", id: "dance.selections.splitLines" },
    },
    {
      narrate:
        "Press {{key:dance.selections.rotate.selections}} (Kak's `)`). The **main** moves to the next selection — same cursors, different leader.",
      hint: "Why care which is main? Because commands like `<a-,>` (clear main) and `,` (keep main) act on it.",
      goal: { kind: "command-fired", id: "dance.selections.rotate.selections" },
    },
    {
      narrate:
        "Press {{key:dance.selections.rotate.selections.reverse}} (Kak's `(`) to walk it backwards. Cursors stay put; the spotlight shifts.",
      goal: { kind: "command-fired", id: "dance.selections.rotate.selections.reverse" },
    },
    {
      narrate:
        "Now the spicy variant. Press {{key:dance.selections.rotate.contents}} (Kak's `<a-)>`). The **text** under each cursor rotates: `apple` becomes `date`, `banana` becomes `apple`, and so on.",
      reset: "initial",
      hint: "First select-buffer, then split-lines, then rotate contents.",
      goal: { kind: "command-fired", id: "dance.selections.rotate.contents" },
    },
    {
      narrate:
        "And the reverse: {{key:dance.selections.rotate.contents.reverse}} sends each text the other way. Three keystrokes to swap any N items in any order.",
      goal: { kind: "command-fired", id: "dance.selections.rotate.contents.reverse" },
    },
  ],
};
