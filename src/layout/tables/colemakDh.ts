import type { LayoutTable } from "../types.ts";
import { colemak } from "./colemak.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

// Colemak-DH (also known as Colemak Mod-DH): swaps the bottom-row positions
// of D, H, M and V to keep common bigrams on the home row.
export const colemakDh: LayoutTable = {
  id: "colemak-dh",
  label: "Colemak Mod-DH",
  keyToChar: {
    ...colemak.keyToChar,
    KeyB: map("d", "D"),
    KeyD: map("m", "M"),
    KeyG: map("b", "B"),
    KeyH: map("k", "K"),
    KeyJ: map("h", "H"),
    KeyN: map("v", "V"),
    KeyV: map("n", "N"),
  },
};
