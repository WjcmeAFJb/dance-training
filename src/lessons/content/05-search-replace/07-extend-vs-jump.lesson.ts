import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "07-extend-vs-jump",
  folder: "05-search-replace",
  title: "Extend vs jump: ? and <a-?>",
  blurb:
    "When `/` is too destructive: extend variants keep the anchor where you started so the selection grows from cursor to match.",
  est_minutes: 4,
  requires: ["kak.normal.search.forward"],
  teaches: ["kak.normal.search.forward.extend", "kak.normal.search.backward.extend"],
  initial: {
    text: "BEGIN here is some text\nmore text in the middle\nand finally END\n",
  },
  steps: [
    {
      narrate:
        "Place your cursor on `BEGIN` — use {{key:dance.seek.word}} to select it. We'll extend forward from here.",
      goal: { kind: "command-fired", id: "dance.seek.word" },
    },
    {
      narrate:
        "Press {{key:dance.search.extend}} (Kak's `?`), type `END`, Enter. The selection now stretches from `BEGIN` to `END` — anchor preserved, active end moved.",
      hint: "Compare with {{key:dance.search}}: that one would have **discarded** `BEGIN` and selected only `END`.",
      goal: { kind: "command-fired", id: "dance.search.extend" },
    },
    {
      narrate:
        "Reset and put the cursor on `END`. Now press {{key:dance.search.backward.extend}} (Kak's `<a-?>`) and search for `BEGIN`. Selection extends **backward** from `END` all the way to `BEGIN`.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.search.backward.extend" },
    },
    {
      narrate:
        "The full search matrix: `/` jump fwd, `<a-/>` jump bwd, `?` extend fwd, `<a-?>` extend bwd. Mix and match — this is the foundation of region-grabbing in Kak.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.search.extend" },
          { kind: "command-fired", id: "dance.search.backward.extend" },
        ],
      },
    },
  ],
};
