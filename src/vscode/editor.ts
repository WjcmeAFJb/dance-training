// vscode.TextEditor backed by a Monaco standalone code editor.

import type { editor as MonacoEditor } from "monaco-editor";
import { TextDocument } from "./document.ts";
import { Position, Range, Selection } from "./primitives.ts";
import {
  TextEditorCursorStyle,
  TextEditorLineNumbersStyle,
  TextEditorRevealType,
} from "./enums.ts";
import { runtime } from "./runtime.ts";

export interface TextEditorOptions {
  cursorStyle?: TextEditorCursorStyle;
  lineNumbers?: TextEditorLineNumbersStyle;
  insertSpaces?: boolean;
  tabSize?: number;
}

export class TextEditor {
  readonly document: TextDocument;
  options: TextEditorOptions;
  visibleRanges: Range[] = [];

  constructor(public readonly monaco: MonacoEditor.IStandaloneCodeEditor) {
    this.document = new TextDocument(monaco.getModel()!);
    this.options = {
      cursorStyle: TextEditorCursorStyle.Block,
      lineNumbers: TextEditorLineNumbersStyle.On,
      insertSpaces: true,
      tabSize: 2,
    };
  }

  get selection(): Selection {
    return this.selections[0]!;
  }
  set selection(sel: Selection) {
    this.selections = [sel];
  }

  get selections(): Selection[] {
    const monacoSels = this.monaco.getSelections() ?? [];
    return monacoSels.map(
      (s) =>
        new Selection(
          new Position(s.selectionStartLineNumber - 1, s.selectionStartColumn - 1),
          new Position(s.positionLineNumber - 1, s.positionColumn - 1),
        ),
    );
  }
  set selections(sels: readonly Selection[]) {
    this.monaco.setSelections(
      sels.map((s) => ({
        selectionStartLineNumber: s.anchor.line + 1,
        selectionStartColumn: s.anchor.character + 1,
        positionLineNumber: s.active.line + 1,
        positionColumn: s.active.character + 1,
      })),
    );
    runtime.onDidChangeTextEditorSelection.fire({
      textEditor: this,
      selections: sels,
      kind: 3, // Command
    });
  }

  edit(callback: (editBuilder: TextEditorEdit) => void): Promise<boolean> {
    const builder = new TextEditorEdit();
    callback(builder);
    const ops = builder.collect();
    if (ops.length === 0) return Promise.resolve(true);
    const monacoOps = ops.map((op) => {
      const range = {
        startLineNumber: op.range.start.line + 1,
        startColumn: op.range.start.character + 1,
        endLineNumber: op.range.end.line + 1,
        endColumn: op.range.end.character + 1,
      };
      return { range, text: op.kind === "delete" ? "" : op.text, forceMoveMarkers: true };
    });
    this.monaco.executeEdits("dance-vscode-polyfill", monacoOps);
    runtime.onDidChangeTextDocument.fire({
      document: this.document,
      contentChanges: ops.map((op) => ({
        range: op.range,
        rangeOffset: this.document.offsetAt(op.range.start),
        rangeLength: this.document.offsetAt(op.range.end) - this.document.offsetAt(op.range.start),
        text: op.kind === "delete" ? "" : op.text,
      })),
      reason: 0,
    });
    return Promise.resolve(true);
  }

  insertSnippet(): Promise<boolean> {
    return Promise.resolve(false);
  }

  setDecorations(): void {
    /* decorations are best-effort; no-op for now */
  }

  revealRange(range: Range, _revealType?: TextEditorRevealType): void {
    this.monaco.revealRange({
      startLineNumber: range.start.line + 1,
      startColumn: range.start.character + 1,
      endLineNumber: range.end.line + 1,
      endColumn: range.end.character + 1,
    });
  }

  show(): void {
    this.monaco.focus();
  }
  hide(): void {
    /* no-op */
  }

  get viewColumn(): number {
    return 1;
  }
}

interface DeleteOp {
  kind: "delete";
  range: Range;
}
interface InsertOp {
  kind: "insert";
  range: Range;
  text: string;
}
interface ReplaceOp {
  kind: "replace";
  range: Range;
  text: string;
}
type EditOp = DeleteOp | InsertOp | ReplaceOp;

export class TextEditorEdit {
  private readonly _ops: EditOp[] = [];

  insert(location: Position, value: string): void {
    this._ops.push({ kind: "insert", range: new Range(location, location), text: value });
  }
  delete(location: Range | Selection): void {
    this._ops.push({ kind: "delete", range: location });
  }
  replace(location: Range | Position | Selection, value: string): void {
    if (location instanceof Position) {
      this._ops.push({ kind: "replace", range: new Range(location, location), text: value });
    } else {
      this._ops.push({ kind: "replace", range: location, text: value });
    }
  }
  setEndOfLine(): void {
    /* no-op */
  }
  collect(): EditOp[] {
    return this._ops;
  }
}
