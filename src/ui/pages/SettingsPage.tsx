import { useStore } from "../../app/store.ts";
import { LAYOUT_OPTIONS } from "../../layout/tables/index.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.tsx";
import { Button } from "../components/ui/button.tsx";

export function SettingsPage() {
  const layout = useStore((s) => s.layout);
  const setOsLayout = useStore((s) => s.setOsLayout);
  const setPrintedLayout = useStore((s) => s.setPrintedLayout);
  const resetProgress = useStore((s) => s.resetProgress);

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tell the app about your keyboard so it can show the right glyphs.
        </p>
      </header>
      <section className="space-y-2">
        <label className="text-sm font-medium">OS keyboard layout</label>
        <Select value={layout.os} onValueChange={(v) => setOsLayout(v as never)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The character your OS produces when you press a key. Most users have QWERTY.
        </p>
      </section>
      <section className="space-y-2">
        <label className="text-sm font-medium">Printed-on-keys layout</label>
        <Select value={layout.printed} onValueChange={(v) => setPrintedLayout(v as never)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          What letters are physically engraved on your keyboard. If you bought a US/EU keyboard and
          never replaced the keycaps, leave this on QWERTY even if your OS uses a different layout.
        </p>
      </section>
      <section>
        <Button variant="outline" onClick={resetProgress}>
          Reset lesson progress
        </Button>
      </section>
    </div>
  );
}
