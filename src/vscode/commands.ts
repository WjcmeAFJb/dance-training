// vscode.commands.* polyfill.

import { Disposable } from "./primitives.ts";
import { runtime } from "./runtime.ts";
import type { TextEditor } from "./editor.ts";

export const commands = {
  registerCommand(id: string, handler: (...args: unknown[]) => unknown): Disposable {
    runtime.commands.set(id, handler);
    return new Disposable(() => runtime.commands.delete(id));
  },

  registerTextEditorCommand(
    id: string,
    handler: (editor: TextEditor, edit: unknown, ...args: unknown[]) => unknown,
  ): Disposable {
    runtime.textEditorCommands.set(
      id,
      handler as (editor: unknown, edit: unknown, ...args: unknown[]) => unknown,
    );
    return new Disposable(() => runtime.textEditorCommands.delete(id));
  },

  async executeCommand<T = unknown>(id: string, ...args: unknown[]): Promise<T | undefined> {
    runtime.onDidExecuteCommand.fire({ id, args });
    const cmd = runtime.commands.get(id);
    if (cmd) {
      return Promise.resolve(cmd(...args) as T | undefined);
    }
    const teCmd = runtime.textEditorCommands.get(id);
    if (teCmd && runtime.current?.vscodeEditor) {
      return Promise.resolve(
        teCmd(runtime.current.vscodeEditor as TextEditor, undefined, ...args) as T | undefined,
      );
    }
    // Built-in VS Code commands we map to direct Monaco calls. Coverage is
    // narrow on purpose — Dance only invokes a handful of these.
    const built = runtime.current ? BUILTIN_COMMANDS[id] : undefined;
    if (built) return Promise.resolve(built(args) as T | undefined);
    return undefined;
  },

  getCommands(_filterInternal?: boolean): Promise<string[]> {
    return Promise.resolve([...runtime.commands.keys(), ...runtime.textEditorCommands.keys()]);
  },
};

const BUILTIN_COMMANDS: Record<string, (args: unknown[]) => unknown> = {
  cursorDown: () => runtime.current?.monaco.trigger("polyfill", "cursorDown", null),
  cursorUp: () => runtime.current?.monaco.trigger("polyfill", "cursorUp", null),
  cursorLeft: () => runtime.current?.monaco.trigger("polyfill", "cursorLeft", null),
  cursorRight: () => runtime.current?.monaco.trigger("polyfill", "cursorRight", null),
  cursorHome: () => runtime.current?.monaco.trigger("polyfill", "cursorHome", null),
  cursorEnd: () => runtime.current?.monaco.trigger("polyfill", "cursorEnd", null),
  undo: () => runtime.current?.monaco.trigger("polyfill", "undo", null),
  redo: () => runtime.current?.monaco.trigger("polyfill", "redo", null),
  "editor.action.indentLines": () =>
    runtime.current?.monaco.trigger("polyfill", "editor.action.indentLines", null),
  "editor.action.outdentLines": () =>
    runtime.current?.monaco.trigger("polyfill", "editor.action.outdentLines", null),
};
