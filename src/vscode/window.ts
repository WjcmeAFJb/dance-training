// vscode.window.* polyfill.

import { EventEmitter } from "./primitives.ts";
import { TextEditor } from "./editor.ts";
import { runtime } from "./runtime.ts";
import { TreeItem } from "./enums.ts";

export const window = {
  get activeTextEditor(): TextEditor | undefined {
    if (!runtime.current) return undefined;
    if (!runtime.current.vscodeEditor) {
      runtime.current.vscodeEditor = new TextEditor(runtime.current.monaco);
    }
    return runtime.current.vscodeEditor as TextEditor;
  },

  get visibleTextEditors(): TextEditor[] {
    const a = window.activeTextEditor;
    return a ? [a] : [];
  },

  onDidChangeActiveTextEditor: runtime.onDidChangeActiveTextEditor.event,
  onDidChangeTextEditorSelection: runtime.onDidChangeTextEditorSelection.event,
  onDidChangeTextEditorVisibleRanges: runtime.onDidChangeTextEditorVisibleRanges.event,
  onDidChangeVisibleTextEditors: runtime.onDidChangeVisibleTextEditors.event,

  showInformationMessage<T extends string>(
    _message: string,
    ..._items: T[]
  ): Promise<T | undefined> {
    return Promise.resolve(undefined);
  },
  showErrorMessage<T extends string>(_message: string, ..._items: T[]): Promise<T | undefined> {
    return Promise.resolve(undefined);
  },
  showWarningMessage<T extends string>(_message: string, ..._items: T[]): Promise<T | undefined> {
    return Promise.resolve(undefined);
  },

  showInputBox(_options?: unknown): Promise<string | undefined> {
    return runtime.inputBoxAdapter
      ? runtime.inputBoxAdapter("input", _options as { prompt?: string; placeHolder?: string })
      : Promise.resolve(undefined);
  },

  createInputBox() {
    const onSubmit = new EventEmitter<string>();
    const onHide = new EventEmitter<void>();
    let _value = "";
    const box = {
      get value() {
        return _value;
      },
      set value(v: string) {
        _value = v;
      },
      title: "",
      placeholder: "",
      prompt: "",
      onDidAccept: onSubmit.event,
      onDidChangeValue: new EventEmitter<string>().event,
      onDidHide: onHide.event,
      show() {
        const adapter = runtime.inputBoxAdapter;
        if (!adapter) return;
        void adapter("input", { prompt: box.prompt, placeHolder: box.placeholder }).then(
          (v: string | undefined) => {
            if (v !== undefined) {
              _value = v;
              onSubmit.fire(v);
            }
            onHide.fire();
          },
        );
      },
      hide() {
        onHide.fire();
      },
      dispose() {
        onSubmit.dispose();
        onHide.dispose();
      },
    };
    return box;
  },

  createQuickPick<T extends { label: string }>() {
    return {
      items: [] as T[],
      placeholder: "",
      title: "",
      onDidAccept: new EventEmitter<void>().event,
      onDidChangeSelection: new EventEmitter<readonly T[]>().event,
      onDidHide: new EventEmitter<void>().event,
      show() {},
      hide() {},
      dispose() {},
    };
  },

  showQuickPick<T>(): Promise<T | undefined> {
    return Promise.resolve(undefined);
  },

  showTextDocument(): Promise<TextEditor | undefined> {
    return Promise.resolve(window.activeTextEditor);
  },

  createStatusBarItem() {
    return {
      text: "",
      tooltip: "",
      command: "",
      alignment: 1,
      priority: 0,
      show() {},
      hide() {},
      dispose() {},
    };
  },

  createTextEditorDecorationType(_opts: unknown) {
    return { dispose() {} };
  },

  createTreeView<T>(_id: string, _options: { treeDataProvider: unknown }) {
    void _options;
    return {
      reveal(_item: T): Promise<void> {
        return Promise.resolve();
      },
      onDidChangeVisibility: new EventEmitter<{ visible: boolean }>().event,
      onDidChangeSelection: new EventEmitter<{ selection: T[] }>().event,
      visible: false,
      dispose() {},
    };
  },

  TreeItem,
};
