// LessonRunner — owns the per-lesson editor state, dispatches commands,
// runs the verifier, and drives narration reactions.
//
// FSM:
//   in_progress(stepIndex)  ─ goal met or Skip clicked ─→  in_progress(stepIndex+1)
//                                                       ─→  completed (when last step done)
//   completed              ─ verifier disabled, narrator locked, "Next lesson →" CTA shown

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import type { EditorState } from "../emulator/types.ts";
import { initialEditorState } from "../emulator/types.ts";
import { MonacoBridge } from "../emulator/MonacoBridge.tsx";
import { useStore } from "../app/store.ts";
import { NarrationPanel, type NarrationTone } from "../ui/components/NarrationPanel.tsx";
import { pickLine } from "../ui/narration/lines.ts";
import { LessonMarkdown } from "../ui/components/LessonMarkdown.tsx";
import type { Lesson, Step } from "./types.ts";
import { verify } from "./verifier.ts";
import { Button } from "../ui/components/ui/button.tsx";
import { DISCREPANCY_BY_ID } from "../data/discrepancies.ts";
import { LESSONS } from "./catalog.ts";

export function LessonRunner({ lesson }: { lesson: Lesson }) {
  const bindings = useStore((s) => s.bindings);
  const markComplete = useStore((s) => s.markLessonComplete);

  const initialState = useMemo<EditorState>(() => {
    const s = initialEditorState(lesson.initial.text);
    if (lesson.initial.mode) s.mode = lesson.initial.mode;
    if (lesson.initial.selections) s.selections = lesson.initial.selections;
    return s;
  }, [lesson]);

  const [state, setState] = useState<EditorState>(initialState);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [tone, setTone] = useState<NarrationTone>("info");
  const [message, setMessage] = useState<string>(
    () => lesson.steps[0]?.narrate ?? "All steps complete.",
  );
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<number | null>(null);

  const step: Step | undefined = lesson.steps[stepIndex];

  // Find the next lesson in the catalog for the post-completion CTA.
  const nextLesson = useMemo(() => {
    const i = LESSONS.findIndex((l) => l.folder === lesson.folder && l.id === lesson.id);
    return i >= 0 ? LESSONS[i + 1] : undefined;
  }, [lesson]);

  const advance = useCallback(() => {
    const next = stepIndex + 1;
    if (next >= lesson.steps.length) {
      setCompleted(true);
      setTone("success");
      setMessage(`${pickLine("cheer")}\n\nLesson complete. The editor is yours to play with.`);
      markComplete(`${lesson.folder}/${lesson.id}`);
      return;
    }
    const nextStep = lesson.steps[next]!;
    setStepIndex(next);
    setShowHint(false);
    setTone("success");
    setMessage(`${pickLine("success")}\n\n${nextStep.narrate}`);
    if (nextStep.reset === "initial") setState(initialState);
    else if (typeof nextStep.reset === "object") {
      setState(initialEditorState(nextStep.reset.text));
    }
  }, [stepIndex, lesson, initialState, markComplete]);

  // Run the verifier on every state change — but never once `completed` is
  // true, so post-completion keypresses don't snap the narrator.
  useEffect(() => {
    if (completed || !step) return;
    if (verify(state, step.goal)) advance();
  }, [state, step, advance, completed]);

  // Hint timer — also disabled after completion.
  useEffect(() => {
    if (completed || !step) return;
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    setShowHint(false);
    if (step.hint) {
      hintTimer.current = window.setTimeout(() => setShowHint(true), step.hintAfterMs ?? 12000);
    }
    return () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, [stepIndex, step, completed]);

  const handleStateChange = useCallback((s: EditorState) => setState(s), []);

  const handleReset = () => {
    setState(initialState);
    setStepIndex(0);
    setCompleted(false);
    setMessage(lesson.steps[0]?.narrate ?? "");
    setTone("info");
  };

  const handleSkip = () => {
    if (completed) return;
    advance();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 h-full">
      <div className="flex flex-col gap-3 min-w-0">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-semibold">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground">{lesson.blurb}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            {completed
              ? `${lesson.steps.length}/${lesson.steps.length} ✓`
              : `Step ${stepIndex + 1}/${lesson.steps.length}`}
          </div>
        </header>
        <div className="text-sm leading-relaxed lesson-prose bg-card border rounded-lg p-3">
          {completed ? (
            <span className="text-emerald-300 font-medium">Lesson complete.</span>
          ) : step ? (
            <LessonMarkdown source={step.narrate} />
          ) : (
            <span className="text-muted-foreground">All steps complete.</span>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden">
          <MonacoBridge state={state} bindings={bindings} onChange={handleStateChange} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleReset}>
            {completed ? "Replay lesson" : "Reset lesson"}
          </Button>
          {!completed && step?.hint && !showHint && (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              Show hint
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {!completed && step && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                title="Skip this step without satisfying its goal"
              >
                {stepIndex + 1 === lesson.steps.length ? "Finish lesson" : "Next step →"}
              </Button>
            )}
            {completed && nextLesson && (
              <Button asChild size="sm">
                <Link href={`/lessons/${nextLesson.folder}/${nextLesson.id}`}>
                  Next lesson: {nextLesson.title} →
                </Link>
              </Button>
            )}
            {completed && !nextLesson && (
              <Button asChild size="sm" variant="outline">
                <Link href="/lessons">← All lessons</Link>
              </Button>
            )}
          </div>
        </div>
        {!completed && showHint && step?.hint && (
          <div className="text-sm bg-secondary/50 border rounded-lg p-3 lesson-prose">
            <strong className="text-primary">Hint.</strong> <LessonMarkdown source={step.hint} />
          </div>
        )}
        {lesson.discrepancies?.length && <DiscrepancyCallouts ids={lesson.discrepancies} />}
      </div>
      <div className="flex flex-col gap-3">
        <NarrationPanel tone={tone} message={message} />
        <ProgressFooter stepCount={lesson.steps.length} index={stepIndex} completed={completed} />
      </div>
    </div>
  );
}

function DiscrepancyCallouts({ ids }: { ids: readonly string[] }) {
  return (
    <div className="space-y-2">
      {ids.map((id) => {
        const d = DISCREPANCY_BY_ID.get(id);
        if (!d) return null;
        return (
          <div
            key={id}
            className="text-xs p-2.5 rounded-md border border-amber-700/50 bg-amber-700/10 lesson-prose"
          >
            <strong className="text-amber-400">Heads up — </strong>
            <span className="font-medium">{d.title}.</span> <LessonMarkdown source={d.body} />
          </div>
        );
      })}
    </div>
  );
}

function ProgressFooter({
  stepCount,
  index,
  completed,
}: {
  stepCount: number;
  index: number;
  completed: boolean;
}) {
  if (completed) {
    return (
      <div className="text-xs text-emerald-300 p-3 border border-emerald-700/40 rounded-lg bg-emerald-700/10">
        Done — all {stepCount} steps cleared.
      </div>
    );
  }
  const left = stepCount - index - 1;
  return (
    <div className="text-xs text-muted-foreground p-3 border rounded-lg bg-secondary/40">
      {left > 0 ? `${left} step${left === 1 ? "" : "s"} left.` : "Last step!"}
    </div>
  );
}
