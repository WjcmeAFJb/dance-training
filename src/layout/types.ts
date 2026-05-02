// Keyboard layout types. We model layouts as (KeyboardEvent.code → glyph) tables.

export type LayoutId =
  | "qwerty"
  | "qwerty-uk"
  | "colemak"
  | "colemak-dh"
  | "dvorak"
  | "programmer-dvorak"
  | "workman"
  | "azerty-fr"
  | "qwertz-de";

export interface LayoutGlyph {
  /** Char produced when no shift is held. */
  lower: string;
  /** Char produced when shift is held. */
  shift: string;
  /** Optional AltGr char produced when AltGr is held (ignored by our app for now). */
  altgr?: string;
}

export interface LayoutTable {
  id: LayoutId;
  label: string;
  /** Map from KeyboardEvent.code (e.g., "KeyA", "Digit1") to its glyph(s). */
  keyToChar: Record<string, LayoutGlyph>;
}

export interface UserLayoutPrefs {
  os: LayoutId;
  printed: LayoutId;
}

export const DEFAULT_LAYOUT_PREFS: UserLayoutPrefs = {
  os: "qwerty",
  printed: "qwerty",
};
