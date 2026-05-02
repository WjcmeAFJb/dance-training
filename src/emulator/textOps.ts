// Text & range helpers shared by the dispatcher.

import type { Position, Range } from "./types.ts";

export function clonePosition(p: Position): Position {
  return { line: p.line, col: p.col };
}

export function clampPosition(text: string, p: Position): Position {
  const lines = splitLines(text);
  const line = Math.max(0, Math.min(p.line, lines.length - 1));
  const lineText = lines[line] ?? "";
  const col = Math.max(0, Math.min(p.col, lineText.length));
  return { line, col };
}

export function splitLines(text: string): string[] {
  // Preserve trailing empty line if text ends with \n.
  return text.split("\n");
}

export function joinLines(lines: string[]): string {
  return lines.join("\n");
}

export function offsetOf(text: string, p: Position): number {
  const lines = splitLines(text);
  let off = 0;
  for (let i = 0; i < p.line; i++) off += (lines[i]?.length ?? 0) + 1;
  off += p.col;
  return off;
}

export function positionAt(text: string, offset: number): Position {
  const lines = splitLines(text);
  let off = 0;
  for (let i = 0; i < lines.length; i++) {
    const len = lines[i]?.length ?? 0;
    if (offset <= off + len) return { line: i, col: offset - off };
    off += len + 1;
  }
  const last = lines.length - 1;
  return { line: last, col: lines[last]?.length ?? 0 };
}

export function rangeText(text: string, r: Range): string {
  const a = orderRange(r);
  const start = offsetOf(text, a.start);
  const end = offsetOf(text, a.end);
  return text.slice(start, end);
}

export function orderRange(r: Range): { start: Position; end: Position; reversed: boolean } {
  const aBeforeB =
    r.anchor.line < r.active.line ||
    (r.anchor.line === r.active.line && r.anchor.col <= r.active.col);
  return aBeforeB
    ? { start: r.anchor, end: r.active, reversed: false }
    : { start: r.active, end: r.anchor, reversed: true };
}

export function replaceRange(text: string, r: Range, replacement: string): string {
  const { start, end } = orderRange(r);
  const startOff = offsetOf(text, start);
  const endOff = offsetOf(text, end);
  return text.slice(0, startOff) + replacement + text.slice(endOff);
}

export function rangeEqual(a: Range, b: Range): boolean {
  return (
    a.anchor.line === b.anchor.line &&
    a.anchor.col === b.anchor.col &&
    a.active.line === b.active.line &&
    a.active.col === b.active.col
  );
}

export function isAtLineEnd(text: string, p: Position): boolean {
  const lines = splitLines(text);
  return p.col >= (lines[p.line]?.length ?? 0);
}

export function isAtBufferEnd(text: string, p: Position): boolean {
  const lines = splitLines(text);
  return p.line === lines.length - 1 && isAtLineEnd(text, p);
}
