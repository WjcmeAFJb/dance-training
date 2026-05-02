import { Suspense } from "react";
import { Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Router } from "wouter";
import { Shell } from "./Shell.tsx";
import { HomePage } from "@/ui/pages/HomePage.tsx";
import { UploadPage } from "@/ui/pages/UploadPage.tsx";
import { CoveragePage } from "@/ui/pages/CoveragePage.tsx";
import { LessonsIndexPage } from "@/ui/pages/LessonsIndexPage.tsx";
import { LessonPage } from "@/ui/pages/LessonPage.tsx";
import { GolfIndexPage } from "@/ui/pages/GolfIndexPage.tsx";
import { GolfDemoPage } from "@/ui/pages/GolfDemoPage.tsx";
import { SettingsPage } from "@/ui/pages/SettingsPage.tsx";

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Shell>
        <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/upload" component={UploadPage} />
            <Route path="/coverage" component={CoveragePage} />
            <Route path="/lessons" component={LessonsIndexPage} />
            <Route path="/lessons/:folder/:id" component={LessonPage} />
            <Route path="/golf" component={GolfIndexPage} />
            <Route path="/golf/:id" component={GolfDemoPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route>
              <div className="p-8 text-muted-foreground">Page not found.</div>
            </Route>
          </Switch>
        </Suspense>
      </Shell>
    </Router>
  );
}
