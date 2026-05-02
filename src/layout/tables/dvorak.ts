import type { LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";

const map = (lower: string, shift: string) => ({ lower, shift });

export const dvorak: LayoutTable = {
  id: "dvorak",
  label: "Dvorak (Simplified)",
  keyToChar: {
    ...qwerty.keyToChar,

    // Top: ' , . p y f g c r l / =
    KeyQ: map("'", '"'),
    KeyW: map(",", "<"),
    KeyE: map(".", ">"),
    KeyR: map("p", "P"),
    KeyT: map("y", "Y"),
    KeyY: map("f", "F"),
    KeyU: map("g", "G"),
    KeyI: map("c", "C"),
    KeyO: map("r", "R"),
    KeyP: map("l", "L"),
    BracketLeft: map("/", "?"),
    BracketRight: map("=", "+"),

    // Home: a o e u i d h t n s -
    KeyA: map("a", "A"),
    KeyS: map("o", "O"),
    KeyD: map("e", "E"),
    KeyF: map("u", "U"),
    KeyG: map("i", "I"),
    KeyH: map("d", "D"),
    KeyJ: map("h", "H"),
    KeyK: map("t", "T"),
    KeyL: map("n", "N"),
    Semicolon: map("s", "S"),
    Quote: map("-", "_"),

    // Bottom: ; q j k x b m w v z
    KeyZ: map(";", ":"),
    KeyX: map("q", "Q"),
    KeyC: map("j", "J"),
    KeyV: map("k", "K"),
    KeyB: map("x", "X"),
    KeyN: map("b", "B"),
    KeyM: map("m", "M"),
    Comma: map("w", "W"),
    Period: map("v", "V"),
    Slash: map("z", "Z"),
  },
};
