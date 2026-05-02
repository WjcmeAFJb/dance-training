import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "01-object-menu-overview",
  folder: "06-text-objects",
  title: "The object menu: <a-i> and <a-a>",
  blurb:
    "Two prefixes open a class picker. Inner trims the wrapper, whole keeps it. Same menu, two flavours.",
  est_minutes: 4,
  teaches: ["kak.normal.seek.object.inner", "kak.normal.seek.object.outer"],
  initial: {
    text: 'function greet(name) {\n  return "hello, " + name;\n}\n',
  },
  steps: [
    {
      narrate:
        "Press {{key:dance.seek.askObject.inner}} to open the **inner object** menu. Nothing selects yet — the menu is asking *which class* of object you want.",
      hint: "On a default install this is {{kakkey:<a-i>}} (Alt+i). The menu hangs and waits for the next key.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate:
        "Pick the parenthesis class — press {{kakkey:(>}} (or `b`, Dance accepts both). The selection should snap to the contents of `(...)`.",
      hint: "If nothing happened, the menu may have closed. Press {{key:dance.seek.askObject.inner}} again, then the bracket.",
      goal: { kind: "text-matches", pattern: /name/ },
    },
    {
      narrate:
        "Now the **whole** variant: {{key:dance.seek.askObject}} opens the same menu, but picks include the wrapper.",
      hint: "Default key: {{kakkey:<a-a>}}.",
      goal: { kind: "command-fired", id: "dance.seek.askObject" },
    },
    {
      narrate:
        "Pick `(` again. This time the parens themselves are inside the selection, not just the contents.",
      goal: { kind: "command-fired", id: "dance.seek.askObject", count: 1 },
    },
    {
      narrate:
        "That's the whole pattern: prefix → class. Inner peels the wrapper, whole keeps it. The next lessons drill specific classes.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
