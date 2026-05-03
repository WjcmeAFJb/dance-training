import { describe, expect, it } from "vitest";
import { evalPipe } from "@/emulator/pipe.ts";

const ctx = (selectionText: string, all: string[] = [selectionText]) => ({
  selectionText,
  selectionIndex: 0,
  totalSelections: all.length,
  allSelections: all,
});

describe("evalPipe — JS expression form", () => {
  it("evaluates a plain expression with $ as the selection text", () => {
    expect(evalPipe("$.toUpperCase()", ctx("hello"))).toBe("HELLO");
  });

  it("returns $ unchanged on undefined result", () => {
    expect(evalPipe("undefined", ctx("hello"))).toBe("hello");
  });

  it("uses i and n for selection index/total", () => {
    expect(evalPipe("`${i}/${n}`", ctx("x", ["x", "y"]))).toBe("0/2");
  });
});

describe("evalPipe — /pattern/replacement[/flags]", () => {
  it("handles a simple substitution", () => {
    expect(evalPipe("/cat/dog/", ctx("the cat sat on the cat"))).toBe("the dog sat on the dog");
  });

  it("respects flags", () => {
    expect(evalPipe("/Foo/bar/i", ctx("FOO foo"))).toBe("bar bar");
  });
});

describe("evalPipe — #shellish", () => {
  it("sort", () => {
    expect(evalPipe("#sort", ctx("c\na\nb"))).toBe("a\nb\nc");
  });
  it("sort -r", () => {
    expect(evalPipe("#sort -r", ctx("a\nb\nc"))).toBe("c\nb\na");
  });
  it("uniq", () => {
    expect(evalPipe("#uniq", ctx("a\na\nb\nb\na"))).toBe("a\nb\na");
  });
  it("upper / lower / trim", () => {
    expect(evalPipe("#upper", ctx("hi"))).toBe("HI");
    expect(evalPipe("#lower", ctx("HI"))).toBe("hi");
    expect(evalPipe("#trim", ctx("  spaced  \n  more  "))).toBe("spaced\nmore");
  });
  it("rev", () => {
    expect(evalPipe("#rev", ctx("hello"))).toBe("olleh");
  });
  it("wc -l / -w / -c", () => {
    expect(evalPipe("#wc -l", ctx("a\nb\nc"))).toBe("3");
    expect(evalPipe("#wc -w", ctx("one two three"))).toBe("3");
  });
  it("tr a-z A-Z", () => {
    expect(evalPipe("#tr a-z A-Z", ctx("hello"))).toBe("HELLO");
  });
  it("head -n 2", () => {
    expect(evalPipe("#head -n 2", ctx("a\nb\nc\nd"))).toBe("a\nb");
  });
  it("sed s/x/y/g", () => {
    expect(evalPipe("#sed 's/o/0/g'", ctx("foo bar boo"))).toBe("f00 bar b00");
  });
  it("awk '{print $1}'", () => {
    expect(evalPipe("#awk '{print $1}'", ctx("a b\nc d\ne f"))).toBe("a\nc\ne");
  });
  it("grep / grep -v", () => {
    expect(evalPipe("#grep foo", ctx("foo\nbar\nfoobar"))).toBe("foo\nfoobar");
    expect(evalPipe("#grep -v foo", ctx("foo\nbar\nfoobar"))).toBe("bar");
  });
  it("chains stages with internal |", () => {
    expect(evalPipe("#sort | uniq", ctx("c\na\nb\na\nc"))).toBe("a\nb\nc");
  });
});
