/**
 * Stage 4 — Synthesize per-gene side effects and prescribing actions from evidence matches.
 */

import { getKbEntryByRsid } from "../evidence/loader";
import type { EvidenceMatch, SynthesizedGeneProfile } from "../types";

/**
 * Build one synthesized profile per matched variant.
 * Side effects and actions come directly from the KB entry for that rsid.
 */
export function synthesizeSideEffects(matches: EvidenceMatch[]): SynthesizedGeneProfile[] {
  return matches.map((match) => {
    const entry = getKbEntryByRsid(match.rsid);
    return {
      rsid: match.rsid,
      gene: match.gene,
      genotype: match.genotype,
      displayGenotype: match.displayGenotype,
      impactTier: match.impactTier,
      interpretation: match.interpretation,
      mechanism: match.mechanism,
      source: match.source,
      contributesTo: match.contributesTo,
      sideEffects: entry?.sideEffects ?? [],
      prescribingActions: entry?.prescribingActions ?? [],
    };
  });
}

/** Merge side effects across genes for composite dashboard view. */
export function mergeCompositeSideEffects(profiles: SynthesizedGeneProfile[]) {
  const merged = new Map<
    string,
    {
      event: string;
      likelihood: "High" | "Moderate" | "Low";
      drivenBy: { gene: string; rsid: string }[];
      mechanism: string;
      onsetWindow: string;
    }
  >();

  const order = { High: 0, Moderate: 1, Low: 2 };

  for (const profile of profiles) {
    for (const se of profile.sideEffects) {
      const existing = merged.get(se.event);
      const driver = { gene: profile.gene, rsid: profile.rsid };
      if (!existing) {
        merged.set(se.event, { ...se, drivenBy: [driver] });
      } else {
        if (order[se.likelihood] < order[existing.likelihood]) {
          existing.likelihood = se.likelihood;
        }
        if (!existing.drivenBy.some((d) => d.rsid === driver.rsid)) {
          existing.drivenBy.push(driver);
        }
      }
    }
  }

  return [...merged.values()].sort((a, b) => order[a.likelihood] - order[b.likelihood]);
}
