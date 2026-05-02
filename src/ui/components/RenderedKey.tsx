// Resolves a Dance command id (or a raw Kak action id) to the user's bound key,
// then renders a KeyChip. Falls back to the canonical Kakoune chord when the
// user has no binding.

import { useMemo } from "react";
import { KeyChip } from "./KeyChip.tsx";
import { useStore } from "../../app/store.ts";
import { preferredBinding } from "../../bindings/findBinding.ts";
import { parseSequence } from "../../bindings/parseKey.ts";
import { DANCE_BY_ID } from "../../data/danceCommands.ts";
import { KAK_BY_ID } from "../../data/kakReference.ts";

interface ByDanceId {
  danceId: string;
  kakId?: never;
  kakKey?: never;
}
interface ByKakId {
  danceId?: never;
  kakId: string;
  kakKey?: never;
}
interface ByLiteralKakKey {
  danceId?: never;
  kakId?: never;
  kakKey: string;
}

type Props = (ByDanceId | ByKakId | ByLiteralKakKey) & {
  fallbackToKak?: boolean;
  className?: string;
};

export function RenderedKey(props: Props) {
  const bindings = useStore((s) => s.bindings);

  const view = useMemo(() => {
    if (props.kakKey !== undefined) {
      return { sequence: kakKeyToSequence(props.kakKey), origin: "kak" as const };
    }
    if (props.danceId) {
      const binding = preferredBinding(props.danceId, bindings);
      if (binding) return { sequence: binding.sequence, origin: "user" as const };
      const cmd = DANCE_BY_ID.get(props.danceId);
      if (cmd?.default) return { sequence: kakKeyToSequence(cmd.default), origin: "kak" as const };
      return null;
    }
    if (props.kakId) {
      const action = KAK_BY_ID.get(props.kakId);
      if (!action) return null;
      // Try to find a Dance command that maps to this Kak action.
      const danceMatch = [...DANCE_BY_ID.values()].find((c) => c.kak === props.kakId);
      if (danceMatch) {
        const binding = preferredBinding(danceMatch.id, bindings);
        if (binding) return { sequence: binding.sequence, origin: "user" as const };
      }
      return { sequence: kakKeyToSequence(action.default), origin: "kak" as const };
    }
    return null;
  }, [props, bindings]);

  if (!view) return <span className="kbd opacity-50">?</span>;

  const title =
    view.origin === "user"
      ? "From your keybindings.json"
      : "Kakoune default — you haven't bound this in Dance";

  return (
    <KeyChip
      sequence={view.sequence}
      title={title}
      variant="default"
      {...(props.className !== undefined ? { className: props.className } : {})}
    />
  );
}

/**
 * Convert a Kakoune-style key string ("t", "<a-t>", "gg", "<c-d>") into a KeySeq.
 */
function kakKeyToSequence(s: string) {
  // Multi-key like "gg" or "ge".
  // Treat consecutive single chars as a sequence, handling <…> as one chord.
  const chords: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "<") {
      const close = s.indexOf(">", i + 1);
      if (close < 0) {
        chords.push(s[i]!);
        continue;
      }
      chords.push(s.slice(i, close + 1));
      i = close;
    } else {
      chords.push(s[i]!);
    }
  }
  return parseSequence(chords.map(kakChordToVscode).join(" "));
}

function kakChordToVscode(token: string): string {
  // <a-t> → "alt+t", <c-d> → "ctrl+d", <s-t> → "shift+t", <esc> → "escape"
  if (token.startsWith("<") && token.endsWith(">")) {
    const inner = token.slice(1, -1);
    if (inner === "esc") return "escape";
    if (inner === "ret") return "enter";
    if (inner === "tab") return "tab";
    if (inner === "space") return "space";
    if (inner === "lt") return ",";
    if (inner === "gt") return ".";
    const m = inner.match(/^(?:([acsm])-)+(.+)$/i);
    // Multiple modifiers: <a-c-x>
    if (/^([acsm]-)+/i.test(inner)) {
      const parts = inner.split("-");
      const last = parts.pop() ?? "";
      const mods = parts
        .map((p) => {
          const k = p.toLowerCase();
          return k === "a"
            ? "alt"
            : k === "c"
              ? "ctrl"
              : k === "s"
                ? "shift"
                : k === "m"
                  ? "cmd"
                  : "";
        })
        .filter(Boolean);
      return [...mods, mapBareKey(last)].join("+");
    }
    if (m) {
      const [, mod, rest] = m;
      const modName = mod === "a" ? "alt" : mod === "c" ? "ctrl" : mod === "s" ? "shift" : "cmd";
      return `${modName}+${mapBareKey(rest!)}`;
    }
    return mapBareKey(inner);
  }
  // Bare char, possibly uppercase Kak shorthand for shift.
  if (/^[A-Z]$/.test(token)) return `shift+${token.toLowerCase()}`;
  return mapBareKey(token);
}

function mapBareKey(k: string): string {
  if (k.length === 1 && /[A-Z]/.test(k)) return `shift+${k.toLowerCase()}`;
  return k;
}
