import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "02-backward-search",
  folder: "05-search-replace",
  title: "Backward search: <a-/>",
  blurb:
    "Same regex prompt, opposite direction. `<a-/>` searches **upward** from the cursor. `?` extends — it searches forward but **keeps** the prior selection as anchor.",
  est_minutes: 4,
  requires: ["kak.normal.search.forward"],
  teaches: ["kak.normal.search.backward", "kak.normal.search.forward.extend"],
  initial: {
    text: "first appearance of foo\nsecond foo\nyou are here\nthird foo\nfourth foo\n",
  },
  steps: [
    {
      narrate:
        "First, position yourself. Search forward with {{key:dance.search}} for `here`, Enter. The selection lands on line 3.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
    {
      narrate:
        "Now press {{key:dance.search.backward}} (Kak's `<a-/>`), type `foo`, Enter. The search runs **backward** — selection jumps to the `foo` on line 2, not line 4.",
      hint: "Read the prompt: it shows `<-/` instead of `/`.",
      goal: { kind: "command-fired", id: "dance.search.backward" },
    },
    {
      narrate:
        "Reset. This time press {{key:dance.search.extend}} (Kak's `?`) and type `foo`. The selection extends from where you started **all the way to** the next `foo` — a single sweep, anchor preserved.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.search.extend" },
    },
    {
      narrate:
        "Mental model: `/` and `<a-/>` **jump**, `?` and `<a-?>` **extend**. Capital/Alt is the extender across most of Kak.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.search.backward" },
          { kind: "command-fired", id: "dance.search.extend" },
        ],
      },
    },
  ],
};
