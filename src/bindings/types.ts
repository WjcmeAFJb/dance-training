// Shared bindings types. Used by parser, layout/resolve, and the lesson runtime.

export type Modifier = "ctrl" | "alt" | "shift" | "cmd";

export type NamedKey =
  | "escape"
  | "tab"
  | "enter"
  | "space"
  | "backspace"
  | "delete"
  | "insert"
  | "home"
  | "end"
  | "pageup"
  | "pagedown"
  | "up"
  | "down"
  | "left"
  | "right"
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "f9"
  | "f10"
  | "f11"
  | "f12"
  | "f13"
  | "f14"
  | "f15"
  | "f16"
  | "f17"
  | "f18"
  | "f19"
  | "f20"
  | "f21"
  | "f22"
  | "f23"
  | "f24";

export interface KeyChord {
  modifiers: Modifier[];
  key:
    | { kind: "char"; char: string }
    | { kind: "code"; code: string }
    | { kind: "named"; name: NamedKey };
}

export type KeySeq = KeyChord[];

export interface RawBinding {
  key: string;
  command: string;
  args?: unknown;
  when?: string;
}

export interface ResolvedBinding {
  raw: string;
  sequence: KeySeq;
  command: string;
  args?: unknown;
  when?: string;
  isNegation: boolean;
  isDanceCommand: boolean;
  /** dance.openMenu => menu name; dance.run => null. */
  menuName?: string;
  /** Sub-bindings exposed by a dance.openMenu nested map. */
  menuItems?: Record<string, MenuItem>;
}

export interface MenuItem {
  text: string;
  command: string;
  args?: unknown;
}
