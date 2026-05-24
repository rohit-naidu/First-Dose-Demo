/**
 * Shared clinical types for the First Dose genomic CDS dashboard.
 * These types separate "what we found" from "what to do about it" for clinicians.
 */

/** How strongly a variant influences the dosing model. */
export type ImpactTier = "High" | "Moderate" | "Supportive";

/** Likelihood label for a predicted adverse event. */
export type SideEffectLikelihood = "High" | "Moderate" | "Low";

/** Priority for a prescribing action on the care plan. */
export type PrescribingPriority = "Required" | "Recommended" | "Monitor";

/** CPIC-style strength of pharmacogenomic recommendation. */
export type CpicStrength = "Strong" | "Moderate" | "Optional";

/** Core variant row parsed from genomic intake. */
export type GeneFinding = {
  marker: string;
  gene: string;
  genotype: string;
  interpretation: string;
  severity: ImpactTier;
  incidence: string;
  meaning: string;
  mechanism: string;
  source: string;
  sourceDetail: string;
};

/** Per-gene adverse event prediction shown on action cards and composite panel. */
export type SideEffectRisk = {
  event: string;
  likelihood: SideEffectLikelihood;
  mechanism: string;
  onsetWindow: string;
};

/** Imperative prescribing step tied to a variant. */
export type PrescribingAction = {
  action: string;
  rationale: string;
  priority: PrescribingPriority;
};

/** Formal pharmacogenomics recommendation block (CPIC-style). */
export type CpicRecommendation = {
  drugs: string[];
  strength: CpicStrength;
  recommendation: string;
  alternatives: string[];
};

/** Extended science content opened in the gene drill-down modal. */
export type GeneDeepDiveReport = {
  assayCall: string;
  populationSignal: string;
  phenotypeCorrelation: string;
  clinicalMeaning: string;
  pkModelEffect: string;
  monitoringPlan: string;
  evidenceLevel: string;
  incidenceRows: { label: string; value: string }[];
  pathwayRows: { label: string; value: string }[];
  evidenceBullets: string[];
  sourceStack: string[];
};

/** Full clinical profile for one variant — drives cards, synthesis, and modal. */
export type GeneClinicalProfile = GeneFinding & {
  deepDive: GeneDeepDiveReport;
  sideEffects: SideEffectRisk[];
  prescribingActions: PrescribingAction[];
  cpic: CpicRecommendation;
  /** Keys used to merge composite side-effect and plan panels (e.g. "nausea_risk"). */
  contributesTo: string[];
};

/** Row for the identified-variants table in the clinical brief. */
export type VariantTableRow = {
  gene: string;
  marker: string;
  genotype: string;
  clinicalTag: string;
  impactTier: ImpactTier;
};

/** One adverse event after merging across genes. */
export type CompositeSideEffect = {
  event: string;
  likelihood: SideEffectLikelihood;
  riskLabel: "Elevated" | "Monitor" | "Low";
  drivenBy: { gene: string; marker: string }[];
  mechanism: string;
  onsetWindow: string;
};

/** Top-level prescribing action card on the dashboard. */
export type PrescribingPlanCard = {
  title: string;
  detail: string;
  priority: PrescribingPriority;
  because: { gene: string; marker: string }[];
};

/** Summary prescribing plan for Zone A. */
export type PrescribingPlanSummary = {
  molecule: string;
  cadence: string;
  startingDose: string;
  escalationRule: string;
  holdCriteria: string;
  actionCards: PrescribingPlanCard[];
};

export type ChartPoint = {
  week: string;
  standard: number;
  optimized: number;
};

export type TitrationWeek = {
  week: string;
  cadence: string;
  dose: string;
  support: string;
};

export type MetabolicMarker = {
  label: string;
  value: string;
  status: string;
};
