import type { LayoutId, LayoutTable } from "../types.ts";
import { qwerty } from "./qwerty.ts";
import { qwertyUk } from "./qwertyUk.ts";
import { colemak } from "./colemak.ts";
import { colemakDh } from "./colemakDh.ts";
import { dvorak } from "./dvorak.ts";
import { programmerDvorak } from "./programmerDvorak.ts";
import { workman } from "./workman.ts";
import { azertyFr } from "./azertyFr.ts";
import { qwertzDe } from "./qwertzDe.ts";

export const LAYOUTS: Record<LayoutId, LayoutTable> = {
  qwerty,
  "qwerty-uk": qwertyUk,
  colemak,
  "colemak-dh": colemakDh,
  dvorak,
  "programmer-dvorak": programmerDvorak,
  workman,
  "azerty-fr": azertyFr,
  "qwertz-de": qwertzDe,
};

export const LAYOUT_OPTIONS: { id: LayoutId; label: string }[] = (
  Object.values(LAYOUTS) as LayoutTable[]
).map((l) => ({ id: l.id, label: l.label }));

export function getLayout(id: LayoutId): LayoutTable {
  return LAYOUTS[id];
}
