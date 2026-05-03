import { describe, expect, it } from "vitest";
import { dispatch } from "@/emulator/dance.ts";
import { initialEditorState } from "@/emulator/types.ts";

describe("word seek (forward)", () => {
  it("walks past current word and trailing whitespace", () => {
    let s = initialEditorState("the quick brown fox");
    s = dispatch(s, "dance.seek.word");
    // After one `w` from col 1 of "the", cursor is at start of "quick" (col 4).
    expect(s.selections[0]?.active).toEqual({ line: 0, col: 4 });
  });

  it("walks across a line boundary", () => {
    let s = initialEditorState("foo\nbar baz");
    s = dispatch(s, "dance.seek.word");
    expect(s.selections[0]?.active).toEqual({ line: 1, col: 0 });
  });
});

describe("word seek (backward)", () => {
  it("steps back through whitespace and the preceding word", () => {
    let s = initialEditorState("the quick brown fox");
    // Move cursor to start of "fox" (line 0, col 16).
    s = {
      ...s,
      selections: [{ anchor: { line: 0, col: 16 }, active: { line: 0, col: 16 } }],
    };
    s = dispatch(s, "dance.seek.word.backward");
    // Should land at the start of "brown" (col 10).
    expect(s.selections[0]?.active).toEqual({ line: 0, col: 10 });
  });

  it("crosses a line boundary backward", () => {
    let s = initialEditorState("first\nsecond");
    s = {
      ...s,
      selections: [{ anchor: { line: 1, col: 0 }, active: { line: 1, col: 0 } }],
    };
    s = dispatch(s, "dance.seek.word.backward");
    expect(s.selections[0]?.active.line).toBe(0);
    // Should land at start of "first" (col 0).
    expect(s.selections[0]?.active.col).toBe(0);
  });

  it("does not infinite-loop or get stuck at the buffer start", () => {
    let s = initialEditorState("abc");
    // Cursor at start.
    s = {
      ...s,
      selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 0 } }],
    };
    const next = dispatch(s, "dance.seek.word.backward");
    expect(next.selections[0]?.active).toEqual({ line: 0, col: 0 });
  });

  it("walks across multiple lines back to the previous word", () => {
    let s = initialEditorState("alpha beta\ngamma delta");
    s = {
      ...s,
      selections: [{ anchor: { line: 1, col: 6 }, active: { line: 1, col: 6 } }],
    };
    // From "delta" → back to start of "delta" (col 6 → col 6 isn't useful, let's go further).
    // Actually our cursor is AT col 6 ('d' of delta). Backward: skip space, skip "gamma".
    s = dispatch(s, "dance.seek.word.backward");
    // We should land at the start of "gamma" (line 1, col 0).
    expect(s.selections[0]?.active).toEqual({ line: 1, col: 0 });
  });
});
