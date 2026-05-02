import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 4d1ccfde35b40650b80004ae
// in:  tHE CakE iS A lIE
// out: The Cake is a Lie
// cmd: x`se<ret>b;~

export const lesson: Lesson = {
  id: "04-title-case",
  folder: "99-golf",
  title: "Golf: rebuild title-case from chaos",
  blurb:
    "`tHE CakE iS A lIE` → `The Cake is a Lie`. Six chords. Select line, downcase, narrow to words, reduce to first char, upcase.",
  est_minutes: 5,
  requires: [
    "kak.normal.select.line.below",
    "kak.normal.edit.case.lower",
    "kak.normal.edit.case.upper",
    "kak.normal.selections.reduce",
    "kak.normal.selections.select.regex",
  ],
  teaches: ["kak.normal.edit.case.lower", "kak.normal.edit.case.upper"],
  initial: {
    text: "tHE CakE iS A lIE\n",
  },
  steps: [
    {
      narrate:
        "Target is title-case-with-articles-lower (`The Cake is a Lie`). Kak solution: `x\\`se<ret>b;~` — six chords. Strategy: lowercase everything, then uppercase the first letter of *each word*.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Select the whole line with {{key:dance.select.line.below}} ({{kakkey:x}}), then drop to lowercase with {{key:dance.edit.case.toLower}} ({{kakkey:`}}).",
      goal: { kind: "text-matches", pattern: /the cake is a lie/ },
    },
    {
      narrate:
        "Now narrow to *words* with {{key:dance.selections.select}} ({{kakkey:s}}) and the regex `\\w+`. (The original solution uses `e` to mean word-end via `s` then `e` — pick whichever feels natural.) Five word-selections now.",
      hint: "Don't have your buffer selected anymore? Press {{key:dance.select.line.below}} again first.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Reduce each selection to its first character with {{key:dance.selections.reduce}} ({{kakkey:;}}). Five caret-cursors, one per word, all sitting on the first letter.",
      hint: "Default key is `;`. The Kak solution uses `b;` (word-back, then reduce); Dance's `s\\w+` plus `;` lands in the same place.",
      goal: { kind: "command-fired", id: "dance.selections.reduce" },
    },
    {
      narrate:
        "Press {{key:dance.edit.case.toUpper}} ({{kakkey:~}}). Each first-letter becomes uppercase. Title-case in five operations.",
      goal: { kind: "text-matches", pattern: /The Cake Is A Lie/ },
    },
    {
      narrate:
        "**Bonus catch:** the spec wants `is` and `a` lowercase (English title-case rules). The original solution accepts that *all* word-initials become caps — Vim Golf has no nuance for stop-words. Real refactors would use a regex like `s\\b(?!is\\b|a\\b)\\w` instead.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
