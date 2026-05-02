// Canonical Kakoune normal-mode and insert-mode shortcut reference.
// Source: https://igor-ramazanov.github.io/ + Kakoune's docs/keys.asciidoc.
// Each entry is the *Kakoune* model — the Dance mapping is on DanceCommand.kak.

export type KakMode = "normal" | "insert" | "view" | "match" | "object" | "goto" | "user";

export type KakCategory =
  | "movement"
  | "selection"
  | "edit"
  | "search"
  | "object"
  | "register"
  | "macro"
  | "view"
  | "history"
  | "mode"
  | "multi-cursor"
  | "filter"
  | "command";

export interface KakAction {
  id: string;
  mode: KakMode;
  /** Default keystroke as Kak displays it: `t`, `<a-t>`, `<c-d>`, `gg`. */
  default: string;
  description: string;
  category: KakCategory;
  /** When set, Dance does not implement this action. */
  danceOnlyMissing?: boolean;
}

const a = (
  id: string,
  mode: KakMode,
  def: string,
  category: KakCategory,
  description: string,
  danceOnlyMissing = false,
): KakAction => {
  const result: KakAction = { id, mode, default: def, description, category };
  if (danceOnlyMissing) result.danceOnlyMissing = true;
  return result;
};

export const KAK_ACTIONS: readonly KakAction[] = [
  // ── movement (normal) ───────────────────────────────────────────────────
  a("kak.normal.select.left", "normal", "h", "movement", "select character on the left"),
  a("kak.normal.select.down", "normal", "j", "movement", "select character below"),
  a("kak.normal.select.up", "normal", "k", "movement", "select character above"),
  a("kak.normal.select.right", "normal", "l", "movement", "select character on the right"),
  a("kak.normal.select.left.extend", "normal", "H", "movement", "extend selection left"),
  a("kak.normal.select.down.extend", "normal", "J", "movement", "extend selection down"),
  a("kak.normal.select.up.extend", "normal", "K", "movement", "extend selection up"),
  a("kak.normal.select.right.extend", "normal", "L", "movement", "extend selection right"),

  a("kak.normal.seek.word.next", "normal", "w", "movement", "select to next word start"),
  a("kak.normal.seek.word.prev", "normal", "b", "movement", "select to previous word start"),
  a("kak.normal.seek.word.end", "normal", "e", "movement", "select to next word end"),
  a("kak.normal.seek.word.next.extend", "normal", "W", "movement", "extend to next word start"),
  a("kak.normal.seek.word.prev.extend", "normal", "B", "movement", "extend to previous word start"),
  a("kak.normal.seek.word.end.extend", "normal", "E", "movement", "extend to next word end"),
  a("kak.normal.seek.WORD.next", "normal", "<a-w>", "movement", "select to next WORD start"),
  a("kak.normal.seek.WORD.prev", "normal", "<a-b>", "movement", "select to previous WORD start"),
  a("kak.normal.seek.WORD.end", "normal", "<a-e>", "movement", "select to next WORD end"),

  a("kak.normal.seek.f.fwd", "normal", "f", "movement", "select to next char (included)"),
  a("kak.normal.seek.t.fwd", "normal", "t", "movement", "select to next char (excluded)"),
  a("kak.normal.seek.f.bwd", "normal", "<a-f>", "movement", "select to previous char (included)"),
  a("kak.normal.seek.t.bwd", "normal", "<a-t>", "movement", "select to previous char (excluded)"),
  a("kak.normal.seek.f.extend.fwd", "normal", "F", "movement", "extend to next char (included)"),
  a("kak.normal.seek.t.extend.fwd", "normal", "T", "movement", "extend to next char (excluded)"),
  a(
    "kak.normal.seek.f.extend.bwd",
    "normal",
    "<a-F>",
    "movement",
    "extend to previous char (included)",
  ),
  a(
    "kak.normal.seek.t.extend.bwd",
    "normal",
    "<a-T>",
    "movement",
    "extend to previous char (excluded)",
  ),

  a("kak.normal.seek.match.fwd", "normal", "m", "movement", "select to matching character"),
  a(
    "kak.normal.seek.match.bwd",
    "normal",
    "<a-m>",
    "movement",
    "select to previous matching character",
  ),
  a("kak.normal.seek.match.fwd.extend", "normal", "M", "movement", "extend to matching character"),
  a(
    "kak.normal.seek.match.bwd.extend",
    "normal",
    "<a-M>",
    "movement",
    "extend to previous matching character",
  ),

  a(
    "kak.normal.select.line.below",
    "normal",
    "x",
    "selection",
    "select line / extend to next line",
  ),
  a("kak.normal.select.line.extend", "normal", "X", "selection", "extend to next line"),
  a("kak.normal.select.line.above", "normal", "<a-x>", "selection", "trim to whole lines"),
  a("kak.normal.select.line.start", "normal", "<a-h>", "movement", "select to line start"),
  a("kak.normal.select.line.end", "normal", "<a-l>", "movement", "select to line end"),
  a("kak.normal.select.buffer", "normal", "%", "selection", "select whole buffer"),

  // ── goto submenu ────────────────────────────────────────────────────────
  a("kak.normal.goto", "normal", "g", "movement", "open goto menu"),
  a("kak.normal.goto.firstLine", "goto", "gg", "movement", "go to first line"),
  a("kak.normal.goto.lastLine", "goto", "ge", "movement", "go to last line"),
  a("kak.normal.goto.lineStart", "goto", "gh", "movement", "go to line start"),
  a("kak.normal.goto.lineStartIndent", "goto", "gi", "movement", "go to first non-blank on line"),
  a("kak.normal.goto.lineEnd", "goto", "gl", "movement", "go to line end"),
  a("kak.normal.goto.topVisible", "goto", "gt", "movement", "go to top visible line"),
  a("kak.normal.goto.bottomVisible", "goto", "gb", "movement", "go to bottom visible line"),
  a("kak.normal.goto.middleVisible", "goto", "gc", "movement", "go to middle visible line"),
  a("kak.normal.goto.fileBuffer", "goto", "gf", "movement", "go to file under selection", true),
  a("kak.normal.goto.lastBuffer", "goto", "ga", "movement", "switch to last buffer", true),

  // ── search ──────────────────────────────────────────────────────────────
  a("kak.normal.search.forward", "normal", "/", "search", "search forward"),
  a("kak.normal.search.backward", "normal", "<a-/>", "search", "search backward"),
  a("kak.normal.search.forward.extend", "normal", "?", "search", "search forward (extend)"),
  a("kak.normal.search.backward.extend", "normal", "<a-?>", "search", "search backward (extend)"),
  a("kak.normal.search.next", "normal", "n", "search", "select next match"),
  a("kak.normal.search.prev", "normal", "<a-n>", "search", "select previous match"),
  a("kak.normal.search.next.add", "normal", "N", "search", "add next match to selections"),
  a("kak.normal.search.prev.add", "normal", "<a-N>", "search", "add previous match to selections"),
  a("kak.normal.search.selection", "normal", "*", "search", "use selection as search pattern"),
  a("kak.normal.search.selection.smart", "normal", "<a-*>", "search", "use selection (smart-case)"),

  // ── insert ──────────────────────────────────────────────────────────────
  a("kak.normal.insert.before", "normal", "i", "edit", "insert before selection"),
  a("kak.normal.insert.after", "normal", "a", "edit", "insert after selection"),
  a("kak.normal.insert.lineStart", "normal", "I", "edit", "insert at line start (skip blanks)"),
  a("kak.normal.insert.lineEnd", "normal", "A", "edit", "insert at line end"),
  a("kak.normal.edit.newLine.below.insert", "normal", "o", "edit", "open new line below + insert"),
  a("kak.normal.edit.newLine.above.insert", "normal", "O", "edit", "open new line above + insert"),
  a("kak.normal.edit.newLine.below", "normal", "<a-o>", "edit", "open new line below"),
  a("kak.normal.edit.newLine.above", "normal", "<a-O>", "edit", "open new line above"),

  // ── delete / change / yank / paste / replace ────────────────────────────
  a("kak.normal.edit.yank.delete", "normal", "d", "edit", "yank + delete selection"),
  a("kak.normal.edit.delete", "normal", "<a-d>", "edit", "delete selection (no yank)"),
  a("kak.normal.edit.yank.delete.insert", "normal", "c", "edit", "yank + delete + insert"),
  a("kak.normal.edit.delete.insert", "normal", "<a-c>", "edit", "delete + insert (no yank)"),
  a("kak.normal.selections.yank", "normal", "y", "edit", "yank selections"),
  a("kak.normal.edit.paste.after", "normal", "p", "edit", "paste after selection"),
  a("kak.normal.edit.paste.before", "normal", "P", "edit", "paste before selection"),
  a("kak.normal.edit.pasteAll.after", "normal", "<a-p>", "edit", "paste all after selection"),
  a("kak.normal.edit.pasteAll.before", "normal", "<a-P>", "edit", "paste all before selection"),
  a("kak.normal.edit.yank.replace", "normal", "R", "edit", "replace selection with yank"),
  a("kak.normal.edit.replace", "normal", "r", "edit", "replace each char in selection"),
  a("kak.normal.edit.repeat", "normal", ".", "edit", "repeat last insert change"),
  a("kak.normal.edit.join", "normal", "<a-j>", "edit", "join lines"),
  a(
    "kak.normal.edit.join.select",
    "normal",
    "<a-J>",
    "edit",
    "join lines and select inserted spaces",
  ),

  // ── case / indent / align ───────────────────────────────────────────────
  a("kak.normal.edit.case.lower", "normal", "`", "edit", "lowercase selection"),
  a("kak.normal.edit.case.upper", "normal", "~", "edit", "uppercase selection"),
  a("kak.normal.edit.case.swap", "normal", "<a-`>", "edit", "swap case of selection"),
  a("kak.normal.edit.indent", "normal", ">", "edit", "indent lines"),
  a("kak.normal.edit.indent.full", "normal", "<a->>", "edit", "indent including empty lines"),
  a("kak.normal.edit.deindent.full", "normal", "<", "edit", "deindent (drop incomplete indent)"),
  a("kak.normal.edit.deindent", "normal", "<a-<>", "edit", "deindent (preserve incomplete indent)"),
  a("kak.normal.edit.align", "normal", "&", "edit", "align selection cursors with spaces"),
  a("kak.normal.edit.copyIndent", "normal", "<a-&>", "edit", "copy main indent to all selections"),
  a("kak.normal.edit.tabExpand", "normal", "@", "edit", "convert tabs↔spaces in selection", true),

  // ── multi-cursor / selections ───────────────────────────────────────────
  a(
    "kak.normal.selections.split.regex",
    "normal",
    "S",
    "multi-cursor",
    "split selections on regex",
  ),
  a(
    "kak.normal.selections.select.regex",
    "normal",
    "s",
    "multi-cursor",
    "create selections from regex matches inside selection",
  ),
  a(
    "kak.normal.selections.split.lines",
    "normal",
    "<a-s>",
    "multi-cursor",
    "split selections on line boundaries",
  ),
  a("kak.normal.selections.keepMain", "normal", ",", "multi-cursor", "keep only main selection"),
  a("kak.normal.selections.removeMain", "normal", "<a-,>", "multi-cursor", "remove main selection"),
  a(
    "kak.normal.selections.filterKeep",
    "normal",
    "<a-k>",
    "filter",
    "keep selections matching regex",
  ),
  a(
    "kak.normal.selections.filterDrop",
    "normal",
    "<a-K>",
    "filter",
    "drop selections matching regex",
  ),
  a(
    "kak.normal.selections.copy.below",
    "normal",
    "C",
    "multi-cursor",
    "copy selection on the line below",
  ),
  a(
    "kak.normal.selections.copy.above",
    "normal",
    "<a-C>",
    "multi-cursor",
    "copy selection on the line above",
  ),
  a(
    "kak.normal.selections.merge",
    "normal",
    "<a-_>",
    "multi-cursor",
    "merge contiguous selections",
  ),
  a("kak.normal.selections.rotate", "normal", ")", "multi-cursor", "rotate selections"),
  a(
    "kak.normal.selections.rotate.reverse",
    "normal",
    "(",
    "multi-cursor",
    "rotate selections backwards",
  ),
  a(
    "kak.normal.selections.rotate.contents",
    "normal",
    "<a-)>",
    "multi-cursor",
    "rotate selection contents",
  ),
  a(
    "kak.normal.selections.rotate.contents.reverse",
    "normal",
    "<a-(>",
    "multi-cursor",
    "rotate selection contents backwards",
  ),
  a(
    "kak.normal.selections.flipDirection",
    "normal",
    "<a-;>",
    "multi-cursor",
    "flip selection direction",
  ),
  a(
    "kak.normal.selections.faceForward",
    "normal",
    "<a-:>",
    "multi-cursor",
    "ensure selections face forward",
  ),
  a("kak.normal.selections.reduce", "normal", ";", "multi-cursor", "reduce selections to cursor"),
  a(
    "kak.normal.selections.expand",
    "normal",
    "x",
    "selection",
    "expand to whole lines (alias of x in line context)",
  ),
  a(
    "kak.normal.selections.trim.whitespace",
    "normal",
    "_",
    "selection",
    "trim whitespace from selections",
  ),
  a(
    "kak.normal.selections.trim.lines",
    "normal",
    "<a-x>",
    "selection",
    "trim partial lines from selections",
  ),
  a(
    "kak.normal.selections.pipe.replace",
    "normal",
    "|",
    "command",
    "pipe selections through shell",
  ),
  a(
    "kak.normal.selections.pipe.append",
    "normal",
    "<a-!>",
    "command",
    "shell command output appended",
  ),
  a(
    "kak.normal.selections.pipe.insert",
    "normal",
    "!",
    "command",
    "shell command output inserted before",
  ),
  a(
    "kak.normal.selections.pipeIgnore",
    "normal",
    "<a-|>",
    "command",
    "pipe selection through shell, discard output",
    true,
  ),

  // ── object menu ─────────────────────────────────────────────────────────
  a("kak.normal.seek.object.outer", "normal", "<a-a>", "object", "select outer object"),
  a("kak.normal.seek.object.inner", "normal", "<a-i>", "object", "select inner object"),

  // ── view menu ───────────────────────────────────────────────────────────
  a("kak.normal.view.line", "normal", "v", "view", "open view menu (center, scroll, etc.)"),
  a("kak.normal.view.lock", "normal", "V", "view", "lock view menu open"),

  // ── history ─────────────────────────────────────────────────────────────
  a("kak.normal.history.undo", "normal", "u", "history", "undo"),
  a("kak.normal.history.redo", "normal", "U", "history", "redo"),
  a("kak.normal.history.undo.selections", "normal", "<a-u>", "history", "undo selection change"),
  a("kak.normal.history.redo.selections", "normal", "<a-U>", "history", "redo selection change"),
  a("kak.normal.history.repeat", "normal", ".", "history", "repeat last change"),
  a("kak.normal.history.repeat.edit", "normal", ".", "history", "repeat last edit"),
  a("kak.normal.history.repeat.seek", "normal", "<a-.>", "history", "repeat last seek"),

  // ── macros ──────────────────────────────────────────────────────────────
  a("kak.normal.macro.start", "normal", "Q", "macro", "start recording macro"),
  a("kak.normal.macro.stop", "normal", "Q", "macro", "stop recording macro"),
  a("kak.normal.macro.play", "normal", "q", "macro", "replay macro"),

  // ── registers ───────────────────────────────────────────────────────────
  a("kak.normal.register.select", "normal", '"', "register", "use register for next command"),
  a("kak.normal.register.insert", "insert", "<c-r>", "register", "insert content of register"),
  a("kak.normal.selections.save", "normal", "Z", "register", "save selections to register"),
  a("kak.normal.selections.restore", "normal", "z", "register", "restore selections from register"),

  // ── modes ───────────────────────────────────────────────────────────────
  a("kak.normal.mode.insert", "normal", "i", "mode", "enter insert mode"),
  a("kak.normal.mode.normal", "insert", "<esc>", "mode", "leave insert / return to normal"),
  a("kak.insert.escape-once", "insert", "<a-;>", "mode", "escape to normal for one command"),
] as const;

export const KAK_BY_ID: ReadonlyMap<string, KakAction> = new Map(KAK_ACTIONS.map((k) => [k.id, k]));

export function getKakAction(id: string): KakAction | undefined {
  return KAK_BY_ID.get(id);
}
