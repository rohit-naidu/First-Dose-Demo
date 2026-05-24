/**
 * Types for the 5-stage science engine pipeline.
 * Stages: parse → annotate → match evidence → synthesize side effects → plan triggers.
 */

/** Raw variant row extracted from a 23andMe-style file. */
export type ParsedVariant = {
  rsid: string;
  chromosome: string;
  position: string;
  genotype: string;
};

/** One row in the fixed 8-SNP panel — includes missing loci. */
export type PanelRow = {
  rsid: string;
  gene: string;
  chromosome: string;
  position: string;
  genotype: string;
  displayGenotype: string;
  status: "found" | "not_on_chip" | "no_call";
};

export type ConfidenceTier = "Established" | "Supported" | "Exploratory" | "Needs review";

/** Variant after gene/chromosome annotation step. */
export type AnnotatedVariant = ParsedVariant & {
  gene: string;
  /** Human-readable genotype like G/G or A/T. */
  displayGenotype: string;
  annotationSource: "kb" | "ensembl" | "unknown";
  variantLabel?: string;
  populationNote?: string;
};

/** One evidence KB entry matched to a variant. */
export type EvidenceMatch = {
  rsid: string;
  gene: string;
  genotype: string;
  displayGenotype: string;
  impactTier: "High" | "Moderate" | "Supportive";
  confidence: ConfidenceTier;
  interpretation: string;
  mechanism: string;
  source: string;
  contributesTo: string[];
  evidenceId: string;
  kbVersion: string;
  /** Top side-effect association for evidence chain cards. */
  primarySideEffect?: string;
  primaryLikelihood?: "High" | "Moderate" | "Low";
};

/** Stage 4 — merged genetic + reported side effect row. */
export type ReconciledSideEffect = {
  event: string;
  likelihood: "High" | "Moderate" | "Low";
  reported: boolean;
  reportedSeverity?: string;
  reconciliationLabel: "Concordant" | "Symptom-led" | "Genetic monitor" | "Low";
  planPriority: "High" | "Moderate" | "Low";
  mechanism: string;
  onsetWindow: string;
  drivenBy: { gene: string; rsid: string }[];
};

/** Synthesized clinical profile after side-effect merge stage. */
export type SynthesizedGeneProfile = {
  rsid: string;
  gene: string;
  genotype: string;
  displayGenotype: string;
  impactTier: "High" | "Moderate" | "Supportive";
  interpretation: string;
  mechanism: string;
  source: string;
  contributesTo: string[];
  sideEffects: {
    event: string;
    likelihood: "High" | "Moderate" | "Low";
    mechanism: string;
    onsetWindow: string;
  }[];
  prescribingActions: {
    action: string;
    rationale: string;
    priority: "Required" | "Recommended" | "Monitor";
  }[];
};

/** Trigger emitted for the plan composer (cadence, dose, monitoring, etc.). */
export type PlanTrigger = {
  triggerId: string;
  category: "molecule" | "cadence" | "dose" | "escalation" | "monitoring" | "hold";
  detail: string;
  priority: "Required" | "Recommended" | "Monitor";
  because: { gene: string; rsid: string }[];
  weight: number;
};

/** Full output snapshot stored on the case after pipeline run. */
export type PipelineSnapshot = {
  runAt: string;
  kbVersion: string;
  panelRsids: string[];
  parsedCount: number;
  matchedCount: number;
  panelFoundCount: number;
  panelTotal: number;
  totalRsLinesInFile: number;
  fileLooksValid: boolean;
  panelRows: PanelRow[];
  parsedVariants: ParsedVariant[];
  annotatedVariants: AnnotatedVariant[];
  evidenceMatches: EvidenceMatch[];
  synthesizedProfiles: SynthesizedGeneProfile[];
  reconciledSideEffects: ReconciledSideEffect[];
  planTriggers: PlanTrigger[];
  drug: string;
};

/** Options passed into the pipeline runner. */
export type PipelineOptions = {
  drug?: string;
  /** When true, attempt Ensembl REST lookup for unknown rsids (best-effort). */
  useEnsembl?: boolean;
  intake?: {
    bmi?: number;
    eGFR?: string;
    altAst?: string;
    reportedSideEffects?: import("@/lib/cases/types").ReportedSideEffect[];
  };
};
