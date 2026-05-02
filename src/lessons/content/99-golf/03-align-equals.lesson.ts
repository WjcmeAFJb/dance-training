import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 4d2c9d06eda6262e4e00007a
// in:  ragged-equals assignments
// out: aligned-equals assignments
// cmd: %s=<ret>&

export const lesson: Lesson = {
  id: "03-align-equals",
  folder: "99-golf",
  title: "Golf: align all the `=` signs",
  blurb:
    "The cleanest possible align demo — `%s=<ret>&`, four chords. Select buffer, narrow to `=`, align.",
  est_minutes: 4,
  requires: [
    "kak.normal.select.buffer",
    "kak.normal.selections.select.regex",
    "kak.normal.edit.align",
  ],
  teaches: ["kak.normal.edit.align"],
  initial: {
    text:
      "# Align these assignments\n" +
      "\n" +
      "x = 1\n" +
      "y = true\n" +
      "z = 'you'\n" +
      "foo = 'bar'\n" +
      'long_name = "long variable value"\n' +
      "$p3cial = ch4rs\n" +
      "last = line\n" +
      "\n" +
      "# Much better!\n",
  },
  steps: [
    {
      narrate:
        "The Kakoune solution is `%s=<ret>&` — four chords for a tabular align. **Select buffer → narrow to `=` → align.** Watch each chord land.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Press {{key:dance.select.buffer}} ({{kakkey:%}}) — selection covers everything from line 0 to the trailing newline.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "Now {{key:dance.selections.select}} ({{kakkey:s}}), type `=`, Enter. Out of the buffer-wide selection we keep only the `=` characters — seven cursors.",
      hint: "`s` is *select within selection by regex*. `S` would *split* — leaving the gaps between `=` signs. Capitalisation flips the role.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Finally {{key:dance.edit.align}} ({{kakkey:&}}). Spaces are inserted before each selection so all seven `=` end up in the same column.",
      goal: { kind: "command-fired", id: "dance.edit.align" },
    },
    {
      narrate:
        "Inspect the result — every `=` should sit at column 11 now. The longest variable name (`long_name`) sets the column.",
      goal: { kind: "text-matches", pattern: /long_name = / },
    },
    {
      narrate:
        "**Why so short?** Selection-first means the regex `=` *is* your multi-cursor. Vim needs `:Tabularize /=` (with a plugin); Kak needs only `s=&`.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
