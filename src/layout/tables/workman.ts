import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

export const workman: LayoutTable = {
  id: "workman",
  label: "Workman",
  keyToChar: {
    ...qwerty.keyToChar,

    // Top: q d r w b j f u p ;
    KeyQ: map("q", "Q"),
    KeyW: map("d", "D"),
    KeyE: map("r", "R"),
    KeyR: map("w", "W"),
    KeyT: map("b", "B"),
    KeyY: map("j", "J"),
    KeyU: map("f", "F"),
    KeyI: map("u", "U"),
    KeyO: map("p", "P"),
    KeyP: map(";", ":"),

    // Home: a s h t g y n e o i
    KeyA: map("a", "A"),
    KeyS: map("s", "S"),
    KeyD: map("h", "H"),
    KeyF: map("t", "T"),
    KeyG: map("g", "G"),
    KeyH: map("y", "Y"),
    KeyJ: map("n", "N"),
    KeyK: map("e", "E"),
    KeyL: map("o", "O"),
    Semicolon: map("i", "I"),

    // Bottom: z x m c v k l , . /
    KeyZ: map("z", "Z"),
    KeyX: map("x", "X"),
    KeyC: map("m", "M"),
    KeyV: map("c", "C"),
    KeyB: map("v", "V"),
    KeyN: map("k", "K"),
    KeyM: map("l", "L"),
  },
};
