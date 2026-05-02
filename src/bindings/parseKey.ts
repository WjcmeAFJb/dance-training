// Parse VS Code keybinding strings into KeySeq.
//
// VS Code's grammar:
//   - "ctrl+shift+alt+meta+<key>" — modifiers in any order, joined by '+'
//   - Sequences: "ctrl+k ctrl+s" — chords separated by whitespace
//   - Layout-independent codes via "[…]": [KeyT], [Digit1], [Comma], [Period],
//     [Slash], [Backslash], [Quote], [Backquote], [Semicolon], [Equal],
//     [Minus], [BracketLeft], [BracketRight], [IntlBackslash], [IntlYen],
//     [Numpad0]–[Numpad9].
//   - Named keys: escape, tab, enter, space, backspace, delete, insert,
//     home, end, pageup, pagedown, up, down, left, right, f1..f24.
//   - Bare chars: a..z, 0..9, ',.;'`-=[]\/' and shifted symbols (!@#…).

import type { KeyChord, KeySeq, Modifier, NamedKey } from "./types.ts";

const MOD_ALIASES: Record<string, Modifier> = {
  ctrl: "ctrl",
  control: "ctrl",
  alt: "alt",
  option: "alt",
  shift: "shift",
  cmd: "cmd",
  meta: "cmd",
  win: "cmd",
  super: "cmd",
};

const NAMED_ALIASES: Record<string, NamedKey> = {
  esc: "escape",
  escape: "escape",
  tab: "tab",
  enter: "enter",
  return: "enter",
  space: "space",
  backspace: "backspace",
  delete: "delete",
  insert: "insert",
  home: "home",
  end: "end",
  pageup: "pageup",
  pagedown: "pagedown",
  up: "up",
  down: "down",
  left: "left",
  right: "right",
};
for (let i = 1; i <= 24; i++) NAMED_ALIASES[`f${i}`] = `f${i}` as NamedKey;

// Bare → physical code, used when a binding is "k" (assumed QWERTY-position).
const QWERTY_CHAR_TO_CODE: Record<string, string> = {
  "`": "Backquote",
  "~": "Backquote",
  "1": "Digit1",
  "!": "Digit1",
  "2": "Digit2",
  "@": "Digit2",
  "3": "Digit3",
  "#": "Digit3",
  "4": "Digit4",
  $: "Digit4",
  "5": "Digit5",
  "%": "Digit5",
  "6": "Digit6",
  "^": "Digit6",
  "7": "Digit7",
  "&": "Digit7",
  "8": "Digit8",
  "*": "Digit8",
  "9": "Digit9",
  "(": "Digit9",
  "0": "Digit0",
  ")": "Digit0",
  "-": "Minus",
  _: "Minus",
  "=": "Equal",
  "+": "Equal",
  "[": "BracketLeft",
  "{": "BracketLeft",
  "]": "BracketRight",
  "}": "BracketRight",
  "\\": "Backslash",
  "|": "Backslash",
  ";": "Semicolon",
  ":": "Semicolon",
  "'": "Quote",
  '"': "Quote",
  ",": "Comma",
  "<": "Comma",
  ".": "Period",
  ">": "Period",
  "/": "Slash",
  "?": "Slash",
};

const BRACKET_RE = /^\[(.+)\]$/;

export function parseChord(input: string): KeyChord {
  if (!input) throw new Error("Empty chord");
  const tokens = input.toLowerCase().split("+");
  const modifiers: Modifier[] = [];
  let keyToken = "";
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]?.trim() ?? "";
    if (i === tokens.length - 1) {
      keyToken = tok;
      break;
    }
    const alias = MOD_ALIASES[tok];
    if (alias) {
      if (!modifiers.includes(alias)) modifiers.push(alias);
    } else {
      // Unknown token in the modifier slot — treat as the key and discard the rest.
      keyToken = tok;
      break;
    }
  }
  // Original case for inside [], named keys are case-insensitive but bare chars
  // need their original case (we track a shift modifier separately).
  const original = input.split("+").pop() ?? "";

  // 1. Bracketed code: [KeyT], [Digit1], [Comma], etc.
  const m = original.match(BRACKET_RE);
  if (m) {
    const code = m[1];
    if (!code) throw new Error(`Empty bracket code: ${input}`);
    return { modifiers: orderMods(modifiers), key: { kind: "code", code } };
  }

  // 2. Named keys.
  const named = NAMED_ALIASES[keyToken];
  if (named) {
    return { modifiers: orderMods(modifiers), key: { kind: "named", name: named } };
  }

  // 3. Single character.
  if (original.length === 1) {
    // VS Code's keybinding format always reports the unshifted form ("a", not "A");
    // it uses an explicit "shift+" prefix. So a bare uppercase letter would be unusual,
    // but we handle it.
    if (/^[A-Z]$/.test(original)) {
      if (!modifiers.includes("shift")) modifiers.push("shift");
      return {
        modifiers: orderMods(modifiers),
        key: { kind: "char", char: original.toLowerCase() },
      };
    }
    return { modifiers: orderMods(modifiers), key: { kind: "char", char: original } };
  }

  // 4. Fallback: try treating the whole thing as a named key.
  if (NAMED_ALIASES[original.toLowerCase()]) {
    return {
      modifiers: orderMods(modifiers),
      key: { kind: "named", name: NAMED_ALIASES[original.toLowerCase()]! },
    };
  }

  throw new Error(`Unrecognised key token: "${input}"`);
}

const MOD_ORDER: Modifier[] = ["ctrl", "shift", "alt", "cmd"];
function orderMods(mods: Modifier[]): Modifier[] {
  return MOD_ORDER.filter((m) => mods.includes(m));
}

export function parseSequence(input: string): KeySeq {
  return input.trim().split(/\s+/).filter(Boolean).map(parseChord);
}

/**
 * Convert a bare char ("t") into a physical code under the QWERTY assumption.
 * Lessons need this when matching what the user pressed.
 */
export function qwertyCodeForChar(char: string): string | undefined {
  if (/^[a-z]$/i.test(char)) return `Key${char.toUpperCase()}`;
  if (/^[0-9]$/.test(char)) return `Digit${char}`;
  return QWERTY_CHAR_TO_CODE[char];
}

/** Stringify a KeySeq back to VS Code form, useful for tests / display. */
export function stringifySequence(seq: KeySeq): string {
  return seq
    .map((c) => {
      const mods = c.modifiers.map((m) => modName(m));
      const k = stringifyKey(c);
      return [...mods, k].join("+");
    })
    .join(" ");
}

function modName(m: Modifier): string {
  return m === "cmd" ? "cmd" : m;
}

function stringifyKey(c: KeyChord): string {
  if (c.key.kind === "code") return `[${c.key.code}]`;
  if (c.key.kind === "named") return c.key.name;
  return c.key.char;
}
