// Auto-discovers every lesson in src/lessons/content/**/*.lesson.ts and exposes
// a sorted catalog grouped by folder.

import type { Lesson, LessonFolder } from "./types.ts";

const modules = import.meta.glob<{ lesson: Lesson }>("./content/**/*.lesson.ts", {
  eager: true,
});

export interface FolderInfo {
  id: LessonFolder;
  label: string;
  blurb: string;
}

export const FOLDERS: readonly FolderInfo[] = [
  {
    id: "01-vimtutor",
    label: "Vimtutor for Kakoune",
    blurb: "The classic Vim tutorial, restated for Kak's selection-first model.",
  },
  {
    id: "02-basics",
    label: "Basics",
    blurb: "Modes, escape, motion, and the rules selections live by.",
  },
  {
    id: "03-selections",
    label: "Selections",
    blurb: "Trim, expand, reduce, flip — selections are nouns.",
  },
  {
    id: "04-multi-cursor",
    label: "Multi-cursor",
    blurb: "Split, filter, rotate, align. The killer feature.",
  },
  {
    id: "05-search-replace",
    label: "Search & Replace",
    blurb: "Forward, backward, and regex-driven workflows.",
  },
  {
    id: "06-text-objects",
    label: "Text Objects",
    blurb: "Words, sentences, brackets, indents, syntax.",
  },
  {
    id: "07-registers",
    label: "Registers",
    blurb: "Yank, paste, named registers, and the clipboard.",
  },
  { id: "08-macros", label: "Macros", blurb: "Record. Replay. Compose." },
  { id: "09-view", label: "View", blurb: "Scroll, center, lock — be where you want to be." },
  { id: "10-edit-power", label: "Edit Power-ups", blurb: "Align, copy-indent, pipe, case." },
  {
    id: "99-golf",
    label: "Vim Golf in Kak",
    blurb: "Watch real Kakoune solutions, then try them yourself.",
  },
];

export const FOLDER_BY_ID: ReadonlyMap<LessonFolder, FolderInfo> = new Map(
  FOLDERS.map((f) => [f.id, f]),
);

const all: Lesson[] = [];

for (const [path, mod] of Object.entries(modules)) {
  const lesson = mod.lesson;
  if (!lesson) continue;
  if (!lesson.folder || !lesson.id) {
    console.warn(`Lesson missing id/folder: ${path}`);
    continue;
  }
  all.push(lesson);
}

all.sort((a, b) => {
  if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
  return a.id.localeCompare(b.id);
});

export const LESSONS: readonly Lesson[] = all;

export const LESSONS_BY_FOLDER: Record<LessonFolder, Lesson[]> = FOLDERS.reduce(
  (acc, f) => {
    acc[f.id] = LESSONS.filter((l) => l.folder === f.id);
    return acc;
  },
  {} as Record<LessonFolder, Lesson[]>,
);

export function findLesson(folder: string, id: string): Lesson | undefined {
  return LESSONS.find((l) => l.folder === folder && l.id === id);
}
