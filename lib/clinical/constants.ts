/**
 * Static demo constants: PK curve, titration schedule, biomarkers, citations.
 * Kept separate from gene profiles so clinical narrative data stays in one place.
 */

import type { ChartPoint, MetabolicMarker, TitrationWeek } from "./types";

export const pkCurveData: ChartPoint[] = [
  { week: "W1", standard: 34, optimized: 14 },
  { week: "W2", standard: 66, optimized: 21 },
  { week: "W3", standard: 88, optimized: 27 },
  { week: "W4", standard: 79, optimized: 31 },
  { week: "W5", standard: 72, optimized: 34 },
  { week: "W6", standard: 69, optimized: 36 },
  { week: "W7", standard: 63, optimized: 38 },
  { week: "W8", standard: 58, optimized: 39 },
  { week: "W9", standard: 54, optimized: 41 },
  { week: "W10", standard: 49, optimized: 42 },
  { week: "W11", standard: 45, optimized: 43 },
  { week: "W12", standard: 43, optimized: 44 },
];

export const molecularEvidenceSummary = [
  {
    label: "Parsed loci",
    value: "8",
    detail: "GLP1R, GIPR, TCF7L2, PPARG, FTO, MC4R, KCNJ11, PNPLA3",
  },
  {
    label: "High-impact signals",
    value: "3",
    detail: "GLP1R, TCF7L2, PPARG are weighted highest in the dose-cadence model.",
  },
  {
    label: "Evidence sources",
    value: "11",
    detail: "PubMed, DOI, GWAS catalog-style references, and metabolic cohort studies.",
  },
];

export const metabolicMarkers: MetabolicMarker[] = [
  {
    label: "eGFR (Kidney Function)",
    value: "74 mL/min/1.73m²",
    status: "Mildly Decreased",
  },
  {
    label: "ALT/AST (Liver Enzymes)",
    value: "38/41 U/L",
    status: "Borderline High",
  },
];

export const titrationSchedule: TitrationWeek[] = [
  {
    week: "Week 1",
    cadence: "Day 1 + Day 4",
    dose: "0.10mg + 0.10mg",
    support: "Ondansetron 4mg PRN, ginger extract nightly, hydration target 2.4L/day.",
  },
  {
    week: "Week 2",
    cadence: "Day 8 + Day 11",
    dose: "0.12mg + 0.12mg",
    support: "Continue anti-nausea protocol; add protein preload before dose window.",
  },
  {
    week: "Week 3",
    cadence: "Day 15 + Day 18",
    dose: "0.15mg + 0.15mg",
    support: "Review satiety score and bowel motility before incremental escalation.",
  },
  {
    week: "Week 4",
    cadence: "Day 22 + Day 25",
    dose: "0.18mg + 0.18mg",
    support: "Maintain split cadence; physician check-in before week-five titration.",
  },
];

export const pubMedCitations = [
  "PMID: 35723666 - GLP1R polymorphisms and incretin response variability.",
  "PMID: 19934000 - TCF7L2 rs7903146 affects diabetes risk by modulating incretin action.",
  "PMID: 17661009 - TCF7L2 carriers show impaired GLP-1-induced insulin secretion.",
  "PMID: 20081857 - GIPR variation influences glucose and insulin response after oral glucose challenge.",
  "PMID: 28530680 - GIP variants and visceral fat accumulation in metabolic cohorts.",
  "PMID: 17434869 - FTO locus association with body mass and obesity risk.",
  "PMID: 18454148 - Common variants near MC4R associated with fat mass and obesity.",
  "PMID: 18820647 - PNPLA3 variant associated with hepatic fat content.",
  "DOI: 10.3389/fendo.2022.919087 - PPARG rs1801282 obesity and dyslipidemia meta-analysis.",
];

export const orderPayload = {
  patient_id: "usr_9281",
  compound: "Tirzepatide-Custom-A",
  pharmacy_id: "ph_openloop_01",
};

/** One-line bridge from PK chart to gene drivers (supporting evidence zone). */
export const pkGeneBridgeCopy =
  "Split cadence keeps modeled plasma below the hyperemesis threshold because GLP1R, TCF7L2, and PPARG signals increase early peak-intolerance risk.";
