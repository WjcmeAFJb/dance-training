import { Link } from "wouter";
import { useStore } from "../../app/store.ts";
import { Clippy } from "../components/Clippy.tsx";
import { Button } from "../components/ui/button.tsx";

export function HomePage() {
  const bindings = useStore((s) => s.bindings);
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <header className="flex items-start gap-6">
        <Clippy size={140} state="cheering" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dance Training</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            An interactive Kakoune tutor that adapts to your VS Code Dance keybindings. Upload your{" "}
            <code>keybindings.json</code> and every lesson, hint, and key chip is rendered for the
            keys <em>you</em> use — accounting for your OS layout and what's printed on your
            physical keyboard.
          </p>
        </div>
      </header>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Get started</h2>
        <ol className="list-decimal pl-6 space-y-1 text-sm">
          <li>
            <Link href="/upload" className="text-primary underline">
              Upload your <code>keybindings.json</code>
            </Link>{" "}
            (or skip — we'll use Kakoune defaults).
          </li>
          <li>
            <Link href="/settings" className="text-primary underline">
              Tell us about your keyboard
            </Link>{" "}
            (OS layout + what's printed on the keys).
          </li>
          <li>
            <Link href="/lessons" className="text-primary underline">
              Pick a lesson folder
            </Link>{" "}
            and let Clippy walk you through it.
          </li>
        </ol>
        {bindings.length > 0 && (
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/lessons">Continue learning</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/coverage">See coverage</Link>
            </Button>
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What you'll get</h2>
        <ul className="grid gap-2 text-sm">
          <li>
            <strong>Adaptive key chips.</strong> Every shortcut shows the canonical Kak letter,
            what's printed on your keyboard, and what your OS layout produces — side by side when
            they differ.
          </li>
          <li>
            <strong>Coverage report.</strong> See which Dance commands you haven't bound, and which
            Kak commands have no Dance equivalent.
          </li>
          <li>
            <strong>Discrepancy callouts.</strong> Lessons surface where Dance behaves differently
            from Kakoune — pipes, registers, syntax objects, line numbers.
          </li>
          <li>
            <strong>Vim-Golf demos.</strong> Watch real Kakoune solutions to vimgolf challenges,
            then try them yourself.
          </li>
          <li>
            <strong>Installable.</strong> Add to your home screen — works offline.
          </li>
        </ul>
      </section>
    </div>
  );
}
