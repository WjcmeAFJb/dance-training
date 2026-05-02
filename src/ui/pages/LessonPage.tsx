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
  return (
    <div className="h-full">
      <LessonRunner lesson={lesson} />
    </div>
  );
}
