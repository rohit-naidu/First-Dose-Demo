/**
 * Plan composer — merges pipeline triggers + plan-rules.json into a final Rx plan.
 */

import planRules from "./rules/plan-rules.json";
import type { ComposedPlan, PlanActionCard } from "./types";
import type { PipelineSnapshot } from "../science/types";

type MoleculeTemplate = {
  label: string;
  fallbackCadence: string;
  fallbackStartingDose: string;
  fallbackEscalation: string;
  fallbackHold: string;
};

/**
 * Compose a prescription plan from a pipeline snapshot.
 * Picks highest-weight trigger per category; falls back to plan-rules defaults.
 */
export function composePlan(snapshot: PipelineSnapshot): ComposedPlan {
  const drug = snapshot.drug || planRules.defaultDrug;
  const template = (planRules.moleculeTemplates as Record<string, MoleculeTemplate>)[drug] ??
    (planRules.moleculeTemplates as Record<string, MoleculeTemplate>).retatrutide;

  const categoryLabels = planRules.categoryLabels as Record<string, string>;

  // Pick best trigger per category by weight
  const byCategory = new Map<string, (typeof snapshot.planTriggers)[0]>();
  for (const trigger of snapshot.planTriggers) {
    const existing = byCategory.get(trigger.category);
    if (!existing || trigger.weight > existing.weight) {
      byCategory.set(trigger.category, trigger);
    }
  }

  const actionCards: PlanActionCard[] = [];

  for (const [category, label] of Object.entries(categoryLabels)) {
    const trigger = byCategory.get(category);
    if (trigger) {
      actionCards.push({
        title: label,
        detail: trigger.detail,
        priority: trigger.priority,
        because: trigger.because.map((b) => ({ gene: b.gene, marker: b.rsid })),
      });
    }
  }

  // Ensure core cards exist even if no trigger fired
  if (!byCategory.has("molecule")) {
    actionCards.unshift({
      title: "Molecule",
      detail: template.label,
      priority: "Required",
      because: [],
    });
  }
  if (!byCategory.has("cadence")) {
    actionCards.push({
      title: "Cadence",
      detail: template.fallbackCadence,
      priority: "Required",
      because: [],
    });
  }
  if (!byCategory.has("dose")) {
    actionCards.push({
      title: "Starting dose",
      detail: template.fallbackStartingDose,
      priority: "Required",
      because: [],
    });
  }
  if (!byCategory.has("escalation")) {
    actionCards.push({
      title: "Escalation rule",
      detail: template.fallbackEscalation,
      priority: "Required",
      because: [],
    });
  }
  if (!byCategory.has("hold")) {
    actionCards.push({
      title: "Hold criteria",
      detail: template.fallbackHold,
      priority: "Required",
      because: [],
    });
  }

  const moleculeTrigger = byCategory.get("molecule");
  const cadenceTrigger = byCategory.get("cadence");
  const doseTrigger = byCategory.get("dose");
  const escalationTrigger = byCategory.get("escalation");
  const holdTrigger = byCategory.get("hold");

  return {
    composedAt: new Date().toISOString(),
    drug,
    molecule: moleculeTrigger?.detail ?? template.label,
    cadence: cadenceTrigger?.detail ?? template.fallbackCadence,
    startingDose: doseTrigger?.detail ?? template.fallbackStartingDose,
    escalationRule: escalationTrigger?.detail ?? template.fallbackEscalation,
    holdCriteria: holdTrigger?.detail ?? template.fallbackHold,
    actionCards,
    titrationSchedule: planRules.titrationWeeks,
    evidenceChain: [
      { stage: "Parse", summary: "Panel SNPs extracted from file", count: snapshot.panelFoundCount },
      { stage: "Annotate", summary: "Gene symbols assigned", count: snapshot.annotatedVariants.length },
      { stage: "Match KB", summary: `Evidence KB v${snapshot.kbVersion}`, count: snapshot.matchedCount },
      {
        stage: "Synthesize",
        summary: "Side effects merged with reported symptoms",
        count: snapshot.reconciledSideEffects.length,
      },
      { stage: "Plan triggers", summary: "Rx triggers emitted", count: snapshot.planTriggers.length },
    ],
  };
}
