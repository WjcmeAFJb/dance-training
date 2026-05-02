// Render lesson markdown with custom inline tokens:
//   {{key:dance.id}}        → user's binding for that command (or canonical fallback)
//   {{action:kak.id}}       → user's binding for that Kak action
//   {{kakkey:t}}            → literal Kak key string ("t", "<a-w>", "gg")
// We split the source into segments so React renders the chips as components,
// while Markdown is parsed for the rest.

import { Fragment, useMemo } from "react";
import { marked } from "marked";
import { RenderedKey } from "./RenderedKey.tsx";

const TOKEN_RE = /\{\{(key|action|kakkey):([^}]+)\}\}/g;

interface Segment {
  kind: "md" | "key" | "action" | "kakkey";
  value: string;
}

function tokenise(source: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  for (let m = TOKEN_RE.exec(source); m !== null; m = TOKEN_RE.exec(source)) {
    if (m.index > last) {
      segments.push({ kind: "md", value: source.slice(last, m.index) });
    }
    segments.push({
      kind: m[1] as "key" | "action" | "kakkey",
      value: m[2]!.trim(),
    });
    last = m.index + m[0].length;
  }
  if (last < source.length) segments.push({ kind: "md", value: source.slice(last) });
  return segments;
}

export function LessonMarkdown({ source }: { source: string }) {
  const segments = useMemo(() => tokenise(source), [source]);
  return (
    <span>
      {segments.map((s, i) => {
        if (s.kind === "md") {
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: marked.parseInline(s.value) as string }}
            />
          );
        }
        if (s.kind === "key") return <RenderedKey key={i} danceId={s.value} />;
        if (s.kind === "action") return <RenderedKey key={i} kakId={s.value} />;
        return <RenderedKey key={i} kakKey={s.value} />;
      })}
    </span>
  );
}

export const _Fragment = Fragment;
