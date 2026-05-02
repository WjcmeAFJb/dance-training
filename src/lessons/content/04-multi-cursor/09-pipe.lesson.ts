import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "09-pipe",
  folder: "04-multi-cursor",
  title: "Pipe selections: |",
  blurb:
    "Replace each selection with the output of a transformation. **Heads up:** Dance is not a shell — the prompt accepts a JS expression, not `sort` or `awk`.",
  est_minutes: 7,
  requires: ["kak.normal.selections.split.lines"],
  teaches: ["kak.normal.selections.pipe.replace"],
  discrepancies: ["disc.pipe.shell"],
  initial: {
    text: "alpha\nbeta\ngamma\ndelta\n",
  },
  steps: [
    {
      narrate:
        "In **Kakoune**, `|` runs each selection through a shell pipeline: `| sort` reorders alphabetically, `| awk '{print toupper($0)}'` upcases. The selection becomes the command's stdout.",
      goal: { kind: "any", goals: [{ kind: "mode-is", mode: "normal" }] },
    },
    {
      narrate:
        "In **Dance**, `|` (mapped to {{key:dance.selections.pipe.replace}}) opens a prompt that evaluates a JavaScript expression. The variable `$` is the selection text; `i` is its index.",
      hint: "Press the chip's key and look at the prompt — it says *Expression*, not *Shell*.",
      goal: { kind: "any", goals: [{ kind: "mode-is", mode: "normal" }] },
    },
    {
      narrate:
        "Try it: select the buffer with {{key:dance.select.buffer}}, split per-line with {{key:dance.selections.splitLines}}, then press {{key:dance.selections.pipe.replace}}. Type `$.toUpperCase()` and confirm.",
      goal: { kind: "command-fired", id: "dance.selections.pipe.replace" },
    },
    {
      narrate:
        "Each line should now be uppercase. Same idea as Kak's `| tr a-z A-Z`, but written as a JS one-liner.",
      goal: { kind: "text-matches", pattern: /^ALPHA$/m },
    },
    {
      narrate:
        "If you really want a shell, prefix the expression with `#` — Dance treats `#sort` as `child_process.execSync('sort', { input: $ })`. It works, but it's a different keystroke than Kakoune's bare `| sort`.",
      reset: "initial",
      goal: { kind: "any", goals: [{ kind: "mode-is", mode: "normal" }] },
    },
    {
      narrate:
        "Bottom line: `|` is the same key, different language. Read the discrepancy callout once — then forget it lives there.",
      goal: { kind: "command-fired", id: "dance.selections.pipe.replace" },
    },
  ],
};
