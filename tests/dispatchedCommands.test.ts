// Verify parseUserKeybindings extracts dispatched command ids from dance.run
// blocks (both the `commands` array form and the `code` JS string form), so
// preferredBinding can resolve, e.g., dance.select.down.jump → the user's
// [KeyK] binding even when that binding's `command` is `dance.run`.

import { describe, expect, it } from "vitest";
import { parseUserKeybindings } from "@/bindings/parseKeybindings.ts";
import { preferredBinding } from "@/bindings/findBinding.ts";

const FILE = `[
  { "key": "[KeyK]",
    "command": "dance.run",
    "when": "editorTextFocus && !jumpy2.jump-mode && dance.mode == 'normal'",
    "args": {
      "code": [
        "if (repetitions > 1) {",
        "  await vscode.commands.executeCommand('dance.select.down.jump', { count: repetitions })",
        "} else {",
        "  vscode.commands.executeCommand('cursorDown')",
        "}"
      ]
    }
  },
  { "key": "[KeyJ]",
    "command": "dance.select.left.jump",
    "when": "editorTextFocus && dance.mode == 'normal'"
  }
]`;

describe("dispatchedCommands extraction", () => {
  it("populates dispatchedCommands for dance.run with code", async () => {
    const { bindings } = await parseUserKeybindings(FILE);
    const k = bindings.find((b) => b.raw === "[KeyK]");
    expect(k?.dispatchedCommands).toContain("dance.select.down.jump");
  });

  it("preferredBinding resolves dance.select.down.jump to the [KeyK] dance.run wrapper", async () => {
    const { bindings } = await parseUserKeybindings(FILE);
    const got = preferredBinding("dance.select.down.jump", bindings);
    expect(got?.raw).toBe("[KeyK]");
  });

  it("direct bindings still take priority over dance.run wrappers", async () => {
    const file = `[
      { "key": "[KeyK]", "command": "dance.run", "args": { "code": "executeCommand('dance.select.right.jump')" } },
      { "key": "[Semicolon]", "command": "dance.select.right.jump" }
    ]`;
    const { bindings } = await parseUserKeybindings(file);
    const got = preferredBinding("dance.select.right.jump", bindings);
    expect(got?.raw).toBe("[Semicolon]");
  });
});
