import { useMemo } from "react";
import type { KeyChord, KeySeq } from "../../bindings/types.ts";
import { describeKey, renderChord, renderSequence } from "../../layout/resolve.ts";
import type { KeyView } from "../../layout/resolve.ts";
import { useStore } from "../../app/store.ts";
import { cn } from "../lib/utils.ts";

interface KeyChipProps {
  chord?: KeyChord;
  sequence?: KeySeq;
  /** When true, render the printed/os secondary glyph next to the canonical. */
  showAlternates?: boolean;
  variant?: "default" | "ghost";
  className?: string;
  /** Tooltip override; if not given, uses describeKey. */
  title?: string;
}

const MOD_LABEL: Record<string, string> = {
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift",
  cmd: "⌘",
};

export function KeyChip({
  chord,
  sequence,
  showAlternates = true,
  variant = "default",
  className,
  title,
}: KeyChipProps) {
  const layout = useStore((s) => s.layout);
  const views = useMemo<KeyView[]>(() => {
    if (sequence) return renderSequence(sequence, layout);
    if (chord) return [renderChord(chord, layout)];
    return [];
  }, [sequence, chord, layout]);

  if (!views.length) return null;

  return (
    <span className={cn("inline-flex items-baseline gap-1 align-baseline", className)}>
      {views.map((v, i) => (
        <SingleChip
          key={i}
          view={v}
          showAlternates={showAlternates}
          variant={variant}
          {...(title !== undefined ? { title } : {})}
          osLayout={layout.os}
          printedLayout={layout.printed}
        />
      ))}
    </span>
  );
}

function SingleChip({
  view,
  showAlternates,
  variant,
  title,
  osLayout,
  printedLayout,
}: {
  view: KeyView;
  showAlternates: boolean;
  variant: "default" | "ghost";
  title?: string;
  osLayout: string;
  printedLayout: string;
}) {
  const tooltip =
    title ?? describeKey(view, { os: osLayout as never, printed: printedLayout as never });
  const showPrinted = showAlternates && view.printed !== view.canonical;
  const showOs = showAlternates && view.os !== view.canonical && view.os !== view.printed;
  return (
    <span
      title={tooltip}
      className={cn("kbd", variant === "ghost" && "bg-transparent border-transparent border-b-0")}
    >
      {view.modifiers.map((m) => (
        <span key={m} className="text-muted-foreground mr-1">
          {MOD_LABEL[m] ?? m}
        </span>
      ))}
      <span className="kbd-canonical">{prettify(view.canonical)}</span>
      {showPrinted && (
        <sub className="kbd-printed ml-1" aria-label="printed on hardware key">
          {prettify(view.printed)}
        </sub>
      )}
      {showOs && (
        <sub className="kbd-os ml-1" aria-label="produced by your OS layout">
          {prettify(view.os)}
        </sub>
      )}
    </span>
  );
}

function prettify(s: string): string {
  if (s === " ") return "Space";
  if (s === "") return "—";
  if (s.length > 1) return capitalise(s);
  return s;
}

function capitalise(s: string): string {
  return s ? s[0]!.toUpperCase() + s.slice(1) : s;
}
