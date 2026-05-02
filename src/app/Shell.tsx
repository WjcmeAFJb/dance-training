import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useStore } from "./store.ts";
import { BookOpenText, Flag, KeyRound, Settings, Upload, Map as MapIcon } from "lucide-react";
import { cn } from "../ui/lib/utils.ts";
import { Badge } from "../ui/components/ui/badge.tsx";
import { Clippy } from "../ui/components/Clippy.tsx";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[260px_1fr] h-full">
      <Sidebar />
      <main className="overflow-y-auto p-6">{children}</main>
    </div>
  );
}

function Sidebar() {
  const [loc] = useLocation();
  const bindings = useStore((s) => s.bindings);
  const coverage = useStore((s) => s.coverage);
  return (
    <aside className="border-r bg-card/30 flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <Clippy size={36} state="idle" />
        <div className="leading-tight">
          <div className="font-semibold">Dance Training</div>
          <div className="text-xs text-muted-foreground">Kakoune, your way.</div>
        </div>
      </div>
      <nav className="px-2 flex flex-col gap-0.5 text-sm">
        <NavItem href="/" current={loc} icon={<BookOpenText className="h-4 w-4" />} label="Home" />
        <NavItem
          href="/upload"
          current={loc}
          icon={<Upload className="h-4 w-4" />}
          label="Keybindings"
          right={
            bindings.length ? (
              <Badge variant="success" className="ml-auto">
                {bindings.length}
              </Badge>
            ) : (
              <Badge variant="warning" className="ml-auto">
                upload
              </Badge>
            )
          }
        />
        <NavItem
          href="/coverage"
          current={loc}
          icon={<MapIcon className="h-4 w-4" />}
          label="Coverage"
          right={
            coverage ? (
              <Badge variant="secondary" className="ml-auto">
                {coverage.totals.danceBound}/{coverage.totals.danceTotal}
              </Badge>
            ) : null
          }
        />
        <NavItem
          href="/lessons"
          current={loc}
          icon={<KeyRound className="h-4 w-4" />}
          label="Lessons"
        />
        <NavItem href="/golf" current={loc} icon={<Flag className="h-4 w-4" />} label="Vim Golf" />
        <NavItem
          href="/settings"
          current={loc}
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
        />
      </nav>
      <div className="mt-auto p-3 text-xs text-muted-foreground">
        <a
          href="https://github.com/mawww/kakoune"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          About Kakoune
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/71/dance"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Dance
        </a>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  current,
  icon,
  label,
  right,
}: {
  href: string;
  current: string;
  icon: ReactNode;
  label: string;
  right?: ReactNode;
}) {
  const active = current === href || current.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-secondary",
        active && "bg-secondary text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
      {right}
    </Link>
  );
}
