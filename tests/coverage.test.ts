import { describe, expect, it } from "vitest";
import { computeCoverage } from "@/bindings/coverage.ts";
import { parseUserKeybindings } from "@/bindings/parseKeybindings.ts";

const SAMPLE = `[
  { "key": "[KeyT]", "command": "dance.seek" },
  { "key": "[KeyW]", "command": "dance.seek.word" },
  { "key": "[KeyD]", "command": "dance.edit.yank-delete" }
]`;

describe("computeCoverage", () => {
  it("reports bound vs unbound counts", async () => {
    const { bindings } = await parseUserKeybindings(SAMPLE);
    const cov = computeCoverage(bindings);
    expect(cov.totals.danceTotal).toBeGreaterThan(50);
    expect(cov.totals.danceBound).toBeGreaterThanOrEqual(3);
    expect(cov.unboundDance.length).toBeGreaterThan(0);
  });

  it("flags Kak actions without Dance equivalents", async () => {
    const { bindings } = await parseUserKeybindings(SAMPLE);
    const cov = computeCoverage(bindings);
    expect(cov.kakOnly.length).toBeGreaterThan(0);
  });
});
