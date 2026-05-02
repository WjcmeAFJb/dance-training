import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-forward-search",
  folder: "05-search-replace",
  title: "Forward search: /",
  blurb:
    "Type `/`, type a regex, hit Enter — your selection moves to the next match. Dance evaluates the input as a JavaScript regex.",
  est_minutes: 5,
  teaches: ["kak.normal.search.forward"],
  discrepancies: ["disc.search.case"],
  initial: {
    text: "the quick Brown fox\njumps over the lazy DOG\nthe end\n",
  },
  steps: [
    {
      narrate:
        "Press {{key:dance.search}} to open the search prompt. The status bar shows a `/` and waits for input.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
    {
      narrate: "Type `the` and press Enter. Selection lands on the first lowercase `the`.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
    {
      narrate:
        "Now try a case test. Press {{key:dance.search}}, type `brown`, Enter. **Heads up:** Dance's `/` is **not smart-case** by default — `brown` won't match `Brown`.",
      hint: "Add an `i` flag inline: `(?i)brown`, or use {{key:dance.search.selection.smart}} (covered in lesson 4) to get smart-case from the current selection.",
      goal: { kind: "command-fired", id: "dance.search", count: 2 },
    },
    {
      narrate:
        "Re-do that search, but with `(?i)brown` — JavaScript regex inline-flag syntax. Now it matches `Brown`.",
      goal: { kind: "command-fired", id: "dance.search", count: 3 },
    },
    {
      narrate:
        "Regex power is the rest of the search system. Try `\\bthe\\b` to find `the` as a whole word, or `[A-Z]\\w+` to find capitalised words. The engine is full V8 — backreferences, lookarounds, the works.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
  ],
};
