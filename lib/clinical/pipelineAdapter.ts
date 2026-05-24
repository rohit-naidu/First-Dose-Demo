/**
 * Adapts pipeline snapshot + composed plan into UI types used by clinical components.
 * Bridges the science engine output to GeneClinicalProfile, PrescribingPlanSummary, etc.
 */

import { getGeneProfileByMarker } from "@/lib/clinical/geneProfiles";
import { IMPACT_TIER_ORDER } from "@/lib/clinical/severityStyles";
import type {
  CompositeSideEffect,
  GeneClinicalProfile,
  PrescribingPlanSummary,
  VariantTableRow,
} from "@/lib/clinical/types";
import type { ComposedPlan } from "@/lib/planning/types";
import type { PipelineSnapshot, ReconciledSideEffect, SynthesizedGeneProfile } from "@/lib/science/types";

/** Bundle of UI-ready data for the clinical workstation. */
export type ClinicalUiBundle = {
  geneProfiles: GeneClinicalProfile[];
  variants: VariantTableRow[];
  sideEffects: CompositeSideEffect[];
  prescribingPlan: PrescribingPlanSummary;
  molecularSummary: { label: string; value: string }[];
  titrationSchedule: ComposedPlan["titrationSchedule"];
  evidenceChain: ComposedPlan["evidenceChain"];
  hasGenomicData: boolean;
};

/** Map synthesized profile to full GeneClinicalProfile using demo deep-dive templates. */
function toGeneClinicalProfile(synth: SynthesizedGeneProfile): GeneClinicalProfile {
  const template = getGeneProfileByMarker(synth.rsid);
  if (template) {
    return {
      ...template,
      genotype: synth.displayGenotype,
      severity: synth.impactTier,
      interpretation: synth.interpretation,
      mechanism: synth.mechanism,
      source: synth.source,
      sideEffects: synth.sideEffects,
      prescribingActions: synth.prescribingActions,
      contributesTo: synth.contributesTo,
    };
  }

  // Fallback when no static template exists
  return {
    marker: synth.rsid,
    gene: synth.gene,
    genotype: synth.displayGenotype,
    interpretation: synth.interpretation,
    severity: synth.impactTier,
    incidence: "Parsed from patient upload",
    meaning: synth.interpretation,
    mechanism: synth.mechanism,
    source: synth.source,
    sourceDetail: "",
    contributesTo: synth.contributesTo,
    sideEffects: synth.sideEffects,
    prescribingActions: synth.prescribingActions,
    cpic: {
      drugs: ["Retatrutide", "GLP-1/GIP agonists"],
      strength: "Moderate",
      recommendation: synth.interpretation,
      alternatives: [],
    },
    deepDive: {
      assayCall: `Parsed ${synth.displayGenotype} at ${synth.rsid}`,
      populationSignal: synth.mechanism,
      phenotypeCorrelation: synth.interpretation,
      clinicalMeaning: synth.interpretation,
      pkModelEffect: "Included in composite dosing model",
      monitoringPlan: "Per gene-specific prescribing actions",
      evidenceLevel: synth.impactTier,
      incidenceRows: [
        { label: "rsID", value: synth.rsid },
        { label: "Genotype", value: synth.displayGenotype },
      ],
      pathwayRows: [{ label: "Mechanism", value: synth.mechanism }],
      evidenceBullets: [synth.source],
      sourceStack: [synth.source],
    },
  };
}

/** Convert composed plan to PrescribingPlanSummary for ClinicalBrief. */
function toPrescribingPlanSummary(plan: ComposedPlan): PrescribingPlanSummary {
  return {
    molecule: plan.molecule,
    cadence: plan.cadence,
    startingDose: plan.startingDose,
    escalationRule: plan.escalationRule,
    holdCriteria: plan.holdCriteria,
    actionCards: plan.actionCards,
  };
}

function riskLabel(l: CompositeSideEffect["likelihood"]): CompositeSideEffect["riskLabel"] {
  if (l === "High") return "Elevated";
  if (l === "Moderate") return "Monitor";
  return "Low";
}

function reconciledToComposite(effects: ReconciledSideEffect[]): CompositeSideEffect[] {
  return effects.map((e) => ({
    event: e.event,
    likelihood: e.likelihood,
    riskLabel: riskLabel(e.likelihood),
    drivenBy: e.drivenBy.map((d) => ({ gene: d.gene, marker: d.rsid })),
    mechanism: e.mechanism,
    onsetWindow: e.onsetWindow,
  }));
}

/** Main adapter entry — call from case workstation page. */
export function adaptPipelineToUi(
  snapshot: PipelineSnapshot,
  plan: ComposedPlan,
): ClinicalUiBundle {
  const profiles = snapshot.synthesizedProfiles
    .map(toGeneClinicalProfile)
    .sort((a, b) => IMPACT_TIER_ORDER[a.severity] - IMPACT_TIER_ORDER[b.severity]);

  const sideEffects = reconciledToComposite(snapshot.reconciledSideEffects);

  const highCount = profiles.filter((p) => p.severity === "High").length;
  const hasGenomicData = snapshot.panelFoundCount > 0;

  return {
    geneProfiles: profiles,
    variants: profiles.map((p) => ({
      gene: p.gene,
      marker: p.marker,
      genotype: p.genotype,
      clinicalTag: p.interpretation,
      impactTier: p.severity,
    })),
    sideEffects,
    prescribingPlan: toPrescribingPlanSummary(plan),
    molecularSummary: [
      { label: "Panel SNPs found", value: `${snapshot.panelFoundCount}/${snapshot.panelTotal}` },
      { label: "Evidence matches", value: String(snapshot.matchedCount) },
      { label: "High-impact signals", value: String(highCount) },
      { label: "KB version", value: snapshot.kbVersion },
    ],
    titrationSchedule: plan.titrationSchedule,
    evidenceChain: plan.evidenceChain,
    hasGenomicData,
  };
}

/** Filter gene profiles by impact tier for action cards section. */
export function filterActionCardProfiles(profiles: GeneClinicalProfile[]): GeneClinicalProfile[] {
  return profiles.filter((p) => p.severity === "High" || p.severity === "Moderate");
}

export function filterSupportiveProfiles(profiles: GeneClinicalProfile[]): GeneClinicalProfile[] {
  return profiles.filter((p) => p.severity === "Supportive");
}
