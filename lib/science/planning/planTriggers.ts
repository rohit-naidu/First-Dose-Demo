/**
 * Stage 5 — Emit plan triggers from synthesized profiles + intake context.
 * Triggers are consumed by lib/planning/composer.ts to build the final Rx plan.
 */

import { getKbEntryByRsid } from "../evidence/loader";
import type { PlanTrigger, SynthesizedGeneProfile } from "../types";

type IntakeContext = {
  bmi?: number;
  eGFR?: string;
  altAst?: string;
};

/**
 * Collect plan triggers from KB entries for each matched profile.
 * De-duplicates by triggerId and attaches gene attribution.
 */
export function planTriggers(
  profiles: SynthesizedGeneProfile[],
  drug: string,
  intake?: IntakeContext,
): PlanTrigger[] {
  const triggerMap = new Map<string, PlanTrigger>();

  for (const profile of profiles) {
    const entry = getKbEntryByRsid(profile.rsid);
    if (!entry) continue;

    for (const t of entry.planTriggers) {
      const existing = triggerMap.get(t.triggerId);
      const because = { gene: profile.gene, rsid: profile.rsid };
      if (!existing) {
        triggerMap.set(t.triggerId, {
          triggerId: t.triggerId,
          category: t.category,
          detail: t.detail,
          priority: t.priority,
          because: [because],
          weight: t.weight,
        });
      } else {
        if (!existing.because.some((b) => b.rsid === because.rsid)) {
          existing.because.push(because);
        }
        existing.weight = Math.max(existing.weight, t.weight);
      }
    }
  }

  // Intake-based triggers (non-genomic modifiers)
  if (intake?.bmi && intake.bmi >= 30) {
    triggerMap.set("bmi_obesity_context", {
      triggerId: "bmi_obesity_context",
      category: "monitoring",
      detail: "Enhanced metabolic monitoring given BMI ≥30",
      priority: "Recommended",
      because: [],
      weight: 3,
    });
  }

  if (intake?.eGFR?.includes("74") || intake?.eGFR?.toLowerCase().includes("decreased")) {
    triggerMap.set("renal_clearance_adjust", {
      triggerId: "renal_clearance_adjust",
      category: "monitoring",
      detail: "Adjust clearance model for mildly decreased eGFR",
      priority: "Monitor",
      because: [],
      weight: 4,
    });
  }

  // Default molecule trigger if none fired
  if (![...triggerMap.values()].some((t) => t.category === "molecule")) {
    triggerMap.set("default_retatrutide", {
      triggerId: "default_retatrutide",
      category: "molecule",
      detail: `Retatrutide (${drug}) — default triple-agonist for this program`,
      priority: "Required",
      because: [],
      weight: 5,
    });
  }

  return [...triggerMap.values()].sort((a, b) => b.weight - a.weight);
}
