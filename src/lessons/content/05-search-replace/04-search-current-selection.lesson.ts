import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-search-current-selection",
  folder: "05-search-replace",
  title: "Search current selection: * and <a-*>",
  blurb:
    "Skip the prompt entirely. `*` sets the search register from your selection. `<a-*>` does the same with smart-case.",
  est_minutes: 5,
  requires: ["kak.normal.search.forward", "kak.normal.search.next"],
  teaches: ["kak.normal.search.selection", "kak.normal.search.selection.smart"],
  discrepancies: ["disc.search.case"],
  initial: {
    text: "Render renders the renderer. Render again.\nRender Render render.\n",
  },
  steps: [
    {
      narrate:
        "Use {{key:dance.seek.word}} to select the first word `Render`. (One press, you should land on `Render` plus its trailing space.)",
      hint: "If you over-shoot, try {{key:dance.seek.wordEnd}} instead — that one excludes whitespace.",
      goal: { kind: "command-fired", id: "dance.seek.word" },
    },
    {
      narrate:
        "Now press {{key:dance.search.selection}} (Kak's `*`). Dance copies the selection's text into the search register. Subsequent {{key:dance.search.next}} presses will hop between **exact** `Render` matches — case-sensitive.",
      goal: { kind: "command-fired", id: "dance.search.selection" },
    },
    {
      narrate:
        "Press {{key:dance.search.next}} a couple of times to verify. Notice that `render` (lowercase) is **skipped** — the pattern is literal `Render`.",
      goal: { kind: "command-fired", id: "dance.search.next" },
    },
    {
      narrate:
        "Reset. Select `Render` again, but this time press {{key:dance.search.selection.smart}} (Kak's `<a-*>`). Smart-case kicks in: an all-lowercase pattern matches both cases, but a mixed-case pattern stays exact.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.search.selection.smart" },
    },
    {
      narrate:
        "This is the **only** smart-case path in vanilla Dance — there's no global option for it on `/`. If you want smart-case-ish search, lean on `<a-*>`.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.search.selection.smart" },
          { kind: "command-fired", id: "dance.search.selection" },
        ],
      },
    },
  ],
};
