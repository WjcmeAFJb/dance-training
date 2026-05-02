// Monaco wrapper that:
//   1. Renders Monaco as a controlled component over `EditorState`
//   2. Captures keypresses, converts them to KeyChord, matches against the
//      user's bindings, and dispatches to our Dance emulator
//   3. Renders a prominent mode bar above the editor so the user always
//      knows whether keys go to commands or to text
//
// Important: we do NOT use Monaco's `readOnly` flag. In normal mode we
// instead intercept every key in our own keydown handler (preventing
// Monaco from acting on it). This keeps the cursor visible/blinking and
// lets the user click around — which feels much less broken than a
// read-only editor.

import { useEffect, useMemo, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor, IDisposable } from "monaco-editor";
import type { KeyChord, ResolvedBinding } from "../bindings/types.ts";
import { applyBinding, eventToChord, findMatchingBinding } from "./keypress.ts";
import { dispatch } from "./dance.ts";
import { stringifySequence } from "../bindings/parseKey.ts";
import type { EditorState, Range } from "./types.ts";
import { offsetOf, positionAt } from "./textOps.ts";
import { ModeBar } from "../ui/components/ModeBar.tsx";

interface MonacoBridgeProps {
  state: EditorState;
  bindings: readonly ResolvedBinding[];
  onChange: (s: EditorState) => void;
  onInsertText?: (text: string) => void;
  className?: string;
  height?: number | string;
}

export function MonacoBridge({
  state,
  bindings,
  onChange,
  onInsertText,
  className,
  height = 320,
}: MonacoBridgeProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const chordHistoryRef = useRef<KeyChord[]>([]);
  const [partialChord, setPartialChord] = useState<string>("");
  const stateRef = useRef(state);
  stateRef.current = state;
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
    syncSelectionsToMonaco(ed, state);
  };

  // Keep Monaco's text in sync when EditorState.text changes externally.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    if (ed.getValue() !== state.text) {
      ed.setValue(state.text);
    }
    syncSelectionsToMonaco(ed, state);
  }, [state]);

  // Wire keydown.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const disposers: IDisposable[] = [];
    const node = ed.getDomNode();
    if (!node) return;

    const onKeyDown = (ev: KeyboardEvent) => {
      const cur = stateRef.current;

      if (cur.mode === "insert") {
        // In insert mode, let Monaco handle text input. Only intercept Escape.
        if (ev.key === "Escape" || ev.code === "Escape") {
          ev.preventDefault();
          chordHistoryRef.current = [];
          setPartialChord("");
          onChangeRef.current(dispatch(cur, "dance.modes.set.normal"));
        }
        return;
      }

      // Normal/select/etc: intercept everything except real browser shortcuts
      // (cmd/ctrl-only navigation we don't own).
      if (isBrowserShortcut(ev)) return;

      const chord = eventToChord(ev);
      // Always block the default — in normal mode no key should reach Monaco.
      ev.preventDefault();
      ev.stopPropagation();

      const next = [...chordHistoryRef.current, chord];
      const result = findMatchingBinding(next, bindingsRef.current);
      if (result.match) {
        chordHistoryRef.current = [];
        setPartialChord("");
        onChangeRef.current(applyBinding(cur, result.match));
        return;
      }
      if (result.partial) {
        chordHistoryRef.current = next;
        setPartialChord(stringifySequence(next));
        return;
      }
      // Single-chord fallback: try common Kak defaults so users can still drive
      // the editor before they upload bindings.
      const fallback = matchKakDefault(chord);
      if (fallback) {
        chordHistoryRef.current = [];
        setPartialChord("");
        onChangeRef.current(dispatch(cur, fallback));
        return;
      }
      chordHistoryRef.current = [];
      setPartialChord("");
    };

    node.addEventListener("keydown", onKeyDown, true);
    disposers.push({
      dispose: () => node.removeEventListener("keydown", onKeyDown, true),
    });

    return () => disposers.forEach((d) => d.dispose());
  }, []);

  // Sync user mouse-clicks back into our selection model in normal mode.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const sub = ed.onMouseUp(() => {
      const cur = stateRef.current;
      if (cur.mode === "insert") return;
      const sels = ed.getSelections() ?? [];
      if (!sels.length) return;
      const next = sels.map<Range>((s) => ({
        anchor: { line: s.selectionStartLineNumber - 1, col: s.selectionStartColumn - 1 },
        active: { line: s.positionLineNumber - 1, col: s.positionColumn - 1 },
      }));
      // Inflate empty selections to one-cell-wide so the Kak invariant holds.
      const inflated = next.map((r) => {
        if (r.anchor.line === r.active.line && r.anchor.col === r.active.col) {
          const lines = cur.text.split("\n");
          const lineLen = lines[r.active.line]?.length ?? 0;
          if (r.active.col < lineLen) {
            return { anchor: r.anchor, active: { line: r.active.line, col: r.active.col + 1 } };
          }
          if (r.active.col > 0) {
            return { anchor: { line: r.active.line, col: r.active.col - 1 }, active: r.active };
          }
        }
        return r;
      });
      onChangeRef.current({ ...cur, selections: inflated });
    });
    return () => sub.dispose();
  }, []);

  const monacoOptions = useMemo<MonacoEditor.IStandaloneEditorConstructionOptions>(
    () => ({
      automaticLayout: true,
      fontFamily: 'JetBrains Mono, "Fira Code", ui-monospace, monospace',
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: false,
      renderLineHighlight: "all",
      cursorStyle: state.mode === "insert" ? "line" : "block",
      cursorBlinking: state.mode === "insert" ? "blink" : "smooth",
      cursorWidth: state.mode === "insert" ? 2 : 0,
      readOnly: false,
      tabSize: 2,
      smoothScrolling: true,
      contextmenu: false,
      occurrencesHighlight: "off",
      selectionHighlight: false,
      // Don't show Monaco's command palette / quick-suggestions; we own the keys.
      quickSuggestions: false,
      acceptSuggestionOnEnter: "off",
      theme: "vs-dark",
    }),
    [state.mode],
  );

  return (
    <div className={className}>
      <ModeBar
        mode={state.mode}
        {...(state.count !== undefined ? { count: state.count } : {})}
        {...(partialChord ? { partialChord } : {})}
        selectionsCount={state.selections.length}
      />
      <Editor
        height={height}
        language="markdown"
        value={state.text}
        options={monacoOptions}
        onMount={handleMount}
        onChange={(value) => {
          if (state.mode !== "insert" || value === undefined) return;
          const inserted = diffInserted(state.text, value);
          if (inserted) onInsertText?.(inserted);
          onChangeRef.current({ ...state, text: value });
        }}
        theme="vs-dark"
      />
    </div>
  );
}

function syncSelectionsToMonaco(ed: MonacoEditor.IStandaloneCodeEditor, state: EditorState) {
  if (!state.selections.length) return;
  ed.setSelections(
    state.selections.map((r) => ({
      selectionStartLineNumber: r.anchor.line + 1,
      selectionStartColumn: r.anchor.col + 1,
      positionLineNumber: r.active.line + 1,
      positionColumn: r.active.col + 1,
    })),
  );
}

function isBrowserShortcut(ev: KeyboardEvent): boolean {
  // Let the browser keep its own shortcuts (refresh, dev tools, copy-from-DOM,
  // tab/window cycling, find).
  const k = ev.key.toLowerCase();
  if ((ev.ctrlKey || ev.metaKey) && !ev.altKey) {
    if (["r", "t", "w", "n", "tab", "shift", "f5"].includes(k)) return true;
    if (k === "f" && ev.shiftKey) return true; // Cmd+Shift+F (browser find-in-tabs)
  }
  if (k === "f5" || k === "f11" || k === "f12") return true;
  return false;
}

function matchKakDefault(chord: KeyChord): string | undefined {
  if (chord.modifiers.length === 0 && chord.key.kind === "code") {
    switch (chord.key.code) {
      case "KeyH":
        return "dance.select.left.jump";
      case "KeyJ":
        return "dance.select.down.jump";
      case "KeyK":
        return "dance.select.up.jump";
      case "KeyL":
        return "dance.select.right.jump";
      case "KeyW":
        return "dance.seek.word";
      case "KeyB":
        return "dance.seek.word.backward";
      case "KeyE":
        return "dance.seek.wordEnd";
      case "KeyI":
        return "dance.modes.insert.before";
      case "KeyA":
        return "dance.modes.insert.after";
      case "KeyD":
        return "dance.edit.yank-delete";
      case "KeyC":
        return "dance.edit.yank-delete-insert";
      case "KeyY":
        return "dance.selections.saveText";
      case "KeyP":
        return "dance.edit.paste.after";
      case "KeyU":
        return "dance.history.undo";
      case "KeyX":
        return "dance.selections.expandToLines";
      case "Period":
        return "dance.history.repeat";
      case "Semicolon":
        return "dance.selections.reduce";
      case "Digit5":
        return "dance.select.buffer";
    }
  }
  if (chord.modifiers.length === 1 && chord.modifiers[0] === "shift" && chord.key.kind === "code") {
    switch (chord.key.code) {
      case "KeyI":
        return "dance.modes.insert.lineStart";
      case "KeyA":
        return "dance.modes.insert.lineEnd";
      case "KeyO":
        return "dance.edit.newLine.above.insert";
    }
  }
  return undefined;
}

function diffInserted(prev: string, next: string): string | undefined {
  if (next.length <= prev.length) return undefined;
  let i = 0;
  while (i < prev.length && prev[i] === next[i]) i++;
  return next.slice(i, i + (next.length - prev.length));
}

export type { EditorState };
export { offsetOf, positionAt };
