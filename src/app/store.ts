// Single Zustand store. We persist user preferences and the parsed bindings
// to localStorage so the user doesn't re-upload on every visit.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResolvedBinding } from "../bindings/types.ts";
import type { ParseResult } from "../bindings/parseKeybindings.ts";
import { computeCoverage, type CoverageReport } from "../bindings/coverage.ts";
import { DEFAULT_LAYOUT_PREFS, type LayoutId, type UserLayoutPrefs } from "../layout/types.ts";

export interface AppStore {
  bindings: ResolvedBinding[];
  bindingsDigest?: string;
  bindingsErrors: ParseResult["errors"];
  coverage?: CoverageReport;
  layout: UserLayoutPrefs;
  /** Lesson progression: lessonId → "completed" | "in-progress" | undefined */
  progress: Record<string, "completed" | "in-progress">;
  setBindings: (result: ParseResult) => void;
  clearBindings: () => void;
  setLayout: (l: Partial<UserLayoutPrefs>) => void;
  setOsLayout: (id: LayoutId) => void;
  setPrintedLayout: (id: LayoutId) => void;
  markLessonComplete: (id: string) => void;
  resetProgress: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      bindings: [],
      bindingsErrors: [],
      layout: DEFAULT_LAYOUT_PREFS,
      progress: {},
      setBindings: (result) =>
        set(() => ({
          bindings: result.bindings,
          bindingsDigest: result.digest,
          bindingsErrors: result.errors,
          coverage: computeCoverage(result.bindings),
        })),
      clearBindings: () =>
        set((s) => {
          const { bindingsDigest: _digest, coverage: _cov, ...rest } = s;
          return { ...rest, bindings: [], bindingsErrors: [] };
        }),
      setLayout: (l) => set((s) => ({ layout: { ...s.layout, ...l } })),
      setOsLayout: (id) => set((s) => ({ layout: { ...s.layout, os: id } })),
      setPrintedLayout: (id) => set((s) => ({ layout: { ...s.layout, printed: id } })),
      markLessonComplete: (id) => set((s) => ({ progress: { ...s.progress, [id]: "completed" } })),
      resetProgress: () => set(() => ({ progress: {} })),
    }),
    {
      name: "dance-training:v1",
      partialize: (s) => ({
        bindings: s.bindings,
        bindingsDigest: s.bindingsDigest,
        bindingsErrors: s.bindingsErrors,
        layout: s.layout,
        progress: s.progress,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.bindings && state.bindings.length) {
          state.coverage = computeCoverage(state.bindings);
        }
      },
    },
  ),
);

export const selectHasBindings = (s: AppStore): boolean => s.bindings.length > 0;
