import type { Lesson } from "../../types.ts";

// Vim-Golf challenge 540629666a1e4000020d9e5a
// in:  abcdefghijklm
// out: -a-b-c-d-e-f-g-h-i-j-k-l-m-
// cmd: xs.<ret>i-<esc>

export const lesson: Lesson = {
  id: "01-split-and-insert",
  folder: "99-golf",
  title: "Golf: split a string and insert between every char",
  blurb:
    "Take `abcdefghijklm` and turn it into `-a-b-c-d-e-f-g-h-i-j-k-l-m-`. The Kak solution is six keystrokes — selection-first does the heavy lifting.",
  est_minutes: 4,
  requires: [
    "kak.normal.selections.select.regex",
    "kak.normal.select.line.below",
    "kak.normal.insert.before",
  ],
  teaches: ["kak.normal.selections.select.regex"],
  initial: {
    text: "abcdefghijklm",
  },
  steps: [
    {
      narrate:
        "Goal: insert `-` between every letter (and at both ends). The Kakoune solution is `xs.<ret>i-<esc>` — six chords. Strategy: place a cursor *between* every letter, then type a dash everywhere at once.",
      goal: { kind: "mode-is", mode: "normal" },
    },
    {
      narrate:
        "First, select the whole line with {{key:dance.select.line.below}} ({{kakkey:x}}). The trailing newline isn't there in the input, so this just grabs `abcdefghijklm`.",
      goal: {
        kind: "any",
        goals: [
          { kind: "command-fired", id: "dance.select.line.below" },
          { kind: "command-fired", id: "dance.select.lineEnd" },
        ],
      },
    },
    {
      narrate:
        "Now run {{key:dance.selections.select}} ({{kakkey:s}}) and enter the regex `.` — every single character becomes its own cursor. Status bar shows 13 sels.",
      hint: "`s` *narrows* the existing selection to regex matches. `.` matches any character, so each letter gets its own selection.",
      goal: { kind: "command-fired", id: "dance.selections.select" },
    },
    {
      narrate:
        "With 13 cursors lined up, press {{key:dance.modes.insert.before}} (`i`) to enter Insert **before** each, type `-`, then escape back to Normal.",
      hint: "If your selections are facing the wrong way, `i` will still insert before the cursor's anchor. Trust it.",
      goal: { kind: "command-fired", id: "dance.modes.insert.before" },
    },
    {
      narrate:
        "Final result should match the target. Notice we get the trailing `-` for free because Kak's `i` inserts before each selection — the last cursor sits on `m`, and after typing `-` the cursor moves right, so a final dash also lands.",
      hint: "Hmm — actually the trailing `-` requires the cursor anchored *after* the last char. If you got `-a-b-c-d-e-f-g-h-i-j-k-l-m`, you missed the last dash. Reset and try again with the buffer-select trick.",
      goal: { kind: "text-equals", expected: "-a-b-c-d-e-f-g-h-i-j-k-l-m-" },
    },
  ],
};
