import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 55bcdc3ef4219f456102374f
// in:  The quick brown fox jumps over the lazy dog.
// out: The quick lazy dog jumps over the brown fox.
// cmd: fxfg<a-S>BB<a-)>

export const lesson: Lesson = {
  id: "05-swap-words",
  folder: "99-golf",
  title: "Golf: swap two two-word phrases",
  blurb:
    "Swap `brown fox` with `lazy dog`. Demonstrates rotate-contents (`<a-)>`) — a multi-cursor operation few editors offer at all.",
  est_minutes: 5,
  requires: [
    "kak.normal.seek.f.fwd",
    "kak.normal.selections.split.regex",
    "kak.normal.selections.rotate.contents",
  ],
  teaches: ["kak.normal.selections.rotate.contents"],
  initial: {
    text: "The quick brown fox jumps over the lazy dog.\n",
  },
  steps: [
    {
      narrate:
        "Goal: `The quick lazy dog jumps over the brown fox.` Kak solution: `fxfg<a-S>BB<a-)>`. Strategy: build a multi-selection of the *two* phrases, then rotate their contents.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "Park between `brown fox` and `lazy dog`. Press {{key:dance.seek.included}} ({{kakkey:f}}) and type `x` — selection extends to the `x` of `fox`.",
      goal: { kind: "command-fired", id: "dance.seek.included" },
    },
    {
      narrate:
        "Press {{key:dance.seek.included}} again and type `g` — selection now reaches the `g` of `dog`. The phrase `x jumps over the lazy dog` is selected.",
      goal: { kind: "command-fired", id: "dance.seek.included", count: 2 },
    },
    {
      narrate:
        "Now split on the middle word: {{key:dance.selections.split}} ({{kakkey:<a-S>}}) with regex matching the joining `jumps over the` — that breaks the selection into two pieces, one for each phrase.",
      hint: "Original golf: `<a-S>` with no regex means use the *previous* search. Dance prompts you each time. Type any pattern that matches the connector.",
      goal: { kind: "command-fired", id: "dance.selections.split" },
    },
    {
      narrate:
        "Adjust each end so the selections cover exactly `brown fox` and `lazy dog`. Use {{key:dance.seek.word.extend.backward}} ({{kakkey:B}}) once or twice to trim.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "With both phrases selected, press {{key:dance.selections.rotate.contents}} ({{kakkey:<a-)>}}). The text inside the selections **rotates** between cursors — `brown fox` and `lazy dog` swap.",
      goal: { kind: "command-fired", id: "dance.selections.rotate.contents" },
    },
    {
      narrate:
        "Result: `The quick lazy dog jumps over the brown fox.` Note `<a-)>` rotates *contents* — to rotate the *cursors* (without changing text), use the bare `)`.",
      goal: { kind: "text-matches", pattern: /lazy dog jumps over the brown fox/ },
    },
  ],
};
