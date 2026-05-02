import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

// French AZERTY (ISO). Approximation — we map main characters; AltGr layer is omitted.
export const azertyFr: LayoutTable = {
  id: "azerty-fr",
  label: "AZERTY (French)",
  keyToChar: {
    ...qwerty.keyToChar,
    Backquote: map("²", ""),
    Digit1: map("&", "1"),
    Digit2: map("é", "2"),
    Digit3: map('"', "3"),
    Digit4: map("'", "4"),
    Digit5: map("(", "5"),
    Digit6: map("-", "6"),
    Digit7: map("è", "7"),
    Digit8: map("_", "8"),
    Digit9: map("ç", "9"),
    Digit0: map("à", "0"),
    Minus: map(")", "°"),
    Equal: map("=", "+"),

    KeyQ: map("a", "A"),
    KeyW: map("z", "Z"),
    KeyE: map("e", "E"),
    KeyR: map("r", "R"),
    KeyT: map("t", "T"),
    KeyY: map("y", "Y"),
    KeyU: map("u", "U"),
    KeyI: map("i", "I"),
    KeyO: map("o", "O"),
    KeyP: map("p", "P"),

    KeyA: map("q", "Q"),
    KeyS: map("s", "S"),
    KeyD: map("d", "D"),
    KeyF: map("f", "F"),
    KeyG: map("g", "G"),
    KeyH: map("h", "H"),
    KeyJ: map("j", "J"),
    KeyK: map("k", "K"),
    KeyL: map("l", "L"),
    Semicolon: map("m", "M"),
    Quote: map("ù", "%"),

    KeyZ: map("w", "W"),
    KeyX: map("x", "X"),
    KeyC: map("c", "C"),
    KeyV: map("v", "V"),
    KeyB: map("b", "B"),
    KeyN: map("n", "N"),
    KeyM: map(",", "?"),
    Comma: map(";", "."),
    Period: map(":", "/"),
    Slash: map("!", "§"),
  },
};
