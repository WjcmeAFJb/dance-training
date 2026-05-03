// vscode.workspace.* polyfill.

import { runtime } from "./runtime.ts";
import { TextDocument } from "./document.ts";
import { Disposable, EventEmitter, Uri } from "./primitives.ts";
import { ConfigurationTarget } from "./enums.ts";

class Configuration {
  constructor(
    private readonly _section: string | undefined,
    private readonly _values: Record<string, unknown>,
  ) {}

  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const v = this._values[key];
    return v === undefined ? defaultValue : (v as T);
  }
  has(key: string): boolean {
    return key in this._values;
  }
  inspect<T>(key: string): {
    key: string;
    defaultValue?: T;
    globalValue?: T;
    workspaceValue?: T;
    workspaceFolderValue?: T;
  } {
    return { key, defaultValue: this._values[key] as T };
  }
  update(key: string, value: unknown, _target?: ConfigurationTarget | boolean): Promise<void> {
    this._values[key] = value;
    runtime.onDidChangeConfiguration.fire({
      affectsConfiguration: (s: string) => s === this._section,
    });
    return Promise.resolve();
  }
}

export const workspace = {
  get isTrusted(): boolean {
    return true;
  },

  get workspaceFolders(): Array<{ uri: Uri; name: string; index: number }> {
    return [];
  },

  get name(): string | undefined {
    return undefined;
  },

  getConfiguration(section?: string) {
    const root = section
      ? ((runtime.configuration[section] ?? (runtime.configuration[section] = {})) as Record<
          string,
          unknown
        >)
      : (runtime.configuration as unknown as Record<string, unknown>);
    return new Configuration(section, root);
  },

  onDidChangeConfiguration: runtime.onDidChangeConfiguration.event,
  onDidChangeTextDocument: runtime.onDidChangeTextDocument.event,
  onDidOpenTextDocument: runtime.onDidOpenTextDocument.event,
  onDidCloseTextDocument: runtime.onDidCloseTextDocument.event,
  onDidSaveTextDocument: new EventEmitter<TextDocument>().event,
  onDidChangeWorkspaceFolders: new EventEmitter<unknown>().event,

  openTextDocument(uri?: Uri | string): Promise<TextDocument | undefined> {
    void uri;
    const cur = runtime.current;
    if (!cur) return Promise.resolve(undefined);
    return Promise.resolve(new TextDocument(cur.monaco.getModel()!));
  },

  applyEdit(): Promise<boolean> {
    return Promise.resolve(false);
  },

  registerTextDocumentContentProvider(): Disposable {
    return new Disposable(() => {});
  },

  fs: {
    readFile(): Promise<Uint8Array> {
      return Promise.reject(new Error("filesystem unavailable in browser polyfill"));
    },
  },
};
