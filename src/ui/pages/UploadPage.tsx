import { useState } from "react";
import { useStore } from "../../app/store.ts";
import { parseUserKeybindings } from "../../bindings/parseKeybindings.ts";
import { Button } from "../components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import { Badge } from "../components/ui/badge.tsx";

export function UploadPage() {
  const setBindings = useStore((s) => s.setBindings);
  const clearBindings = useStore((s) => s.clearBindings);
  const bindings = useStore((s) => s.bindings);
  const errors = useStore((s) => s.bindingsErrors);
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = async (text: string) => {
    setError(null);
    setBusy(true);
    try {
      const result = await parseUserKeybindings(text);
      setBindings(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    await apply(text);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Your Dance keybindings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Drop your VS Code <code>keybindings.json</code>, or paste it. We parse it locally —
          nothing is uploaded.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload from disk</CardTitle>
          <CardDescription>
            VS Code → <em>Preferences: Open Keyboard Shortcuts (JSON)</em> → save the file → drop it
            here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept="application/json,.json,.jsonc,application/jsonc"
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await onFile(f);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Or paste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            className="w-full min-h-[160px] font-mono text-xs rounded-md border bg-background p-3 outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Paste your keybindings.json here…"
          />
          <div className="flex gap-2">
            <Button onClick={() => apply(pasted)} disabled={busy || !pasted.trim()}>
              Parse pasted JSON
            </Button>
            {bindings.length > 0 && (
              <Button variant="outline" onClick={clearBindings}>
                Forget my bindings
              </Button>
            )}
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
        </CardContent>
      </Card>

      {bindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Loaded{" "}
              <Badge variant="success" className="ml-2">
                {bindings.length} bindings
              </Badge>
              {errors.length > 0 && (
                <Badge variant="warning" className="ml-2">
                  {errors.length} errors
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stored in your browser only.</CardDescription>
          </CardHeader>
          {errors.length > 0 && (
            <CardContent className="space-y-1 text-xs font-mono">
              {errors.slice(0, 8).map((e, i) => (
                <div key={i} className="text-destructive">
                  #{e.index}: {e.message}
                </div>
              ))}
              {errors.length > 8 && (
                <div className="text-muted-foreground">…{errors.length - 8} more</div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
