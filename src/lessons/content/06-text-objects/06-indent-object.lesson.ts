import type { Lesson } from "../../types.ts";

export const lesson: Lesson = {
  id: "06-indent-object",
  folder: "06-text-objects",
  title: "Indent object: <a-i>i",
  blurb:
    "Select all lines at or above the current indent level. Perfect for grabbing a function body or a YAML block.",
  est_minutes: 4,
  requires: ["kak.normal.seek.object.inner"],
  teaches: ["kak.normal.seek.object.inner"],
  initial: {
    text:
      "function process(items) {\n" +
      "  for (const item of items) {\n" +
      "    if (item.valid) {\n" +
      "      handle(item);\n" +
      "      log(item);\n" +
      "    }\n" +
      "  }\n" +
      "}\n",
    selections: [{ anchor: { line: 3, col: 6 }, active: { line: 3, col: 7 } }],
  },
  steps: [
    {
      narrate:
        "Cursor is inside the deepest block (`handle`/`log`). Press {{key:dance.seek.askObject.inner}} then `i` to grab the indent block.",
      hint: "The indent class extends as far as it can while staying at or above the current indent level.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner" },
    },
    {
      narrate:
        "The selection should now cover **just** the two lines at the deepest indent (`handle(item);` and `log(item);`).",
      goal: { kind: "text-matches", pattern: /handle\(item\);\s*\n\s*log\(item\);/ },
    },
    {
      narrate:
        "Now park on the `for` line and grab the **enclosing** indent block with {{key:dance.seek.askObject.inner}} `i` again — the indent picker climbs up from your cursor's column.",
      reset: {
        text:
          "function process(items) {\n" +
          "  for (const item of items) {\n" +
          "    if (item.valid) {\n" +
          "      handle(item);\n" +
          "      log(item);\n" +
          "    }\n" +
          "  }\n" +
          "}\n",
        selections: [{ anchor: { line: 1, col: 4 }, active: { line: 1, col: 5 } }],
      },
      hint: "The whole `for` body should select.",
      goal: { kind: "command-fired", id: "dance.seek.askObject.inner", count: 1 },
    },
    {
      narrate:
        "Pair this with delete or change to operate on whole indent blocks at once. It's the closest Kak comes to a structural editor without tree-sitter.",
      goal: { kind: "mode-is", mode: "normal" },
    },
  ],
};
