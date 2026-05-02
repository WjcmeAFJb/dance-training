// Plain side panel that shows lesson narration. Replaces the mascot panel.

import { LessonMarkdown } from "./LessonMarkdown.tsx";
import { cn } from "../lib/utils.ts";

export type NarrationTone = "info" | "success" | "warn" | "fail";

const TONE: Record<NarrationTone, string> = {
  info: "border-border bg-card",
  success: "border-emerald-700/50 bg-emerald-700/10",
  warn: "border-amber-700/50 bg-amber-700/10",
  fail: "border-destructive/50 bg-destructive/10",
};

const TONE_LABEL: Record<NarrationTone, string> = {
  info: "Narration",
  success: "Done",
  warn: "Heads up",
  fail: "Try again",
};

export function NarrationPanel({
  tone = "info",
  message,
  title,
}: {
  tone?: NarrationTone;
  message: string;
  title?: string;
}) {
  return (
    <div className={cn("p-4 border rounded-lg lesson-prose", TONE[tone])}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {title ?? TONE_LABEL[tone]}
      </div>
      <div className="text-sm leading-relaxed">
        <LessonMarkdown source={message} />
      </div>
    </div>
  );
}
