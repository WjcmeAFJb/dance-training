import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "06-align",
  folder: "10-edit-power",
  title: "Align deeply: & and <a-&>",
  blurb:
    "Beyond simple `=` columns. Align on regex matches, after a search-then-add, with copy-indent for whole blocks.",
  est_minutes: 6,
  requires: ["kak.normal.edit.align", "kak.normal.selections.split.regex"],
  teaches: ["kak.normal.edit.align", "kak.normal.edit.copyIndent"],
  initial: {
    text:
      "var parser = require('../src/grammar.js'),\n" +
      "    src = require('../src/blueberry.js'),\n" +
      "    fs = require('fs'),\n" +
      "    glob = require('glob');\n",
  },
  steps: [
    {
      narrate:
        "We want every `=` lined up. Select the buffer with {{key:dance.select.buffer}}, then narrow to `=` matches with {{key:dance.selections.select}} and the regex `=`.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Now press {{key:dance.edit.align}} ({{kakkey:&}}). Spaces are inserted **before** each selection until they all start in the same column.",
      goal: { kind: "command-fired", id: "dance.edit.align" },
    },
    {
      narrate:
        "Inspect the result: every `=` should sit at the same column — `parser`, `src`, `fs`, `glob` all aligned.",
      goal: { kind: "text-matches", pattern: /src {4}=/ },
    },
    {
      narrate:
        "Now the indent twin: {{key:dance.edit.copyIndentation}} ({{kakkey:<a-&>}}) **copies the main selection's indent** to all the others. Different problem, different solution.",
      reset: {
        text:
          "        const indented = compute();\n" +
          "console.log(indented);\n" +
          "return indented;\n",
      },
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Select the buffer ({{key:dance.select.buffer}}), split per-line ({{key:dance.selections.splitLines}}), then press {{key:dance.edit.copyIndentation}}. The main (first) selection's eight-space indent gets applied to lines 2 and 3.",
      goal: { kind: "command-fired", id: "dance.edit.copyIndentation" },
    },
    {
      narrate:
        "Two operators, two scopes. **`&`** aligns *cursor columns* (great for `=`, `:`, `=>`). **`<a-&>`** aligns *leading indents* (great after pasting). Both compose with whatever multi-cursor recipe got you the selections.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
