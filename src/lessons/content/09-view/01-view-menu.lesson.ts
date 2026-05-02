import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-view-menu",
  folder: "09-view",
  title: "The view menu: v",
  blurb:
    "Press `v`, then a direction. Centre the cursor, push it to the top, or sink it to the bottom — without scrolling by hand.",
  est_minutes: 4,
  teaches: ["kak.normal.view.line"],
  initial: {
    text:
      "// 0 keep scrolling — there are 40 lines here\n" +
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
      "// 15\n" +
      "// 16\n" +
      "// 17\n" +
      "// 18\n" +
      "// 19 cursor parked here\n" +
      "// 20\n" +
      "// 21\n" +
      "// 22\n" +
      "// 23\n" +
      "// 24\n" +
      "// 25\n" +
      "// 26\n" +
      "// 27\n" +
      "// 28\n" +
      "// 29\n" +
      "// 30\n" +
      "// 31\n" +
      "// 32\n" +
      "// 33\n" +
      "// 34\n" +
      "// 35\n" +
      "// 36\n" +
      "// 37\n" +
      "// 38\n" +
      "// 39\n",
    selections: [{ anchor: { line: 19, col: 0 }, active: { line: 19, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Press {{key:dance.view.line}} to open the **view menu**. Nothing scrolls yet — Dance is asking *which* anchor you want for the cursor.",
      hint: "Default key is {{kakkey:v}}. The menu hangs and waits for the next letter.",
      goal: { kind: "command-fired", id: "dance.view.line" },
    },
    {
      narrate:
        "Pick `v` (or `m`, `c`, `z`) to **centre** the cursor on screen. The line you were on is now in the middle of the viewport.",
      hint: "Different builds accept different letters: `v` `m` `c` and `z` all mean centre. Pick whichever sticks.",
      goal: { kind: "command-fired", id: "dance.view.line", count: 1 },
    },
    {
      narrate:
        "Open the menu again with {{key:dance.view.line}} and press `t` (top). The cursor should be near the **top** of the visible area now — handy when reading downward.",
      goal: { kind: "command-fired", id: "dance.view.line", count: 2 },
    },
    {
      narrate:
        "One more time: {{key:dance.view.line}} then `b` (bottom). The cursor pins to the **bottom** of the viewport — useful when you want context above the line you're editing.",
      goal: { kind: "command-fired", id: "dance.view.line", count: 3 },
    },
    {
      narrate:
        "That's the whole menu: prefix → letter. `v`/`m`/`c` centre, `t` top, `b` bottom. The cursor never moves — only the viewport.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
