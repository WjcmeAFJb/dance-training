import { Link } from "wouter";
import { useState } from "react";
import { GOLF_DEMOS } from "../../lessons/golf/catalog.ts";
import { Input } from "../components/ui/input.tsx";
import { Badge } from "../components/ui/badge.tsx";

export function GolfIndexPage() {
  const [filter, setFilter] = useState("");
  const f = filter.trim().toLowerCase();
  const filtered = f
    ? GOLF_DEMOS.filter(
        (d) =>
          d.title.toLowerCase().includes(f) || d.id.includes(f) || d.cmd.toLowerCase().includes(f),
      )
    : GOLF_DEMOS;
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-4">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vim Golf in Kakoune</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {GOLF_DEMOS.length} challenges with their original Kak solutions, sorted shortest first.
          </p>
        </div>
        <Input
          placeholder="Search…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </header>
      <div className="grid gap-2">
        {filtered.map((d) => (
          <Link
            key={d.id}
            href={`/golf/${d.id}`}
            className="border rounded-md p-3 hover:bg-secondary/50 transition flex items-center gap-3"
          >
            <Badge variant="secondary" className="font-mono">
              {d.length} keys
            </Badge>
            <div className="flex-1 truncate text-sm">{d.title}</div>
            <code className="text-xs text-muted-foreground truncate max-w-md">{d.cmd}</code>
          </Link>
        ))}
      </div>
    </div>
  );
}
