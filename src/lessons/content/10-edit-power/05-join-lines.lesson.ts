import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "05-join-lines",
  folder: "10-edit-power",
  title: "Join lines: <a-j> and <a-J>",
  blurb:
    "Glue lines together with a single space. The `J` variant selects the inserted spaces — perfect for follow-up edits.",
  est_minutes: 4,
  teaches: ["kak.normal.edit.join", "kak.normal.edit.join.select"],
  initial: {
    text:
      "enum PlaybackRequestType {\n" +
      "    case Next\n" +
      "    case Previous\n" +
      "    case Play\n" +
      "    case Stop\n" +
      "}\n",
    selections: [{ anchor: { line: 1, col: 0 }, active: { line: 4, col: 14 } }],
  },
  steps: [
    {
      narrate:
        "Selection covers the four `case` lines. Press {{key:dance.edit.join}} ({{kakkey:<a-j>}}). Every newline inside the selection collapses to a single space.",
      goal: { kind: "text-matches", pattern: /case Next case Previous case Play case Stop/ },
    },
    {
      narrate:
        "Now the same join, but with the inserted spaces selected: {{key:dance.edit.join.select}} ({{kakkey:<a-J>}}). With those spaces selected you can swap them for commas in one keystroke.",
      reset: {
        text:
          "enum PlaybackRequestType {\n" +
          "    case Next\n" +
          "    case Previous\n" +
          "    case Play\n" +
          "    case Stop\n" +
          "}\n",
        selections: [{ anchor: { line: 1, col: 0 }, active: { line: 4, col: 14 } }],
      },
      goal: { kind: "command-fired", id: "dance.edit.join.select" },
    },
    {
      narrate:
        "With the spaces selected, press {{key:dance.edit.replaceCharacters}} (`r`) and type `,`. Three cursors, one keystroke — comma-separated list.",
      hint: "If your replace doesn't follow `<a-J>`, the spaces may have been deselected by an intervening command.",
      goal: { kind: "text-matches", pattern: /case Next, ?case Previous/ },
    },
    {
      narrate:
        "**Joining trims leading whitespace** on the second line, so indented lists collapse cleanly. Common workflow: `<a-J>` then `r,` (or `r;`, or whatever separator).",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Mnemonic: `<a-j>` is *just join*, `<a-J>` is *join, with the seams selected*. Capitalisation = `+ select`.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
