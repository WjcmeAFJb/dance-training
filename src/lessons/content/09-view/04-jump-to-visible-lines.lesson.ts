import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-jump-to-visible-lines",
  folder: "09-view",
  title: "Jump to visible lines: gt, gb, gc",
  blurb:
    "The goto menu has three view-relative jumps. Top, bottom, centre of what you can see — without scrolling at all.",
  est_minutes: 4,
  requires: ["kak.normal.goto"],
  teaches: [
    "kak.normal.goto.topVisible",
    "kak.normal.goto.bottomVisible",
    "kak.normal.goto.middleVisible",
  ],
  initial: {
    text:
      "// 0\n// 1\n// 2\n// 3\n// 4\n// 5\n// 6\n// 7\n// 8\n// 9\n" +
      "// 10\n// 11\n// 12\n// 13\n// 14\n// 15\n// 16\n// 17\n// 18\n// 19\n" +
      "// 20\n// 21\n// 22\n// 23\n// 24\n// 25\n// 26\n// 27\n// 28\n// 29\n",
    selections: [{ anchor: { line: 14, col: 0 }, active: { line: 14, col: 1 } }],
  },
  steps: [
    {
      narrate:
        "These are all in the goto menu. Press {{key:dance.select.to.jump}} (the `g` prefix) and watch for the menu cue.",
      hint: "Default prefix: {{kakkey:g}}.",
      goal: { kind: "command-fired", id: "dance.select.to.jump" },
    },
    {
      narrate:
        "Pick `t` to **jump to the top visible line**. The cursor snaps up — but the viewport stays put. This fires {{action:kak.normal.goto.topVisible}}.",
      hint: "On default bindings: {{key:dance.select.firstVisibleLine}}. Combined keystroke is `gt`.",
      goal: { kind: "command-fired", id: "dance.select.firstVisibleLine" },
    },
    {
      narrate:
        "Now jump to the **bottom** visible line — `g` then `b`, or simply {{key:dance.select.lastVisibleLine.jump}} if you have it bound.",
      hint: "Kak's combined keystroke is `gb`.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.select.lastVisibleLine.jump" },
          { kind: "command-fired", id: "dance.select.lastVisibleLine" },
        ],
      },
    },
    {
      narrate:
        "And the **centre**: {{key:dance.select.middleVisibleLine}}. With `gt`/`gc`/`gb` you pick a target without leaving your eyes — the viewport never moves, only the selection.",
      hint: "Kak: `gc`. Pair this with the view menu (`vc`) for the inverse: keep the cursor still, move the viewport.",
      goal: { kind: "command-fired", id: "dance.select.middleVisibleLine" },
    },
    {
      narrate:
        "Two families to remember. **`v` family** moves the *viewport*, cursor stays. **`g` family** moves the *cursor*, viewport stays. Pick the one whose subject is your subject.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
