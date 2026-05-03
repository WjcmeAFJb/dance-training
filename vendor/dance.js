var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
  };
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};

// src/api/types.ts
var Direction, Shift, SelectionBehavior, Forward, Backward, Jump, Select, Extend;
var init_types = __esm({
  "src/api/types.ts"() {
    "use strict";
    Direction = /* @__PURE__ */ ((Direction2) => {
      Direction2[(Direction2["Forward"] = 1)] = "Forward";
      Direction2[(Direction2["Backward"] = -1)] = "Backward";
      return Direction2;
    })(Direction || {});
    Shift = /* @__PURE__ */ ((Shift2) => {
      Shift2[(Shift2["Jump"] = 0)] = "Jump";
      Shift2[(Shift2["Select"] = 1)] = "Select";
      Shift2[(Shift2["Extend"] = 2)] = "Extend";
      return Shift2;
    })(Shift || {});
    SelectionBehavior = /* @__PURE__ */ ((SelectionBehavior2) => {
      SelectionBehavior2[(SelectionBehavior2["Caret"] = 1)] = "Caret";
      SelectionBehavior2[(SelectionBehavior2["Character"] = 2)] = "Character";
      return SelectionBehavior2;
    })(SelectionBehavior || {});
    Forward = 1 /* Forward */;
    Backward = -1 /* Backward */;
    Jump = 0 /* Jump */;
    Select = 1 /* Select */;
    Extend = 2 /* Extend */;
  },
});

// src/utils/errors.ts
import * as vscode from "vscode";
function assert(condition) {
  if (!condition) {
    const error = new Error(
      "internal assertion failed; please report this error on https://github.com/71/dance/issues. its stacktrace is available in the developer console (Command Palette > Open Developer Tools).",
    );
    console.error(error);
    throw error;
  }
}
var EmptySelectionsError,
  ArgumentError,
  InputError,
  NotASelectionError,
  EditorRequiredError,
  CancellationError,
  LengthMismatchError,
  EditNotAppliedError;
var init_errors = __esm({
  "src/utils/errors.ts"() {
    "use strict";
    EmptySelectionsError = class _EmptySelectionsError extends Error {
      constructor(message = "no selections remain") {
        super(message);
      }
      /**
       * Throws if the given selections are empty.
       */
      static throwIfEmpty(selections3) {
        if (selections3.length === 0) {
          throw new _EmptySelectionsError();
        }
      }
      /**
       * Throws if the selections of the given register are empty.
       */
      static throwIfRegisterIsEmpty(selections3, registerName) {
        if (selections3 === void 0 || selections3.length === 0) {
          throw new _EmptySelectionsError(`no selections are saved in register "${registerName}"`);
        }
      }
    };
    ArgumentError = class _ArgumentError extends Error {
      constructor(message, argumentName) {
        super(message);
        this.argumentName = argumentName;
      }
      static validate(argumentName, condition, message) {
        if (!condition) {
          if (typeof message === "function") {
            message = message();
          }
          throw new _ArgumentError(message, argumentName);
        }
      }
    };
    InputError = class extends ArgumentError {
      constructor(message) {
        super(message, "input");
      }
      static validateInput(condition, message) {
        if (!condition) {
          throw new this(message);
        }
      }
    };
    NotASelectionError = class _NotASelectionError extends ArgumentError {
      constructor(value2) {
        super("value is not a selection");
        this.value = value2;
      }
      /**
       * Throws if the given value is not a `vscode.Selection`.
       */
      static throwIfNotASelection(value2) {
        if (!(value2 instanceof vscode.Selection)) {
          throw new _NotASelectionError(value2);
        }
      }
      /**
       * Throws if the given list contains a value that is not a `vscode.Selection`,
       * or if the list is empty.
       */
      static throwIfNotASelectionArray(value2) {
        if (!Array.isArray(value2) || value2.length === 0) {
          throw new EmptySelectionsError();
        }
        for (let i = 0, len = value2.length; i < len; i++) {
          _NotASelectionError.throwIfNotASelection(value2[i]);
        }
      }
    };
    EditorRequiredError = class _EditorRequiredError extends Error {
      constructor() {
        super("active editor required");
      }
      static throwUnlessAvailable(editorState) {
        if (editorState === void 0) {
          throw new _EditorRequiredError();
        }
      }
    };
    CancellationError = class _CancellationError extends Error {
      constructor(reason) {
        super(reason);
        this.reason = reason;
      }
      static throwIfCancellationRequested(token) {
        if (token.isCancellationRequested) {
          throw new _CancellationError(_CancellationError.Reason.CancellationToken);
        }
      }
    };
    ((CancellationError2) => {
      let Reason;
      ((Reason2) => {
        Reason2["CancellationToken"] = "cancellation token was used";
        Reason2["PressedEscape"] = "user pressed <escape>";
      })((Reason = CancellationError2.Reason || (CancellationError2.Reason = {})));
    })(CancellationError || (CancellationError = {}));
    LengthMismatchError = class _LengthMismatchError extends Error {
      constructor() {
        super("length mismatch");
      }
      static throwIfLengthMismatch(a, b) {
        if (a.length !== b.length) {
          throw new _LengthMismatchError();
        }
      }
    };
    EditNotAppliedError = class _EditNotAppliedError extends Error {
      constructor() {
        super("TextEditor edit failed");
      }
      /**
       * Throws if the given value is `false`.
       */
      static throwIfNotApplied(editWasApplied) {
        if (!editWasApplied) {
          throw new _EditNotAppliedError();
        }
      }
    };
  },
});

// src/utils/misc.ts
import * as vscode2 from "vscode";
async function performDummyEdit(editor) {
  await editor.edit((editBuilder) => editBuilder.delete(dummyRange), dummyUndoStops);
}
function unsafeSelections(editor) {
  return editor.selections;
}
var noUndoStops, dummyPosition, dummyRange, dummyUndoStops;
var init_misc = __esm({
  "src/utils/misc.ts"() {
    "use strict";
    noUndoStops = Object.freeze({ undoStopBefore: false, undoStopAfter: false });
    dummyPosition = new vscode2.Position(0, 0);
    dummyRange = new vscode2.Range(dummyPosition, dummyPosition);
    dummyUndoStops = Object.freeze({ undoStopBefore: false, undoStopAfter: true });
  },
});

// src/api/context.ts
import * as vscode3 from "vscode";
function text(ranges) {
  const document = Context.current.document;
  if (Array.isArray(ranges)) {
    return ranges.map((range) => document.getText(range));
  }
  return document.getText(ranges);
}
async function edit(f, editor) {
  if (editor !== void 0) {
    let value2;
    const succeeded = await editor.edit(
      (editBuilder) => (value2 = f(editBuilder, editor.selections, editor.document)),
      noUndoStops,
    );
    EditNotAppliedError.throwIfNotApplied(succeeded);
    return value2;
  }
  return Context.current.edit(f);
}
function insertUndoStop(editor) {
  if (editor !== void 0) {
    return performDummyEdit(editor);
  }
  return Context.current.insertUndoStop();
}
function selectionsToCharacterMode(selections3, document) {
  const characterModeSelections = [];
  for (const selection3 of selections3) {
    const selectionActive = selection3.active,
      selectionActiveLine = selectionActive.line,
      selectionActiveCharacter = selectionActive.character,
      selectionAnchor = selection3.anchor,
      selectionAnchorLine = selectionAnchor.line,
      selectionAnchorCharacter = selectionAnchor.character;
    let active2 = selectionActive,
      anchor2 = selectionAnchor,
      changed = false;
    if (selectionAnchorLine === selectionActiveLine) {
      if (selectionAnchorCharacter + 1 === selectionActiveCharacter) {
        active2 = selectionAnchor;
        changed = true;
      } else if (selectionAnchorCharacter - 1 === selectionActiveCharacter) {
        anchor2 = selectionActive;
        changed = true;
      } else if (selectionAnchorCharacter < selectionActiveCharacter) {
        active2 = new vscode3.Position(selectionActiveLine, selectionActiveCharacter - 1);
        changed = true;
      } else {
      }
    } else if (selectionAnchorLine < selectionActiveLine) {
      if (selectionActiveCharacter > 0) {
        active2 = new vscode3.Position(selectionActiveLine, selectionActiveCharacter - 1);
        changed = true;
      } else {
        if (document === void 0) {
          document = Context.current.document;
        }
        const activePrevLine = selectionActiveLine - 1,
          activePrevLineLength = document.lineAt(activePrevLine).text.length;
        active2 = new vscode3.Position(activePrevLine, activePrevLineLength);
        changed = true;
      }
    } else if (
      selectionAnchorLine === selectionActiveLine + 1 &&
      selectionAnchorCharacter === 0 &&
      selectionActiveCharacter ===
        (document ?? (document = Context.current.document)).lineAt(selectionActiveLine).text.length
    ) {
      anchor2 = selectionActive;
      changed = true;
    } else {
    }
    characterModeSelections.push(changed ? new vscode3.Selection(anchor2, active2) : selection3);
  }
  return characterModeSelections;
}
function selectionsFromCharacterMode(selections3, document) {
  const caretModeSelections = [];
  for (const selection3 of selections3) {
    const selectionActive = selection3.active,
      selectionActiveLine = selectionActive.line,
      selectionActiveCharacter = selectionActive.character,
      selectionAnchor = selection3.anchor,
      selectionAnchorLine = selectionAnchor.line,
      selectionAnchorCharacter = selectionAnchor.character;
    let active2 = selectionActive,
      changed = false;
    const isEmptyOrForwardFacing =
      selectionAnchorLine < selectionActiveLine ||
      (selectionAnchorLine === selectionActiveLine &&
        selectionAnchorCharacter <= selectionActiveCharacter);
    if (isEmptyOrForwardFacing) {
      if (document === void 0) {
        document = Context.current.document;
      }
      const lineLength = document.lineAt(selectionActiveLine).text.length;
      if (selectionActiveCharacter === lineLength) {
        if (selectionActiveLine + 1 < document.lineCount) {
          active2 = new vscode3.Position(selectionActiveLine + 1, 0);
          changed = true;
        } else {
        }
      } else {
        active2 = new vscode3.Position(selectionActiveLine, selectionActiveCharacter + 1);
        changed = true;
      }
    }
    caretModeSelections.push(
      changed ? new vscode3.Selection(selectionAnchor, active2) : selection3,
    );
  }
  return caretModeSelections;
}
var currentContext, ContextWithoutActiveEditor, _Context, Context;
var init_context = __esm({
  "src/api/context.ts"() {
    "use strict";
    init_types();
    init_errors();
    init_misc();
    ContextWithoutActiveEditor = class {
      constructor(extension2, cancellationToken, commandDescriptor) {
        this.extension = extension2;
        this.cancellationToken = cancellationToken;
        this.commandDescriptor = commandDescriptor;
        this._flags = 0 /* None */;
        if (currentContext?._flags ?? 0 & 2 /* DoNotRecord */) {
          this._flags |= 2 /* DoNotRecord */;
        }
      }
      /**
       * Returns the current execution context, or throws an error if called outside
       * of an execution context.
       */
      static get current() {
        if (currentContext === void 0) {
          throw new Error("attempted to access context object outside of execution context");
        }
        return currentContext;
      }
      /**
       * Returns the current execution context, or `undefined` if called outside of
       * an execution context.
       */
      static get currentOrUndefined() {
        return currentContext;
      }
      /**
       * Equivalent to calling `wrap` on `Context.current`. If there is no current
       * context, it returns the `thenable` directly.
       */
      static wrap(thenable) {
        return this.currentOrUndefined?.wrap(thenable) ?? thenable;
      }
      /**
       * Equivalent to calling `then` on the current context. If there is no current
       * context, it returns the `thenable.then` directly.
       */
      static then(thenable, onFulfilled, onRejected) {
        return (
          this.currentOrUndefined?.then(thenable, onFulfilled, onRejected) ??
          thenable.then(onFulfilled, onRejected)
        );
      }
      /**
       * Equivalent to calling `setup` on the current context.
       */
      static setup() {
        return this.current.setup();
      }
      /**
       * Returns a new context whose cancellation is controlled by the specified
       * cancellation token.
       */
      withCancellationToken(cancellationToken) {
        return new Context.WithoutActiveEditor(
          this.extension,
          cancellationToken,
          this.commandDescriptor,
        );
      }
      /**
       * Whether commands executed within this context should be recorded.
       */
      shouldRecord() {
        return (this._flags & 2) /* DoNotRecord */ === 0;
      }
      /**
       * Indicates that commands executed within this context should not be
       * recorded.
       */
      doNotRecord() {
        this._flags |= 2 /* DoNotRecord */;
        return this;
      }
      /**
       * Creates a new promise that executes within the current context.
       */
      createPromise(executor) {
        return this.wrap(new Promise(executor));
      }
      /**
       * Runs the given function within the current context.
       */
      run(f) {
        const previousContext = currentContext;
        if (previousContext === this) {
          return f(this);
        }
        currentContext = this;
        try {
          return f(this);
        } finally {
          currentContext = previousContext;
        }
      }
      /**
       * Runs the given async function within the current context.
       */
      async runAsync(f) {
        const previousContext = currentContext;
        if (previousContext === this) {
          return f(this);
        }
        currentContext = this;
        try {
          return await f(this);
        } finally {
          currentContext = previousContext;
        }
      }
      /**
       * Returns a promise whose continuations will be wrapped in a way that
       * preserves the current context.
       *
       * Await a call to `setup` in an async function to make ensure that all
       * subsequent `await` expressions preserve the current context.
       */
      setup() {
        return this.wrap(Promise.resolve());
      }
      /**
       * Wraps the given promise in a way that preserves the current context in
       * `then`.
       */
      wrap(thenable) {
        return {
          then: (onFulfilled, onRejected) => {
            return this.then(thenable, onFulfilled, onRejected);
          },
        };
      }
      /**
       * Wraps the continuation of a promise in order to preserve the current
       * context.
       */
      then(thenable, onFulfilled, onRejected) {
        if (onFulfilled !== void 0) {
          const f = onFulfilled;
          onFulfilled = (value2) => this.runAsync(() => f(value2));
        }
        if (onRejected !== void 0) {
          const f = onRejected;
          onRejected = (reason) => this.runAsync(() => f(reason));
        }
        return this.wrap(thenable.then(onFulfilled, onRejected));
      }
    };
    _Context = class _Context extends ContextWithoutActiveEditor {
      constructor(state, cancellationToken, commandDescriptor) {
        super(state.extension, cancellationToken, commandDescriptor);
        this._document = state.editor.document;
        this._editor = state.editor;
        this._mode = state.mode;
      }
      /**
       * Returns the current execution context, or throws an error if called outside
       * of an execution context or if the execution context does not have an
       * active editor.
       */
      static get current() {
        if (!(currentContext instanceof _Context)) {
          throw new Error("current context does not have an active text editor");
        }
        return currentContext;
      }
      /**
       * Returns the current execution context, or `undefined` if called outside of
       * an execution context or if the execution context does not have an active
       * editor.
       */
      static get currentOrUndefined() {
        if (currentContext === void 0 || !(currentContext instanceof _Context)) {
          return void 0;
        }
        return currentContext;
      }
      static assert(context) {
        if (!(context instanceof _Context)) {
          throw new Error("current context does not have an active text editor");
        }
      }
      /**
       * Returns a {@link Context} or {@link Context.WithoutActiveEditor} depending
       * on whether there is an active text editor.
       */
      static create(extension2, command6) {
        const activeEditorState = extension2.editors.active,
          cancellationToken = extension2.cancellationToken;
        return activeEditorState === void 0
          ? new _Context.WithoutActiveEditor(extension2, cancellationToken, command6)
          : new _Context(activeEditorState, cancellationToken, command6);
      }
      /**
       * Returns a {@link Context} or throws an exception if there is no active text
       * editor.
       */
      static createWithActiveTextEditor(extension2, command6) {
        const activeEditorState = extension2.editors.active;
        EditorRequiredError.throwUnlessAvailable(activeEditorState);
        return new _Context(activeEditorState, extension2.cancellationToken, command6);
      }
      /**
       * The current `vscode.TextDocument`.
       */
      get document() {
        return this._document;
      }
      /**
       * The current `vscode.TextEditor`.
       *
       * Avoid accessing `editor.selections` -- selections may need to be
       * transformed before being returned or updated, which is why
       * `context.selections` should be preferred.
       */
      get editor() {
        return this._editor;
      }
      /**
       * The `Mode` associated with the current `vscode.TextEditor`.
       */
      get mode() {
        return this._mode;
      }
      /**
       * The selection behavior for this context.
       */
      get selectionBehavior() {
        return this._mode.selectionBehavior;
      }
      /**
       * The current selections.
       *
       * Selections returned by this property **may be different** from the ones
       * returned by `editor.selections`. If the current selection behavior is
       * `Character`, strictly forward-facing (i.e. `active > anchor`) selections
       * will be made longer by one character.
       */
      get selections() {
        const editor = this.editor;
        if (this.selectionBehavior === 2 /* Character */) {
          return selectionsFromCharacterMode(editor.selections, editor.document);
        }
        return editor.selections;
      }
      /**
       * Sets the current selections.
       *
       * If the current selection behavior is `Character`, strictly forward-facing
       * (i.e. `active > anchor`) selections will be made shorter by one character.
       */
      set selections(selections3) {
        const editor = this.editor;
        if (this.selectionBehavior === 2 /* Character */) {
          selections3 = selectionsToCharacterMode(selections3, editor.document);
        }
        editor.selections = selections3;
      }
      /**
       * Equivalent to `selections[0]`.
       *
       * @see selections
       */
      get mainSelection() {
        const editor = this.editor;
        if (this.selectionBehavior === 2 /* Character */) {
          return selectionsFromCharacterMode([editor.selection], editor.document)[0];
        }
        return editor.selection;
      }
      /**
       * Returns a new context whose cancellation is controlled by the specified
       * cancellation token.
       */
      withCancellationToken(cancellationToken) {
        return new _Context(this.getState(), cancellationToken, this.commandDescriptor);
      }
      /**
       * Returns the mode-specific state for the current context.
       */
      getState() {
        return this.extension.editors.getState(this._editor);
      }
      /**
       * Performs changes on the editor of the context.
       */
      edit(f) {
        let value2;
        const document = this.document,
          selections3 = f.length >= 2 ? this.selections : [];
        return this.wrap(
          this.editor
            .edit((editBuilder) => (value2 = f(editBuilder, selections3, document)), noUndoStops)
            .then((succeeded) => {
              EditNotAppliedError.throwIfNotApplied(succeeded);
              this._flags |= 1 /* ShouldInsertUndoStop */;
              return value2;
            }),
        );
      }
      /**
       * Returns whether edits have been performed in this context but not committed
       * with `insertUndoStop`.
       */
      hasEditsWithoutUndoStops() {
        return (this._flags & 1) /* ShouldInsertUndoStop */ === 1 /* ShouldInsertUndoStop */;
      }
      /**
       * Inserts an undo stop if needed.
       */
      insertUndoStop() {
        if (!this.hasEditsWithoutUndoStops()) {
          return Promise.resolve();
        }
        return this.wrap(performDummyEdit(this._editor));
      }
      /**
       * Switches the context to the given document.
       */
      async switchToDocument(document, alsoFocusEditor = false) {
        if (this.document === document) {
          return;
        }
        const notebook = document.notebook;
        let notebookEditor;
        if (notebook !== void 0) {
          const uri = document.uri;
          if (uri.scheme === "vscode-notebook-cell" && uri.fragment.startsWith("ch")) {
            const cellIndex = parseInt(uri.fragment.slice(2)),
              cell = notebook.cellAt(cellIndex);
            if (cell.index === cellIndex) {
              await vscode3.commands.executeCommand("vscode.open", cell.document.uri);
              notebookEditor = vscode3.window.activeTextEditor;
            }
          }
        }
        const editor =
          notebookEditor ??
          (await vscode3.window.showTextDocument(document, void 0, !alsoFocusEditor));
        this._document = document;
        this._editor = editor;
        this._mode = this.extension.editors.getState(editor).mode;
      }
      /**
       * Switches the mode of the current editor to the given mode.
       */
      async switchToMode(mode) {
        const state = this.extension.editors.getState(this._editor);
        await state.setMode(mode);
        this._mode = state.mode;
      }
    };
    /**
     * The base {@link Context} class, which does not require an active
     * {@link vscode.TextEditor}.
     */
    _Context.WithoutActiveEditor = ContextWithoutActiveEditor;
    Context = _Context;
  },
});

// src/api/clipboard.ts
import * as vscode4 from "vscode";
function copy(text4) {
  return Context.wrap(vscode4.env.clipboard.writeText(text4));
}
function clipboard() {
  return Context.wrap(vscode4.env.clipboard.readText());
}
var init_clipboard = __esm({
  "src/api/clipboard.ts"() {
    "use strict";
    init_context();
  },
});

// src/api/positions.ts
var positions_exports = {};
__export(positions_exports, {
  at: () => at,
  edge: () => edge,
  last: () => last,
  lineBreak: () => lineBreak,
  lineEnd: () => lineEnd,
  lineStart: () => lineStart,
  next: () => next,
  nonBlankLineStart: () => nonBlankLineStart,
  offset: () => offset,
  offsetOrEdge: () => offsetOrEdge,
  previous: () => previous,
  toString: () => toString,
  zero: () => zero,
});
import * as vscode5 from "vscode";
function next(position, document) {
  document ??= Context.current.document;
  const line2 = position.line,
    character2 = position.character,
    textLineLen = document.lineAt(line2).text.length;
  if (character2 < textLineLen) {
    return new vscode5.Position(line2, character2 + 1);
  }
  if (line2 === document.lineCount - 1) {
    return void 0;
  }
  return new vscode5.Position(line2 + 1, 0);
}
function previous(position, document) {
  const line2 = position.line,
    character2 = position.character;
  if (character2 > 0) {
    return new vscode5.Position(line2, character2 - 1);
  }
  if (line2 === 0) {
    return void 0;
  }
  return new vscode5.Position(
    line2 - 1,
    (document ?? Context.current.document).lineAt(line2 - 1).text.length,
  );
}
function offset(position, by, document) {
  if (by === 0) {
    return position;
  }
  if (by === 1) {
    return next(position, document);
  }
  if (by === -1) {
    return previous(position, document);
  }
  document ??= Context.current.document;
  const offset2 = document.offsetAt(position) + by;
  if (offset2 === -1) {
    return void 0;
  }
  return document.positionAt(document.offsetAt(position) + by);
}
function offsetOrEdge(position, by, document) {
  const result = offset(position, by, document);
  if (result === void 0) {
    return by < 0 ? zero : last(document);
  }
  return result;
}
function last(document = Context.current.document) {
  return document.lineAt(document.lineCount - 1).rangeIncludingLineBreak.end;
}
function at(line2, character2) {
  return new vscode5.Position(line2, character2);
}
function lineStart(line2) {
  return new vscode5.Position(line2, 0);
}
function nonBlankLineStart(line2, document = Context.current.document) {
  return new vscode5.Position(line2, document.lineAt(line2).firstNonWhitespaceCharacterIndex);
}
function lineEnd(line2, document = Context.current.document) {
  return new vscode5.Position(line2, document.lineAt(line2).text.length);
}
function lineBreak(line2, document = Context.current.document) {
  return line2 + 1 === document.lineCount ? lineEnd(line2, document) : lineStart(line2 + 1);
}
function edge(direction, document) {
  return direction === -1 /* Backward */ ? zero : last(document);
}
function toString(position) {
  return `${position.line + 1}:${position.character + 1}`;
}
var zero;
var init_positions = __esm({
  "src/api/positions.ts"() {
    "use strict";
    init_context();
    init_types();
    zero = new vscode5.Position(0, 0);
  },
});

// src/api/errors.ts
function todo() {
  const context = Context.WithoutActiveEditor.currentOrUndefined;
  if (context?.commandDescriptor !== void 0) {
    throw new Error(`command not implemented: ${context.commandDescriptor.identifier}`);
  }
  throw new Error("function not implemented");
}
var init_errors2 = __esm({
  "src/api/errors.ts"() {
    "use strict";
    init_context();
    init_errors();
  },
});

// src/utils/regexp.ts
function smartExec(re, string, context = Context.WithoutActiveEditor.currentOrUndefined) {
  if (!context?.extension?.isSmartCaseEnabled) {
    return re.exec(string);
  }
  const pattern = re.source;
  const flags = re.flags;
  const hasUpperCase = /\p{Lu}/u.test(pattern);
  if (hasUpperCase) {
    return re.exec(string);
  }
  const adjustedRegex = flags.includes("i") ? re : new RegExp(pattern, flags + "i");
  return adjustedRegex.exec(string);
}
function canMatchLineFeed(re) {
  return groupCanMatchLineFeed(0, re, false) === -1;
}
function groupCanMatchLineFeed(i, re, inverse) {
  for (const src = re.source; i !== -1 && i < src.length; ) {
    switch (src.charCodeAt(i)) {
      case 41:
        return i + 1;
      case 40:
        if (src.charCodeAt(i + 1) === 63) {
          const next3 = src.charCodeAt(i + 2);
          if (next3 === 33) {
            i = groupCanMatchLineFeed(i + 3, re, !inverse);
            continue;
          } else if (next3 === 61 || next3 === 58) {
            i += 2;
          } else if (next3 === 60) {
            i += 3;
            if (src.charCodeAt(i) === 33) {
              i = groupCanMatchLineFeed(i + 1, re, !inverse);
              continue;
            } else if (src.charCodeAt(i) === 61) {
              i++;
            } else {
              while (src.charCodeAt(i) !== 62) {
                i++;
              }
            }
          } else {
            assert(false);
          }
        }
        i = groupCanMatchLineFeed(i + 1, re, inverse);
        break;
      case 92:
        i = escapedCharacterCanMatchLineFeed(i + 1, re, inverse);
        break;
      case 91:
        i = characterSetCanMatchLineFeed(i + 1, re, inverse);
        break;
      case 46:
        if (re.dotAll || inverse) {
          return -1;
        }
        i++;
        break;
      case 43:
      case 42:
      case 63:
      case 124:
        i++;
        break;
      case 123:
        i++;
        while (src.charCodeAt(i - 1) !== 125) {
          i++;
        }
        break;
      case 93:
      case 125:
        assert(false);
        break;
      case 36:
      case 94:
      case 10:
        if (!inverse) {
          return -1;
        }
        i++;
        break;
      default:
        if (inverse) {
          return -1;
        }
        i++;
        break;
    }
  }
  return i;
}
function isDigit(charCode) {
  return charCode >= 48 && charCode <= 57;
}
function isRange(src, i, n, startInclusive, endInclusive) {
  if (i + n >= src.length) {
    return false;
  }
  for (let j = 0; j < n; j++) {
    const chr = src.charCodeAt(i + j);
    if (chr < startInclusive || chr > endInclusive) {
      return false;
    }
  }
  return true;
}
function isHex(src, i, n) {
  if (i + n >= src.length) {
    return false;
  }
  for (let j = 0; j < n; j++) {
    const c = src.charCodeAt(i + j);
    if ((c >= 48 && c <= 57) || (c >= 97 && c <= 102) || (c >= 65 && c <= 70)) {
      continue;
    }
    return false;
  }
  return true;
}
function escapedCharacterCanMatchLineFeed(i, re, inverse) {
  const src = re.source,
    chr = src.charCodeAt(i);
  switch (chr) {
    case 110:
    case 115:
    case 66:
    case 68:
    case 87:
      return inverse ? i + 1 : -1;
    case 48:
      if (
        !isRange(
          src,
          i + 1,
          2,
          48,
          55,
          /* 7 */
        )
      ) {
        return inverse ? -1 : i + 1;
      }
      if (src.charCodeAt(i + 1) === 49 && src.charCodeAt(i + 2) === 50) {
        return inverse ? i + 3 : -1;
      }
      return inverse ? -1 : i + 3;
    case 99:
      const controlCharacter = src.charCodeAt(i + 1);
      if (controlCharacter === 74 || controlCharacter === 106) {
        return inverse ? i + 2 : -1;
      }
      return inverse ? -1 : i + 2;
    case 120:
      if (!isHex(src, i + 1, 2)) {
        return inverse ? -1 : i + 1;
      }
      if (src.charCodeAt(i + 1) === 48) {
        const next3 = src.charCodeAt(i + 2);
        if (next3 === 97 || next3 === 65) {
          return inverse ? i + 3 : -1;
        }
      }
      return inverse ? -1 : i + 3;
    case 117:
      if (src.charCodeAt(i + 1) === 123) {
        i += 2;
        let x = 0;
        for (let ch = src.charCodeAt(i); ch !== 125; i++) {
          const v =
            ch >= 48 && ch <= 57 ? ch - 48 : ch >= 97 && ch <= 102 ? 10 + ch - 97 : 10 + ch - 65;
          x = x * 16 + v;
        }
        if (x === 10) {
          return inverse ? i + 1 : -1;
        }
        return inverse ? -1 : i + 1;
      }
      if (!isHex(src, i + 1, 4)) {
        return inverse ? -1 : i + 1;
      }
      if (
        src.charCodeAt(i + 1) === 48 &&
        src.charCodeAt(i + 2) === 48 &&
        src.charCodeAt(i + 3) === 48
      ) {
        const next3 = src.charCodeAt(i + 4);
        if (next3 === 97 || next3 === 65) {
          return inverse ? i + 5 : -1;
        }
      }
      return inverse ? -1 : i + 5;
    case 80:
      if (!re.unicode) {
        return inverse ? -1 : i + 1;
      }
      inverse = !inverse;
    case 112:
      if (!re.unicode) {
        return inverse ? -1 : i + 1;
      }
      const start2 = i - 1;
      i += 2;
      while (src.charCodeAt(i) !== 125) {
        i++;
      }
      i++;
      const testRegExpString = src.slice(start2, i),
        testRegExp = new RegExp(testRegExpString, "u");
      if (testRegExp.test("\n")) {
        return inverse ? i : -1;
      }
      return inverse ? -1 : i;
    default:
      if (chr > 48 && chr <= 57) {
        i++;
        while (isDigit(src.charCodeAt(i))) {
          i++;
        }
        return i;
      }
      return inverse ? -1 : i + 1;
  }
}
function characterSetCanMatchLineFeed(i, re, inverse) {
  const src = re.source,
    start2 = i - 1;
  if (src.charCodeAt(i) === 94) {
    if (src.charCodeAt(i + 1) === 93) {
      return inverse ? i + 2 : -1;
    }
    i++;
    inverse = !inverse;
  }
  for (let mayHaveRange = false; ; ) {
    switch (src.charCodeAt(i)) {
      case 93:
        if (mayHaveRange) {
          if (src.charCodeAt(start2 + 2) === 94) {
            inverse = !inverse;
          }
          const testRegExpString = src.slice(start2, i + 1),
            testRegExp = new RegExp(testRegExpString, re.flags);
          if (testRegExp.test("\n")) {
            if (!inverse) {
              return -1;
            }
          } else if (inverse) {
            return -1;
          }
        }
        return i + 1;
      case 92:
        i = escapedCharacterCanMatchLineFeed(i + 1, re, inverse);
        if (i === -1) {
          return -1;
        }
        break;
      case 10:
        if (!inverse) {
          return -1;
        }
        i++;
        break;
      case 45:
        mayHaveRange = true;
        i++;
        break;
      default:
        if (inverse) {
          return -1;
        }
        i++;
        break;
    }
  }
}
function matchesStaticStrings(re) {
  const alternatives = [],
    source = re.source;
  let alt = "";
  for (let i = 0, len = source.length; i < len; i++) {
    const ch = source.charCodeAt(i);
    if (ch === 124) {
      if (!alternatives.includes(alt)) {
        alternatives.push(alt);
      }
      alt = "";
    } else if (ch === 92) {
      i++;
      if (i === source.length) {
        break;
      }
      const next3 = source.charCodeAt(i);
      switch (next3) {
        case 110:
          alt += "\n";
          break;
        case 114:
          alt += "\r";
          break;
        case 116:
          alt += "	";
          break;
        case 102:
          alt += "\f";
          break;
        case 118:
          alt += "\v";
          break;
        case 99:
          const controlCh = source.charCodeAt(i + 1),
            isUpper = 65 <= controlCh && controlCh <= 90,
            offset2 = (isUpper ? 65 : 107) - 1;
          alt += String.fromCharCode(controlCh - offset2);
          break;
        case 48:
          if (
            isRange(
              source,
              i + 1,
              2,
              48,
              55,
              /* 7 */
            )
          ) {
            alt += String.fromCharCode(parseInt(source.substr(i + 1, 2), 8));
            i += 2;
          } else {
            alt += "\0";
          }
          break;
        case 120:
          if (isHex(source, i + 1, 2)) {
            alt += String.fromCharCode(parseInt(source.substr(i + 1, 2), 16));
            i += 2;
          } else {
            alt += "x";
          }
          break;
        case 117:
          if (source.charCodeAt(i + 1) === 123) {
            const end2 = source.indexOf("}", i + 2);
            if (end2 === -1) {
              return;
            }
            alt += String.fromCharCode(parseInt(source.slice(i + 2, end2), 16));
            i = end2 + 1;
          } else if (isHex(source, i + 1, 4)) {
            alt += String.fromCharCode(parseInt(source.substr(i + 1, 4), 16));
            i += 4;
          } else {
            alt += "u";
          }
          return;
        default:
          if (mustNotBeEscapedToBeStatic.indexOf(next3) !== -1) {
            return;
          }
          alt += source[i];
          break;
      }
    } else {
      if (mustBeEscapedToBeStatic.indexOf(ch) !== -1) {
        return;
      }
      alt += source[i];
    }
  }
  if (!alternatives.includes(alt)) {
    alternatives.push(alt);
  }
  return alternatives;
}
function parseEscaped(src, inCharSet) {
  assert(src.length > 0);
  let i = 0;
  switch (src.charCodeAt(i++)) {
    case 110:
      return [i, new Raw("\n")];
    case 114:
      return [i, new Raw("\r")];
    case 116:
      return [i, new Raw("	")];
    case 102:
      return [i, new Raw("\f")];
    case 118:
      return [i, new Raw("\n")];
    case 119:
      return [i, CharacterSet.word];
    case 87:
      return [i, CharacterSet.notWord];
    case 100:
      return [i, CharacterSet.digit];
    case 68:
      return [i, CharacterSet.notDigit];
    case 115:
      return [i, CharacterSet.whitespace];
    case 83:
      return [i, CharacterSet.notWhitespace];
    case 99:
      const controlCh = src.charCodeAt(i),
        isUpper = 65 <= controlCh && controlCh <= 90,
        offset2 = (isUpper ? 65 : 107) - 1,
        value2 = controlCh - offset2;
      i++;
      return [i, new Escaped("c", value2)];
    case 48:
      if (
        isRange(
          src,
          i,
          2,
          48,
          55,
          /* 7 */
        )
      ) {
        const value3 = parseInt(src.substr(i, 2), 8);
        i += 2;
        return [i, new Escaped("0", value3)];
      } else {
        return [i, new Raw("\0")];
      }
    case 120:
      if (isHex(src, i, 2)) {
        const value3 = parseInt(src.substr(i, 2), 16);
        i += 2;
        return [i, new Escaped("x", value3)];
      } else {
        return [i, new Raw("x")];
      }
    case 117:
      if (src.charCodeAt(i) === 123 /* LCurly */) {
        const end3 = src.indexOf("}", i + 1);
        assert(end3 !== -1);
        const value3 = parseInt(src.slice(i + 1, end3), 16);
        i = end3 + 1;
        return [i, new Escaped("u", value3)];
      } else if (isHex(src, i, 4)) {
        const value3 = parseInt(src.substr(i, 4), 16);
        i += 4;
        return [i, new Escaped("u", value3)];
      } else {
        return [i, new Raw("u")];
      }
    case 112:
    case 80:
      assert(src.charCodeAt(i) === 123 /* LCurly */);
      const start2 = i + 1,
        end2 = src.indexOf("}", start2);
      assert(end2 > start2);
      i = end2 + 1;
      return [i, new CharacterClass(src.slice(start2, end2), src.charCodeAt(start2 - 2) === 80)];
    default:
      if (!inCharSet && isDigit(src.charCodeAt(i - 1))) {
        const start3 = i - 1;
        while (isDigit(src.charCodeAt(i))) {
          i++;
        }
        return [i, new NumericEscape(+src.slice(start3, i))];
      }
      if (!inCharSet && src.charCodeAt(i - 1) === 107) {
        assert(src.charCodeAt(i) === 60 /* LAngle */);
        const start3 = i + 1,
          end3 = src.indexOf(">", start3);
        assert(end3 > start3);
        i = end3 + 1;
        return [i, new Backreference(src.slice(start3, end3))];
      }
      return [i, new Raw(src[i - 1])];
  }
}
function execLast(re, text4) {
  let lastMatch,
    lastMatchIndex = 0;
  for (;;) {
    const match = smartExec(re, text4);
    if (match === null) {
      break;
    }
    if (match[0].length === 0) {
      throw new Error("RegExp returned empty result");
    }
    lastMatchIndex += match.index + (lastMatch?.[0].length ?? 0);
    lastMatch = match;
    text4 = text4.slice(match.index + match[0].length);
  }
  if (lastMatch === void 0) {
    return null;
  }
  lastMatch.index = lastMatchIndex;
  return lastMatch;
}
function parseRegExpWithReplacement(regexp) {
  if (regexp.length < 2 || regexp[0] !== "/") {
    throw new Error("invalid RegExp");
  }
  let pattern = "",
    replacement = void 0,
    flags = void 0;
  for (let i = 1; i < regexp.length; i++) {
    const ch = regexp[i];
    if (flags !== void 0) {
      if (!"miguys".includes(ch)) {
        throw new Error(`unknown RegExp flag "${ch}"`);
      }
      flags += ch;
    } else if (replacement !== void 0) {
      if (ch === "/") {
        flags = "";
      } else if (ch === "\\") {
        if (i === regexp.length - 1) {
          throw new Error("unexpected end of RegExp");
        }
        const [offset2, result] = parseEscaped(
          regexp.slice(i + 1),
          /* inCharSet= */
          false,
        );
        if (result instanceof Raw) {
          i += offset2;
          replacement += result.string;
        } else if (result instanceof Escaped) {
          i += offset2;
          replacement += String.fromCharCode(result.value);
        } else {
          i += 1;
          replacement += ch + regexp[i];
        }
      } else {
        replacement += ch;
      }
    } else {
      if (ch === "/") {
        replacement = "";
      } else if (ch === "\\") {
        if (i === regexp.length - 1) {
          throw new Error("unexpected end of RegExp");
        }
        pattern += ch + regexp[++i];
      } else {
        pattern += ch;
      }
    }
  }
  if ((flags === void 0 || flags === "") && /^[miguys]+$/.test(replacement ?? "")) {
    flags = replacement;
    replacement = void 0;
  }
  try {
    return [new RegExp(pattern, flags), replacement];
  } catch {
    throw new Error("invalid RegExp");
  }
}
function escapeForRegExp(text4) {
  return text4.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function anyRegExp(a, b) {
  const flags = [.../* @__PURE__ */ new Set([...a.flags, ...b.flags])].join(""),
    aGroups = new RegExp("|" + a.source, a.flags).exec("").length - 1,
    bGroups = new RegExp("|" + b.source, b.flags).exec("").length - 1;
  const bSource = replaceUnlessEscaped(b.source, /\\(\d+)/g, (text4, n) => {
    if (n[0] === "0" || +n > bGroups) {
      return text4;
    }
    return "\\" + (+n + aGroups);
  });
  return [new RegExp(`(?:${a.source})|(?:${bSource})()`, flags), aGroups + bGroups + 1];
}
function replaceUnlessEscaped(text4, re, replace2) {
  return text4.replace(re, (...args) => {
    const offset2 = args[args.length - 2],
      text5 = args[args.length - 1];
    if (isEscaped(text5, offset2)) {
      return args[0];
    }
    return replace2(...args);
  });
}
function isEscaped(text4, offset2) {
  if (offset2 === 0) {
    return false;
  }
  let isEscaped2 = false;
  for (let i = offset2 - 1; i >= 0; i--) {
    if (text4[i] === "\\") {
      isEscaped2 = !isEscaped2;
    } else {
      return isEscaped2;
    }
  }
  return isEscaped2;
}
function splitRange(text4, re) {
  const sections = [];
  for (let start2 = 0; ; ) {
    re.lastIndex = 0;
    const match = smartExec(re, text4);
    if (match === null || text4.length === 0) {
      sections.push([start2, start2 + text4.length]);
      return sections;
    }
    sections.push([start2, start2 + match.index]);
    if (match[0].length === 0) {
      text4 = text4.slice(1);
      start2++;
    } else {
      text4 = text4.slice(match.index + match[0].length);
      start2 += match.index + match[0].length;
    }
  }
}
function execRange(text4, re) {
  re.lastIndex = 0;
  const sections = [];
  let diff = 0;
  for (
    let match = smartExec(re, text4);
    match !== null && text4.length > 0;
    match = smartExec(re, text4)
  ) {
    const start2 = match.index,
      end2 = start2 + match[0].length;
    sections.push([diff + start2, diff + end2, match]);
    text4 = text4.slice(end2);
    diff += end2;
    re.lastIndex = 0;
    if (start2 === end2) {
      text4 = text4.slice(1);
      diff++;
    }
  }
  return sections;
}
function newRegExp(pattern, flags = "") {
  if (pattern instanceof RegExp) {
    pattern = pattern.source;
  }
  const originalSource = pattern;
  let m;
  while ((m = /^\(\?([gimsuy]+)\)/.exec(pattern))) {
    for (const ch of m[1]) {
      if (!flags.includes(ch)) {
        flags += ch;
      }
    }
    pattern = pattern.slice(m[0].length);
  }
  return Object.assign(new RegExp(pattern, flags), { originalSource });
}
var mustBeEscapedToBeStatic,
  mustNotBeEscapedToBeStatic,
  Disjunction,
  Group,
  _Raw,
  Raw,
  _CharacterSet,
  CharacterSet,
  Escaped,
  _Dot,
  Dot,
  CharacterClass,
  _Anchor,
  Anchor,
  NumericEscape,
  Backreference;
var init_regexp = __esm({
  "src/utils/regexp.ts"() {
    "use strict";
    init_api();
    init_errors();
    mustBeEscapedToBeStatic = new Uint8Array([..."()[]{}*+?^$."].map((c) => c.charCodeAt(0)));
    mustNotBeEscapedToBeStatic = new Uint8Array(
      [..."123456789wWdDsSpPbBu"].map((c) => c.charCodeAt(0)),
    );
    Disjunction = class {
      constructor(alternatives) {
        this.alternatives = alternatives;
      }
      prefix() {
        return "(";
      }
      suffix() {
        return ")";
      }
      toString() {
        return this.prefix() + this.alternatives.join() + this.suffix();
      }
      firstCharacter() {
        const firstCharacters = this.alternatives
          .map((a) => a.firstCharacter())
          .filter((x) => x !== void 0);
        if (firstCharacters.length === 0) {
          return void 0;
        }
        return firstCharacters[0].merge(...firstCharacters.slice(1));
      }
    };
    Group = class _Group extends Disjunction {
      constructor(alternatives, index, name) {
        super(alternatives);
        this.index = index;
        this.name = name;
      }
      prefix() {
        if (this.name !== void 0) {
          return "(?<" + this.name + ">";
        }
        if (this.index === void 0) {
          return "(?:";
        }
        return "(";
      }
      reverse(state) {
        if (this.index !== void 0 && state.reversedGroups[this.index - 1] !== void 0) {
          return new NumericEscape(this.index);
        }
        return new _Group(
          this.alternatives.map((a) => a.reverse(state)),
          this.index,
          this.name,
        );
      }
    };
    _Raw = class _Raw {
      constructor(string) {
        this.string = string;
      }
      toString() {
        return this.string.replace(/[()[\]{}*+?^$.]/g, "\\$&");
      }
      reverse() {
        return new _Raw([...this.string].reverse().join());
      }
      firstCharacter() {
        return new CharacterSet([this], false);
      }
    };
    _Raw.a = new _Raw("a");
    _Raw.z = new _Raw("z");
    _Raw.A = new _Raw("A");
    _Raw.Z = new _Raw("Z");
    _Raw._ = new _Raw("_");
    _Raw._0 = new _Raw("0");
    _Raw._9 = new _Raw("9");
    _Raw.newLine = new _Raw("\n");
    Raw = _Raw;
    _CharacterSet = class _CharacterSet {
      constructor(alternatives, isNegated) {
        this.alternatives = alternatives;
        this.isNegated = isNegated;
      }
      toString() {
        if (this === _CharacterSet.digit) {
          return "\\d";
        }
        if (this === _CharacterSet.notDigit) {
          return "\\D";
        }
        if (this === _CharacterSet.word) {
          return "\\w";
        }
        if (this === _CharacterSet.notWord) {
          return "\\W";
        }
        if (this === _CharacterSet.whitespace) {
          return "\\s";
        }
        if (this === _CharacterSet.notWhitespace) {
          return "\\S";
        }
        const contents2 = this.alternatives
          .map((c) => (Array.isArray(c) ? `${c[0]}-${c[1]}` : c.toString()))
          .join("");
        return `[${this.isNegated ? "^" : ""}${contents2}]`;
      }
      negate() {
        return new _CharacterSet(this.alternatives, !this.isNegated);
      }
      makePositive(hasUnicodeFlag) {
        if (!this.isNegated) {
          return this;
        }
        const characterClasses = [],
          ranges = [0, hasUnicodeFlag ? 1114111 : 65535];
        for (let alternative of this.alternatives) {
          if (!Array.isArray(alternative)) {
            if (alternative instanceof CharacterClass) {
              characterClasses.push(alternative.negate());
              continue;
            }
            alternative = [alternative, alternative];
          }
          const [alt0, alt1] = alternative,
            negStart = alt0 instanceof Raw ? alt0.string.charCodeAt(0) : alt0.value,
            negEnd = alt1 instanceof Raw ? alt1.string.charCodeAt(0) : alt1.value;
          for (let i = 0; i < ranges.length; i += 2) {
            const posStart = ranges[i],
              posEnd = ranges[i + 1];
            if (negEnd < posStart || negStart > posEnd) {
            } else if (negStart <= posStart) {
              if (negEnd >= posEnd) {
                ranges.splice(i, 2);
                i -= 2;
              } else {
                ranges[i] = negEnd + 1;
              }
            } else if (negEnd >= posEnd) {
              ranges[i + 1] = negStart - 1;
            } else {
              ranges[i + 1] = negStart - 1;
              ranges.splice(i + 2, 0, negEnd + 1, posEnd);
            }
          }
        }
        const alternatives = characterClasses;
        for (let i = 0; i < ranges.length; i += 2) {
          const rangeStart = ranges[i],
            rangeEnd = ranges[i + 1];
          if (rangeStart === rangeEnd) {
            alternatives.push(Escaped.fromCharCode(rangeStart));
          } else {
            alternatives.push(Escaped.fromCharCode(rangeStart), Escaped.fromCharCode(rangeEnd));
          }
        }
        alternatives.push(...characterClasses);
        return new _CharacterSet(alternatives, false);
      }
      merge(...others) {
        const alternatives = this.makePositive().alternatives.slice();
        for (const other of others) {
          for (const alternative of other.makePositive().alternatives) {
            if (alternatives.indexOf(alternative) === -1) {
              alternatives.push(alternative);
            }
          }
        }
        return new _CharacterSet(alternatives, false);
      }
      reverse() {
        return this;
      }
      firstCharacter() {
        return this;
      }
    };
    _CharacterSet.digit = new _CharacterSet([[Raw._0, Raw._9]], false);
    _CharacterSet.word = new _CharacterSet(
      [[Raw._0, Raw._9], [Raw.a, Raw.z], [Raw.A, Raw.Z], Raw._],
      false,
    );
    _CharacterSet.whitespace = new _CharacterSet(
      [
        ..."	\n\v\f\r \xA0\u2000\u2001\u2002\u2003\u2004\u2005",
        ..."\u2006\u2007\u2008\u2009\u200A\u200B\u2028\u2029\u3000",
      ].map((c) => new Raw(c)),
      false,
    );
    _CharacterSet.notDigit = new _CharacterSet(_CharacterSet.digit.alternatives, true);
    _CharacterSet.notWord = new _CharacterSet(_CharacterSet.word.alternatives, true);
    _CharacterSet.notWhitespace = new _CharacterSet(_CharacterSet.whitespace.alternatives, true);
    CharacterSet = _CharacterSet;
    Escaped = class _Escaped {
      constructor(type, value2) {
        this.type = type;
        this.value = value2;
      }
      toString() {
        const type = this.type,
          value2 = this.value,
          str =
            type === "0"
              ? value2.toString(8).padStart(2, "0")
              : type === "c"
                ? String.fromCharCode(65 + value2)
                : type === "x"
                  ? value2.toString(16).padStart(2, "0")
                  : value2 <= 65535
                    ? value2.toString(16).padStart(4, "0")
                    : "{" + value2.toString(16) + "}";
        return "\\" + type + str;
      }
      reverse() {
        return this;
      }
      firstCharacter() {
        return new CharacterSet([this], false);
      }
      static fromCharCode(charCode) {
        if (charCode >= 32 && charCode <= 126) {
          return new Raw(String.fromCharCode(charCode));
        }
        if (charCode < 255) {
          return new _Escaped("x", charCode);
        }
        return new _Escaped("u", charCode);
      }
    };
    _Dot = class _Dot {
      constructor(includesNewLine) {
        this.includesNewLine = includesNewLine;
      }
      toString() {
        return ".";
      }
      reverse() {
        return this;
      }
      firstCharacter() {
        return new CharacterSet(this.includesNewLine ? [] : [Raw.newLine], true);
      }
    };
    _Dot.includingNewLine = new _Dot(true);
    _Dot.excludingNewLine = new _Dot(false);
    Dot = _Dot;
    CharacterClass = class _CharacterClass {
      constructor(characterClass, isNegative) {
        this.characterClass = characterClass;
        this.isNegative = isNegative;
      }
      toString() {
        return `\\${this.isNegative ? "P" : "p"}{${this.characterClass}}`;
      }
      negate() {
        return new _CharacterClass(this.characterClass, !this.isNegative);
      }
      reverse() {
        return this;
      }
      firstCharacter() {
        return new CharacterSet([this], false);
      }
    };
    _Anchor = class _Anchor {
      constructor(kind, string) {
        this.kind = kind;
        this.string = string;
      }
      toString() {
        return this.string;
      }
      reverse() {
        return this;
      }
      firstCharacter() {
        return void 0;
      }
    };
    _Anchor.start = new _Anchor(0 /* Start */, "^");
    _Anchor.end = new _Anchor(1 /* End */, "$");
    _Anchor.boundary = new _Anchor(2 /* Boundary */, "\\b");
    _Anchor.notBoundary = new _Anchor(3 /* NotBoundary */, "\\B");
    Anchor = _Anchor;
    NumericEscape = class {
      constructor(n) {
        this.n = n;
        assert(n > 0);
      }
      toString() {
        return "\\" + this.n;
      }
      reverse(state) {
        const i = this.n - 1;
        if (i >= state.reversedGroups.length || state.reversedGroups[i] !== void 0) {
          return this;
        }
        const group = state.expression.groups[i];
        return (state.reversedGroups[i] = new Group(
          group.alternatives.map((a) => a.reverse(state)),
          group.index,
          group.name,
        ));
      }
      firstCharacter() {
        return void 0;
      }
    };
    Backreference = class {
      constructor(name) {
        this.name = name;
      }
      toString() {
        return "\\k<" + this.name + ">";
      }
      reverse(state) {
        const n = state.expression.groups.findIndex((g) => g.name === this.name);
        assert(n !== -1);
        if (state.reversedGroups[n] !== void 0) {
          return this;
        }
        const group = state.expression.groups[n];
        return (state.reversedGroups[n] = new Group(
          group.alternatives.map((a) => a.reverse(state)),
          group.index,
          group.name,
        ));
      }
      firstCharacter() {
        return void 0;
      }
    };
  },
});

// src/utils/tracked-selection.ts
import * as vscode6 from "vscode";
function fromArray(selections3, document) {
  const trackedSelections = [];
  for (let i = 0, len = selections3.length; i < len; i++) {
    const selection3 = selections3[i],
      anchor2 = selection3.anchor,
      active2 = selection3.active;
    if (anchor2.line === active2.line) {
      const anchorOffset2 = document.offsetAt(anchor2),
        activeOffset2 = anchorOffset2 + active2.character - anchor2.character;
      trackedSelections.push(anchorOffset2, activeOffset2);
    } else {
      trackedSelections.push(document.offsetAt(anchor2), document.offsetAt(active2));
    }
  }
  return trackedSelections;
}
function restore(array, index, document) {
  const anchor2 = document.positionAt(array[index << 1]),
    active2 = document.positionAt(array[(index << 1) | 1]);
  return new vscode6.Selection(anchor2, active2);
}
function anchorOffset(array, index) {
  return array[index << 1];
}
function activeOffset(array, index) {
  return array[(index << 1) | 1];
}
function startOffset(array, index) {
  return Math.min(anchorOffset(array, index), activeOffset(array, index));
}
function length(array, index) {
  return Math.abs(anchorOffset(array, index) - activeOffset(array, index));
}
function restoreArray(array, document) {
  const selections3 = [];
  for (let i = 0, len = array.length >> 1; i < len; i++) {
    selections3.push(restore(array, i, document));
  }
  return selections3;
}
function restoreNonEmpty(array, document) {
  const selections3 = [];
  for (let i = 0, len = array.length >> 1; i < len; i++) {
    const anchorOffset2 = array[i << 1],
      activeOffset2 = array[(i << 1) | 1];
    if (anchorOffset2 === activeOffset2) {
      continue;
    }
    selections3.push(
      new vscode6.Selection(document.positionAt(anchorOffset2), document.positionAt(activeOffset2)),
    );
  }
  return selections3;
}
function updateAfterDocumentChanged(array, changes, flags) {
  for (let i = 0, len = array.length; i < len; i += 2) {
    let anchorOffset2 = array[i],
      activeOffset2 = array[i + 1],
      inclusiveActive,
      inclusiveAnchor;
    if (anchorOffset2 === activeOffset2) {
      inclusiveActive = (flags & 4) /* EmptyExtendsForward */ === 4 /* EmptyExtendsForward */;
      inclusiveAnchor = (flags & 8) /* EmptyExtendsBackward */ === 8 /* EmptyExtendsBackward */;
    } else {
      const activeIsStart = activeOffset2 <= anchorOffset2,
        anchorIsStart = activeOffset2 >= anchorOffset2,
        inclusiveStart = (flags & 1) /* StrictStart */ === 0,
        inclusiveEnd = (flags & 2) /* StrictEnd */ === 0;
      inclusiveActive = activeIsStart ? !inclusiveStart : inclusiveEnd;
      inclusiveAnchor = anchorIsStart ? !inclusiveStart : inclusiveEnd;
    }
    for (let i2 = 0, len2 = changes.length; i2 < len2; i2++) {
      const change = changes[i2],
        diff = change.text.length - change.rangeLength,
        offset2 = change.rangeOffset + change.rangeLength;
      if (offset2 < activeOffset2 || (inclusiveActive && offset2 === activeOffset2)) {
        activeOffset2 += diff;
      }
      if (offset2 < anchorOffset2 || (inclusiveAnchor && offset2 === anchorOffset2)) {
        anchorOffset2 += diff;
      }
    }
    array[i] = anchorOffset2;
    array[i + 1] = activeOffset2;
  }
}
function rangeBehaviorToFlags(rangeBehavior) {
  switch (rangeBehavior) {
    case vscode6.DecorationRangeBehavior.ClosedOpen:
      return 1 /* StrictStart */;
    case vscode6.DecorationRangeBehavior.OpenClosed:
      return 2 /* StrictEnd */;
    case vscode6.DecorationRangeBehavior.ClosedClosed:
      return 3 /* Strict */;
    default:
      return 0 /* Inclusive */;
  }
}
var Set2, StyledSet;
var init_tracked_selection = __esm({
  "src/utils/tracked-selection.ts"() {
    "use strict";
    init_errors();
    Set2 = class {
      constructor(selections3, document, flags = 0 /* Inclusive */) {
        this.document = document;
        this.flags = flags;
        this._onDisposed = new vscode6.EventEmitter();
        ArgumentError.validate("selections", selections3.length > 0, "selections cannot be empty");
        this._selections = selections3;
        this._onDidChangeTextDocumentSubscription = vscode6.workspace.onDidChangeTextDocument(
          this.updateAfterDocumentChanged,
          this,
        );
      }
      get onDisposed() {
        return this._onDisposed.event;
      }
      get length() {
        return this._selections.length / 2;
      }
      addArray(array) {
        this._selections.push(...array);
        return this;
      }
      addSelections(selections3) {
        return this.addArray(fromArray(selections3, this.document));
      }
      addSelection(selection3) {
        return this.addArray(fromArray([selection3], this.document));
      }
      deleteSelections(selections3) {
        const array = fromArray(selections3, this.document),
          thisArray = this._selections;
        for (let i = 0; i < array.length; i += 2) {
          const anchorOffset2 = array[i],
            activeOffset2 = array[i + 1];
          for (
            let j = thisArray.indexOf(anchorOffset2);
            j !== -1;
            j = thisArray.indexOf(anchorOffset2, j + 1)
          ) {
            if (j + 1 < thisArray.length && thisArray[j + 1] === activeOffset2) {
              thisArray.splice(j, 2);
              j -= 2;
            }
          }
        }
        return this;
      }
      clearSelections() {
        this._selections = [];
        return this;
      }
      /**
       * Updates the tracked selections to reflect a change in their document.
       *
       * @return whether the change was applied.
       */
      updateAfterDocumentChanged(e) {
        if (e.document !== this.document || e.contentChanges.length === 0) {
          return false;
        }
        updateAfterDocumentChanged(this._selections, e.contentChanges, this.flags);
        return true;
      }
      restore() {
        return restoreArray(this._selections, this.document);
      }
      restoreNonEmpty() {
        return restoreNonEmpty(this._selections, this.document);
      }
      dispose() {
        this._onDisposed.fire(this);
        this._onDisposed.dispose();
        this._onDidChangeTextDocumentSubscription.dispose();
      }
    };
    StyledSet = class extends Set2 {
      constructor(selections3, editorState, renderOptions) {
        super(
          selections3,
          editorState.editor.document,
          rangeBehaviorToFlags(renderOptions.rangeBehavior),
        );
        this.editorState = editorState;
        this._decorationType = vscode6.window.createTextEditorDecorationType(renderOptions);
        this._onDidEditorVisibilityChangeSubscription = editorState.onVisibilityDidChange(
          (e) => e.isVisible && this._updateDecorations(),
        );
        this._updateDecorations();
      }
      addArray(selections3) {
        super.addArray(selections3);
        for (let i = 0, len = selections3.length; i < len; i += 2) {
          if (selections3[i] !== selections3[i + 1]) {
            this._updateDecorations();
            break;
          }
        }
        return this;
      }
      deleteSelections(selections3) {
        const lenBefore = this.length;
        if (super.deleteSelections(selections3).length !== lenBefore) {
          this._updateDecorations();
        }
        return this;
      }
      clearSelections() {
        if (this.length === 0) {
          return this;
        }
        super.clearSelections();
        this._updateDecorations();
        return this;
      }
      updateAfterDocumentChanged(e) {
        if (!super.updateAfterDocumentChanged(e)) {
          return false;
        }
        this._updateDecorations();
        return true;
      }
      dispose() {
        super.dispose();
        this._decorationType.dispose();
        this._onDidEditorVisibilityChangeSubscription.dispose();
      }
      _updateDecorations() {
        this.editorState.editor.setDecorations(this._decorationType, this.restoreNonEmpty());
      }
    };
  },
});

// src/api/selections.ts
var selections_exports = {};
__export(selections_exports, {
  active: () => active,
  activeCharacter: () => activeCharacter,
  activeEnd: () => activeEnd,
  activeLine: () => activeLine,
  activeLineIsFullySelected: () => activeLineIsFullySelected,
  activePosition: () => activePosition,
  activeStart: () => activeStart,
  activeTowards: () => activeTowards,
  anchor: () => anchor,
  backward: () => backward,
  bottomToTop: () => bottomToTop,
  current: () => current,
  empty: () => empty,
  end: () => end,
  endCharacter: () => endCharacter,
  endLine: () => endLine,
  endPosition: () => endPosition,
  endsWithEntireLine: () => endsWithEntireLine,
  endsWithLineBreak: () => endsWithLineBreak,
  filter: () => filter,
  filterByIndex: () => filterByIndex,
  forward: () => forward,
  from: () => from,
  fromAnchorActive: () => fromAnchorActive,
  fromCharacterMode: () => selectionsFromCharacterMode,
  fromLength: () => fromLength,
  fromRange: () => fromRange,
  fromStartEnd: () => fromStartEnd,
  isEntireLine: () => isEntireLine,
  isEntireLines: () => isEntireLines,
  isMovingTowardsAnchor: () => isMovingTowardsAnchor,
  isNonDirectional: () => isNonDirectional,
  isSingleCharacter: () => isSingleCharacter,
  isSingleLine: () => isSingleLine,
  isStrictlyReversed: () => isStrictlyReversed,
  length: () => length2,
  lines: () => lines,
  map: () => map,
  mapByIndex: () => mapByIndex,
  mergeConsecutive: () => mergeConsecutive,
  mergeOverlapping: () => mergeOverlapping,
  nth: () => nth,
  overlap: () => overlap,
  reveal: () => reveal,
  rotate: () => rotate,
  seekFrom: () => seekFrom,
  selectWithin: () => selectWithin,
  set: () => set,
  shift: () => shift,
  shiftEmptyLeft: () => shiftEmptyLeft,
  shiftTowards: () => shiftTowards,
  sort: () => sort,
  split: () => split,
  start: () => start,
  startsWithEntireLine: () => startsWithEntireLine,
  text: () => text2,
  toCharacterMode: () => selectionsToCharacterMode,
  toString: () => toString2,
  topToBottom: () => topToBottom,
  track: () => track,
  update: () => update,
  updateByIndex: () => updateByIndex,
  updateWithFallback: () => updateWithFallback,
  updateWithFallbackByIndex: () => updateWithFallbackByIndex,
  wholeBuffer: () => wholeBuffer,
});
import * as vscode7 from "vscode";
function set(selections3, context = Context.current) {
  NotASelectionError.throwIfNotASelectionArray(selections3);
  context.selections = selections3;
  reveal(selections3[0], context);
  vscode7.commands.executeCommand("editor.action.wordHighlight.trigger");
  return selections3;
}
function filter(predicate, selections3) {
  return filterByIndex(
    (i, selection3, document) => predicate(document.getText(selection3), selection3, i),
    selections3,
  );
}
function filterByIndex(predicate, selections3) {
  const context = Context.current,
    document = context.document;
  if (selections3 === void 0) {
    selections3 = context.selections;
  }
  const firstSelection = selections3[0],
    firstResult = predicate(0, firstSelection, document);
  if (typeof firstResult === "boolean") {
    if (selections3.length === 1) {
      return firstResult ? [firstResult] : [];
    }
    const resultingSelections = firstResult ? [firstSelection] : [];
    for (let i = 1; i < selections3.length; i++) {
      const selection3 = selections3[i];
      if (predicate(i, selection3, document)) {
        resultingSelections.push(selection3);
      }
    }
    return resultingSelections;
  } else {
    if (selections3.length === 1) {
      return context.then(firstResult, (value2) => (value2 ? [firstSelection] : []));
    }
    const promises = [firstResult];
    for (let i = 1; i < selections3.length; i++) {
      const selection3 = selections3[i];
      promises.push(predicate(i, selection3, document));
    }
    const savedSelections = selections3.slice();
    return context.then(Promise.all(promises), (results) => {
      const resultingSelections = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i]) {
          resultingSelections.push(savedSelections[i]);
        }
      }
      return resultingSelections;
    });
  }
}
function map(f, selections3) {
  return mapByIndex(
    (i, selection3, document) => f(document.getText(selection3), selection3, i),
    selections3,
  );
}
function mapByIndex(f, selections3) {
  const context = Context.current,
    document = context.document;
  if (selections3 === void 0) {
    selections3 = context.selections;
  }
  const firstSelection = selections3[0],
    firstResult = f(0, firstSelection, document);
  if (firstResult === void 0 || typeof firstResult?.then !== "function") {
    const results = firstResult !== void 0 ? [firstResult] : [];
    for (let i = 1; i < selections3.length; i++) {
      const selection3 = selections3[i],
        value2 = f(i, selection3, document);
      if (value2 !== void 0) {
        results.push(value2);
      }
    }
    return results;
  } else {
    if (selections3.length === 1) {
      return context.then(firstResult, (result) => {
        return result !== void 0 ? [result] : [];
      });
    }
    const promises = [firstResult];
    for (let i = 1; i < selections3.length; i++) {
      const selection3 = selections3[i],
        promise = f(i, selection3, document);
      promises.push(promise);
    }
    return context.then(Promise.all(promises), (results) => {
      const filteredResults = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result !== void 0) {
          filteredResults.push(result);
        }
      }
      return filteredResults;
    });
  }
}
function update(f, context) {
  const selections3 = map(f, context?.selections);
  if (Array.isArray(selections3)) {
    return set(selections3, context);
  }
  return selections3.then((xs) => set(xs, context));
}
function mapFallbackSelections(values2) {
  let selectionsCount = 0,
    fallbackSelectionsCount = 0;
  for (const value2 of values2) {
    if (Array.isArray(value2)) {
      fallbackSelectionsCount++;
    } else if (value2 !== void 0) {
      selectionsCount++;
    }
  }
  if (selectionsCount > 0) {
    const selections3 = [];
    for (const value2 of values2) {
      if (value2 !== void 0 && !Array.isArray(value2)) {
        selections3.push(value2);
      }
    }
    return selections3;
  }
  if (fallbackSelectionsCount > 0) {
    const selections3 = [];
    for (const value2 of values2) {
      if (Array.isArray(value2)) {
        selections3.push(value2[0]);
      }
    }
    return selections3;
  }
  return [];
}
function updateByIndex(f, context) {
  const selections3 = mapByIndex(f, context?.selections);
  if (Array.isArray(selections3)) {
    return set(selections3, context);
  }
  return selections3.then((xs) => set(xs, context));
}
function updateWithFallback(f) {
  const selections3 = map(f);
  if (Array.isArray(selections3)) {
    return set(mapFallbackSelections(selections3));
  }
  return selections3.then((values2) => set(mapFallbackSelections(values2)));
}
function updateWithFallbackByIndex(f) {
  const selections3 = mapByIndex(f);
  if (Array.isArray(selections3)) {
    return set(mapFallbackSelections(selections3));
  }
  return selections3.then((values2) => set(mapFallbackSelections(values2)));
}
function rotate(by, selections3 = Context.current.selections) {
  const len = selections3.length;
  by = (by % len) + len;
  if (by === len) {
    return selections3.slice();
  }
  const sortedIndices = Array.from({ length: len }, (_, i) => i).sort((a, b) =>
    sortTopToBottom(selections3[a], selections3[b]),
  );
  return Array.from({ length: len }, (_, i) => {
    const indexInSortedArray = sortedIndices.indexOf(i);
    const rotatedIndexInSortedArray = (indexInSortedArray + by) % len;
    const rotatedIndex = sortedIndices[rotatedIndexInSortedArray];
    return selections3[rotatedIndex];
  });
}
function lines(selections3 = Context.current.selections) {
  const lines2 = [];
  for (const selection3 of selections3) {
    const startLine = selection3.start.line,
      endLine_ = endLine(selection3);
    if (lines2.indexOf(startLine) === -1) {
      lines2.push(startLine);
    }
    for (let i = startLine + 1; i < endLine_; i++) {
      lines2.push(i);
    }
    if (endLine_ !== startLine && lines2.indexOf(endLine_) === -1) {
      lines2.push(endLine_);
    }
  }
  return lines2;
}
function split(re, selections3 = Context.current.selections) {
  const document = Context.current.document;
  return map((text4, selection3) => {
    const offset2 = document.offsetAt(selection3.start);
    return splitRange(text4, re).map(([start2, end2]) =>
      fromStartEnd(offset2 + start2, offset2 + end2, selection3.isReversed),
    );
  }, selections3).flat();
}
function selectWithin(re, selections3 = Context.current.selections) {
  const document = Context.current.document;
  return map((text4, selection3) => {
    const offset2 = document.offsetAt(selection3.start);
    return execRange(text4, re).map(([start2, end2]) =>
      fromStartEnd(offset2 + start2, offset2 + end2, selection3.isReversed),
    );
  }, selections3).flat();
}
function reveal(selection3, context = Context.current) {
  const editor = context.editor,
    active2 = (selection3 ?? editor.selection).active;
  editor.revealRange(new vscode7.Range(active2, active2));
}
function merge(selections3, alsoMergeConsecutiveSelections) {
  const len = selections3.length,
    ignoreSelections = new Uint8Array(selections3.length);
  let newSelections;
  for (let i = 0; i < len; i++) {
    if (ignoreSelections[i] === 1) {
      continue;
    }
    const a = selections3[i];
    let aStart = a.start,
      aEnd = a.end,
      aIsEmpty = aStart.isEqual(aEnd),
      changed = false;
    for (let j = i + 1; j < len; j++) {
      if (ignoreSelections[j] === 1) {
        continue;
      }
      const b = selections3[j],
        bStart = b.start,
        bEnd = b.end;
      if (aIsEmpty) {
        if (bStart.isEqual(bEnd)) {
          if (bStart.isEqual(aStart)) {
            ignoreSelections[j] = 1;
            changed = true;
          } else {
          }
          continue;
        }
        if (bStart.isBeforeOrEqual(aStart) && bEnd.isAfterOrEqual(bStart)) {
          aStart = bStart;
          aEnd = bEnd;
          aIsEmpty = false;
          changed = true;
          ignoreSelections[j] = 1;
          continue;
        }
        continue;
      }
      if (
        aStart.isAfterOrEqual(bStart) &&
        (aStart.isBefore(bEnd) || (alsoMergeConsecutiveSelections && aStart.isEqual(bEnd)))
      ) {
        if (aEnd.isBeforeOrEqual(bEnd)) {
          aStart = b.start;
          aEnd = b.end;
        } else {
          if (aStart.isEqual(bStart)) {
            ignoreSelections[j] = 1;
            newSelections ??= selections3.slice(0, i);
            continue;
          }
          aStart = bStart;
        }
      } else if (
        (aEnd.isAfter(bStart) || (alsoMergeConsecutiveSelections && aEnd.isEqual(bStart))) &&
        aEnd.isBeforeOrEqual(bEnd)
      ) {
        aEnd = bEnd;
      } else {
        continue;
      }
      changed = true;
      ignoreSelections[j] = 1;
      j = i;
    }
    if (changed) {
      if (newSelections === void 0) {
        newSelections = selections3.slice(0, i);
      }
      newSelections.push(fromStartEnd(aStart, aEnd, a.isReversed));
    } else if (newSelections !== void 0) {
      newSelections.push(a);
    } else {
    }
  }
  return newSelections !== void 0 ? newSelections : selections3;
}
function mergeOverlapping(selections3 = current()) {
  return merge(
    selections3,
    /* alsoMergeConsecutiveSelections= */
    false,
  );
}
function mergeConsecutive(selections3 = current()) {
  return merge(
    selections3,
    /* alsoMergeConsecutiveSelections= */
    true,
  );
}
function current() {
  return Context.current.selections;
}
function nth(index, selections3 = current()) {
  return selections3[index];
}
function track(selections3) {
  const context = Context.current,
    document = context.document;
  return new Set2(fromArray(selections3 ?? context.selections, document), document);
}
function wholeBuffer(document = Context.current.document) {
  return new vscode7.Selection(zero, last(document));
}
function active(selection3) {
  return selection3.active;
}
function anchor(selection3) {
  return selection3.anchor;
}
function start(selection3) {
  return selection3.start;
}
function end(selection3) {
  return selection3.end;
}
function forward(selection3) {
  const active2 = selection3.active,
    anchor2 = selection3.anchor;
  return active2.isAfterOrEqual(anchor2) ? selection3 : new vscode7.Selection(active2, anchor2);
}
function backward(selection3) {
  const active2 = selection3.active,
    anchor2 = selection3.anchor;
  return active2.isBeforeOrEqual(anchor2) ? selection3 : new vscode7.Selection(active2, anchor2);
}
function empty(positionOrLine, character2) {
  if (typeof positionOrLine === "number") {
    positionOrLine = new vscode7.Position(positionOrLine, character2);
  }
  return new vscode7.Selection(positionOrLine, positionOrLine);
}
function overlap(a, b) {
  const aStart = a.start,
    aEnd = a.end,
    bStart = b.start,
    bEnd = b.end;
  return (
    !(aEnd.line < bStart.line || (aEnd.line === bEnd.line && aEnd.character < bStart.character)) &&
    !(bEnd.line < aStart.line || (bEnd.line === aEnd.line && bEnd.character < aStart.character))
  );
}
function endLine(selection3) {
  const startLine = selection3.start.line,
    end2 = selection3.end,
    endLine2 = end2.line,
    endCharacter2 = end2.character;
  if (startLine !== endLine2 && endCharacter2 === 0) {
    return endLine2 - 1;
  }
  return endLine2;
}
function endCharacter(selection3, document) {
  const startLine = selection3.start.line,
    end2 = selection3.end,
    endLine2 = end2.line,
    endCharacter2 = end2.character;
  if (startLine !== endLine2 && endCharacter2 === 0) {
    return (document ?? Context.current.document).lineAt(endLine2 - 1).text.length + 1;
  }
  return endCharacter2;
}
function endPosition(selection3, document) {
  const line2 = endLine(selection3);
  if (line2 !== selection3.end.line) {
    return new vscode7.Position(
      line2,
      (document ?? Context.current.document).lineAt(line2).text.length,
    );
  }
  return selection3.end;
}
function activeLine(selection3) {
  if (selection3.isReversed) {
    return selection3.active.line;
  }
  return endLine(selection3);
}
function activeCharacter(selection3, document) {
  if (selection3.isReversed) {
    return selection3.active.character;
  }
  return endCharacter(selection3, document);
}
function activePosition(selection3, document) {
  if (selection3.isReversed) {
    return selection3.active;
  }
  return endPosition(selection3, document);
}
function isSingleLine(selection3) {
  return selection3.start.line === endLine(selection3);
}
function isSingleCharacter(selection3, document = Context.current.document) {
  const start2 = selection3.start,
    end2 = selection3.end;
  if (start2.line === end2.line) {
    return start2.character === end2.character - 1;
  }
  if (start2.line === end2.line - 1) {
    return end2.character === 0 && document.lineAt(start2.line).text.length === start2.character;
  }
  return false;
}
function isNonDirectional(selection3, context = Context.current) {
  return (
    context.selectionBehavior === 2 /* Character */ &&
    !selection3.isReversed &&
    isSingleCharacter(selection3, context.document)
  );
}
function isStrictlyReversed(selection3, context = Context.current) {
  if (selection3.isEmpty || !selection3.isReversed) {
    return false;
  }
  return !isNonDirectional(selection3, context);
}
function seekFrom(selection3, direction, position = selection3.active, context = Context.current) {
  if (context.selectionBehavior === 2 /* Character */) {
    const doc = context.document;
    return direction === 1 /* Forward */
      ? position === selection3.start
        ? position
        : (previous(position, doc) ?? position)
      : position === selection3.end
        ? position
        : (next(position, doc) ?? position);
  }
  return position;
}
function activeStart(selection3, context = Context.current) {
  const active2 = selection3.active;
  if (context.selectionBehavior !== 2 /* Character */) {
    return active2;
  }
  const start2 = selection3.start;
  if (isSingleCharacter(selection3, context.document)) {
    return start2;
  }
  return active2 === start2 ? start2 : previous(active2, context.document);
}
function activeEnd(selection3, context = Context.current) {
  const active2 = selection3.active;
  if (context.selectionBehavior !== 2 /* Character */) {
    return active2;
  }
  const end2 = selection3.end;
  if (isSingleCharacter(selection3, context.document)) {
    return end2;
  }
  return active2 === end2 ? end2 : next(active2, context.document);
}
function activeTowards(selection3, direction, context = Context.current) {
  return direction === -1 /* Backward */
    ? activeStart(selection3, context)
    : activeEnd(selection3, context);
}
function shift(selection3, position, shift2, context = Context.current) {
  let anchor2 =
    shift2 === 0 /* Jump */
      ? position
      : shift2 === 1 /* Select */
        ? selection3.active
        : selection3.anchor;
  if (context.selectionBehavior === 2 /* Character */ && shift2 !== 0 /* Jump */) {
    const direction = anchor2.isAfter(position) ? -1 /* Backward */ : 1 /* Forward */;
    anchor2 = seekFrom(selection3, direction, anchor2, context);
  }
  return new vscode7.Selection(anchor2, position);
}
function shiftTowards(selection3, position, shiftTowards2, direction, context = Context.current) {
  if (context.selectionBehavior === 2 /* Character */ && direction === -1 /* Backward */) {
    position = next(position) ?? position;
  }
  return shift(selection3, position, shiftTowards2, context);
}
function isEntireLine(selection3) {
  const start2 = selection3.start,
    end2 = selection3.end;
  return start2.character === 0 && end2.character === 0 && start2.line === end2.line - 1;
}
function isEntireLines(selection3) {
  const start2 = selection3.start,
    end2 = selection3.end;
  return start2.character === 0 && end2.character === 0 && start2.line !== end2.line;
}
function startsWithEntireLine(selection3) {
  const start2 = selection3.start;
  return start2.character === 0 && start2.line !== selection3.end.line;
}
function endsWithEntireLine(selection3) {
  const end2 = selection3.end;
  return (
    end2.character === 0 &&
    (selection3.start.line < end2.line - 1 ||
      (selection3.start.line === end2.line - 1 && selection3.start.character === 0))
  );
}
function endsWithLineBreak(selection3) {
  const end2 = selection3.end;
  return end2.character === 0 && selection3.start.line < end2.line;
}
function activeLineIsFullySelected(selection3) {
  return selection3.active === selection3.start
    ? startsWithEntireLine(selection3)
    : endsWithEntireLine(selection3);
}
function isMovingTowardsAnchor(selection3, direction) {
  return direction === -1 /* Backward */
    ? selection3.active === selection3.end
    : selection3.active === selection3.start;
}
function text2(selection3, document = Context.current.document) {
  return document.getText(selection3);
}
function length2(selection3, document = Context.current.document) {
  const start2 = selection3.start,
    end2 = selection3.end;
  if (start2.line === end2.line) {
    return end2.character - start2.character;
  }
  return document.offsetAt(end2) - document.offsetAt(start2);
}
function toString2(selection3 = nth(0)) {
  return `${toString(selection3.anchor)} \u2192 ${toString(selection3.active)}`;
}
function fromLength(start2, length4, reversed = false, document = Context.current.document) {
  let startOffset2, startPosition;
  if (length4 === 0) {
    if (typeof start2 === "number") {
      startPosition = document.positionAt(start2);
    } else {
      startPosition = start2;
    }
    return new vscode7.Selection(startPosition, startPosition);
  }
  if (typeof start2 === "number") {
    startOffset2 = start2;
    startPosition = document.positionAt(start2);
  } else {
    startOffset2 = document.offsetAt(start2);
    startPosition = start2;
  }
  const endPosition2 = document.positionAt(startOffset2 + length4);
  return reversed
    ? new vscode7.Selection(endPosition2, startPosition)
    : new vscode7.Selection(startPosition, endPosition2);
}
function fromStartEnd(start2, end2, reversed, document) {
  if (typeof start2 === "number") {
    if (document === void 0) {
      document = Context.current.document;
    }
    start2 = document.positionAt(start2);
  }
  if (typeof end2 === "number") {
    if (document === void 0) {
      document = Context.current.document;
    }
    end2 = document.positionAt(end2);
  }
  return reversed ? new vscode7.Selection(end2, start2) : new vscode7.Selection(start2, end2);
}
function fromRange(range) {
  return new vscode7.Selection(range.start, range.end);
}
function fromAnchorActive(
  anchorOrAnchorLine,
  activeOrAnchorCharacterOrActiveLine,
  activeOrActiveLineOrActiveCharacter,
  activeCharacter2,
) {
  if (activeCharacter2 !== void 0) {
    const anchorLine2 = anchorOrAnchorLine,
      anchorCharacter2 = activeOrAnchorCharacterOrActiveLine,
      activeLine2 = activeOrActiveLineOrActiveCharacter;
    return new vscode7.Selection(anchorLine2, anchorCharacter2, activeLine2, activeCharacter2);
  }
  if (activeOrActiveLineOrActiveCharacter === void 0) {
    const anchor2 = anchorOrAnchorLine,
      active3 = activeOrAnchorCharacterOrActiveLine;
    return new vscode7.Selection(anchor2, active3);
  }
  if (typeof activeOrActiveLineOrActiveCharacter === "number") {
    const anchor2 = anchorOrAnchorLine,
      activeLine2 = activeOrAnchorCharacterOrActiveLine,
      activeCharacter3 = activeOrActiveLineOrActiveCharacter;
    return new vscode7.Selection(anchor2, new vscode7.Position(activeLine2, activeCharacter3));
  }
  const anchorLine = anchorOrAnchorLine,
    anchorCharacter = activeOrAnchorCharacterOrActiveLine,
    active2 = activeOrActiveLineOrActiveCharacter;
  return new vscode7.Selection(new vscode7.Position(anchorLine, anchorCharacter), active2);
}
function sort(direction, selections3 = current().slice()) {
  return selections3.sort(direction === 1 /* Forward */ ? sortTopToBottom : sortBottomToTop);
}
function topToBottom(selections3 = current().slice()) {
  return selections3.sort(sortTopToBottom);
}
function bottomToTop(selections3 = current().slice()) {
  return selections3.sort(sortBottomToTop);
}
function shiftEmptyLeft(selections3, document) {
  for (let i = 0; i < selections3.length; i++) {
    const selection3 = selections3[i];
    if (selection3.isEmpty) {
      if (document === void 0) {
        document = Context.current.document;
      }
      const newPosition = previous(selection3.active, document);
      if (newPosition !== void 0) {
        selections3[i] = empty(newPosition);
      }
    }
  }
}
function sortTopToBottom(a, b) {
  return a.start.compareTo(b.start);
}
function sortBottomToTop(a, b) {
  return b.start.compareTo(a.start);
}
var from;
var init_selections = __esm({
  "src/api/selections.ts"() {
    "use strict";
    init_context();
    init_errors2();
    init_positions();
    init_types();
    init_regexp();
    init_tracked_selection();
    from = fromAnchorActive;
  },
});

// src/api/edit/index.ts
import * as vscode8 from "vscode";
function mapResults(insertFlags, document, selections3, replacements) {
  let flags = 0 /* Inclusive */ | 4 /* EmptyExtendsForward */,
    where = void 0;
  switch (insertFlags & 7 /* PositionMask */) {
    case insert.Flags.Active:
      where = "active";
      break;
    case insert.Flags.Anchor:
      where = "anchor";
      break;
    case insert.Flags.Start:
      where = "start";
      break;
    case insert.Flags.End:
      where = "end";
      break;
  }
  if (where !== void 0 && (insertFlags & 25) /* BehaviorMask */ === insert.Flags.Keep) {
    flags =
      (insertFlags & 7) /* PositionMask */ === insert.Flags.Start
        ? 1 /* StrictStart */
        : 2 /* StrictEnd */;
  }
  const savedSelections = fromArray(selections3, document),
    discardedSelections = new Uint8Array(selections3.length);
  const promise = edit((editBuilder) => {
    for (let i = 0, len = replacements.length; i < len; i++) {
      const result = replacements[i],
        selection3 = selections3[i];
      if (result === void 0) {
        editBuilder.delete(selection3);
        discardedSelections[i] = 1;
      } else if (where === void 0) {
        editBuilder.replace(selection3, result);
        if (length(savedSelections, i) !== result.length) {
          const documentChangedEvent = [
            {
              range: selection3,
              rangeOffset: startOffset(savedSelections, i),
              rangeLength: length(savedSelections, i),
              text: result,
            },
          ];
          updateAfterDocumentChanged(savedSelections, documentChangedEvent, flags);
        }
      } else {
        const position = selection3[where];
        editBuilder.replace(position, result);
        const selectionOffset = startOffset(savedSelections, i),
          selectionLength = length(savedSelections, i);
        const documentChangedEvent = [
          {
            range: new vscode8.Range(position, position),
            rangeOffset:
              position === selection3.start ? selectionOffset : selectionOffset + selectionLength,
            rangeLength: 0,
            text: result,
          },
        ];
        updateAfterDocumentChanged(savedSelections, documentChangedEvent, flags);
      }
    }
  }).then(() => {
    const results = [];
    for (let i = 0, len = discardedSelections.length; i < len; i++) {
      if (discardedSelections[i]) {
        continue;
      }
      let restoredSelection = restore(savedSelections, i, document);
      if (where !== void 0 && (insertFlags & 25) /* BehaviorMask */ === insert.Flags.Select) {
        const totalLength = length(savedSelections, i),
          insertedLength = replacements[i].length,
          previousLength = totalLength - insertedLength;
        if (restoredSelection[where] === restoredSelection.start) {
          restoredSelection = fromStartEnd(
            restoredSelection.start,
            offset(restoredSelection.end, -previousLength, document),
            restoredSelection.isReversed,
          );
        } else {
          restoredSelection = fromStartEnd(
            offset(restoredSelection.start, previousLength, document),
            restoredSelection.end,
            restoredSelection.isReversed,
          );
        }
      }
      results.push(restoredSelection);
    }
    return results;
  });
  return Context.wrap(promise);
}
function insert(flags, f, selections3) {
  return insertByIndex(
    flags,
    (i, selection3, document) => f(document.getText(selection3), selection3, i, document),
    selections3,
  );
}
function insertFlagsAtEdge(edge2) {
  switch (edge2) {
    case void 0:
      return 0 /* Replace */;
    case "active":
      return 1 /* Active */;
    case "anchor":
      return 7 /* Anchor */;
    case "start":
      return 3 /* Start */;
    case "end":
      return 5 /* End */;
  }
}
function insertByIndex(flags, f, selections3 = Context.current.selections) {
  if (selections3.length === 0) {
    return Context.wrap(Promise.resolve([]));
  }
  const document = Context.current.document,
    firstResult = f(0, selections3[0], document);
  if (typeof firstResult === "object") {
    const promises = [firstResult];
    for (let i = 1, len = selections3.length; i < len; i++) {
      promises.push(f(i, selections3[i], document));
    }
    return Context.wrap(
      Promise.all(promises).then((results) => mapResults(flags, document, selections3, results)),
    );
  }
  const allResults = [firstResult];
  for (let i = 1, len = selections3.length; i < len; i++) {
    allResults.push(f(i, selections3[i], document));
  }
  return mapResults(flags, document, selections3, allResults);
}
async function insertByIndexWithFullLines(flags, f, selections3 = Context.current.selections) {
  const document = Context.current.document,
    allResults = await Promise.all(selections3.map((sel, i) => f(i, sel, document)));
  const results = [],
    resultsSelections = [],
    fullLineResults = [],
    fullLineResultsSelections = [],
    isFullLines = [];
  for (let i = 0; i < allResults.length; i++) {
    const result = allResults[i];
    if (result === void 0) {
      continue;
    }
    if (result.endsWith("\n")) {
      fullLineResults.push(result);
      fullLineResultsSelections.push(selections3[i]);
      isFullLines.push(true);
    } else {
      results.push(result);
      resultsSelections.push(selections3[i]);
      isFullLines.push(false);
    }
  }
  if (fullLineResults.length === 0) {
    return await mapResults(flags, document, resultsSelections, results);
  }
  let savedSelections = new Set2(fromArray(fullLineResultsSelections, document), document);
  const normalSelections = await mapResults(flags, document, resultsSelections, results);
  const fullLineSelections = savedSelections.restore();
  savedSelections.dispose();
  const nextFullLineSelections = [],
    insertionPositions = [];
  if ((flags & 7) /* PositionMask */ === 3 /* Start */) {
    for (const selection3 of fullLineSelections) {
      const insertionPosition = lineStart(selection3.start.line);
      insertionPositions.push(insertionPosition);
      if ((flags & 25) /* BehaviorMask */ === 17 /* Extend */) {
        nextFullLineSelections.push(
          fromStartEnd(insertionPosition, selection3.end, selection3.isReversed, document),
        );
      } else if ((flags & 25) /* BehaviorMask */ === 9 /* Select */) {
        nextFullLineSelections.push(empty(insertionPosition));
      } else {
        nextFullLineSelections.push(selection3);
      }
    }
  } else {
    for (const selection3 of fullLineSelections) {
      const insertionPosition = lineStart(endLine(selection3) + 1);
      insertionPositions.push(insertionPosition);
      if ((flags & 25) /* BehaviorMask */ === 17 /* Extend */) {
        nextFullLineSelections.push(
          fromStartEnd(selection3.start, insertionPosition, selection3.isReversed, document),
        );
      } else if ((flags & 25) /* BehaviorMask */ === 9 /* Select */) {
        nextFullLineSelections.push(empty(insertionPosition));
      } else {
        nextFullLineSelections.push(selection3);
      }
    }
  }
  savedSelections = new Set2(
    fromArray(nextFullLineSelections, document),
    document,
    (flags & 25) /* BehaviorMask */ === 1 /* Keep */ ? 3 /* Strict */ : 0 /* Inclusive */,
  );
  await edit((editBuilder) => {
    for (let i = 0; i < insertionPositions.length; i++) {
      editBuilder.replace(insertionPositions[i], fullLineResults[i]);
    }
  });
  const finalFullLineSelections = savedSelections.restore();
  savedSelections.dispose();
  const allSelections = [];
  for (let i = 0, normalIdx = 0, fullLineIdx = 0; i < isFullLines.length; i++) {
    if (isFullLines[i]) {
      allSelections.push(finalFullLineSelections[fullLineIdx++]);
    } else {
      allSelections.push(normalSelections[normalIdx++]);
    }
  }
  return allSelections;
}
function replace(f, selections3) {
  return insert(0 /* Replace */, f, selections3);
}
function replaceByIndex(f, selections3) {
  return insertByIndex(0 /* Replace */, f, selections3);
}
function rotate2(by, selections3) {
  return rotateContents(by, selections3).then((selections4) => rotateSelections(by, selections4));
}
async function rotateContents(by, selections3 = Context.current.selections) {
  const len = selections3.length;
  by = (by % len) + len;
  if (by === len) {
    return selections3.slice();
  }
  const sortedSelections = sort(1 /* Forward */, selections3.slice());
  const rotatedSortedSelections = Array.from(
    { length: len },
    (_, i) => sortedSelections[(i + by) % len],
  );
  const rotatedSortedSelectionsAfterEdit = await replaceByIndex(
    (i, _, document) => document.getText(sortedSelections[i]),
    rotatedSortedSelections,
  );
  return selections3.map((selection3) => {
    const rotatedSortedIndex = rotatedSortedSelections.indexOf(selection3);
    return rotatedSortedSelectionsAfterEdit[rotatedSortedIndex];
  });
}
function rotateSelections(by, selections3) {
  return set(rotate(by, selections3));
}
var init_edit = __esm({
  "src/api/edit/index.ts"() {
    "use strict";
    init_context();
    init_positions();
    init_selections();
    init_types();
    init_tracked_selection();
    ((insert3) => {
      let Flags2;
      ((Flags3) => {
        Flags3[(Flags3["Replace"] = 0)] = "Replace";
        Flags3[(Flags3["Active"] = 1)] = "Active";
        Flags3[(Flags3["Start"] = 3)] = "Start";
        Flags3[(Flags3["End"] = 5)] = "End";
        Flags3[(Flags3["Anchor"] = 7)] = "Anchor";
        Flags3[(Flags3["Keep"] = 1)] = "Keep";
        Flags3[(Flags3["Select"] = 9)] = "Select";
        Flags3[(Flags3["Extend"] = 17)] = "Extend";
      })((Flags2 = insert3.Flags || (insert3.Flags = {})));
    })(insert || (insert = {}));
    for (const [k, v] of Object.entries({
      Replace: 0 /* Replace */,
      Start: 3 /* Start */,
      End: 5 /* End */,
      Active: 1 /* Active */,
      Anchor: 7 /* Anchor */,
      Keep: 1 /* Keep */,
      Select: 9 /* Select */,
      Extend: 17 /* Extend */,
    })) {
      Object.defineProperty(insert, k, { value: v });
    }
  },
});

// src/utils/charset.ts
import * as vscode9 from "vscode";
function getCharacters(charSet, document) {
  let characters = "";
  if (charSet & 2 /* Blank */) {
    characters += blankCharacters;
  }
  if (charSet & 4 /* Punctuation */) {
    const wordSeparators = vscode9.workspace
      .getConfiguration("editor", { languageId: document.languageId })
      .get("wordSeparators");
    if (typeof wordSeparators === "string") {
      characters += wordSeparators;
    }
  }
  return characters;
}
function getCharCodes(charSet, document) {
  const characters = getCharacters(charSet, document),
    charCodes = new Uint32Array(characters.length);
  for (let i = 0; i < characters.length; i++) {
    charCodes[i] = characters.charCodeAt(i);
  }
  return charCodes;
}
function getCharSetFunction(charSet, document) {
  const charCodes = getCharCodes(charSet, document);
  if (charSet & 1 /* Invert */) {
    return (charCode) => {
      return charCodes.indexOf(charCode) === -1;
    };
  } else {
    return (charCode) => {
      return charCodes.indexOf(charCode) !== -1;
    };
  }
}
var blankCharacters;
var init_charset = __esm({
  "src/utils/charset.ts"() {
    "use strict";
    blankCharacters =
      "\r\n	 " +
      String.fromCharCode(
        160,
        5760,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8232,
        8233,
        8239,
        8287,
        12288,
      );
  },
});

// src/api/edit/linewise.ts
import * as vscode10 from "vscode";
function indentLines(lines2, times = 1, indentEmpty = false) {
  const options = Context.current.editor.options,
    indent3 = options.insertSpaces ? " ".repeat(options.tabSize * times) : "	".repeat(times);
  if (indentEmpty) {
    return edit((editBuilder) => {
      const seen = /* @__PURE__ */ new Set();
      for (const line2 of lines2) {
        const cnt = seen.size;
        if (seen.add(line2).size === cnt) {
          continue;
        }
        editBuilder.insert(new vscode10.Position(line2, 0), indent3);
      }
    });
  } else {
    return edit((editBuilder, _, document) => {
      const seen = /* @__PURE__ */ new Set();
      for (const line2 of lines2) {
        const cnt = seen.size;
        if (seen.add(line2).size === cnt || document.lineAt(line2).isEmptyOrWhitespace) {
          continue;
        }
        editBuilder.insert(new vscode10.Position(line2, 0), indent3);
      }
    });
  }
}
function deindentLines(lines2, times = 1, deindentIncomplete = true) {
  return edit((editBuilder, _, document) => {
    const tabSize = Context.current.editor.options.tabSize,
      needed = times * tabSize,
      seen = /* @__PURE__ */ new Set();
    for (const line2 of lines2) {
      const cnt = seen.size;
      if (seen.add(line2).size === cnt) {
        continue;
      }
      const textLine = document.lineAt(line2),
        text4 = textLine.text;
      let column2 = 0,
        j = 0;
      for (; column2 < needed; j++) {
        const char = text4[j];
        if (char === "	") {
          column2 += tabSize;
        } else if (char === " ") {
          column2++;
        } else {
          break;
        }
      }
      if (!deindentIncomplete && j < text4.length) {
        j -= j % tabSize;
      }
      if (j !== 0) {
        editBuilder.delete(textLine.range.with(void 0, textLine.range.start.translate(0, j)));
      }
    }
  });
}
async function joinLines(lines2, separator = " ") {
  const sortedLines = [...lines2].sort((a, b) => a - b);
  if (sortedLines.length === 0) {
    return [];
  }
  const ranges = [sortedLines[0], 0];
  for (let i = 1, len = sortedLines.length; i < len; i++) {
    const line2 = sortedLines[i],
      lastLine2 = sortedLines[i - 1];
    if (line2 === lastLine2) {
      continue;
    } else if (line2 === lastLine2 + 1) {
      ranges[ranges.length - 1]++;
    } else {
      ranges.push(line2, 0);
    }
  }
  return await edit((editBuilder, _, document) => {
    let diff = 0;
    const selections3 = [];
    for (let i = 0, len = ranges.length; i < len; i += 2) {
      const startLine = ranges[i],
        count = ranges[i + 1] || 1;
      let prevLine = document.lineAt(startLine),
        currentEnd = 0;
      for (let j = 0; j < count; j++) {
        const nextLine = document.lineAt(startLine + j + 1);
        let endCharacter2 = prevLine.text.length;
        while (endCharacter2 > 0) {
          if (!blankCharacters.includes(prevLine.text[endCharacter2 - 1])) {
            break;
          }
          endCharacter2--;
        }
        const start2 = new vscode10.Position(prevLine.lineNumber, endCharacter2),
          end2 = new vscode10.Position(
            nextLine.lineNumber,
            nextLine.firstNonWhitespaceCharacterIndex,
          ),
          finalCharacter = currentEnd + endCharacter2,
          finalStart = new vscode10.Position(startLine - diff, finalCharacter),
          finalEnd = new vscode10.Position(startLine - diff, finalCharacter + separator.length);
        editBuilder.replace(new vscode10.Range(start2, end2), separator);
        selections3.push(new vscode10.Selection(finalStart, finalEnd));
        prevLine = nextLine;
        currentEnd = finalCharacter + separator.length - nextLine.firstNonWhitespaceCharacterIndex;
      }
      diff += count;
    }
    return selections3;
  });
}
var init_linewise = __esm({
  "src/api/edit/linewise.ts"() {
    "use strict";
    init_context();
    init_charset();
  },
});

// src/api/functional.ts
import * as vscode11 from "vscode";
function isPosition(x) {
  return x != null && x.constructor === vscode11.Position;
}
function isRange2(x) {
  return x != null && x.constructor === vscode11.Range;
}
function isSelection(x) {
  return x != null && x.constructor === vscode11.Selection;
}
function mapStart(x, f) {
  if (isSelection(x)) {
    return x.start === x.anchor
      ? new vscode11.Selection(f(x.start), x.end)
      : new vscode11.Selection(x.end, f(x.start));
  }
  if (isRange2(x)) {
    return new vscode11.Range(f(x.start), x.end);
  }
  return f(x);
}
function mapEnd(x, f) {
  if (isSelection(x)) {
    return x.start === x.anchor
      ? new vscode11.Selection(x.start, f(x.end))
      : new vscode11.Selection(f(x.end), x.start);
  }
  if (isRange2(x)) {
    return new vscode11.Range(x.start, f(x.end));
  }
  return f(x);
}
function mapActive(x, f) {
  if (isSelection(x)) {
    return new vscode11.Selection(x.anchor, f(x.active));
  }
  return f(x);
}
function mapBoth(x, f) {
  if (isSelection(x)) {
    return new vscode11.Selection(f(x.anchor), f(x.active));
  }
  if (isRange2(x)) {
    return new vscode11.Range(f(x.start), f(x.end));
  }
  return f(x);
}
function curry(f, ...counts) {
  if (counts.length === 0) {
    return (...args) =>
      (lastArg) => {
        return f(...args, lastArg);
      };
  }
  let curried = f;
  for (let i = counts.length - 1; i >= 0; i--) {
    const prev = curried,
      len = counts[i];
    curried =
      (...args) =>
      (...newArgs) => {
        const allArgs = args;
        let i2 = 0;
        for (; i2 < newArgs.length && i2 < len; i2++) {
          allArgs.push(newArgs[i2]);
        }
        for (; i2 < len; i2++) {
          allArgs.push(void 0);
        }
        return prev(...allArgs);
      };
  }
  return curried;
}
function pipe(...functions) {
  return (values2) => {
    const results = [],
      vlen = values2.length,
      flen = functions.length;
    for (let i = 0; i < vlen; i++) {
      let value2 = values2[i];
      for (let j = 0; value2 !== void 0 && j < flen; j++) {
        value2 = functions[j](value2);
      }
      if (value2 !== void 0) {
        results.push(value2);
      }
    }
    return results;
  };
}
function pipeAsync(...functions) {
  return async (values2) => {
    const results = [],
      vlen = values2.length,
      flen = functions.length;
    for (let i = 0; i < vlen; i++) {
      let value2 = values2[i];
      for (let j = 0; value2 !== void 0 && j < flen; j++) {
        value2 = await functions[j](value2);
      }
      if (value2 !== void 0) {
        results.push(value2);
      }
    }
    return results;
  };
}
var init_functional = __esm({
  "src/api/functional.ts"() {
    "use strict";
  },
});

// src/api/history.ts
import * as vscode12 from "vscode";
function undo() {
  return Context.wrap(vscode12.commands.executeCommand("undo"));
}
function redo() {
  return Context.wrap(vscode12.commands.executeCommand("redo"));
}
var init_history = __esm({
  "src/api/history.ts"() {
    "use strict";
    init_context();
  },
});

// src/api/keys.ts
var init_keys = __esm({
  "src/api/keys.ts"() {
    "use strict";
  },
});

// src/api/prompt.ts
import * as vscode13 from "vscode";
function prompt(options, context = Context.WithoutActiveEditor.current) {
  if (options.value === void 0 && options.history !== void 0 && options.history.length > 0) {
    options.value = options.history[options.history.length - 1];
  }
  const inputBox = vscode13.window.createInputBox();
  const promise = new Promise((resolve, reject) => {
    const token = context.cancellationToken;
    if (token.isCancellationRequested) {
      return reject(new CancellationError(CancellationError.Reason.CancellationToken));
    }
    const validateInput = options.validateInput ?? (() => Promise.resolve(void 0));
    let validationValue = options.value ?? "",
      validation = Promise.resolve(validateInput(validationValue));
    let historyIndex = options.history?.length,
      lastHistoryValue = validationValue;
    function updateAndValidateValue(value2, setValue = false) {
      if (setValue) {
        inputBox.value = value2;
      }
      if (value2 !== validationValue) {
        validation = Promise.resolve(validateInput(value2));
        validationValue = value2;
      }
      validation.then((result) => {
        if (value2 === validationValue) {
          inputBox.validationMessage = result ?? void 0;
        }
      });
    }
    const contextKey = "dance.inPrompt";
    const setContextPromise = vscode13.commands.executeCommand("setContext", contextKey, true);
    const disposables = [
      inputBox,
      inputBox.onDidChangeValue(updateAndValidateValue),
      inputBox.onDidAccept(() => {
        const value2 = inputBox.value;
        if (value2 !== validationValue) {
          validation = Promise.resolve(validateInput(value2));
          validationValue = value2;
        }
        validation.then((result) => {
          if (result == null) {
            const history = options.history,
              historySize = options.historySize ?? 50;
            if (history !== void 0) {
              const existingIndex = history.indexOf(value2);
              if (existingIndex !== -1) {
                history.splice(existingIndex, 1);
              }
              history.push(value2);
              if (history.length > historySize) {
                history.shift();
              }
            }
            resolve(value2);
            inputBox.hide();
          } else if (value2 === validationValue) {
            inputBox.validationMessage = result ?? void 0;
          }
        });
      }),
      token.onCancellationRequested(() => {
        inputBox.hide();
      }),
      inputBox.onDidHide(() => {
        disposables.forEach((d) => d.dispose());
        setContextPromise.then(() =>
          vscode13.commands.executeCommand("setContext", contextKey, false),
        );
        const reason = context.cancellationToken?.isCancellationRequested
          ? CancellationError.Reason.CancellationToken
          : CancellationError.Reason.PressedEscape;
        reject(new CancellationError(reason));
      }),
      actionEvent.event((action) => {
        switch (action) {
          case "clear":
            updateAndValidateValue(
              "",
              /* setValue= */
              true,
            );
            break;
          case "next":
            if (historyIndex !== void 0) {
              if (historyIndex === options.history.length) {
                return;
              }
              historyIndex++;
              if (historyIndex === options.history.length) {
                updateAndValidateValue(
                  lastHistoryValue,
                  /* setValue= */
                  true,
                );
              } else {
                updateAndValidateValue(
                  options.history[historyIndex],
                  /* setValue= */
                  true,
                );
              }
            }
            break;
          case "previous":
            if (historyIndex !== void 0) {
              if (historyIndex === 0) {
                return;
              }
              if (historyIndex === options.history.length) {
                lastHistoryValue = inputBox.value;
              }
              historyIndex--;
              updateAndValidateValue(
                options.history[historyIndex],
                /* setValue= */
                true,
              );
            }
            break;
        }
      }),
    ];
    updateAndValidateValue(
      options.value ?? "",
      /* setValue= */
      true,
    );
    inputBox.title = options.title;
    inputBox.prompt = options.prompt;
    inputBox.placeholder = options.placeHolder;
    inputBox.password = !!options.password;
    inputBox.ignoreFocusOut = !!options.ignoreFocusOut;
    if (options.valueSelection !== void 0) {
      inputBox.valueSelection = options.valueSelection;
    }
    inputBox.show();
  });
  return context.wrap(promise);
}
function promptNumberOpts(opts = {}) {
  return {
    validateInput(input) {
      const n = +input;
      if (isNaN(n)) {
        return "Invalid number.";
      }
      if (opts.range && (n < opts.range[0] || n > opts.range[1])) {
        return `Number out of range ${JSON.stringify(opts.range)}.`;
      }
      if (opts.integer && (n | 0) !== n) {
        return `Number must be an integer.`;
      }
      return;
    },
  };
}
function promptNumber(opts, context = Context.WithoutActiveEditor.current) {
  return prompt(promptNumberOpts(opts), context).then((x) => +x);
}
function promptRegexpOpts(flags) {
  return {
    prompt: "Regular expression",
    validateInput(input) {
      if (input.length === 0) {
        return "RegExp cannot be empty";
      }
      try {
        newRegExp(input, flags);
        return void 0;
      } catch {
        return "invalid RegExp";
      }
    },
    history: regexpHistory,
  };
}
function promptRegexp(flags, context = Context.WithoutActiveEditor.current) {
  return prompt(promptRegexpOpts(flags), context).then((x) => newRegExp(x, flags));
}
function promptInteractively(compute, reset, options = {}, interactive = true) {
  let result;
  const validateInput = options.validateInput;
  if (!interactive) {
    return prompt(options).then((value2) => compute(value2));
  }
  return prompt({
    ...options,
    async validateInput(input) {
      const validationError = await validateInput?.(input);
      if (validationError) {
        return validationError;
      }
      try {
        result = await compute(input);
        return;
      } catch (e) {
        return `${e}`;
      }
    },
  }).then(
    () => result,
    (err) => {
      reset();
      throw err;
    },
  );
}
async function manipulateSelectionsInteractively(_, inputName, argument2, interactive, options, f) {
  const selections3 = _.selections;
  function execute2(input) {
    return _.runAsync(() => f(input, selections3));
  }
  function undo3() {
    set(selections3);
  }
  if (argument2[inputName] === void 0) {
    argument2[inputName] = await promptInteractively(execute2, undo3, options, interactive);
  } else {
    await execute2(argument2[inputName]);
  }
}
function promptOne(items, init, options, context = Context.WithoutActiveEditor.current) {
  if (options?.defaultPick != null) {
    const defaultPick = options.defaultPick,
      index = items.findIndex((pair2) => pair2[0] === defaultPick);
    if (index === -1) {
      const pickName = options.defaultPickName ?? "options.defaultPick",
        choices = items.map((pair2) => '"' + pair2[0] + '"').join(", ");
      return Promise.reject(new ArgumentError(`"${pickName}" must be one of ${choices}`));
    }
    return Promise.resolve(index);
  }
  return promptInList(false, items, init ?? (() => {}), context.cancellationToken);
}
function promptLocked(
  items,
  init,
  cancellationToken = Context.WithoutActiveEditor.current.cancellationToken,
) {
  const itemsKeys = items.map(([k, _]) => (k.includes(", ") ? k.split(", ") : [...k]));
  return new Promise((resolve, reject) => {
    const quickPick = vscode13.window.createQuickPick(),
      quickPickItems = [];
    let isCaseSignificant = false;
    for (let i = 0; i < items.length; i++) {
      const [label, description] = items[i];
      quickPickItems.push({ label, description });
      isCaseSignificant = isCaseSignificant || label.toLowerCase() !== label;
    }
    quickPick.items = quickPickItems;
    quickPick.placeholder = "Press one of the below keys.";
    const subscriptions = [
      quickPick.onDidChangeValue((rawKey) => {
        quickPick.value = "";
        quickPick.items = quickPickItems;
        let key = rawKey;
        if (!isCaseSignificant) {
          key = key.toLowerCase();
        }
        const index = itemsKeys.findIndex((x) => x.includes(key));
        if (index !== -1) {
          items[index][2]();
        }
      }),
      quickPick.onDidHide(() => {
        subscriptions.splice(0).forEach((s) => s.dispose());
        resolve();
      }),
      quickPick.onDidAccept(() => {
        subscriptions.splice(0).forEach((s) => s.dispose());
        const picked = quickPick.selectedItems[0];
        try {
          items.find((x) => x[1] === picked.description)[2]();
        } finally {
          resolve();
        }
      }),
      cancellationToken?.onCancellationRequested(() => {
        subscriptions.splice(0).forEach((s) => s.dispose());
        reject(new CancellationError(CancellationError.Reason.CancellationToken));
      }),
      quickPick,
    ];
    init?.(quickPick);
    quickPick.show();
  });
}
function promptMany(items, init, context = Context.WithoutActiveEditor.current) {
  return promptInList(true, items, init ?? (() => {}), context.cancellationToken);
}
function notifyPromptActionRequested(action) {
  actionEvent.fire(action);
}
async function keypress(context = Context.current) {
  if (context.cancellationToken.isCancellationRequested) {
    return Promise.reject(new CancellationError(CancellationError.Reason.CancellationToken));
  }
  const previousMode = context.mode;
  await context.switchToMode(context.extension.modes.inputMode);
  return await new Promise((resolve, reject) => {
    try {
      const subscriptions = [
        vscode13.commands.registerCommand("type", ({ text: text4 }) => {
          if (subscriptions.length > 0) {
            subscriptions.splice(0).forEach((s) => s.dispose());
            context.switchToMode(previousMode).then(() => resolve(text4));
          }
        }),
        context.cancellationToken.onCancellationRequested(() => {
          if (subscriptions.length > 0) {
            subscriptions.splice(0).forEach((s) => s.dispose());
            context
              .switchToMode(previousMode)
              .then(() =>
                reject(
                  new CancellationError(
                    context.extension.cancellationReasonFor(context.cancellationToken) ??
                      CancellationError.Reason.CancellationToken,
                  ),
                ),
              );
          }
        }),
      ];
    } catch {
      reject(
        new Error(
          'unable to listen to keyboard events; is an extension overriding the "type" command (e.g VSCodeVim)?',
        ),
      );
    }
  });
}
async function keypressForRegister(context = Context.current) {
  const firstKey = await keypress(context);
  if (firstKey !== " ") {
    return context.extension.registers.get(firstKey);
  }
  const secondKey = await keypress(context);
  return context.extension.registers.forDocument(context.document).get(secondKey);
}
function promptInList(canPickMany, items, init, cancellationToken) {
  const itemsKeys = items.map(([k, _]) => (k.includes(", ") ? k.split(", ") : [...k]));
  return new Promise((resolve, reject) => {
    const quickPick = vscode13.window.createQuickPick(),
      quickPickItems = [];
    let isCaseSignificant = false;
    for (let i = 0; i < items.length; i++) {
      const [label, description] = items[i];
      quickPickItems.push({ label, description });
      isCaseSignificant = isCaseSignificant || label.toLowerCase() !== label;
    }
    quickPick.items = quickPickItems;
    quickPick.placeholder = "Press one of the below keys.";
    quickPick.canSelectMany = canPickMany;
    const subscriptions = [
      quickPick.onDidChangeValue((rawKey) => {
        if (subscriptions.length === 0) {
          return;
        }
        let key = rawKey;
        if (!isCaseSignificant) {
          key = key.toLowerCase();
        }
        const index = itemsKeys.findIndex((x) => x.includes(key));
        subscriptions.splice(0).forEach((s) => s.dispose());
        if (index === -1) {
          return resolve(rawKey);
        }
        if (canPickMany) {
          resolve([index]);
        } else {
          resolve(index);
        }
      }),
      quickPick.onDidAccept(() => {
        if (subscriptions.length === 0) {
          return;
        }
        let picked = quickPick.selectedItems;
        if (picked !== void 0 && picked.length === 0) {
          picked = quickPick.activeItems;
        }
        subscriptions.splice(0).forEach((s) => s.dispose());
        if (picked === void 0) {
          return reject(new CancellationError(CancellationError.Reason.PressedEscape));
        }
        if (canPickMany) {
          resolve(picked.map((x) => items.findIndex((item) => item[1] === x.description)));
        } else {
          resolve(items.findIndex((x) => x[1] === picked[0].description));
        }
      }),
      quickPick.onDidHide(() => {
        if (subscriptions.length === 0) {
          return;
        }
        subscriptions.splice(0).forEach((s) => s.dispose());
        reject(new CancellationError(CancellationError.Reason.PressedEscape));
      }),
      cancellationToken?.onCancellationRequested(() => {
        if (subscriptions.length === 0) {
          return;
        }
        subscriptions.splice(0).forEach((s) => s.dispose());
        reject(new CancellationError(CancellationError.Reason.CancellationToken));
      }),
      quickPick,
    ];
    init(quickPick);
    quickPick.show();
  });
}
var actionEvent, regexpHistory;
var init_prompt = __esm({
  "src/api/prompt.ts"() {
    "use strict";
    init_context();
    init_selections();
    init_errors();
    init_regexp();
    actionEvent = new vscode13.EventEmitter();
    regexpHistory = [];
  },
});

// src/api/menu.ts
import * as vscode14 from "vscode";
function validateMenu(menu) {
  if (typeof menu !== "object" || menu === null) {
    return ["menu must be an object"];
  }
  if (typeof menu.items !== "object" || Object.keys(menu.items ?? {}).length === 0) {
    return ['menu must have an subobject "items" with at least two entries.'];
  }
  const seenKeyCodes = /* @__PURE__ */ new Map(),
    errors = [];
  if (menu.title !== void 0 && typeof menu.title !== "string") {
    errors.push("menu title must be a string");
  }
  if (menu.type !== void 0 && menu.type !== "hotkey" && menu.type !== "palette") {
    errors.push("menu.type must be 'hotkey' (default) or 'palette'");
  }
  const isHotkey = (menu.type ?? "hotkey") === "hotkey";
  for (const key in menu.items) {
    const item = menu.items[key],
      itemDisplay = JSON.stringify(key);
    if (typeof item !== "object" || item === null) {
      errors.push(`item ${itemDisplay} must be an object.`);
      continue;
    }
    if (typeof item.text !== "string" || item.text.length === 0) {
      errors.push(`item ${itemDisplay} must have a non-empty "text" property.`);
      continue;
    }
    if (typeof item.command !== "string" || item.command.length === 0) {
      errors.push(`item ${itemDisplay} must have a non-empty "command" property.`);
      continue;
    }
    if (key.length === 0) {
      errors.push(`item ${itemDisplay} must be a non-empty string key.`);
      continue;
    }
    if (isHotkey) {
      for (let i = 0; i < key.length; i++) {
        const keyCode = key.charCodeAt(i),
          prevKey = seenKeyCodes.get(keyCode);
        if (prevKey) {
          errors.push(
            `menu has duplicate key '${key[i]}' (specified by '${prevKey}' and '${key}').`,
          );
          continue;
        }
        seenKeyCodes.set(keyCode, key);
      }
    }
  }
  return errors;
}
function findMenu(menuName, context = Context.WithoutActiveEditor.current) {
  const menu = context.extension.menus.get(menuName);
  if (menu === void 0) {
    throw new Error(`menu ${JSON.stringify(menuName)} does not exist`);
  }
  return menu;
}
async function showMenu(menu, additionalArgs = [], prefix) {
  const entries = Object.entries(menu.items);
  const items = entries.map((x) => [x[0], x[1].text]);
  let choice;
  if ((menu.type ?? "hotkey") === "hotkey") {
    choice = await promptOne(items, (quickPick) => (quickPick.title = menu.title));
  } else {
    choice = await promptPalette(items, { title: menu.title });
  }
  if (typeof choice === "string") {
    if (prefix !== void 0) {
      await vscode14.commands.executeCommand("default:type", { text: prefix + choice });
    }
    return;
  }
  const pickedItem = entries[choice][1],
    args = mergeArgs(pickedItem.args, additionalArgs);
  return Context.WithoutActiveEditor.wrap(
    vscode14.commands.executeCommand(pickedItem.command, ...args),
  );
}
function showMenuByName(menuName, additionalArgs = [], prefix) {
  return showMenu(findMenu(menuName), additionalArgs, prefix);
}
async function showMenuAfterDelay(delayMs, menu, additionalArgs = [], prefix) {
  const cancellationTokenSource = new vscode14.CancellationTokenSource(),
    currentContext2 = Context.current;
  currentContext2.cancellationToken.onCancellationRequested(() => cancellationTokenSource.cancel());
  const keypressContext = currentContext2.withCancellationToken(cancellationTokenSource.token),
    timeout = setTimeout(() => cancellationTokenSource.cancel(), delayMs);
  try {
    const key = await keypress(keypressContext);
    clearTimeout(timeout);
    for (const itemKeys in menu.items) {
      if (!itemKeys.includes(key)) {
        continue;
      }
      const pickedItem = menu.items[itemKeys],
        args = mergeArgs(pickedItem.args, additionalArgs);
      await Context.WithoutActiveEditor.wrap(
        vscode14.commands.executeCommand(pickedItem.command, ...args),
      );
      return;
    }
    if (prefix !== void 0) {
      await vscode14.commands.executeCommand("default:type", { text: prefix + key });
    }
  } catch (e) {
    if (!currentContext2.cancellationToken.isCancellationRequested) {
      await showMenu(menu, additionalArgs, prefix);
      return;
    }
    throw e;
  } finally {
    cancellationTokenSource.dispose();
  }
}
async function promptPalette(
  items,
  quickPickOptions,
  context = Context.WithoutActiveEditor.current,
) {
  const result = await vscode14.window.showQuickPick(
    items.map(([label, description], i) => ({
      label,
      description,
      _i: i,
    })),
    { ...quickPickOptions },
    context.cancellationToken,
  );
  if (result === void 0) {
    throw new CancellationError(CancellationError.Reason.PressedEscape);
  }
  return result._i;
}
async function showLockedMenu(menu, additionalArgs = []) {
  const entries = Object.entries(menu.items),
    items = entries.map(([keys, item]) => [
      keys,
      item.text,
      () => vscode14.commands.executeCommand(item.command, ...mergeArgs(item.args, additionalArgs)),
    ]);
  await promptLocked(items, (quickPick) => (quickPick.title = menu.title));
}
function showLockedMenyByName(menuName, additionalArgs = []) {
  return showLockedMenu(findMenu(menuName), additionalArgs);
}
function mergeArgs(args, additionalArgs) {
  if (args == null) {
    return additionalArgs;
  }
  if (!Array.isArray(args)) {
    args = [args];
  }
  if (additionalArgs.length > 0) {
    return args.length > additionalArgs.length
      ? args.map((arg, i) =>
          i < additionalArgs.length && additionalArgs[i]
            ? Object.assign({}, additionalArgs[i], arg)
            : arg,
        )
      : additionalArgs.map((arg, i) => (i < args.length ? Object.assign({}, arg, args[i]) : arg));
  } else {
    return args;
  }
}
var init_menu = __esm({
  "src/api/menu.ts"() {
    "use strict";
    init_context();
    init_prompt();
    init_errors2();
  },
});

// src/api/modes.ts
async function toMode(modeName, count) {
  const context = Context.current,
    extension2 = context.extension,
    mode = findMode(modeName, context);
  if (mode === void 0 || mode.isPendingDeletion) {
    throw new Error(`mode ${JSON.stringify(modeName)} does not exist`);
  }
  if (!count) {
    return context.switchToMode(mode);
  }
  const editorState = context.getState(),
    initialMode = editorState.mode,
    disposable = extension2
      .createAutoDisposable()
      .disposeOnEvent(editorState.onVisibilityDidChange)
      .addDisposable({
        dispose() {
          context.switchToMode(initialMode);
        },
      });
  await context.switchToMode(mode);
  setTimeout(() => {
    const { Entry: Entry2 } = extension2.recorder;
    disposable.addDisposable(
      extension2.recorder.onDidAddEntry((entry) => {
        if (
          entry instanceof Entry2.ExecuteCommand &&
          entry.descriptor().identifier.endsWith("updateCount")
        ) {
          return;
        }
        if (
          entry instanceof Entry2.ChangeTextEditor ||
          entry instanceof Entry2.ChangeTextEditorMode
        ) {
          return disposable.dispose();
        }
        if (--count === 0) {
          disposable.dispose();
        }
      }),
    );
  }, 0);
}
function findMode(modeName, context) {
  context = context ?? Context.current;
  const currentMode = context.mode,
    split3 = currentMode.name.split("/");
  if (split3.length === 2) {
    const namespacedMode = context.extension.modes.get(`${split3[0]}/${modeName}`);
    if (namespacedMode !== void 0) {
      return namespacedMode;
    }
  }
  return context.extension.modes.get(modeName);
}
var init_modes = __esm({
  "src/api/modes.ts"() {
    "use strict";
    init_context();
  },
});

// src/api/run.ts
import * as vscode15 from "vscode";
function run(strings, context = {}) {
  const isSingleStringArgument = typeof strings === "string";
  if (isSingleStringArgument) {
    strings = [strings];
  }
  const functions = [];
  for (const code of strings) {
    functions.push(compileFunction(code, Object.keys(context)));
  }
  const parameterValues = runParameterValues();
  if (isSingleStringArgument) {
    return Context.WithoutActiveEditor.wrap(
      functions[0](...parameterValues, ...Object.values(context)),
    );
  }
  const promises = [],
    contextValues = Object.values(context);
  for (const func of functions) {
    promises.push(func(...parameterValues, ...contextValues));
  }
  return Context.WithoutActiveEditor.wrap(Promise.all(promises));
}
function ensureCacheIsPopulated() {
  if (cachedParameterNames.length > 0) {
    return;
  }
  for (const name in globalsObject) {
    cachedParameterNames.push(name);
    cachedParameters.push(globalsObject[name]);
  }
  cachedParameterNames.push("vscode");
  cachedParameters.push(vscode15);
}
function setRunGlobals(globals) {
  cachedParameterNames.length = 0;
  cachedParameters.length = 0;
  globalsObject = globals;
}
function runParameterNames() {
  ensureCacheIsPopulated();
  return cachedParameterNames;
}
function runParameterValues() {
  ensureCacheIsPopulated();
  return cachedParameters;
}
function disableRunFunction() {
  canRunArbitraryCode = false;
}
function runIsEnabled() {
  return canRunArbitraryCode;
}
function compileFunction(code, additionalParameterNames = []) {
  if (!canRunArbitraryCode && !safeExpressions.some((re) => re.test(code))) {
    throw new Error("execution of arbitrary code is disabled");
  }
  const cacheId = additionalParameterNames.join(";") + code,
    cached = functionCache.get(cacheId);
  if (cached !== void 0) {
    cached[1] = Date.now();
    return cached[0];
  }
  let func;
  try {
    func = new AsyncFunction(
      ...runParameterNames(),
      ...additionalParameterNames,
      `{
${code}
}`,
    );
  } catch (e) {
    throw new Error(`cannot parse function body: ${code}: ${e}`);
  }
  functionCache.set(cacheId, [func, Date.now()]);
  return func;
}
function clearCompiledFunctionsCache(olderThanMs = 1e3 * 60 * 5) {
  if (olderThanMs === 0) {
    return functionCache.clear();
  }
  const olderThan = Date.now() - olderThanMs,
    toDelete = [];
  for (const [code, value2] of functionCache) {
    if (value2[1] < olderThan) {
      toDelete.push(code);
    }
  }
  for (const code of toDelete) {
    functionCache.delete(code);
  }
}
function assignArgument(assignment, argument2) {
  const ownedArgument = Object.assign({}, assignment.baseValue);
  if ("include" in assignment) {
    for (const propName of assignment.include) {
      const propValue = argument2[propName];
      if (propValue !== void 0) {
        ownedArgument[propName] = propValue;
      }
    }
  } else if ("exclude" in assignment) {
    const excluded = assignment.exclude;
    for (const propName in argument2) {
      if (excluded.has(propName)) {
        continue;
      }
      ownedArgument[propName] = argument2[propName];
    }
  }
  return ownedArgument;
}
function buildAssignment(argument2) {
  if (typeof argument2 !== "object" || argument2 === null) {
    return { baseValue: {} };
  }
  const { $include, $exclude, ...baseValue } = argument2,
    assignment = { baseValue };
  if (Array.isArray($include)) {
    assignment.include = $include;
  } else if (Array.isArray($exclude)) {
    assignment.exclude = new Set($exclude);
  }
  return assignment;
}
function assignArguments(assignment, argument2) {
  return assignment.map((assignment2) => assignArgument(assignment2, argument2));
}
function buildAssignments(args) {
  if (!Array.isArray(args)) {
    if (typeof args === "object") {
      return [buildAssignment(args)];
    }
    return [];
  }
  return args.map(buildAssignment);
}
function buildCommands(commands16, extension2 = Context.WithoutActiveEditor.current.extension) {
  const batches = [],
    currentBatch = [];
  for (let i = 0, len = commands16.length; i < len; i++) {
    let commandName, commandArguments;
    const command6 = commands16[i];
    if (typeof command6 === "string") {
      commandName = command6;
      commandArguments = void 0;
    } else if (Array.isArray(command6)) {
      commandName = command6[0];
      commandArguments = command6.slice(1);
      if (typeof commandName !== "string") {
        throw new Error("the first element of a command tuple must be a command name");
      }
    } else if (typeof command6 === "object" && command6 !== null) {
      commandName = command6.command;
      commandArguments = command6.args;
      if (typeof commandName !== "string") {
        throw new Error('the "command" property of a command object must be a command name');
      }
    } else {
      throw new Error(
        "commands must be command names, {command: string, args: any} objects or arrays",
      );
    }
    if (commandName.startsWith(".")) {
      commandName = `dance${commandName}`;
    }
    if (commandName.startsWith("dance.")) {
      const descriptor = extension2.commands[commandName];
      if (descriptor === void 0) {
        throw new Error(`command ${JSON.stringify(commandName)} does not exist`);
      }
      const argument2 = Array.isArray(commandArguments) ? commandArguments[0] : commandArguments,
        assignment = buildAssignment(argument2);
      currentBatch.push([descriptor, assignment]);
    } else {
      if (currentBatch.length > 0) {
        batches.push(currentBatch.splice(0));
      }
      batches.push([commandName, buildAssignments(commandArguments)]);
    }
  }
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  return async (argument2, context = Context.WithoutActiveEditor.current) => {
    const results = [],
      ownedArguments = [];
    for (const batch of batches) {
      if (typeof batch[0] === "string") {
        const ownedArgument = assignArguments(batch[1], argument2);
        results.push(await vscode15.commands.executeCommand(batch[0], ...ownedArgument));
        ownedArguments.push(ownedArgument);
      } else {
        const context2 = Context.WithoutActiveEditor.current;
        let { currentCount, currentRegister } = context2.extension;
        for (const [descriptor, assignment] of batch) {
          const ownedArgument = assignArgument(assignment, argument2);
          if (currentCount !== context2.extension.currentCount) {
            currentCount = ownedArgument["count"] = context2.extension.currentCount;
            context2.extension.currentCount = 0;
          }
          if (currentRegister !== context2.extension.currentRegister) {
            currentRegister = ownedArgument["register"] = context2.extension.currentRegister;
            context2.extension.currentRegister = void 0;
          }
          if (ownedArgument["try"]) {
            delete ownedArgument["try"];
            try {
              results.push(await descriptor.handler(context2, ownedArgument));
            } catch {
              results.push(void 0);
            }
          } else {
            results.push(await descriptor.handler(context2, ownedArgument));
          }
          ownedArguments.push(ownedArgument);
        }
      }
    }
    if (context.shouldRecord()) {
      const recorder = context.extension.recorder;
      let i = 0;
      for (const batch of batches) {
        if (typeof batch[0] === "string") {
          const ownedArgument = ownedArguments[i++];
          recorder.recordExternalCommand(batch[0], ownedArgument);
        } else {
          for (const [descriptor] of batch) {
            const ownedArgument = ownedArguments[i++];
            if (ownedArgument["record"] === false) {
              continue;
            }
            recorder.recordCommand(descriptor, ownedArgument);
          }
        }
      }
    }
    return results;
  };
}
async function command(commandName, ...args) {
  return (await commands7([commandName, ...args]))[0];
}
async function commands7(...commands16) {
  return await buildCommands(commands16)({});
}
function execute(
  command6,
  input,
  options = {},
  cancellationToken = Context.WithoutActiveEditor.current.cancellationToken,
) {
  const {
    cwd = (function () {
      const currentFileUri = Context.currentOrUndefined?.document.uri;
      if (currentFileUri?.scheme === "file" || currentFileUri?.scheme === "vscode-userdata") {
        return vscode15.Uri.joinPath(currentFileUri, "..").fsPath;
      }
      const workspaceFolder = vscode15.workspace.workspaceFolders?.[0]?.uri;
      if (workspaceFolder?.scheme === "file") {
        return workspaceFolder.fsPath;
      }
      return void 0;
    })(),
    env: givenEnv = (function () {
      if (vscode15.env.remoteName !== void 0) {
        return {};
      }
      const env5 = { ...process.env };
      if (cwd !== void 0) {
        env5["PWD"] = cwd;
      }
      return env5;
    })(),
  } = options;
  if (true) {
    return Context.WithoutActiveEditor.wrap(
      Promise.reject(new Error("execution of arbitrary commands is not supported on the web")),
    );
  }
  if (!canExecuteArbitraryCommands) {
    return Context.WithoutActiveEditor.wrap(
      Promise.reject(new Error("execution of arbitrary commands is disabled")),
    );
  }
  const promise = import("child_process").then(
    (cp) =>
      new Promise((resolve, reject) => {
        const automationProfile = getAutomationProfile(),
          shell = typeof automationProfile?.path === "string" ? automationProfile.path : "",
          args = Array.isArray(automationProfile?.args) ? automationProfile.args : [],
          env5 = {
            ...(typeof automationProfile?.env === "object" ? automationProfile.env : {}),
            ...givenEnv,
          },
          child =
            shell.length === 0
              ? cp.spawn(command6, {
                  ...commonSpawnOptions,
                  shell: true,
                  env: env5,
                  cwd: env5["PWD"],
                })
              : cp.spawn(shell, [...args, command6], {
                  ...commonSpawnOptions,
                  shell: false,
                  env: env5,
                  cwd: env5["PWD"],
                });
        let stdout = "",
          stderr = "";
        const disposable = cancellationToken.onCancellationRequested(() => {
          child.kill("SIGINT");
        });
        child.stdout.on("data", (chunk) => (stdout += chunk.toString("utf-8")));
        child.stderr.on("data", (chunk) => (stderr += chunk.toString("utf-8")));
        child.stdin.end(input, "utf-8");
        child.once("error", (err) => {
          disposable.dispose();
          reject(err);
        });
        child.once("exit", (code) => {
          disposable.dispose();
          code === 0
            ? resolve(stdout.trimRight())
            : reject(
                new Error(
                  `Command exited with error ${code}: ${stderr.length > 0 ? stderr.trimRight() : "<No error output>"}`,
                ),
              );
        });
      }),
  );
  return Context.WithoutActiveEditor.wrap(promise);
}
function disableExecuteFunction() {
  canExecuteArbitraryCommands = false;
}
function getAutomationProfile() {
  let os;
  switch ("web") {
    case "cygwin":
    case "linux":
      os = "linux";
      break;
    case "darwin":
      os = "osx";
      break;
    case "win32":
      os = "windows";
      break;
    default:
      return void 0;
  }
  return vscode15.workspace.getConfiguration("terminal.integrated.automationProfile").get(os);
}
function switchRun(string, context) {
  if (string.length === 0) {
    return Context.WithoutActiveEditor.wrap(Promise.resolve());
  }
  if (string[0] === "/") {
    const [regexp, replacement] = parseRegExpWithReplacement(string);
    if (replacement === void 0) {
      return Context.WithoutActiveEditor.wrap(Promise.resolve(regexp.exec(context.$)));
    }
    return Context.WithoutActiveEditor.wrap(
      Promise.resolve(context.$.replace(regexp, replacement)),
    );
  }
  if (string[0] === "#") {
    return execute(string.slice(1), context.$);
  }
  return run("return " + string, context);
}
function validateForSwitchRun(string) {
  if (string.trim().length === 0) {
    throw new Error("the given string cannot be empty");
  }
  if (string[0] === "/") {
    parseRegExpWithReplacement(string);
    return;
  }
  if (string[0] === "#") {
    if (string.slice(1).trim().length === 0) {
      throw new Error("the given shell command cannot be empty");
    }
    return;
  }
  compileFunction("return " + string);
}
var cachedParameterNames,
  cachedParameters,
  globalsObject,
  canRunArbitraryCode,
  AsyncFunction,
  functionCache,
  safeExpressions,
  canExecuteArbitraryCommands,
  commonSpawnOptions;
var init_run = __esm({
  "src/api/run.ts"() {
    "use strict";
    init_context();
    init_regexp();
    cachedParameterNames = [];
    cachedParameters = [];
    globalsObject = {};
    canRunArbitraryCode = true;
    AsyncFunction = async function () {}.constructor;
    functionCache = /* @__PURE__ */ new Map();
    safeExpressions = [
      /^(return +)?(\$\$?|[in]|\d+|count) *([=!]==?|[<>]=?|&{1,2}|\|{1,2}|[-+*/^]) *(\$\$?|[in]|\d+|count)$/,
      /^(return +)?`\${await register\(["']\w+["'], *[i0-9]\)}` !== ["']false["']$/,
    ];
    canExecuteArbitraryCommands = true;
    commonSpawnOptions = { stdio: "pipe", windowsHide: true };
  },
});

// src/api/search/index.ts
import * as vscode16 from "vscode";
function search(direction, re, origin, end2, document) {
  return direction === -1 /* Backward */
    ? searchBackward(re, origin, end2, document)
    : searchForward(re, origin, end2, document);
}
function searchBackward(re, origin, end2, document = Context.current.document) {
  end2 ??= zero;
  const searchStart = document.offsetAt(end2),
    searchEnd = document.offsetAt(origin),
    possibleSearchLength = searchEnd - searchStart;
  if (possibleSearchLength < 0) {
    return;
  }
  if (possibleSearchLength > 2e3) {
    const staticMatches = matchesStaticStrings(re);
    if (staticMatches !== void 0) {
      return searchOneOfBackward(re, staticMatches, origin, end2, document);
    }
    if (!canMatchLineFeed(re)) {
      return searchSingleLineRegExpBackward(re, origin, end2, document);
    }
  }
  return searchNaiveBackward(re, origin, end2, document);
}
function searchForward(re, origin, end2, document = Context.current.document) {
  end2 ??= last(document);
  const searchStart = document.offsetAt(origin),
    searchEnd = document.offsetAt(end2),
    possibleSearchLength = searchEnd - searchStart;
  if (possibleSearchLength < 0) {
    return;
  }
  if (possibleSearchLength > 2e3) {
    const staticMatches = matchesStaticStrings(re);
    if (staticMatches !== void 0) {
      return searchOneOfForward(re, staticMatches, origin, end2, document);
    }
    if (!canMatchLineFeed(re)) {
      return searchSingleLineRegExpForward(re, origin, end2, document);
    }
  }
  return searchNaiveForward(re, origin, end2, document);
}
function maxLines(strings) {
  let max = 1;
  for (const string of strings) {
    let lines2 = 1;
    for (let i = 0, len = string.length; i < len; i++) {
      if (string.charCodeAt(i) === 10) {
        lines2++;
      }
    }
    if (lines2 > max) {
      max = lines2;
    }
  }
  return max;
}
function searchNaiveBackward(re, origin, end2, document) {
  re.lastIndex = 0;
  const searchRange = new vscode16.Range(end2, origin),
    match = execLast(re, document.getText(searchRange));
  if (match === null) {
    return;
  }
  return [offset(end2, match.index), match];
}
function searchNaiveForward(re, origin, end2, document) {
  re.lastIndex = 0;
  const searchRange = new vscode16.Range(origin, end2),
    match = smartExec(re, document.getText(searchRange));
  if (match === null) {
    return;
  }
  const matchPosition = document.positionAt(document.offsetAt(origin) + match.index);
  return [matchPosition, match];
}
function searchSingleLineRegExpBackward(re, origin, end2, document) {
  re.lastIndex = 0;
  const currentLine = document.lineAt(origin),
    match = execLast(re, currentLine.text.slice(0, origin.character));
  if (match !== null) {
    return [new vscode16.Position(origin.line, match.index), match];
  }
  const endLine2 = end2.line;
  for (let line2 = origin.line - 1; line2 > endLine2; line2--) {
    const textLine = document.lineAt(line2),
      match2 = execLast(re, textLine.text);
    if (match2 !== null) {
      return [new vscode16.Position(line2, match2.index), match2];
    }
  }
  const endMatch = execLast(re, document.lineAt(endLine2).text.slice(end2.character));
  if (endMatch !== null) {
    const endCharacter2 = end2.character + endMatch.index;
    return [new vscode16.Position(endLine2, endCharacter2), endMatch];
  }
  return;
}
function searchSingleLineRegExpForward(re, origin, end2, document) {
  re.lastIndex = 0;
  const currentLine = document.lineAt(origin),
    match = smartExec(re, currentLine.text.slice(origin.character));
  if (match !== null) {
    return [origin.translate(void 0, match.index), match];
  }
  const endLine2 = end2.line;
  for (let line2 = origin.line + 1; line2 < endLine2; line2++) {
    const textLine = document.lineAt(line2),
      match2 = smartExec(re, textLine.text);
    if (match2 !== null) {
      return [new vscode16.Position(line2, match2.index), match2];
    }
  }
  const endMatch = smartExec(re, document.lineAt(endLine2).text.slice(0, end2.character));
  if (endMatch !== null) {
    return [new vscode16.Position(endLine2, endMatch.index), endMatch];
  }
  return;
}
function searchOneOfBackward(re, oneOf, origin, end2, document) {
  const lineRange = maxLines(oneOf);
  if (lineRange === 1) {
    return searchSingleLineRegExpBackward(re, origin, end2, document);
  }
  const endLine2 = end2.line;
  if (origin.line - endLine2 < lineRange) {
    return;
  }
  re.lastIndex = 0;
  const originLine = origin.line,
    lines2 = [document.lineAt(originLine).text.slice(0, origin.character)],
    joiner = document.eol === vscode16.EndOfLine.CRLF ? "\r\n" : "\n";
  for (let i = 1; i < lineRange; i++) {
    lines2.unshift(document.lineAt(originLine - i).text);
  }
  const lineToSlice = end2.character === 0 ? -1 : endLine2;
  for (let line2 = originLine - lineRange + 1; line2 >= endLine2; line2--) {
    lines2[0] = document.lineAt(line2).text;
    if (line2 === lineToSlice) {
      lines2[0] = lines2[0].slice(end2.character);
    }
    const text4 = lines2.join(joiner),
      match = smartExec(re, text4);
    if (match !== null) {
      return [new vscode16.Position(line2, match.index), match];
    }
    for (let i = lineRange; i > 0; i--) {
      lines2[i] = lines2[i + 1];
    }
  }
  return;
}
function searchOneOfForward(re, oneOf, origin, end2, document) {
  const lineRange = maxLines(oneOf);
  if (lineRange === 1) {
    return searchSingleLineRegExpForward(re, origin, end2, document);
  }
  const endLine2 = end2.line;
  if (origin.line + lineRange >= endLine2) {
    return;
  }
  re.lastIndex = 0;
  const originLine = origin.line,
    lines2 = [document.lineAt(originLine).text.slice(origin.character)],
    joiner = document.eol === vscode16.EndOfLine.CRLF ? "\r\n" : "\n";
  for (let i = 1; i < lineRange; i++) {
    lines2.push(document.lineAt(originLine + i).text);
  }
  for (let line2 = originLine, loopEnd = endLine2 - lineRange + 1; line2 < loopEnd; line2++) {
    const text4 = lines2.join(joiner),
      match = smartExec(re, text4);
    if (match !== null) {
      const character2 = line2 === originLine ? origin.character + match.index : match.index;
      return [new vscode16.Position(line2, character2), match];
    }
    for (let i = 1; i < lineRange; i++) {
      lines2[i - 1] = lines2[i];
    }
    lines2[lines2.length - 1] = document.lineAt(line2 + lineRange).text;
    if (line2 === loopEnd - 1) {
      lines2[lines2.length - 1] = lines2[lines2.length - 1].slice(0, end2.character);
    }
  }
  return;
}
var init_search = __esm({
  "src/api/search/index.ts"() {
    "use strict";
    init_context();
    init_positions();
    init_types();
    init_regexp();
  },
});

// src/api/search/move.ts
import * as vscode17 from "vscode";
function moveWith(direction, reduce2, startState, origin, document) {
  return direction === -1 /* Backward */
    ? moveWithBackward(reduce2, startState, origin, document)
    : moveWithForward(reduce2, startState, origin, document);
}
function moveWithReachedDocumentEdge() {
  return didReachDocumentEdge;
}
function moveWithBackward(reduce2, startState, origin, document = Context.current.document) {
  didReachDocumentEdge = false;
  const currentLineText = document.lineAt(origin).text;
  let state = startState;
  for (let i = origin.character - 1; i >= 0; i--) {
    if ((state = reduce2(currentLineText[i], state)) === void 0) {
      return new vscode17.Position(origin.line, i + 1);
    }
  }
  for (let line2 = origin.line - 1; line2 >= 0; line2--) {
    const lineText = document.lineAt(line2).text;
    if ((state = reduce2("\n", state)) === void 0) {
      return new vscode17.Position(line2 + 1, 0);
    }
    for (let i = lineText.length - 1; i >= 0; i--) {
      if ((state = reduce2(lineText[i], state)) === void 0) {
        return new vscode17.Position(line2, i + 1);
      }
    }
  }
  didReachDocumentEdge = true;
  return new vscode17.Position(0, 0);
}
function moveWithForward(reduce2, startState, origin, document = Context.current.document) {
  didReachDocumentEdge = false;
  const currentLineText = document.lineAt(origin).text;
  let state = startState;
  for (let i = origin.character; i < currentLineText.length; i++) {
    if ((state = reduce2(currentLineText[i], state)) === void 0) {
      return new vscode17.Position(origin.line, i);
    }
  }
  if ((state = reduce2("\n", state)) === void 0) {
    return new vscode17.Position(origin.line, currentLineText.length);
  }
  for (let line2 = origin.line + 1; line2 < document.lineCount; line2++) {
    const lineText = document.lineAt(line2).text;
    for (let i = 0; i < lineText.length; i++) {
      if ((state = reduce2(lineText[i], state)) === void 0) {
        return new vscode17.Position(line2, i);
      }
    }
    if ((state = reduce2("\n", state)) === void 0) {
      return new vscode17.Position(line2, lineText.length);
    }
  }
  didReachDocumentEdge = true;
  return document.lineAt(document.lineCount - 1).range.end;
}
function moveWithByCharCode(direction, reduce2, startState, origin, document) {
  return direction === -1 /* Backward */
    ? moveWithByCharCodeBackward(reduce2, startState, origin, document)
    : moveWithByCharCodeForward(reduce2, startState, origin, document);
}
function moveWithByCharCodeBackward(
  reduce2,
  startState,
  origin,
  document = Context.current.document,
) {
  didReachDocumentEdge = false;
  const currentLineText = document.lineAt(origin).text;
  let state = startState;
  for (let i = origin.character - 1; i >= 0; i--) {
    if ((state = reduce2(currentLineText.charCodeAt(i), state)) === void 0) {
      return new vscode17.Position(origin.line, i + 1);
    }
  }
  for (let line2 = origin.line - 1; line2 >= 0; line2--) {
    const lineText = document.lineAt(line2).text;
    if ((state = reduce2(10, state)) === void 0) {
      return new vscode17.Position(line2 + 1, 0);
    }
    for (let i = lineText.length - 1; i >= 0; i--) {
      if ((state = reduce2(lineText.charCodeAt(i), state)) === void 0) {
        return new vscode17.Position(line2, i + 1);
      }
    }
  }
  didReachDocumentEdge = true;
  return new vscode17.Position(0, 0);
}
function moveWithByCharCodeForward(
  reduce2,
  startState,
  origin,
  document = Context.current.document,
) {
  didReachDocumentEdge = false;
  const currentLineText = document.lineAt(origin).text;
  let state = startState;
  for (let i = origin.character; i < currentLineText.length; i++) {
    if ((state = reduce2(currentLineText.charCodeAt(i), state)) === void 0) {
      return new vscode17.Position(origin.line, i);
    }
  }
  if ((state = reduce2(10, state)) === void 0) {
    return new vscode17.Position(origin.line, currentLineText.length);
  }
  for (let line2 = origin.line + 1; line2 < document.lineCount; line2++) {
    const lineText = document.lineAt(line2).text;
    for (let i = 0; i < lineText.length; i++) {
      if ((state = reduce2(lineText.charCodeAt(i), state)) === void 0) {
        return new vscode17.Position(line2, i);
      }
    }
    if ((state = reduce2(10, state)) === void 0) {
      return new vscode17.Position(line2, lineText.length);
    }
  }
  didReachDocumentEdge = true;
  return document.lineAt(document.lineCount - 1).range.end;
}
function moveWhile(direction, predicate, origin, document) {
  return direction === -1 /* Backward */
    ? moveWhileBackward(predicate, origin, document)
    : moveWhileForward(predicate, origin, document);
}
function moveWhileReachedDocumentEdge() {
  return didReachDocumentEdge;
}
function moveWhileBackward(predicate, origin, document) {
  return moveWithBackward((ch) => (predicate(ch) ? null : void 0), null, origin, document);
}
function moveWhileForward(predicate, origin, document) {
  return moveWithForward((ch) => (predicate(ch) ? null : void 0), null, origin, document);
}
function moveWhileByCharCode(direction, predicate, origin, document) {
  return direction === -1 /* Backward */
    ? moveWhileByCharCodeBackward(predicate, origin, document)
    : moveWhileByCharCodeForward(predicate, origin, document);
}
function moveWhileByCharCodeBackward(predicate, origin, document) {
  return moveWithByCharCodeBackward(
    (ch) => (predicate(ch) ? null : void 0),
    null,
    origin,
    document,
  );
}
function moveWhileByCharCodeForward(predicate, origin, document) {
  return moveWithByCharCodeForward((ch) => (predicate(ch) ? null : void 0), null, origin, document);
}
function lineByLine(direction, seek2, origin, document) {
  return direction === -1 /* Backward */
    ? lineByLineBackward(seek2, origin, document)
    : lineByLineForward(seek2, origin, document);
}
function lineByLineReachedDocumentEdge() {
  return didReachDocumentEdge;
}
function lineByLineBackward(seek2, origin, document = Context.current.document) {
  didReachDocumentEdge = false;
  const originLine = document.lineAt(origin),
    originLineText = originLine.text.slice(0, origin.character),
    originResult = seek2(originLineText, lineStart(origin.line));
  if (originResult !== void 0) {
    return originResult;
  }
  for (let line2 = origin.line - 1; line2 >= 0; line2--) {
    const lineText = document.lineAt(line2).text,
      result = seek2(lineText, lineStart(line2));
    if (result !== void 0) {
      return result;
    }
  }
  didReachDocumentEdge = true;
  return void 0;
}
function lineByLineForward(seek2, origin, document = Context.current.document) {
  didReachDocumentEdge = false;
  const originLine = document.lineAt(origin),
    originLineText = originLine.text.slice(origin.character),
    originResult = seek2(originLineText, origin);
  if (originResult !== void 0) {
    return originResult;
  }
  for (let line2 = origin.line + 1, lineCount = document.lineCount; line2 < lineCount; line2++) {
    const lineText = document.lineAt(line2).text,
      result = seek2(lineText, lineStart(line2));
    if (result !== void 0) {
      return result;
    }
  }
  didReachDocumentEdge = true;
  return void 0;
}
function skipEmptyLines(direction, origin, document = Context.current.document) {
  didReachDocumentEdge = false;
  let line2 = typeof origin === "number" ? origin : origin.line;
  while (line2 >= 0 && line2 < document.lineCount) {
    const lineLength = document.lineAt(line2).text.length;
    if (lineLength > 0) {
      return new vscode17.Position(line2, direction === -1 /* Backward */ ? lineLength : 0);
    }
    line2 += direction;
  }
  didReachDocumentEdge = true;
  return edge(direction, document);
}
function skipEmptyLinesReachedDocumentEdge() {
  return didReachDocumentEdge;
}
function skipEmptyLinesBackward(origin, document) {
  return skipEmptyLines(-1 /* Backward */, origin, document);
}
function skipEmptyLinesForward(origin, document) {
  return skipEmptyLines(1 /* Forward */, origin, document);
}
var didReachDocumentEdge;
var init_move = __esm({
  "src/api/search/move.ts"() {
    "use strict";
    init_context();
    init_positions();
    init_types();
    didReachDocumentEdge = false;
  },
});

// src/api/search/lines.ts
import * as vscode18 from "vscode";
function matchingLines(re, origin, document = Context.current.document) {
  const start2 = matchingLinesBackward(re, origin, document),
    end2 = matchingLinesForward(re, origin, document);
  return new vscode18.Range(start2, end2);
}
function matchingLinesBackward(re, origin, document = Context.current.document) {
  return (
    lineByLineBackward(
      (text4, position) => (re.test(text4) ? position : void 0),
      typeof origin === "number" ? lineStart(origin) : origin,
      document,
    ) ?? zero
  );
}
function matchingLinesForward(re, origin, document = Context.current.document) {
  return (
    lineByLineForward(
      (text4, position) => (re.test(text4) ? position : void 0),
      typeof origin === "number" ? lineStart(origin) : origin,
      document,
    ) ?? lineStart(document.lineCount - 1)
  );
}
var init_lines = __esm({
  "src/api/search/lines.ts"() {
    "use strict";
    init_move();
    init_context();
    init_positions();
  },
});

// src/api/search/move-to.ts
function moveTo(direction, string, origin, document = Context.current.document) {
  if (direction === -1 /* Backward */) {
    origin = offsetOrEdge(origin, string.length, document);
  }
  return search(direction, new RegExp(escapeForRegExp(string)), origin, void 0, document)?.[0];
}
function moveToExcluded(direction, string, origin, document) {
  const result = moveTo(direction, string, origin, document);
  if (result !== void 0 && direction === -1 /* Backward */) {
    return offset(result, string.length, document);
  }
  return result;
}
function moveToIncluded(direction, string, origin, document) {
  const result = moveTo(direction, string, origin, document);
  if (result !== void 0 && direction === 1 /* Forward */) {
    return offset(result, string.length, document);
  }
  return result;
}
var init_move_to = __esm({
  "src/api/search/move-to.ts"() {
    "use strict";
    init_search();
    init_context();
    init_positions();
    init_types();
    init_regexp();
  },
});

// src/api/search/pairs.ts
import * as vscode19 from "vscode";
function pair(open2, close) {
  if (typeof open2 === "string") {
    open2 = new RegExp(escapeForRegExp(open2), "um");
  }
  if (typeof close === "string") {
    close = new RegExp(escapeForRegExp(close), "um");
  }
  return new Pair(open2, close);
}
function surroundedBy(pairs, searchOrigin, open2 = true, document = Context.current.document) {
  let pair2;
  if (pairs.length === 1) {
    pair2 = pairs[0];
  } else {
    pair2 = new Pair(
      new RegExp(pairs.map((p) => `(${p.open.source})`).join("|"), "u"),
      new RegExp(pairs.map((p) => `(${p.close.source})`).join("|"), "u"),
    );
  }
  const startResult = pair2.searchOpening(searchOrigin);
  if (startResult === void 0) {
    return void 0;
  }
  const innerStart = offset(startResult[0], startResult[1][0].length, document),
    endResult = pair2.searchClosing(innerStart);
  if (endResult === void 0) {
    return void 0;
  }
  if (open2) {
    return new vscode19.Selection(
      startResult[0],
      offset(endResult[0], endResult[1][0].length, document),
    );
  }
  return new vscode19.Selection(innerStart, endResult[0]);
}
function closestSurroundedBy(
  pairs,
  direction,
  searchOrigin,
  open2 = true,
  document = Context.current.document,
) {
  const re = new RegExp(pairs.map((p) => `(${p.open.source})|(${p.close.source})`).join("|"), "u"),
    anchorSearch = search(direction, re, searchOrigin);
  if (anchorSearch === void 0) {
    return void 0;
  }
  const match = anchorSearch[1],
    index = match.findIndex((x, i) => i > 0 && x !== void 0) - 1,
    pairIndex = index >> 1,
    pair2 = pairs[pairIndex];
  let anchor2 = anchorSearch[0],
    active2;
  if (index & 1) {
    const activeSearch = pair2.searchOpening(anchor2);
    if (activeSearch === void 0) {
      return void 0;
    }
    if (open2) {
      anchor2 = offset(anchor2, match[0].length, document);
      active2 = activeSearch[0];
    } else {
      active2 = offset(activeSearch[0], activeSearch[1][0].length, document);
    }
  } else {
    const searchAnchor = offset(anchor2, match[0].length, document),
      activeSearch = pair2.searchClosing(searchAnchor);
    if (activeSearch === void 0) {
      return void 0;
    }
    if (open2) {
      active2 = offset(activeSearch[0], activeSearch[1][0].length, document);
    } else {
      anchor2 = searchAnchor;
      active2 = activeSearch[0];
    }
  }
  return new vscode19.Selection(anchor2, active2);
}
var Pair;
var init_pairs = __esm({
  "src/api/search/pairs.ts"() {
    "use strict";
    init_search();
    init_context();
    init_positions();
    init_types();
    init_errors();
    init_regexp();
    Pair = class {
      constructor(open2, close) {
        this.open = open2;
        this.close = close;
        const [re, group] = anyRegExp(open2, close);
        this._re = re;
        this._closeGroup = group;
      }
      searchMatching(direction, searchOrigin, balance = 1) {
        ArgumentError.validate("balance", balance !== 0, "balance cannot be null");
        const re = this._re,
          closeGroup = this._closeGroup;
        for (;;) {
          const result = search(direction, re, searchOrigin);
          if (result === void 0) {
            return void 0;
          }
          const match = result[1];
          if (match[closeGroup] === void 0) {
            balance++;
          } else {
            balance--;
          }
          if (balance === 0) {
            return result;
          }
          if (direction === 1 /* Forward */) {
            searchOrigin = offset(result[0], match[0].length);
          } else {
            searchOrigin = result[0];
          }
        }
      }
      findMatching(direction, searchOrigin, balance = 1, included = true) {
        const result = this.searchMatching(direction, searchOrigin, balance);
        if (result === void 0) {
          return void 0;
        }
        if (direction === -1 /* Backward */) {
          return included ? result[0] : offset(result[0], result[1][0].length);
        }
        return included ? offset(result[0], result[1][0].length) : result[0];
      }
      searchOpening(searchOrigin, balance = -1) {
        return this.searchMatching(-1 /* Backward */, searchOrigin, balance);
      }
      searchClosing(searchOrigin, balance = this.open.source === this.close.source ? -1 : 1) {
        return this.searchMatching(1 /* Forward */, searchOrigin, balance);
      }
    };
  },
});

// src/api/search/word.ts
import * as vscode20 from "vscode";
function categorize(charCode, isBlank, isWord) {
  return isWord(charCode)
    ? 0 /* Word */
    : charCode === 0 || isBlank(charCode)
      ? 1 /* Blank */
      : 2 /* Punctuation */;
}
function wordBoundary(direction, origin, stopAtEnd, wordCharset, context = Context.current) {
  let anchor2 = void 0,
    active2 = origin;
  const document = context.document,
    text4 = document.lineAt(active2.line).text,
    lineEndCol = context.selectionBehavior === 1 /* Caret */ ? text4.length : text4.length - 1;
  const isWord = getCharSetFunction(wordCharset, document),
    isBlank = getCharSetFunction(2 /* Blank */, document),
    isPunctuation = getCharSetFunction(4 /* Punctuation */, document);
  const isAtLineBoundary =
    direction === 1 /* Forward */
      ? active2.character >= lineEndCol
      : active2.character === 0 || active2.character === 1;
  if (isAtLineBoundary) {
    const afterEmptyLines = skipEmptyLines(direction, active2.line + direction, document);
    if (skipEmptyLinesReachedDocumentEdge()) {
      return void 0;
    }
    anchor2 = afterEmptyLines;
  } else {
    let shouldSkip;
    if (context.selectionBehavior === 2 /* Character */) {
      const col = active2.character - +((direction === -1) /* Backward */),
        characterCategory = categorize(text4.charCodeAt(col), isBlank, isWord),
        nextCharacterCategory = categorize(text4.charCodeAt(col + direction), isBlank, isWord);
      shouldSkip = characterCategory !== nextCharacterCategory;
      if (
        shouldSkip &&
        stopAtEnd === (direction === 1) /* Forward */ &&
        characterCategory === 1 /* Blank */
      ) {
        shouldSkip = false;
      }
    } else {
      shouldSkip = false;
    }
    anchor2 = shouldSkip
      ? new vscode20.Position(active2.line, active2.character + direction)
      : active2;
  }
  active2 = anchor2;
  const curLineText = document.lineAt(active2).text;
  let nextCol = active2.character;
  if (direction === -1 /* Backward */) {
    nextCol--;
  }
  if (stopAtEnd === (direction === 1) /* Forward */) {
    while (
      nextCol >= 0 &&
      nextCol < curLineText.length &&
      isBlank(curLineText.charCodeAt(nextCol))
    ) {
      nextCol += direction;
    }
  }
  if (nextCol >= 0 && nextCol < curLineText.length) {
    const startCharCode = curLineText.charCodeAt(nextCol),
      isSameCategory = isWord(startCharCode) ? isWord : isPunctuation;
    while (
      nextCol >= 0 &&
      nextCol < curLineText.length &&
      isSameCategory(curLineText.charCodeAt(nextCol))
    ) {
      nextCol += direction;
    }
  }
  if (stopAtEnd === (direction === -1) /* Backward */) {
    while (
      nextCol >= 0 &&
      nextCol < curLineText.length &&
      isBlank(curLineText.charCodeAt(nextCol))
    ) {
      nextCol += direction;
    }
  }
  if (direction === -1 /* Backward */) {
    active2 = new vscode20.Position(active2.line, nextCol + 1);
  } else {
    active2 = new vscode20.Position(active2.line, nextCol);
  }
  return new vscode20.Selection(anchor2, active2);
}
var init_word = __esm({
  "src/api/search/word.ts"() {
    "use strict";
    init_move();
    init_context();
    init_types();
    init_charset();
  },
});

// src/api/lines.ts
var lines_exports = {};
__export(lines_exports, {
  character: () => character,
  clamp: () => clamp,
  column: () => column,
  columns: () => columns,
  firstVisibleLine: () => firstVisibleLine,
  isEmpty: () => isEmpty,
  lastVisibleLine: () => lastVisibleLine,
  length: () => length3,
  middleVisibleLine: () => middleVisibleLine,
  text: () => text3,
});
import * as vscode21 from "vscode";
function firstVisibleLine(editor = Context.current.editor) {
  return editor.visibleRanges[0].start.line;
}
function middleVisibleLine(editor = Context.current.editor) {
  const range = editor.visibleRanges[0];
  return ((range.start.line + range.end.line) / 2) | 0;
}
function lastVisibleLine(editor = Context.current.editor) {
  return editor.visibleRanges[0].end.line;
}
function text3(line2, document = Context.current.document) {
  return document.lineAt(line2).text;
}
function length3(line2, document = Context.current.document) {
  return document.lineAt(line2).text.length;
}
function isEmpty(line2, document = Context.current.document) {
  return length3(line2, document) === 0;
}
function clamp(line2, document) {
  if (line2 < 0) {
    return 0;
  }
  const lastLine2 = (document ?? Context.current.document).lineCount - 1;
  if (line2 > lastLine2) {
    return lastLine2;
  }
  return line2;
}
function diffAddedByTabs(text4, editor) {
  const tabSize = editor.options.tabSize;
  let total = 0;
  for (const ch of text4) {
    if (ch === "	") {
      total += tabSize - 1;
    }
  }
  return total;
}
function getCharacter(text4, column2, editor, roundUp) {
  const tabSize = editor.options.tabSize;
  let character2 = 0;
  for (const ch of text4) {
    if (column2 <= 0) {
      break;
    }
    if (ch === "	") {
      column2 -= tabSize;
      if (!roundUp && column2 < 0) {
        break;
      }
    } else {
      column2--;
    }
    character2++;
  }
  return character2;
}
function column(line2, character2, editor) {
  if (typeof line2 === "number") {
    editor ??= Context.current.editor;
    const text5 = editor.document.lineAt(line2).text.slice(0, character2);
    return text5.length + diffAddedByTabs(text5, editor);
  }
  editor ??= Context.current.editor;
  const text4 = editor.document.lineAt(line2.line).text.slice(0, line2.character);
  return new vscode21.Position(line2.line, text4.length + diffAddedByTabs(text4, editor));
}
function character(lineOrPosition, characterOrEditor, editorOrRoundUp, roundUp) {
  if (typeof lineOrPosition === "number") {
    const line2 = lineOrPosition,
      character2 = characterOrEditor,
      editor2 = editorOrRoundUp ?? Context.current.editor;
    return getCharacter(editor2.document.lineAt(line2).text, character2, editor2, roundUp ?? false);
  }
  const position = lineOrPosition,
    editor = characterOrEditor ?? Context.current.editor;
  roundUp = editorOrRoundUp ?? false;
  const text4 = editor.document.lineAt(position.line).text;
  return new vscode21.Position(
    position.line,
    getCharacter(text4, position.character, editor, roundUp),
  );
}
function columns(line2, editor = Context.current.editor) {
  if (typeof line2 !== "number") {
    line2 = line2.line;
  }
  const text4 = editor.document.lineAt(line2).text;
  return text4.length + diffAddedByTabs(text4, editor);
}
var init_lines2 = __esm({
  "src/api/lines.ts"() {
    "use strict";
    init_context();
  },
});

// src/api/search/objects.ts
var objects_exports = {};
__export(objects_exports, {
  argument: () => argument,
  argumentEnd: () => argumentEnd,
  argumentStart: () => argumentStart,
  indent: () => indent,
  indentEnd: () => indentEnd,
  indentStart: () => indentStart,
  paragraph: () => paragraph,
  paragraphEnd: () => paragraphEnd,
  paragraphStart: () => paragraphStart,
  sentence: () => sentence,
  sentenceEnd: () => sentenceEnd,
  sentenceStart: () => sentenceStart,
});
import * as vscode22 from "vscode";
function argument(position, inner, document = Context.current.document) {
  return new vscode22.Selection(
    argumentStart(position, inner, document),
    argumentEnd(position, inner, document),
  );
}
function argumentStart(position, inner, document = Context.current.document) {
  return toArgumentEdge(position, inner, -1 /* Backward */, document);
}
function argumentEnd(position, inner, document = Context.current.document) {
  return toArgumentEdge(position, inner, 1 /* Forward */, document);
}
function indent(position, inner, document = Context.current.document) {
  const start2 = indentStart(position, inner, document),
    end2 = indentEnd(start2, inner, document);
  return new vscode22.Selection(start2, end2);
}
function indentStart(position, inner, document = Context.current.document) {
  return toIndentEdge(position, inner, -1 /* Backward */, document);
}
function indentEnd(position, inner, document = Context.current.document, start2) {
  return toIndentEdge(start2 ?? position, inner, 1 /* Forward */, document);
}
function paragraph(position, inner, document = Context.current.document) {
  let start2;
  if (
    position.line + 1 < document.lineCount &&
    isEmpty(position.line, document) &&
    !isEmpty(position.line + 1, document)
  ) {
    start2 = lineStart(position.line + 1);
  } else {
    start2 = toParagraphStart(position, document);
  }
  const end2 = toParagraphEnd(start2, inner, document);
  return new vscode22.Selection(start2, end2);
}
function paragraphStart(position, _inner, document = Context.current.document) {
  if (position.line > 0 && isEmpty(position.line, document)) {
    position = lineStart(position.line - 1);
  }
  return toParagraphStart(position, document);
}
function paragraphEnd(position, inner, document = Context.current.document, start2) {
  if (start2 !== void 0) {
    position = start2;
  }
  return toParagraphEnd(position, inner, document);
}
function sentence(position, inner, document = Context.current.document) {
  const beforeBlank = toBeforeBlank(
      position,
      document,
      /* canSkipToPrevious= */
      false,
    ),
    start2 = toSentenceStart(beforeBlank, document),
    end2 = sentenceEnd(start2, inner, document);
  return new vscode22.Selection(start2, end2);
}
function sentenceStart(position, _inner, document = Context.current.document) {
  const beforeBlank = toBeforeBlank(
    position,
    document,
    /* canSkipToPrevious= */
    true,
  );
  return toSentenceStart(beforeBlank, document);
}
function sentenceEnd(position, inner, document = Context.current.document, start2) {
  if (start2 !== void 0) {
    position = start2;
  }
  if (isEmpty(position.line, document)) {
    if (position.line + 1 >= document.lineCount || isEmpty(position.line + 1, document)) {
      return position;
    } else {
      position = lineStart(position.line + 1);
    }
  }
  const isBlank = getCharSetFunction(2 /* Blank */, document);
  let hadLf = false;
  const innerEnd = moveWhileByCharCodeForward(
    (charCode) => {
      if (charCode === 10 /* LF */) {
        if (hadLf) {
          return false;
        }
        hadLf = true;
      } else {
        hadLf = false;
        if (punctCharCodes.indexOf(charCode) >= 0) {
          return false;
        }
      }
      return true;
    },
    position,
    document,
  );
  if (moveWhileReachedDocumentEdge()) {
    return innerEnd;
  }
  if (hadLf) {
    if (inner) {
      return previous(innerEnd, document);
    }
    return innerEnd;
  }
  if (inner) {
    return innerEnd;
  }
  let col = innerEnd.character + 1;
  const text4 = document.lineAt(innerEnd.line).text;
  while (col < text4.length && isBlank(text4.charCodeAt(col))) {
    col++;
  }
  if (col >= text4.length) {
    return lineBreak(innerEnd.line, document);
  }
  return new vscode22.Position(innerEnd.line, col);
}
function toArgumentEdge(from2, inner, direction, document) {
  const paren = direction === -1 /* Backward */ ? 40 /* LParen */ : 41 /* RParen */;
  let bbalance = 0,
    pbalance = 0;
  const afterSkip = moveWhileByCharCode(
    direction,
    (charCode) => {
      if (charCode === paren && pbalance === 0 && bbalance === 0) {
        return false;
      } else if (charCode === 40 /* LParen */) {
        pbalance++;
      } else if (charCode === 91 /* LBracket */) {
        bbalance++;
      } else if (charCode === 41 /* RParen */) {
        pbalance--;
      } else if (charCode === 93 /* RBracket */) {
        bbalance--;
      } else if (pbalance !== 0 || bbalance !== 0) {
      } else if (charCode === 44 /* Comma */) {
        return false;
      }
      return true;
    },
    from2,
    document,
  );
  let end2;
  if (moveWhileReachedDocumentEdge()) {
    end2 = afterSkip;
  } else {
    const charCode = document.lineAt(afterSkip.line).text.charCodeAt(afterSkip.character);
    if (inner || charCode === paren || direction === -1 /* Backward */) {
      end2 = offset(afterSkip, -direction, document);
    } else {
      end2 = afterSkip;
    }
  }
  if (!inner) {
    return end2;
  }
  const isBlank = getCharSetFunction(2 /* Blank */, document);
  return moveWhileByCharCode(-direction, isBlank, end2, document);
}
function toIndentEdge(from2, inner, direction, document) {
  let line2 = from2.line,
    textLine = document.lineAt(line2);
  while (textLine.text.length === 0) {
    line2 += direction;
    if (line2 < 0) {
      return zero;
    }
    if (line2 >= document.lineCount) {
      return last(document);
    }
    textLine = document.lineAt(line2);
  }
  const indent3 = textLine.firstNonWhitespaceCharacterIndex;
  let lastNonBlankLine = line2;
  for (;;) {
    line2 += direction;
    if (line2 < 0) {
      return zero;
    }
    if (line2 >= document.lineCount) {
      return last(document);
    }
    textLine = document.lineAt(line2);
    if (textLine.text.length === 0) {
      continue;
    }
    if (textLine.firstNonWhitespaceCharacterIndex < indent3) {
      const resultLine = inner ? lastNonBlankLine : line2 - direction;
      return direction === -1 /* Backward */
        ? lineStart(resultLine)
        : lineBreak(resultLine, document);
    }
    lastNonBlankLine = line2;
  }
}
function toParagraphStart(position, document) {
  let line2 = position.line;
  while (line2 >= 0 && isEmpty(line2, document)) {
    line2--;
  }
  if (line2 <= 0) {
    return zero;
  }
  while (line2 > 0 && !isEmpty(line2 - 1, document)) {
    line2--;
  }
  return lineStart(line2);
}
function toParagraphEnd(position, inner, document) {
  let line2 = position.line;
  while (line2 < document.lineCount && !isEmpty(line2, document)) {
    line2++;
  }
  if (line2 >= document.lineCount) {
    return last(document);
  }
  if (inner) {
    if (line2 > 0) {
      line2--;
    }
    return lineBreak(line2, document);
  }
  while (line2 + 1 < document.lineCount && isEmpty(line2 + 1, document)) {
    line2++;
  }
  return lineBreak(line2, document);
}
function toBeforeBlank(position, document, canSkipToPrevious) {
  const isBlank = getCharSetFunction(2 /* Blank */, document);
  let jumpedOverBlankLine = false,
    hadLf = true;
  const beforeBlank = moveWhileByCharCodeBackward(
    (charCode) => {
      if (charCode === 10 /* LF */) {
        if (hadLf) {
          jumpedOverBlankLine = true;
          return canSkipToPrevious;
        }
        hadLf = true;
        return true;
      } else {
        hadLf = false;
        return isBlank(charCode);
      }
    },
    position,
    document,
  );
  if (moveWhileReachedDocumentEdge()) {
    return position;
  }
  const beforeBlankChar = document.lineAt(beforeBlank.line).text.charCodeAt(beforeBlank.character),
    hitPunctChar = punctCharCodes.includes(beforeBlankChar);
  if (jumpedOverBlankLine && (!canSkipToPrevious || !hitPunctChar)) {
    return position;
  }
  if (!hitPunctChar || canSkipToPrevious || position.line === beforeBlank.line) {
    return beforeBlank;
  }
  return position;
}
function toSentenceStart(position, document) {
  const isBlank = getCharSetFunction(2 /* Blank */, document);
  let originLineText = document.lineAt(position.line).text;
  if (originLineText.length === 0 && position.line + 1 >= document.lineCount) {
    if (position.line === 0) {
      return zero;
    }
    originLineText = document.lineAt(position.line - 1).text;
    position = new vscode22.Position(position.line - 1, originLineText.length);
  }
  if (originLineText.length === 0) {
    const nextLineText = document.lineAt(position.line + 1).text;
    let col2 = 0;
    while (col2 < nextLineText.length && isBlank(nextLineText.charCodeAt(col2))) {
      col2++;
    }
    return new vscode22.Position(position.line + 1, col2);
  }
  let first = true,
    hadLf = false;
  const afterSkip = moveWhileByCharCodeBackward(
    (charCode) => {
      if (charCode === 10 /* LF */) {
        first = false;
        if (hadLf) {
          return false;
        }
        hadLf = true;
      } else {
        hadLf = false;
        if (first) {
          first = false;
          return true;
        }
        if (punctCharCodes.indexOf(charCode) >= 0) {
          return false;
        }
      }
      return true;
    },
    position,
    document,
  );
  if (hadLf || moveWhileReachedDocumentEdge()) {
    const start2 = moveWhileByCharCodeForward(isBlank, afterSkip, document);
    if (moveWhileReachedDocumentEdge()) {
      return zero;
    }
    return start2;
  }
  let col = afterSkip.character;
  const text4 = document.lineAt(afterSkip.line).text;
  while (col < text4.length && isBlank(text4.charCodeAt(col))) {
    col++;
  }
  return new vscode22.Position(afterSkip.line, col);
}
var punctCharCodes;
var init_objects = __esm({
  "src/api/search/objects.ts"() {
    "use strict";
    init_move();
    init_context();
    init_lines2();
    init_positions();
    init_types();
    init_charset();
    init_regexp();
    Object.defineProperties(argument, {
      start: { value: argumentStart },
      end: { value: argumentEnd },
    });
    Object.defineProperties(indent, {
      start: { value: indentStart },
      end: { value: indentEnd },
    });
    Object.defineProperties(paragraph, {
      start: { value: paragraphStart },
      end: { value: paragraphEnd },
    });
    Object.defineProperties(sentence, {
      start: { value: sentenceStart },
      end: { value: sentenceEnd },
    });
    punctCharCodes = new Uint32Array(
      Array.from(".!?\xA1\xA7\xB6\xBF\u037E\u055E\u3002", (ch) => ch.charCodeAt(0)),
    );
  },
});

// src/api/registers.ts
var registers_exports = {};
__export(registers_exports, {
  clearSelections: () => clearSelections,
  clearValues: () => clearValues,
  get: () => get,
  selection: () => selection,
  selections: () => selections,
  storeSelections: () => storeSelections,
  storeValues: () => storeValues,
  updateSelections: () => updateSelections,
  updateValues: () => updateValues,
  value: () => value,
  values: () => values,
});
function get(registerOrName) {
  if (typeof registerOrName === "object") {
    return registerOrName;
  }
  return Context.current.extension.registers.get(registerOrName);
}
function values(registerOrName) {
  const register = get(registerOrName);
  try {
    register.ensureCanRead();
  } catch (e) {
    return Promise.reject(e);
  }
  return register.get();
}
async function value(registerOrName, index) {
  return (await values(registerOrName))?.[index];
}
function storeValues(registerOrName, text4) {
  const register = get(registerOrName);
  register.ensureCanWrite();
  register.set(text4);
  return text4;
}
async function updateValues(registerOrName, update2) {
  const register = get(registerOrName);
  register.ensureCanRead();
  register.ensureCanWrite();
  const newValues = await update2(await register.get());
  await register.set(newValues);
  return newValues;
}
function clearValues(registerOrName) {
  const register = get(registerOrName);
  register.ensureCanWrite();
  return register.set(void 0);
}
function selections(registerOrName) {
  const register = get(registerOrName);
  try {
    register.ensureCanReadSelections();
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve(register.getSelections());
}
async function selection(registerOrName, index) {
  return (await selections(registerOrName))?.[index];
}
function storeSelections(registerOrName, selections3) {
  const register = get(registerOrName);
  register.ensureCanWriteSelections();
  register.replaceSelectionSet(track(selections3))?.dispose();
  return selections3;
}
async function updateSelections(registerOrName, update2) {
  const register = get(registerOrName);
  register.ensureCanReadSelections();
  register.ensureCanWriteSelections();
  const newSelections = await update2(register.getSelections());
  if (newSelections === void 0) {
    register.replaceSelectionSet()?.dispose();
  } else {
    register.replaceSelectionSet(track(newSelections))?.dispose();
  }
  return newSelections;
}
function clearSelections(registerOrName) {
  const register = get(registerOrName);
  register.ensureCanWriteSelections();
  register.replaceSelectionSet()?.dispose();
  return Promise.resolve();
}
var init_registers = __esm({
  "src/api/registers.ts"() {
    "use strict";
    init_context();
    init_selections();
  },
});

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  ArgumentError: () => ArgumentError,
  Backward: () => Backward,
  CancellationError: () => CancellationError,
  Context: () => Context,
  ContextWithoutActiveEditor: () => ContextWithoutActiveEditor,
  Direction: () => Direction,
  EditNotAppliedError: () => EditNotAppliedError,
  EditorRequiredError: () => EditorRequiredError,
  EmptySelectionsError: () => EmptySelectionsError,
  Extend: () => Extend,
  Forward: () => Forward,
  InputError: () => InputError,
  Jump: () => Jump,
  LengthMismatchError: () => LengthMismatchError,
  Lines: () => lines_exports,
  NotASelectionError: () => NotASelectionError,
  Objects: () => objects_exports,
  Pair: () => Pair,
  Positions: () => positions_exports,
  Registers: () => registers_exports,
  Select: () => Select,
  SelectionBehavior: () => SelectionBehavior,
  Selections: () => selections_exports,
  Shift: () => Shift,
  assert: () => assert,
  buildCommands: () => buildCommands,
  clearCompiledFunctionsCache: () => clearCompiledFunctionsCache,
  clipboard: () => clipboard,
  closestSurroundedBy: () => closestSurroundedBy,
  command: () => command,
  commands: () => commands7,
  compileFunction: () => compileFunction,
  copy: () => copy,
  curry: () => curry,
  deindentLines: () => deindentLines,
  disableExecuteFunction: () => disableExecuteFunction,
  disableRunFunction: () => disableRunFunction,
  edit: () => edit,
  execute: () => execute,
  extension: () => extension,
  findMenu: () => findMenu,
  firstVisibleLine: () => firstVisibleLine,
  indentLines: () => indentLines,
  insert: () => insert,
  insertByIndex: () => insertByIndex,
  insertByIndexWithFullLines: () => insertByIndexWithFullLines,
  insertFlagsAtEdge: () => insertFlagsAtEdge,
  insertUndoStop: () => insertUndoStop,
  isPosition: () => isPosition,
  isRange: () => isRange2,
  isSelection: () => isSelection,
  joinLines: () => joinLines,
  keypress: () => keypress,
  keypressForRegister: () => keypressForRegister,
  lastVisibleLine: () => lastVisibleLine,
  lineByLine: () => lineByLine,
  lineByLineBackward: () => lineByLineBackward,
  lineByLineForward: () => lineByLineForward,
  lineByLineReachedDocumentEdge: () => lineByLineReachedDocumentEdge,
  manipulateSelectionsInteractively: () => manipulateSelectionsInteractively,
  mapActive: () => mapActive,
  mapBoth: () => mapBoth,
  mapEnd: () => mapEnd,
  mapStart: () => mapStart,
  matchingLines: () => matchingLines,
  matchingLinesBackward: () => matchingLinesBackward,
  matchingLinesForward: () => matchingLinesForward,
  middleVisibleLine: () => middleVisibleLine,
  moveTo: () => moveTo,
  moveToExcluded: () => moveToExcluded,
  moveToIncluded: () => moveToIncluded,
  moveWhile: () => moveWhile,
  moveWhileBackward: () => moveWhileBackward,
  moveWhileByCharCode: () => moveWhileByCharCode,
  moveWhileByCharCodeBackward: () => moveWhileByCharCodeBackward,
  moveWhileByCharCodeForward: () => moveWhileByCharCodeForward,
  moveWhileForward: () => moveWhileForward,
  moveWhileReachedDocumentEdge: () => moveWhileReachedDocumentEdge,
  moveWith: () => moveWith,
  moveWithBackward: () => moveWithBackward,
  moveWithByCharCode: () => moveWithByCharCode,
  moveWithByCharCodeBackward: () => moveWithByCharCodeBackward,
  moveWithByCharCodeForward: () => moveWithByCharCodeForward,
  moveWithForward: () => moveWithForward,
  moveWithReachedDocumentEdge: () => moveWithReachedDocumentEdge,
  notifyPromptActionRequested: () => notifyPromptActionRequested,
  pair: () => pair,
  pipe: () => pipe,
  pipeAsync: () => pipeAsync,
  prompt: () => prompt,
  promptInteractively: () => promptInteractively,
  promptLocked: () => promptLocked,
  promptMany: () => promptMany,
  promptNumber: () => promptNumber,
  promptNumberOpts: () => promptNumberOpts,
  promptOne: () => promptOne,
  promptRegexp: () => promptRegexp,
  promptRegexpOpts: () => promptRegexpOpts,
  redo: () => redo,
  regexpHistory: () => regexpHistory,
  replace: () => replace,
  replaceByIndex: () => replaceByIndex,
  rotate: () => rotate2,
  rotateContents: () => rotateContents,
  rotateSelections: () => rotateSelections,
  run: () => run,
  runIsEnabled: () => runIsEnabled,
  runParameterNames: () => runParameterNames,
  runParameterValues: () => runParameterValues,
  search: () => search,
  searchBackward: () => searchBackward,
  searchForward: () => searchForward,
  selectionsFromCharacterMode: () => selectionsFromCharacterMode,
  selectionsToCharacterMode: () => selectionsToCharacterMode,
  setRunGlobals: () => setRunGlobals,
  showLockedMenu: () => showLockedMenu,
  showLockedMenyByName: () => showLockedMenyByName,
  showMenu: () => showMenu,
  showMenuAfterDelay: () => showMenuAfterDelay,
  showMenuByName: () => showMenuByName,
  skipEmptyLines: () => skipEmptyLines,
  skipEmptyLinesBackward: () => skipEmptyLinesBackward,
  skipEmptyLinesForward: () => skipEmptyLinesForward,
  skipEmptyLinesReachedDocumentEdge: () => skipEmptyLinesReachedDocumentEdge,
  surroundedBy: () => surroundedBy,
  switchRun: () => switchRun,
  text: () => text,
  toMode: () => toMode,
  todo: () => todo,
  undo: () => undo,
  validateForSwitchRun: () => validateForSwitchRun,
  validateMenu: () => validateMenu,
  wordBoundary: () => wordBoundary,
});
import * as vscode23 from "vscode";
function extension(extensionId3) {
  return vscode23.extensions.getExtension(extensionId3)?.exports;
}
var init_api = __esm({
  "src/api/index.ts"() {
    "use strict";
    init_clipboard();
    init_context();
    init_edit();
    init_linewise();
    init_errors2();
    init_functional();
    init_history();
    init_keys();
    init_menu();
    init_modes();
    init_prompt();
    init_run();
    init_search();
    init_lines();
    init_move();
    init_move_to();
    init_pairs();
    init_word();
    init_types();
    init_lines2();
    init_lines2();
    init_objects();
    init_positions();
    init_selections();
    init_registers();
  },
});

// src/utils/constants.ts
var extensionName, extensionId, availableClipboardRegisters;
var init_constants = __esm({
  "src/utils/constants.ts"() {
    "use strict";
    extensionName = "dance";
    extensionId = `gregoire.${extensionName}`;
    availableClipboardRegisters = [..."befgijklmnopqrtvwxyz", "*", "+"];
  },
});

// src/state/editors.ts
import * as vscode24 from "vscode";
function getTotalRange(editor) {
  let minStart = editor.document.lineCount - 1,
    maxEnd = 0;
  for (const range of editor.visibleRanges) {
    minStart = Math.min(range.start.line, minStart);
    maxEnd = Math.max(range.end.line, maxEnd);
  }
  return maxEnd - minStart;
}
function isMoreInteresting(currentEditor, potentiallyMoreInteresting) {
  return getTotalRange(currentEditor) < getTotalRange(potentiallyMoreInteresting);
}
var _PerEditorState, PerEditorState, Editors;
var init_editors = __esm({
  "src/state/editors.ts"() {
    "use strict";
    init_api();
    init_constants();
    init_errors();
    _PerEditorState = class _PerEditorState {
      constructor(extension2, _editor, mode) {
        this.extension = extension2;
        this._editor = _editor;
        this._onEditorWasClosed = new vscode24.EventEmitter();
        this._onVisibilityDidChange = new vscode24.EventEmitter();
        this._isVisible = true;
        this._storage = [];
        // Changing modes.
        // =============================================================================================
        /**
         * Whether the editor is currently executing functions to change modes.
         */
        this._isChangingMode = false;
        for (let i = 0; i < _PerEditorState._registeredStates.length; i++) {
          this._storage.push(void 0);
        }
        this.setMode(mode);
      }
      /**
       * The corresponding visible `vscode.TextEditor`.
       */
      get editor() {
        return this._editor;
      }
      /**
       * The current mode of the editor.
       */
      get mode() {
        return this._mode;
      }
      /**
       * Whether the editor for which state is being kept is the active text editor.
       */
      get isActive() {
        return vscode24.window.activeTextEditor === this._editor;
      }
      /**
       * Whether the editor for which state is being kept is visible.
       */
      get isVisible() {
        return this._isVisible;
      }
      /**
       * An event which fires when the `editor` is permanently closed.
       */
      get onEditorWasClosed() {
        return this._onEditorWasClosed.event;
      }
      /**
       * An event which fires when the `editor` becomes visible or hidden. Read
       * `isVisible` to find the new value.
       */
      get onVisibilityDidChange() {
        return this._onVisibilityDidChange.event;
      }
      dispose() {
        this._clearDecorations(this._mode);
        const options = this._editor.options,
          mode = this._mode,
          vscodeMode = mode.modes.vscodeMode;
        options.cursorStyle = vscodeMode.cursorStyle;
        options.lineNumbers = vscodeMode.lineNumbers;
        if (this._isVisible) {
          this._isVisible = false;
          this._onVisibilityDidChange.fire(this);
        }
        this._onEditorWasClosed.fire(this);
        this._onEditorWasClosed.dispose();
        this._onVisibilityDidChange.dispose();
        this._modeChangeSubscription.dispose();
        for (let i = 0; i < this._storage.length; i++) {
          if (_PerEditorState._registeredStates[i]) {
            this._storage[i]?.dispose();
          }
        }
      }
      /**
       * Returns a `Token` that can later be used to store editor-specific data.
       */
      static registerState(isDisposable) {
        return this._registeredStates.push(isDisposable) - 1;
      }
      /**
       * Returns the object assigned to the given token.
       */
      get(token) {
        return this._storage[token];
      }
      /**
       * Stores a value that is related to the editor for which the state is kept.
       */
      store(token, value2) {
        const previousValue = this._storage[token];
        this._storage[token] = value2;
        return previousValue;
      }
      /**
       * Sets the mode of the editor.
       */
      async setMode(mode) {
        if (this._isChangingMode) {
          throw new Error("calling EditorState.setMode in a mode change handler is forbidden");
        }
        if (this._mode === mode) {
          return;
        }
        this._isChangingMode = true;
        const previousMode = this._mode;
        if (previousMode !== void 0) {
          this._modeChangeSubscription.dispose();
          this._clearDecorations(previousMode);
          await this._runCommands(
            previousMode.onLeaveMode,
            (e) =>
              `error trying to execute onLeaveMode commands for mode ${JSON.stringify(previousMode.name)}: ${e}`,
          );
          if (previousMode.selectionBehavior !== mode.selectionBehavior) {
            this._updateSelectionsAfterBehaviorChange(mode);
          }
        }
        this._mode = mode;
        this._modeChangeSubscription = mode.onChanged(([mode2, props]) => {
          for (const prop of props) {
            switch (prop) {
              case "cursorStyle":
                this._editor.options.cursorStyle = mode2.cursorStyle;
                break;
              case "lineNumbers":
                this._editor.options.lineNumbers = mode2.lineNumbers;
                break;
              case "decorations":
              case "lineHighlight":
              case "selectionDecorationType":
                this._updateDecorations(mode2);
                break;
              case "selectionBehavior":
                this._updateSelectionsAfterBehaviorChange(mode2);
                break;
            }
          }
        });
        this._updateDecorations(mode);
        await this._runCommands(
          mode.onEnterMode,
          (e) =>
            `error trying to execute onEnterMode commands for mode ${JSON.stringify(mode.name)}: ${e}`,
        );
        if (this.isActive) {
          await this.notifyDidBecomeActive();
        }
        this._isChangingMode = false;
        this.extension.editors.notifyDidChangeMode(this);
      }
      _runCommands(commandsToRun, error) {
        const context = new Context(this, this.extension.cancellationToken).doNotRecord();
        return this.extension.runPromiseSafely(
          () => context.runAsync(() => commands7(...commandsToRun)),
          () => void 0,
          error,
        );
      }
      // Externally-triggered events.
      // =============================================================================================
      /**
       * Called when `vscode.window.onDidChangeActiveTextEditor` is triggered with
       * this editor.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidBecomeActive() {
        const { editor, mode } = this;
        this.extension.statusBar.activeModeSegment.setContent(mode.name);
        editor.options.lineNumbers = mode.lineNumbers;
        editor.options.cursorStyle = mode.cursorStyle;
        return vscode24.commands.executeCommand("setContext", extensionName + ".mode", mode.name);
      }
      /**
       * Called when `vscode.window.onDidChangeActiveTextEditor` is triggered with
       * another editor.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidBecomeInactive(newEditorIsActive) {
        if (!newEditorIsActive) {
          this.extension.statusBar.activeModeSegment.setContent("<no active mode>");
          return vscode24.commands.executeCommand("setContext", extensionName + ".mode", void 0);
        }
        return Promise.resolve();
      }
      /**
       * Called when `vscode.window.onDidChangeTextEditorSelection` is triggered on
       * this editor.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidChangeTextEditorSelection() {
        this._updateDecorations(this._mode);
      }
      /**
       * Called when `vscode.window.onDidChangeTextEditorVisibleRanges` is triggered
       * on this editor.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidChangeTextEditorVisibleRanges() {
        this._updateOffscreenSelectionsIndicators(this._mode);
      }
      /**
       * Called when the editor becomes visible again.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidBecomeVisible(editor) {
        assert(this._editor.document === editor.document);
        this._editor = editor;
        this._isVisible = true;
        this._onVisibilityDidChange.fire(this);
      }
      /**
       * Called when the editor was hidden, but not closed.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidBecomeHidden() {
        this._isVisible = false;
        this._onVisibilityDidChange.fire(this);
      }
      // Updating decorations.
      // =============================================================================================
      _clearDecorations(mode) {
        const editor = this._editor,
          empty2 = [];
        for (const decoration of mode.decorations) {
          editor.setDecorations(decoration.type, empty2);
        }
        editor.setDecorations(this.extension.editors.characterDecorationType, empty2);
        if (mode.hiddenSelectionsIndicatorsDecorationType !== void 0) {
          editor.setDecorations(mode.hiddenSelectionsIndicatorsDecorationType, empty2);
        }
      }
      _updateDecorations(mode) {
        const editor = this._editor,
          allSelections = editor.selections;
        for (const decoration of mode.decorations) {
          const selections3 =
            decoration.applyTo === "all"
              ? allSelections
              : decoration.applyTo === "main"
                ? [allSelections[0]]
                : allSelections.slice(1);
          if (decoration.renderOptions.isWholeLine) {
            const lines2 = selections_exports.lines(selections3),
              ranges = [];
            for (let i = 0, len = lines2.length; i < len; i++) {
              const startLine = lines2[i];
              let endLine2 = startLine;
              while (i + 1 < lines2.length && lines2[i + 1] === endLine2 + 1) {
                i++;
                endLine2++;
              }
              const start2 = new vscode24.Position(startLine, 0),
                end2 = startLine === endLine2 ? start2 : new vscode24.Position(endLine2, 0);
              ranges.push(new vscode24.Range(start2, end2));
            }
            editor.setDecorations(decoration.type, ranges);
          } else {
            editor.setDecorations(decoration.type, selections3);
          }
        }
        if (mode.selectionBehavior === 2 /* Character */) {
          const document = this._editor.document,
            ranges = [];
          for (let i = 0; i < allSelections.length; i++) {
            const selection3 = allSelections[i];
            if (!selection3.isEmpty) {
              const end2 = positions_exports.next(selection3.active, document);
              if (end2 !== void 0) {
                const active2 = selection3.active,
                  start2 =
                    active2.character === 0 || active2 === selection3.start
                      ? active2
                      : new vscode24.Position(active2.line, active2.character - 1);
                ranges.push(new vscode24.Range(start2, end2));
              }
            }
          }
          editor.setDecorations(this.extension.editors.characterDecorationType, ranges);
        } else {
          editor.setDecorations(this.extension.editors.characterDecorationType, []);
        }
        editor.options.cursorStyle = mode.cursorStyle;
        editor.options.lineNumbers = mode.lineNumbers;
        this._updateOffscreenSelectionsIndicators(mode);
      }
      _updateSelectionsAfterBehaviorChange(mode) {
        const editor = this._editor,
          document = editor.document,
          selections3 = editor.selections;
        editor.selections =
          mode.selectionBehavior === 2 /* Character */
            ? selections_exports.toCharacterMode(selections3, document)
            : selections_exports.fromCharacterMode(selections3, document);
      }
      _updateOffscreenSelectionsIndicators(mode) {
        const decorationType = mode.hiddenSelectionsIndicatorsDecorationType;
        if (decorationType === void 0) {
          return;
        }
        const editor = this._editor,
          selections3 = editor.selections,
          visibleRanges = editor.visibleRanges;
        const offscreenSelections = [];
        for (const selection3 of selections3) {
          let isOffscreen = true;
          for (const visibleRange2 of visibleRanges) {
            if (selections_exports.overlap(visibleRange2, selection3)) {
              isOffscreen = false;
              break;
            }
          }
          if (isOffscreen) {
            offscreenSelections.push(selection3);
          }
        }
        if (offscreenSelections.length === 0) {
          editor.setDecorations(decorationType, []);
          return;
        }
        const sortedVisibleRanges = visibleRanges.slice(),
          decorations = [];
        sortedVisibleRanges.sort((a, b) => a.start.compareTo(b.start));
        offscreenSelections.sort((a, b) => a.start.compareTo(b.start));
        function pushDecoration(decorations2, count2, position, relatively) {
          decorations2.push({
            range: new vscode24.Range(position, position),
            renderOptions: {
              after: {
                contentText: `  ${count2} hidden selection${count2 === 1 ? "" : "s"} ${relatively}`,
              },
            },
          });
        }
        let offscreenSelectionIdx = 0;
        for (let i = 0; i < sortedVisibleRanges.length; i++) {
          const visibleRange2 = sortedVisibleRanges[i],
            visibleRangeStartLine = visibleRange2.start.line;
          let count2 = 0;
          while (
            offscreenSelections.length > offscreenSelectionIdx &&
            offscreenSelections[offscreenSelectionIdx].end.line < visibleRangeStartLine
          ) {
            offscreenSelectionIdx++;
            count2++;
          }
          if (count2 > 0) {
            pushDecoration(decorations, count2, visibleRange2.start, "above");
          }
        }
        const visibleRange = sortedVisibleRanges[sortedVisibleRanges.length - 1],
          count = offscreenSelections.length - offscreenSelectionIdx;
        if (count > 0) {
          pushDecoration(decorations, count, visibleRange.end, "below");
        }
        editor.setDecorations(decorationType, decorations);
      }
    };
    // Storage.
    // =============================================================================================
    _PerEditorState._registeredStates = [];
    PerEditorState = _PerEditorState;
    Editors = class {
      constructor(_extension) {
        this._extension = _extension;
        this._editors = /* @__PURE__ */ new Map();
        this._fallbacks = /* @__PURE__ */ new Map();
        this._onModeDidChange = new vscode24.EventEmitter();
        this._subscriptions = [];
        this._lastRemovedEditorStates = [];
        this._lastRemovedEditorUri = "";
        /**
         * @deprecated Do not access -- internal implementation detail.
         */
        this.characterDecorationType = vscode24.window.createTextEditorDecorationType({
          backgroundColor: new vscode24.ThemeColor("editor.selectionBackground"),
        });
        /**
         * An event which fires on editor mode change.
         */
        this.onModeDidChange = this._onModeDidChange.event;
        vscode24.window.onDidChangeActiveTextEditor(
          this._handleDidChangeActiveTextEditor,
          this,
          this._subscriptions,
        );
        vscode24.window.onDidChangeTextEditorSelection(
          this._handleDidChangeTextEditorSelection,
          this,
          this._subscriptions,
        );
        vscode24.window.onDidChangeTextEditorVisibleRanges(
          this._handleDidChangeTextEditorVisibleRanges,
          this,
          this._subscriptions,
        );
        vscode24.window.onDidChangeVisibleTextEditors(
          this._handleDidChangeVisibleTextEditors,
          this,
          this._subscriptions,
        );
        vscode24.workspace.onDidOpenTextDocument(
          this._handleDidOpenTextDocument,
          this,
          this._subscriptions,
        );
        vscode24.workspace.onDidCloseTextDocument(
          this._handleDidCloseTextDocument,
          this,
          this._subscriptions,
        );
        queueMicrotask(() => {
          this._handleDidChangeVisibleTextEditors(vscode24.window.visibleTextEditors);
          const activeTextEditor = vscode24.window.activeTextEditor;
          if (activeTextEditor !== void 0) {
            this._activeEditor = this._editors.get(activeTextEditor);
            this._activeEditor?.notifyDidBecomeActive();
          }
        });
      }
      /**
       * The Dance-specific state for the active `vscode.TextEditor`, or `undefined`
       * if `vscode.window.activeTextEditor === undefined`.
       */
      get active() {
        return this._activeEditor;
      }
      dispose() {
        this._subscriptions.splice(0).forEach((d) => d.dispose());
        this._lastRemovedEditorStates.splice(0).forEach((s) => s.dispose());
        this.characterDecorationType.dispose();
      }
      /**
       * Returns the Dance-specific state for the given `vscode.TextEditor`.
       */
      getState(editor) {
        const state = this._editors.get(editor);
        if (state === void 0) {
          throw new Error(
            "given editor does not have an equivalent EditorState; has it gone out of view?",
          );
        }
        return state;
      }
      _handleDidChangeActiveTextEditor(e) {
        if (e === void 0) {
          this._activeEditor?.notifyDidBecomeInactive(false);
          this._activeEditor = void 0;
        } else {
          this._activeEditor?.notifyDidBecomeInactive(true);
          this._activeEditor = this._editors.get(e);
          this._activeEditor?.notifyDidBecomeActive();
        }
      }
      _handleDidChangeTextEditorSelection(e) {
        this._editors.get(e.textEditor)?.notifyDidChangeTextEditorSelection();
      }
      _handleDidChangeTextEditorVisibleRanges(e) {
        this._editors.get(e.textEditor)?.notifyDidChangeTextEditorVisibleRanges();
      }
      _handleDidChangeVisibleTextEditors(visibleEditors) {
        const hiddenEditors = new Map(this._editors),
          addedEditors = /* @__PURE__ */ new Set();
        for (const visibleEditor of visibleEditors) {
          if (!hiddenEditors.delete(visibleEditor)) {
            addedEditors.add(visibleEditor);
          }
        }
        for (const addedEditor of addedEditors) {
          const fallback = this._fallbacks.get(addedEditor.document);
          if (fallback !== void 0) {
            fallback.notifyDidBecomeVisible(addedEditor);
            this._editors.set(addedEditor, fallback);
            this._fallbacks.delete(addedEditor.document);
          } else {
            const defaultMode = this._getDefaultModeForEditor(addedEditor);
            this._editors.set(
              addedEditor,
              new PerEditorState(this._extension, addedEditor, defaultMode),
            );
          }
        }
        const addedFallbacks = /* @__PURE__ */ new Set();
        for (const [hiddenEditor, state] of hiddenEditors) {
          this._editors.delete(hiddenEditor);
          const fallback = this._fallbacks.get(hiddenEditor.document);
          if (fallback === void 0) {
            this._fallbacks.set(hiddenEditor.document, state);
            addedFallbacks.add(hiddenEditor.document);
          } else if (isMoreInteresting(fallback.editor, hiddenEditor)) {
            fallback.dispose();
            this._fallbacks.set(hiddenEditor.document, state);
            addedFallbacks.add(hiddenEditor.document);
          } else {
            state.dispose();
          }
        }
        for (const addedFallback of addedFallbacks) {
          this._fallbacks.get(addedFallback).notifyDidBecomeHidden();
        }
      }
      /**
       * Returns the default mode for a new editor, respecting language-specific
       * overrides of `dance.defaultMode`.
       */
      _getDefaultModeForEditor(editor) {
        const config = vscode24.workspace.getConfiguration(extensionName, editor.document);
        const defaultModeName = config.get("defaultMode");
        if (defaultModeName !== void 0) {
          const mode = this._extension.modes.get(defaultModeName);
          if (mode !== void 0) {
            return mode;
          }
        }
        return this._extension.modes.defaultMode;
      }
      _handleDidOpenTextDocument(document) {
        if (document.uri.toString() === this._lastRemovedEditorUri) {
          const states = this._lastRemovedEditorStates;
          let i = 0;
          for (const editor of vscode24.window.visibleTextEditors) {
            if (editor.document === document && i < states.length) {
              this._editors.set(editor, states[i++]);
            }
          }
          assert(i === states.length);
        } else {
          for (const state of this._lastRemovedEditorStates) {
            state.dispose();
          }
        }
        this._lastRemovedEditorStates.length = 0;
        this._lastRemovedEditorUri = "";
      }
      _handleDidCloseTextDocument(document) {
        for (const state of this._lastRemovedEditorStates) {
          state.dispose();
        }
        this._lastRemovedEditorStates.length = 0;
        const fallback = this._fallbacks.get(document);
        if (fallback !== void 0) {
          this._fallbacks.delete(document);
          fallback.dispose();
        } else {
          this._lastRemovedEditorUri = document.uri.toString();
          for (const editor of vscode24.window.visibleTextEditors) {
            if (editor.document === document) {
              const state = this._editors.get(editor);
              if (state !== void 0) {
                this._editors.delete(editor);
                this._lastRemovedEditorStates.push(state);
              }
            }
          }
        }
      }
      /**
       * @deprecated Do not call -- internal implementation detail.
       */
      notifyDidChangeMode(state) {
        this._onModeDidChange.fire(state);
      }
    };
  },
});

// src/utils/settings-validator.ts
import * as vscode25 from "vscode";
var SettingsValidator;
var init_settings_validator = __esm({
  "src/utils/settings-validator.ts"() {
    "use strict";
    SettingsValidator = class _SettingsValidator {
      constructor(...path) {
        this.path = [];
        this.errors = [];
        this.path.push(...path);
      }
      enter(property) {
        this.path.push(property);
      }
      leave() {
        this.path.pop();
      }
      forProperty(property, f) {
        this.enter(property);
        try {
          return f(this);
        } finally {
          this.leave();
        }
      }
      reportInvalidSetting(message, name) {
        const suffix = name === void 0 ? "" : "." + name;
        this.errors.push(`${this.path.join(".")}${suffix}: ${message}`);
      }
      displayErrorIfNeeded() {
        const errors = this.errors;
        if (errors.length === 0) {
          return;
        }
        return vscode25.window.showErrorMessage("Invalid settings: " + errors.join(" \u2014 "));
      }
      throwErrorIfNeeded() {
        const errors = this.errors;
        if (errors.length === 0) {
          return;
        }
        throw new Error("Invalid settings: " + errors.join(" \u2014 "));
      }
      static displayErrorIfNeeded(path, f) {
        const validator = new _SettingsValidator(path),
          result = f(validator);
        validator.displayErrorIfNeeded();
        return result;
      }
      static throwErrorIfNeeded(path, f) {
        const validator = new _SettingsValidator(path),
          result = f(validator);
        validator.throwErrorIfNeeded();
        return result;
      }
    };
  },
});

// src/state/modes.ts
import * as vscode26 from "vscode";
var Mode, Modes;
var init_modes2 = __esm({
  "src/state/modes.ts"() {
    "use strict";
    init_api();
    init_constants();
    init_settings_validator();
    Mode = class _Mode {
      constructor(modes, name, rawConfiguration, isPendingDeletion = false) {
        this.modes = modes;
        this.name = name;
        this.isPendingDeletion = isPendingDeletion;
        this._onChanged = new vscode26.EventEmitter();
        this._onDeleted = new vscode26.EventEmitter();
        this._raw = {};
        this._cursorStyle = vscode26.TextEditorCursorStyle.Line;
        this._lineNumbers = vscode26.TextEditorLineNumbersStyle.On;
        this._selectionBehavior = 1 /* Caret */;
        this._onEnterMode = [];
        this._onLeaveMode = [];
        this._decorations = [];
        this._inheritsFrom = modes.vscodeMode;
        this._raw = {};
        if (rawConfiguration != null) {
          this.apply(rawConfiguration, new SettingsValidator());
        }
        this._changeSubscription = this._inheritsFrom?.onChanged(this._onParentModeChanged, this);
      }
      get onChanged() {
        return this._onChanged.event;
      }
      get onDeleted() {
        return this._onDeleted.event;
      }
      get inheritsFrom() {
        return this._inheritsFrom;
      }
      get cursorStyle() {
        return this._cursorStyle;
      }
      get lineNumbers() {
        return this._lineNumbers;
      }
      get lineHighlight() {
        return this._lineHighlight;
      }
      get selectionDecorationType() {
        return this._selectionDecorationType;
      }
      get hiddenSelectionsIndicatorsDecorationType() {
        return this._hiddenSelectionsIndicatorsDecorationType;
      }
      get selectionBehavior() {
        return this._selectionBehavior;
      }
      get onEnterMode() {
        return this._onEnterMode;
      }
      get onLeaveMode() {
        return this._onLeaveMode;
      }
      get decorations() {
        return this._decorations;
      }
      /**
       * @deprecated Avoid using this property directly.
       */
      get raw() {
        return this._raw;
      }
      /**
       * Disposes of the mode.
       */
      dispose() {
        this._changeSubscription?.dispose();
        this._onDeleted.fire(this);
        this._onChanged.dispose();
        this._onDeleted.dispose();
      }
      _onParentModeChanged([inheritFrom, keys]) {
        const updated = [];
        for (const key of keys) {
          if (inheritFrom[key] !== this[key] && key !== "inheritsFrom") {
            updated.push(key);
          }
        }
        if (updated.length > 0) {
          this.apply(this._raw, new SettingsValidator());
          this._onChanged.fire([this, updated]);
        }
      }
      /**
       * Updates an underlying value of the mode.
       */
      update(key, value2) {
        if (this[key] === value2) {
          return;
        }
        this[key] = value2;
        this._onChanged.fire([this, [key.slice(1)]]);
      }
      /**
       * Applies a new configuration to the mode, notifying subscribers of changes
       * if needed.
       */
      apply(raw, validator) {
        const willInheritFrom =
          raw.inheritFrom == null
            ? this.modes.vscodeMode
            : this.modes.getOrCreateDummy(raw.inheritFrom);
        const changedProperties = [];
        if (willInheritFrom !== this._inheritsFrom) {
          this._changeSubscription?.dispose();
          this._inheritsFrom = willInheritFrom;
          this._changeSubscription = willInheritFrom.onChanged(this._onParentModeChanged, this);
          changedProperties.push("inheritsFrom");
        }
        const up = willInheritFrom,
          top = this.modes.vscodeMode,
          map2 = (rawName, name, convert) => {
            const value2 = raw[rawName];
            if (value2 === void 0 || value2 === "inherit") {
              return up[name];
            }
            if (value2 === null) {
              return top[name];
            }
            return validator.forProperty(rawName, (validator2) => convert(value2, validator2));
          };
        const cursorStyle = map2(
          "cursorStyle",
          "cursorStyle",
          _Mode.cursorStyleStringToCursorStyle,
        );
        if (this._cursorStyle !== cursorStyle) {
          this._cursorStyle = cursorStyle;
          changedProperties.push("cursorStyle");
        }
        const lineNumbers = map2(
          "lineNumbers",
          "lineNumbers",
          _Mode.lineNumbersStringToLineNumbersStyle,
        );
        if (this._lineNumbers !== lineNumbers) {
          this._lineNumbers = lineNumbers;
          changedProperties.push("lineNumbers");
        }
        const selectionBehavior = map2(
          "selectionBehavior",
          "selectionBehavior",
          _Mode.selectionBehaviorStringToSelectionBehavior,
        );
        if (this._selectionBehavior !== selectionBehavior) {
          this._selectionBehavior = selectionBehavior;
          changedProperties.push("selectionBehavior");
        }
        const disposePreviousDecorations = this._raw?.decorations != null;
        let decorations = raw.decorations;
        if (decorations === void 0) {
          if (this._raw.decorations !== void 0) {
            if (disposePreviousDecorations) {
              this._decorations.forEach((d) => d.type.dispose());
            }
            this._decorations = up._decorations;
            changedProperties.push("decorations");
          }
        } else if (decorations === null) {
          if (this._raw.decorations !== null) {
            if (disposePreviousDecorations) {
              this._decorations.forEach((d) => d.type.dispose());
            }
            this._decorations = top._decorations;
            changedProperties.push("decorations");
          }
        } else if (JSON.stringify(decorations) !== JSON.stringify(this._raw?.decorations)) {
          if (!Array.isArray(decorations)) {
            decorations = [decorations];
          }
          if (disposePreviousDecorations) {
            this._decorations.forEach((d) => d.type.dispose());
          }
          validator.enter("decorations");
          this._decorations = decorations.flatMap((d) => {
            const validatorErrors = validator.errors.length,
              renderOptions = _Mode.decorationObjectToDecorationRenderOptions(d, validator),
              applyTo = _Mode.applyToStringToApplyTo(d.applyTo ?? "all", validator);
            if (validator.errors.length > validatorErrors) {
              return [];
            }
            return [
              {
                applyTo,
                renderOptions,
                type: vscode26.window.createTextEditorDecorationType(renderOptions),
              },
            ];
          });
          validator.leave();
          changedProperties.push("decorations");
        }
        const hiddenSelectionsIndicatorsDecoration = map2(
          "hiddenSelectionsIndicatorsDecoration",
          "hiddenSelectionsIndicatorsDecorationType",
          _Mode.decorationObjectToDecorationRenderOptions,
        );
        if (
          hiddenSelectionsIndicatorsDecoration === void 0 ||
          Object.keys(hiddenSelectionsIndicatorsDecoration).length === 0
        ) {
          if (this._raw?.hiddenSelectionsIndicatorsDecoration != null) {
            this._hiddenSelectionsIndicatorsDecorationType.dispose();
          }
          this._hiddenSelectionsIndicatorsDecorationType = void 0;
          changedProperties.push("hiddenSelectionsIndicatorsDecorationType");
        } else if (
          hiddenSelectionsIndicatorsDecoration !== this._hiddenSelectionsIndicatorsDecorationType
        ) {
          if ("key" in hiddenSelectionsIndicatorsDecoration) {
            this._hiddenSelectionsIndicatorsDecorationType = hiddenSelectionsIndicatorsDecoration;
            changedProperties.push("hiddenSelectionsIndicatorsDecorationType");
          } else if (
            JSON.stringify(raw.hiddenSelectionsIndicatorsDecoration) !==
            JSON.stringify(this._raw.hiddenSelectionsIndicatorsDecoration)
          ) {
            this._hiddenSelectionsIndicatorsDecorationType =
              vscode26.window.createTextEditorDecorationType(hiddenSelectionsIndicatorsDecoration);
            changedProperties.push("hiddenSelectionsIndicatorsDecorationType");
          }
        }
        this._onEnterMode = raw.onEnterMode ?? [];
        this._onLeaveMode = raw.onLeaveMode ?? [];
        this._raw = raw;
        if (changedProperties.length > 0) {
          this._onChanged.fire([this, changedProperties]);
        }
      }
      /**
       * Validates and converts a string to a `vscode.TextEditorLineNumbersStyle`
       * enum value.
       */
      static lineNumbersStringToLineNumbersStyle(lineNumbers, validator) {
        switch (lineNumbers) {
          case "on":
            return vscode26.TextEditorLineNumbersStyle.On;
          case "off":
            return vscode26.TextEditorLineNumbersStyle.Off;
          case "relative":
            return vscode26.TextEditorLineNumbersStyle.Relative;
          default:
            validator.reportInvalidSetting(
              `unrecognized lineNumbers "${lineNumbers}"`,
              "lineNumbers",
            );
            return vscode26.TextEditorLineNumbersStyle.On;
        }
      }
      /**
       * Validates and converts a string to a `vscode.TextEditorCursorStyle` enum
       * value.
       */
      static cursorStyleStringToCursorStyle(cursorStyle, validator) {
        switch (cursorStyle) {
          case "block":
            return vscode26.TextEditorCursorStyle.Block;
          case "block-outline":
            return vscode26.TextEditorCursorStyle.BlockOutline;
          case "line":
            return vscode26.TextEditorCursorStyle.Line;
          case "line-thin":
            return vscode26.TextEditorCursorStyle.LineThin;
          case "underline":
            return vscode26.TextEditorCursorStyle.Underline;
          case "underline-thin":
            return vscode26.TextEditorCursorStyle.UnderlineThin;
          default:
            validator.reportInvalidSetting(
              `unrecognized cursorStyle "${cursorStyle}"`,
              "cursorStyle",
            );
            return vscode26.TextEditorCursorStyle.Line;
        }
      }
      /**
       * Validates and converts a string to a `SelectionBehavior` enum value.
       */
      static selectionBehaviorStringToSelectionBehavior(behavior, validator) {
        switch (behavior) {
          case "character":
            return 2 /* Character */;
          case "caret":
            return 1 /* Caret */;
          default:
            validator.reportInvalidSetting(
              `unrecognized selectionBehavior "${behavior}"`,
              "selectionBehavior",
            );
            return 1 /* Caret */;
        }
      }
      /**
       * Validates and converts a configuration decoration to an actual
       * `vscode.DecorationRenderOptions` object.
       */
      static decorationObjectToDecorationRenderOptions(object2, validator, root = true) {
        const options = {};
        for (const name of ["backgroundColor", "borderColor"]) {
          const value2 = object2[name];
          if (value2) {
            validator.forProperty(
              name,
              (v) => (options[name] = _Mode.stringToColor(value2, v, "#000")),
            );
          }
        }
        for (const name of ["borderRadius", "borderStyle", "borderWidth", "fontStyle"]) {
          const value2 = object2[name];
          if (value2) {
            options[name] = value2;
          }
        }
        for (const name of ["isWholeLine"]) {
          const value2 = object2[name];
          if (value2 != null) {
            options[name] = !!object2[name];
          }
        }
        if (root) {
          for (const name of ["after", "before"]) {
            const value2 = object2[name];
            if (value2 != null) {
              validator.forProperty(
                name,
                (v) =>
                  (options[name] = _Mode.decorationObjectToDecorationRenderOptions(
                    value2,
                    v,
                    /* root= */
                    false,
                  )),
              );
            }
          }
        } else {
          for (const name of ["color"]) {
            const value2 = object2[name];
            if (value2 != null) {
              validator.forProperty(
                name,
                (v) => (options[name] = _Mode.stringToColor(value2, v, "#000")),
              );
            }
          }
        }
        return options;
      }
      /**
       * Validates and converts a string value to a valid `applyTo` value.
       */
      static applyToStringToApplyTo(value2, validator) {
        const applyTo = value2;
        if (!["all", "main", "secondary"].includes(applyTo)) {
          validator.reportInvalidSetting(
            `unrecognized applyTo ${JSON.stringify(applyTo)}`,
            "applyTo",
          );
          return "all";
        }
        return applyTo;
      }
      /**
       * Validates and converts a string value to a string color or
       * `vscode.ThemeColor`.
       */
      static stringToColor(value2, validator, invalidValue = "") {
        if (typeof value2 !== "string" || value2.length === 0) {
          validator.reportInvalidSetting("color must be a non-empty string");
          return invalidValue;
        }
        if (value2[0] === "$") {
          if (/^\$[\w]+(\.\w+)*$/.test(value2)) {
            return new vscode26.ThemeColor(value2.slice(1));
          }
          validator.reportInvalidSetting("invalid color reference " + value2);
          return invalidValue;
        }
        if (value2[0] === "#") {
          if (/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/.test(value2)) {
            return value2;
          }
          validator.reportInvalidSetting("invalid color " + value2);
          return invalidValue;
        }
        if (value2.startsWith("rgb")) {
          if (
            /^rgb\( *\d+ *, *\d+ *, *\d+ *\)$|^rgba\( *\d+ *, *\d+ *, *\d+ *, *\d+ *\)$/.test(
              value2,
            )
          ) {
            return value2;
          }
          validator.reportInvalidSetting("invalid color " + value2);
          return invalidValue;
        }
        validator.reportInvalidSetting("unknown color format " + value2);
        return invalidValue;
      }
    };
    Modes = class {
      constructor(extension2) {
        this._vscodeModeDefaults = {
          cursorStyle: "line",
          inheritFrom: null,
          lineHighlight: null,
          lineNumbers: "on",
          selectionBehavior: "caret",
          decorations: [],
        };
        this._vscodeMode = new Mode(this, "", void 0);
        this._inputModeDefaults = {
          cursorStyle: "underline-thin",
        };
        this._inputMode = new Mode(this, "input", this._inputModeDefaults);
        this._modes = /* @__PURE__ */ new Map();
        this._defaultMode = new Mode(this, "default", {});
        for (const builtin of [this._defaultMode, this._inputMode, this._vscodeMode]) {
          this._modes.set(builtin.name, builtin);
        }
        this._vscodeMode.apply(this._vscodeModeDefaults, new SettingsValidator());
        this._observePreferences(extension2);
      }
      dispose() {
        for (const mode of this._modes.values()) {
          mode.dispose();
        }
        this._modes.clear();
      }
      /**
       * The default mode configured using `dance.defaultMode`.
       */
      get defaultMode() {
        return this._defaultMode;
      }
      /**
       * The input mode, set when awaiting user input.
       */
      get inputMode() {
        return this._inputMode;
      }
      /**
       * The "VS Code" mode, which represents the settings assigned to the editor
       * without taking Dance settings into account.
       */
      get vscodeMode() {
        return this._vscodeMode;
      }
      /**
       * Returns the `Mode` with the given name, or `undefined` if no such mode is
       * defined.
       */
      get(name) {
        return this._modes.get(name);
      }
      /**
       * Returns the `Mode` with the given name, or creates one if no such mode is
       * defined.
       */
      getOrCreateDummy(name) {
        let mode = this._modes.get(name);
        if (mode === void 0) {
          this._modes.set(
            name,
            (mode = new Mode(
              this,
              name,
              {},
              /* isPendingDeletion= */
              true,
            )),
          );
        }
        return mode;
      }
      [Symbol.iterator]() {
        return this._modes.values();
      }
      *userModes() {
        for (const mode of this._modes.values()) {
          if (mode.name !== "input" && !mode.isPendingDeletion) {
            yield mode;
          }
        }
      }
      /**
       * Starts listening to changes in user preferences that may lead to updates to
       * user modes.
       */
      _observePreferences(extension2) {
        extension2.observePreference(
          ".modes",
          (value2, validator, inspect) => {
            let isEmpty2 = true;
            const removeModes = new Set(this._modes.keys()),
              expectedDefaultModeName = vscode26.workspace
                .getConfiguration(extensionName)
                .get("defaultMode");
            removeModes.delete(this.inputMode.name);
            removeModes.delete(this._defaultMode.name);
            for (const modeName in value2) {
              removeModes.delete(modeName);
              let mode = this._modes.get(modeName),
                configuration = value2[modeName];
              if (mode === this._vscodeMode) {
                configuration = { ...this._vscodeModeDefaults, ...configuration };
              } else if (mode === this._inputMode) {
                configuration = { ...this._inputModeDefaults, ...configuration };
              } else {
                isEmpty2 = false;
              }
              if (!vscode26.workspace.isTrusted) {
                const globalConfig = inspect.globalValue?.[modeName],
                  defaultConfig = inspect.defaultValue?.[modeName];
                if (globalConfig !== void 0 || defaultConfig !== void 0) {
                  configuration.onEnterMode =
                    globalConfig?.onEnterMode ?? defaultConfig?.onEnterMode;
                  configuration.onLeaveMode =
                    globalConfig?.onLeaveMode ?? defaultConfig?.onLeaveMode;
                }
              }
              if (mode === void 0) {
                this._modes.set(modeName, (mode = new Mode(this, modeName, configuration)));
                if (modeName === expectedDefaultModeName) {
                  this._defaultMode.dispose();
                  this._defaultMode = mode;
                }
              } else {
                mode.isPendingDeletion = false;
                mode.apply(configuration, validator);
              }
            }
            const contributedModes = {
              ...vscode26.extensions.getExtension(extensionId).packageJSON.contributes.configuration
                .properties["dance.modes"].default,
            };
            for (const extension3 of vscode26.extensions.all) {
              const extensionModes =
                extension3.packageJSON?.contributes?.configurationDefaults?.["dance.modes"] ?? {};
              for (const modeName in extensionModes) {
                contributedModes[modeName] ??= extensionModes[modeName];
              }
            }
            for (const modeName in contributedModes) {
              removeModes.delete(modeName);
              const configuration = contributedModes[modeName];
              let mode = this._modes.get(modeName);
              if (mode === void 0) {
                this._modes.set(modeName, (mode = new Mode(this, modeName, configuration)));
                if (modeName === expectedDefaultModeName) {
                  this._defaultMode.dispose();
                  this._defaultMode = mode;
                }
              } else if (mode.isPendingDeletion) {
                mode.isPendingDeletion = false;
                mode.apply(configuration, validator);
              }
            }
            if (isEmpty2) {
              validator.reportInvalidSetting("at least one mode must be defined");
            }
            const actualDefaultModeName = this._defaultMode.name;
            for (const modeName of removeModes) {
              if (modeName === actualDefaultModeName) {
                validator.reportInvalidSetting(
                  "default mode was removed, please update dance.defaultMode",
                );
              } else {
                this._modes.get(modeName).dispose();
              }
              this._modes.delete(modeName);
            }
          },
          true,
        );
        extension2.observePreference(
          ".defaultMode",
          (value2, validator) => {
            if (value2 === "input" || value2 === "") {
              return validator.reportInvalidSetting(`mode cannot be used as default: "${value2}"`);
            }
            const mode = this._modes.get(value2);
            if (mode === void 0) {
              return validator.reportInvalidSetting("mode does not exist: " + value2);
            }
            if (!this._modes.has(this._defaultMode.name)) {
              this._defaultMode.dispose();
            }
            this._defaultMode = mode;
          },
          true,
        );
        extension2.observePreference(
          "editor.cursorStyle",
          (value2, validator) => {
            this._vscodeModeDefaults.cursorStyle = value2;
            this._vscodeMode.apply({ ...this._vscodeModeDefaults }, validator);
          },
          true,
        );
        extension2.observePreference(
          "editor.lineNumbers",
          (value2, validator) => {
            this._vscodeModeDefaults.lineNumbers = value2;
            this._vscodeMode.apply({ ...this._vscodeModeDefaults }, validator);
          },
          true,
        );
      }
    };
  },
});

// src/commands/index.ts
import * as vscode27 from "vscode";
var CommandDescriptor;
var init_commands = __esm({
  "src/commands/index.ts"() {
    "use strict";
    init_api();
    CommandDescriptor = class _CommandDescriptor {
      constructor(identifier, handler, flags) {
        this.identifier = identifier;
        this.handler = handler;
        this.flags = flags;
        Object.freeze(this);
      }
      get requiresActiveEditor() {
        return (this.flags & _CommandDescriptor.Flags.RequiresActiveEditor) !== 0;
      }
      get shouldBeReplayed() {
        return (this.flags & _CommandDescriptor.Flags.DoNotReplay) === 0;
      }
      /**
       * Executes the command with the given argument.
       */
      replay(context, argument2) {
        return this.handler(context, argument2);
      }
      /**
       * Invokes the command with the given argument.
       */
      async invoke(extension2, argument2) {
        const context = Context.create(extension2, this);
        if (this.requiresActiveEditor && !(context instanceof Context)) {
          throw new EditorRequiredError();
        }
        const ownedArgument = Object.assign({}, argument2);
        if (ownedArgument["count"] === void 0 && extension2.currentCount !== 0) {
          ownedArgument["count"] = extension2.currentCount;
        }
        if (ownedArgument["register"] === void 0 && extension2.currentRegister !== void 0) {
          ownedArgument["register"] = extension2.currentRegister;
        }
        if (ownedArgument["record"] === false) {
          context.doNotRecord();
        }
        extension2.currentCount = 0;
        extension2.currentRegister = void 0;
        let result;
        try {
          result = await this.handler(context, ownedArgument);
        } catch (e) {
          if (ownedArgument.try) {
            return;
          }
          throw e;
        }
        if (context.shouldRecord()) {
          extension2.recorder.recordCommand(this, ownedArgument);
        }
        if (this.requiresActiveEditor) {
          await context.insertUndoStop();
        }
        return result;
      }
      /**
       * Invokes the command with the given argument, ensuring that errors are
       * reporting to the user instead of throwing them.
       */
      invokeSafely(extension2, argument2) {
        return extension2.runPromiseSafely(
          () => this.invoke(extension2, argument2),
          () => void 0,
          (e) => `error executing command "${this.identifier}": ${e.message}`,
        );
      }
      /**
       * Registers the command for use by VS Code.
       */
      register(extension2) {
        return vscode27.commands.registerCommand(this.identifier, (argument2) =>
          this.invokeSafely(extension2, argument2),
        );
      }
    };
    ((CommandDescriptor2) => {
      let Flags2;
      ((Flags3) => {
        Flags3[(Flags3["None"] = 0)] = "None";
        Flags3[(Flags3["RequiresActiveEditor"] = 1)] = "RequiresActiveEditor";
        Flags3[(Flags3["DoNotReplay"] = 2)] = "DoNotReplay";
      })((Flags2 = CommandDescriptor2.Flags || (CommandDescriptor2.Flags = {})));
    })(CommandDescriptor || (CommandDescriptor = {}));
  },
});

// src/state/recorder.ts
import * as vscode28 from "vscode";
var Recorder,
  Cursor,
  ActiveRecording,
  Recording,
  _BaseEntry,
  BaseEntry,
  BreakEntry,
  TranslateSelectionEntry,
  InsertBeforeEntry,
  InsertAfterEntry,
  DeleteBeforeEntry,
  DeleteAfterEntry,
  ReplaceWithEntry,
  ChangeTextEditorEntry,
  ChangeTextEditorModeEntry,
  ExecuteCommandEntry,
  ExecuteExternalCommandEntry,
  EntryClasses,
  Entry,
  sortedEntries;
var init_recorder = __esm({
  "src/state/recorder.ts"() {
    "use strict";
    init_api();
    init_commands();
    init_errors();
    init_misc();
    Recorder = class {
      constructor(extension2) {
        this._onDidAddEntry = new vscode28.EventEmitter();
        this._previousBuffers = [];
        this._storedObjects = [];
        this._storedObjectsMap = /* @__PURE__ */ new Map();
        this._subscriptions = [];
        this._buffer = [0];
        this._activeRecordingTokens = [];
        const activeEditor2 = vscode28.window.activeTextEditor;
        if (activeEditor2 !== void 0) {
          this._activeDocument = activeEditor2.document;
          this._lastActiveSelections = activeEditor2.selections;
        }
        this._subscriptions.push(
          vscode28.window.onDidChangeActiveTextEditor(this._recordActiveTextEditorChange, this),
          vscode28.window.onDidChangeTextEditorSelection(this._recordExternalSelectionChange, this),
          vscode28.workspace.onDidChangeTextDocument(this._recordExternalTextChange, this),
          extension2.editors.onModeDidChange(this._recordActiveTextEditorModeChange, this),
        );
        this._statusBar = extension2.statusBar;
        this._descriptors = Object.values(extension2.commands);
      }
      get onDidAddEntry() {
        return this._onDidAddEntry.event;
      }
      /**
       * {@link Entry} is re-exported here since it defines important values, and
       * cannot be imported directly from API functions.
       */
      get Entry() {
        return Entry;
      }
      dispose() {
        this._activeRecordingTokens.splice(0).forEach((d) => d.dispose());
        this._subscriptions.splice(0).forEach((d) => d.dispose());
      }
      /**
       * Returns the last 100 entries of the recorder, for debugging purposes.
       */
      get debugBuffer() {
        return this.lastEntries(100);
      }
      /**
       * Returns the last `n` entries.
       */
      lastEntries(n) {
        const entries = [],
          cursor = this.cursorFromEnd();
        for (let i = 0; i < n && cursor.previous(); i++) {
          entries.push(cursor.entry());
        }
        return entries.reverse();
      }
      /**
       * Returns the last entry.
       */
      lastEntry() {
        const cursor = this.cursorFromEnd();
        if (!cursor.previous()) {
          return void 0;
        }
        return cursor.entry();
      }
      /**
       * Records an action to the current buffer.
       */
      _record(type, ...args) {
        this._buffer[this._buffer.length - 1] |= type.id;
        this._buffer.push(...args, type.id << 8 /* PrevShift */);
        this._archiveBufferIfNeeded();
        this._onDidAddEntry.fire(this.lastEntry());
      }
      /**
       * Archives the current buffer to `_previousBuffers` if its size exceeded a
       * threshold and if no recording is currently ongoing.
       */
      _archiveBufferIfNeeded() {
        if (this._activeRecordingTokens.length > 0 || this._buffer.length < 8192) {
          return;
        }
        this._previousBuffers.push(this._buffer);
        this._buffer = [];
      }
      _storeObject(value2) {
        let i = this._storedObjectsMap.get(value2);
        if (i === void 0) {
          this._storedObjectsMap.set(value2, (i = this._storedObjects.push(value2) - 1));
        }
        return i;
      }
      /**
       * Returns the number of available buffers.
       */
      get bufferCount() {
        return this._previousBuffers.length + 1;
      }
      /**
       * Returns the buffer at the given index, if any.
       */
      getBuffer(index) {
        return index === this._previousBuffers.length ? this._buffer : this._previousBuffers[index];
      }
      /**
       * Returns the stored object at the given index.
       */
      getObject(index) {
        return this._storedObjects[index];
      }
      /**
       * Returns the stored string at the given index.
       */
      getString(index) {
        return this._storedObjects[index];
      }
      /**
       * Returns the command descriptor at the given index.
       */
      getDescriptor(index) {
        return this._descriptors[index];
      }
      /**
       * Returns the entry at the given index.
       */
      entry(buffer2, index) {
        const entryId = buffer2[index] & 255 /* NextMask */;
        return Entry.instantiate(entryId, this, buffer2, index);
      }
      /**
       * Returns a `Cursor` starting at the start of the recorder.
       */
      cursorFromStart() {
        return new Cursor(this, 0, 0);
      }
      /**
       * Returns a `Cursor` starting at the end of the recorder at the time of the
       * call.
       */
      cursorFromEnd() {
        return new Cursor(
          this,
          this._previousBuffers.length,
          this._buffer.length === 0 ? 0 : this._buffer.length - 1,
        );
      }
      /**
       * Returns a `Cursor` starting at the start of the specified recording.
       */
      fromRecordingStart(recording) {
        let bufferIdx = this._previousBuffers.indexOf(recording.buffer);
        if (bufferIdx === -1) {
          assert(recording.buffer === this._buffer);
          bufferIdx = this._previousBuffers.length;
        }
        return new Cursor(this, bufferIdx, recording.offset);
      }
      /**
       * Returns a `Cursor` starting at the end of the specified recording.
       */
      fromRecordingEnd(recording) {
        let bufferIdx = this._previousBuffers.indexOf(recording.buffer);
        if (bufferIdx === -1) {
          assert(recording.buffer === this._buffer);
          bufferIdx = this._previousBuffers.length;
        }
        return new Cursor(this, bufferIdx, recording.offset + recording.length);
      }
      /**
       * Starts recording a series of actions.
       */
      startRecording() {
        const onRecordingCompleted = () => {
          const index = this._activeRecordingTokens.indexOf(cancellationTokenSource);
          if (index === -1) {
            throw new Error("recording has already been marked as completed");
          }
          this._activeRecordingTokens.splice(index, 1);
          cancellationTokenSource.dispose();
          const activeRecordingsCount2 = this._activeRecordingTokens.length;
          if (activeRecordingsCount2 === 0) {
            this._statusBar.recordingSegment.setContent();
            vscode28.commands.executeCommand("setContext", "dance.isRecording", false);
          } else {
            this._statusBar.recordingSegment.setContent("" + activeRecordingsCount2);
          }
          const buffer2 = this._buffer;
          this._archiveBufferIfNeeded();
          return new Recording(buffer2, offset2, buffer2.length - offset2 - 1);
        };
        this._recordBreak();
        const offset2 = this._buffer.length - 1,
          cancellationTokenSource = new vscode28.CancellationTokenSource(),
          recording = new ActiveRecording(onRecordingCompleted, cancellationTokenSource.token),
          activeRecordingsCount = this._activeRecordingTokens.push(cancellationTokenSource);
        this._statusBar.recordingSegment.setContent("" + activeRecordingsCount);
        if (activeRecordingsCount === 1) {
          vscode28.commands.executeCommand("setContext", "dance.isRecording", true);
        }
        return recording;
      }
      /**
       * Records a "break", indicating that a change that cannot be reliably
       * replayed just happened.
       */
      _recordBreak() {
        const buffer2 = this._buffer;
        if (buffer2.length > 0 && buffer2[buffer2.length - 1] !== Entry.Break.id) {
          this._record(Entry.Break);
          this._activeRecordingTokens.splice(0).forEach((t) => t.dispose());
        }
        this._expectedSelectionTranslation = void 0;
      }
      /**
       * Records a change in the active text editor.
       */
      _recordActiveTextEditorChange(e) {
        this._expectedSelectionTranslation = void 0;
        if (e?.document !== this._activeDocument) {
          if (e?.document === void 0) {
            this._activeDocument = void 0;
            this._lastActiveSelections = void 0;
            this._recordBreak();
          } else {
            this._activeDocument = e.document;
            this._lastActiveSelections = e.selections;
            this._record(Entry.ChangeTextEditor, this._storeObject(e.document.uri));
          }
        }
      }
      /**
       * Records a change in the mode of the active text editor.
       */
      _recordActiveTextEditorModeChange(e) {
        if (e.editor.document !== this._activeDocument) {
          return;
        }
        this._record(Entry.ChangeTextEditorMode, this._storeObject(e.mode));
      }
      /**
       * Records the invocation of a command.
       */
      recordCommand(descriptor, argument2) {
        const descriptorIndex = this._descriptors.indexOf(descriptor),
          argumentIndex = this._storeObject(argument2);
        this._record(Entry.ExecuteCommand, descriptorIndex, argumentIndex);
      }
      /**
       * Records the invocation of an external (non-Dance) command.
       */
      recordExternalCommand(identifier, argument2) {
        const identifierIndex = this._storeObject(identifier),
          argumentIndex = this._storeObject(argument2);
        this._record(Entry.ExecuteExternalCommand, identifierIndex, argumentIndex);
      }
      /**
       * Records a change of a selection.
       */
      _recordExternalSelectionChange(e) {
        if (vscode28.window.activeTextEditor !== e.textEditor) {
          return;
        }
        const lastSelections = this._lastActiveSelections,
          selections3 = e.selections;
        this._lastActiveSelections = selections3;
        if (
          Context.WithoutActiveEditor.currentOrUndefined !== void 0 ||
          lastSelections === void 0
        ) {
          return;
        }
        if (
          lastSelections.length !== selections3.length ||
          e.kind === vscode28.TextEditorSelectionChangeKind.Mouse
        ) {
          return this._recordBreak();
        }
        const document = e.textEditor.document;
        let commonAnchorOffsetDiff = Number.MAX_SAFE_INTEGER,
          commonActiveOffsetDiff = Number.MAX_SAFE_INTEGER;
        for (let i = 0, len = selections3.length; i < len; i++) {
          const lastSelection = lastSelections[i],
            selection3 = selections3[i];
          let anchorOffsetDiff;
          if (lastSelection.anchor.line === selection3.anchor.line) {
            anchorOffsetDiff = selection3.anchor.character - lastSelection.anchor.character;
          } else {
            const lastAnchorOffset = document.offsetAt(lastSelection.anchor),
              anchorOffset2 = document.offsetAt(selection3.anchor);
            anchorOffsetDiff = anchorOffset2 - lastAnchorOffset;
          }
          if (commonAnchorOffsetDiff === Number.MAX_SAFE_INTEGER) {
            commonAnchorOffsetDiff = anchorOffsetDiff;
          } else if (commonAnchorOffsetDiff !== anchorOffsetDiff) {
            return this._recordBreak();
          }
          let activeOffsetDiff;
          if (lastSelection.active.line === selection3.active.line) {
            activeOffsetDiff = selection3.active.character - lastSelection.active.character;
          } else {
            const lastActiveOffset = document.offsetAt(lastSelection.active),
              activeOffset2 = document.offsetAt(selection3.active);
            activeOffsetDiff = activeOffset2 - lastActiveOffset;
          }
          if (commonActiveOffsetDiff === Number.MAX_SAFE_INTEGER) {
            commonActiveOffsetDiff = activeOffsetDiff;
          } else if (commonActiveOffsetDiff !== activeOffsetDiff) {
            return this._recordBreak();
          }
        }
        if (commonActiveOffsetDiff === 0 && commonAnchorOffsetDiff === 0) {
          return;
        }
        const expectedTranslation = this._expectedSelectionTranslation;
        if (expectedTranslation !== void 0) {
          this._expectedSelectionTranslation = void 0;
          if (
            expectedTranslation === commonActiveOffsetDiff &&
            expectedTranslation === commonAnchorOffsetDiff
          ) {
            return;
          }
        }
        const isSameDiff = commonActiveOffsetDiff === commonAnchorOffsetDiff;
        if (isSameDiff) {
          const cursor = this.cursorFromEnd();
          if (cursor.previousIs(Entry.DeleteAfter)) {
            const deletionLength = cursor.entry().deletionLength();
            if (deletionLength === commonActiveOffsetDiff) {
              const buffer2 = cursor.buffer,
                cursorOffset = cursor.offset;
              if (cursor.previousIs(Entry.DeleteBefore)) {
                buffer2.splice(cursorOffset + 1);
                buffer2[cursor.offset + 1] += deletionLength;
                buffer2[cursor.offset + Entry.DeleteBefore.size + 1] =
                  Entry.DeleteBefore.id << 8 /* PrevShift */;
              } else {
                buffer2[cursorOffset] =
                  (buffer2[cursorOffset] & ~255) /* NextMask */ | Entry.DeleteBefore.id;
                buffer2[cursorOffset + Entry.DeleteBefore.size + 1] =
                  Entry.DeleteBefore.id << 8 /* PrevShift */;
              }
              return;
            }
          } else if (cursor.previousIs(Entry.DeleteBefore)) {
            if (cursor.entry().deletionLength() === commonActiveOffsetDiff) {
              return;
            }
          } else if (cursor.previousIs(Entry.InsertAfter)) {
            const insertedText = cursor.entry().insertedText();
            if (insertedText.length === commonActiveOffsetDiff) {
              const buffer2 = cursor.buffer,
                cursorOffset = cursor.offset;
              if (cursor.previousIs(Entry.InsertBefore)) {
                buffer2.splice(cursorOffset + 1);
                buffer2[cursor.offset + 1] = this._storeObject(
                  cursor.entry().insertedText() + insertedText,
                );
                buffer2[cursor.offset + Entry.InsertBefore.size + 1] =
                  Entry.InsertBefore.id << 8 /* PrevShift */;
              } else {
                buffer2[cursorOffset] =
                  (buffer2[cursorOffset] & ~255) /* NextMask */ | Entry.InsertBefore.id;
                buffer2[cursorOffset + Entry.DeleteBefore.size + 1] =
                  Entry.InsertBefore.id << 8 /* PrevShift */;
              }
              return;
            }
          }
        } else if (commonActiveOffsetDiff === 0 || commonAnchorOffsetDiff === 0) {
          const cursor = this.cursorFromEnd();
          let type, translation;
          if (commonActiveOffsetDiff === 0) {
            type = Entry.DeleteAfter;
            translation = commonAnchorOffsetDiff;
          } else {
            type = Entry.DeleteBefore;
            translation = commonActiveOffsetDiff;
          }
          if (cursor.previousIs(type)) {
            if (cursor.entry().deletionLength() === translation) {
              return;
            }
          }
        }
        this._record(Entry.TranslateSelection, commonActiveOffsetDiff, commonAnchorOffsetDiff);
      }
      /**
       * Records a text change.
       */
      _recordExternalTextChange(e) {
        const editor = vscode28.window.activeTextEditor;
        if (editor?.document !== e.document) {
          return;
        }
        const lastSelections = this._lastActiveSelections,
          selections3 = editor.selections;
        this._lastActiveSelections = selections3;
        if (
          Context.WithoutActiveEditor.currentOrUndefined !== void 0 ||
          lastSelections === void 0 ||
          e.contentChanges.length === 0
        ) {
          return;
        }
        if (lastSelections.length !== e.contentChanges.length) {
          return this._recordBreak();
        }
        this._expectedSelectionTranslation = void 0;
        function computeOffsetFromActive(change, selection3) {
          const changeStart = change.range.start,
            active2 = selection3.active;
          if (changeStart.line === active2.line) {
            return changeStart.character - active2.character;
          }
          return change.rangeOffset - document.offsetAt(active2);
        }
        const document = e.document,
          firstChange = e.contentChanges[0],
          firstSelection = lastSelections[0],
          commonInsertedText = firstChange.text,
          commonDeletionLength = firstChange.rangeLength,
          commonOffsetFromActive = computeOffsetFromActive(firstChange, firstSelection);
        for (let i = 1, len = lastSelections.length; i < len; i++) {
          const change = e.contentChanges[i];
          if (change.text !== commonInsertedText || change.rangeLength !== commonDeletionLength) {
            return this._recordBreak();
          }
          const offsetFromActive = computeOffsetFromActive(change, selections3[i]);
          if (offsetFromActive !== commonOffsetFromActive) {
            return this._recordBreak();
          }
        }
        if (commonDeletionLength > 0 && commonInsertedText.length > 0) {
          if (commonInsertedText.length - commonDeletionLength === commonOffsetFromActive) {
            this._record(Entry.ReplaceWith, this._storeObject(commonInsertedText));
            return;
          }
        }
        if (commonDeletionLength > 0) {
          const cursor = this.cursorFromEnd(),
            type = commonOffsetFromActive === 0 ? Entry.DeleteAfter : Entry.DeleteBefore;
          if (type === Entry.DeleteBefore) {
            this._expectedSelectionTranslation = commonOffsetFromActive;
          }
          if (cursor.previousIs(type)) {
            cursor.buffer[cursor.offset + 1] += commonDeletionLength;
          } else if (type === Entry.DeleteBefore && cursor.previousIs(Entry.InsertBefore)) {
            const insertedText = cursor.entry().insertedText();
            if (insertedText.length > commonDeletionLength) {
              cursor.buffer[cursor.offset + 1] = this._storeObject(
                insertedText.slice(0, insertedText.length - commonDeletionLength),
              );
            } else {
              const previousType = cursor.previousType();
              cursor.buffer.splice(cursor.offset);
              if (insertedText.length === commonDeletionLength) {
                cursor.buffer.push(previousType << 8 /* PrevShift */);
              } else {
                cursor.buffer.push(
                  (previousType << 8) /* PrevShift */ | Entry.DeleteBefore.id,
                  commonDeletionLength,
                  Entry.DeleteBefore.id << 8 /* PrevShift */,
                );
              }
            }
          } else {
            this._record(type, commonDeletionLength);
          }
        }
        if (commonInsertedText.length > 0) {
          const cursor = this.cursorFromEnd();
          if (cursor.previousIs(Entry.InsertAfter)) {
            const previousInsertedText = cursor.entry().insertedText();
            if (previousInsertedText.length === commonOffsetFromActive) {
              cursor.buffer[cursor.offset + 1] = this._storeObject(
                previousInsertedText + commonInsertedText,
              );
            } else {
              this._record(Entry.InsertAfter, this._storeObject(commonInsertedText));
            }
          } else {
            this._record(Entry.InsertAfter, this._storeObject(commonInsertedText));
          }
        }
      }
    };
    Cursor = class _Cursor {
      constructor(recorder, buffer2, offset2) {
        this.recorder = recorder;
        this._buffer = recorder.getBuffer(buffer2);
        this._bufferIdx = buffer2;
        this._offset = offset2;
      }
      /**
       * Returns the buffer storing the current record.
       */
      get buffer() {
        return this._buffer;
      }
      /**
       * Returns the offset of the current record in its buffer.
       */
      get offset() {
        return this._offset;
      }
      /**
       * Returns the offset of the previous record in its buffer, or `undefined`
       * if the current record is the first of its buffer.
       */
      get previousOffset() {
        return this._offset === 0 ? void 0 : this._offset - Entry.size(this.previousType()) - 1;
      }
      /**
       * Returns a different instance of a `Cursor` that points to the same
       * record.
       */
      clone() {
        return new _Cursor(this.recorder, this._bufferIdx, this._offset);
      }
      /**
       * Returns whether the current cursor is before or equal to the given
       * cursor.
       */
      isBeforeOrEqual(other) {
        return (
          this._bufferIdx < other._bufferIdx ||
          (this._bufferIdx === other._bufferIdx && this._offset <= other._offset)
        );
      }
      /**
       * Returns whether the current cursor is after or equal to the given
       * cursor.
       */
      isAfterOrEqual(other) {
        return (
          this._bufferIdx > other._bufferIdx ||
          (this._bufferIdx === other._bufferIdx && this._offset >= other._offset)
        );
      }
      /**
       * Replays the record pointed at by the cursor.
       */
      replay(context) {
        return this.entry().replay(context);
      }
      /**
       * Returns the entry pointed at by the cursor.
       */
      entry() {
        return Entry.instantiate(this.type(), this.recorder, this._buffer, this._offset);
      }
      /**
       * Returns the type of the current record.
       */
      type() {
        return this._buffer[this._offset] & 255 /* NextMask */;
      }
      /**
       * Returns the type of the previous record.
       */
      previousType() {
        return this._buffer[this._offset] >> 8 /* PrevShift */;
      }
      /**
       * Returns whether the cursor points to a record of the given type.
       */
      is(type) {
        return this.type() === type.id;
      }
      /**
       * Returns whether, when going backward, the type will be correspond to the
       * given type. If so, goes backward.
       */
      previousIs(type) {
        if (this.previousType() === type.id) {
          this.previous();
          return true;
        }
        return false;
      }
      /**
       * Switches to the next record, and returns `true` if the operation
       * succeeded or `false` if the current record is the last one available.
       */
      next() {
        if (this._offset === this._buffer.length - 1) {
          if (this._bufferIdx === this.recorder.bufferCount) {
            return false;
          }
          this._bufferIdx++;
          this._buffer = this.recorder.getBuffer(this._bufferIdx);
          this._offset = 0;
          return true;
        }
        this._offset += Entry.size(this.type()) + 1;
        return true;
      }
      /**
       * Switches to the previous record, and returns `true` if the operation
       * succeeded or `false` if the current record is the first one available.
       */
      previous() {
        assert(this._offset >= 0);
        if (this._offset === 0) {
          if (this._bufferIdx === 0) {
            return false;
          }
          this._bufferIdx--;
          this._buffer = this.recorder.getBuffer(this._bufferIdx);
          this._offset = this._buffer.length - 1;
          return true;
        }
        this._offset -= Entry.size(this.previousType()) + 1;
        return true;
      }
      /**
       * Returns whether the record pointed at by the cursor is included in the
       * specified recording.
       */
      isInRecording(recording) {
        return (
          recording.offset <= this._offset &&
          this._offset < recording.offset + recording.length &&
          recording.buffer === this._buffer
        );
      }
      /**
       * Returns `this` with a more generic type. Use when TypeScript merges types
       * incorrectly.
       */
      upcast() {
        return this;
      }
    };
    ActiveRecording = class {
      constructor(_notifyCompleted, cancellationToken) {
        this._notifyCompleted = _notifyCompleted;
        this.cancellationToken = cancellationToken;
      }
      complete() {
        CancellationError.throwIfCancellationRequested(this.cancellationToken);
        return this._notifyCompleted();
      }
    };
    Recording = class {
      constructor(buffer2, offset2, length4) {
        this.buffer = buffer2;
        this.offset = offset2;
        this.length = length4;
      }
      /**
       * Returns the result of calling `entries()`, for debugging purposes.
       */
      get debugEntries() {
        return [...this.entries()];
      }
      /**
       * Returns an iterator over all the entries in the recorder.
       */
      *entries(context = Context.WithoutActiveEditor.current) {
        let offset2 = this.offset;
        const buffer2 = this.buffer,
          end2 = offset2 + this.length,
          recorder = context.extension.recorder;
        while (offset2 < end2) {
          const entry = recorder.entry(buffer2, offset2);
          yield entry;
          offset2 += entry.size + 1;
        }
      }
      /**
       * Replays the recording in the given context.
       */
      async replay(context = Context.WithoutActiveEditor.current) {
        for (const entry of this.entries(context)) {
          await entry.replay(context);
        }
      }
    };
    _BaseEntry = class _BaseEntry {
      constructor(recorder, buffer2, offset2) {
        this.recorder = recorder;
        this.buffer = buffer2;
        this.offset = offset2;
      }
      /**
       * Returns the identifier of the record.
       */
      get id() {
        return this.type.id;
      }
      /**
       * Returns the size of the record, excluding identifier before and after.
       */
      get size() {
        return this.type.size;
      }
      /**
       * Returns the type of the entry.
       */
      get type() {
        return this.constructor;
      }
      /**
       * Returns the result of calling `items()`, for debugging purposes.
       */
      get debugItems() {
        return this.items();
      }
      /**
       * Returns the item at the given index.
       */
      item(index) {
        return this.buffer[this.offset + 1 + index];
      }
      /**
       * Returns an abstract class that should be extended to implement a new
       * `Entry`.
       */
      static define(size) {
        const id = this._entryIds++;
        class EntryWithSize extends _BaseEntry {}
        EntryWithSize.size = size;
        EntryWithSize.id = id;
        return EntryWithSize;
      }
    };
    _BaseEntry._entryIds = 0;
    BaseEntry = _BaseEntry;
    BreakEntry = class extends BaseEntry.define(0) {
      replay() {
        return Promise.resolve();
      }
      items() {
        return [];
      }
    };
    TranslateSelectionEntry = class extends BaseEntry.define(2) {
      replay(context) {
        Context.assert(context);
        const document = context.document,
          activeTranslation = this.activeTranslation(),
          anchorTranslation = this.anchorTranslation();
        context.run(() =>
          selections_exports.updateByIndex((_, selection3) => {
            const newActive = positions_exports.offsetOrEdge(
                selection3.active,
                activeTranslation,
                document,
              ),
              newAnchor = positions_exports.offsetOrEdge(
                selection3.anchor,
                anchorTranslation,
                document,
              );
            return new vscode28.Selection(newAnchor, newActive);
          }),
        );
        return Promise.resolve();
      }
      activeTranslation() {
        return this.item(0);
      }
      anchorTranslation() {
        return this.item(1);
      }
      items() {
        return [this.activeTranslation(), this.anchorTranslation()];
      }
    };
    InsertBeforeEntry = class extends BaseEntry.define(1) {
      async replay(context) {
        Context.assert(context);
        const editor = context.editor;
        await editor.edit((editBuilder) => {
          const insertedText = this.insertedText();
          for (const selection3 of editor.selections) {
            editBuilder.insert(selection3.start, insertedText);
          }
        }, noUndoStops);
      }
      insertedText() {
        return this.recorder.getString(this.item(0));
      }
      items() {
        return [this.insertedText()];
      }
    };
    InsertAfterEntry = class extends BaseEntry.define(1) {
      async replay(context) {
        Context.assert(context);
        const editor = context.editor;
        await editor.edit((editBuilder) => {
          const insertedText = this.insertedText();
          for (const selection3 of editor.selections) {
            editBuilder.replace(selection3.end, insertedText);
          }
        }, noUndoStops);
      }
      insertedText() {
        return this.recorder.getString(this.item(0));
      }
      items() {
        return [this.insertedText()];
      }
    };
    DeleteBeforeEntry = class extends BaseEntry.define(1) {
      async replay(context) {
        Context.assert(context);
        const editor = context.editor;
        await editor.edit((editBuilder) => {
          const deletionLength = this.deletionLength(),
            document = editor.document;
          for (const selection3 of editor.selections) {
            const endPosition2 = selection3.start,
              startPosition = positions_exports.offsetOrEdge(
                endPosition2,
                -deletionLength,
                document,
              );
            editBuilder.delete(new vscode28.Range(startPosition, endPosition2));
          }
        });
      }
      deletionLength() {
        return this.item(0);
      }
      items() {
        return [this.deletionLength()];
      }
    };
    DeleteAfterEntry = class extends BaseEntry.define(1) {
      async replay(context) {
        Context.assert(context);
        const editor = context.editor;
        await editor.edit((editBuilder) => {
          const deletionLength = this.deletionLength(),
            document = editor.document;
          for (const selection3 of editor.selections) {
            const startPosition = selection3.end,
              endPosition2 = positions_exports.offsetOrEdge(
                startPosition,
                deletionLength,
                document,
              );
            editBuilder.delete(new vscode28.Range(startPosition, endPosition2));
          }
        });
      }
      deletionLength() {
        return this.item(0);
      }
      items() {
        return [this.deletionLength()];
      }
    };
    ReplaceWithEntry = class extends BaseEntry.define(1) {
      async replay(context) {
        Context.assert(context);
        const editor = context.editor;
        await editor.edit((editBuilder) => {
          const text4 = this.text();
          for (const selection3 of editor.selections) {
            editBuilder.replace(selection3, text4);
          }
        });
      }
      text() {
        return this.recorder.getString(this.item(0));
      }
      items() {
        return [this.text()];
      }
    };
    ChangeTextEditorEntry = class extends BaseEntry.define(1) {
      async replay() {
        await vscode28.window.showTextDocument(this.uri());
      }
      uri() {
        return this.recorder.getObject(this.item(0));
      }
      items() {
        return [this.uri()];
      }
    };
    ChangeTextEditorModeEntry = class extends BaseEntry.define(1) {
      replay(context) {
        Context.assert(context);
        return context.switchToMode(this.mode());
      }
      mode() {
        return this.recorder.getObject(this.item(0));
      }
      items() {
        return [this.mode()];
      }
    };
    ExecuteCommandEntry = class extends BaseEntry.define(2) {
      async replay(context) {
        const descriptor = this.descriptor(),
          argument2 = this.argument();
        if ((descriptor.flags & CommandDescriptor.Flags.DoNotReplay) === 0) {
          await descriptor.replay(context, argument2);
        }
      }
      descriptor() {
        return this.recorder.getDescriptor(this.item(0));
      }
      argument() {
        return this.recorder.getObject(this.item(1));
      }
      items() {
        return [this.descriptor(), this.argument()];
      }
    };
    ExecuteExternalCommandEntry = class extends BaseEntry.define(2) {
      async replay() {
        await vscode28.commands.executeCommand(this.identifier(), this.argument());
      }
      identifier() {
        return this.recorder.getString(this.item(0));
      }
      argument() {
        return this.recorder.getObject(this.item(1));
      }
      items() {
        return [this.identifier(), this.argument()];
      }
    };
    EntryClasses = {
      Break: BreakEntry,
      ChangeTextEditor: ChangeTextEditorEntry,
      ChangeTextEditorMode: ChangeTextEditorModeEntry,
      DeleteAfter: DeleteAfterEntry,
      DeleteBefore: DeleteBeforeEntry,
      ExecuteCommand: ExecuteCommandEntry,
      ExecuteExternalCommand: ExecuteExternalCommandEntry,
      InsertAfter: InsertAfterEntry,
      InsertBefore: InsertBeforeEntry,
      ReplaceWith: ReplaceWithEntry,
      TranslateSelection: TranslateSelectionEntry,
    };
    Entry = {
      ...EntryClasses,
      /**
       * Returns the class of the entry corresponding to the given entry identifier.
       */
      byId(id) {
        return sortedEntries[id];
      },
      /**
       * Returns the entry corresponding to the given entry identifier.
       */
      instantiate(id, ...args) {
        return new sortedEntries[id](...args);
      },
      /**
       * Returns the size of the object at the given index.
       */
      size(id) {
        return this.byId(id).size;
      },
    };
    sortedEntries = Object.values(EntryClasses)
      .slice()
      .sort((a, b) => a.id - b.id);
  },
});

// src/state/registers.ts
import * as vscode29 from "vscode";
function activeEditor() {
  const activeEditor2 = vscode29.window.activeTextEditor;
  EditorRequiredError.throwUnlessAvailable(activeEditor2);
  return activeEditor2;
}
var Register,
  GeneralPurposeRegister,
  SpecialRegister,
  ClipboardRegister,
  RegisterSet,
  DocumentRegisters,
  Registers;
var init_registers2 = __esm({
  "src/state/registers.ts"() {
    "use strict";
    init_api();
    init_constants();
    init_errors();
    init_misc();
    Register = class _Register {
      constructor() {
        this._onChangeEvent = new vscode29.EventEmitter();
      }
      /**
       * Event fired when the contents, selections or recording of the register
       * change.
       */
      get onChange() {
        return this._onChangeEvent.event;
      }
      /**
       * Returns whether the register is readable.
       */
      canRead() {
        return (this.flags & _Register.Flags.CanRead) === _Register.Flags.CanRead;
      }
      /**
       * Returns whether the register is writeable.
       */
      canWrite() {
        return (this.flags & _Register.Flags.CanWrite) === _Register.Flags.CanWrite;
      }
      /**
       * Returns whether the register is selections-readeable.
       */
      canReadSelections() {
        return (
          (this.flags & _Register.Flags.CanReadSelections) === _Register.Flags.CanReadSelections
        );
      }
      /**
       * Returns whether the register is selections-writeable.
       */
      canWriteSelections() {
        return (
          (this.flags & _Register.Flags.CanWriteSelections) === _Register.Flags.CanWriteSelections
        );
      }
      /**
       * Returns whether the register can be used to replay recorded commands.
       */
      canReadRecordedCommands() {
        return (
          (this.flags & _Register.Flags.CanReadWriteMacros) === _Register.Flags.CanReadWriteMacros
        );
      }
      /**
       * Returns whether the register can be used to record commands.
       */
      canWriteRecordedCommands() {
        return (
          (this.flags & _Register.Flags.CanReadWriteMacros) === _Register.Flags.CanReadWriteMacros
        );
      }
      /**
       * Ensures that the register is readable.
       */
      ensureCanRead() {
        this.checkFlags(_Register.Flags.CanRead);
      }
      /**
       * Ensures that the register is writeable.
       */
      ensureCanWrite() {
        this.checkFlags(_Register.Flags.CanWrite);
      }
      /**
       * Ensures that the register is selections-readeable.
       */
      ensureCanReadSelections() {
        this.checkFlags(_Register.Flags.CanReadSelections);
      }
      /**
       * Ensures that the register is selections-writeable.
       */
      ensureCanWriteSelections() {
        this.checkFlags(_Register.Flags.CanWriteSelections);
      }
      /**
       * Ensures that the register can be used to replay recorded commands.
       */
      ensureCanReadRecordedCommands() {
        this.checkFlags(_Register.Flags.CanReadWriteMacros);
      }
      /**
       * Ensures that the register can be used to record commands.
       */
      ensureCanWriteRecordedCommands() {
        this.checkFlags(_Register.Flags.CanReadWriteMacros);
      }
      /**
       * Returns whether the current register has the given flags.
       */
      hasFlags(flags) {
        return (this.flags & flags) === flags;
      }
      /**
       * @deprecated Use `Register.ensure*` instead.
       */
      checkFlags(flags) {
        const f = this.flags;
        if (flags & _Register.Flags.CanRead && !(f & _Register.Flags.CanRead)) {
          throw new Error(`register "${this.name}" cannot be used to read text`);
        }
        if (flags & _Register.Flags.CanReadSelections && !(f & _Register.Flags.CanReadSelections)) {
          throw new Error(`register "${this.name}" cannot be used to read selections`);
        }
        if (
          flags & _Register.Flags.CanReadWriteMacros &&
          !(f & _Register.Flags.CanReadWriteMacros)
        ) {
          throw new Error(`register "${this.name}" cannot be used to play or create recordings`);
        }
        if (flags & _Register.Flags.CanWrite && !(f & _Register.Flags.CanWrite)) {
          throw new Error(`register "${this.name}" cannot be used to save text`);
        }
        if (
          flags & _Register.Flags.CanWriteSelections &&
          !(f & _Register.Flags.CanWriteSelections)
        ) {
          throw new Error(`register "${this.name}" cannot be used to save selections`);
        }
      }
      /**
       * Returns the current register if it has the given flags, or throws an
       * exception otherwise.
       */
      withFlags(flags) {
        this.checkFlags(flags);
        return this;
      }
      /**
       * Notifies listeners that a {@link onChange change} occured to the register.
       */
      notifyChange(kind) {
        this._onChangeEvent.fire(kind);
      }
    };
    ((Register3) => {
      let Flags2;
      ((Flags3) => {
        Flags3[(Flags3["None"] = 0)] = "None";
        Flags3[(Flags3["CanRead"] = 1)] = "CanRead";
        Flags3[(Flags3["CanWrite"] = 2)] = "CanWrite";
        Flags3[(Flags3["CanReadSelections"] = 4)] = "CanReadSelections";
        Flags3[(Flags3["CanWriteSelections"] = 8)] = "CanWriteSelections";
        Flags3[(Flags3["CanReadWriteMacros"] = 16)] = "CanReadWriteMacros";
      })((Flags2 = Register3.Flags || (Register3.Flags = {})));
      let ChangeKind;
      ((ChangeKind2) => {
        ChangeKind2[(ChangeKind2["Contents"] = 0)] = "Contents";
        ChangeKind2[(ChangeKind2["Selections"] = 1)] = "Selections";
        ChangeKind2[(ChangeKind2["Recording"] = 2)] = "Recording";
      })((ChangeKind = Register3.ChangeKind || (Register3.ChangeKind = {})));
    })(Register || (Register = {}));
    GeneralPurposeRegister = class extends Register {
      constructor(name, iconName) {
        super();
        this.name = name;
        this.iconName = iconName;
        this.flags =
          1 /* CanRead */ |
          4 /* CanReadSelections */ |
          16 /* CanReadWriteMacros */ |
          2 /* CanWrite */ |
          8 /* CanWriteSelections */;
      }
      set(values2) {
        this._values = values2;
        this.notifyChange(0 /* Contents */);
        return Promise.resolve();
      }
      get() {
        return Promise.resolve(this._values);
      }
      getSelections() {
        return this._selections?.restore();
      }
      getSelectionSet() {
        return this._selections;
      }
      replaceSelectionSet(trackedSelections) {
        const previousSelectionSet = this._selections;
        this._selections = trackedSelections;
        this.notifyChange(1 /* Selections */);
        return previousSelectionSet;
      }
      getRecording() {
        return this._recording;
      }
      setRecording(recording) {
        this._recording = recording;
        this.notifyChange(2 /* Recording */);
      }
    };
    SpecialRegister = class extends Register {
      constructor(name, iconName, getter, setter, _listenToChanges) {
        super();
        this.name = name;
        this.iconName = iconName;
        this.getter = getter;
        this.setter = setter;
        this._listenToChanges = _listenToChanges;
        this.flags = this.setter === void 0 ? 1 /* CanRead */ : 1 /* CanRead */ | 2 /* CanWrite */;
      }
      get onChange() {
        if (this._listenToChanges === void 0) {
          return super.onChange;
        }
        return (listener) => this._listenToChanges(() => listener(0 /* Contents */));
      }
      get() {
        return this.getter();
      }
      async set(values2) {
        if (this.setter === void 0) {
          throw new Error("cannot set read-only register");
        }
        await this.setter(values2);
        this.notifyChange(0 /* Contents */);
      }
    };
    ClipboardRegister = class extends Register {
      constructor() {
        super(...arguments);
        this.name = '"';
        this.iconName = "clippy";
        this.flags = 1 /* CanRead */ | 2 /* CanWrite */;
      }
      async get() {
        const text4 = await vscode29.env.clipboard.readText();
        return text4 === this._lastRawText ? this._lastStrings : [text4];
      }
      set(values2) {
        let newline = "\n";
        if (Context.currentOrUndefined?.document?.eol === vscode29.EndOfLine.CRLF) {
          newline = "\r\n";
        }
        this._lastStrings = values2;
        this._lastRawText = values2.join(newline);
        this.notifyChange(0 /* Contents */);
        return vscode29.env.clipboard.writeText(this._lastRawText);
      }
    };
    RegisterSet = class {
      constructor(extension2) {
        this._onRegisterChange = new vscode29.EventEmitter();
        this._onLastMatchesChange = new vscode29.EventEmitter();
        this._named = /* @__PURE__ */ new Map();
        this._letters = Array.from(
          { length: 26 },
          (_, i) => new GeneralPurposeRegister(String.fromCharCode(97 + i), "symbol-text"),
        );
        this._digits = Array.from(
          { length: 9 },
          (_, i) =>
            new SpecialRegister(
              (i + 1).toString(),
              "regex",
              () => Promise.resolve(this._lastMatches[i]),
              void 0,
              (fire) => this._onLastMatchesChange.event(fire),
            ),
        );
        this._lastMatches = [];
        /*
         * The system clipboard register set with the
         * `dance.systemClipboardRegister` setting.
         */
        this._systemClipboardRegister = void 0;
        /**
         * The "/" (`slash`) register, default register for search / regex operations.
         */
        this.slash = new GeneralPurposeRegister("/", "search-view-icon");
        /**
         * The "@" (`arobase`) register, default register for recordings (aka macros).
         */
        this.arobase = new GeneralPurposeRegister("@", "record");
        /**
         * The "^" (`caret`) register, default register for saving selections.
         */
        this.caret = new GeneralPurposeRegister("^", "save");
        /**
         * The "|" (`pipe`) register, default register for outputs of external
         * commands.
         */
        this.pipe = new GeneralPurposeRegister("|", "console");
        /**
         * The "%" (`percent`) register, mapped to the name of the current document.
         */
        this.percent = new SpecialRegister(
          "%",
          "file",
          () => Promise.resolve([activeEditor().document.fileName]),
          async (values2) => {
            if (values2.length !== 1) {
              throw new ArgumentError("a single file name must be selected");
            }
            await vscode29.workspace.openTextDocument(values2[0]);
          },
          (fire) => vscode29.window.onDidChangeActiveTextEditor(fire),
        );
        /**
         * The "." (`dot`) register, mapped to the contents of the current selections.
         */
        this.dot = new SpecialRegister(
          ".",
          "selection",
          () => {
            const editor = activeEditor(),
              document = editor.document,
              selectionBehavior = Context.currentOrUndefined?.mode?.selectionBehavior,
              selections3 =
                selectionBehavior === 2 /* Character */
                  ? selections_exports.fromCharacterMode(editor.selections, document)
                  : editor.selections;
            return Promise.resolve(selections3.map(document.getText.bind(document)));
          },
          async (values2) => {
            const editor = activeEditor();
            if (values2.length !== editor.selections.length) {
              throw new ArgumentError("as many selections as values must be given");
            }
            const succeeded = await editor.edit((editBuilder) => {
              const document = editor.document,
                selectionBehavior = Context.currentOrUndefined?.mode?.selectionBehavior,
                selections3 =
                  selectionBehavior === 2 /* Character */
                    ? selections_exports.fromCharacterMode(editor.selections, document)
                    : editor.selections;
              for (let i = 0; i < selections3.length; i++) {
                editBuilder.replace(selections3[i], values2[i]);
              }
            }, noUndoStops);
            EditNotAppliedError.throwIfNotApplied(succeeded);
          },
          (fire) => vscode29.window.onDidChangeTextEditorSelection(fire),
        );
        /**
         * The read-only "#" (`hash`) register, mapped to the indices of the current
         * selections.
         */
        this.hash = new SpecialRegister(
          "#",
          "symbol-numeric",
          () => Promise.resolve(activeEditor().selections.map((_, i) => i.toString())),
          void 0,
          (fire) => vscode29.window.onDidChangeTextEditorSelection(fire),
        );
        /**
         * The read-only "_" (`underscore`) register, mapped to an empty string.
         */
        this.underscore = new SpecialRegister("_", void 0, () => Promise.resolve([""]));
        /**
         * The ":" (`colon`) register.
         *
         * In Kakoune it is mapped to the last entered command, but since we don't
         * have access to that information in Dance, we map it to a prompt.
         */
        this.colon = new SpecialRegister(":", void 0, async () => [await prompt({ prompt: ":" })]);
        /**
         * The `null` register, which forgets selections written to it and always
         * returns no strings.
         */
        this.null = new SpecialRegister(
          "null",
          void 0,
          () => Promise.resolve([]),
          () => Promise.resolve(),
        );
        for (const [longName, register] of [
          ["dquote", this.dquote],
          ["slash", this.slash],
          ["arobase", this.arobase],
          ["caret", this.caret],
          ["pipe", this.pipe],
          ["percent", this.percent],
          ["dot", this.dot],
          ["hash", this.hash],
          ["underscore", this.underscore],
          ["colon", this.colon],
        ]) {
          this._named.set(longName, register);
        }
        for (let i = 0; i < this._digits.length; i++) {
          this._named.set(`${i + 1}`, this._digits[i]);
        }
        for (let i = 0; i < this._letters.length; i++) {
          const letter = this._letters[i];
          this._named.set(String.fromCharCode(i + 65), letter);
          this._named.set(String.fromCharCode(i + 97), letter);
        }
        this._named.set("", this.null);
        this._named.set("null", this.null);
        if (extension2 !== void 0) {
          extension2.observePreference(
            ".systemClipboardRegister",
            (value2, validator) => {
              if (!["dquote", null, ...availableClipboardRegisters].includes(value2)) {
                value2 = null;
                validator.reportInvalidSetting(`Invalid systemClipboardRegister value: ${value2}`);
              }
              if (this._systemClipboardRegister !== void 0) {
                const icon = this._systemClipboardRegister === "dquote" ? "copy" : "clippy";
                this._named.set(
                  this._systemClipboardRegister,
                  new GeneralPurposeRegister(this._systemClipboardRegister, icon),
                );
              }
              if (value2 !== null) {
                this._named.set(value2, new ClipboardRegister());
              }
              this._systemClipboardRegister = value2 ?? void 0;
            },
            true,
          );
        }
      }
      /**
       * The set of registers.
       */
      get registers() {
        return new Set(this._named.values());
      }
      /**
       * Event fired when a change to the set occurs.
       */
      get onRegisterChange() {
        return this._onRegisterChange.event;
      }
      /**
       * The '"' (`dquote`) register, default register for edit operations and
       * mapped to the system clipboard by default.
       */
      get dquote() {
        return this._named.get("dquote");
      }
      dispose() {
        this._onRegisterChange.dispose();
      }
      /**
       * Returns the register with the given name or identified by the given key if
       * the input is one-character long.
       */
      get(key) {
        if (key.length === 1) {
          const charCode = key.charCodeAt(0);
          switch (charCode) {
            case 34:
              return this.dquote;
            case 47:
              return this.slash;
            case 64:
              return this.arobase;
            case 94:
              return this.caret;
            case 124:
              return this.pipe;
            case 37:
              return this.percent;
            case 46:
              return this.dot;
            case 35:
              return this.hash;
            case 95:
              return this.underscore;
            case 58:
              return this.colon;
            default:
              if (charCode >= 49 && charCode <= 57) {
                return this._digits[charCode - 49];
              }
          }
        }
        key = key.toLowerCase();
        let register = this._named.get(key);
        if (register === void 0) {
          this._named.set(key, (register = new GeneralPurposeRegister(key, "symbol-text")));
        }
        return register;
      }
      /**
       * Updates the contents of the numeric registers to hold the groups matched by
       * the last `RegExp` search operation.
       *
       * @deprecated Do not call -- internal implementation detail.
       */
      updateRegExpMatches(matches) {
        assert(matches.length > 0);
        const transposed = [],
          groupsCount = matches[0].length;
        for (let i = 1; i < groupsCount; i++) {
          const strings = [];
          for (const match of matches) {
            strings.push(match[i]);
          }
          transposed.push(strings);
        }
        this._lastMatches = transposed;
        this._onLastMatchesChange.fire();
      }
    };
    DocumentRegisters = class extends RegisterSet {
      constructor(document) {
        super();
        this.document = document;
      }
      get registers() {
        const registers = super.registers;
        for (const register of registers) {
          if (!(register instanceof GeneralPurposeRegister)) {
            registers.delete(register);
          }
        }
        return registers;
      }
    };
    Registers = class extends RegisterSet {
      constructor() {
        super(...arguments);
        this._perDocument = /* @__PURE__ */ new WeakMap();
      }
      /**
       * Returns the registers linked to the given document.
       */
      forDocument(document) {
        let registers = this._perDocument.get(document);
        if (registers === void 0) {
          this._perDocument.set(document, (registers = new DocumentRegisters(document)));
        }
        return registers;
      }
      /**
       * Returns the register with the given name. If the name starts with a space
       * character, the register scoped to the given document will be returned.
       */
      getPossiblyScoped(name, document) {
        return name.startsWith(" ")
          ? this.forDocument(document).get(name.slice(1))
          : this.get(name);
      }
    };
  },
});

// src/commands/dev.ts
import * as vscode35 from "vscode";
function setSelectionBehavior(_, extension2, mode, value2) {
  const selectedMode = mode === void 0 ? _.mode : extension2.modes.get(mode);
  if (selectedMode !== void 0) {
    if (value2 === void 0) {
      value2 = selectedMode.selectionBehavior === 1 /* Caret */ ? "character" : "caret";
    }
    selectedMode.update(
      "_selectionBehavior",
      value2 === "character" ? 2 /* Character */ : 1 /* Caret */,
    );
  }
}
function copyLastErrorMessage(extension2) {
  if (extension2.lastErrorMessage === void 0) {
    return Promise.resolve();
  }
  return vscode35.env.clipboard.writeText(extension2.lastErrorMessage);
}
var init_dev = __esm({
  "src/commands/dev.ts"() {
    "use strict";
    init_api();
  },
});

// src/commands/edit.ts
import * as vscode36 from "vscode";
async function insert2(
  _,
  selections3,
  register,
  adjust = true,
  all = false,
  handleNewLine = false,
  repetitions,
  shift2,
  text4,
  where,
) {
  let contents2 = text4?.length
    ? shift2 === 1 /* Select */
      ? [text4]
      : selections3.map(() => text4)
    : await register.get();
  if (contents2 === void 0 || contents2.length === 0) {
    throw new Error(`register "${register.name}" does not contain any saved text`);
  }
  if (all) {
    if (shift2 !== 1 /* Select */) {
      throw new ArgumentError('`all` is only compatible with `shift: "select"`');
    }
    contents2 = [...contents2].reverse();
    const textToInsert = contents2.join(""),
      insert3 = handleNewLine ? insertByIndexWithFullLines : insertByIndex,
      flags2 = insertFlagsAtEdge(where) | insert.Flags.Select;
    const insertedRanges = await insert3(flags2, () => textToInsert, selections3),
      allSelections = [],
      document = _.document;
    for (const insertedRange of insertedRanges) {
      let offset2 = document.offsetAt(insertedRange.start);
      for (const content of contents2) {
        const newSelection = selections_exports.fromLength(
          offset2,
          content.length,
          false,
          document,
        );
        allSelections.push(newSelection);
        offset2 += content.length;
      }
    }
    selections_exports.set(selections_exports.bottomToTop(allSelections));
    return;
  }
  if (adjust) {
    contents2 = extendArrayToLength(contents2, selections3.length);
  } else {
    LengthMismatchError.throwIfLengthMismatch(selections3, contents2);
  }
  if (repetitions > 1) {
    contents2 = contents2.map((content) => content.repeat(repetitions));
  }
  if (where === void 0) {
    selections_exports.set(await replaceByIndex((i) => contents2[i], selections3));
    return;
  }
  if (!["active", "anchor", "start", "end"].includes(where)) {
    throw new Error(`"where" must be one of "active", "anchor", "start", "end", or undefined`);
  }
  const keepOrExtend =
      shift2 === 2 /* Extend */
        ? insert.Flags.Extend
        : shift2 === 1 /* Select */
          ? insert.Flags.Select
          : insert.Flags.Keep,
    flags = insertFlagsAtEdge(where) | keepOrExtend;
  selections_exports.set(
    handleNewLine
      ? await insertByIndexWithFullLines(flags, (i) => contents2[i], selections3)
      : await insertByIndex(flags, (i) => contents2[i], selections3),
  );
}
function join(_, separator) {
  return joinLines(selections_exports.lines(), separator);
}
async function join_select(_, separator) {
  selections_exports.set(await joinLines(selections_exports.lines(), separator));
}
function indent2(_, repetitions) {
  return indentLines(
    selections_exports.lines(),
    repetitions,
    /* indentEmpty= */
    false,
  );
}
function indent_withEmpty(_, repetitions) {
  return indentLines(
    selections_exports.lines(),
    repetitions,
    /* indentEmpty= */
    true,
  );
}
function deindent(_, repetitions) {
  return deindentLines(
    selections_exports.lines(),
    repetitions,
    /* deindentIncomplete= */
    false,
  );
}
function deindent_withIncomplete(_, repetitions) {
  return deindentLines(
    selections_exports.lines(),
    repetitions,
    /* deindentIncomplete= */
    true,
  );
}
function case_toLower(_) {
  return replace((text4) => text4.toLocaleLowerCase());
}
function case_toUpper(_) {
  return replace((text4) => text4.toLocaleUpperCase());
}
function case_swap(_) {
  return replace((text4) => {
    let builtText = "";
    for (let i = 0, len = text4.length; i < len; i++) {
      const x = text4[i],
        loCase = x.toLocaleLowerCase();
      builtText += loCase === x ? x.toLocaleUpperCase() : loCase;
    }
    return builtText;
  });
}
async function replaceCharacters(_, repetitions, inputOr) {
  const input = (await inputOr(() => keypress(_))).repeat(repetitions);
  return _.run(() =>
    edit((editBuilder, selections3, document) => {
      for (const selection3 of selections3) {
        let i = selection3.start.line;
        if (selection3.end.line === i) {
          editBuilder.replace(
            selection3,
            input.repeat(selection3.end.character - selection3.start.character),
          );
          continue;
        }
        const firstLine = document.lineAt(i).range.with(selection3.start);
        editBuilder.replace(
          firstLine,
          input.repeat(firstLine.end.character - firstLine.start.character),
        );
        while (++i < selection3.end.line) {
          const line2 = document.lineAt(i);
          editBuilder.replace(line2.range, input.repeat(line2.text.length));
        }
        const lastLine2 = document.lineAt(i).range.with(void 0, selection3.end);
        editBuilder.replace(
          lastLine2,
          input.repeat(lastLine2.end.character - lastLine2.start.character),
        );
      }
    }),
  );
}
function align(_, fill = " ") {
  return edit((builder, selections3) => {
    const sortedSelections = selections_exports.sort(1 /* Forward */, [...selections3]);
    const selectionGroups = [];
    let currentLine = -1;
    let currentColumn = 0;
    for (const selection3 of sortedSelections) {
      if (selection3.start.line !== selection3.end.line) {
        throw new Error("cannot align selections that span multiple lines");
      }
      if (selection3.start.line !== currentLine) {
        currentLine = selection3.start.line;
        currentColumn = 0;
      }
      if (currentColumn === selectionGroups.length) {
        selectionGroups.push([]);
      }
      selectionGroups[currentColumn].push(selection3);
      currentColumn++;
    }
    const lineFillCounters = /* @__PURE__ */ new Map();
    const getAlignChar = (sel) =>
      sel.active.character + (lineFillCounters.get(sel.active.line) ?? 0);
    for (const selectionsInGroup of selectionGroups) {
      const furthestChar = Math.max(...selectionsInGroup.map(getAlignChar));
      for (const selection3 of selectionsInGroup) {
        const addCount = furthestChar - getAlignChar(selection3);
        builder.insert(selection3.start, fill.repeat(addCount));
        const line2 = selection3.start.line;
        lineFillCounters.set(line2, (lineFillCounters.get(line2) ?? 0) + addCount);
      }
    }
  });
}
function copyIndentation(_, document, selections3, count) {
  const sourceSelection = selections3[count] ?? selections3[0],
    sourceIndent = document.lineAt(sourceSelection.start).firstNonWhitespaceCharacterIndex;
  return edit((builder, selections4, document2) => {
    for (let i = 0, len = selections4.length; i < len; i++) {
      if (i === sourceSelection.start.line) {
        continue;
      }
      const line2 = document2.lineAt(selections4[i].start),
        indent3 = line2.firstNonWhitespaceCharacterIndex;
      if (indent3 > sourceIndent) {
        builder.delete(
          line2.range.with(void 0, line2.range.start.translate(void 0, indent3 - sourceIndent)),
        );
      } else if (indent3 < sourceIndent) {
        builder.insert(line2.range.start, " ".repeat(indent3 - sourceIndent));
      }
    }
  });
}
function newLine_above(_, repetitions, shift2) {
  if (shift2 === 1 /* Select */) {
    return insertLinesNativelyAndCopySelections(_, repetitions, "editor.action.insertLineBefore");
  }
  return edit((builder, selections3, document) => {
    const newLine = (document.eol === vscode36.EndOfLine.LF ? "\n" : "\r\n").repeat(repetitions),
      processedLines = /* @__PURE__ */ new Set();
    for (let i = 0, len = selections3.length; i < len; i++) {
      const selection3 = selections3[i],
        activeLine2 = selections_exports.activeLine(selection3);
      if (processedLines.size !== processedLines.add(activeLine2).size) {
        builder.insert(new vscode36.Position(activeLine2, 0), newLine);
      }
    }
  });
}
function newLine_below(_, repetitions, shift2) {
  if (shift2 === 1 /* Select */) {
    return insertLinesNativelyAndCopySelections(_, repetitions, "editor.action.insertLineAfter");
  }
  return edit((builder, selections3, document) => {
    const newLine = (document.eol === vscode36.EndOfLine.LF ? "\n" : "\r\n").repeat(repetitions),
      processedLines = /* @__PURE__ */ new Set();
    for (let i = 0, len = selections3.length; i < len; i++) {
      const selection3 = selections3[i],
        activeLine2 = selections_exports.activeLine(selection3);
      if (processedLines.size !== processedLines.add(activeLine2).size) {
        builder.insert(new vscode36.Position(activeLine2 + 1, 0), newLine);
      }
    }
  });
}
function prepareSelectionForLineInsertion(_, selection3) {
  const activeLine2 = selections_exports.activeLine(selection3);
  if (selection3.active.line !== activeLine2) {
    return new vscode36.Selection(selection3.anchor, selection3.active.with(activeLine2));
  }
  return selection3;
}
function extendArrayToLength(array, length4) {
  const arrayLen = array.length;
  if (length4 > arrayLen) {
    const newArray = array.slice(),
      last2 = array[arrayLen - 1];
    for (let i = arrayLen; i < length4; i++) {
      newArray.push(last2);
    }
    return newArray;
  } else {
    return array.slice(0, length4);
  }
}
async function insertLinesNativelyAndCopySelections(_, repetitions, command6) {
  selections_exports.updateByIndex(prepareSelectionForLineInsertion);
  if (repetitions === 1) {
    await vscode36.commands.executeCommand(command6);
    return;
  }
  const isLastCharacterAt = [];
  await vscode36.commands.executeCommand(command6);
  await _.edit((builder, selections4, document) => {
    for (const selection3 of selections4) {
      const active2 = selection3.active,
        lineStart3 = positions_exports.lineStart(active2.line),
        indentationRange = new vscode36.Range(lineStart3, active2),
        indentation = (document.getText(indentationRange) + "\n").repeat(repetitions - 1);
      if (active2.line === document.lineCount - 1) {
        isLastCharacterAt.push(true);
        builder.insert(positions_exports.lineEnd(active2.line), "\n" + indentation.slice(0, -1));
      } else {
        isLastCharacterAt.push(false);
        builder.insert(lineStart3.translate(1), indentation);
      }
    }
  });
  const selections3 = [];
  let selectionIndex = 0;
  for (let selection3 of _.selections) {
    if (isLastCharacterAt[selectionIndex++]) {
      selection3 = selections_exports.fromAnchorActive(
        selection3.anchor.translate(-repetitions + 1),
        selection3.active.translate(-repetitions + 1),
      );
    }
    const active2 = selection3.active,
      anchor2 = selection3.anchor;
    for (let i = repetitions - 1; i > 0; i--) {
      selections3.push(
        selections_exports.fromAnchorActive(anchor2.translate(i), active2.translate(i)),
      );
    }
    selections3.push(selection3);
  }
  _.selections = selections3;
}
var init_edit2 = __esm({
  "src/commands/edit.ts"() {
    "use strict";
    init_api();
    init_errors();
  },
});

// src/commands/history.ts
import * as vscode37 from "vscode";
function undo2() {
  return vscode37.commands.executeCommand("undo");
}
function redo2() {
  return vscode37.commands.executeCommand("redo");
}
function undo_selections() {
  return vscode37.commands.executeCommand("cursorUndo");
}
function redo_selections() {
  return vscode37.commands.executeCommand("cursorRedo");
}
async function repeat(_, repetitions, filter3 = /.+/) {
  if (typeof filter3 === "string") {
    filter3 = newRegExp(filter3, "u");
  }
  let commandDescriptor, commandArgument;
  const cursor = _.extension.recorder.cursorFromEnd();
  for (;;) {
    if (cursor.is(Entry.ExecuteCommand)) {
      const entry = cursor.entry(),
        descriptor = entry.descriptor();
      if (descriptor.shouldBeReplayed && filter3.test(descriptor.identifier)) {
        commandDescriptor = descriptor;
        commandArgument = entry.argument();
        break;
      }
    }
    if (!cursor.previous()) {
      throw new Error("no previous command matching " + filter3);
    }
  }
  for (let i = 0; i < repetitions; i++) {
    await commandDescriptor.replay(_, commandArgument);
  }
}
async function repeat_edit(_, repetitions) {
  _.doNotRecord();
  const recorder = _.extension.recorder,
    cursor = recorder.cursorFromEnd();
  let startCursor, endCursor;
  for (;;) {
    if (cursor.is(Entry.ChangeTextEditorMode)) {
      const modeName = cursor.entry().mode().name;
      if (modeName === "normal" || modeName.endsWith("/normal")) {
        cursor.previous();
        endCursor = cursor.clone();
      } else if ((modeName === "insert" || modeName.endsWith("/insert")) && endCursor !== void 0) {
        cursor.next();
        startCursor = cursor.clone();
        break;
      }
    }
    if (!cursor.previous()) {
      throw new Error("cannot find switch to normal or insert mode");
    }
  }
  for (let i = 0; i < repetitions; i++) {
    for (let cursor2 = startCursor.clone(); cursor2.isBeforeOrEqual(endCursor); cursor2.next()) {
      await cursor2.replay(_);
    }
  }
}
async function recording_play(_, repetitions, register) {
  const recording = register.getRecording();
  ArgumentError.validate(
    "recording",
    recording !== void 0,
    () => `register "${register.name}" does not hold a recording`,
  );
  for (let i = 0; i < repetitions; i++) {
    await recording.replay(_);
  }
}
function recording_start(_, register) {
  ArgumentError.validate(
    "register",
    !recordingPerRegister.has(register),
    "a recording is already active",
  );
  const recording = _.extension.recorder.startRecording();
  recordingPerRegister.set(register, recording);
}
function recording_stop(_, register) {
  const recording = recordingPerRegister.get(register);
  ArgumentError.validate(
    "register",
    recording !== void 0,
    "no recording is active in the given register",
  );
  recordingPerRegister.delete(register);
  register.setRecording(recording.complete());
}
var recordingPerRegister;
var init_history2 = __esm({
  "src/commands/history.ts"() {
    "use strict";
    init_recorder();
    init_errors();
    init_regexp();
    recordingPerRegister = /* @__PURE__ */ new WeakMap();
  },
});

// src/commands/keybindings.ts
import * as vscode38 from "vscode";
async function setup(_, register) {
  await vscode38.commands.executeCommand("workbench.action.openGlobalKeybindingsFile");
  await _.switchToDocument(_.extension.editors.active.editor.document);
  const action = await promptOne([
    ["y", "yank keybindings to register"],
    ["a", "append keybindings"],
    ["p", "prepend keybindings"],
  ]);
  if (typeof action === "string") {
    return;
  }
  const keybindings = await promptMany([["d", "default keybindings"]]);
  todo();
}
var init_keybindings = __esm({
  "src/commands/keybindings.ts"() {
    "use strict";
    init_api();
  },
});

// src/commands/misc.ts
function cancel(extension2) {
  extension2.cancelLastOperation(CancellationError.Reason.PressedEscape);
}
function ignore() {}
async function run2(_, argument2, codeOr, count, repetitions, register, commands16) {
  if (Array.isArray(commands16)) {
    if (typeof argument2["code"] === "string" && runIsEnabled()) {
    } else {
      return buildCommands(commands16, _.extension)(argument2, _);
    }
  }
  let code = await codeOr(() =>
    prompt(
      {
        prompt: "Code to run",
        validateInput(value2) {
          try {
            compileFunction(value2);
            return;
          } catch (e) {
            if (e instanceof SyntaxError) {
              return `invalid syntax: ${e.message}`;
            }
            return e?.message ?? `${e}`;
          }
        },
        history: runHistory,
      },
      _,
    ),
  );
  if (Array.isArray(code)) {
    code = code.join("\n");
  } else if (typeof code !== "string") {
    return new InputError(`expected code to be a string or an array, but it was ${code}`);
  }
  return _.run(() => run(code, { count, repetitions, register }));
}
async function selectRegister(_, registerOr) {
  const register = await registerOr(() => keypressForRegister(_));
  if (typeof register === "string") {
    if (register.length === 0) {
      return;
    }
    _.extension.currentRegister = _.extension.registers.getPossiblyScoped(register, _.document);
  } else {
    _.extension.currentRegister = register;
  }
}
async function updateRegister(_, register, copyFrom, inputOr) {
  if (copyFrom !== void 0) {
    const copyFromRegister =
      typeof copyFrom === "string"
        ? _.extension.registers.getPossiblyScoped(copyFrom, _.document)
        : copyFrom;
    copyFromRegister.ensureCanRead();
    await register.set(await copyFromRegister.get());
    return;
  }
  const input = await inputOr(() =>
    prompt({
      prompt: "New register contents",
      value: lastUpdateRegisterText,
      validateInput(value2) {
        lastUpdateRegisterText = value2;
        return void 0;
      },
    }),
  );
  await register.set([input]);
}
async function updateCount(_, count, extension2, countOr, addDigits) {
  if (typeof addDigits === "number") {
    let nextPowerOfTen = 1;
    if (addDigits <= 0) {
      addDigits = 0;
      nextPowerOfTen = 10;
    }
    while (nextPowerOfTen <= addDigits) {
      nextPowerOfTen *= 10;
    }
    extension2.currentCount = count * nextPowerOfTen + addDigits;
    return;
  }
  const input = +(await countOr(() => promptNumber({ integer: true, range: [0, 1e6] }, _)));
  InputError.validateInput(!isNaN(input), "value is not a number");
  InputError.validateInput(input >= 0, "value is negative");
  extension2.currentCount = input;
}
async function openMenu(_, menuOr, prefix, pass = [], locked = false, delay = 0, title) {
  const menus = _.extension.menus;
  let menu = await menuOr(() =>
    prompt(
      {
        prompt: "Menu name",
        validateInput(value2) {
          if (menus.has(value2)) {
            return;
          }
          return `menu ${JSON.stringify(value2)} does not exist`;
        },
        placeHolder: [...menus.keys()].sort().join(", ") || "no menu defined",
        history: menuHistory,
      },
      _,
    ),
  );
  if (typeof menu === "string") {
    menu = findMenu(menu, _);
  }
  if (title !== void 0) {
    menu = { ...menu, title };
  }
  const errors = validateMenu(menu);
  if (errors.length > 0) {
    throw new Error(`invalid menu: ${errors.join(", ")}`);
  }
  if (locked) {
    return showLockedMenu(menu, pass);
  }
  if (delay > 0) {
    return showMenuAfterDelay(delay, menu, pass, prefix);
  }
  return showMenu(menu, pass, prefix);
}
function changeInput(action) {
  ArgumentError.validate(
    "action",
    ["clear", "previous", "next"].includes(action),
    `must be "previous" or "next"`,
  );
  notifyPromptActionRequested(action);
}
async function ifEmpty(_, argument2, selections3, then, otherwise) {
  const selectionsAreEmpty = selections3.every(
    (selection3) => selection3.isEmpty || selections_exports.isSingleCharacter(selection3),
  );
  if (selectionsAreEmpty) {
    return then !== void 0 && (await buildCommands(then, _.extension)(argument2, _));
  }
  return otherwise !== void 0 && (await buildCommands(otherwise, _.extension)(argument2, _));
}
var runHistory, lastUpdateRegisterText, menuHistory;
var init_misc2 = __esm({
  "src/commands/misc.ts"() {
    "use strict";
    init_api();
    init_errors();
    runHistory = [];
    menuHistory = [];
  },
});

// src/commands/modes.ts
async function set2(_, modeOr) {
  await toMode(await modeOr(() => prompt(validateModeName())));
}
async function set_temporarily(_, modeOr, repetitions) {
  await toMode(await modeOr(() => prompt(validateModeName())), repetitions);
}
function validateModeName(ctx = Context.WithoutActiveEditor.current) {
  const modes = ctx.extension.modes;
  return {
    prompt: "Mode name",
    validateInput(value2) {
      if (modes.get(value2) !== void 0) {
        return;
      }
      return `mode ${JSON.stringify(value2)} does not exist`;
    },
    placeHolder: [...modes.userModes()]
      .map((m) => m.name)
      .sort()
      .join(", "),
    history: modeHistory,
  };
}
var modeHistory;
var init_modes3 = __esm({
  "src/commands/modes.ts"() {
    "use strict";
    init_api();
    modeHistory = [];
  },
});

// src/commands/search.ts
async function search2(
  _,
  register,
  repetitions,
  add = false,
  direction = 1 /* Forward */,
  interactive = true,
  shift2 = 0 /* Jump */,
  argument2,
) {
  return manipulateSelectionsInteractively(
    _,
    "re",
    argument2,
    interactive,
    {
      ...promptRegexpOpts("mu"),
      value: (await register.get())?.[0],
    },
    async (re, selections3) => {
      if (typeof re === "string") {
        re = newRegExp(re, "mu");
      }
      register.set([re.originalSource ?? re.source]);
      const newSelections = add ? selections3.slice() : [],
        regexpMatches = [];
      newSelections.push(
        ...selections_exports.mapByIndex((_i, selection3, document) => {
          let newSelection = selection3;
          for (let j = 0; j < repetitions; j++) {
            const searchResult = nextImpl(
              re,
              direction,
              newSelection,
              void 0,
              void 0,
              document,
              /* allowWrapping= */
              shift2 !== 2 /* Extend */,
              regexpMatches,
              regexpMatches.length,
            );
            if (searchResult === void 0) {
              return void 0;
            }
            newSelection = searchResult;
          }
          if (shift2 === 0 /* Jump */) {
            return newSelection;
          }
          const position = direction === 1 /* Forward */ ? newSelection.end : newSelection.start;
          return selections_exports.shift(selection3, position, shift2, _);
        }, selections3),
      );
      selections_exports.set(newSelections);
      _.extension.registers.updateRegExpMatches(regexpMatches);
      await register.set([re.originalSource ?? re.source]);
      return re;
    },
  );
}
function selection2(document, selections3, register, smart = false) {
  const texts = [],
    isWord = smart ? getCharSetFunction(7 /* Word */, document) : void 0;
  for (const selection3 of selections3) {
    let text4 = escapeForRegExp(document.getText(selection3)).replace(/\n/g, "\\n");
    if (text4.length === 0) {
      continue;
    }
    if (smart) {
      let firstLine,
        isBeginningOfWord = isWord(text4.charCodeAt(0));
      const firstLineStart = selection3.start.character;
      if (isBeginningOfWord && firstLineStart > 0) {
        firstLine = document.lineAt(selection3.start).text;
        isBeginningOfWord = !isWord(firstLine.charCodeAt(firstLineStart - 1));
      }
      const lastLineEnd = selection3.end.character,
        lastLine2 =
          selection3.isSingleLine && firstLine !== void 0
            ? firstLine
            : document.lineAt(selection3.end).text,
        isEndOfWord =
          lastLineEnd > 0 &&
          lastLineEnd + 1 < lastLine2.length &&
          isWord(lastLine2.charCodeAt(lastLineEnd - 1)) &&
          !isWord(lastLine2.charCodeAt(lastLineEnd));
      if (isBeginningOfWord) {
        const prefix = text4.charCodeAt(0) < 128 ? "\\b" : "(?<=^|\\P{L})";
        text4 = prefix + text4;
      }
      if (isEndOfWord) {
        const suffix = text4.charCodeAt(text4.length - 1) < 128 ? "\\b" : "(?=\\P{L}|$)";
        text4 += suffix;
      }
    }
    texts.push(text4);
  }
  if (texts.length === 0) {
    throw new Error("all selections are empty");
  }
  register.set(texts);
}
async function next2(_, document, register, repetitions, add = false, direction = 1 /* Forward */) {
  const reStrs = await register.get();
  if (reStrs === void 0 || reStrs.length === 0) {
    return;
  }
  const re = newRegExp(reStrs[0], "mu"),
    allRegexpMatches = [],
    selections3 = _.selections.slice();
  let mainSelection = selections3[0];
  if (!add) {
    for (let j = 0; j < repetitions; j++) {
      const next3 = nextImpl(
        re,
        direction,
        mainSelection,
        void 0,
        void 0,
        document,
        /* allowWrapping= */
        true,
        allRegexpMatches,
        allRegexpMatches.length,
      );
      if (next3 === void 0) {
        return;
      }
      mainSelection = next3;
    }
    selections3[0] = mainSelection;
  } else {
    for (let i = 0; i < repetitions; i++) {
      const regexpMatches = [],
        next3 = nextImpl(
          re,
          direction,
          mainSelection,
          void 0,
          void 0,
          document,
          /* allowWrapping= */
          true,
          regexpMatches,
          regexpMatches.length,
        );
      if (next3 !== void 0) {
        selections3.unshift(next3);
        mainSelection = next3;
      } else {
        const target = direction === -1 /* Backward */ ? "previous" : "next",
          times = repetitions === 1 ? "time" : "times";
        throw new EmptySelectionsError(
          `main selection could not advance to ${target} match ${repetitions} ${times}`,
        );
      }
      allRegexpMatches.unshift(...regexpMatches);
    }
  }
  selections_exports.set(selections3);
  _.extension.registers.updateRegExpMatches(allRegexpMatches);
}
function nextImpl(
  re,
  direction,
  selection3,
  searchStart,
  searchEnd,
  document,
  allowWrapping,
  matches,
  matchesIndex,
) {
  searchStart ??= direction === -1 /* Backward */ ? selection3.start : selection3.end;
  const searchResult = search(direction, re, searchStart, searchEnd);
  if (searchResult === void 0) {
    if (allowWrapping) {
      if (direction === -1 /* Backward */) {
        searchStart = positions_exports.last(document);
        searchEnd = positions_exports.zero;
      } else {
        searchStart = positions_exports.zero;
        searchEnd = positions_exports.last(document);
      }
      return nextImpl(
        re,
        direction,
        selection3,
        searchStart,
        searchEnd,
        document,
        false,
        matches,
        matchesIndex,
      );
    }
    return;
  }
  if (matches !== void 0) {
    matches[matchesIndex] = searchResult[1];
  }
  return selections_exports.fromLength(
    searchResult[0],
    searchResult[1][0].length,
    selection3.isReversed,
    document,
  );
}
var init_search2 = __esm({
  "src/commands/search.ts"() {
    "use strict";
    init_api();
    init_charset();
    init_regexp();
  },
});

// src/commands/seek.ts
import * as vscode39 from "vscode";
async function seek(
  _,
  inputOr,
  repetitions,
  direction = 1 /* Forward */,
  shift2 = 1 /* Select */,
  include = false,
) {
  const input = await inputOr(() => keypress(_));
  selections_exports.updateByIndex((_2, selection3, document) => {
    let position = selections_exports.seekFrom(selection3, -direction);
    for (let i = 0; i < repetitions; i++) {
      position = positions_exports.offset(position, direction, document);
      if (position === void 0) {
        return void 0;
      }
      position = moveToExcluded(direction, input, position, document);
      if (position === void 0) {
        return void 0;
      }
    }
    if (
      include &&
      !(
        shift2 === 2 /* Extend */ &&
        direction === -1 /* Backward */ &&
        position.isAfter(selection3.anchor)
      )
    ) {
      position = positions_exports.offset(position, input.length * direction);
      if (position === void 0) {
        return void 0;
      }
    }
    return selections_exports.shift(selection3, position, shift2);
  });
}
function enclosing(_, direction = 1 /* Forward */, shift2 = 1 /* Select */, open2 = true, pairs) {
  if (pairs === void 0) {
    const languageConfig = vscode39.workspace.getConfiguration("editor.language", _.document),
      bracketsConfig = languageConfig.get("brackets");
    if (Array.isArray(bracketsConfig)) {
      const flattenedPairs = [];
      for (const bracketPair of bracketsConfig) {
        if (
          !Array.isArray(bracketPair) ||
          bracketPair.length !== 2 ||
          typeof bracketPair[0] !== "string" ||
          typeof bracketPair[1] !== "string"
        ) {
          throw new Error(
            "setting `editor.language.brackets` contains an invalid entry: " +
              JSON.stringify(bracketPair),
          );
        }
        flattenedPairs.push(escapeForRegExp(bracketPair[0]), escapeForRegExp(bracketPair[1]));
      }
      pairs = flattenedPairs;
    } else {
      pairs = defaultEnclosingPatterns;
    }
  }
  ArgumentError.validate(
    "pairs",
    (pairs.length & 1) === 0,
    "an even number of pairs must be given",
  );
  const selectionBehavior = _.selectionBehavior,
    compiledPairs = [];
  for (let i = 0; i < pairs.length; i += 2) {
    compiledPairs.push(pair(new RegExp(pairs[i], "mu"), new RegExp(pairs[i + 1], "mu")));
  }
  selections_exports.updateByIndex((_2, selection3, document) => {
    let currentCharacter = selection3.active;
    if (direction === -1 /* Backward */ && selection3.isReversed && !selection3.isEmpty) {
      currentCharacter = positions_exports.previous(currentCharacter, document) ?? currentCharacter;
    } else if (direction === 1 /* Forward */ && !selection3.isReversed && !selection3.isEmpty) {
      currentCharacter = positions_exports.previous(currentCharacter, document) ?? currentCharacter;
    }
    const enclosedRange = closestSurroundedBy(
      compiledPairs,
      direction,
      currentCharacter,
      open2,
      document,
    );
    if (enclosedRange === void 0) {
      return void 0;
    }
    if (shift2 === 2 /* Extend */) {
      return new vscode39.Selection(selection3.anchor, enclosedRange.active);
    }
    return enclosedRange;
  });
}
function word(
  _,
  repetitions,
  stopAtEnd = false,
  ws = false,
  direction = 1 /* Forward */,
  shift2 = 1 /* Select */,
) {
  const charset = ws ? 3 /* NonBlank */ : 7 /* Word */;
  selections_exports.updateWithFallbackByIndex((_i, selection3) => {
    const wasReversed = selection3.isReversed;
    const oldAnchor = selection3.anchor;
    const newAnchor = selections_exports.seekFrom(selection3, direction, selection3.anchor, _);
    let active2 = selections_exports.seekFrom(selection3, direction, selection3.active, _);
    for (let i = 0; i < repetitions; i++) {
      const mapped = wordBoundary(direction, active2, stopAtEnd, charset, _);
      if (mapped === void 0) {
        if (direction === -1 /* Backward */ && active2.line > 0) {
          const end2 =
            _.selectionBehavior === 1 /* Caret */
              ? positions_exports.lineStart(1)
              : lines_exports.isEmpty(1)
                ? positions_exports.lineStart(2)
                : positions_exports.at(1, 1);
          return new vscode39.Selection(positions_exports.lineStart(0), end2);
        }
        if (shift2 === 2 /* Extend */) {
          let newSelection = new vscode39.Selection(oldAnchor, selection3.active);
          if (newSelection.isReversed !== wasReversed) {
            newSelection = new vscode39.Selection(newAnchor, selection3.active);
          }
          return newSelection;
        }
        return [selection3];
      }
      selection3 = mapped;
      active2 = selection3.active;
    }
    if (shift2 === 2 /* Extend */) {
      let newSelection = new vscode39.Selection(oldAnchor, selection3.active);
      if (newSelection.isReversed !== wasReversed) {
        newSelection = new vscode39.Selection(newAnchor, selection3.active);
      }
      return newSelection;
    }
    return selection3;
  });
}
async function object(_, inputOr, inner = false, where, shift2 = 1 /* Select */, treeSitter) {
  const input = await inputOr(() =>
    prompt({
      prompt: "Object description",
      value: lastObjectInput,
    }),
  );
  let match;
  if ((match = /^(.+)\(\?#inner\)(.+)$/s.exec(input))) {
    const openRe = new RegExp(preprocessRegExp(match[1]), "u"),
      closeRe = new RegExp(preprocessRegExp(match[2]), "u"),
      p = pair(openRe, closeRe);
    if (where === "start") {
      return selections_exports.updateByIndex((_i, selection3) => {
        const startResult = p.searchOpening(selections_exports.activeStart(selection3, _));
        if (startResult === void 0) {
          return;
        }
        const start2 = inner
          ? (positions_exports.offset(startResult[0], startResult[1][0].length, _.document) ??
            startResult[0])
          : startResult[0];
        return selections_exports.shift(selection3, start2, shift2, _);
      });
    }
    if (where === "end") {
      return selections_exports.updateByIndex((_i, selection3) => {
        const endResult = p.searchClosing(selections_exports.activeEnd(selection3, _));
        if (endResult === void 0) {
          return;
        }
        const end2 = inner
          ? endResult[0]
          : (positions_exports.offset(endResult[0], endResult[1][0].length, _.document) ??
            endResult[0]);
        return selections_exports.shift(selection3, end2, shift2, _);
      });
    }
    if (_.selectionBehavior === 2 /* Character */) {
      const startRe = new RegExp("^" + openRe.source, openRe.flags);
      return selections_exports.updateByIndex((_i, selection3) => {
        const searchStart = selections_exports.activeStart(selection3, _),
          searchStartResult = search(1 /* Forward */, startRe, searchStart);
        if (searchStartResult?.[1][0].length === 1) {
          const start2 = searchStartResult[0],
            innerStart = positions_exports.offset(
              start2,
              searchStartResult[1][0].length,
              _.document,
            ),
            endResult = p.searchClosing(innerStart);
          if (endResult === void 0) {
            return void 0;
          }
          if (inner) {
            return new vscode39.Selection(innerStart, endResult[0]);
          }
          return new vscode39.Selection(
            start2,
            positions_exports.offset(endResult[0], endResult[1][0].length, _.document),
          );
        }
        return surroundedBy([p], selections_exports.activeStart(selection3, _), !inner, _.document);
      });
    }
    return selections_exports.updateByIndex((_i, selection3) =>
      surroundedBy([p], selections_exports.activeStart(selection3, _), !inner, _.document),
    );
  }
  if (
    (match = /^(?:\(\?<before>(\[.+?\])\+\))?(\[.+\])\+(?:\(\?<after>(\[.+?\])\+\))?$/.exec(input))
  ) {
    const re = new RegExp(match[2], "u"),
      beforeRe = inner || match[1] === void 0 ? void 0 : new RegExp(match[1], "u"),
      afterRe = inner || match[3] === void 0 ? void 0 : new RegExp(match[3], "u");
    return shiftWhere(
      _,
      (selection3, _2) => {
        let start2 = moveWhileBackward((c) => re.test(c), selection3.active, _2.document),
          end2 = moveWhileForward((c) => re.test(c), selection3.active, _2.document);
        if (beforeRe !== void 0) {
          start2 = moveWhileBackward((c) => beforeRe.test(c), start2, _2.document);
        }
        if (afterRe !== void 0) {
          end2 = moveWhileForward((c) => afterRe.test(c), end2, _2.document);
        }
        return new vscode39.Selection(start2, end2);
      },
      shift2,
      where,
    );
  }
  if ((match = /^\(\?#singleline\)(.+)$/.exec(input))) {
    const re = new RegExp(preprocessRegExp(match[1]), "u");
    return shiftWhere(
      _,
      (selection3, _2) => {
        const line2 = selections_exports.activeLine(selection3),
          lineText = _2.document.lineAt(line2).text,
          matches = execRange(lineText, re);
        const character2 = selections_exports.activeCharacter(selection3, _2.document);
        for (const m of matches) {
          let [start2, end2] = m;
          if (start2 <= character2 && character2 <= end2) {
            if (inner && m[2].groups !== void 0) {
              const match2 = m[2];
              if ("before" in match2.groups) {
                start2 += match2.groups["before"].length;
              }
              if ("after" in match2.groups) {
                end2 -= match2.groups["after"].length;
              }
            }
            return new vscode39.Selection(
              new vscode39.Position(line2, start2),
              new vscode39.Position(line2, end2),
            );
          }
        }
        return void 0;
      },
      shift2,
      where,
    );
  }
  if ((match = /^\(\?#predefined=(argument|indent|paragraph|sentence)\)$/.exec(input))) {
    let f;
    switch (match[1]) {
      case "argument":
      case "indent":
      case "paragraph":
      case "sentence":
        f = objects_exports[match[1]];
        break;
      default:
        assert(false);
    }
    let newSelections;
    if (where === "start") {
      newSelections = selections_exports.mapByIndex((_i, selection3, document) => {
        const activePosition2 = selections_exports.activePosition(selection3, _.document);
        let shiftTo = f.start(activePosition2, inner, document);
        if (shiftTo.isEqual(activePosition2)) {
          const activePositionBefore = positions_exports.previous(activePosition2, document);
          if (activePositionBefore !== void 0) {
            shiftTo = f.start(activePositionBefore, inner, document);
          }
        }
        return selections_exports.shift(selection3, shiftTo, shift2, _);
      });
    } else if (where === "end") {
      newSelections = selections_exports.mapByIndex((_i, selection3, document) =>
        selections_exports.shift(selection3, f.end(selection3.active, inner, document), shift2, _),
      );
    } else {
      newSelections = selections_exports.mapByIndex((_2, selection3, document) =>
        f(selection3.active, inner, document),
      );
    }
    if (_.selectionBehavior === 2 /* Character */) {
      selections_exports.shiftEmptyLeft(newSelections, _.document);
    }
    return selections_exports.set(newSelections);
  }
  if ((match = /^\(\?#textobject=(\w+)\)$/.exec(input))) {
    if (treeSitter === void 0) {
      throw new Error("tree-sitter is not available");
    }
    const query = await treeSitter.textObjectQueryFor(_.document);
    if (query === void 0) {
      throw new Error("no textobject query available for current document");
    }
    const newSelections = await treeSitter.withDocumentTree(_.document, (documentTree) => {
      const textObjectName = match[1] + (inner ? ".inside" : ".around");
      if (!query.captureNames.includes(textObjectName)) {
        const existingValues = query.captureNames
          .map((name) => `"${name.replace(".inside", "").replace(".around", "")}"`)
          .join(", ");
        throw new Error(
          `unknown textobject ${JSON.stringify(textObjectName)}, valid values are ${existingValues}`,
        );
      }
      const captures = query
        .captures(documentTree.rootNode)
        .filter((capture) => capture.name === textObjectName)
        .map(({ node }) => [node, treeSitter.toRange(node)]);
      return selections_exports.mapByIndex((_i, selection3) => {
        const active2 = selection3.active;
        let smallestNode;
        const smallestNodeLength = Number.MAX_SAFE_INTEGER;
        for (const [node, nodeRange] of captures) {
          if (!nodeRange.contains(active2)) {
            continue;
          }
          const nodeLength = node.endIndex - node.startIndex;
          if (nodeLength < smallestNodeLength && !nodeRange.isEqual(selection3)) {
            smallestNode = node;
          }
        }
        return smallestNode === void 0
          ? selection3
          : selections_exports.fromStartEnd(
              treeSitter.toPosition(smallestNode.startPosition),
              treeSitter.toPosition(smallestNode.endPosition),
              selections_exports.isStrictlyReversed(selection3, _),
            );
      });
    });
    return selections_exports.set(newSelections);
  }
  throw new Error("unknown object " + JSON.stringify(input));
}
function syntax_experimental(_, treeSitter, documentTree, where = "next") {
  const rootNode = documentTree.rootNode;
  selections_exports.updateByIndex((_2, selection3) => {
    const activeNode = rootNode.namedDescendantForPosition(
      treeSitter.fromPosition(selection3.active),
    );
    let newNode;
    switch (where) {
      case "next":
        newNode = activeNode.nextNamedSibling;
        break;
      case "previous":
        newNode = activeNode.previousNamedSibling;
        break;
      case "child":
        newNode = activeNode.firstNamedChild;
        break;
      case "parent":
        newNode = activeNode.parent;
        break;
    }
    if (newNode == null) {
      return selection3;
    }
    return selections_exports.fromRange(treeSitter.toRange(newNode));
  }, _);
}
async function leap(_, direction = 1 /* Forward */, labels = "sft") {
  ArgumentError.validate("labels", !labels.includes(" "), "must not contain a space ' '");
  labels = labels.toLowerCase();
  ArgumentError.validate(
    "labels",
    new Set(labels).size === [...labels].length,
    "must not reuse characters",
  );
  const editor = _.editor,
    doc = _.document,
    highlightColor = new vscode39.ThemeColor("inputValidation.errorBackground"),
    dimHighlightColor = new vscode39.ThemeColor("inputValidation.warningBackground"),
    foregroundColor = new vscode39.ThemeColor("input.foreground"),
    dimForegroundColor = new vscode39.ThemeColor("input.foreground"),
    renderOptions = {
      borderColor: highlightColor,
      borderStyle: "solid",
      borderWidth: "1px",
    },
    activeLabeledSets = [],
    inactiveLabeledSets = [],
    activeLabelRenderOptions = {
      ...renderOptions,
      backgroundColor: highlightColor,
      color: foregroundColor,
    },
    inactiveLabelRenderOptions = {
      ...renderOptions,
      borderColor: dimHighlightColor,
      backgroundColor: dimHighlightColor,
      color: dimForegroundColor,
    },
    addSelection = (labeledSets, labeledRenderOptions, selection3, i) => {
      if (i < labeledSets.length) {
        labeledSets[i].addSelection(selection3);
      } else {
        labeledSets[i] = new StyledSet(fromArray([selection3], doc), _.getState(), {
          ...renderOptions,
          after: {
            ...labeledRenderOptions,
            contentText: labels[i],
          },
        });
      }
      return labeledSets[i];
    };
  const cutoffPosition = _.mainSelection.active,
    endPosition2 =
      direction === 1 /* Forward */ ? positions_exports.last(doc) : positions_exports.zero,
    allowedRange = new vscode39.Range(cutoffPosition, endPosition2),
    firstChar = await keypress(_),
    pairSelections = selections_exports.selectWithin(
      new RegExp(escapeForRegExp(firstChar) + ".?", "is"),
      editor.visibleRanges.flatMap((range) => {
        const intersection = range.intersection(allowedRange);
        return intersection === void 0 ? [] : [selections_exports.fromRange(intersection)];
      }),
    ),
    secondCharToUnlabeledSelection = {},
    secondCharToLabeledSelections = {};
  selections_exports.sort(direction, pairSelections);
  for (const pairSelection of pairSelections) {
    const text4 = selections_exports.text(pairSelection, doc),
      secondChar = text4.length === 1 ? "\n" : text4[1];
    if (secondChar in secondCharToUnlabeledSelection) {
      const labeledSelectionsForSecondChar = (secondCharToLabeledSelections[secondChar] ??= []),
        length4 = labeledSelectionsForSecondChar.length,
        labeledSet =
          length4 < labels.length
            ? addSelection(activeLabeledSets, activeLabelRenderOptions, pairSelection, length4)
            : addSelection(
                inactiveLabeledSets,
                inactiveLabelRenderOptions,
                pairSelection,
                length4 % labels.length,
              );
      labeledSelectionsForSecondChar.push([pairSelection, labeledSet]);
    } else {
      secondCharToUnlabeledSelection[secondChar] = pairSelection;
    }
  }
  const unlabeledSelections = Object.values(secondCharToUnlabeledSelection),
    unlabeledSelectionsSet = new StyledSet(
      fromArray(unlabeledSelections, doc),
      _.getState(),
      renderOptions,
    );
  try {
    const secondChar = await keypress(_),
      unlabeledSelection = secondCharToUnlabeledSelection[secondChar];
    if (unlabeledSelection === void 0) {
      return;
    }
    selections_exports.set([selections_exports.empty(unlabeledSelection.start)], _);
    const labeledSelections = secondCharToLabeledSelections[secondChar]?.map((x) => x[0]);
    if (labeledSelections === void 0 || labeledSelections.length === 0) {
      return;
    }
    delete secondCharToLabeledSelections[secondChar];
    const selectionsToDeletePerSet = /* @__PURE__ */ new Map();
    for (const [selection3, styledSet] of Object.values(secondCharToLabeledSelections).flat(1)) {
      let arr = selectionsToDeletePerSet.get(styledSet);
      if (arr === void 0) {
        selectionsToDeletePerSet.set(styledSet, (arr = []));
      }
      arr.push(selection3);
    }
    for (const [styledSet, selections3] of selectionsToDeletePerSet) {
      if (selections3.length === styledSet.length) {
        styledSet.dispose();
      } else {
        styledSet.deleteSelections(selections3);
      }
    }
    unlabeledSelectionsSet.clearSelections();
    let offset2 = 0;
    for (;;) {
      const labelChar = await keypress(_);
      if (labelChar === " ") {
        if (labels.length >= labeledSelections.length) {
          continue;
        }
        for (let i = 0; i < labels.length; i++) {
          if (offset2 + i < labeledSelections.length) {
            const labeledSelection = labeledSelections[offset2 + i];
            addSelection(inactiveLabeledSets, inactiveLabelRenderOptions, labeledSelection, i);
            activeLabeledSets[i].deleteSelections([labeledSelection]);
          } else {
            inactiveLabeledSets[i].clearSelections();
          }
        }
        if (offset2 + labels.length >= labeledSelections.length) {
          offset2 = 0;
        } else {
          offset2 += labels.length;
        }
        for (let i = 0; i < labels.length; i++) {
          if (offset2 + i < labeledSelections.length) {
            const labeledSelection = labeledSelections[offset2 + i];
            activeLabeledSets[i].addSelection(labeledSelection);
            inactiveLabeledSets[i].deleteSelections([labeledSelection]);
          } else {
            activeLabeledSets[i].clearSelections();
          }
        }
        continue;
      }
      const index = labels.indexOf(labelChar.toLowerCase());
      if (index === -1) {
        return;
      }
      const selection3 = labeledSelections[offset2 + index];
      selections_exports.set([selections_exports.empty(selection3.start)], _);
      return;
    }
  } finally {
    unlabeledSelectionsSet.dispose();
    activeLabeledSets.forEach((set3) => set3.dispose());
    inactiveLabeledSets.forEach((set3) => set3.dispose());
  }
}
async function wordLabel(_, labelChars = "abcdefghijklmnopqrstuvwxyz", shift2 = 1 /* Select */) {
  ArgumentError.validate("labelChars", !/\s/.test(labelChars), "must not contain whitespace");
  ArgumentError.validate(
    "labelChars",
    new Set(labelChars).size === [...labelChars].length,
    "must not reuse characters",
  );
  const editor = _.editor,
    doc = _.document,
    highlightColor = new vscode39.ThemeColor("inputValidation.errorBackground"),
    foregroundColor = new vscode39.ThemeColor("input.foreground");
  const wordSelections = selections_exports
    .topToBottom(
      selections_exports.selectWithin(
        new RegExp(`\\b\\w[^\\s${escapeForRegExp(getCharacters(4 /* Punctuation */, doc))}]+`),
        // words with 2 or more characters
        editor.visibleRanges.map(selections_exports.fromRange),
      ),
    )
    .filter((selection3) => !selection3.contains(_.selections[0].active));
  const labelsToSelections = /* @__PURE__ */ new Map();
  for (let i = 0; i < wordSelections.length && i < labelChars.length * labelChars.length; i++) {
    const labelFirstChar = labelChars[Math.floor(i / labelChars.length)];
    const labelSecondChar = labelChars[i % labelChars.length];
    labelsToSelections.set(`${labelFirstChar}${labelSecondChar}`, wordSelections[i]);
  }
  const decorations = Array.from(labelsToSelections, ([label, selection3]) => {
    const range = new vscode39.Range(selection3.start, selection3.start);
    return {
      range,
      renderOptions: {
        after: {
          contentText: label,
          backgroundColor: highlightColor,
          color: foregroundColor,
          width: "2ch",
          textDecoration: "none; position: absolute;",
        },
      },
    };
  });
  const decorationType = vscode39.window.createTextEditorDecorationType({
    before: { textDecoration: "none" },
  });
  try {
    editor.setDecorations(decorationType, decorations);
    let input = "";
    while (input.length < 2) {
      input += await keypress(_);
    }
    const chosenSelection = labelsToSelections.get(input);
    if (chosenSelection !== void 0) {
      if (shift2 === 2 /* Extend */) {
        const primarySelection = _.selections[0];
        const direction = chosenSelection.start.isBefore(primarySelection.active)
          ? -1 /* Backward */
          : 1 /* Forward */;
        const newSelection =
          direction === -1 /* Backward */
            ? selections_exports.fromStartEnd(
                selections_exports.start(chosenSelection),
                selections_exports.end(primarySelection),
                true,
              )
            : selections_exports.fromStartEnd(
                selections_exports.start(primarySelection),
                selections_exports.end(chosenSelection),
                false,
              );
        selections_exports.set([newSelection], _);
      } else {
        selections_exports.set([chosenSelection], _);
      }
    }
  } finally {
    editor.setDecorations(decorationType, []);
    decorationType.dispose();
  }
}
function preprocessRegExp(re) {
  return re.replace(/\(\?#noescape\)/g, "(?<=(?<!\\\\)(?:\\\\{2})*)");
}
function shiftWhere(context, f, shift2, where) {
  selections_exports.updateByIndex((_, selection3) => {
    const result = f(selection3, context);
    if (result === void 0) {
      return void 0;
    }
    if (where === void 0) {
      return result;
    }
    return selections_exports.shift(selection3, result[where], shift2, context);
  });
}
var defaultEnclosingPatterns, lastObjectInput;
var init_seek = __esm({
  "src/commands/seek.ts"() {
    "use strict";
    init_api();
    init_charset();
    init_errors();
    init_regexp();
    init_tracked_selection();
    defaultEnclosingPatterns = [
      "\\[",
      "\\]",
      "\\(",
      "\\)",
      "\\{",
      "\\}",
      "/\\*",
      "\\*/",
      "\\bbegin\\b",
      "\\bend\\b",
    ];
  },
});

// src/commands/select.ts
import * as vscode40 from "vscode";
function buffer(_) {
  selections_exports.set([selections_exports.wholeBuffer()]);
}
function vertically(
  _,
  selections3,
  avoidEol = false,
  repetitions,
  direction = 1 /* Forward */,
  shift2 = 1 /* Select */,
  by,
) {
  if (by !== void 0) {
    const visibleLines = _.editor.visibleRanges.reduce(
      (lines2, range) => lines2 + (range.end.line - range.start.line),
      0,
    );
    if (by === "page") {
      repetitions *= visibleLines;
    } else if (by === "halfPage") {
      repetitions *= (visibleLines / 2) | 0;
    }
  }
  const document = _.document,
    isCharacterMode = _.selectionBehavior === 2 /* Character */;
  const activeEnd2 = (selection3) => {
    const active2 = selection3.active;
    if (active2 === selection3.end && selections_exports.endsWithLineBreak(selection3)) {
      return lines_exports.columns(active2.line - 1, _.editor) + 1;
    } else if (active2 === selection3.start && isCharacterMode) {
      return lines_exports.column(active2.line, active2.character, _.editor) + 1;
    }
    return lines_exports.column(active2.line, active2.character, _.editor);
  };
  const editorState = _.getState();
  let preferredColumnsState = editorState.get(preferredColumnsToken);
  if (preferredColumnsState === void 0) {
    const disposable = _.extension
      .createAutoDisposable()
      .disposeOnEvent(editorState.onEditorWasClosed)
      .addDisposable(
        vscode40.window.onDidChangeTextEditorSelection((e) => {
          if (editorState.editor !== e.textEditor) {
            return;
          }
          const expectedSelections = preferredColumnsState.expectedSelections;
          if (
            e.selections.length === expectedSelections.length &&
            e.selections.every((sel, i) => sel.isEqual(expectedSelections[i]))
          ) {
            return;
          }
          editorState.store(preferredColumnsToken, void 0);
          disposable.dispose();
        }),
      );
    editorState.store(
      preferredColumnsToken,
      (preferredColumnsState = {
        disposable,
        expectedSelections: [],
        preferredColumns: selections3.map((sel) => activeEnd2(sel)),
      }),
    );
  }
  const newSelections = selections_exports.mapByIndex((i, selection3) => {
    const activeLine2 = isCharacterMode
        ? selections_exports.activeLine(selection3)
        : selection3.active.line,
      targetLine = lines_exports.clamp(activeLine2 + repetitions * direction, document),
      targetLineLength = lines_exports.columns(targetLine, _.editor);
    if (targetLineLength === 0) {
      let targetPosition = positions_exports.lineStart(targetLine);
      if (isCharacterMode) {
        if (
          shift2 === 0 /* Jump */ ||
          (direction === -1 /* Backward */
            ? selection3.contains(targetPosition)
            : !selection3.contains(targetPosition) || targetPosition.isEqual(selection3.active))
        ) {
          targetPosition = positions_exports.next(targetPosition, document) ?? targetPosition;
        }
        if (
          direction === -1 /* Backward */ &&
          shift2 === 2 /* Extend */ &&
          selections_exports.isSingleCharacter(selection3, document)
        ) {
          selection3 = new vscode40.Selection(
            positions_exports.next(selection3.anchor, document) ?? selection3.anchor,
            selection3.active,
          );
        }
      }
      return selections_exports.shift(selection3, targetPosition, shift2);
    }
    let targetColumn;
    const preferredColumns = preferredColumnsState.preferredColumns,
      preferredColumn = i < preferredColumns.length ? preferredColumns[i] : activeEnd2(selection3);
    if (preferredColumn <= targetLineLength) {
      targetColumn = preferredColumn;
    } else if (isCharacterMode && !avoidEol) {
      if (direction === 1 /* Forward */ && targetLine + 1 < document.lineCount) {
        if (shift2 === 2 /* Extend */) {
          const targetPosition =
            selection3.anchor.line <= targetLine
              ? positions_exports.lineBreak(targetLine)
              : positions_exports.lineEnd(targetLine);
          return selections_exports.shift(selection3, targetPosition, shift2);
        }
        return selections_exports.shift(
          selection3,
          new vscode40.Position(targetLine + 1, 0),
          shift2,
        );
      } else if (direction === -1 /* Backward */) {
        if (shift2 === 2 /* Extend */ && targetLine < selection3.anchor.line) {
          return selections_exports.shift(
            selection3,
            positions_exports.lineEnd(targetLine),
            shift2,
          );
        }
        return selections_exports.shift(
          selection3,
          positions_exports.lineBreak(targetLine),
          shift2,
        );
      }
      targetColumn = targetLineLength;
    } else {
      targetColumn = targetLineLength;
    }
    let newPosition = new vscode40.Position(
      targetLine,
      lines_exports.character(
        targetLine,
        targetColumn,
        _.editor,
        /* roundUp= */
        isCharacterMode,
      ),
    );
    if (isCharacterMode && shift2 !== 0 /* Jump */) {
      const edge2 = shift2 === 2 /* Extend */ ? selection3.anchor : selection3.active;
      if (newPosition.isBefore(edge2)) {
        newPosition = positions_exports.previous(newPosition, document) ?? newPosition;
      }
    }
    return selections_exports.shift(selection3, newPosition, shift2);
  });
  if (_.selectionBehavior === 2 /* Character */) {
    selections_exports.shiftEmptyLeft(newSelections, document);
  }
  selections_exports.set(newSelections);
  preferredColumnsState.expectedSelections = unsafeSelections(editorState.editor);
}
function horizontally(
  _,
  avoidEol = false,
  repetitions,
  direction = 1 /* Forward */,
  shift2 = 1 /* Select */,
) {
  const newSelections = selections_exports.mapByIndex((_i, selection3, document) => {
    let active2 =
      selection3.active === selection3.start
        ? selections_exports.activeStart(selection3, _)
        : selections_exports.activeEnd(selection3, _);
    if (_.selectionBehavior === 2 /* Character */) {
      if (
        direction === -1 /* Backward */ &&
        shift2 === 2 /* Extend */ &&
        selections_exports.isSingleCharacter(selection3)
      ) {
        active2 = selection3.start;
      } else if (shift2 === 0 /* Jump */ && selection3.active === selection3.start) {
        active2 = positions_exports.next(active2, _.document) ?? active2;
      }
    }
    let target = positions_exports.offset(active2, direction * repetitions, document) ?? active2;
    if (avoidEol) {
      switch (_.selectionBehavior) {
        case 1 /* Caret */:
          if (
            target.character === lines_exports.length(target.line, document) &&
            target.character > 0
          ) {
            target = positions_exports.offset(target, direction, document) ?? target;
          }
          break;
        case 2 /* Character */:
          if (
            target.character === 0 &&
            (direction === 1 /* Forward */ ||
              target.line === 0 ||
              !lines_exports.isEmpty(target.line - 1, document))
          ) {
            target = positions_exports.offset(target, direction, document) ?? target;
          }
          break;
      }
    }
    return selections_exports.shift(selection3, target, shift2);
  });
  if (_.selectionBehavior === 2 /* Character */) {
    selections_exports.shiftEmptyLeft(newSelections, _.document);
  }
  selections_exports.set(newSelections);
}
function to(_, count, argument2, shift2 = 1 /* Select */) {
  if (count === 0) {
    return showMenuByName("goto", [argument2]);
  }
  return lineStart2(_, count, shift2);
}
function line_below(_, count) {
  if (count === 0 || count === 1) {
    selections_exports.updateByIndex((_2, selection3) => {
      let line2 = selections_exports.activeLine(selection3);
      if (selections_exports.isEntireLines(selection3) && !selection3.isReversed) {
        line2++;
      }
      return new vscode40.Selection(line2, 0, line2 + 1, 0);
    });
  } else {
    selections_exports.updateByIndex((_2, selection3, document) => {
      const lastLine2 = document.lineCount - 1;
      let line2 = Math.min(selections_exports.activeLine(selection3) + count - 1, lastLine2);
      if (selections_exports.isEntireLines(selection3) && line2 < lastLine2) {
        line2++;
      }
      return new vscode40.Selection(line2, 0, line2 + 1, 0);
    });
  }
}
function line_below_extend(_, count) {
  if (count === 0 || count === 1) {
    selections_exports.updateByIndex((_2, selection3, document) => {
      const isFullLine = selections_exports.endsWithEntireLine(selection3),
        isSameLine = selections_exports.isSingleLine(selection3),
        isFullLineDiff = isFullLine && !(isSameLine && selection3.isReversed) ? 1 : 0,
        activeLine2 = selections_exports.activeLine(selection3);
      const anchor2 = isSameLine ? positions_exports.lineStart(activeLine2) : selection3.anchor,
        active2 = positions_exports.lineBreak(activeLine2 + isFullLineDiff, document);
      return new vscode40.Selection(anchor2, active2);
    });
  } else {
    selections_exports.updateByIndex((_2, selection3, document) => {
      const activeLine2 = selections_exports.activeLine(selection3),
        line2 = Math.min(activeLine2 + count - 1, document.lineCount - 1),
        isSameLine = selections_exports.isSingleLine(selection3);
      const anchor2 = isSameLine ? positions_exports.lineStart(activeLine2) : selection3.anchor,
        active2 = positions_exports.lineBreak(line2, document);
      return new vscode40.Selection(anchor2, active2);
    });
  }
}
function line_above(_, count) {
  if (count === 0 || count === 1) {
    selections_exports.updateByIndex((_2, selection3) => {
      let line2 = selections_exports.activeLine(selection3);
      if (!selections_exports.isEntireLines(selection3)) {
        line2++;
      }
      return new vscode40.Selection(line2, 0, line2 - 1, 0);
    });
  } else {
    selections_exports.updateByIndex((_2, selection3) => {
      let line2 = Math.max(selections_exports.activeLine(selection3) - count + 1, 0);
      if (!selections_exports.isEntireLines(selection3)) {
        line2++;
      }
      return new vscode40.Selection(line2, 0, line2 - 1, 0);
    });
  }
}
function line_above_extend(_, count) {
  if (count === 0 || count === 1) {
    selections_exports.updateByIndex((_2, selection3) => {
      if (selection3.isSingleLine) {
        let line2 = selections_exports.activeLine(selection3);
        if (!selections_exports.isEntireLines(selection3)) {
          line2++;
        }
        return new vscode40.Selection(line2, 0, line2 - 1, 0);
      }
      if (selection3.active === selection3.end && selections_exports.isEntireLine(selection3)) {
        const line2 = selections_exports.activeLine(selection3);
        return new vscode40.Selection(line2 + 1, 0, line2 - 1, 0);
      }
      const isFullLine = selections_exports.activeLineIsFullySelected(selection3),
        isFullLineDiff = isFullLine ? -1 : 0,
        active2 = new vscode40.Position(
          selections_exports.activeLine(selection3) + isFullLineDiff,
          0,
        );
      return new vscode40.Selection(selection3.anchor, active2);
    });
  } else {
    selections_exports.updateByIndex((_2, selection3, document) => {
      let line2 = Math.max(selections_exports.activeLine(selection3) - count, 0),
        anchor2 = selection3.anchor;
      if (selection3.active === selection3.end) {
        anchor2 = selection3.active;
      }
      if (selection3.isSingleLine) {
        anchor2 = positions_exports.lineBreak(selection3.anchor.line, document);
        line2++;
      } else if (!selections_exports.startsWithEntireLine(selection3)) {
        line2++;
      }
      return new vscode40.Selection(anchor2, new vscode40.Position(line2, 0));
    });
  }
}
function lineStart2(_, count, shift2 = 1 /* Select */, skipBlank = false) {
  if (count > 0) {
    const selection3 = _.selections[0],
      newLine = Math.min(_.document.lineCount, count) - 1,
      newPosition = skipBlank
        ? positions_exports.nonBlankLineStart(newLine, _.document)
        : positions_exports.lineStart(newLine),
      newSelection = selections_exports.shift(selection3, newPosition, shift2);
    selections_exports.set([newSelection]);
    return;
  }
  selections_exports.updateByIndex((_2, selection3) =>
    selections_exports.shift(
      selection3,
      skipBlank
        ? positions_exports.nonBlankLineStart(selections_exports.activeLine(selection3))
        : positions_exports.lineStart(selections_exports.activeLine(selection3)),
      shift2,
    ),
  );
}
function lineEnd2(_, count, shift2 = 1 /* Select */, lineBreak2 = false) {
  const mapSelection = (selection3, newLine) => {
    const newActive = positions_exports.lineEnd(newLine);
    if (_.selectionBehavior === 2 /* Character */ && shift2 === 0 /* Jump */) {
      if (lineBreak2) {
        return selections_exports.from(
          newActive,
          positions_exports.next(newActive, _.document) ?? newActive,
        );
      } else {
        return selections_exports.from(
          positions_exports.previous(newActive, _.document) ?? newActive,
          newActive,
        );
      }
    }
    return selections_exports.shift(selection3, newActive, shift2);
  };
  if (count > 0) {
    const newLine = Math.min(_.document.lineCount, count) - 1;
    selections_exports.set([mapSelection(_.mainSelection, newLine)]);
    return;
  }
  selections_exports.updateByIndex((_2, selection3) =>
    mapSelection(selection3, selections_exports.activeLine(selection3)),
  );
}
function lastLine(_, document, shift2 = 1 /* Select */) {
  let line2 = document.lineCount - 1;
  if (line2 > 0 && document.lineAt(line2).text.length === 0) {
    line2--;
  }
  selections_exports.set([
    selections_exports.shift(_.mainSelection, positions_exports.lineStart(line2), shift2),
  ]);
}
function firstVisibleLine2(_, shift2 = 1 /* Select */) {
  const selection3 = _.mainSelection,
    toPosition = positions_exports.lineStart(firstVisibleLine(_.editor));
  selections_exports.set([selections_exports.shift(selection3, toPosition, shift2)]);
}
function middleVisibleLine2(_, shift2 = 1 /* Select */) {
  const selection3 = _.mainSelection,
    toPosition = positions_exports.lineStart(middleVisibleLine(_.editor));
  selections_exports.set([selections_exports.shift(selection3, toPosition, shift2)]);
}
function lastVisibleLine2(_, shift2 = 1 /* Select */) {
  const selection3 = _.mainSelection,
    toPosition = positions_exports.lineStart(lastVisibleLine(_.editor));
  selections_exports.set([selections_exports.shift(selection3, toPosition, shift2)]);
}
var preferredColumnsToken;
var init_select = __esm({
  "src/commands/select.ts"() {
    "use strict";
    init_api();
    init_editors();
    init_misc();
    preferredColumnsToken = PerEditorState.registerState(
      /* isDisposable= */
      false,
    );
  },
});

// src/commands/selections.ts
import * as vscode41 from "vscode";
function saveText(document, selections3, register) {
  register.set(selections3.map(document.getText.bind(document)));
}
function save(_, document, selections3, register, style, until, untilDelay = 100) {
  const trackedSelections = fromArray(selections3, document);
  let trackedSelectionSet;
  if (typeof style === "object") {
    const validator = new SettingsValidator(),
      renderOptions = Mode.decorationObjectToDecorationRenderOptions(style, validator);
    validator.throwErrorIfNeeded();
    renderOptions.rangeBehavior = vscode41.DecorationRangeBehavior.ClosedOpen;
    trackedSelectionSet = new StyledSet(trackedSelections, _.getState(), renderOptions);
    trackedSelectionSet.flags |= 12 /* EmptyMoves */;
  } else {
    trackedSelectionSet = new Set2(trackedSelections, document);
  }
  const disposable = _.extension
    .createAutoDisposable()
    .addNotifyingDisposable(trackedSelectionSet)
    .addDisposable(
      new vscode41.Disposable(() => {
        if (register.canReadSelections() && register.getSelectionSet() === trackedSelectionSet) {
          register.replaceSelectionSet().dispose();
        }
      }),
    );
  if (Array.isArray(until)) {
    if (untilDelay <= 0) {
      until.forEach((until2) => disposable.disposeOnUserEvent(until2, _));
    } else {
      setTimeout(() => {
        try {
          _.getState();
        } catch {
          return disposable.dispose();
        }
        until.forEach((until2) => disposable.disposeOnUserEvent(until2, _));
      }, untilDelay);
    }
  }
  register.replaceSelectionSet(trackedSelectionSet)?.dispose();
}
async function restore2(_, register) {
  const selectionSet = register.getSelectionSet();
  if (selectionSet === void 0) {
    throw new EmptySelectionsError(`no selections are saved in register "${register.name}"`);
  }
  await _.switchToDocument(
    selectionSet.document,
    /* alsoFocusEditor= */
    true,
  );
  _.selections = selectionSet.restore();
}
async function restore_withCurrent(_, document, register, reverse = false, action) {
  const savedSelections = register.getSelections();
  EmptySelectionsError.throwIfRegisterIsEmpty(savedSelections, register.name);
  let from2 = savedSelections,
    add = _.selections;
  if (reverse) {
    from2 = _.selections;
    add = savedSelections;
  }
  const type = await promptOne(
    [
      ["a", "Append lists"],
      ["u", "Union"],
      ["i", "Intersection"],
      ["<", "Select leftmost cursor"],
      [">", "Select rightmost cursor"],
      ["+", "Select longest"],
      ["-", "Select shortest"],
    ],
    void 0,
    {
      defaultPick: action,
      defaultPickName: "action",
    },
  );
  if (type === 0) {
    _.selections = from2.concat(add);
    return;
  }
  if (from2.length !== add.length) {
    throw new Error("the current and register selections have different sizes");
  }
  const selections3 = [];
  for (let i = 0; i < from2.length; i++) {
    const a = from2[i],
      b = add[i];
    switch (type) {
      case 1: {
        const anchor2 = a.start.isBefore(b.start) ? a.start : b.start,
          active2 = a.end.isAfter(b.end) ? a.end : b.end;
        selections3.push(new vscode41.Selection(anchor2, active2));
        break;
      }
      case 2: {
        const anchor2 = a.start.isAfter(b.start) ? a.start : b.start,
          active2 = a.end.isBefore(b.end) ? a.end : b.end;
        selections3.push(new vscode41.Selection(anchor2, active2));
        break;
      }
      case 3:
        if (a.active.isBeforeOrEqual(b.active)) {
          selections3.push(a);
        } else {
          selections3.push(b);
        }
        break;
      case 4:
        if (a.active.isAfterOrEqual(b.active)) {
          selections3.push(a);
        } else {
          selections3.push(b);
        }
        break;
      case 5: {
        const aLength = document.offsetAt(a.end) - document.offsetAt(a.start),
          bLength = document.offsetAt(b.end) - document.offsetAt(b.start);
        if (aLength > bLength) {
          selections3.push(a);
        } else {
          selections3.push(b);
        }
        break;
      }
      case 6: {
        const aLength = document.offsetAt(a.end) - document.offsetAt(a.start),
          bLength = document.offsetAt(b.end) - document.offsetAt(b.start);
        if (aLength < bLength) {
          selections3.push(a);
        } else {
          selections3.push(b);
        }
        break;
      }
    }
  }
  _.selections = selections3;
}
async function pipe2(_, register, expressionOr) {
  const expression = await expressionOr(() =>
    prompt(
      {
        prompt: "Expression",
        validateInput(value2) {
          try {
            return void validateForSwitchRun(value2);
          } catch (e) {
            return e?.message ?? `${e}`;
          }
        },
        history: pipeHistory,
      },
      _,
    ),
  );
  const selections3 = _.selections,
    document = _.document,
    selectionsStrings = selections3.map((selection3) => document.getText(selection3));
  const results = await Promise.all(
    _.run((_2) =>
      selectionsStrings.map((string, i, strings2) =>
        switchRun(expression, { $: string, $$: strings2, i, n: strings2.length }),
      ),
    ),
  );
  const strings = results.map(resultToString);
  await register.set(strings);
}
function filter2(_, argument2, defaultExpression, inverse = false, interactive = true, count = 0) {
  const document = _.document,
    strings = _.selections.map((selection3) => document.getText(selection3));
  return manipulateSelectionsInteractively(
    _,
    "expression",
    argument2,
    interactive,
    {
      prompt: "Expression",
      validateInput(value2) {
        try {
          return void validateForSwitchRun(value2);
        } catch (e) {
          return e?.message ?? `${e}`;
        }
      },
      value: defaultExpression,
      valueSelection: defaultExpression
        ? [defaultExpression.length, defaultExpression.length]
        : void 0,
      history: filterHistory,
    },
    async (expression, selections3) => {
      selections_exports.set(
        await selections_exports.filterByIndex(async (i) => {
          const context = { $: strings[i], $$: strings, i, n: strings.length, count };
          try {
            return !!(await switchRun(expression, context)) !== inverse;
          } catch {
            return inverse;
          }
        }, selections3),
      );
      return expression;
    },
  );
}
function clear_secondary(_) {
  selections_exports.set(_.selections.slice(0, 1));
}
function clear_main(_) {
  selections_exports.set(_.selections.slice(1));
}
async function select(_, register, interactive = true, argument2) {
  return manipulateSelectionsInteractively(
    _,
    "re",
    argument2,
    interactive,
    { ...promptRegexpOpts("mu"), value: (await register.get())?.[0] },
    (re, selections3) => {
      if (typeof re === "string") {
        re = newRegExp(re, "mu");
      }
      register.set([re.originalSource ?? re.source]);
      selections_exports.set(
        selections_exports.bottomToTop(selections_exports.selectWithin(re, selections3)),
      );
      return Promise.resolve(re);
    },
  );
}
async function split2(_, register, excludeEmpty = false, interactive = true, argument2) {
  return manipulateSelectionsInteractively(
    _,
    "re",
    argument2,
    interactive,
    { ...promptRegexpOpts("mu"), value: (await register.get())?.[0] },
    (re, selections3) => {
      if (typeof re === "string") {
        re = newRegExp(re, "mu");
      }
      register.set([re.originalSource ?? re.source]);
      let split3 = selections_exports.split(re, selections3);
      if (excludeEmpty) {
        split3 = split3.filter((s) => !s.isEmpty);
      }
      selections_exports.set(selections_exports.bottomToTop(split3));
      return Promise.resolve(re);
    },
  );
}
function splitLines(_, document, selections3, repetitions, excludeEol = false) {
  const newSelections = [],
    lineEnd3 = excludeEol ? positions_exports.lineEnd : positions_exports.lineBreak;
  for (let i = 0, len = selections3.length; i < len; i++) {
    const selection3 = selections3[i],
      start2 = selection3.start,
      end2 = selection3.end,
      startLine = start2.line,
      endLine2 = end2.line,
      isReversed = selection3.isReversed;
    if (startLine === endLine2) {
      newSelections.push(selection3);
      return;
    }
    newSelections.push(
      selections_exports.fromStartEnd(start2, lineEnd3(startLine, document), isReversed, document),
    );
    for (let line2 = startLine + repetitions; line2 < endLine2; line2 += repetitions) {
      const start3 = positions_exports.lineStart(line2),
        end3 = lineEnd3(line2, document);
      newSelections.push(selections_exports.fromStartEnd(start3, end3, isReversed, document));
    }
    if (endLine2 % repetitions === 0 && end2.character > 0) {
      newSelections.push(
        selections_exports.fromStartEnd(
          positions_exports.lineStart(endLine2),
          end2,
          isReversed,
          document,
        ),
      );
    }
  }
  selections_exports.set(selections_exports.bottomToTop(newSelections));
}
function expandToLines(_) {
  return selections_exports.updateByIndex((_i, selection3, document) => {
    const start2 = selection3.start,
      end2 = selection3.end;
    const newStart = start2.with(void 0, 0);
    let newEnd;
    if (end2.character === 0 && end2.line !== start2.line) {
      newEnd = end2;
    } else if (end2.line + 1 < document.lineCount) {
      newEnd = new vscode41.Position(end2.line + 1, 0);
    } else {
      const textLen = document.lineAt(end2.line).text.length;
      newEnd = end2.with(void 0, textLen);
    }
    return selections_exports.fromStartEnd(
      newStart,
      newEnd,
      selections_exports.isStrictlyReversed(selection3, _),
    );
  });
}
function trimLines(_) {
  return selections_exports.updateByIndex((_2, selection3) => {
    const start2 = selection3.start,
      end2 = selection3.end;
    const newStart = start2.character === 0 ? start2 : new vscode41.Position(start2.line + 1, 0);
    const newEnd = new vscode41.Position(end2.line, 0);
    if (newStart.isAfterOrEqual(newEnd)) {
      return void 0;
    }
    if (selection3.isReversed && newStart.line + 1 !== newEnd.line) {
      return new vscode41.Selection(newEnd, newStart);
    } else {
      return new vscode41.Selection(newStart, newEnd);
    }
  });
}
function trimWhitespace(_) {
  const blank = getCharacters(2 /* Blank */, _.document),
    isBlank = (character2) => blank.includes(character2);
  return selections_exports.updateByIndex((_2, selection3, document) => {
    const firstCharacter = selection3.start,
      lastCharacter = selection3.end;
    const start2 = moveWhileForward(isBlank, firstCharacter, document),
      end2 = moveWhileBackward(isBlank, lastCharacter, document);
    if (start2.isAfter(end2)) {
      return void 0;
    }
    return selections_exports.fromStartEnd(start2, end2, selection3.isReversed);
  });
}
function reduce(_, where = "active", empty2 = true) {
  ArgumentError.validate(
    "where",
    ["active", "anchor", "start", "end", "both"].includes(where),
    `"where" must be "active", "anchor", "start", "end", "both", or undefined`,
  );
  if (empty2 && _.selectionBehavior !== 2 /* Character */) {
    if (where !== "both") {
      selections_exports.updateByIndex((_2, selection3) =>
        selections_exports.empty(selection3[where]),
      );
    } else {
      selections_exports.set(
        _.selections.flatMap((selection3) => {
          if (selection3.isEmpty) {
            return [selection3];
          }
          return [
            selections_exports.empty(selection3.active),
            selections_exports.empty(selection3.anchor),
          ];
        }),
      );
    }
    return;
  }
  const takeWhere = (selection3, prop) => {
    if (selection3.isEmpty) {
      return selection3;
    }
    let start2 = selection3[prop],
      end2;
    if (start2 === selection3.end && !start2.isEqual(selection3.start)) {
      end2 = start2;
      start2 = positions_exports.previous(start2);
    } else {
      end2 = positions_exports.next(start2) ?? start2;
    }
    return selections_exports.from(start2, end2);
  };
  if (where !== "both") {
    selections_exports.updateByIndex((_2, selection3) => takeWhere(selection3, where));
    return;
  }
  selections_exports.set(
    _.selections.flatMap((selection3) => {
      if (selection3.isEmpty || selections_exports.isNonDirectional(selection3)) {
        return [selection3];
      }
      return [takeWhere(selection3, "active"), takeWhere(selection3, "anchor")];
    }),
  );
}
function changeDirection(_, direction) {
  switch (direction) {
    case -1 /* Backward */:
      selections_exports.updateByIndex((_2, selection3) =>
        selection3.isReversed ||
        selection3.isEmpty ||
        selections_exports.isNonDirectional(selection3)
          ? selection3
          : new vscode41.Selection(selection3.end, selection3.start),
      );
      break;
    case 1 /* Forward */:
      selections_exports.updateByIndex((_2, selection3) =>
        selection3.isReversed
          ? new vscode41.Selection(selection3.start, selection3.end)
          : selection3,
      );
      break;
    default:
      selections_exports.updateByIndex((_2, selection3) =>
        selection3.isEmpty || selections_exports.isNonDirectional(selection3)
          ? selection3
          : new vscode41.Selection(selection3.active, selection3.anchor),
      );
      break;
  }
}
function changeOrder(_, selections3, direction) {
  switch (direction) {
    case -1 /* Backward */:
    case 1 /* Forward */:
      selections_exports.set(selections_exports.sort(direction, selections3), _);
      break;
    default:
      selections_exports.set(selections3.reverse(), _);
      break;
  }
}
async function sort2(_, expressionOr, direction = 1 /* Forward */) {
  const expression = await expressionOr(() =>
    prompt(
      {
        prompt: "Expression",
        validateInput(value2) {
          try {
            return void validateForSwitchRun(value2);
          } catch (e) {
            return e?.message ?? `${e}`;
          }
        },
        history: pipeHistory,
      },
      _,
    ),
  );
  const document = _.document,
    selectionsStrings = _.selections.map((selection3) => document.getText(selection3));
  const results = await Promise.all(
    _.run((_2) =>
      selectionsStrings.map((string, i, strings2) =>
        switchRun(expression, { $: string, $$: strings2, i, n: strings2.length }),
      ),
    ),
  );
  const numbers = [],
    strings = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (numbers.length === i) {
      if (typeof result === "number") {
        numbers.push(result);
        continue;
      }
      if (typeof result === "string" || typeof result === "boolean") {
        const asNumber = +result;
        if (!isNaN(asNumber)) {
          numbers.push(asNumber);
          continue;
        }
      }
      for (const number of numbers) {
        strings.push(`${number}`);
      }
    }
    strings.push(resultToString(result));
  }
  const selections3 = _.selections.slice(),
    selectionToIndex = new Map(selections3.map((s, i) => [s, i]));
  if (numbers.length === results.length) {
    selections3.sort((a, b) => numbers[selectionToIndex.get(a)] - numbers[selectionToIndex.get(b)]);
  } else {
    selections3.sort((a, b) =>
      strings[selectionToIndex.get(a)].localeCompare(strings[selectionToIndex.get(b)]),
    );
  }
  if (direction === -1 /* Backward */) {
    selections3.reverse();
  }
  selections_exports.set(selections3, _);
}
function copy2(_, document, selections3, repetitions, direction = 1 /* Forward */) {
  const newSelections = [],
    lineCount = document.lineCount;
  for (const selection3 of selections3) {
    const activeLine2 = selections_exports.activeLine(selection3);
    let currentLine = activeLine2 + direction;
    for (let i = 0; i < repetitions; ) {
      if (currentLine < 0 || currentLine >= lineCount) {
        break;
      }
      const copiedSelection = tryCopySelection(document, selection3, currentLine);
      if (copiedSelection === void 0) {
        currentLine += direction;
        continue;
      }
      newSelections.push(copiedSelection);
      i++;
      currentLine =
        direction === -1 /* Backward */
          ? copiedSelection.end.line - 1
          : copiedSelection.start.line + 1;
    }
  }
  newSelections.push(...selections3);
  selections_exports.set(newSelections);
}
function merge2(_) {
  selections_exports.set(selections_exports.mergeConsecutive(selections_exports.current()));
}
async function open(_) {
  const basePath = vscode41.Uri.joinPath(_.document.uri, "..");
  await Promise.all(
    selections_exports.map(
      async (text4) =>
        await vscode41.window.showTextDocument(
          await vscode41.workspace.openTextDocument(vscode41.Uri.joinPath(basePath, text4)),
        ),
    ),
  );
}
function toggleIndices(_, display = void 0, until = []) {
  const editorState = _.getState();
  let disposable = editorState.get(indicesToken);
  if (disposable !== void 0) {
    if (display !== true) {
      editorState.store(indicesToken, void 0);
      disposable.dispose();
    }
    return;
  }
  if (display === false) {
    return;
  }
  const indicesDecorationType = vscode41.window.createTextEditorDecorationType({
    after: {
      color: new vscode41.ThemeColor("textLink.activeForeground"),
      margin: "0 0 0 20px",
    },
    isWholeLine: true,
  });
  function onDidChangeSelection(editor) {
    const selections3 = unsafeSelections(editor),
      selectionsPerLine = /* @__PURE__ */ new Map();
    for (let i = 0; i < selections3.length; i++) {
      const selection3 = selections3[i],
        active2 = selection3.active,
        activeLine2 = selections_exports.activeLine(selection3),
        activeCharacter2 =
          activeLine2 === active2.line ? active2.character : Number.MAX_SAFE_INTEGER,
        selectionsForLine = selectionsPerLine.get(activeLine2);
      if (selectionsForLine === void 0) {
        selectionsPerLine.set(activeLine2, [[activeCharacter2, i]]);
      } else {
        selectionsForLine.push([activeCharacter2, i]);
      }
    }
    const ranges = [];
    for (const [line2, selectionsForLine] of selectionsPerLine) {
      selectionsForLine.sort((a, b) => a[0] - b[0]);
      const rangePosition = new vscode41.Position(line2, 0),
        range = new vscode41.Range(rangePosition, rangePosition);
      ranges.push({
        range,
        renderOptions: {
          after: {
            contentText: "#" + selectionsForLine.map((x) => x[1]).join(", #"),
          },
        },
      });
    }
    editor.setDecorations(indicesDecorationType, ranges);
  }
  disposable = _.extension
    .createAutoDisposable()
    .addDisposable(indicesDecorationType)
    .addDisposable(
      vscode41.window.onDidChangeTextEditorSelection(
        (e) => e.textEditor === editorState.editor && onDidChangeSelection(e.textEditor),
      ),
    )
    .addDisposable(
      editorState.onVisibilityDidChange((e) => e.isVisible && onDidChangeSelection(e.editor)),
    );
  editorState.store(indicesToken, disposable);
  if (Array.isArray(until)) {
    until.forEach((until2) => disposable.disposeOnUserEvent(until2, _));
  }
  onDidChangeSelection(editorState.editor);
}
function tryCopySelection(document, selection3, newActiveLine) {
  const active2 = selection3.active,
    anchor2 = selection3.anchor,
    activeLine2 = selections_exports.activeLine(selection3),
    endCharacter2 = selections_exports.endCharacter(selection3, document);
  let activeCharacter2 = selection3.end === active2 ? endCharacter2 : active2.character,
    anchorCharacter = selection3.end === anchor2 ? endCharacter2 : anchor2.character;
  if (activeLine2 === anchor2.line) {
    const newLineLength = document.lineAt(newActiveLine).text.length;
    if (endCharacter2 > newLineLength) {
      if (endCharacter2 !== newLineLength + 1) {
        return void 0;
      }
      return selection3.end === active2
        ? new vscode41.Selection(newActiveLine, anchorCharacter, newActiveLine + 1, 0)
        : new vscode41.Selection(newActiveLine + 1, 0, newActiveLine, activeCharacter2);
    }
    return new vscode41.Selection(newActiveLine, anchorCharacter, newActiveLine, activeCharacter2);
  }
  let newAnchorLine = newActiveLine + anchor2.line - activeLine2;
  if (newAnchorLine < 0 || newAnchorLine >= document.lineCount) {
    return void 0;
  }
  const newAnchorLineLength = document.lineAt(newAnchorLine).text.length;
  if (anchorCharacter > newAnchorLineLength) {
    if (anchorCharacter !== newAnchorLineLength + 1) {
      return void 0;
    }
    newAnchorLine++;
    anchorCharacter = 0;
  }
  const newActiveLineLength = document.lineAt(newActiveLine).text.length;
  if (active2.character > newActiveLineLength) {
    if (activeCharacter2 !== newActiveLineLength + 1) {
      return void 0;
    }
    newActiveLine++;
    activeCharacter2 = 0;
  }
  const newSelection = new vscode41.Selection(
    newAnchorLine,
    anchorCharacter,
    newActiveLine,
    activeCharacter2,
  );
  if (selections_exports.overlap(selection3, newSelection)) {
    return void 0;
  }
  return newSelection;
}
function resultToString(result) {
  if (result === null) {
    return "null";
  }
  if (result === void 0) {
    return "";
  }
  if (typeof result === "string") {
    return result;
  }
  if (typeof result === "number" || typeof result === "boolean") {
    return result.toString();
  }
  if (typeof result === "object") {
    return JSON.stringify(result);
  }
  throw new Error("invalid returned value by expression");
}
var pipeHistory, filterHistory, indicesToken;
var init_selections2 = __esm({
  "src/commands/selections.ts"() {
    "use strict";
    init_api();
    init_editors();
    init_modes2();
    init_charset();
    init_errors();
    init_misc();
    init_regexp();
    init_settings_validator();
    init_tracked_selection();
    pipeHistory = [];
    filterHistory = [];
    indicesToken = PerEditorState.registerState(
      /* isDisposable= */
      true,
    );
  },
});

// src/commands/selections.rotate.ts
function both(_, repetitions, reverse = false) {
  if (reverse) {
    repetitions = -repetitions;
  }
  return rotate2(repetitions);
}
function contents(_, repetitions, reverse = false) {
  if (reverse) {
    repetitions = -repetitions;
  }
  return rotateContents(repetitions);
}
function selections2(_, repetitions, reverse = false) {
  if (reverse) {
    repetitions = -repetitions;
  }
  return rotateSelections(repetitions);
}
var init_selections_rotate = __esm({
  "src/commands/selections.rotate.ts"() {
    "use strict";
    init_api();
  },
});

// src/commands/view.ts
import * as vscode42 from "vscode";
function line(_, at2 = "center") {
  return vscode42.commands.executeCommand("revealLine", {
    at: at2,
    lineNumber: selections_exports.activeLine(_.mainSelection),
  });
}
var init_view = __esm({
  "src/commands/view.ts"() {
    "use strict";
    init_api();
  },
});

// src/commands/load-all.ts
var load_all_exports = {};
__export(load_all_exports, {
  commands: () => commands15,
});
function getRegister(_, argument2, defaultRegisterName, requiredFlags) {
  let register = argument2.register;
  const extension2 = _.extension;
  if (typeof register === "string") {
    if (register.startsWith(" ")) {
      if (!(_ instanceof Context)) {
        throw new EditorRequiredError();
      }
      register = extension2.registers.forDocument(_.document).get(register.slice(1));
    } else {
      register = extension2.registers.get(register);
    }
  } else if (!(register instanceof Register)) {
    register = extension2.registers.get(defaultRegisterName);
  }
  register.checkFlags(requiredFlags);
  return (argument2.register = register);
}
function getCount(_, argument2) {
  const count = +argument2.count;
  if (count >= 0 && Number.isInteger(count)) {
    return count;
  }
  return (argument2.count = 0);
}
function getRepetitions(_, argument2) {
  const count = getCount(_, argument2);
  if (count <= 0) {
    return 1;
  }
  return count;
}
function getDirection(argument2) {
  const direction = argument2.direction;
  if (direction === void 0) {
    return void 0;
  }
  if (typeof direction === "number") {
    if (direction === 1 || direction === -1) {
      return direction;
    }
  } else if (typeof direction === "string") {
    if (direction === "forward") {
      return 1 /* Forward */;
    }
    if (direction === "backward") {
      return -1 /* Backward */;
    }
  }
  throw new ArgumentError(
    '"direction" must be "forward", "backward", 1, -1, or undefined',
    "direction",
  );
}
function getShift(argument2) {
  const shift2 = argument2.shift;
  if (shift2 === void 0) {
    return void 0;
  }
  if (typeof shift2 === "number") {
    if (shift2 === 0 || shift2 === 1 || shift2 === 2) {
      return shift2;
    }
  } else if (typeof shift2 === "string") {
    if (shift2 === "jump") {
      return 0 /* Jump */;
    }
    if (shift2 === "select") {
      return 1 /* Select */;
    }
    if (shift2 === "extend") {
      return 2 /* Extend */;
    }
  }
  throw new ArgumentError(
    '"shift" must be "jump", "select", "extend", 0, 1, 2, or undefined',
    "shift",
  );
}
function getInputOr(argumentName, argument2) {
  const defaultInput = argument2[argumentName] ?? argument2["input"];
  if (defaultInput != null) {
    return () => defaultInput;
  }
  return (promptDefaultInput) => {
    const result = promptDefaultInput();
    if (typeof result.then === "function") {
      return result.then((x) => (argument2[argumentName] = x));
    }
    return (argument2[argumentName] = result);
  };
}
function describeAdditionalCommand(commands16, name, flags, innerCommands) {
  const runCommand = buildCommands(innerCommands, { commands: commands16 });
  commands16[name] = new CommandDescriptor(
    name,
    (_, argument2) => _.runAsync((_2) => runCommand(argument2, _2)),
    flags,
  );
}
var commands15;
var init_load_all = __esm({
  "src/commands/load-all.ts"() {
    "use strict";
    init_commands();
    init_api();
    init_registers2();
    init_dev();
    init_edit2();
    init_history2();
    init_keybindings();
    init_misc2();
    init_modes3();
    init_search2();
    init_seek();
    init_select();
    init_selections2();
    init_selections_rotate();
    init_view();
    commands15 = (function () {
      const commands16 = {
        "dance.cancel": new CommandDescriptor(
          "dance.cancel",
          (_) => _.runAsync(async (_2) => await cancel(_2.extension)),
          CommandDescriptor.Flags.None,
        ),
        "dance.changeInput": new CommandDescriptor(
          "dance.changeInput",
          (_, argument2) => _.runAsync(async (_2) => await changeInput(argument2["action"])),
          CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.dev.copyLastErrorMessage": new CommandDescriptor(
          "dance.dev.copyLastErrorMessage",
          (_) => _.runAsync(async (_2) => await copyLastErrorMessage(_2.extension)),
          CommandDescriptor.Flags.None,
        ),
        "dance.dev.setSelectionBehavior": new CommandDescriptor(
          "dance.dev.setSelectionBehavior",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await setSelectionBehavior(_2, _2.extension, argument2["mode"], argument2["value"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.align": new CommandDescriptor(
          "dance.edit.align",
          (_, argument2) => _.runAsync(async (_2) => await align(_2, argument2["fill"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.case.swap": new CommandDescriptor(
          "dance.edit.case.swap",
          (_) => _.runAsync(async (_2) => await case_swap(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.case.toLower": new CommandDescriptor(
          "dance.edit.case.toLower",
          (_) => _.runAsync(async (_2) => await case_toLower(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.case.toUpper": new CommandDescriptor(
          "dance.edit.case.toUpper",
          (_) => _.runAsync(async (_2) => await case_toUpper(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.copyIndentation": new CommandDescriptor(
          "dance.edit.copyIndentation",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await copyIndentation(_2, _2.document, _2.selections, getCount(_2, argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.deindent": new CommandDescriptor(
          "dance.edit.deindent",
          (_, argument2) =>
            _.runAsync(async (_2) => await deindent(_2, getRepetitions(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.deindent.withIncomplete": new CommandDescriptor(
          "dance.edit.deindent.withIncomplete",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await deindent_withIncomplete(_2, getRepetitions(_2, argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.indent": new CommandDescriptor(
          "dance.edit.indent",
          (_, argument2) =>
            _.runAsync(async (_2) => await indent2(_2, getRepetitions(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.indent.withEmpty": new CommandDescriptor(
          "dance.edit.indent.withEmpty",
          (_, argument2) =>
            _.runAsync(async (_2) => await indent_withEmpty(_2, getRepetitions(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.insert": new CommandDescriptor(
          "dance.edit.insert",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await insert2(
                  _2,
                  _2.selections,
                  getRegister(_2, argument2, "dquote", Register.Flags.CanRead),
                  argument2["adjust"],
                  argument2["all"],
                  argument2["handleNewLine"],
                  getRepetitions(_2, argument2),
                  getShift(argument2),
                  argument2["text"],
                  argument2["where"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.join": new CommandDescriptor(
          "dance.edit.join",
          (_, argument2) => _.runAsync(async (_2) => await join(_2, argument2["separator"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.join.select": new CommandDescriptor(
          "dance.edit.join.select",
          (_, argument2) => _.runAsync(async (_2) => await join_select(_2, argument2["separator"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.newLine.above": new CommandDescriptor(
          "dance.edit.newLine.above",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await newLine_above(_2, getRepetitions(_2, argument2), getShift(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.newLine.below": new CommandDescriptor(
          "dance.edit.newLine.below",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await newLine_below(_2, getRepetitions(_2, argument2), getShift(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.edit.replaceCharacters": new CommandDescriptor(
          "dance.edit.replaceCharacters",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await replaceCharacters(
                  _2,
                  getRepetitions(_2, argument2),
                  getInputOr("input", argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.history.recording.play": new CommandDescriptor(
          "dance.history.recording.play",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await recording_play(
                  _2,
                  getRepetitions(_2, argument2),
                  getRegister(_2, argument2, "arobase", Register.Flags.CanReadWriteMacros),
                ),
            ),
          CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.history.recording.start": new CommandDescriptor(
          "dance.history.recording.start",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await recording_start(
                  _2,
                  getRegister(_2, argument2, "arobase", Register.Flags.CanReadWriteMacros),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.history.recording.stop": new CommandDescriptor(
          "dance.history.recording.stop",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await recording_stop(
                  _2,
                  getRegister(_2, argument2, "arobase", Register.Flags.CanReadWriteMacros),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.history.redo": new CommandDescriptor(
          "dance.history.redo",
          (_) => _.runAsync(async (_2) => await redo2()),
          CommandDescriptor.Flags.None,
        ),
        "dance.history.redo.selections": new CommandDescriptor(
          "dance.history.redo.selections",
          (_) => _.runAsync(async (_2) => await redo_selections()),
          CommandDescriptor.Flags.None,
        ),
        "dance.history.repeat": new CommandDescriptor(
          "dance.history.repeat",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await repeat(_2, getRepetitions(_2, argument2), argument2["filter"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.history.repeat.edit": new CommandDescriptor(
          "dance.history.repeat.edit",
          (_, argument2) =>
            _.runAsync(async (_2) => await repeat_edit(_2, getRepetitions(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.history.undo": new CommandDescriptor(
          "dance.history.undo",
          (_) => _.runAsync(async (_2) => await undo2()),
          CommandDescriptor.Flags.None,
        ),
        "dance.history.undo.selections": new CommandDescriptor(
          "dance.history.undo.selections",
          (_) => _.runAsync(async (_2) => await undo_selections()),
          CommandDescriptor.Flags.None,
        ),
        "dance.ifEmpty": new CommandDescriptor(
          "dance.ifEmpty",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await ifEmpty(
                  _2,
                  argument2,
                  _2.selections,
                  argument2["then"],
                  argument2["otherwise"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.ignore": new CommandDescriptor(
          "dance.ignore",
          (_) => _.runAsync(async (_2) => await ignore()),
          CommandDescriptor.Flags.None,
        ),
        "dance.keybindings.setup": new CommandDescriptor(
          "dance.keybindings.setup",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await setup(_2, getRegister(_2, argument2, "dquote", Register.Flags.CanWrite)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.modes.set": new CommandDescriptor(
          "dance.modes.set",
          (_, argument2) => _.runAsync(async (_2) => await set2(_2, getInputOr("mode", argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.modes.set.temporarily": new CommandDescriptor(
          "dance.modes.set.temporarily",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await set_temporarily(
                  _2,
                  getInputOr("mode", argument2),
                  getRepetitions(_2, argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.openMenu": new CommandDescriptor(
          "dance.openMenu",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await openMenu(
                  _2,
                  getInputOr("menu", argument2),
                  argument2["prefix"],
                  argument2["pass"],
                  argument2["locked"],
                  argument2["delay"],
                  argument2["title"],
                ),
            ),
          CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.run": new CommandDescriptor(
          "dance.run",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await run2(
                  _2,
                  argument2,
                  getInputOr("code", argument2),
                  getCount(_2, argument2),
                  getRepetitions(_2, argument2),
                  getRegister(_2, argument2, "null", Register.Flags.None),
                  argument2["commands"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.search": new CommandDescriptor(
          "dance.search",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await search2(
                  _2,
                  getRegister(
                    _2,
                    argument2,
                    "slash",
                    Register.Flags.CanRead | Register.Flags.CanWrite,
                  ),
                  getRepetitions(_2, argument2),
                  argument2["add"],
                  getDirection(argument2),
                  argument2["interactive"],
                  getShift(argument2),
                  argument2,
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.search.next": new CommandDescriptor(
          "dance.search.next",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await next2(
                  _2,
                  _2.document,
                  getRegister(_2, argument2, "slash", Register.Flags.CanRead),
                  getRepetitions(_2, argument2),
                  argument2["add"],
                  getDirection(argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.search.selection": new CommandDescriptor(
          "dance.search.selection",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await selection2(
                  _2.document,
                  _2.selections,
                  getRegister(_2, argument2, "slash", Register.Flags.CanWrite),
                  argument2["smart"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek": new CommandDescriptor(
          "dance.seek",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await seek(
                  _2,
                  getInputOr("input", argument2),
                  getRepetitions(_2, argument2),
                  getDirection(argument2),
                  getShift(argument2),
                  argument2["include"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.enclosing": new CommandDescriptor(
          "dance.seek.enclosing",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await enclosing(
                  _2,
                  getDirection(argument2),
                  getShift(argument2),
                  argument2["open"],
                  argument2["pairs"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.leap": new CommandDescriptor(
          "dance.seek.leap",
          (_, argument2) =>
            _.runAsync(async (_2) => await leap(_2, getDirection(argument2), argument2["labels"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.object": new CommandDescriptor(
          "dance.seek.object",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await object(
                  _2,
                  getInputOr("input", argument2),
                  argument2["inner"],
                  argument2["where"],
                  getShift(argument2),
                  _2.extension.treeSitter,
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.syntax.experimental": new CommandDescriptor(
          "dance.seek.syntax.experimental",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await _2.extension
                  .treeSitterOrThrow()
                  .withDocumentTree(_2.document, (documentTree) =>
                    syntax_experimental(
                      _2,
                      _2.extension.treeSitterOrThrow(),
                      documentTree,
                      argument2["where"],
                    ),
                  ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.word": new CommandDescriptor(
          "dance.seek.word",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await word(
                  _2,
                  getRepetitions(_2, argument2),
                  argument2["stopAtEnd"],
                  argument2["ws"],
                  getDirection(argument2),
                  getShift(argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.seek.wordLabel": new CommandDescriptor(
          "dance.seek.wordLabel",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await wordLabel(_2, argument2["labelChars"], getShift(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.buffer": new CommandDescriptor(
          "dance.select.buffer",
          (_) => _.runAsync(async (_2) => await buffer(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.firstVisibleLine": new CommandDescriptor(
          "dance.select.firstVisibleLine",
          (_, argument2) =>
            _.runAsync(async (_2) => await firstVisibleLine2(_2, getShift(argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.horizontally": new CommandDescriptor(
          "dance.select.horizontally",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await horizontally(
                  _2,
                  argument2["avoidEol"],
                  getRepetitions(_2, argument2),
                  getDirection(argument2),
                  getShift(argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.lastLine": new CommandDescriptor(
          "dance.select.lastLine",
          (_, argument2) =>
            _.runAsync(async (_2) => await lastLine(_2, _2.document, getShift(argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.lastVisibleLine": new CommandDescriptor(
          "dance.select.lastVisibleLine",
          (_, argument2) =>
            _.runAsync(async (_2) => await lastVisibleLine2(_2, getShift(argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.line.above": new CommandDescriptor(
          "dance.select.line.above",
          (_, argument2) => _.runAsync(async (_2) => await line_above(_2, getCount(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.line.above.extend": new CommandDescriptor(
          "dance.select.line.above.extend",
          (_, argument2) =>
            _.runAsync(async (_2) => await line_above_extend(_2, getCount(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.line.below": new CommandDescriptor(
          "dance.select.line.below",
          (_, argument2) => _.runAsync(async (_2) => await line_below(_2, getCount(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.line.below.extend": new CommandDescriptor(
          "dance.select.line.below.extend",
          (_, argument2) =>
            _.runAsync(async (_2) => await line_below_extend(_2, getCount(_2, argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.lineEnd": new CommandDescriptor(
          "dance.select.lineEnd",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await lineEnd2(
                  _2,
                  getCount(_2, argument2),
                  getShift(argument2),
                  argument2["lineBreak"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.lineStart": new CommandDescriptor(
          "dance.select.lineStart",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await lineStart2(
                  _2,
                  getCount(_2, argument2),
                  getShift(argument2),
                  argument2["skipBlank"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.middleVisibleLine": new CommandDescriptor(
          "dance.select.middleVisibleLine",
          (_, argument2) =>
            _.runAsync(async (_2) => await middleVisibleLine2(_2, getShift(argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.to": new CommandDescriptor(
          "dance.select.to",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await to(_2, getCount(_2, argument2), argument2, getShift(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.select.vertically": new CommandDescriptor(
          "dance.select.vertically",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await vertically(
                  _2,
                  _2.selections,
                  argument2["avoidEol"],
                  getRepetitions(_2, argument2),
                  getDirection(argument2),
                  getShift(argument2),
                  argument2["by"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selectRegister": new CommandDescriptor(
          "dance.selectRegister",
          (_, argument2) =>
            _.runAsync(async (_2) => await selectRegister(_2, getInputOr("register", argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.selections.changeDirection": new CommandDescriptor(
          "dance.selections.changeDirection",
          (_, argument2) =>
            _.runAsync(async (_2) => await changeDirection(_2, getDirection(argument2))),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.changeOrder": new CommandDescriptor(
          "dance.selections.changeOrder",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await changeOrder(_2, _2.selections.slice(), getDirection(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.clear.main": new CommandDescriptor(
          "dance.selections.clear.main",
          (_) => _.runAsync(async (_2) => await clear_main(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.clear.secondary": new CommandDescriptor(
          "dance.selections.clear.secondary",
          (_) => _.runAsync(async (_2) => await clear_secondary(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.copy": new CommandDescriptor(
          "dance.selections.copy",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await copy2(
                  _2,
                  _2.document,
                  _2.selections,
                  getRepetitions(_2, argument2),
                  getDirection(argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.expandToLines": new CommandDescriptor(
          "dance.selections.expandToLines",
          (_) => _.runAsync(async (_2) => await expandToLines(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.filter": new CommandDescriptor(
          "dance.selections.filter",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await filter2(
                  _2,
                  argument2,
                  argument2["defaultExpression"],
                  argument2["inverse"],
                  argument2["interactive"],
                  getCount(_2, argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.merge": new CommandDescriptor(
          "dance.selections.merge",
          (_) => _.runAsync(async (_2) => await merge2(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.open": new CommandDescriptor(
          "dance.selections.open",
          (_) => _.runAsync(async (_2) => await open(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.pipe": new CommandDescriptor(
          "dance.selections.pipe",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await pipe2(
                  _2,
                  getRegister(_2, argument2, "pipe", Register.Flags.CanWrite),
                  getInputOr("expression", argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.reduce": new CommandDescriptor(
          "dance.selections.reduce",
          (_, argument2) =>
            _.runAsync(async (_2) => await reduce(_2, argument2["where"], argument2["empty"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.restore": new CommandDescriptor(
          "dance.selections.restore",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await restore2(
                  _2,
                  getRegister(_2, argument2, "caret", Register.Flags.CanReadSelections),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.restore.withCurrent": new CommandDescriptor(
          "dance.selections.restore.withCurrent",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await restore_withCurrent(
                  _2,
                  _2.document,
                  getRegister(_2, argument2, "caret", Register.Flags.CanReadSelections),
                  argument2["reverse"],
                  argument2["action"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.rotate.both": new CommandDescriptor(
          "dance.selections.rotate.both",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await both(_2, getRepetitions(_2, argument2), argument2["reverse"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.rotate.contents": new CommandDescriptor(
          "dance.selections.rotate.contents",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await contents(_2, getRepetitions(_2, argument2), argument2["reverse"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.rotate.selections": new CommandDescriptor(
          "dance.selections.rotate.selections",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await selections2(_2, getRepetitions(_2, argument2), argument2["reverse"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.save": new CommandDescriptor(
          "dance.selections.save",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await save(
                  _2,
                  _2.document,
                  _2.selections,
                  getRegister(_2, argument2, "caret", Register.Flags.CanWriteSelections),
                  argument2["style"],
                  argument2["until"],
                  argument2["untilDelay"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.saveText": new CommandDescriptor(
          "dance.selections.saveText",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await saveText(
                  _2.document,
                  _2.selections,
                  getRegister(_2, argument2, "dquote", Register.Flags.CanWrite),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.select": new CommandDescriptor(
          "dance.selections.select",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await select(
                  _2,
                  getRegister(
                    _2,
                    argument2,
                    "slash",
                    Register.Flags.CanRead | Register.Flags.CanWrite,
                  ),
                  argument2["interactive"],
                  argument2,
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.sort": new CommandDescriptor(
          "dance.selections.sort",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await sort2(_2, getInputOr("expression", argument2), getDirection(argument2)),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.split": new CommandDescriptor(
          "dance.selections.split",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await split2(
                  _2,
                  getRegister(
                    _2,
                    argument2,
                    "slash",
                    Register.Flags.CanRead | Register.Flags.CanWrite,
                  ),
                  argument2["excludeEmpty"],
                  argument2["interactive"],
                  argument2,
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.splitLines": new CommandDescriptor(
          "dance.selections.splitLines",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await splitLines(
                  _2,
                  _2.document,
                  _2.selections,
                  getRepetitions(_2, argument2),
                  argument2["excludeEol"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.toggleIndices": new CommandDescriptor(
          "dance.selections.toggleIndices",
          (_, argument2) =>
            _.runAsync(
              async (_2) => await toggleIndices(_2, argument2["display"], argument2["until"]),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.trimLines": new CommandDescriptor(
          "dance.selections.trimLines",
          (_) => _.runAsync(async (_2) => await trimLines(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.selections.trimWhitespace": new CommandDescriptor(
          "dance.selections.trimWhitespace",
          (_) => _.runAsync(async (_2) => await trimWhitespace(_2)),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
        "dance.updateCount": new CommandDescriptor(
          "dance.updateCount",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await updateCount(
                  _2,
                  getCount(_2, argument2),
                  _2.extension,
                  getInputOr("count", argument2),
                  argument2["addDigits"],
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.updateRegister": new CommandDescriptor(
          "dance.updateRegister",
          (_, argument2) =>
            _.runAsync(
              async (_2) =>
                await updateRegister(
                  _2,
                  getRegister(_2, argument2, "dquote", Register.Flags.CanWrite),
                  argument2["copyFrom"],
                  getInputOr("input", argument2),
                ),
            ),
          CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        ),
        "dance.view.line": new CommandDescriptor(
          "dance.view.line",
          (_, argument2) => _.runAsync(async (_2) => await line(_2, argument2["at"])),
          CommandDescriptor.Flags.RequiresActiveEditor,
        ),
      };
      describeAdditionalCommand(
        commands16,
        "dance.edit.selectRegister-insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selectRegister", { $include: ["register"] }],
          [".edit.insert", { $exclude: ["register"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.paste.before",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "start", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.paste.after",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "end", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.paste.before.select",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "start", shift: "select", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.paste.after.select",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "end", shift: "select", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.pasteAll.before",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "start", all: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.pasteAll.after",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { handleNewLine: true, where: "end", all: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.pasteAll.before.select",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".edit.insert",
            { handleNewLine: true, where: "start", all: true, shift: "select", $exclude: [] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.pasteAll.after.select",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".edit.insert",
            { handleNewLine: true, where: "end", all: true, shift: "select", $exclude: [] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.delete",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".edit.insert", { register: "_", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.delete-insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [".edit.insert", { register: "_", $exclude: ["mode"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.yank-delete",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.saveText", { $include: ["register"] }],
          [".edit.insert", { register: "_", $exclude: ["register"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.yank-delete-insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.saveText", { $include: ["register"] }],
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [".edit.insert", { register: "_", $exclude: ["register", "mode"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.yank-replace",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.saveText", { register: "tmp" }],
          [".edit.insert"],
          [".updateRegister", { copyFrom: "tmp", $exclude: [] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.history.repeat.selection",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".history.repeat", { filter: "dance\\.(seek|select|selections)", $include: ["count"] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.history.repeat.seek",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".history.repeat", { filter: "dance\\.seek", $include: ["count"] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.set.normal",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".modes.set", { mode: "normal" }], ["hideSuggestWidget"]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.set.insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".modes.set", { mode: "insert" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.set.select",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".modes.set", { mode: "select" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.insert.lineStart",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".select.lineStart", { shift: "jump", skipBlank: true }],
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [
            ".selections.reduce",
            { where: "start", record: false, empty: true, $exclude: ["mode"] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.insert.lineEnd",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".select.lineEnd", { shift: "jump" }],
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [".selections.reduce", { where: "end", record: false, empty: true, $exclude: ["mode"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.set.temporarily.normal",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".modes.set.temporarily", { mode: "normal" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.set.temporarily.insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".modes.set.temporarily", { mode: "insert" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.backward.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search", { direction: -1, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.selection.smart",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search.selection", { smart: true, $include: ["register"] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.next.add",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search.next", { add: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.previous",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search.next", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.search.previous.add",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".search.next", { direction: -1, add: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.extend.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { shift: "extend", direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.included",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { include: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.included.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { include: true, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.included.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { include: true, direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.included.extend.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek", { include: true, shift: "extend", direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.enclosing.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.enclosing", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.enclosing.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.enclosing", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.enclosing.extend.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.enclosing", { shift: "extend", direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.extend.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { shift: "extend", direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.ws",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { ws: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.ws.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { ws: true, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.ws.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { ws: true, direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.word.ws.extend.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { ws: true, shift: "extend", direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.wordEnd",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { stopAtEnd: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.wordEnd.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { stopAtEnd: true, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.wordEnd.ws",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { stopAtEnd: true, ws: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.wordEnd.ws.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.word", { stopAtEnd: true, ws: true, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", title: "Select whole object..." }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.inner",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".openMenu",
            { menu: "object", pass: [{ inner: true }], title: "Select inner object..." },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.start",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ where: "start" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.start.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ where: "start", shift: "extend" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.inner.start",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ inner: true, where: "start" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.inner.start.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".openMenu",
            { menu: "object", pass: [{ inner: true, where: "start", shift: "extend" }] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.end",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ where: "end" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.end.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ where: "end", shift: "extend" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.inner.end",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ inner: true, where: "end" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.askObject.inner.end.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".openMenu", { menu: "object", pass: [{ inner: true, where: "end", shift: "extend" }] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.syntax.next.experimental",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.syntax.experimental", { where: "next" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.syntax.previous.experimental",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.syntax.experimental", { where: "previous" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.syntax.parent.experimental",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.syntax.experimental", { where: "parent" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.syntax.child.experimental",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.syntax.experimental", { where: "child" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.leap.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.leap", { direction: -1, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.seek.wordLabel.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".seek.wordLabel", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.down.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.vertically", { direction: 1, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.down.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.vertically", { direction: 1, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.up.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.vertically", { direction: -1, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.up.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.vertically", { direction: -1, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.right.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.horizontally", { direction: 1, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.right.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.horizontally", { direction: 1, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.left.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.horizontally", { direction: -1, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.left.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.horizontally", { direction: -1, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.to.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.to", { shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.to.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.to", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lineStart.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lineStart.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lineStart.skipBlank.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { skipBlank: true, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lineStart.skipBlank.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { skipBlank: true, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.firstLine.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { count: 0, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.firstLine.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineStart", { count: 0, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lineEnd.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineEnd", { shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.documentEnd.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineEnd", { count: 2147483647, shift: "jump", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.documentEnd.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lineEnd", { count: 2147483647, shift: "extend", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lastLine.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lastLine", { shift: "jump" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lastLine.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lastLine", { shift: "extend" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.firstVisibleLine.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.firstVisibleLine", { shift: "jump" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.firstVisibleLine.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.firstVisibleLine", { shift: "extend" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.middleVisibleLine.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.middleVisibleLine", { shift: "jump" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.middleVisibleLine.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.middleVisibleLine", { shift: "extend" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lastVisibleLine.jump",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lastVisibleLine", { shift: "jump" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.select.lastVisibleLine.extend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".select.lastVisibleLine", { shift: "extend" }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.pipe.replace",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.pipe", { $include: ["expression", "register"] }],
          [".edit.insert", { register: "|", $exclude: ["expression", "register"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.pipe.append",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.pipe", { $include: ["expression", "register"] }],
          [
            ".edit.insert",
            { register: "|", where: "end", shift: "select", $exclude: ["expression", "register"] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.pipe.prepend",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.pipe", { $include: ["expression", "register"] }],
          [
            ".edit.insert",
            {
              register: "|",
              where: "start",
              shift: "select",
              $exclude: ["expression", "register"],
            },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.filter.regexp",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.filter", { defaultExpression: "/", $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.filter.regexp.inverse",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.filter", { defaultExpression: "/", inverse: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.select.orLeap",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".ifEmpty",
            {
              then: [[".seek.leap", { $exclude: [] }]],
              otherwise: [[".selections.select", { $exclude: [] }]],
            },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.splitLines.orLeap.backward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [
            ".ifEmpty",
            {
              then: [[".seek.leap", { direction: -1, $exclude: [] }]],
              otherwise: [[".selections.splitLines", { $exclude: [] }]],
            },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.reduce.edges",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.reduce", { where: "both", empty: false, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.faceForward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.changeDirection", { direction: 1 }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.faceBackward",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.changeDirection", { direction: -1 }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.orderDescending",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.changeOrder", { direction: 1 }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.orderAscending",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.changeOrder", { direction: -1 }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.copy.above",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.copy", { direction: -1 }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.showIndices",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.toggleIndices", { display: true, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.hideIndices",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.toggleIndices", { display: false, $exclude: [] }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.rotate.both.reverse",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.rotate.both", { reverse: true }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.rotate.contents.reverse",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.rotate.contents", { reverse: true }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.selections.rotate.selections.reverse",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [[".selections.rotate.selections", { reverse: true }]],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.insert.before",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.faceBackward", { record: false }],
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [
            ".selections.reduce",
            { where: "start", record: false, empty: true, $exclude: ["mode"] },
          ],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.modes.insert.after",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".selections.faceForward", { record: false }],
          [".modes.set", { mode: "insert", $include: ["mode"] }],
          [".selections.reduce", { where: "end", record: false, empty: true, $exclude: ["mode"] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.newLine.above.insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".edit.newLine.above", { shift: "select" }],
          [".modes.insert.before", { $exclude: [] }],
        ],
      );
      describeAdditionalCommand(
        commands16,
        "dance.edit.newLine.below.insert",
        CommandDescriptor.Flags.RequiresActiveEditor | CommandDescriptor.Flags.DoNotReplay,
        [
          [".edit.newLine.below", { shift: "select" }],
          [".modes.insert.before", { $exclude: [] }],
        ],
      );
      return Object.freeze(commands16);
    })();
  },
});

// src/extension.ts
init_api();
import * as vscode43 from "vscode";

// src/state/extension.ts
init_editors();
init_modes2();
init_recorder();
init_registers2();
import * as vscode34 from "vscode";

// src/state/registers-view.ts
import * as vscode30 from "vscode";
var RegistersView = class {
  constructor(registers) {
    this.registers = registers;
    this._onDidChangeTreeData = new vscode30.EventEmitter();
    this._registerToItemMap = /* @__PURE__ */ new Map();
    this._documentToItemMap = /* @__PURE__ */ new Map();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  get isActive() {
    return this._globalDocumentItem !== void 0;
  }
  getTreeItem(element) {
    return element;
  }
  async getChildren(element) {
    if (element === void 0) {
      if (this._globalDocumentItem === void 0) {
        this._globalDocumentItem = new RegisterSetTreeItem(this.registers, () =>
          this._onDidChangeTreeData.fire(this._globalDocumentItem),
        );
      }
      const document = vscode30.window.activeTextEditor?.document;
      return document === void 0
        ? [this._globalDocumentItem]
        : [this._globalDocumentItem, this._itemForDocument(document)];
    }
    if (element instanceof ValueTreeItem) {
      return [];
    }
    if (element instanceof RegisterTreeItem) {
      return await element.values();
    }
    let registers = [...element.registers.registers].filter(
      (r) => r.iconName !== void 0 && r.canRead(),
    );
    if (element !== this._globalDocumentItem) {
      registers = registers.filter((r) => /^[a-zA-Z]|.{2,}$/.test(r.name));
    }
    const items = registers
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => this._itemForRegister(r, element));
    const shouldShowItem = await Promise.all(items.map(async (item) => await item.shouldShow()));
    return items.filter((_, i) => shouldShowItem[i]);
  }
  _itemForDocument(document) {
    const existing = this._documentToItemMap.get(document);
    if (existing !== void 0) {
      return existing;
    }
    const item = new RegisterSetTreeItem(
      this.registers.forDocument(document),
      () => this._onDidChangeTreeData.fire(item),
      document,
    );
    this._documentToItemMap.set(document, item);
    return item;
  }
  _itemForRegister(register, documentItem) {
    const existing = this._registerToItemMap.get(register);
    if (existing !== void 0) {
      return existing;
    }
    const item = new RegisterTreeItem(register, async (wasShown) => {
      this._onDidChangeTreeData.fire(item);
      if ((await item.shouldShow()) !== wasShown) {
        this._onDidChangeTreeData.fire(documentItem);
      }
    });
    this._registerToItemMap.set(register, item);
    return item;
  }
  register() {
    const treeDataProviderDisposable = vscode30.window.createTreeView("registers", {
        treeDataProvider: this,
        showCollapseAll: true,
      }),
      editorChangeDisposable = vscode30.window.onDidChangeActiveTextEditor(
        () => this.isActive && this._onDidChangeTreeData.fire(void 0),
      ),
      documentChangeDisposable = vscode30.workspace.onDidCloseTextDocument((e) => {
        if (!this.isActive) {
          return;
        }
        this._documentToItemMap.get(e)?.dispose();
        this._documentToItemMap.delete(e);
        for (const register of this.registers.forDocument(e).registers) {
          this._registerToItemMap.get(register)?.dispose();
          this._registerToItemMap.delete(register);
        }
      });
    return {
      dispose: () => {
        for (const item of this._documentToItemMap.values()) {
          item.dispose();
        }
        for (const item of this._registerToItemMap.values()) {
          item.dispose();
        }
        this._globalDocumentItem?.dispose();
        this._documentToItemMap.clear();
        this._registerToItemMap.clear();
        treeDataProviderDisposable.dispose();
        editorChangeDisposable.dispose();
        documentChangeDisposable.dispose();
      },
    };
  }
};
var RegisterSetTreeItem = class extends vscode30.TreeItem {
  constructor(registers, notifyChange, document) {
    super(document?.fileName ?? "Global", vscode30.TreeItemCollapsibleState.Expanded);
    this.registers = registers;
    this.iconPath = new vscode30.ThemeIcon(document === void 0 ? "root-folder" : "folder-active");
    this._disposable = registers.onRegisterChange(() => notifyChange());
  }
  dispose() {
    this._disposable.dispose();
  }
};
var RegisterTreeItem = class extends vscode30.TreeItem {
  constructor(register, notifyChange) {
    super(
      register.name,
      /^(["/@^|.]|[a-zA-Z0-9]+)$/.test(register.name)
        ? vscode30.TreeItemCollapsibleState.Expanded
        : vscode30.TreeItemCollapsibleState.Collapsed,
    );
    this.register = register;
    if (register.iconName !== void 0) {
      this.iconPath = new vscode30.ThemeIcon(register.iconName);
    }
    this._disposable = register.onChange(async () => {
      const wasVisible = await this.shouldShow();
      this._shouldShow = void 0;
      this._values = void 0;
      notifyChange(wasVisible);
    });
  }
  _shouldShowEmpty() {
    return /^["/@^|.]$/.test(this.register.name);
  }
  async shouldShow() {
    if (this._shouldShowEmpty()) {
      return true;
    }
    if (this._shouldShow === void 0) {
      this._shouldShow = this.values().then((values2) => values2.length > 0);
    }
    return await this._shouldShow;
  }
  async values() {
    if (this._values === void 0) {
      this._values = (async () => {
        try {
          const values2 = await this.register.get();
          return values2?.map((v) => new ValueTreeItem(v)) ?? [];
        } catch (e) {
          return [new ValueTreeItem(`${e}`, "warning")];
        }
      })();
    }
    return await this._values;
  }
  dispose() {
    this._disposable.dispose();
  }
};
var ValueTreeItem = class extends vscode30.TreeItem {
  constructor(label, icon = "symbol-string") {
    super(label, vscode30.TreeItemCollapsibleState.None);
    this.iconPath = new vscode30.ThemeIcon(icon);
  }
};

// src/state/status-bar.ts
import * as vscode31 from "vscode";
var StatusBarSegment = class {
  constructor(name, icon, priority, command6) {
    this.name = name;
    this.icon = icon;
    this.priority = priority;
    this._statusBarItem = vscode31.window.createStatusBarItem(
      vscode31.StatusBarAlignment.Left,
      priority,
    );
    this._statusBarItem.tooltip = name;
    this._statusBarItem.command = command6;
  }
  get content() {
    return this._content;
  }
  get statusBarItem() {
    return this._statusBarItem;
  }
  dispose() {
    this._statusBarItem.dispose();
  }
  setContent(content) {
    this._content = content;
    if (content) {
      this._statusBarItem.text = `$(${this.icon}) ${content}`;
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }
};
var _StatusBar = class _StatusBar {
  constructor() {
    this._segments = [];
    this.activeModeSegment = this.addSegment("Dance - Set mode", "zap", "dance.modes.set");
    this.recordingSegment = this.addSegment(
      "Dance - Stop recording",
      "record",
      "dance.history.recording.stop",
    );
    this.countSegment = this.addSegment("Dance - Reset count", "symbol-number", {
      command: "dance.updateCount",
      arguments: [{ count: "0" }],
      title: "",
    });
    this.registerSegment = this.addSegment("Dance - Unset register", "clone", {
      command: "dance.selectRegister",
      arguments: [{ register: "" }],
      title: "",
    });
    this.errorSegment = this.addSegment(
      "Dance - Copy and dismiss error",
      "error",
      "dance.dev.copyLastErrorMessage",
    );
    this.errorSegment.statusBarItem.backgroundColor = new vscode31.ThemeColor(
      "statusBarItem.errorBackground",
    );
  }
  dispose() {
    this._segments.splice(0).forEach((s) => s.dispose());
  }
  addSegment(tooltip, icon, command6) {
    const segment = new _StatusBar.Segment(tooltip, icon, 100 - this._segments.length, command6);
    this._segments.push(segment);
    return segment;
  }
};
_StatusBar.Segment = StatusBarSegment;
var StatusBar = _StatusBar;

// src/state/extension.ts
init_api();
init_constants();

// src/utils/disposables.ts
init_recorder();
import * as vscode32 from "vscode";
var AutoDisposable = class _AutoDisposable {
  constructor(disposables = []) {
    this._boundDispose = this.dispose.bind(this);
    this._disposables = disposables;
  }
  /**
   * Disposes of all the wrapped disposables.
   */
  dispose() {
    if (this._boundDispose === void 0) {
      return;
    }
    this._boundDispose = void 0;
    const disposables = this._disposables;
    for (let i = 0, len = disposables.length; i < len; i++) {
      disposables[i].dispose();
    }
    disposables.length = 0;
  }
  /**
   * Whether the `AutoDisposable` has been disposed of.
   */
  get isDisposed() {
    return this._boundDispose === void 0;
  }
  /**
   * Adds a new disposable that will be disposed of when this `AutoDisposable`
   * is itself disposed of.
   *
   * Calling this after disposing of the `AutoDisposable` will immediately
   * dispose of the given disposable.
   */
  addDisposable(disposable) {
    if (this._boundDispose === void 0) {
      disposable.dispose();
      return this;
    }
    this._disposables.push(disposable);
    return this;
  }
  addNotifyingDisposable(disposable) {
    return this.addDisposable(disposable).disposeOnEvent(disposable.onDisposed);
  }
  /**
   * Automatically disposes of this disposable when the given event is
   * triggered.
   */
  disposeOnEvent(event) {
    const boundDispose = this._boundDispose;
    if (boundDispose !== void 0) {
      this._disposables.push(event(boundDispose));
    }
    return this;
  }
  /**
   * Automatically disposes of this disposable when the given promise is
   * resolved.
   */
  disposeOnPromiseResolution(thenable) {
    if (this._boundDispose === void 0) {
      return this;
    }
    const weakThis = new WeakRef(this);
    thenable.then(() => weakThis.deref()?.dispose());
    return this;
  }
  /**
   * Automatically disposes of this disposable when the cancellation of the
   * given `CancellationToken` is requested.
   */
  disposeOnCancellation(token) {
    if (this._boundDispose === void 0) {
      return this;
    }
    if (token.isCancellationRequested) {
      this.dispose();
      return this;
    }
    return this.disposeOnEvent(token.onCancellationRequested);
  }
  /**
   * Automatically disposes of this disposable when `ms` milliseconds have
   * elapsed.
   */
  disposeAfterTimeout(ms) {
    const boundDispose = this._boundDispose;
    if (boundDispose === void 0) {
      return this;
    }
    const token = setTimeout(boundDispose, ms);
    this._disposables.push({
      dispose() {
        clearTimeout(token);
      },
    });
    return this;
  }
  disposeOnUserEvent(event, context) {
    const editorState = context.extension.editors.getState(context.editor);
    let eventName, eventOpts;
    if (Array.isArray(event)) {
      if (event.length === 0) {
        throw new Error();
      }
      if (typeof event[0] === "string") {
        eventName = event[0];
      } else {
        throw new Error();
      }
      if (event.length === 2) {
        eventOpts = event[1];
        if (typeof eventOpts !== "object" || eventOpts === null) {
          throw new Error();
        }
      } else if (event.length === 1) {
        eventOpts = {};
      } else {
        throw new Error();
      }
    } else if (typeof event === "string") {
      eventName = event;
      eventOpts = {};
    } else {
      throw new Error();
    }
    switch (eventName) {
      case _AutoDisposable.EventType.OnEditorWasClosed:
        this.disposeOnEvent(editorState.onEditorWasClosed);
        break;
      case _AutoDisposable.EventType.OnModeDidChange:
        const except = [];
        if (Array.isArray(eventOpts["except"])) {
          except.push(...eventOpts["except"]);
        } else if (typeof eventOpts["except"] === "string") {
          except.push(eventOpts["except"]);
        }
        const include = [];
        if (Array.isArray(eventOpts["include"])) {
          include.push(...eventOpts["include"]);
        } else if (typeof eventOpts["include"] === "string") {
          include.push(eventOpts["include"]);
        }
        editorState.extension.editors.onModeDidChange(
          (e) => {
            if (
              e === editorState &&
              !except.includes(e.mode.name) &&
              (include.length === 0 || include.includes(e.mode.name))
            ) {
              this.dispose();
            }
          },
          void 0,
          this._disposables,
        );
        break;
      case _AutoDisposable.EventType.OnSelectionsDidChange:
        vscode32.window.onDidChangeTextEditorSelection(
          (e) => {
            if (editorState.editor !== e.textEditor) {
              return;
            }
            const cursor = context.extension.recorder.cursorFromEnd();
            if (cursor.previous()) {
              if (
                cursor.is(Entry.DeleteAfter) ||
                cursor.is(Entry.DeleteBefore) ||
                cursor.is(Entry.InsertAfter) ||
                cursor.is(Entry.InsertBefore) ||
                cursor.is(Entry.ReplaceWith)
              ) {
                return;
              }
            }
            this.dispose();
          },
          void 0,
          this._disposables,
        );
        break;
      default:
        throw new Error();
    }
  }
};
((AutoDisposable2) => {
  let EventType;
  ((EventType2) => {
    EventType2["OnEditorWasClosed"] = "editor-was-closed";
    EventType2["OnModeDidChange"] = "mode-did-change";
    EventType2["OnSelectionsDidChange"] = "selections-did-change";
  })((EventType = AutoDisposable2.EventType || (AutoDisposable2.EventType = {})));
})(AutoDisposable || (AutoDisposable = {}));

// src/state/extension.ts
init_errors();
init_settings_validator();

// src/utils/tree-sitter.ts
import * as vscode33 from "vscode";
var extensionId2 = "gregoire.tree-sitter";
function onDidLoadTreeSitter(listener) {
  const processExtensions = () => {
    const extension2 = vscode33.extensions.getExtension(extensionId2);
    if (extension2 === void 0) {
      return;
    }
    subscription?.dispose();
    subscription = void 0;
    extension2.activate().then((treeSitter) => {
      listener(treeSitter);
    });
  };
  let subscription = vscode33.extensions.onDidChange(() => {
    processExtensions();
  });
  processExtensions();
  return {
    dispose() {
      subscription?.dispose();
      subscription = void 0;
    },
  };
}

// src/state/extension.ts
var Extension = class {
  constructor(commands16) {
    this.commands = commands16;
    // Misc.
    this._configurationChangeHandlers = /* @__PURE__ */ new Map();
    this._subscriptions = [];
    // Configuration.
    // ==========================================================================
    this._gotoMenus = /* @__PURE__ */ new Map();
    this._isSmartCaseEnabled = false;
    /**
     * `StatusBar` for this instance of the extension.
     */
    this.statusBar = new StatusBar();
    /**
     * `Registers` for this instance of the extension.
     */
    this.registers = new Registers(this);
    /**
     * `Modes` for this instance of the extension.
     */
    this.modes = new Modes(this);
    // Needs to be initialized later.
    /**
     * `Editors` for this instance of the extension.
     */
    this.editors = new Editors(this);
    // Ephemeral state needed by commands.
    // ==========================================================================
    this._currentCount = 0;
    // =============================================================================================
    // ==  CANCELLATION  ===========================================================================
    // =============================================================================================
    this._cancellationTokenSource = new vscode34.CancellationTokenSource();
    this._cancellationReasons = /* @__PURE__ */ new WeakMap();
    // =============================================================================================
    // ==  DISPOSABLES  ============================================================================
    // =============================================================================================
    this._autoDisposables = /* @__PURE__ */ new Set();
    this.recorder = new Recorder(this);
    this.observePreference(
      ".menus",
      (value2, validator, inspect) => {
        this._gotoMenus.clear();
        if (typeof value2 !== "object" || value2 === null) {
          validator.reportInvalidSetting("must be an object");
          return;
        }
        for (const menuName in value2) {
          const menu = value2[menuName],
            validationErrors = validateMenu(menu);
          if (validationErrors.length === 0) {
            if (!vscode34.workspace.isTrusted) {
              const globalConfig = inspect.globalValue?.[menuName],
                defaultConfig = inspect.defaultValue?.[menuName];
              if (globalConfig !== void 0 || defaultConfig !== void 0) {
                for (const key in menu.items) {
                  if (globalConfig !== void 0 && key in globalConfig.items) {
                    menu.items[key] = globalConfig.items[key];
                  } else if (defaultConfig !== void 0 && key in defaultConfig.items) {
                    menu.items[key] = defaultConfig.items[key];
                  }
                }
              }
            }
            this._gotoMenus.set(menuName, menu);
          } else {
            validator.enter(menuName);
            for (const error of validationErrors) {
              validator.reportInvalidSetting(error);
            }
            validator.leave();
          }
        }
      },
      true,
    );
    this._subscriptions.push(
      // Update configuration automatically.
      vscode34.workspace.onDidChangeConfiguration((e) => {
        for (const [section, handler] of this._configurationChangeHandlers.entries()) {
          if (e.affectsConfiguration(section)) {
            handler();
          }
        }
      }),
    );
    for (const descriptor of Object.values(commands16)) {
      this._subscriptions.push(descriptor.register(this));
    }
    this._subscriptions.push(new RegistersView(this.registers).register());
    this._subscriptions.push(onDidLoadTreeSitter((treeSitter) => (this._treeSitter = treeSitter)));
    this.observePreference(
      ".smartCase",
      (value2) => {
        this._isSmartCaseEnabled = value2 ?? false;
      },
      true,
    );
  }
  get menus() {
    return this._gotoMenus;
  }
  /**
   * The counter for the next command.
   */
  get currentCount() {
    return this._currentCount;
  }
  set currentCount(count) {
    this._currentCount = count;
    if (count !== 0) {
      this.statusBar.countSegment.setContent(count.toString());
    } else {
      this.statusBar.countSegment.setContent();
    }
  }
  /**
   * The register to use in the next command.
   */
  get currentRegister() {
    return this._currentRegister;
  }
  set currentRegister(register) {
    this._currentRegister = register;
    if (register !== void 0) {
      this.statusBar.registerSegment.setContent(register.name);
    } else {
      this.statusBar.registerSegment.setContent();
    }
  }
  get treeSitter() {
    return this._treeSitter;
  }
  treeSitterOrThrow() {
    if (this._treeSitter === void 0) {
      throw new Error("TreeSitter is not available");
    }
    return this._treeSitter;
  }
  get isSmartCaseEnabled() {
    return this._isSmartCaseEnabled;
  }
  /**
   * Disposes of the extension and all of its resources and subscriptions.
   */
  dispose() {
    this._cancellationTokenSource.cancel();
    this._cancellationTokenSource.dispose();
    this._autoDisposables.forEach((disposable) => disposable.dispose());
    assert(this._autoDisposables.size === 0);
    this.statusBar.dispose();
    this._configurationChangeHandlers.clear();
    for (const subscription of this._subscriptions) {
      subscription.dispose();
    }
    this._subscriptions.length = 0;
    this.editors.dispose();
    this.recorder.dispose();
    this.modes.dispose();
    this.registers.dispose();
    this.dismissErrorMessage();
  }
  /**
   * Listen for changes to the specified preference and calls the given handler
   * when a change occurs.
   *
   * Must be called in the constructor.
   *
   * @param triggerNow If `true`, the handler will also be triggered immediately
   *   with the current value.
   */
  observePreference(section, handler, triggerNow = false) {
    let configuration, fullName;
    if (section[0] === ".") {
      fullName = extensionName + section;
      section = section.slice(1);
      configuration = vscode34.workspace.getConfiguration(extensionName);
    } else {
      fullName = section;
      configuration = vscode34.workspace.getConfiguration();
    }
    const defaultValue = configuration.inspect(section).defaultValue;
    this._configurationChangeHandlers.set(fullName, () => {
      const validator = new SettingsValidator(fullName),
        topSection = fullName === section ? void 0 : extensionName,
        configuration2 = vscode34.workspace.getConfiguration(topSection);
      handler(
        configuration2.get(section, defaultValue),
        validator,
        handler.length > 2 ? configuration2.inspect(section) : void 0,
      );
      validator.displayErrorIfNeeded();
    });
    if (triggerNow) {
      const validator = new SettingsValidator(fullName);
      handler(
        configuration.get(section, defaultValue),
        validator,
        handler.length > 2 ? configuration.inspect(section) : void 0,
      );
      validator.displayErrorIfNeeded();
    }
  }
  /**
   * The token for the next command.
   */
  get cancellationToken() {
    return this._cancellationTokenSource.token;
  }
  /**
   * The reason why the `cancellationToken` was cancelled.
   */
  cancellationReasonFor(token) {
    return this._cancellationReasons.get(token);
  }
  /**
   * Requests the cancellation of the last operation.
   */
  cancelLastOperation(reason) {
    this._cancellationReasons.set(this._cancellationTokenSource.token, reason);
    this._cancellationTokenSource.cancel();
    this._cancellationTokenSource.dispose();
    this._cancellationTokenSource = new vscode34.CancellationTokenSource();
  }
  /**
   * Returns an `AutoDisposable` bound to this extension. It is ensured that any
   * disposable added to it will be disposed of when the extension is unloaded.
   */
  createAutoDisposable() {
    const disposable = new AutoDisposable();
    disposable.addDisposable({
      dispose: () => this._autoDisposables.delete(disposable),
    });
    this._autoDisposables.add(disposable);
    return disposable;
  }
  /**
   * The last error message reported via `showDismissibleErrorMessage`.
   */
  get lastErrorMessage() {
    return this._lastErrorMessage;
  }
  /**
   * Dismisses a currently shown error message, if any.
   */
  dismissErrorMessage() {
    if (this._dismissErrorMessage !== void 0) {
      this._dismissErrorMessage();
      this._dismissErrorMessage = void 0;
    }
  }
  /**
   * Displays a dismissible error message in the status bar.
   */
  showDismissibleErrorMessage(message) {
    this._lastErrorMessage = message;
    console.error(message);
    message = message.replace(/^error executing command "(.+?)": /, "");
    if (this.statusBar.errorSegment.content !== void 0) {
      return this.statusBar.errorSegment.setContent(message);
    }
    this.statusBar.errorSegment.setContent(message);
    const dispose = () => {
      this.statusBar.errorSegment.setContent();
      this._dismissErrorMessage = void 0;
      subscriptions.splice(0).forEach((d) => d.dispose());
    };
    const subscriptions = [
      vscode34.window.onDidChangeActiveTextEditor(dispose),
      vscode34.window.onDidChangeTextEditorSelection(dispose),
    ];
    this._dismissErrorMessage = dispose;
  }
  /**
   * Runs the given function, displaying an error message and returning the
   * specified value if it throws an exception during its execution.
   */
  runSafely(f, errorValue, errorMessage) {
    this.dismissErrorMessage();
    try {
      return f();
    } catch (e) {
      if (!(e instanceof CancellationError)) {
        this.showDismissibleErrorMessage(errorMessage(e));
      }
      return errorValue();
    }
  }
  /**
   * Runs the given async function, displaying an error message and returning
   * the specified value if it throws an exception during its execution.
   */
  async runPromiseSafely(f, errorValue, errorMessage) {
    this.dismissErrorMessage();
    try {
      return await f();
    } catch (e) {
      if (!(e instanceof CancellationError)) {
        this.showDismissibleErrorMessage(errorMessage(e));
      }
      return errorValue();
    }
  }
};

// src/extension.ts
init_constants();
var extensionState;
var isActivated = false;
async function activate() {
  isActivated = true;
  const extensionData = vscode43.extensions.getExtension(extensionId),
    extensionPackageJSON = extensionData?.packageJSON;
  if (extensionPackageJSON?.[`${extensionName}.disableArbitraryCodeExecution`]) {
    disableRunFunction();
  } else {
    setRunGlobals({ vscode: vscode43, ...api_exports });
  }
  if (extensionPackageJSON?.[`${extensionName}.disableArbitraryCommandExecution`]) {
    disableExecuteFunction();
  }
  const { commands: commands16 } = await Promise.resolve().then(
    () => (init_load_all(), load_all_exports),
  );
  if (!isActivated) {
    return;
  }
  return { api: api_exports, extension: (extensionState = new Extension(commands16)) };
}
function deactivate() {
  isActivated = false;
  extensionState?.dispose();
}
export { activate, api_exports as api, deactivate, extensionState };
