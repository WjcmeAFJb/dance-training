import { describe, expect, it } from "vitest";
import { dispatch } from "@/emulator/dance.ts";
import { initialEditorState } from "@/emulator/types.ts";

describe("dance dispatcher", () => {
  it("right.jump moves the selection one cell right", () => {
    const s = initialEditorState("hello");
    const next = dispatch(s, "dance.select.right.jump");
    expect(next.selections[0]?.active.col).toBe(2);
  });

  it("yank-delete removes the selection text and yanks", () => {
    const s = initialEditorState("ab");
    const next = dispatch(s, "dance.edit.yank-delete");
    expect(next.text).toBe("b");
    expect(next.registers['"']?.[0]).toBe("a");
  });

  it("modes.insert.before flips state to insert", () => {
    const s = initialEditorState("xyz");
    const next = dispatch(s, "dance.modes.insert.before");
    expect(next.mode).toBe("insert");
  });

  it("paste.after inserts after the selection", () => {
    let s = initialEditorState("abc");
    s = dispatch(s, "dance.edit.yank-delete"); // text = "bc", reg = "a"
    s = dispatch(s, "dance.edit.paste.after");
    expect(s.text).toContain("a");
  });
});
