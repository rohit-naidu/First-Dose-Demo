/**
 * Derives dashboard-level clinical brief data from per-gene profiles.
 * Merges side effects and prescribing actions so clinicians see one coherent story.
 */

import { geneProfiles } from "./geneProfiles";
import { IMPACT_TIER_ORDER, LIKELIHOOD_ORDER } from "./severityStyles";
import type {
  CompositeSideEffect,
  GeneClinicalProfile,
  ImpactTier,
  PrescribingPlanCard,
  PrescribingPlanSummary,
  PrescribingPriority,
  SideEffectLikelihood,
  VariantTableRow,
} from "./types";

function sortByImpactTier(profiles: GeneClinicalProfile[]) {
  return [...profiles].sort(
    (a, b) => IMPACT_TIER_ORDER[a.severity] - IMPACT_TIER_ORDER[b.severity],
  );
}

/** Table rows for Zone A — identified variants. */
export function getIdentifiedVariants(): VariantTableRow[] {
  return sortByImpactTier(geneProfiles).map((p) => ({
    gene: p.gene,
    marker: p.marker,
    genotype: p.genotype,
    clinicalTag: p.interpretation,
    impactTier: p.severity,
  }));
}

function maxLikelihood(
  a: SideEffectLikelihood,
  b: SideEffectLikelihood,
): SideEffectLikelihood {
  return LIKELIHOOD_ORDER[a] <= LIKELIHOOD_ORDER[b] ? a : b;
}

function riskLabelFromLikelihood(l: SideEffectLikelihood): CompositeSideEffect["riskLabel"] {
  if (l === "High") return "Elevated";
  if (l === "Moderate") return "Monitor";
  return "Low";
}

/** Merged adverse-event profile with gene attribution. */
export function getSideEffectProfile(): CompositeSideEffect[] {
  const merged = new Map<string, CompositeSideEffect>();

  for (const profile of geneProfiles) {
    for (const se of profile.sideEffects) {
      const existing = merged.get(se.event);
      const driver = { gene: profile.gene, marker: profile.marker };

      if (!existing) {
        merged.set(se.event, {
          event: se.event,
          likelihood: se.likelihood,
          riskLabel: riskLabelFromLikelihood(se.likelihood),
          drivenBy: [driver],
          mechanism: se.mechanism,
          onsetWindow: se.onsetWindow,
        });
      } else {
        existing.likelihood = maxLikelihood(existing.likelihood, se.likelihood);
        existing.riskLabel = riskLabelFromLikelihood(existing.likelihood);
        if (!existing.drivenBy.some((d) => d.marker === driver.marker)) {
          existing.drivenBy.push(driver);
        }
      }
    }
  }

  return [...merged.values()].sort(
    (a, b) => LIKELIHOOD_ORDER[a.likelihood] - LIKELIHOOD_ORDER[b.likelihood],
  );
}

const PRIORITY_ORDER: Record<PrescribingPriority, number> = {
  Required: 0,
  Recommended: 1,
  Monitor: 2,
};

/** High + Moderate gene profiles for action cards. */
export function getGeneActionCardProfiles(): GeneClinicalProfile[] {
  return sortByImpactTier(geneProfiles).filter(
    (p) => p.severity === "High" || p.severity === "Moderate",
  );
}

/** Supportive genes collapsed in UI. */
export function getSupportiveGeneProfiles(): GeneClinicalProfile[] {
  return geneProfiles.filter((p) => p.severity === "Supportive");
}

/** Top prescribing plan for clinical brief. */
export function getPrescribingPlan(): PrescribingPlanSummary {
  const actionCards: PrescribingPlanCard[] = [
    {
      title: "Molecule",
      detail: "Compounded dual-agonist Tirzepatide (custom formulation)",
      priority: "Required",
      because: [
        { gene: "GIPR", marker: "rs10423928" },
        { gene: "GLP1R", marker: "rs10305492" },
      ],
    },
    {
      title: "Cadence",
      detail: "Split dose Day 1 + Day 4 — bypass standard weekly peak exposure",
      priority: "Required",
      because: [
        { gene: "GLP1R", marker: "rs10305492" },
        { gene: "TCF7L2", marker: "rs7903146" },
        { gene: "PPARG", marker: "rs1801282" },
      ],
    },
    {
      title: "Starting dose",
      detail: "Week 1: 0.10mg + 0.10mg with antiemetic prophylaxis",
      priority: "Required",
      because: [{ gene: "GLP1R", marker: "rs10305492" }],
    },
    {
      title: "Escalation rule",
      detail: "Physician checkpoint before week 5; trend glucose and GI tolerance weekly",
      priority: "Required",
      because: [
        { gene: "TCF7L2", marker: "rs7903146" },
        { gene: "KCNJ11", marker: "rs5219" },
      ],
    },
    {
      title: "Hold criteria",
      detail: "Hold if ALT/AST >2x baseline, severe GI intolerance, or eGFR decline",
      priority: "Required",
      because: [
        { gene: "PNPLA3", marker: "rs738409" },
      ],
    },
  ];

  return {
    molecule: "Compounded Tirzepatide (dual-agonist)",
    cadence: "4-day split cadence (Day 1 + Day 4)",
    startingDose: "0.10mg + 0.10mg Week 1",
    escalationRule: "Adaptive titration with physician sign-off before week 5",
    holdCriteria: "ALT/AST >2x baseline, severe nausea/vomiting, eGFR decline",
    actionCards,
  };
}

/** Flat list of required prescribing actions across genes (deduped by action text). */
export function getMergedPrescribingActions(): {
  action: string;
  priority: PrescribingPriority;
  because: { gene: string; marker: string }[];
}[] {
  const seen = new Map<
    string,
    { action: string; priority: PrescribingPriority; because: { gene: string; marker: string }[] }
  >();

  for (const profile of sortByImpactTier(geneProfiles)) {
    for (const pa of profile.prescribingActions) {
      const existing = seen.get(pa.action);
      const driver = { gene: profile.gene, marker: profile.marker };
      if (!existing) {
        seen.set(pa.action, {
          action: pa.action,
          priority: pa.priority,
          because: [driver],
        });
      } else {
        if (PRIORITY_ORDER[pa.priority] < PRIORITY_ORDER[existing.priority]) {
          existing.priority = pa.priority;
        }
        if (!existing.because.some((b) => b.marker === driver.marker)) {
          existing.because.push(driver);
        }
      }
    }
  }

  return [...seen.values()].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export function countByTier(tier: ImpactTier): number {
  return geneProfiles.filter((p) => p.severity === tier).length;
}
