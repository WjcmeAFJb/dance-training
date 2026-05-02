// LessonRunner — owns the per-lesson editor state, dispatches commands,
// runs the verifier, and drives Clippy reactions.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorState } from "../emulator/types.ts";
import { initialEditorState } from "../emulator/types.ts";
import { MonacoBridge } from "../emulator/MonacoBridge.tsx";
import { useStore } from "../app/store.ts";
import { ClippyPanel } from "../ui/components/ClippyPanel.tsx";
import type { ClippyState } from "../ui/components/Clippy.tsx";
import { CLIPPY_LINES, pickLine } from "../ui/clippy/lines.ts";
import { LessonMarkdown } from "../ui/components/LessonMarkdown.tsx";
import type { Lesson, Step } from "./types.ts";
import { verify } from "./verifier.ts";
import { Button } from "../ui/components/ui/button.tsx";
import { DISCREPANCY_BY_ID } from "../data/discrepancies.ts";

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
  const [clippyState, setClippyState] = useState<ClippyState>("talking");
  const [clippyMsg, setClippyMsg] = useState<string>(() => {
    const first = lesson.steps[0];
    return first ? `${pickLine("intro")}\n\n${first.narrate}` : pickLine("intro");
  });
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<number | null>(null);

  const step: Step | undefined = lesson.steps[stepIndex];

  const advance = useCallback(() => {
    const next = stepIndex + 1;
    if (next >= lesson.steps.length) {
      setClippyState("cheering");
      setClippyMsg(pickLine("cheer"));
      markComplete(`${lesson.folder}/${lesson.id}`);
      return;
    }
    const nextStep = lesson.steps[next]!;
    setStepIndex(next);
    setShowHint(false);
    setClippyState("talking");
    setClippyMsg(`${pickLine("success")}\n\n${nextStep.narrate}`);
    if (nextStep.reset === "initial") setState(initialState);
    else if (typeof nextStep.reset === "object") {
      setState(initialEditorState(nextStep.reset.text));
    }
  }, [stepIndex, lesson, initialState, markComplete]);

  // Run verifier on every state change.
  useEffect(() => {
    if (!step) return;
    if (verify(state, step.goal)) {
      advance();
    }
  }, [state, step, advance]);

  // Hint timer.
  useEffect(() => {
    if (!step) return;
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    setShowHint(false);
    if (step.hint) {
      hintTimer.current = window.setTimeout(() => setShowHint(true), step.hintAfterMs ?? 12000);
    }
    return () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, [stepIndex, step]);

  const handleStateChange = useCallback((s: EditorState) => {
    setState(s);
  }, []);

  const handleInsertText = useCallback((insertedText: string) => {
    // Insert mode text edits flow through Monaco's onChange already.
    void insertedText;
  }, []);

  const handleReset = () => {
    setState(initialState);
    setStepIndex(0);
    setClippyMsg(`${pickLine("intro")}\n\n${lesson.steps[0]?.narrate ?? ""}`);
    setClippyState("talking");
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
            Step {stepIndex + 1}/{lesson.steps.length}
          </div>
        </header>
        <div className="text-sm leading-relaxed lesson-prose bg-card border rounded-lg p-3">
          {step ? (
            <LessonMarkdown source={step.narrate} />
          ) : (
            <span className="text-muted-foreground">All steps complete.</span>
          )}
        </div>
        <div className="border rounded-lg overflow-hidden">
          <MonacoBridge
            state={state}
            bindings={bindings}
            onChange={handleStateChange}
            onInsertText={handleInsertText}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset lesson
          </Button>
          {step?.hint && !showHint && (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
              Show hint
            </Button>
          )}
        </div>
        {showHint && step?.hint && (
          <div className="text-sm bg-secondary/50 border rounded-lg p-3 lesson-prose">
            <strong className="text-primary">Hint.</strong> <LessonMarkdown source={step.hint} />
          </div>
        )}
        {lesson.discrepancies?.length && <DiscrepancyCallouts ids={lesson.discrepancies} />}
      </div>
      <div className="flex flex-col gap-3">
        <ClippyPanel state={clippyState} message={clippyMsg} />
        <NextHint stepCount={lesson.steps.length} index={stepIndex} />
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
            <strong className="text-amber-400">{CLIPPY_LINES.discrepancy[0]} </strong>
            <span className="font-medium">{d.title}.</span> <LessonMarkdown source={d.body} />
          </div>
        );
      })}
    </div>
  );
}

function NextHint({ stepCount, index }: { stepCount: number; index: number }) {
  const left = stepCount - index - 1;
  return (
    <div className="text-xs text-muted-foreground p-3 border rounded-lg bg-secondary/40">
      {left > 0 ? `${left} step${left === 1 ? "" : "s"} left.` : "Last step!"}
    </div>
  );
}
