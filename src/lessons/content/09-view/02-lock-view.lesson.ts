import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-lock-view",
  folder: "09-view",
  title: "Lock the view: V",
  blurb:
    "Capital `V` keeps the view menu open between presses. Centre, scroll, recentre — without retyping the prefix.",
  est_minutes: 3,
  requires: ["kak.normal.view.line"],
  teaches: ["kak.normal.view.lock"],
  initial: {
    text:
      "// 0\n" +
      "// 1\n" +
      "// 2\n" +
      "// 3\n" +
      "// 4\n" +
      "// 5\n" +
      "// 6\n" +
      "// 7\n" +
      "// 8\n" +
      "// 9\n" +
      "// 10\n" +
      "// 11\n" +
      "// 12\n" +
      "// 13\n" +
      "// 14\n" +
      "// 15 cursor here\n" +
      "// 16\n" +
      "// 17\n" +
      "// 18\n" +
      "// 19\n" +
      "// 20\n" +
      "// 21\n" +
      "// 22\n" +
      "// 23\n" +
      "// 24\n" +
      "// 25\n" +
      "// 26\n" +
      "// 27\n" +
      "// 28\n" +
      "// 29\n",
    selections: [{ anchor: { line: 15, col: 0 }, active: { line: 15, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Lowercase {{key:dance.view.line}} closes the menu after one letter. Capital {{kakkey:V}} (Kakoune's lock) keeps it open. **Heads up:** Dance ships only one view command — `V` isn't bound out of the box.",
      hint: "If you've not bound `V` to anything, this lesson is conceptual. Real Kakoune users live in the locked menu while reviewing diffs.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Open the menu with {{key:dance.view.line}}. In Kakoune, you'd press `V` instead of `v` here to **lock** it.",
      goal: { kind: "command-fired", id: "dance.view.line" },
    },
    {
      narrate:
        "With the menu locked you can chain: `c` centre, then `j` `j` `j` to walk down, then `c` again to recentre — without hitting `v` between each.",
      hint: "The menu stays open until you press `<esc>` or a non-view key.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "In VS Code Dance, the closest workflow is to open the menu, scroll a bit, and reopen it. Bind a key to `dance.view.line` if you haven't yet — it's worth a single keystroke per recentre.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
