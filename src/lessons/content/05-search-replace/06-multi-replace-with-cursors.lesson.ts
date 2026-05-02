import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "06-multi-replace-with-cursors",
  folder: "05-search-replace",
  title: "Multi-cursor replace: s, type, escape",
  blurb:
    "True global replace: select the buffer, `s` to filter to matches, `c` to delete-into-insert, type the new text, escape. One pass, no regex prompt for the replacement.",
  est_minutes: 6,
  requires: ["kak.normal.selections.select.regex", "kak.normal.edit.yank.delete.insert"],
  teaches: ["kak.normal.selections.select.regex", "kak.normal.edit.yank.delete.insert"],
  initial: {
    text: "function getUser() {}\nfunction setUser() {}\nfunction deleteUser() {}\nfunction findUser() {}\n",
  },
  steps: [
    {
      narrate:
        "Goal: rename `User` to `Account` everywhere. Step 1 — select the buffer with {{key:dance.select.buffer}}.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "Step 2 — narrow to the targets. Press {{key:dance.selections.select}} (Kak's `s`) and type `User`. You now have four cursors, one on each `User`.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Step 3 — replace. Press {{key:dance.edit.yank-delete-insert}} (Kak's `c`) — it deletes each selection and drops you in Insert mode. Type `Account`, then Escape.",
      hint: "`c` = **c**hange. Same key as Vim, but operates on every cursor at once.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.edit.yank-delete-insert" },
          { kind: "text-matches", pattern: /getAccount/ },
        ],
      },
    },
    {
      narrate:
        "All four functions should now read `getAccount`, `setAccount`, `deleteAccount`, `findAccount`.",
      goal: {
        kind: "all",
        goals: [
          { kind: "text-matches", pattern: /getAccount/ },
          { kind: "text-matches", pattern: /setAccount/ },
          { kind: "text-matches", pattern: /deleteAccount/ },
          { kind: "text-matches", pattern: /findAccount/ },
        ],
      },
    },
    {
      narrate:
        "Note the loop: select-buffer → `s` → `c` → type → Escape. Five keystrokes for a global substitution. This is **the** Kak way, not the yank-replace style of the previous lesson.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
