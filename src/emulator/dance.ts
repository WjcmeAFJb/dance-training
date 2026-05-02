// Minimal Dance command dispatcher.
//
// We don't implement every Dance command — just enough behaviour to drive lessons.
// Each handler is a pure function (state, args) → state. Unknown commands are
// recorded in the command log as no-ops; the verifier can still match on them.

import {
  clampPosition,
  isAtBufferEnd,
  joinLines,
  offsetOf,
  orderRange,
  positionAt,
  rangeText,
  replaceRange,
  splitLines,
} from "./textOps.ts";
import type { DanceMode, EditorState, Position, Range } from "./types.ts";

type Handler = (s: EditorState, args?: unknown) => EditorState;

const handlers: Record<string, Handler> = {};

export function dispatch(state: EditorState, id: string, args?: unknown): EditorState {
  const next: EditorState = {
    ...state,
    commandLog: [...state.commandLog, args === undefined ? { id } : { id, args }],
  };
  const h = handlers[id];
  if (!h) return next;
  return h(next, args);
}

// ── helpers ───────────────────────────────────────────────────────────────────

const move = (s: EditorState, fn: (r: Range) => Range): EditorState => ({
  ...s,
  selections: s.selections.map((r) => clampRange(s.text, fn(r))),
});

function clampRange(text: string, r: Range): Range {
  return { anchor: clampPosition(text, r.anchor), active: clampPosition(text, r.active) };
}

function reduceToCursor(r: Range): Range {
  return { anchor: { ...r.active }, active: { ...r.active } };
}

function offsetMove(text: string, p: Position, delta: number): Position {
  const off = offsetOf(text, p) + delta;
  return positionAt(text, Math.max(0, Math.min(off, text.length)));
}

// ── modes ─────────────────────────────────────────────────────────────────────

const setMode =
  (mode: DanceMode): Handler =>
  (s) => ({ ...s, mode });

handlers["dance.modes.set.normal"] = setMode("normal");
handlers["dance.modes.set.insert"] = setMode("insert");
handlers["dance.modes.set.select"] = setMode("select");
handlers["dance.modes.set.temporarily.insert"] = setMode("insert");
handlers["dance.modes.set.temporarily.normal"] = setMode("normal");

handlers["dance.modes.insert.before"] = (s) => ({
  ...s,
  mode: "insert",
  selections: s.selections.map((r) => {
    const { start } = orderRange(r);
    return { anchor: { ...start }, active: { ...start } };
  }),
});

handlers["dance.modes.insert.after"] = (s) => ({
  ...s,
  mode: "insert",
  selections: s.selections.map((r) => {
    const { end } = orderRange(r);
    return { anchor: { ...end }, active: { ...end } };
  }),
});

handlers["dance.modes.insert.lineStart"] = (s) => ({
  ...s,
  mode: "insert",
  selections: s.selections.map((r) => ({
    anchor: { line: r.active.line, col: 0 },
    active: { line: r.active.line, col: 0 },
  })),
});

handlers["dance.modes.insert.lineEnd"] = (s) => {
  const lines = splitLines(s.text);
  return {
    ...s,
    mode: "insert",
    selections: s.selections.map((r) => {
      const len = lines[r.active.line]?.length ?? 0;
      return {
        anchor: { line: r.active.line, col: len },
        active: { line: r.active.line, col: len },
      };
    }),
  };
};

// ── selection movement (Kak: select) ──────────────────────────────────────────
//
// The Kakoune model: most movements *jump*, replacing the selection with a new
// one of width 1 around the new cursor. Capital-letter variants *extend*.

handlers["dance.select.left.jump"] = (s) => move(s, (r) => oneCharLeft(s.text, r.active));
handlers["dance.select.right.jump"] = (s) => move(s, (r) => oneCharRight(s.text, r.active));
handlers["dance.select.up.jump"] = (s) => move(s, (r) => oneCharUp(s.text, r.active));
handlers["dance.select.down.jump"] = (s) => move(s, (r) => oneCharDown(s.text, r.active));

handlers["dance.select.left.extend"] = (s) =>
  move(s, (r) => extend(s.text, r, oneCharLeft(s.text, r.active).active));
handlers["dance.select.right.extend"] = (s) =>
  move(s, (r) => extend(s.text, r, oneCharRight(s.text, r.active).active));
handlers["dance.select.up.extend"] = (s) =>
  move(s, (r) => extend(s.text, r, oneCharUp(s.text, r.active).active));
handlers["dance.select.down.extend"] = (s) =>
  move(s, (r) => extend(s.text, r, oneCharDown(s.text, r.active).active));

function oneCharLeft(text: string, p: Position): Range {
  const start = offsetMove(text, p, -1);
  const end = clampPosition(text, p);
  return { anchor: end, active: start };
}
function oneCharRight(text: string, p: Position): Range {
  const start = clampPosition(text, p);
  const end = offsetMove(text, p, 1);
  return { anchor: start, active: end };
}
function oneCharUp(text: string, p: Position): Range {
  const targetLine = Math.max(0, p.line - 1);
  const lines = splitLines(text);
  const col = Math.min(p.col, lines[targetLine]?.length ?? 0);
  const active = { line: targetLine, col };
  return { anchor: { line: targetLine, col: Math.max(0, col - 1) }, active };
}
function oneCharDown(text: string, p: Position): Range {
  const lines = splitLines(text);
  const targetLine = Math.min(lines.length - 1, p.line + 1);
  const col = Math.min(p.col, lines[targetLine]?.length ?? 0);
  const active = { line: targetLine, col };
  return { anchor: { line: targetLine, col: Math.max(0, col - 1) }, active };
}

function extend(_text: string, r: Range, newActive: Position): Range {
  return { anchor: { ...r.anchor }, active: newActive };
}

// ── line movement & buffer ────────────────────────────────────────────────────

handlers["dance.select.lineStart"] = (s) =>
  move(s, (r) => ({
    anchor: { line: r.active.line, col: 0 },
    active: { line: r.active.line, col: r.active.col },
  }));

handlers["dance.select.lineEnd"] = (s) => {
  const lines = splitLines(s.text);
  return move(s, (r) => {
    const end = lines[r.active.line]?.length ?? 0;
    return {
      anchor: { line: r.active.line, col: r.active.col },
      active: { line: r.active.line, col: end },
    };
  });
};

handlers["dance.select.buffer"] = (s) => {
  const lines = splitLines(s.text);
  const lastLine = lines.length - 1;
  return {
    ...s,
    selections: [
      {
        anchor: { line: 0, col: 0 },
        active: { line: lastLine, col: lines[lastLine]?.length ?? 0 },
      },
    ],
  };
};

// ── word seek ────────────────────────────────────────────────────────────────
// Simple implementation matching Kak's "select-the-word-and-following-whitespace".

const WORD_RE = /[A-Za-z0-9_]/;

handlers["dance.seek.word"] = (s) => seekWord(s, true, false);
handlers["dance.seek.word.backward"] = (s) => seekWord(s, false, false);
handlers["dance.seek.wordEnd"] = (s) => seekWord(s, true, true);
handlers["dance.seek.word.extend"] = (s) => seekWord(s, true, false, true);
handlers["dance.seek.word.extend.backward"] = (s) => seekWord(s, false, false, true);
handlers["dance.seek.wordEnd.extend"] = (s) => seekWord(s, true, true, true);

function seekWord(s: EditorState, forward: boolean, end: boolean, extend = false): EditorState {
  return {
    ...s,
    selections: s.selections.map((r) => {
      const cursor = r.active;
      const newPos = walkWord(s.text, cursor, forward, end);
      return extend
        ? { anchor: r.anchor, active: newPos }
        : { anchor: forward ? { ...cursor } : newPos, active: forward ? newPos : { ...cursor } };
    }),
  };
}

function walkWord(text: string, from: Position, forward: boolean, end: boolean): Position {
  const lines = splitLines(text);
  let line = from.line;
  let col = from.col;
  const isWord = (c?: string) => !!c && WORD_RE.test(c);
  const charAt = (l: number, c: number) => lines[l]?.[c] ?? "";

  if (forward) {
    if (end) {
      // Skip whitespace, then advance to end of next word.
      while (line < lines.length && /\s/.test(charAt(line, col))) {
        col++;
        if (col > (lines[line]?.length ?? 0)) {
          line++;
          col = 0;
        }
      }
      while (line < lines.length && isWord(charAt(line, col))) {
        col++;
      }
      return clampPosition(text, { line, col });
    }
    // Advance through word, then through whitespace.
    while (line < lines.length && isWord(charAt(line, col))) col++;
    while (line < lines.length && /\s/.test(charAt(line, col))) {
      col++;
      if (col > (lines[line]?.length ?? 0)) {
        line++;
        col = 0;
      }
    }
    return clampPosition(text, { line, col });
  }
  // Backward.
  col--;
  while (line >= 0 && col >= 0 && /\s/.test(charAt(line, col))) col--;
  while (line >= 0 && col >= 0 && isWord(charAt(line, col))) col--;
  return clampPosition(text, { line, col: col + 1 });
}

// ── seek char (f / t) ─────────────────────────────────────────────────────────

handlers["dance.seek"] = (s, args) => seekChar(s, args, true, false);
handlers["dance.seek.included"] = (s, args) => seekChar(s, args, true, true);
handlers["dance.seek.backward"] = (s, args) => seekChar(s, args, false, false);
handlers["dance.seek.included.backward"] = (s, args) => seekChar(s, args, false, true);
handlers["dance.seek.extend"] = (s, args) => seekChar(s, args, true, false, true);
handlers["dance.seek.included.extend"] = (s, args) => seekChar(s, args, true, true, true);

function seekChar(
  s: EditorState,
  args: unknown,
  forward: boolean,
  included: boolean,
  extend = false,
): EditorState {
  const target = (args as { input?: string })?.input;
  if (!target) return s;
  return {
    ...s,
    selections: s.selections.map((r) => {
      const cursor = r.active;
      const idx = findChar(s.text, target[0] ?? "", cursor, forward);
      if (idx === undefined) return r;
      const newActive = positionAt(
        s.text,
        offsetOf(s.text, idx) + (included ? 1 : 0) - (forward ? 0 : 0),
      );
      return extend
        ? { anchor: r.anchor, active: newActive }
        : { anchor: cursor, active: newActive };
    }),
  };
}

function findChar(
  text: string,
  ch: string,
  from: Position,
  forward: boolean,
): Position | undefined {
  const off = offsetOf(text, from);
  if (forward) {
    const i = text.indexOf(ch, off + 1);
    if (i < 0) return undefined;
    return positionAt(text, i);
  }
  const i = text.lastIndexOf(ch, Math.max(0, off - 1));
  if (i < 0) return undefined;
  return positionAt(text, i);
}

// ── edit ──────────────────────────────────────────────────────────────────────

handlers["dance.edit.yank-delete"] = (s) => yankAndDelete(s, false);
handlers["dance.edit.yank-delete-insert"] = (s) => ({ ...yankAndDelete(s, false), mode: "insert" });
handlers["dance.edit.delete"] = (s) => yankAndDelete(s, true);
handlers["dance.edit.delete-insert"] = (s) => ({ ...yankAndDelete(s, true), mode: "insert" });

function yankAndDelete(s: EditorState, skipYank: boolean): EditorState {
  const yanked: string[] = [];
  let text = s.text;
  const sels = [...s.selections].sort(
    (a, b) => offsetOf(text, orderRange(b).start) - offsetOf(text, orderRange(a).start),
  );
  for (const r of sels) {
    yanked.unshift(rangeText(text, r));
    text = replaceRange(text, r, "");
  }
  const newRegs = skipYank
    ? s.registers
    : { ...s.registers, '"': yanked.length ? yanked : (s.registers['"'] ?? []) };
  return {
    ...s,
    text,
    registers: newRegs,
    selections: s.selections.map((r) => {
      const { start } = orderRange(r);
      const p = clampPosition(text, start);
      return { anchor: p, active: { line: p.line, col: p.col + 1 } };
    }),
  };
}

handlers["dance.selections.saveText"] = (s) => {
  const yanks = s.selections.map((r) => rangeText(s.text, r));
  return { ...s, registers: { ...s.registers, '"': yanks } };
};

handlers["dance.edit.paste.after"] = (s) => paste(s, true, false);
handlers["dance.edit.paste.before"] = (s) => paste(s, false, false);
handlers["dance.edit.paste.after.select"] = (s) => paste(s, true, true);
handlers["dance.edit.paste.before.select"] = (s) => paste(s, false, true);

function paste(s: EditorState, after: boolean, select: boolean): EditorState {
  const yanks = s.registers['"'] ?? [];
  if (!yanks.length) return s;
  let text = s.text;
  const newSels: Range[] = [];
  s.selections.forEach((r, i) => {
    const yank = yanks[i % yanks.length] ?? "";
    const insertPos = after ? orderRange(r).end : orderRange(r).start;
    const insertOff = offsetOf(text, insertPos);
    text = text.slice(0, insertOff) + yank + text.slice(insertOff);
    if (select) {
      const startPos = positionAt(text, insertOff);
      const endPos = positionAt(text, insertOff + yank.length);
      newSels.push({ anchor: startPos, active: endPos });
    } else {
      const cursor = positionAt(text, insertOff + (after ? yank.length : yank.length));
      newSels.push({ anchor: { ...cursor }, active: { line: cursor.line, col: cursor.col + 1 } });
    }
  });
  return { ...s, text, selections: newSels.length ? newSels : s.selections };
}

handlers["dance.edit.replaceCharacters"] = (s, args) => {
  const ch = (args as { input?: string })?.input ?? "";
  if (!ch) return s;
  let text = s.text;
  for (const r of [...s.selections].sort(
    (a, b) => offsetOf(s.text, orderRange(b).start) - offsetOf(s.text, orderRange(a).start),
  )) {
    const { start, end } = orderRange(r);
    const startOff = offsetOf(text, start);
    const endOff = offsetOf(text, end);
    let replaced = "";
    for (let i = startOff; i < endOff; i++) {
      replaced += text[i] === "\n" ? "\n" : ch;
    }
    text = text.slice(0, startOff) + replaced + text.slice(endOff);
  }
  return { ...s, text };
};

handlers["dance.edit.case.toLower"] = (s) => mapText(s, (t) => t.toLowerCase());
handlers["dance.edit.case.toUpper"] = (s) => mapText(s, (t) => t.toUpperCase());
handlers["dance.edit.case.swap"] = (s) =>
  mapText(s, (t) =>
    [...t].map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join(""),
  );

function mapText(s: EditorState, fn: (t: string) => string): EditorState {
  let text = s.text;
  for (const r of [...s.selections].sort(
    (a, b) => offsetOf(s.text, orderRange(b).start) - offsetOf(s.text, orderRange(a).start),
  )) {
    const part = rangeText(text, r);
    text = replaceRange(text, r, fn(part));
  }
  return { ...s, text };
}

handlers["dance.edit.newLine.below.insert"] = (s) => newLine(s, false, true);
handlers["dance.edit.newLine.above.insert"] = (s) => newLine(s, true, true);
handlers["dance.edit.newLine.below"] = (s) => newLine(s, false, false);
handlers["dance.edit.newLine.above"] = (s) => newLine(s, true, false);

function newLine(s: EditorState, above: boolean, insert: boolean): EditorState {
  let text = s.text;
  const lines = splitLines(text);
  let mode = s.mode;
  if (insert) mode = "insert";
  for (const r of [...s.selections].sort((a, b) =>
    above ? a.active.line - b.active.line : b.active.line - a.active.line,
  )) {
    const target = above ? r.active.line : r.active.line + 1;
    const indent = (lines[r.active.line] ?? "").match(/^\s*/)?.[0] ?? "";
    lines.splice(target, 0, indent);
  }
  text = joinLines(lines);
  return { ...s, text, mode };
}

handlers["dance.edit.join"] = (s) => {
  const lines = splitLines(s.text);
  const joined: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const cur = lines[i] ?? "";
    let merged = cur;
    let j = i + 1;
    while (j < lines.length && wantsJoin(s.selections, i, j)) {
      const next = (lines[j] ?? "").replace(/^\s+/, "");
      merged = merged.replace(/\s+$/, "") + " " + next;
      j++;
    }
    joined.push(merged);
    i = j;
  }
  return { ...s, text: joinLines(joined) };
};
function wantsJoin(sels: readonly Range[], i: number, j: number): boolean {
  return sels.some((r) => {
    const a = Math.min(r.anchor.line, r.active.line);
    const b = Math.max(r.anchor.line, r.active.line);
    return a <= i && j <= b + 1;
  });
}

handlers["dance.edit.indent"] = (s) => indentLines(s, +1);
handlers["dance.edit.deindent"] = (s) => indentLines(s, -1);

function indentLines(s: EditorState, dir: number): EditorState {
  const lines = splitLines(s.text);
  const touched = new Set<number>();
  for (const r of s.selections) {
    const a = Math.min(r.anchor.line, r.active.line);
    const b = Math.max(r.anchor.line, r.active.line);
    for (let l = a; l <= b; l++) touched.add(l);
  }
  for (const l of touched) {
    const cur = lines[l] ?? "";
    if (dir > 0) lines[l] = "  " + cur;
    else lines[l] = cur.replace(/^ {1,2}|\t/, "");
  }
  return { ...s, text: joinLines(lines) };
}

// ── selection-management helpers ──────────────────────────────────────────────

handlers["dance.selections.reduce"] = (s) => move(s, reduceToCursor);

handlers["dance.selections.changeDirection"] = (s) =>
  move(s, (r) => ({ anchor: { ...r.active }, active: { ...r.anchor } }));

handlers["dance.selections.expandToLines"] = (s) => {
  const lines = splitLines(s.text);
  return move(s, (r) => {
    const a = Math.min(r.anchor.line, r.active.line);
    const b = Math.max(r.anchor.line, r.active.line);
    return {
      anchor: { line: a, col: 0 },
      active: { line: b, col: lines[b]?.length ?? 0 },
    };
  });
};

handlers["dance.selections.trimWhitespace"] = (s) => move(s, (r) => trimRange(s.text, r, /\s/));
handlers["dance.selections.trimLines"] = (s) => move(s, (r) => trimRange(s.text, r, /[^\n]/));

function trimRange(text: string, r: Range, _nonTrim: RegExp): Range {
  // Keep simple: trim leading/trailing whitespace from the string view.
  const { start, end } = orderRange(r);
  const startOff = offsetOf(text, start);
  const endOff = offsetOf(text, end);
  let i = startOff;
  let j = endOff;
  while (i < j && /\s/.test(text[i] ?? "")) i++;
  while (j > i && /\s/.test(text[j - 1] ?? "")) j--;
  return { anchor: positionAt(text, i), active: positionAt(text, j) };
}

handlers["dance.history.undo"] = (s) => s; // emulator does not snapshot; lessons that need undo simulate manually.

// ── history.repeat ────────────────────────────────────────────────────────────

handlers["dance.history.repeat"] = (s) => {
  const last = [...s.commandLog].reverse().find((e) => e.id !== "dance.history.repeat");
  if (!last) return s;
  return dispatch(s, last.id, last.args);
};

// ── public helpers ────────────────────────────────────────────────────────────

export function isHandled(id: string): boolean {
  return id in handlers;
}

export function knownCommandIds(): string[] {
  return Object.keys(handlers).sort();
}

export function isAtBufferEndForState(s: EditorState): boolean {
  return s.selections.every((r) => isAtBufferEnd(s.text, r.active));
}
