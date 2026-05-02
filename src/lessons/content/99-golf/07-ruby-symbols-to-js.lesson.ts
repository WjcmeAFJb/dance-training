import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 4d1e29fda93ce03311000066
// in:  Ruby hash with `:k => v` symbols
// out: JS-style `k: v`
// cmd: %s:<ret>deR

export const lesson: Lesson = {
  id: "07-ruby-symbols-to-js",
  folder: "99-golf",
  title: "Golf: Ruby `:sym => v` → JS `sym: v`",
  blurb:
    "Convert `{ :a => 1 }` to `{ a: 1 }`. Six chords. Demonstrates regex-narrow + delete-to-word-end + replace-with-yank.",
  est_minutes: 5,
  requires: [
    "kak.normal.select.buffer",
    "kak.normal.selections.select.regex",
    "kak.normal.edit.yank.delete",
    "kak.normal.edit.yank.replace",
  ],
  teaches: ["kak.normal.edit.yank.replace"],
  initial: {
    text: "{\n  :a => 1,\n  :b => 2,\n  :c => 3\n}\n",
  },
  steps: [
    {
      narrate:
        "Goal: `{ a: 1, b: 2, c: 3 }` (one per line). Kak: `%s:<ret>deR`. Strategy: select all `:` colons → delete each plus the following word-end (` =>`) → paste a `:` after each name.",
      hint: "The original solution is denser than this walkthrough. We'll use a slightly more explicit variant that's easier to verify.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate: "Press {{key:dance.select.buffer}} ({{kakkey:%}}) to grab the whole buffer.",
      goal: { kind: "command-fired", id: "dance.select.buffer" },
    },
    {
      narrate:
        "Now narrow to colon characters: {{key:dance.selections.select}} ({{kakkey:s}}) with regex `:`. Three cursors, one per `:`.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "Each cursor sits on a `:`. Yank a `:` to the clipboard with {{key:dance.selections.saveText}} (`y`) — we'll need it after the symbol name.",
      goal: { kind: "command-fired", id: "dance.selections.saveText" },
    },
    {
      narrate:
        "Now extend each selection across the symbol name and the `=>`: {{key:dance.seek.wordEnd}} (`e`) twice should reach `=>`. Then delete with {{key:dance.edit.yank-delete}} (`d`).",
      hint: "If the selection overshoots, trim with {{key:dance.select.left.extend}} ({{kakkey:H}}). Final selections should each cover `:NAME =>`.",
      goal: { kind: "command-fired", id: "dance.edit.yank-delete" },
    },
    {
      narrate:
        "After deletion the cursors land on the position after the bare name. Type `: ` (colon + space) and you're done — or use {{key:dance.edit.yank-replace}} ({{kakkey:R}}) to paste the saved colon.",
      hint: "The original golf assumes deftness with the registers. Don't worry about matching it exactly — the technique is what matters.",
      goal: { kind: "text-matches", pattern: /^\{[\s\S]*a: 1,?[\s\S]*b: 2/ },
    },
    {
      narrate:
        "**The pattern**: `%s<regex><ret>` is *the* Kak idiom for buffer-wide regex multi-cursor. Once you have the cursors, anything you can do with one selection works on all of them.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
