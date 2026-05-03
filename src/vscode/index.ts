// Aggregate vscode polyfill — what `import * as vscode from "vscode"` yields.

export {
  Position,
  Range,
  Selection,
  Disposable,
  EventEmitter,
  CancellationTokenSource,
  ThemeColor,
  ThemeIcon,
  Uri,
  type Event,
} from "./primitives.ts";
export {
  TextEditorCursorStyle,
  TextEditorLineNumbersStyle,
  TextEditorRevealType,
  EndOfLine,
  StatusBarAlignment,
  TreeItemCollapsibleState,
  DecorationRangeBehavior,
  TextEditorSelectionChangeKind,
  ConfigurationTarget,
  ViewColumn,
  TreeItem,
} from "./enums.ts";
export { TextDocument } from "./document.ts";
export { TextEditor, TextEditorEdit } from "./editor.ts";
export { commands } from "./commands.ts";
export { window } from "./window.ts";
export { workspace } from "./workspace.ts";

import { EventEmitter, Uri } from "./primitives.ts";
import dancePackageJson from "../../vendor/dance.package.json";

const _extensionsChange = new EventEmitter<unknown>();

interface FakeExtension {
  id: string;
  extensionUri: Uri;
  extensionPath: string;
  isActive: boolean;
  packageJSON: Record<string, unknown>;
  exports: unknown;
  activate(): Promise<unknown>;
}

const _danceExtension: FakeExtension = {
  id: "gregoire.dance",
  extensionUri: Uri.parse("dance:/"),
  extensionPath: "/",
  isActive: true,
  packageJSON: dancePackageJson as Record<string, unknown>,
  exports: undefined,
  activate(): Promise<unknown> {
    return Promise.resolve(undefined);
  },
};

export const extensions = {
  all: [_danceExtension] as FakeExtension[],
  getExtension(id: string): FakeExtension | undefined {
    if (id === _danceExtension.id || id.startsWith("gregoire.") || id === "dance")
      return _danceExtension;
    return undefined;
  },
  onDidChange: _extensionsChange.event,
};

export const env = {
  appName: "Dance Training",
  appRoot: "/",
  language: "en",
  remoteName: undefined as string | undefined,
  uriScheme: "https",
  clipboard: {
    async readText(): Promise<string> {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return "";
      }
    },
    async writeText(text: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* ignore */
      }
    },
  },
  openExternal(_uri: unknown): Promise<boolean> {
    return Promise.resolve(false);
  },
};

export const open = (uri: unknown): Promise<boolean> => env.openExternal(uri);

// Anything Dance still touches that we haven't covered: stub it.
export const tasks = {
  registerTaskProvider() {
    return { dispose() {} };
  },
};
export const debug = {
  registerDebugConfigurationProvider() {
    return { dispose() {} };
  },
};
export const languages = {
  registerHoverProvider() {
    return { dispose() {} };
  },
  registerCompletionItemProvider() {
    return { dispose() {} };
  },
  registerDocumentLinkProvider() {
    return { dispose() {} };
  },
  registerCodeActionsProvider() {
    return { dispose() {} };
  },
};
