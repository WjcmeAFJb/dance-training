import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

export const qwertzDe: LayoutTable = {
  id: "qwertz-de",
  label: "QWERTZ (German)",
  keyToChar: {
    ...qwerty.keyToChar,
    Backquote: map("^", "°"),
    Digit2: map("2", '"'),
    Digit3: map("3", "§"),
    Digit6: map("6", "&"),
    Digit7: map("7", "/"),
    Digit8: map("8", "("),
    Digit9: map("9", ")"),
    Digit0: map("0", "="),
    Minus: map("ß", "?"),
    Equal: map("´", "`"),

    KeyY: map("z", "Z"),
    KeyZ: map("y", "Y"),
    BracketLeft: map("ü", "Ü"),
    BracketRight: map("+", "*"),
    Semicolon: map("ö", "Ö"),
    Quote: map("ä", "Ä"),
    Backslash: map("#", "'"),
  },
};
