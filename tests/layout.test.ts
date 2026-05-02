import { describe, expect, it } from "vitest";
import { renderChord } from "@/layout/resolve.ts";
import type { KeyChord } from "@/bindings/types.ts";

const CODE_T: KeyChord = {
  modifiers: [],
  key: { kind: "code", code: "KeyT" },
};
const CHAR_T: KeyChord = {
  modifiers: [],
  key: { kind: "char", char: "t" },
};

describe("renderChord — code chord (physical position)", () => {
  it("uniform on QWERTY/QWERTY", () => {
    const v = renderChord(CODE_T, { os: "qwerty", printed: "qwerty" });
    expect(v.canonical).toBe("t");
    expect(v.printed).toBe("t");
    expect(v.os).toBe("t");
    expect(v.uniform).toBe(true);
  });

  it("Colemak OS, QWERTY printed: pressing physical KeyT prints T but OS sends G", () => {
    // Physical bindings (`[KeyT]`): canonical = qwerty letter at KeyT,
    // printed = qwerty hardware letter at KeyT, os = colemak letter at KeyT.
    const v = renderChord(CODE_T, { os: "colemak", printed: "qwerty" });
    expect(v.canonical).toBe("t");
    expect(v.printed).toBe("t");
    expect(v.os).toBe("g");
    expect(v.uniform).toBe(false);
  });

  it("shift on a code chord", () => {
    const v = renderChord(
      { modifiers: ["shift"], key: { kind: "code", code: "KeyT" } },
      { os: "colemak", printed: "qwerty" },
    );
    expect(v.canonical).toBe("T");
    expect(v.printed).toBe("T");
    expect(v.os).toBe("G");
  });
});

describe("renderChord — char chord (layout-char, e.g. Kak doc reference)", () => {
  it("Colemak OS, QWERTY printed: 't' canonical → printed F, OS produces t", () => {
    // Char bindings/Kak doc: position is where Colemak puts t (= KeyF).
    // The hardware label at KeyF on QWERTY is 'f'.
    const v = renderChord(CHAR_T, { os: "colemak", printed: "qwerty" });
    expect(v.canonical).toBe("t");
    expect(v.os).toBe("t");
    expect(v.printed).toBe("f");
    expect(v.uniform).toBe(false);
  });

  it("Shift+t on Colemak/QWERTY → printed F (shifted)", () => {
    const v = renderChord(
      { modifiers: ["shift"], key: { kind: "char", char: "t" } },
      { os: "colemak", printed: "qwerty" },
    );
    expect(v.canonical).toBe("T");
    expect(v.printed).toBe("F");
    expect(v.os).toBe("T");
  });

  it("Dvorak OS, QWERTY printed: 't' lives at QWERTY's KeyK", () => {
    const v = renderChord(CHAR_T, { os: "dvorak", printed: "qwerty" });
    expect(v.canonical).toBe("t");
    expect(v.os).toBe("t");
    expect(v.printed).toBe("k");
  });

  it("named keys are layout-independent", () => {
    const v = renderChord(
      { modifiers: [], key: { kind: "named", name: "escape" } },
      { os: "colemak", printed: "qwerty" },
    );
    expect(v.uniform).toBe(true);
    expect(v.canonical).toBe("escape");
  });
});
