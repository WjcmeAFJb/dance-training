// Mutable singletons that hold the live state of the polyfill: the active
// Monaco editor, the registered commands, configuration, etc. Imported by
// every other module so they all see the same runtime.

import type { editor as MonacoEditor } from "monaco-editor";
import { EventEmitter } from "./primitives.ts";

export interface BoundEditor {
  monaco: MonacoEditor.IStandaloneCodeEditor;
  // Lazily-built Polyfill TextEditor wrapping the Monaco editor.
  vscodeEditor?: unknown;
}

export interface Runtime {
  current: BoundEditor | undefined;
  readonly onDidChangeActiveTextEditor: EventEmitter<unknown>;
  readonly onDidChangeTextDocument: EventEmitter<unknown>;
  readonly onDidChangeConfiguration: EventEmitter<unknown>;
  readonly onDidChangeTextEditorSelection: EventEmitter<unknown>;
  readonly onDidChangeTextEditorVisibleRanges: EventEmitter<unknown>;
  readonly onDidChangeVisibleTextEditors: EventEmitter<unknown>;
  readonly onDidOpenTextDocument: EventEmitter<unknown>;
  readonly onDidCloseTextDocument: EventEmitter<unknown>;
  readonly onDidExecuteCommand: EventEmitter<{ id: string; args: unknown[] }>;
  readonly commands: Map<string, (...args: unknown[]) => unknown>;
  readonly textEditorCommands: Map<
    string,
    (editor: unknown, edit: unknown, ...args: unknown[]) => unknown
  >;
  configuration: Record<string, Record<string, unknown>>;
  inputBoxAdapter?: (
    kind: "input",
    opts?: { prompt?: string; placeHolder?: string },
  ) => Promise<string | undefined>;
}

export const runtime: Runtime = {
  current: undefined,
  onDidChangeActiveTextEditor: new EventEmitter(),
  onDidChangeTextDocument: new EventEmitter(),
  onDidChangeConfiguration: new EventEmitter(),
  onDidChangeTextEditorSelection: new EventEmitter(),
  onDidChangeTextEditorVisibleRanges: new EventEmitter(),
  onDidChangeVisibleTextEditors: new EventEmitter(),
  onDidOpenTextDocument: new EventEmitter(),
  onDidCloseTextDocument: new EventEmitter(),
  onDidExecuteCommand: new EventEmitter(),
  commands: new Map(),
  textEditorCommands: new Map(),
  configuration: {
    dance: {
      enabled: true,
      defaultMode: "normal",
      modes: {},
      menus: {},
    },
  },
};
