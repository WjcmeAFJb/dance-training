import type { LayoutTable } from "../types.ts";
import { dvorak } from "./dvorak.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

// Programmer Dvorak: same alpha block as Dvorak, but the top number row is
// rearranged (& [ { } ( = * ) + ] !) and digits are accessed via shift.
export const programmerDvorak: LayoutTable = {
  id: "programmer-dvorak",
  label: "Programmer Dvorak",
  keyToChar: {
    ...dvorak.keyToChar,
    Backquote: map("$", "~"),
    Digit1: map("&", "%"),
    Digit2: map("[", "7"),
    Digit3: map("{", "5"),
    Digit4: map("}", "3"),
    Digit5: map("(", "1"),
    Digit6: map("=", "9"),
    Digit7: map("*", "0"),
    Digit8: map(")", "2"),
    Digit9: map("+", "4"),
    Digit0: map("]", "6"),
    Minus: map("!", "8"),
  },
};
