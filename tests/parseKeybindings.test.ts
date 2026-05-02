import { describe, expect, it } from "vitest";
import { parseUserKeybindings, stripJsonComments } from "@/bindings/parseKeybindings.ts";

describe("stripJsonComments", () => {
  it("removes // line comments", () => {
    const out = stripJsonComments(`{ "a": 1 // comment\n, "b": 2 }`);
    expect(out).toContain('"a": 1');
    expect(out).not.toContain("comment");
  });

  it("preserves // inside strings", () => {
    const out = stripJsonComments(`{ "a": "http://x" }`);
    expect(out).toContain("http://x");
  });
});

describe("parseUserKeybindings", () => {
  it("parses a small JSONC document", async () => {
    const input = `[
      // intro
      { "key": "[KeyT]", "command": "dance.seek" },
      { "key": "shift+[KeyT]", "command": "-dance.seek.extend" },
      { "key": "escape", "command": "dance.modes.set.normal", "when": "editorTextFocus" }
    ]`;
    const result = await parseUserKeybindings(input);
    expect(result.errors).toEqual([]);
    expect(result.bindings).toHaveLength(3);
    expect(result.bindings[0]?.command).toBe("dance.seek");
    expect(result.bindings[1]?.isNegation).toBe(true);
  });

  it("flags malformed entries without aborting", async () => {
    const input = `[
      { "key": "[KeyT]" },
      { "key": "[KeyA]", "command": "dance.seek.word" }
    ]`;
    const result = await parseUserKeybindings(input);
    expect(result.bindings).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });
});
