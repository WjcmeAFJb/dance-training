import { Link } from "wouter";
import { FOLDERS, LESSONS_BY_FOLDER } from "../../lessons/catalog.ts";
import { useStore } from "../../app/store.ts";
import { Badge } from "../components/ui/badge.tsx";

export function LessonsIndexPage() {
  const progress = useStore((s) => s.progress);
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Lessons</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pick a folder. Most folders work standalone — start anywhere.
        </p>
      </header>
      {FOLDERS.map((f) => {
        const lessons = LESSONS_BY_FOLDER[f.id] ?? [];
        if (!lessons.length) return null;
        const done = lessons.filter((l) => progress[`${l.folder}/${l.id}`] === "completed").length;
        return (
          <section key={f.id}>
            <header className="flex items-baseline justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold">{f.label}</h2>
                <p className="text-sm text-muted-foreground">{f.blurb}</p>
              </div>
              <Badge variant="secondary">
                {done}/{lessons.length}
              </Badge>
            </header>
            <div className="grid sm:grid-cols-2 gap-2">
              {lessons.map((l) => {
                const status = progress[`${l.folder}/${l.id}`];
                return (
                  <Link
                    key={l.id}
                    href={`/lessons/${l.folder}/${l.id}`}
                    className="border rounded-md p-3 hover:bg-secondary/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{l.title}</div>
                      {status === "completed" && <Badge variant="success">done</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l.blurb}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      ~{l.est_minutes} min
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
