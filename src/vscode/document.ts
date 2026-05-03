// vscode.TextDocument backed by a Monaco model.

import type { editor as MonacoEditor } from "monaco-editor";
import { EndOfLine } from "./enums.ts";
import { Position, Range, Uri } from "./primitives.ts";

export class TextDocument {
  readonly uri: Uri;
  readonly languageId: string;
  readonly version: number = 1;
  readonly isUntitled = false;
  readonly isDirty = false;
  readonly isClosed = false;
  readonly notebook = undefined;

  constructor(public readonly model: MonacoEditor.ITextModel) {
    this.uri = Uri.parse(model.uri.toString());
    this.languageId = model.getLanguageId();
  }

  get fileName(): string {
    return this.uri.path;
  }
  get lineCount(): number {
    return this.model.getLineCount();
  }
  get eol(): EndOfLine {
    return this.model.getEOL() === "\r\n" ? EndOfLine.CRLF : EndOfLine.LF;
  }
  get encoding(): string {
    return "utf8";
  }

  save(): Promise<boolean> {
    return Promise.resolve(true);
  }

  lineAt(lineOrPosition: number | Position): TextLine {
    const line = lineOrPosition instanceof Position ? lineOrPosition.line : lineOrPosition;
    const monacoLine = line + 1;
    const text = this.model.getLineContent(monacoLine);
    const range = new Range(line, 0, line, text.length);
    const firstNonWs = text.search(/\S/);
    const rangeIncludingLineBreak =
      monacoLine === this.model.getLineCount() ? range : new Range(line, 0, line + 1, 0);
    return {
      lineNumber: line,
      text,
      range,
      rangeIncludingLineBreak,
      firstNonWhitespaceCharacterIndex: firstNonWs < 0 ? text.length : firstNonWs,
      isEmptyOrWhitespace: !/\S/.test(text),
    };
  }

  offsetAt(position: Position): number {
    return this.model.getOffsetAt({
      lineNumber: position.line + 1,
      column: position.character + 1,
    });
  }
  positionAt(offset: number): Position {
    const p = this.model.getPositionAt(offset);
    return new Position(p.lineNumber - 1, p.column - 1);
  }
  getText(range?: Range): string {
    if (!range) return this.model.getValue();
    return this.model.getValueInRange({
      startLineNumber: range.start.line + 1,
      startColumn: range.start.character + 1,
      endLineNumber: range.end.line + 1,
      endColumn: range.end.character + 1,
    });
  }
  getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined {
    const word = this.model.getWordAtPosition({
      lineNumber: position.line + 1,
      column: position.character + 1,
    });
    if (!word) return undefined;
    void regex;
    return new Range(position.line, word.startColumn - 1, position.line, word.endColumn - 1);
  }
  validateRange(range: Range): Range {
    const lineCount = this.lineCount;
    const start = this.validatePosition(range.start);
    const end = this.validatePosition(range.end);
    void lineCount;
    return new Range(start, end);
  }
  validatePosition(position: Position): Position {
    const lineCount = this.lineCount;
    if (position.line >= lineCount) {
      const last = lineCount - 1;
      const lastLen = this.lineAt(last).text.length;
      return new Position(last, lastLen);
    }
    if (position.line < 0) return new Position(0, 0);
    const lineLen = this.lineAt(position.line).text.length;
    return new Position(position.line, Math.min(position.character, lineLen));
  }
}

export interface TextLine {
  readonly lineNumber: number;
  readonly text: string;
  readonly range: Range;
  readonly rangeIncludingLineBreak: Range;
  readonly firstNonWhitespaceCharacterIndex: number;
  readonly isEmptyOrWhitespace: boolean;
}
