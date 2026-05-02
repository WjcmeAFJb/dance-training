import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-half-page-scroll",
  folder: "09-view",
  title: "Half-page scroll: <c-d> and <c-u>",
  blurb:
    "Walk down half a screen at a time, walk back up. The fastest way to read a long buffer without losing the cursor.",
  est_minutes: 4,
  teaches: ["kak.normal.view.line"],
  initial: {
    text:
      "line  1\nline  2\nline  3\nline  4\nline  5\nline  6\nline  7\nline  8\nline  9\nline 10\n" +
      "line 11\nline 12\nline 13\nline 14\nline 15\nline 16\nline 17\nline 18\nline 19\nline 20\n" +
      "line 21\nline 22\nline 23\nline 24\nline 25\nline 26\nline 27\nline 28\nline 29\nline 30\n" +
      "line 31\nline 32\nline 33\nline 34\nline 35\nline 36\nline 37\nline 38\nline 39\nline 40\n",
    selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "Half-page down is **{{kakkey:<c-d>}}** (Ctrl+D). Press it. The viewport scrolls down half a screen and the cursor follows so it stays on screen.",
      hint: "Dance maps both `<c-d>` and `<c-u>` to its scrolling commands by default. If yours doesn't, look for `dance.view.line` variants in your bindings.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.view.line" },
          { kind: "cursor-at", line: 20, col: 0 },
          { kind: "cursor-at", line: 20, col: 1 },
        ],
      },
    },
    {
      narrate:
        "Press {{kakkey:<c-d>}} once more. The cursor should now be near the bottom of the file. Selection-first means the selection moves with you — there's no `cursor` floating off-selection.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Now scroll back up: **{{kakkey:<c-u>}}** (Ctrl+U). Half a page each press. Two `<c-u>`s should land you near the top again.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Full-page variants exist too — {{kakkey:<c-f>}} forward, {{kakkey:<c-b>}} back. They share the same family: in Kakoune they all live behind the `v` menu, but the bare Ctrl-bindings come pre-mapped.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
