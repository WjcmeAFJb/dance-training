// Always-visible mode strip rendered above the Monaco editor. Tells the user
// at a glance what mode they're in, what counts as "typing" right now, and
// whether keys are being interpreted as Dance commands or text input.

import { cn } from "../lib/utils.ts";
import type { DanceMode } from "../../emulator/types.ts";

const MODE_META: Record<DanceMode, { label: string; tone: string; help: string }> = {
  normal: {
    label: "NORMAL",
    tone: "bg-primary/20 border-primary text-primary",
    help: "Keys run Dance commands. Press i to start typing.",
  },
  insert: {
    label: "INSERT",
    tone: "bg-emerald-700/25 border-emerald-500 text-emerald-300",
    help: "Type to edit. Press Esc to return to Normal.",
  },
  select: {
    label: "SELECT",
    tone: "bg-violet-700/25 border-violet-500 text-violet-300",
    help: "Movement extends the selection. Press Esc to return to Normal.",
  },
  match: {
    label: "MATCH",
    tone: "bg-amber-700/25 border-amber-500 text-amber-300",
    help: "Pick a pair character (m/M/<a-m>).",
  },
  view: {
    label: "VIEW",
    tone: "bg-sky-700/25 border-sky-500 text-sky-300",
    help: "Pick a view command (center/top/bottom).",
  },
  object: {
    label: "OBJECT",
    tone: "bg-fuchsia-700/25 border-fuchsia-500 text-fuchsia-300",
    help: "Pick an object class (w/s/p/(/[/{/etc.).",
  },
};

interface Props {
  mode: DanceMode;
  count?: number;
  partialChord?: string;
  selectionsCount?: number;
}

export function ModeBar({ mode, count, partialChord, selectionsCount }: Props) {
  const meta = MODE_META[mode];
  return (
    <div className={cn("flex items-center gap-3 px-3 py-1.5 border-b text-xs", "bg-card/40")}>
      <span
        className={cn(
          "font-mono font-bold tracking-widest px-2 py-0.5 rounded border-l-4",
          meta.tone,
        )}
      >
        {meta.label}
      </span>
      <span className="text-muted-foreground hidden md:inline">{meta.help}</span>
      <span className="ml-auto flex items-center gap-3 text-muted-foreground">
        {count !== undefined && (
          <span className="font-mono">
            count <span className="text-primary">{count}</span>
          </span>
        )}
        {partialChord && (
          <span className="font-mono">
            chord <span className="text-primary">{partialChord}</span>…
          </span>
        )}
        {selectionsCount !== undefined && selectionsCount > 1 && (
          <span className="font-mono">{selectionsCount} cursors</span>
        )}
      </span>
    </div>
  );
}
