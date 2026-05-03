import { Link, useParams } from "wouter";
import { findLesson } from "../../lessons/catalog.ts";
import { LessonRunner } from "../../lessons/runtime.tsx";

export function LessonPage() {
  const params = useParams<{ folder: string; id: string }>();
  const lesson = findLesson(params.folder, params.id);
  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-muted-foreground">
        Lesson not found.{" "}
        <Link className="text-primary underline" href="/lessons">
          Back to lessons.
        </Link>
      </div>
    );
  }
  // `key` forces a fresh mount when navigating between lessons so all the
  // runner's local state — completed flag, stepIndex, narration tone, the
  // editor buffer — resets cleanly. Without it React reconciles the same
  // LessonRunner instance and the new lesson opens already-finished.
  return (
    <div className="h-full">
      <LessonRunner key={`${lesson.folder}/${lesson.id}`} lesson={lesson} />
    </div>
  );
}
