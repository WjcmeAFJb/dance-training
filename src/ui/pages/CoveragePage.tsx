import { useState } from "react";
import { useStore } from "../../app/store.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Input } from "../components/ui/input.tsx";
import { RenderedKey } from "../components/RenderedKey.tsx";
import { ScrollArea } from "../components/ui/scroll-area.tsx";
import { DISCREPANCIES } from "../../data/discrepancies.ts";
import { LessonMarkdown } from "../components/LessonMarkdown.tsx";

export function CoveragePage() {
  const coverage = useStore((s) => s.coverage);
  const [filter, setFilter] = useState("");

  if (!coverage) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-muted-foreground">
        Upload your <code>keybindings.json</code> to see coverage.
      </div>
    );
  }
  const f = filter.trim().toLowerCase();
  const matchesDance = (id: string, title: string) =>
    !f || id.toLowerCase().includes(f) || title.toLowerCase().includes(f);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-4">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Coverage</h1>
        <div className="text-sm text-muted-foreground">
          Dance: <strong className="text-foreground">{coverage.totals.danceBound}</strong>/
          {coverage.totals.danceTotal} bound. Kak:{" "}
          <strong className="text-foreground">{coverage.totals.kakBound}</strong>/
          {coverage.totals.kakTotal} reachable.
        </div>
      </header>
      <Input
        placeholder="Filter by id or title…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Tabs defaultValue="dance">
        <TabsList>
          <TabsTrigger value="dance">Dance commands</TabsTrigger>
          <TabsTrigger value="kak">Kakoune actions</TabsTrigger>
          <TabsTrigger value="kakOnly">Kak-only</TabsTrigger>
          <TabsTrigger value="disc">Discrepancies ({DISCREPANCIES.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="dance">
          <ScrollArea className="h-[60vh] border rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b text-left">
                <tr>
                  <th className="p-2 w-1/3">Command</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Bound</th>
                </tr>
              </thead>
              <tbody>
                {coverage.dance
                  .filter((d) => matchesDance(d.command.id, d.command.title))
                  .map((d) => (
                    <tr key={d.command.id} className="border-b">
                      <td className="p-2 font-mono text-xs">{d.command.id}</td>
                      <td className="p-2">{d.command.title}</td>
                      <td className="p-2">
                        {d.bound ? (
                          <RenderedKey danceId={d.command.id} />
                        ) : d.disabledByUser ? (
                          <Badge variant="destructive">disabled</Badge>
                        ) : (
                          <Badge variant="warning">unbound</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="kak">
          <ScrollArea className="h-[60vh] border rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b text-left">
                <tr>
                  <th className="p-2 w-1/3">Action</th>
                  <th className="p-2">Default</th>
                  <th className="p-2">Your key</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {coverage.kak
                  .filter(
                    (k) =>
                      !f ||
                      k.action.id.toLowerCase().includes(f) ||
                      k.action.description.toLowerCase().includes(f),
                  )
                  .map((k) => (
                    <tr key={k.action.id} className="border-b align-top">
                      <td className="p-2 font-mono text-xs">{k.action.id}</td>
                      <td className="p-2 font-mono text-xs">{k.action.default}</td>
                      <td className="p-2">
                        {k.dance ? (
                          <RenderedKey danceId={k.dance.id} />
                        ) : (
                          <Badge variant="warning">no Dance map</Badge>
                        )}
                      </td>
                      <td className="p-2 text-muted-foreground">{k.action.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="kakOnly">
          <div className="space-y-2">
            {coverage.kakOnly.map((k) => (
              <div key={k.action.id} className="border rounded-md p-3">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-xs">{k.action.id}</div>
                  <div className="font-mono text-xs">{k.action.default}</div>
                </div>
                <div className="text-sm">{k.action.description}</div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="disc">
          <div className="space-y-3">
            {DISCREPANCIES.map((d) => (
              <div key={d.id} className="border rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">{d.kind}</Badge>
                  <span className="font-medium">{d.title}</span>
                </div>
                <div className="text-sm text-muted-foreground lesson-prose">
                  <LessonMarkdown source={d.body} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  {d.kak && <span className="font-mono">kak: {d.kak}</span>}
                  {d.dance && <span className="font-mono">dance: {d.dance}</span>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
