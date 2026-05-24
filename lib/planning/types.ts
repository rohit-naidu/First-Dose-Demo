/**
 * Prescription plan types produced by the plan composer.
 */

export type PlanActionCard = {
  title: string;
  detail: string;
  priority: "Required" | "Recommended" | "Monitor";
  because: { gene: string; marker: string }[];
};

/** Full composed prescription plan stored on the case. */
export type ComposedPlan = {
  composedAt: string;
  drug: string;
  molecule: string;
  cadence: string;
  startingDose: string;
  escalationRule: string;
  holdCriteria: string;
  actionCards: PlanActionCard[];
  titrationSchedule: {
    week: string;
    cadence: string;
    dose: string;
    support: string;
  }[];
  evidenceChain: {
    stage: string;
    summary: string;
    count?: number;
  }[];
};
