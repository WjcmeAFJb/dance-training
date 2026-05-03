// Monaco wrapper.
//
// Key interception is wired via Monaco's own `editor.onKeyDown` API, INSIDE
// the `OnMount` callback. The earlier version attached a DOM listener from a
// `useEffect([])` — but Monaco loads asynchronously, so when the effect ran
// `editorRef.current` was still null and the listener was never attached.
// Result: the editor felt fully "live" and just inserted characters even
// though the mode bar said NORMAL.
//
// Monaco's `onKeyDown` fires before the textarea's input event. Calling
// `e.preventDefault()` + `e.stopPropagation()` on it prevents both the
// browser-default character insertion and Monaco's command dispatch.

import { useEffect, useMemo, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor, IDisposable } from "monaco-editor";
import type { KeyChord, ResolvedBinding } from "../bindings/types.ts";
import { applyBinding, eventToChord, findMatchingBinding } from "./keypress.ts";
import { dispatch } from "./dance.ts";
import { stringifySequence } from "../bindings/parseKey.ts";
import type { EditorState } from "./types.ts";
import { offsetOf, positionAt } from "./textOps.ts";
import { ModeBar } from "../ui/components/ModeBar.tsx";
import { CommandPrompt, type PromptKind } from "../ui/components/CommandPrompt.tsx";

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
  const disposablesRef = useRef<IDisposable[]>([]);
  const [partialChord, setPartialChord] = useState<string>("");
  const [prompt, setPrompt] = useState<{ kind: PromptKind; commandId: string } | null>(null);

  // Keep refs to the latest props so handlers attached during onMount always
  // see fresh values without re-subscription.
  const stateRef = useRef(state);
  stateRef.current = state;
  const bindingsRef = useRef(bindings);
  bindingsRef.current = bindings;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onInsertTextRef = useRef(onInsertText);
  onInsertTextRef.current = onInsertText;

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
    syncSelectionsToMonaco(ed, stateRef.current);
    ed.focus();

    // 1. Key handler — Monaco's own API; fires before textarea input.
    const keyDownDispose = ed.onKeyDown((e) => {
      const cur = stateRef.current;

      // Insert mode: let Monaco handle text input. Only intercept Escape.
      if (cur.mode === "insert") {
        if (e.code === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          chordHistoryRef.current = [];
          setPartialChord("");
          onChangeRef.current(dispatch(cur, "dance.modes.set.normal"));
        }
        return;
      }

      // Normal / select / object / etc.: we own every key, except a small set
      // of true browser shortcuts.
      if (isBrowserShortcut(e)) return;

      // Block Monaco from doing anything with this key.
      e.preventDefault();
      e.stopPropagation();

      const chord = eventToChord({
        code: e.code,
        key: e.browserEvent.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      });

      // Built-in colon / pipe / search prompts — open a one-line CommandPrompt.
      const promptKind = matchPromptKind(chord);
      if (promptKind) {
        chordHistoryRef.current = [];
        setPartialChord("");
        setPrompt(promptKind);
        return;
      }

      const next = [...chordHistoryRef.current, chord];
      const result = findMatchingBinding(next, bindingsRef.current, cur.mode);
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
      // No exact / partial match: try the bare-char chord built from the OS
      // layout's translation of the physical key (so a `t` binding fires when
      // the user's Colemak OS produces a `t`).
      if (chord.key.kind === "code") {
        const charChord: KeyChord = {
          modifiers: chord.modifiers,
          key: { kind: "char", char: e.browserEvent.key.toLowerCase() },
        };
        const charNext = [...chordHistoryRef.current, charChord];
        const charResult = findMatchingBinding(charNext, bindingsRef.current, cur.mode);
        if (charResult.match) {
          chordHistoryRef.current = [];
          setPartialChord("");
          onChangeRef.current(applyBinding(cur, charResult.match));
          return;
        }
        if (charResult.partial) {
          chordHistoryRef.current = charNext;
          setPartialChord(stringifySequence(charNext));
          return;
        }
      }
      // Final fallback: built-in Kak defaults so users without uploaded
      // bindings can still drive the editor.
      const fallback = matchKakDefault(chord);
      if (fallback) {
        chordHistoryRef.current = [];
        setPartialChord("");
        onChangeRef.current(dispatch(cur, fallback));
        return;
      }
      chordHistoryRef.current = [];
      setPartialChord("");
    });

    // 2. Mouse-up: sync Monaco's clicked-to position back into our state so
    //    the user can position the cursor with the mouse. We inflate to one
    //    cell wide to keep the Kak invariant.
    const mouseUpDispose = ed.onMouseUp(() => {
      const cur = stateRef.current;
      if (cur.mode === "insert") return;
      const sels = ed.getSelections() ?? [];
      if (!sels.length) return;
      const next = sels.map((s) => ({
        anchor: { line: s.selectionStartLineNumber - 1, col: s.selectionStartColumn - 1 },
        active: { line: s.positionLineNumber - 1, col: s.positionColumn - 1 },
      }));
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

    disposablesRef.current.push(keyDownDispose, mouseUpDispose);
  };

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];
    };
  }, []);

  // Keep Monaco's text in sync when EditorState.text changes externally.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    if (ed.getValue() !== state.text) {
      ed.setValue(state.text);
    }
    syncSelectionsToMonaco(ed, state);
  }, [state]);

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
      // Hide Monaco's own cursor in normal-mode-style modes — the selection
      // highlight already shows the active cell, and a separate block caret
      // sits *after* the highlighted character (a real Monaco quirk that
      // looks like a visual glitch). In insert mode use a normal blinking
      // line caret.
      cursorStyle: state.mode === "insert" ? "line" : "line",
      cursorBlinking: state.mode === "insert" ? "blink" : "solid",
      cursorWidth: state.mode === "insert" ? 2 : 0,
      readOnly: false,
      tabSize: 2,
      smoothScrolling: true,
      contextmenu: false,
      occurrencesHighlight: "off",
      selectionHighlight: false,
      quickSuggestions: false,
      acceptSuggestionOnEnter: "off",
      theme: "vs-dark",
    }),
    [state.mode],
  );

  return (
    <div className={cn(className, "relative")}>
      <ModeBar
        mode={state.mode}
        {...(state.count !== undefined ? { count: state.count } : {})}
        {...(partialChord ? { partialChord } : {})}
        selectionsCount={state.selections.length}
      />
      {prompt && (
        <CommandPrompt
          kind={prompt.kind}
          onSubmit={(input) => {
            const cmd = prompt.commandId;
            setPrompt(null);
            onChangeRef.current(dispatch(stateRef.current, cmd, { input }));
          }}
          onCancel={() => setPrompt(null)}
        />
      )}
      <Editor
        height={height}
        language="markdown"
        value={state.text}
        options={monacoOptions}
        onMount={handleMount}
        onChange={(value) => {
          if (stateRef.current.mode !== "insert" || value === undefined) return;
          const inserted = diffInserted(stateRef.current.text, value);
          if (inserted) onInsertTextRef.current?.(inserted);
          onChangeRef.current({ ...stateRef.current, text: value });
        }}
        theme="vs-dark"
      />
    </div>
  );
}

function cn(...xs: (string | undefined | false | null)[]): string {
  return xs.filter(Boolean).join(" ");
}

function matchPromptKind(chord: KeyChord): { kind: PromptKind; commandId: string } | undefined {
  if (chord.modifiers.length === 0 && chord.key.kind === "char") {
    if (chord.key.char === ":") return { kind: "colon", commandId: "dance.colon" };
    if (chord.key.char === "|") return { kind: "pipe", commandId: "dance.selections.pipe.replace" };
    if (chord.key.char === "!") return { kind: "pipe.prepend", commandId: "dance.selections.pipe" };
    if (chord.key.char === "/") return { kind: "search", commandId: "dance.search" };
    if (chord.key.char === "?") return { kind: "search", commandId: "dance.search.extend" };
  }
  if (chord.modifiers.length === 1 && chord.modifiers[0] === "alt" && chord.key.kind === "char") {
    if (chord.key.char === "|") return { kind: "pipe", commandId: "dance.selections.pipe.append" };
    if (chord.key.char === "!")
      return { kind: "pipe.append", commandId: "dance.selections.pipe.append" };
  }
  return undefined;
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

interface MonacoKbEventLike {
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  browserEvent: { key: string };
}

function isBrowserShortcut(e: MonacoKbEventLike): boolean {
  const k = e.browserEvent.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && !e.altKey) {
    if (["r", "t", "w", "n", "tab", "f5"].includes(k)) return true;
    if (k === "f" && e.shiftKey) return true;
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
