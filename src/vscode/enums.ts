// VS Code's enum-shaped exports. We use plain const objects (`as const`) and
// re-export with `export type` for the type-side names — Dance compares
// integer values, so the numeric mapping must match VS Code 1.63's exactly.

export const TextEditorCursorStyle = {
  Line: 1,
  Block: 2,
  Underline: 3,
  LineThin: 4,
  BlockOutline: 5,
  UnderlineThin: 6,
} as const;
export type TextEditorCursorStyle =
  (typeof TextEditorCursorStyle)[keyof typeof TextEditorCursorStyle];

export const TextEditorLineNumbersStyle = {
  Off: 0,
  On: 1,
  Relative: 2,
} as const;
export type TextEditorLineNumbersStyle =
  (typeof TextEditorLineNumbersStyle)[keyof typeof TextEditorLineNumbersStyle];

export const TextEditorRevealType = {
  Default: 0,
  InCenter: 1,
  InCenterIfOutsideViewport: 2,
  AtTop: 3,
} as const;
export type TextEditorRevealType = (typeof TextEditorRevealType)[keyof typeof TextEditorRevealType];

export const EndOfLine = {
  LF: 1,
  CRLF: 2,
} as const;
export type EndOfLine = (typeof EndOfLine)[keyof typeof EndOfLine];

export const StatusBarAlignment = {
  Left: 1,
  Right: 2,
} as const;
export type StatusBarAlignment = (typeof StatusBarAlignment)[keyof typeof StatusBarAlignment];

export const TreeItemCollapsibleState = {
  None: 0,
  Collapsed: 1,
  Expanded: 2,
} as const;
export type TreeItemCollapsibleState =
  (typeof TreeItemCollapsibleState)[keyof typeof TreeItemCollapsibleState];

export const DecorationRangeBehavior = {
  OpenOpen: 0,
  ClosedClosed: 1,
  OpenClosed: 2,
  ClosedOpen: 3,
} as const;
export type DecorationRangeBehavior =
  (typeof DecorationRangeBehavior)[keyof typeof DecorationRangeBehavior];

export const TextEditorSelectionChangeKind = {
  Keyboard: 1,
  Mouse: 2,
  Command: 3,
} as const;
export type TextEditorSelectionChangeKind =
  (typeof TextEditorSelectionChangeKind)[keyof typeof TextEditorSelectionChangeKind];

export const ConfigurationTarget = {
  Global: 1,
  Workspace: 2,
  WorkspaceFolder: 3,
} as const;
export type ConfigurationTarget = (typeof ConfigurationTarget)[keyof typeof ConfigurationTarget];

export const ViewColumn = {
  Active: -1,
  Beside: -2,
  One: 1,
  Two: 2,
  Three: 3,
} as const;
export type ViewColumn = (typeof ViewColumn)[keyof typeof ViewColumn];

export class TreeItem {
  constructor(
    public label: string | { label: string },
    public collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
  ) {}
}
