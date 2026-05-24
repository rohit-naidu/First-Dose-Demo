/**
 * Stage 3 — Match annotated variants against the evidence knowledge base.
 */

import { loadEvidenceKb } from "./loader";
import type { AnnotatedVariant, ConfidenceTier, EvidenceMatch } from "../types";

function confidenceFromTier(tier: "High" | "Moderate" | "Supportive"): ConfidenceTier {
  if (tier === "High") return "Supported";
  if (tier === "Moderate") return "Supported";
  return "Exploratory";
}

/**
 * Join annotated variants with KB entries by rsid.
 * Only panel SNPs with a KB row produce evidence matches.
 */
export function matchEvidence(annotated: AnnotatedVariant[]): EvidenceMatch[] {
  const kb = loadEvidenceKb();
  const matches: EvidenceMatch[] = [];

  for (const variant of annotated) {
    const entry = kb.entries.find((e) => e.rsid === variant.rsid);
    if (!entry) continue;

    const topSe = entry.sideEffects[0];

    matches.push({
      rsid: variant.rsid,
      gene: entry.gene,
      genotype: variant.genotype,
      displayGenotype: variant.displayGenotype,
      impactTier: entry.impactTier,
      confidence: confidenceFromTier(entry.impactTier),
      interpretation: entry.interpretation,
      mechanism: entry.mechanism,
      source: entry.source,
      contributesTo: entry.contributesTo,
      evidenceId: entry.id,
      kbVersion: kb.version,
      primarySideEffect: topSe?.event,
      primaryLikelihood: topSe?.likelihood,
    });
  }

  return matches;
}
