// Layout resolution: given a KeyChord, render it into the three letter forms.

import type { KeyChord, Modifier } from "../bindings/types.ts";
import type { LayoutTable, UserLayoutPrefs } from "./types.ts";
import { getLayout } from "./tables/index.ts";

export interface KeyView {
  /** What Kakoune docs / canonical references call this key, e.g., "T". */
  canonical: string;
  /** What's printed on the user's hardware key in this position. */
  printed: string;
  /** What the user's OS layout produces when this key is pressed. */
  os: string;
  /** Modifiers in canonical order. */
  modifiers: Modifier[];
  /** Underlying physical position when known (KeyboardEvent.code). */
  code?: string;
  /** True when canonical/printed/os are all the same glyph. */
  uniform: boolean;
}

function applyShift(glyph: { lower: string; shift: string }, shifted: boolean): string {
  return shifted ? glyph.shift : glyph.lower;
}

/**
 * Look up the canonical char produced by the QWERTY layout at the given code.
 * This is what Kak documentation assumes you pressed.
 */
function canonicalCharForCode(code: string, shifted: boolean): string {
  const glyph = getLayout("qwerty").keyToChar[code];
  if (!glyph) return code;
  return applyShift(glyph, shifted);
}

/**
 * Inverse-lookup: given a layout char (e.g., "t") and a layout, return the
 * KeyboardEvent.code that produces it (e.g., "KeyT" on QWERTY, "KeyG" on Colemak).
 * We walk the table once; layouts are tiny.
 */
export function codeForChar(char: string, layout: LayoutTable): string | undefined {
  for (const [code, glyph] of Object.entries(layout.keyToChar)) {
    if (glyph.lower === char || glyph.shift === char) return code;
  }
  return undefined;
}

/**
 * Render a single key chord against the user's layout preferences.
 *
 * Two interpretations:
 *  - **Code chord** (`{kind:"code", code:"KeyT"}`): the user must press the
 *    physical key at that position. canonical = QWERTY's letter at that
 *    position; printed = printed-layout's letter at that position; os =
 *    OS-layout's letter at that position.
 *  - **Char chord** (`{kind:"char", char:"t"}`): the user must produce that
 *    character via their OS layout. canonical = the char (Kakoune's
 *    documentation reference); os = the same char (because that's what they
 *    type); printed = the printed-layout's letter at the *position the OS
 *    layout uses to produce the char*. This is the "letter T → printed F"
 *    case for Colemak users on QWERTY hardware.
 */
export function renderChord(chord: KeyChord, prefs: UserLayoutPrefs): KeyView {
  const modifiers = [...chord.modifiers] as Modifier[];
  const shifted = modifiers.includes("shift");

  // Named keys (Escape, Tab, …) — same in all layouts. Render the name verbatim.
  if (chord.key.kind === "named") {
    const name = chord.key.name;
    return {
      canonical: name,
      printed: name,
      os: name,
      modifiers,
      uniform: true,
    };
  }

  if (chord.key.kind === "code") {
    return renderCodeChord(chord.key.code, modifiers, shifted, prefs);
  }
  return renderCharChord(chord.key.char, modifiers, shifted, prefs);
}

function renderCodeChord(
  code: string,
  modifiers: Modifier[],
  shifted: boolean,
  prefs: UserLayoutPrefs,
): KeyView {
  const canonical = canonicalCharForCode(code, shifted);
  const printedGlyph = getLayout(prefs.printed).keyToChar[code];
  const osGlyph = getLayout(prefs.os).keyToChar[code];
  const printed = printedGlyph ? applyShift(printedGlyph, shifted) : canonical;
  const os = osGlyph ? applyShift(osGlyph, shifted) : canonical;
  return {
    canonical,
    printed,
    os,
    modifiers,
    code,
    uniform: canonical === printed && canonical === os,
  };
}

function renderCharChord(
  char: string,
  modifiers: Modifier[],
  shifted: boolean,
  prefs: UserLayoutPrefs,
): KeyView {
  // Apply the shift modifier to the input char, since the shift flag is the
  // canonical way to encode upper-case in our chord model.
  const target = shifted ? char.toUpperCase() : char;
  // Find the physical position the OS layout uses to produce `target`.
  const osLayout = getLayout(prefs.os);
  const code = codeForChar(target, osLayout);
  if (!code) {
    return {
      canonical: target,
      printed: target,
      os: target,
      modifiers,
      uniform: true,
    };
  }
  const printedGlyph = getLayout(prefs.printed).keyToChar[code];
  const printed = printedGlyph ? applyShift(printedGlyph, shifted) : target;
  return {
    canonical: target,
    printed,
    os: target,
    modifiers,
    code,
    uniform: target === printed,
  };
}

/** Render a sequence of chords as KeyViews in order. */
export function renderSequence(chords: readonly KeyChord[], prefs: UserLayoutPrefs): KeyView[] {
  return chords.map((c) => renderChord(c, prefs));
}

/** Convenience: turn a renderable into the canonical Kakoune-doc string. */
export function canonicalString(view: KeyView): string {
  const mods = view.modifiers.map(modifierKakPrefix).join("");
  const inner = view.canonical.length === 1 ? view.canonical : `<${view.canonical}>`;
  if (!view.modifiers.length) {
    if (view.canonical.length > 1 && !inner.startsWith("<")) return `<${view.canonical}>`;
    return view.canonical;
  }
  return `<${mods}${view.canonical.length === 1 ? view.canonical : view.canonical}>`;
}

function modifierKakPrefix(m: Modifier): string {
  switch (m) {
    case "ctrl":
      return "c-";
    case "alt":
      return "a-";
    case "shift":
      return "s-";
    case "cmd":
      return "m-";
  }
}

/** Best-effort label for the OS layout where `code` lives, for tooltips. */
export function describeKey(view: KeyView, prefs: UserLayoutPrefs): string {
  if (view.uniform) return view.canonical;
  const layoutOs = getLayout(prefs.os).label;
  const layoutPrinted = getLayout(prefs.printed).label;
  return `Kakoune calls this "${view.canonical}". On your ${layoutPrinted} keyboard the key is labelled "${view.printed}". Your ${layoutOs} layout sends "${view.os}" when you press it.`;
}

export type { LayoutId } from "./types.ts";
