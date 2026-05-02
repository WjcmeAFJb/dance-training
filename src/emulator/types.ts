// Editor state types used by the emulator and the verifier.

export type DanceMode = "normal" | "insert" | "select" | "match" | "view" | "object";

export interface Position {
  line: number; // 0-based
  col: number; // 0-based, in UTF-16 code units (matching Monaco)
}

export interface Range {
  /** Anchor (where selection started). */
  anchor: Position;
  /** Active end (where the cursor is). For Kak invariant this is never == anchor. */
  active: Position;
}

export interface EditorState {
  text: string;
  selections: Range[];
  mode: DanceMode;
  registers: Record<string, string[]>;
  /** Append-only audit log of dispatched commands (used by the verifier). */
  commandLog: { id: string; args?: unknown }[];
  /** Number prefix accumulated by `dance.updateCount`. */
  count?: number;
}

export const initialEditorState = (text: string): EditorState => ({
  text,
  selections: [{ anchor: { line: 0, col: 0 }, active: { line: 0, col: 1 } }],
  mode: "normal",
  registers: { '"': [], _: [], "/": [] },
  commandLog: [],
});
