import { Clippy, type ClippyState } from "./Clippy.tsx";
import { LessonMarkdown } from "./LessonMarkdown.tsx";

export function ClippyPanel({ state, message }: { state: ClippyState; message: string }) {
  return (
    <div className="flex gap-3 items-start p-4 bg-card border rounded-lg">
      <Clippy state={state} size={68} className="shrink-0" />
      <div className="text-sm leading-relaxed lesson-prose">
        <LessonMarkdown source={message} />
      </div>
    </div>
  );
}
