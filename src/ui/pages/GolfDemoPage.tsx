import { Link, useParams } from "wouter";
import { findDemo } from "../../lessons/golf/catalog.ts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx";

export function GolfDemoPage() {
  const params = useParams<{ id: string }>();
  const demo = findDemo(params.id);
  if (!demo) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-muted-foreground">
        Demo not found.{" "}
        <Link className="text-primary underline" href="/golf">
          Back to golf.
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Vim Golf — {demo.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Original Kakoune solution: <code>{demo.cmd}</code> ({demo.length} keys).
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="font-mono text-xs whitespace-pre-wrap">{demo.input}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expected output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="font-mono text-xs whitespace-pre-wrap">{demo.output}</pre>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Solution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <code className="block bg-secondary p-2 rounded">{demo.cmd}</code>
          <p className="text-muted-foreground">
            This is the Kakoune-canonical keystroke sequence. To run it in Dance with your bindings,
            see the &ldquo;Translate&rdquo; tab inside lesson{" "}
            <Link href="/lessons/99-golf/00-orientation" className="text-primary underline">
              99-golf/00-orientation
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
