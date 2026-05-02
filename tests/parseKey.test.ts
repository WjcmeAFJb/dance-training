import { describe, expect, it } from "vitest";
import { parseChord, parseSequence, qwertyCodeForChar } from "@/bindings/parseKey.ts";

describe("parseChord", () => {
  it("parses bare chars", () => {
    expect(parseChord("t")).toEqual({
      modifiers: [],
      key: { kind: "char", char: "t" },
    });
  });

  it("parses a single modifier", () => {
    expect(parseChord("ctrl+t")).toEqual({
      modifiers: ["ctrl"],
      key: { kind: "char", char: "t" },
    });
  });

  it("orders modifiers canonically", () => {
    expect(parseChord("alt+ctrl+shift+t").modifiers).toEqual(["ctrl", "shift", "alt"]);
  });

  it("parses bracket codes", () => {
    expect(parseChord("[KeyT]")).toEqual({
      modifiers: [],
      key: { kind: "code", code: "KeyT" },
    });
    expect(parseChord("shift+alt+[KeyW]")).toEqual({
      modifiers: ["shift", "alt"],
      key: { kind: "code", code: "KeyW" },
    });
  });

  it("parses named keys", () => {
    expect(parseChord("escape")).toEqual({
      modifiers: [],
      key: { kind: "named", name: "escape" },
    });
    expect(parseChord("shift+f12").modifiers).toEqual(["shift"]);
  });

  it("parses sequences", () => {
    expect(parseSequence("ctrl+k ctrl+s").length).toBe(2);
  });

  it("returns codes for ASCII chars", () => {
    expect(qwertyCodeForChar("a")).toBe("KeyA");
    expect(qwertyCodeForChar("Z")).toBe("KeyZ");
    expect(qwertyCodeForChar("1")).toBe("Digit1");
    expect(qwertyCodeForChar(",")).toBe("Comma");
    expect(qwertyCodeForChar("?")).toBe("Slash");
  });
});
