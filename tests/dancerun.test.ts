// Verify applyBinding handles dance.run with the `code` (JavaScript-string)
// form by extracting executeCommand calls and dispatching the dance equivalent.

import { describe, expect, it } from "vitest";
import { applyBinding } from "@/emulator/keypress.ts";
import { initialEditorState } from "@/emulator/types.ts";
import type { ResolvedBinding } from "@/bindings/types.ts";

const downRunBinding: ResolvedBinding = {
  raw: "[KeyK]",
  sequence: [{ modifiers: [], key: { kind: "code", code: "KeyK" } }],
  command: "dance.run",
  args: {
    code: [
      "if (repetitions > 1) {",
      "  await vscode.commands.executeCommand('dance.select.down.jump', { count: repetitions })",
      "} else {",
      "  vscode.commands.executeCommand('cursorDown')",
      "}",
    ],
  },
  isNegation: false,
  isDanceCommand: true,
};

const cursorDownOnlyBinding: ResolvedBinding = {
  raw: "[KeyZ]",
  sequence: [{ modifiers: [], key: { kind: "code", code: "KeyZ" } }],
  command: "dance.run",
  args: { code: "vscode.commands.executeCommand('cursorRight')" },
  isNegation: false,
  isDanceCommand: true,
};

describe("applyBinding — dance.run forms", () => {
  it("prefers the dance.* variant when the code branches between dance and a vscode builtin", () => {
    const s = initialEditorState("ab\ncd");
    const next = applyBinding(s, downRunBinding);
    // dance.select.down.jump moves the cursor one line down.
    expect(next.selections[0]?.active.line).toBe(1);
    expect(next.commandLog.at(-1)?.id).toBe("dance.select.down.jump");
  });

  it("maps vscode cursor* commands to their dance equivalents", () => {
    const s = initialEditorState("abcd");
    const next = applyBinding(s, cursorDownOnlyBinding);
    expect(next.selections[0]?.active.col).toBe(2);
    expect(next.commandLog.at(-1)?.id).toBe("dance.select.right.jump");
  });
});
