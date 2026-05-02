// Coverage analyzer.
// Computes three diff sets used by the Coverage page and inline lesson callouts.

import { DANCE_COMMANDS } from "../data/danceCommands.ts";
import type { DanceCommand } from "../data/danceCommands.ts";
import { KAK_ACTIONS } from "../data/kakReference.ts";
import type { KakAction } from "../data/kakReference.ts";
import { DISCREPANCIES, type Discrepancy } from "../data/discrepancies.ts";
import { findBindingsFor, preferredBinding } from "./findBinding.ts";
import type { ResolvedBinding } from "./types.ts";

export interface DanceCoverageRow {
  command: DanceCommand;
  bound: boolean;
  disabledByUser: boolean;
  binding?: ResolvedBinding;
}

export interface KakCoverageRow {
  action: KakAction;
  /** Closest Dance command, if any. */
  dance?: DanceCommand;
  bound: boolean;
  binding?: ResolvedBinding;
  discrepancies: Discrepancy[];
}

export interface CoverageReport {
  dance: DanceCoverageRow[];
  kak: KakCoverageRow[];
  unboundDance: DanceCoverageRow[];
  kakOnly: KakCoverageRow[];
  discrepancies: Discrepancy[];
  totals: {
    danceTotal: number;
    danceBound: number;
    kakTotal: number;
    kakBound: number;
  };
}

import { DANCE_BY_ID } from "../data/danceCommands.ts";

export function computeCoverage(bindings: readonly ResolvedBinding[]): CoverageReport {
  const dance = DANCE_COMMANDS.map<DanceCoverageRow>((c) => {
    const lookup = findBindingsFor(c.id, bindings);
    const row: DanceCoverageRow = {
      command: c,
      bound: lookup.matches.length > 0,
      disabledByUser: lookup.disabled,
    };
    if (lookup.matches[0]) row.binding = lookup.matches[0];
    return row;
  });

  const discByKak = new Map<string, Discrepancy[]>();
  const discByDance = new Map<string, Discrepancy[]>();
  for (const d of DISCREPANCIES) {
    if (d.kak) {
      const arr = discByKak.get(d.kak) ?? [];
      arr.push(d);
      discByKak.set(d.kak, arr);
    }
    if (d.dance) {
      const arr = discByDance.get(d.dance) ?? [];
      arr.push(d);
      discByDance.set(d.dance, arr);
    }
  }

  const kak = KAK_ACTIONS.map<KakCoverageRow>((k) => {
    // Find Dance command where dance.kak === k.id
    const danceMatch = DANCE_COMMANDS.find((c) => c.kak === k.id);
    const binding = danceMatch ? preferredBinding(danceMatch.id, bindings) : undefined;
    const row: KakCoverageRow = {
      action: k,
      bound: !!binding,
      discrepancies: discByKak.get(k.id) ?? [],
    };
    if (danceMatch) row.dance = danceMatch;
    if (binding) row.binding = binding;
    return row;
  });

  const unboundDance = dance.filter((d) => !d.bound);
  const kakOnly = kak.filter((k) => !k.dance || k.action.danceOnlyMissing);

  return {
    dance,
    kak,
    unboundDance,
    kakOnly,
    discrepancies: DISCREPANCIES.slice(),
    totals: {
      danceTotal: dance.length,
      danceBound: dance.filter((d) => d.bound).length,
      kakTotal: kak.length,
      kakBound: kak.filter((k) => k.bound).length,
    },
  };
}

/** Return the Dance command(s) that map to a given Kak action id. */
export function danceForKak(kakId: string): DanceCommand[] {
  return DANCE_COMMANDS.filter((c) => c.kak === kakId);
}

export { DANCE_BY_ID };
