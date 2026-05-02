import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-indent-deindent",
  folder: "10-edit-power",
  title: "Indent / deindent: > and <",
  blurb:
    "Push lines right or pull them left. Capital-Alt variants extend to empty lines and incomplete indents.",
  est_minutes: 5,
  teaches: [
    "kak.normal.edit.indent",
    "kak.normal.edit.deindent.full",
    "kak.normal.edit.indent.full",
    "kak.normal.edit.deindent",
  ],
  initial: {
    text: "function plot() {\nreturn data\n  .filter(x => x.ok)\n  .map(x => x.value);\n}\n",
    selections: [{ anchor: { line: 1, col: 0 }, active: { line: 1, col: 11 } }],
  },
  steps: [
    {
      narrate:
        "Line 2 (`return data`) needs an indent. With it selected, press {{key:dance.edit.indent}} to push it right by one tab-stop.",
      hint: "Default key: {{kakkey:>}}. Selection is preserved so you can repeat.",
      goal: { kind: "text-matches", pattern: /^ {2}return data/m },
    },
    {
      narrate:
        "Now extend the selection to all four body lines (use {{key:dance.select.line.below.extend}}) and press {{key:dance.edit.indent}} again.",
      hint: "Each press adds one tab-stop. Hold a count prefix to indent multiple steps in one shot.",
      goal: { kind: "command-fired", id: "dance.edit.indent", count: 2 },
    },
    {
      narrate:
        "Reverse it: press {{key:dance.edit.deindent.withIncomplete}} ({{kakkey:<}} by default). Lines move left one tab-stop. **Note:** the bare `<` form drops *incomplete* indents (a single space gets eaten), useful for cleaning up after a paste.",
      reset: {
        text: "    function plot() {\n      return data\n        .filter(x => x.ok)\n        .map(x => x.value);\n    }\n",
        selections: [{ anchor: { line: 0, col: 0 }, active: { line: 4, col: 5 } }],
      },
      goal: { kind: "command-fired", id: "dance.edit.deindent.withIncomplete" },
    },
    {
      narrate:
        "The Alt variants extend to *empty* lines. Press {{key:dance.edit.indent.withEmpty}} ({{kakkey:<a->>}}) — even blank lines inside the selection get indented.",
      reset: {
        text: "alpha\n\nbeta\n\ngamma\n",
        selections: [{ anchor: { line: 0, col: 0 }, active: { line: 4, col: 5 } }],
      },
      hint: "The mirror, {{key:dance.edit.deindent}} ({{kakkey:<a-<>}}), preserves incomplete indents instead of dropping them.",
      goal: { kind: "command-fired", id: "dance.edit.indent.withEmpty" },
    },
    {
      narrate:
        "Four shapes, two axes: **bare vs Alt** (touch empty lines or not), **`>` vs `<`** (right or left). Pick the bare forms for code, the Alt forms for prose blocks.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
