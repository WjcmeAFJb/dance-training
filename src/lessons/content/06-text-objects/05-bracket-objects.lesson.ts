import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "05-bracket-objects",
  folder: "06-text-objects",
  title: "Bracket and quote objects",
  blurb:
    "`(`, `[`, `{`, `<>`, `\"`, `'`, and backtick — the menu accepts any of them. Inner peels the wrapper.",
  est_minutes: 5,
  requires: ["kak.normal.seek.object.inner"],
  teaches: ["kak.normal.seek.object.inner", "kak.normal.seek.object.outer"],
  initial: {
    text: 'const items = ["alpha", "beta", "gamma"];\nconst pair = (left, right);\nconst tag = `template ${value}`;\n',
    selections: [{ anchor: { line: 0, col: 22 }, active: { line: 0, col: 23 } }],
  },
  steps: [
    {
      narrate:
        'Cursor is inside `"alpha"` on line 1. Open inner with {{key:dance.seek.askObject.inner}} and pick `"` — selection should be **alpha** (no quotes).',
      hint: "Quote classes accept the literal quote char as their picker.",
      goal: { kind: "text-matches", pattern: /^alpha$/m },
    },
    {
      narrate:
        'Now the whole variant: {{key:dance.seek.askObject}} `"`. Quotes are now part of the selection.',
      goal: { kind: "command-fired", id: "dance.seek.askObject" },
    },
    {
      narrate:
        "Move down a line into the parens. Then {{key:dance.seek.askObject.inner}} `(` — selection becomes `left, right`.",
      reset: {
        text: 'const items = ["alpha", "beta", "gamma"];\nconst pair = (left, right);\nconst tag = `template ${value}`;\n',
        selections: [{ anchor: { line: 1, col: 18 }, active: { line: 1, col: 19 } }],
      },
      goal: { kind: "text-matches", pattern: /left, right/ },
    },
    {
      narrate:
        "Bracket pickers also accept their close-bracket form. `(` and `)` both pick the parenthesis class — same with `{`/`}`, `[`/`]`, `<`/`>`.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Try the backtick: position into the template literal on line 3, then {{key:dance.seek.askObject.inner}} ` (backtick).",
      reset: {
        text: 'const items = ["alpha", "beta", "gamma"];\nconst pair = (left, right);\nconst tag = `template ${value}`;\n',
        selections: [{ anchor: { line: 2, col: 18 }, active: { line: 2, col: 19 } }],
      },
      hint: "Selection should land on `template ${value}` — backticks excluded.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
  ],
};
