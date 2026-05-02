import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

// Colemak only changes the alpha block + some symbol keys; reuse qwerty digits.
const map = (lower: string, shift: string) => ({ lower, shift });

export const colemak: LayoutTable = {
  id: "colemak",
  label: "Colemak",
  keyToChar: {
    ...qwerty.keyToChar,

    // Top alpha row (Q W F P G J L U Y ;)
    KeyQ: map("q", "Q"),
    KeyW: map("w", "W"),
    KeyE: map("f", "F"),
    KeyR: map("p", "P"),
    KeyT: map("g", "G"),
    KeyY: map("j", "J"),
    KeyU: map("l", "L"),
    KeyI: map("u", "U"),
    KeyO: map("y", "Y"),
    KeyP: map(";", ":"),
    Semicolon: map("o", "O"),

    // Home row (A R S T D H N E I O)
    KeyA: map("a", "A"),
    KeyS: map("r", "R"),
    KeyD: map("s", "S"),
    KeyF: map("t", "T"),
    KeyG: map("d", "D"),
    KeyH: map("h", "H"),
    KeyJ: map("n", "N"),
    KeyK: map("e", "E"),
    KeyL: map("i", "I"),

    // Bottom row (Z X C V B K M , . /)
    KeyZ: map("z", "Z"),
    KeyX: map("x", "X"),
    KeyC: map("c", "C"),
    KeyV: map("v", "V"),
    KeyB: map("b", "B"),
    KeyN: map("k", "K"),
    KeyM: map("m", "M"),
  },
};
