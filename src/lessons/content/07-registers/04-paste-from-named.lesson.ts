import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "04-paste-from-named",
  folder: "07-registers",
  title: 'Paste from a named register: "<r> p',
  blurb:
    'Same prefix idea, applied to paste. `"a p` pastes the contents of register `a` after the selection.',
  est_minutes: 4,
  requires: ["kak.normal.register.select", "kak.normal.edit.paste.after"],
  teaches: [],
  initial: {
    text: "alpha\nbeta\ngamma\n",
  },
  steps: [
    {
      narrate:
        "Yank `alpha` to register `a`: select the first line ({{key:dance.select.line.below}}), then {{key:dance.selectRegister}} `a` {{key:dance.selections.saveText}}.",
      goal: { kind: "register", name: "a", equals: "alpha\n" },
    },
    {
      narrate:
        "Move down two lines and yank `gamma` to register `g`: {{key:dance.select.down.jump}} {{key:dance.select.down.jump}} then {{key:dance.selectRegister}} `g` {{key:dance.selections.saveText}}.",
      goal: { kind: "register", name: "g", equals: "gamma\n" },
    },
    {
      narrate:
        "Now park on `beta`. To paste **register a** after it: {{key:dance.selectRegister}} `a` then {{key:dance.edit.paste.after}}.",
      goal: { kind: "text-matches", pattern: /beta\n*alpha/ },
    },
    {
      narrate:
        "And to paste **register g** before the cursor: {{key:dance.selectRegister}} `g` then {{key:dance.edit.paste.before}}. The same prefix system applies to every register-aware command.",
      goal: { kind: "text-matches", pattern: /gamma[\s\S]*beta/ },
    },
    {
      narrate:
        "Pattern: prefix → name → action. It works for yank (`y`), paste (`p`/`P`), replace (`R`), and the macro commands you'll see next.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
