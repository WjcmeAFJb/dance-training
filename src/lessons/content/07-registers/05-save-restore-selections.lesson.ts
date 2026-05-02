import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "05-save-restore-selections",
  folder: "07-registers",
  title: "Save/restore selections: Z and z",
  blurb:
    "Selections are first-class — you can stash a set under a register and restore it later. Named selection sets, on demand.",
  est_minutes: 4,
  teaches: ["kak.normal.selections.save", "kak.normal.selections.restore"],
  initial: {
    text: "TODO refactor login\nTODO add tests\nTODO update docs\nNORMAL line\nNORMAL line\n",
  },
  steps: [
    {
      narrate:
        "Make a multi-cursor on every TODO line. Use search: {{key:dance.search}} `TODO`, then add the next two with {{key:dance.search.next.add}} twice.",
      goal: { kind: "command-fired", id: "dance.search.next.add", count: 2 },
    },
    {
      narrate:
        "Stash this whole selection set under register `t`: {{key:dance.selectRegister}} `t` then {{key:dance.selections.save}}.",
      hint: "Default save-key: {{kakkey:Z}}. Capital Z because lowercase z restores.",
      goal: { kind: "command-fired", id: "dance.selections.save" },
    },
    {
      narrate:
        "Now wreck the selection — click somewhere or press {{key:dance.selections.clear.secondary}} to keep only the main one.",
      goal: { kind: "command-fired", id: "dance.selections.clear.secondary" },
    },
    {
      narrate:
        "Restore your three TODO selections: {{key:dance.selectRegister}} `t` then {{key:dance.selections.restore}}.",
      hint: "Default restore-key: {{kakkey:z}}. Lower-case is the read; upper-case the write.",
      goal: { kind: "command-fired", id: "dance.selections.restore" },
    },
    {
      narrate:
        "You now have named selection sets. Stash before doing risky multi-cursor work; restore if it goes sideways. Combine with `dance.selections.restore.withCurrent` to **merge** stored and current.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
