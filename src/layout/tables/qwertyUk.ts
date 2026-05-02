import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

export const qwertyUk: LayoutTable = {
  id: "qwerty-uk",
  label: "QWERTY (UK)",
  keyToChar: {
    ...qwerty.keyToChar,
    Digit2: map("2", '"'),
    Digit3: map("3", "£"),
    Quote: map("'", "@"),
    Backslash: map("#", "~"),
    Backquote: map("`", "¬"),
  },
};
