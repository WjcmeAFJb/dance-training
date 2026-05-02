import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "03-next-prev",
  folder: "05-search-replace",
  title: "Next/prev match: n N <a-n> <a-N>",
  blurb:
    "After a search, four keys traverse and accumulate matches. Lowercase = jump; uppercase = add. Alt = backward.",
  est_minutes: 6,
  requires: ["kak.normal.search.forward"],
  teaches: [
    "kak.normal.search.next",
    "kak.normal.search.next.add",
    "kak.normal.search.prev",
    "kak.normal.search.prev.add",
  ],
  initial: {
    text: "log()\nlog()\nlog()\nlog()\nlog()\n",
  },
  steps: [
    {
      narrate: "Search for `log` with {{key:dance.search}}. Selection lands on the first match.",
      goal: { kind: "command-fired", id: "dance.search" },
    },
    {
      narrate:
        "Press {{key:dance.search.next}} (Kak's `n`) twice — selection **jumps** forward two matches. Only one cursor.",
      goal: { kind: "command-fired", id: "dance.search.next", count: 2 },
    },
    {
      narrate:
        "Now press {{key:dance.search.previous}} (Kak's `<a-n>`) — selection jumps **back** one match.",
      goal: { kind: "command-fired", id: "dance.search.previous" },
    },
    {
      narrate:
        "Reset. Search again, then press {{key:dance.search.next.add}} (capital `N`) four times. All five matches selected — five cursors.",
      reset: "initial",
      goal: { kind: "command-fired", id: "dance.search.next.add", count: 4 },
    },
    {
      narrate:
        "Press {{key:dance.search.previous.add}} once. The previous match is added — no, wait, you're already at the first. Try this from a middle starting point next time.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.search.previous.add" },
          { kind: "mode-is", mode: "normal" },
        ],
      },
    },
    {
      narrate:
        "Summary: `n` = jump fwd, `N` = add fwd, `<a-n>` = jump bwd, `<a-N>` = add bwd. Burn this table into your fingers — it's the heart of Kak's search-driven editing.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
