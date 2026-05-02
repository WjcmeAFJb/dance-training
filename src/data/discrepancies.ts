// Curated list of known semantic differences between Kakoune and Dance.
// Lessons reference these by id so the same explanation appears wherever it's relevant.
//
// When a discrepancy applies to a Kak action, the action page in Coverage links to it,
// and any lesson that touches the action surfaces the callout.

export type DiscrepancyKind =
  | "semantics"
  | "arguments"
  | "mode-side-effect"
  | "ui"
  | "missing-in-dance"
  | "kak-only";

export interface Discrepancy {
  id: string;
  kind: DiscrepancyKind;
  /** Optional kak action id this attaches to. */
  kak?: string;
  /** Optional dance command id this attaches to. */
  dance?: string;
  title: string;
  body: string;
}

export const DISCREPANCIES: readonly Discrepancy[] = [
  {
    id: "disc.selection.shape",
    kind: "ui",
    dance: "dance.modes.set.normal",
    title: "Selection cursor shape differs",
    body: "Kakoune draws a block cursor anchored on a cell. Dance uses VS Code's caret (a thin vertical bar) by default. The active end of the selection is still where edits happen — there's no behavioural difference, only visual.",
  },
  {
    id: "disc.register.default",
    kind: "semantics",
    kak: "kak.normal.selections.yank",
    dance: "dance.selections.saveText",
    title: "Default register is the system clipboard",
    body: 'Yanks (`y`) and pastes (`p`/`P`) go through the OS clipboard in Dance, while Kakoune keeps an internal `"` register. Anything you yank inside VS Code can be pasted into another app and vice-versa.',
  },
  {
    id: "disc.pipe.shell",
    kind: "semantics",
    kak: "kak.normal.selections.pipe.replace",
    dance: "dance.selections.pipe.replace",
    title: "Pipe is an expression, not a shell command",
    body: "In Kakoune `|` runs a shell command and replaces the selection with its stdout. In Dance the prompt accepts a JavaScript expression (or a `#cmd` shell escape, or a `/regex/`). The variable `$` holds the current selection text and `i` its index.",
  },
  {
    id: "disc.linenumbers",
    kind: "mode-side-effect",
    dance: "dance.modes.set.normal",
    title: "Mode toggles line-numbers configuration",
    body: "By default Dance flips the `editor.lineNumbers` setting when switching modes (relative in normal, absolute in insert). Kakoune does no such thing. Disable it via `dance.modes` if you find the flicker distracting.",
  },
  {
    id: "disc.macro.q",
    kind: "ui",
    kak: "kak.normal.macro.start",
    dance: "dance.history.recording.start",
    title: "Recording UI differs",
    body: "Kakoune binds record/stop to `q` (different uppercase semantics). Dance exposes three separate commands: `dance.history.recording.start`, `.stop`, `.play`. Most users bind `q` and `Q` to start/stop and play, like Kak.",
  },
  {
    id: "disc.objects.tree",
    kind: "semantics",
    kak: "kak.normal.seek.object.inner",
    dance: "dance.seek.askObject.inner",
    title: "Tree-sitter syntax objects (experimental)",
    body: "Kakoune's `<a-i>` family uses regex-based pairs. Dance ships an experimental tree-sitter object set under `dance.seek.syntax.*` that picks the AST node under your selection — much sharper for code, but requires VS Code's syntax tree.",
  },
  {
    id: "disc.search.case",
    kind: "semantics",
    kak: "kak.normal.search.forward",
    dance: "dance.search",
    title: "No smart-case by default",
    body: "Kakoune's `/` is smart-case if the option is on. Dance's `/` runs the input as a JS regex. Use `dance.search.selection.smart` (`<a-*>` by default) to get smart-case-from-selection behaviour.",
  },
  {
    id: "disc.tabstop.@",
    kind: "kak-only",
    kak: "kak.normal.edit.tabExpand",
    title: "`@` (tab/space conversion) has no Dance command",
    body: "Kakoune's `@` walks each selection and rewrites tabs ↔ spaces according to the current tab-stop. Dance ships nothing equivalent. Use VS Code's `editor.action.indentationToSpaces` and friends instead.",
  },
  {
    id: "disc.history.selections",
    kind: "semantics",
    kak: "kak.normal.history.undo.selections",
    dance: "dance.history.undo.selections",
    title: "Selection history is independent",
    body: "Both editors keep a separate history for selections vs. text. The keystrokes (`<a-u>` / `<a-U>`) match by default; the underlying implementations are different, and rare edge cases — multi-step macros recorded across selection changes — can desync between them.",
  },
  {
    id: "disc.gf-ga.kak-only",
    kind: "kak-only",
    kak: "kak.normal.goto.fileBuffer",
    title: "`gf` / `ga` have no native Dance equivalents",
    body: "`gf` (open file under selection) and `ga` (alternate buffer) aren't in Dance's command list. The closest matches are VS Code's built-ins `editor.action.revealDefinition` and `workbench.action.openPreviousRecentlyUsedEditor`, which you can fold into `dance.run`.",
  },
  {
    id: "disc.pipeIgnore",
    kind: "kak-only",
    kak: "kak.normal.selections.pipeIgnore",
    title: "`<a-|>` (pipe and discard output) is Kak-only",
    body: "Kakoune's `<a-|>` runs a shell command per selection and discards its output. Dance has no direct equivalent — call `dance.run` with `child_process.exec` or use a VS Code task instead.",
  },
];

export const DISCREPANCY_BY_ID: ReadonlyMap<string, Discrepancy> = new Map(
  DISCREPANCIES.map((d) => [d.id, d]),
);
