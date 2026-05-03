// Loads the vendored Dance extension once, registers our Monaco editor as the
// active vscode TextEditor, and exposes a thin façade so our React layer can
// drive Dance commands and observe their effects.

import type { editor as MonacoEditor } from "monaco-editor";
import { runtime } from "../vscode/runtime.ts";
import { TextEditor } from "../vscode/editor.ts";
import { commands as vscodeCommands } from "../vscode/commands.ts";

let activatedPromise: Promise<void> | undefined;

interface ExtensionContext {
  subscriptions: { dispose(): void }[];
  globalState: { get(): unknown; update(): Promise<void> };
  workspaceState: { get(): unknown; update(): Promise<void> };
  extensionUri: { path: string };
  extensionPath: string;
  asAbsolutePath(p: string): string;
}

const dummyContext: ExtensionContext = {
  subscriptions: [],
  globalState: { get: () => undefined, update: () => Promise.resolve() },
  workspaceState: { get: () => undefined, update: () => Promise.resolve() },
  extensionUri: { path: "/" },
  extensionPath: "/",
  asAbsolutePath: (p) => p,
};

async function activate(): Promise<void> {
  if (activatedPromise) return activatedPromise;
  activatedPromise = (async () => {
    const mod = (await import("../../vendor/dance.js")) as {
      activate?: (ctx: ExtensionContext) => unknown;
      default?: { activate?: (ctx: ExtensionContext) => unknown };
    };
    const activateFn = mod.activate ?? mod.default?.activate;
    if (typeof activateFn !== "function") {
      throw new Error(`dance bundle has no activate(); exports: ${Object.keys(mod).join(",")}`);
    }
    await activateFn(dummyContext);
  })();
  return activatedPromise;
}

export interface DanceHostHandle {
  /** Execute a registered Dance command (e.g. "dance.select.left.jump"). */
  exec(id: string, args?: unknown): Promise<unknown>;
  /** Subscribe to every executed command — used by the lesson narrator. */
  onCommand(handler: (e: { id: string; args: unknown[] }) => void): () => void;
  /** Current live TextEditor instance (or undefined if Monaco hasn't mounted). */
  activeEditor(): TextEditor | undefined;
}

/**
 * Bind a Monaco editor as the singleton "active text editor" for Dance,
 * activate the extension once, and return a handle the React layer can use.
 */
export async function bindMonaco(
  monaco: MonacoEditor.IStandaloneCodeEditor,
): Promise<DanceHostHandle> {
  // Tear down any prior binding.
  if (runtime.current && runtime.current.monaco !== monaco) {
    runtime.current = undefined;
  }
  runtime.current = { monaco };
  // Materialise the TextEditor right away so Dance sees it.
  runtime.current.vscodeEditor = new TextEditor(monaco);
  runtime.onDidChangeActiveTextEditor.fire(runtime.current.vscodeEditor);

  // Wire Monaco's selection changes into our event bus.
  monaco.onDidChangeCursorSelection((e) => {
    runtime.onDidChangeTextEditorSelection.fire({
      textEditor: runtime.current?.vscodeEditor,
      selections: (runtime.current?.vscodeEditor as TextEditor | undefined)?.selections ?? [],
      kind: e.source === "mouse" ? 2 : 1,
    });
  });
  monaco.onDidChangeModelContent(() => {
    runtime.onDidChangeTextDocument.fire({
      document: (runtime.current?.vscodeEditor as TextEditor | undefined)?.document,
      contentChanges: [],
      reason: 0,
    });
  });

  await activate();

  return {
    exec(id: string, args?: unknown): Promise<unknown> {
      return vscodeCommands.executeCommand(id, args);
    },
    onCommand(handler) {
      const dispose = runtime.onDidExecuteCommand.event(handler);
      return () => dispose.dispose();
    },
    activeEditor(): TextEditor | undefined {
      return runtime.current?.vscodeEditor as TextEditor | undefined;
    },
  };
}
