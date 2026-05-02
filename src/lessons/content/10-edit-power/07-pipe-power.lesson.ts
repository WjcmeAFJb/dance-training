import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "07-pipe-power",
  folder: "10-edit-power",
  title: "Pipe transformations: |",
  blurb:
    "Replace each selection with the result of a function. JS expression in Dance, shell command in Kakoune. Same key, different language.",
  est_minutes: 7,
  requires: ["kak.normal.selections.pipe.replace"],
  teaches: ["kak.normal.selections.pipe.replace"],
  discrepancies: ["disc.pipe.shell"],
  initial: {
    text: '{"name":"alice","age":30,"city":"Krakow","tags":["a","b"]}\n',
    selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 56 } }],
  },
  steps: [
    {
      narrate:
        "Selection is the whole minified JSON. Press {{key:dance.selections.pipe.replace}} ({{kakkey:|}}) to open the pipe prompt.",
      goal: { kind: "command-fired", id: "dance.selections.pipe.replace" },
    },
    {
      narrate:
        "Type `JSON.stringify(JSON.parse($), null, 2)` and Enter. Dance evaluates the expression with `$` bound to the selection text — the JSON pretty-prints in place.",
      hint: "If you get a syntax error, double-check the parens. JS doesn't forgive missing closers.",
      goal: { kind: "text-matches", pattern: /"name": "alice"/ },
    },
    {
      narrate:
        "In real Kakoune, you would have written `| python -m json.tool` or `| jq .` instead — same ergonomics, different runtime. **The chip's discrepancy badge** spells out the swap.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        'Try a different transform. Reset, then pipe with `$.split(",").sort().join(",")` to alphabetise a CSV.',
      reset: {
        text: "delta,beta,alpha,gamma\n",
        selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 23 } }],
      },
      goal: { kind: "command-fired", id: "dance.selections.pipe.replace" },
    },
    {
      narrate:
        "If you really need a shell, prefix with `#`. Dance treats `#sort` as `child_process.execSync('sort', { input: $ })`. It works — just one extra character.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Two cousins worth knowing: {{key:dance.selections.pipe}} ({{kakkey:!}}) **inserts** the output before the selection (selection survives); {{key:dance.selections.pipe.append}} ({{kakkey:<a-!>}}) **appends** it after.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
