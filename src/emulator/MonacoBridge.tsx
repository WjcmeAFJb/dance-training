// Monaco wrapper that:
//   1. Renders Monaco as a controlled component over `EditorState`
//   2. Captures keypresses, converts them to KeyChord, matches against the
//      user's bindings, and dispatches to our Dance emulator
//   3. Exposes lifecycle hooks for the lesson runtime to drive verifier passes

import { useEffect, useMemo, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor, IDisposable } from "monaco-editor";
import type { ResolvedBinding } from "../bindings/types.ts";
import type { KeyChord } from "../bindings/types.ts";
import { applyBinding, eventToChord, findMatchingBinding } from "./keypress.ts";
import { dispatch } from "./dance.ts";
import type { EditorState, Range } from "./types.ts";
import { offsetOf, positionAt } from "./textOps.ts";

interface MonacoBridgeProps {
  state: EditorState;
  bindings: readonly ResolvedBinding[];
  onChange: (s: EditorState) => void;
  /** Called when the user types text in insert mode. */
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
  const stateRef = useRef(state);
  stateRef.current = state;
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;

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
          onChange(dispatch(cur, "dance.modes.set.normal"));
        }
        return;
      }
      // Don't swallow ctrl+r (browser refresh) and friends — only act on chords
      // that actually look like editor input.
      if (ev.metaKey && !ev.shiftKey && !ev.altKey && (ev.key === "r" || ev.key === "R")) return;
      const chord = eventToChord(ev);
      const next = [...chordHistoryRef.current, chord];
      const result = findMatchingBinding(next, bindingsRef.current);
      if (result.match) {
        ev.preventDefault();
        chordHistoryRef.current = [];
        onChange(applyBinding(cur, result.match));
        return;
      }
      if (result.partial) {
        ev.preventDefault();
        chordHistoryRef.current = next;
        return;
      }
      // Single-char fallback: try common Kak defaults so unbound users still see
      // motion on h/j/k/l, f/t, etc.
      const fallback = matchKakDefault(chord);
      if (fallback) {
        ev.preventDefault();
        chordHistoryRef.current = [];
        onChange(dispatch(cur, fallback));
        return;
      }
      chordHistoryRef.current = [];
    };

    node.addEventListener("keydown", onKeyDown, true);
    disposers.push({ dispose: () => node.removeEventListener("keydown", onKeyDown, true) });

    return () => disposers.forEach((d) => d.dispose());
  }, [onChange]);

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
      cursorBlinking: state.mode === "insert" ? "blink" : "solid",
      readOnly: state.mode !== "insert",
      tabSize: 2,
      smoothScrolling: true,
      theme: "vs-dark",
    }),
    [state.mode],
  );

  return (
    <Editor
      {...(className !== undefined ? { className } : {})}
      height={height}
      language="markdown"
      value={state.text}
      options={monacoOptions}
      onMount={handleMount}
      onChange={(value) => {
        if (state.mode !== "insert" || value === undefined) return;
        const inserted = diffInserted(state.text, value);
        if (inserted) onInsertText?.(inserted);
        onChange({ ...state, text: value });
      }}
      theme="vs-dark"
    />
  );
}

function syncSelectionsToMonaco(ed: MonacoEditor.IStandaloneCodeEditor, state: EditorState) {
  if (!state.selections.length) return;
  const monaco = (window as unknown as { monaco?: typeof import("monaco-editor") }).monaco;
  if (!monaco) return;
  const sels = state.selections.map<Range>((r) => r);
  ed.setSelections(
    sels.map((r) => ({
      selectionStartLineNumber: r.anchor.line + 1,
      selectionStartColumn: r.anchor.col + 1,
      positionLineNumber: r.active.line + 1,
      positionColumn: r.active.col + 1,
    })),
  );
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
        if (chord.modifiers.length === 0) return "dance.select.buffer";
        return undefined;
    }
  }
  return undefined;
}

function diffInserted(prev: string, next: string): string | undefined {
  if (next.length <= prev.length) return undefined;
  // Find common prefix.
  let i = 0;
  while (i < prev.length && prev[i] === next[i]) i++;
  return next.slice(i, i + (next.length - prev.length));
}

export type { EditorState };

// Re-export helpers used by the lesson runner.
export { offsetOf, positionAt };
