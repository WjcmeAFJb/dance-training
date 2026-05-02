// Lesson DSL types. See docs/DESIGN.md §6.4.

import type { DanceMode, EditorState, Position, Range } from "../emulator/types.ts";

export interface InitialEditorState {
  text: string;
  selections?: Range[];
  mode?: DanceMode;
}

export type Goal =
  | { kind: "text-equals"; expected: string }
  | { kind: "text-matches"; pattern: RegExp }
  | { kind: "selections-equal"; ranges: Range[] }
  | { kind: "cursor-at"; line: number; col: number }
  | { kind: "command-fired"; id: string; count?: number; args?: unknown }
  | { kind: "register"; name: string; equals: string }
  | { kind: "mode-is"; mode: DanceMode }
  | { kind: "all"; goals: Goal[] }
  | { kind: "any"; goals: Goal[] };

export interface Step {
  /** Markdown narration. Tokens supported:
   *   {{key:dance.command.id}}        — render the user's binding for that command
   *   {{kakkey:t}}                    — render a Kakoune canonical letter
   *   {{action:kak.normal.seek.t.fwd}}— render the user's binding for that Kak action
   */
  narrate: string;
  /** Optional second-tier hint surfaced after `hintAfterMs`. */
  hint?: string;
  /** Pass condition. */
  goal: Goal;
  /** Optional state reset between steps. */
  reset?: "preserve" | "initial" | InitialEditorState;
  /** Time before showing `hint`. Default: 12 000 ms. */
  hintAfterMs?: number;
}

export interface Lesson {
  id: string;
  folder: LessonFolder;
  title: string;
  blurb: string;
  est_minutes: number;
  /** Action ids the user should already understand. */
  requires?: string[];
  /** Action ids this lesson teaches. */
  teaches: string[];
  /** Discrepancy ids relevant to this lesson. */
  discrepancies?: string[];
  initial: InitialEditorState;
  steps: Step[];
}

export type LessonFolder =
  | "01-vimtutor"
  | "02-basics"
  | "03-selections"
  | "04-multi-cursor"
  | "05-search-replace"
  | "06-text-objects"
  | "07-registers"
  | "08-macros"
  | "09-view"
  | "10-edit-power"
  | "99-golf";

export interface LessonRecord extends Lesson {
  /** Computed at registration time so the catalog can sort. */
  order: number;
}

export interface VerifierContext {
  state: EditorState;
  /** Compare two ranges using the orderRange-canonicalised form. */
  rangeEqual: (a: Range, b: Range) => boolean;
}

export type { Position, Range };
