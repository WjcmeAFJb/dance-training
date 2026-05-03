import { describe, expect, it } from "vitest";
import { evaluateWhen } from "@/bindings/whenClause.ts";

const ctx = {
  values: {
    editorTextFocus: true,
    "jumpy2.jump-mode": false,
    "dance.mode": "normal" as string,
    listFocus: false,
    inputFocus: false,
    whichkeyVisible: false,
  },
};

describe("evaluateWhen", () => {
  it("evaluates a Dance normal-mode clause to true", () => {
    expect(
      evaluateWhen("editorTextFocus && !jumpy2.jump-mode && dance.mode == 'normal'", ctx),
    ).toBe(true);
  });

  it("rules out a jumpy2-mode binding when jumpy isn't active", () => {
    expect(evaluateWhen("editorTextFocus && jumpy2.jump-mode", ctx)).toBe(false);
  });

  it("excludes a list-focused binding when we're in the editor", () => {
    expect(evaluateWhen("listFocus && !inputFocus", ctx)).toBe(false);
  });

  it("excludes a select-mode binding when we're in normal", () => {
    expect(evaluateWhen("editorTextFocus && dance.mode == 'select'", ctx)).toBe(false);
  });

  it("treats an empty/undefined clause as true", () => {
    expect(evaluateWhen(undefined, ctx)).toBe(true);
    expect(evaluateWhen("", ctx)).toBe(true);
  });

  it("supports parens and ||", () => {
    expect(evaluateWhen("(editorTextFocus && dance.mode == 'normal') || listFocus", ctx)).toBe(
      true,
    );
  });

  it("evaluates !=", () => {
    expect(evaluateWhen("dance.mode != 'insert'", ctx)).toBe(true);
    expect(evaluateWhen("dance.mode != 'normal'", ctx)).toBe(false);
  });
});
