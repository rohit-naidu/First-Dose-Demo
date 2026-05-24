/**
 * Stage 4b — Reconcile genetic side-effect predictions with reported intake symptoms.
 */

import type { ReportedSideEffect } from "@/lib/cases/types";
import type { ReconciledSideEffect, SynthesizedGeneProfile } from "../types";
import { mergeCompositeSideEffects } from "./sideEffects";

const LIKELIHOOD_ORDER = { High: 0, Moderate: 1, Low: 2 };

/** Normalize symptom strings for fuzzy matching. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** True when reported symptom plausibly matches a genetic event label. */
function symptomsMatch(reported: string, event: string): boolean {
  const a = norm(reported);
  const b = norm(event);
  if (a.includes(b) || b.includes(a)) return true;
  const keywords = ["nausea", "vomit", "constipation", "diarrhea", "hypogly", "fatigue", "satiety", "gi", "hepatic", "liver"];
  return keywords.some((k) => a.includes(k) && b.includes(k));
}

function planPriorityFrom(
  reported: boolean,
  likelihood: ReconciledSideEffect["likelihood"],
  hasGenetic: boolean,
): ReconciledSideEffect["planPriority"] {
  if (reported && hasGenetic) return "High";
  if (reported) return "High";
  if (likelihood === "High" || likelihood === "Moderate") return "Moderate";
  return "Low";
}

function reconciliationLabel(
  reported: boolean,
  hasGenetic: boolean,
): ReconciledSideEffect["reconciliationLabel"] {
  if (reported && hasGenetic) return "Concordant";
  if (reported) return "Symptom-led";
  if (hasGenetic) return "Genetic monitor";
  return "Low";
}

/**
 * Merge genetic predictions with clinician-entered reported side effects.
 */
export function reconcileSideEffects(
  profiles: SynthesizedGeneProfile[],
  reported: ReportedSideEffect[] = [],
): ReconciledSideEffect[] {
  const genetic = mergeCompositeSideEffects(profiles);
  const byEvent = new Map<string, ReconciledSideEffect>();

  for (const g of genetic) {
    const match = reported.find((r) => symptomsMatch(r.symptom, g.event));
    byEvent.set(g.event, {
      event: g.event,
      likelihood: g.likelihood,
      reported: Boolean(match),
      reportedSeverity: match?.severity,
      reconciliationLabel: reconciliationLabel(Boolean(match), true),
      planPriority: planPriorityFrom(Boolean(match), g.likelihood, true),
      mechanism: g.mechanism,
      onsetWindow: g.onsetWindow,
      drivenBy: g.drivenBy,
    });
  }

  for (const r of reported) {
    const already = [...byEvent.values()].some((e) => symptomsMatch(r.symptom, e.event));
    if (already) continue;

    byEvent.set(r.symptom, {
      event: r.symptom,
      likelihood: "Moderate",
      reported: true,
      reportedSeverity: r.severity,
      reconciliationLabel: "Symptom-led",
      planPriority: "High",
      mechanism: "Reported at intake; no matching variant in GLP-1 panel",
      onsetWindow: "Per patient report",
      drivenBy: [],
    });
  }

  return [...byEvent.values()].sort(
    (a, b) => LIKELIHOOD_ORDER[a.likelihood] - LIKELIHOOD_ORDER[b.likelihood],
  );
}
