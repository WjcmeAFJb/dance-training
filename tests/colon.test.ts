import { describe, expect, it } from "vitest";
import { dispatch } from "@/emulator/dance.ts";
import { initialEditorState } from "@/emulator/types.ts";

describe("colon command handler", () => {
  it("`:sort` sorts the buffer's lines", () => {
    let s = initialEditorState("c\nb\na");
    s = dispatch(s, "dance.colon", { input: "sort" });
    expect(s.text).toBe("a\nb\nc");
  });

  it("`:reverse` reverses lines", () => {
    let s = initialEditorState("a\nb\nc");
    s = dispatch(s, "dance.colon", { input: "reverse" });
    expect(s.text).toBe("c\nb\na");
  });

  it("`:upper` upper-cases the buffer", () => {
    let s = initialEditorState("Hello, World.");
    s = dispatch(s, "dance.colon", { input: "upper" });
    expect(s.text).toBe("HELLO, WORLD.");
  });

  it("`:goto N` jumps to the requested line", () => {
    let s = initialEditorState("one\ntwo\nthree");
    s = dispatch(s, "dance.colon", { input: "goto 3" });
    expect(s.selections[0]?.active.line).toBe(2);
  });

  it("unknown commands are no-ops", () => {
    const s = initialEditorState("abc");
    const next = dispatch(s, "dance.colon", { input: "wat" });
    expect(next.text).toBe("abc");
  });
});
