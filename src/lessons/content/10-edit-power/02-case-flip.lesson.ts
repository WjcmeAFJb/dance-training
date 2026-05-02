import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-case-flip",
  folder: "10-edit-power",
  title: "Case flip: `, ~, <a-`>",
  blurb:
    "Three case operators with one keystroke each. Lowercase, uppercase, swap. Each operates on the whole selection.",
  est_minutes: 4,
  teaches: [
    "kak.normal.edit.case.lower",
    "kak.normal.edit.case.upper",
    "kak.normal.edit.case.swap",
  ],
  initial: {
    text: "tHE CakE iS A lIE\n",
    selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 17 } }],
  },
  steps: [
    {
      narrate:
        "Selection is the whole line. Press {{key:dance.edit.case.toLower}} to drop everything to **lowercase**. Default key: {{kakkey:`}} (backtick).",
      goal: { kind: "text-equals", expected: "the cake is a lie\n" },
    },
    {
      narrate:
        "Now press {{key:dance.edit.case.toUpper}} ({{kakkey:~}}) to **uppercase** the same selection.",
      goal: { kind: "text-equals", expected: "THE CAKE IS A LIE\n" },
    },
    {
      narrate:
        "And the swap: {{key:dance.edit.case.swap}} ({{kakkey:<a-`>}}, Alt+backtick). Each character flips its case — uppers become lowers, lowers become uppers.",
      goal: { kind: "text-equals", expected: "the cake is a lie\n" },
    },
    {
      narrate:
        "These compose with multi-cursor naturally. Split the buffer per-line, select just the first character of each, smash {{key:dance.edit.case.toUpper}} — instant title-case.",
      reset: {
        text: "the cake is a lie\nlife is suffering\nturtles all the way\n",
      },
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Mnemonic: backtick is *down* the keyboard from `~`, so `` ` `` is *down* (lowercase). `~` is *up* (uppercase). Alt+`` ` `` is the *swap* of the two.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
