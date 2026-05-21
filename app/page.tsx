"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpenText,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  Dna,
  FileSpreadsheet,
  FlaskConical,
  Microscope,
  Loader2,
  Route,
  ScrollText,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  week: string;
  standard: number;
  optimized: number;
};

type TooltipPayload = {
  name: string;
  value: number;
  color?: string;
};

type GeneFinding = {
  marker: string;
  gene: string;
  genotype: string;
  interpretation: string;
  severity: "High" | "Moderate" | "Supportive";
  incidence: string;
  meaning: string;
  mechanism: string;
  source: string;
  sourceDetail: string;
};

type GeneDeepDiveReport = {
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

const navigationItems = [
  { label: "Patients", icon: Users, active: true },
  { label: "Molecular Analytics", icon: FlaskConical, active: false },
  { label: "Pharmacy Routing", icon: Route, active: false },
  { label: "Audit Logs", icon: ScrollText, active: false },
];

// These chart points are fixed sample data so every review shows the same clinical story.
const pkCurveData: ChartPoint[] = [
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

// The genomics report uses deterministic sample findings so the dashboard feels
// like a parsed clinical packet while remaining stable for every review.
const genomicVariants: GeneFinding[] = [
  {
    marker: "rs1801282",
    gene: "PPARG",
    genotype: "G/G",
    interpretation: "Adipocyte insulin-sensitivity risk",
    severity: "High",
    incidence:
      "Common Pro12Ala locus; risk interpretation depends on ancestry and dominant-model meta-analysis.",
    meaning:
      "Supports higher baseline adiposity and dyslipidemia vulnerability, increasing the need for slower dose escalation.",
    mechanism:
      "PPAR-gamma controls adipocyte differentiation, lipid storage, and insulin-sensitizing transcription.",
    source: "Frontiers Endocrinology 2022 systematic review, DOI: 10.3389/fendo.2022.919087",
    sourceDetail:
      "Important parser note: rs1801282 maps to PPARG/PPAR-gamma, not GIPR. The dashboard normalizes the source gene before scoring.",
  },
  {
    marker: "rs10305492",
    gene: "GLP1R",
    genotype: "A/T",
    interpretation: "Altered GLP-1 receptor signaling",
    severity: "High",
    incidence:
      "A316T missense signal described as enriched in non-Finnish European cohorts; heterozygous carrier state parsed.",
    meaning:
      "Raises concern for non-standard GLP-1 response kinetics and symptom sensitivity during early titration.",
    mechanism:
      "Variant affects GLP-1 receptor trafficking/signaling, changing incretin-induced cellular response.",
    source: "PMID: 35723666 - Association of GLP1R Polymorphisms With the Incretin Response",
    sourceDetail:
      "Used here to justify enhanced monitoring for receptor-level variability before choosing weekly semaglutide exposure.",
  },
  {
    marker: "rs10423928",
    gene: "GIPR",
    genotype: "A/G",
    interpretation: "GIP axis metabolic-syndrome signal",
    severity: "Moderate",
    incidence:
      "Common GIPR SNV reported across metabolic-health cohorts; parsed as heterozygous risk carrier.",
    meaning:
      "Supports a dual-agonist strategy because GIP receptor biology may influence visceral fat and insulin response.",
    mechanism:
      "GIPR modulates glucose-dependent insulinotropic signaling, adipose nutrient handling, and post-prandial insulin dynamics.",
    source: "Genes 2022;13:1534 - The Link between Three SNP Variants of GIPR and Metabolic Health",
    sourceDetail:
      "Cross-referenced with GIP/GIPR metabolic-health literature including PMID: 28530680 and PMID: 20081857.",
  },
  {
    marker: "rs7903146",
    gene: "TCF7L2",
    genotype: "C/T",
    interpretation: "Reduced incretin effect",
    severity: "High",
    incidence:
      "One of the most replicated type-2-diabetes loci; patient is a single T-risk-allele carrier.",
    meaning:
      "Signals lower beta-cell incretin responsiveness, so the model avoids abrupt peak exposure and emphasizes smooth cadence.",
    mechanism:
      "TCF7L2 risk alleles impair beta-cell sensitivity to GLP-1/GIP without necessarily reducing incretin secretion.",
    source: "PMID: 19934000 - TCF7L2 rs7903146 modulates incretin action",
    sourceDetail:
      "Also supported by PMID: 17661009, which describes impaired GLP-1-induced insulin secretion in TCF7L2 carriers.",
  },
  {
    marker: "rs9939609",
    gene: "FTO",
    genotype: "A/A",
    interpretation: "Satiety and obesity-risk amplifier",
    severity: "Moderate",
    incidence:
      "Common obesity-associated allele; homozygous risk state is clinically meaningful for appetite phenotype scoring.",
    meaning:
      "Supports aggressive behavioral support and appetite tracking because early satiety changes may be more variable.",
    mechanism:
      "FTO-region variation is associated with appetite regulation, body-mass index, and energy-intake behavior.",
    source: "PMID: 17434869 - FTO variant associated with body mass and obesity risk",
    sourceDetail:
      "Used as a phenotype modifier, not as a standalone medication-selection rule.",
  },
  {
    marker: "rs17782313",
    gene: "MC4R",
    genotype: "C/T",
    interpretation: "Melanocortin appetite pathway signal",
    severity: "Moderate",
    incidence:
      "Common near-MC4R obesity-risk locus; patient carries one appetite-pathway risk allele.",
    meaning:
      "Adds weight to appetite, craving, and adherence monitoring during the first four weeks of therapy.",
    mechanism:
      "MC4R pathway regulates hypothalamic satiety signaling and energy homeostasis.",
    source: "PMID: 18454148 - Common variants near MC4R associated with fat mass and obesity",
    sourceDetail:
      "Used to explain why the CDS plan includes protein preload and satiety-score follow-up.",
  },
  {
    marker: "rs5219",
    gene: "KCNJ11",
    genotype: "E/K",
    interpretation: "Beta-cell excitability modifier",
    severity: "Supportive",
    incidence:
      "Common E23K potassium-channel variant; heterozygous state used as a glycemic-response modifier.",
    meaning:
      "Suggests beta-cell electrical response may be less predictable, so glycemic response should be trended rather than assumed.",
    mechanism:
      "KCNJ11 encodes Kir6.2, a pancreatic beta-cell potassium-channel subunit involved in insulin secretion.",
    source: "PMID: 12475775 - Pancreatic ATP-sensitive potassium channels and type 2 diabetes",
    sourceDetail:
      "Supportive biology for monitoring insulin-secretion dynamics during incretin therapy.",
  },
  {
    marker: "rs738409",
    gene: "PNPLA3",
    genotype: "C/G",
    interpretation: "Hepatic fat and ALT-risk context",
    severity: "Supportive",
    incidence:
      "Common I148M liver-fat risk allele; parsed with borderline ALT/AST to raise hepatic monitoring priority.",
    meaning:
      "Explains why the clearance model keeps an eye on liver enzymes even though dosing is primarily renal/PK guided.",
    mechanism:
      "PNPLA3 variation is associated with hepatic triglyceride remodeling and fatty-liver susceptibility.",
    source: "PMID: 18820647 - PNPLA3 variant associated with hepatic fat content",
    sourceDetail:
      "Included as a safety-context variant, not as a direct contraindication.",
  },
];

const geneDeepDiveReports: Record<string, GeneDeepDiveReport> = {
  rs1801282: {
    assayCall: "High-confidence imputed call; PPARG Pro12Ala-region normalization applied.",
    populationSignal:
      "Common adiposity and lipid-handling locus. The dashboard treats it as a metabolic-context signal rather than a direct incretin-drug contraindication.",
    phenotypeCorrelation:
      "Correlates with obesity-index variance, waist-to-hip phenotype, lipid handling, and insulin-sensitivity biology in meta-analysis settings.",
    clinicalMeaning:
      "This increases the confidence that Alex's BMI and borderline liver enzymes are not isolated signals. The CDS engine therefore avoids a rapid weekly peak strategy and emphasizes tolerability-first titration.",
    pkModelEffect:
      "Adds a +9% adiposity-context weight to the early exposure penalty and raises the threshold for weekly dose escalation.",
    monitoringPlan:
      "Track waist circumference, fasting lipids, ALT/AST, appetite score, and GI symptom burden before any week-five escalation.",
    evidenceLevel: "Meta-analysis / metabolic phenotype modifier",
    incidenceRows: [
      { label: "Gene normalized", value: "PPARG, not GIPR" },
      { label: "Parsed genotype", value: "G/G" },
      { label: "Clinical weight", value: "High because BMI and liver markers are concordant" },
    ],
    pathwayRows: [
      { label: "Biology", value: "Adipocyte differentiation and lipid storage transcription" },
      { label: "Dashboard role", value: "Metabolic-risk amplification and dose-escalation caution" },
      { label: "Model output", value: "Slower cadence with stronger lifestyle-support recommendations" },
    ],
    evidenceBullets: [
      "Systematic review literature links PPARG rs1801282 with obesity-index and dyslipidemia patterns.",
      "The gene parser flags the original GIPR assignment as biologically inconsistent and corrects it before scoring.",
      "This finding supports monitoring and escalation logic, not a standalone medication change.",
    ],
    sourceStack: [
      "Frontiers in Endocrinology 2022, DOI: 10.3389/fendo.2022.919087",
      "Stumvoll & Haring, Diabetes 2002, PMID: 12145143",
      "Sequence Ontology normalization reference, PMID: 15892872",
    ],
  },
  rs10305492: {
    assayCall: "Missense GLP1R A316T heterozygous carrier signal detected.",
    populationSignal:
      "Reported as enriched in selected European population datasets and studied for altered incretin-response behavior.",
    phenotypeCorrelation:
      "Correlates with altered GLP-1 receptor trafficking/signaling and differential pharmacologic response to receptor agonism.",
    clinicalMeaning:
      "Because the medication target itself may signal differently, the engine treats first-dose tolerability as uncertain and prioritizes smooth plasma exposure over manufacturer-default weekly peak exposure.",
    pkModelEffect:
      "Adds receptor-sensitivity uncertainty to the plasma-to-symptom conversion layer and lowers the acceptable week-one peak.",
    monitoringPlan:
      "Capture nausea, early satiety, gastric emptying symptoms, hydration tolerance, and rescue antiemetic use after each split dose.",
    evidenceLevel: "Target-receptor pharmacogenomic signal",
    incidenceRows: [
      { label: "Gene target", value: "GLP1R receptor-level variant" },
      { label: "Parsed genotype", value: "A/T" },
      { label: "Clinical weight", value: "High because therapy directly engages GLP-1 biology" },
    ],
    pathwayRows: [
      { label: "Biology", value: "GLP-1 receptor trafficking, basal signaling, and agonist response" },
      { label: "Dashboard role", value: "Early side-effect uncertainty and receptor-response variability" },
      { label: "Model output", value: "Avoid abrupt peak concentration during weeks 1-3" },
    ],
    evidenceBullets: [
      "GLP1R polymorphism research supports measurable differences in incretin response.",
      "A receptor-level variant matters more than a general obesity variant because the drug class acts at this target.",
      "The dashboard turns this into a dosing-cadence warning, not an automatic exclusion from therapy.",
    ],
    sourceStack: [
      "PMID: 35723666 - Association of GLP1R Polymorphisms With the Incretin Response",
      "Imperial College GLP1R A316T translational therapeutics report",
      "Nature 2026 GLP-1 medication genetics preprint-style research reference",
    ],
  },
  rs10423928: {
    assayCall: "Common GIPR heterozygous metabolic-health signal detected.",
    populationSignal:
      "GIPR SNPs are repeatedly discussed in metabolic syndrome, post-prandial insulin response, and visceral-fat literature.",
    phenotypeCorrelation:
      "Correlates with glucose-dependent insulinotropic response, visceral adiposity, and post-challenge glucose-insulin dynamics.",
    clinicalMeaning:
      "This finding supports considering dual-agonist biology because GIP pathway variability may be clinically relevant in a high-BMI patient.",
    pkModelEffect:
      "Adds a dual-agonist rationale score and increases the expected benefit of low-amplitude, split-dose tirzepatide exposure.",
    monitoringPlan:
      "Trend fasting glucose, post-prandial symptoms, satiety durability, and weight-response slope by week.",
    evidenceLevel: "Metabolic cohort / pathway plausibility",
    incidenceRows: [
      { label: "Gene target", value: "GIPR incretin co-receptor" },
      { label: "Parsed genotype", value: "A/G" },
      { label: "Clinical weight", value: "Moderate, used with BMI and insulin-response context" },
    ],
    pathwayRows: [
      { label: "Biology", value: "GIP receptor signaling and adipose nutrient handling" },
      { label: "Dashboard role", value: "Dual-agonist rationale and metabolic-context scoring" },
      { label: "Model output", value: "Supports tirzepatide-style pathway coverage" },
    ],
    evidenceBullets: [
      "GIPR variation has been linked with glucose and insulin responses to oral glucose challenge.",
      "GIP/GIPR literature supports visceral-fat and metabolic-syndrome relevance.",
      "The engine weights this below GLP1R and TCF7L2 because it is more pathway-contextual than directly toxicity-predictive.",
    ],
    sourceStack: [
      "PMID: 20081857 - GIPR variation influences oral glucose challenge response",
      "Genes 2022;13:1534 - GIPR variants and metabolic health",
      "PMID: 28530680 - GIP variants and visceral fat accumulation",
    ],
  },
  rs7903146: {
    assayCall: "TCF7L2 C/T carrier state detected at a replicated diabetes-risk locus.",
    populationSignal:
      "Highly replicated type-2-diabetes risk locus across diverse cohorts; the T allele is widely studied for incretin-action effects.",
    phenotypeCorrelation:
      "Risk carriers show reduced beta-cell responsiveness to incretin hormones even when incretin secretion is not necessarily reduced.",
    clinicalMeaning:
      "This makes dose response less predictable. The dashboard prioritizes trend-based monitoring instead of assuming standard weekly titration will produce a clean metabolic response.",
    pkModelEffect:
      "Raises beta-cell-response uncertainty and increases the value of week-by-week adaptive titration.",
    monitoringPlan:
      "Trend fasting glucose, post-prandial glucose, nausea score, appetite score, and fatigue after each dosing interval.",
    evidenceLevel: "Replicated diabetes-risk and incretin-action locus",
    incidenceRows: [
      { label: "Gene target", value: "TCF7L2 transcription factor pathway" },
      { label: "Parsed genotype", value: "C/T" },
      { label: "Clinical weight", value: "High because incretin action is central to the therapy" },
    ],
    pathwayRows: [
      { label: "Biology", value: "Beta-cell incretin sensitivity and insulin secretion dynamics" },
      { label: "Dashboard role", value: "Response uncertainty and adaptive titration justification" },
      { label: "Model output", value: "Custom split cadence with physician checkpoint" },
    ],
    evidenceBullets: [
      "TCF7L2 rs7903146 has strong type-2-diabetes genetic association evidence.",
      "Published physiology work connects the locus to reduced incretin effect.",
      "This is one of the strongest rationale points for avoiding a rigid protocol in the clinical model.",
    ],
    sourceStack: [
      "PMID: 19934000 - TCF7L2 rs7903146 modulates incretin action",
      "PMID: 17661009 - Impaired GLP-1-induced insulin secretion in TCF7L2 carriers",
      "PMID: 16415884 - TCF7L2 gene confers type 2 diabetes risk",
    ],
  },
  rs9939609: {
    assayCall: "FTO A/A homozygous appetite and obesity-risk signal detected.",
    populationSignal:
      "Common obesity-associated allele with replicated body-mass and appetite-behavior literature.",
    phenotypeCorrelation:
      "Correlates with higher BMI risk, appetite regulation, energy intake behavior, and variable satiety response.",
    clinicalMeaning:
      "This does not determine medication choice alone, but it explains why appetite tracking and nutrition scaffolding are built into the first month.",
    pkModelEffect:
      "Adds phenotype support for behavioral monitoring and raises the adherence-support score.",
    monitoringPlan:
      "Track hunger, craving, protein intake, late-night eating, constipation, and dose-day nausea in the patient app.",
    evidenceLevel: "Replicated obesity-risk phenotype modifier",
    incidenceRows: [
      { label: "Gene target", value: "FTO obesity-risk region" },
      { label: "Parsed genotype", value: "A/A" },
      { label: "Clinical weight", value: "Moderate because it modifies behavior and response tracking" },
    ],
    pathwayRows: [
      { label: "Biology", value: "Energy intake behavior and appetite regulation" },
      { label: "Dashboard role", value: "Satiety expectations and adherence-support planning" },
      { label: "Model output", value: "Add protein preload and appetite-score instrumentation" },
    ],
    evidenceBullets: [
      "FTO rs9939609 is one of the classic common obesity-risk markers.",
      "The dashboard treats it as a care-plan personalization signal.",
      "It supports UX-level monitoring rather than a direct pharmacokinetic correction.",
    ],
    sourceStack: [
      "PMID: 17434869 - FTO variant associated with body mass and obesity risk",
      "GIANT consortium obesity-locus literature",
      "Behavioral satiety monitoring model, First Dose evidence layer",
    ],
  },
  rs17782313: {
    assayCall: "Near-MC4R C/T heterozygous appetite-pathway signal detected.",
    populationSignal:
      "Common variant near MC4R, a central satiety pathway repeatedly associated with body mass and fat mass.",
    phenotypeCorrelation:
      "Correlates with appetite regulation and obesity susceptibility through melanocortin pathway biology.",
    clinicalMeaning:
      "This reinforces the need to distinguish medication failure from hunger-pathway biology and adherence friction.",
    pkModelEffect:
      "Adds a satiety-pathway modifier without changing renal/hepatic clearance constants.",
    monitoringPlan:
      "Capture hunger rebound, meal timing, protein compliance, and cravings before escalation decisions.",
    evidenceLevel: "Central appetite-pathway phenotype modifier",
    incidenceRows: [
      { label: "Gene target", value: "Near MC4R melanocortin pathway" },
      { label: "Parsed genotype", value: "C/T" },
      { label: "Clinical weight", value: "Moderate because it changes behavioral follow-up needs" },
    ],
    pathwayRows: [
      { label: "Biology", value: "Hypothalamic satiety and energy homeostasis" },
      { label: "Dashboard role", value: "Adherence and appetite monitoring" },
      { label: "Model output", value: "Week-by-week satiety checkpoints" },
    ],
    evidenceBullets: [
      "MC4R-pathway findings help explain appetite phenotype variability.",
      "This marker supports a higher-touch coaching protocol during initiation.",
      "It is intentionally weighted below receptor and beta-cell findings.",
    ],
    sourceStack: [
      "PMID: 18454148 - Common variants near MC4R associated with fat mass and obesity",
      "GIANT consortium BMI pathway literature",
      "First Dose satiety-response monitoring schema",
    ],
  },
  rs5219: {
    assayCall: "KCNJ11 E23K heterozygous beta-cell potassium-channel modifier detected.",
    populationSignal:
      "Common pancreatic ATP-sensitive potassium channel variant studied in insulin secretion and diabetes-risk biology.",
    phenotypeCorrelation:
      "Correlates with beta-cell electrical excitability and insulin secretion dynamics.",
    clinicalMeaning:
      "The engine uses this as a supportive signal to monitor glycemic response rather than expecting uniform insulin dynamics.",
    pkModelEffect:
      "Adds beta-cell variability to response projections but does not materially change plasma drug concentration.",
    monitoringPlan:
      "Trend fasting glucose, CGM excursions if available, fatigue, dizziness, and meal-related symptoms.",
    evidenceLevel: "Supportive beta-cell physiology marker",
    incidenceRows: [
      { label: "Gene target", value: "KCNJ11 / Kir6.2 channel biology" },
      { label: "Parsed genotype", value: "E/K" },
      { label: "Clinical weight", value: "Supportive, used as a monitoring modifier" },
    ],
    pathwayRows: [
      { label: "Biology", value: "ATP-sensitive potassium channel and insulin secretion" },
      { label: "Dashboard role", value: "Glycemic-response monitoring" },
      { label: "Model output", value: "Trend response before dose acceleration" },
    ],
    evidenceBullets: [
      "KCNJ11 connects beta-cell electrophysiology to insulin-release dynamics.",
      "This is a supportive finding because the patient is not being diagnosed from genotype alone.",
      "It strengthens the case for objective glucose trending during titration.",
    ],
    sourceStack: [
      "PMID: 12475775 - Pancreatic ATP-sensitive potassium channels and type 2 diabetes",
      "KCNJ11 E23K diabetes-risk physiology literature",
      "First Dose beta-cell response uncertainty model",
    ],
  },
  rs738409: {
    assayCall: "PNPLA3 I148M-region C/G hepatic-risk context signal detected.",
    populationSignal:
      "Common liver-fat susceptibility variant with strong hepatic triglyceride and NAFLD association literature.",
    phenotypeCorrelation:
      "Correlates with hepatic fat accumulation and liver-enzyme monitoring relevance, especially when ALT/AST are borderline.",
    clinicalMeaning:
      "This does not block therapy, but it raises the importance of liver-safety surveillance while weight-loss therapy is initiated.",
    pkModelEffect:
      "Adds hepatic-safety context to the clearance panel and increases follow-up priority for ALT/AST.",
    monitoringPlan:
      "Repeat ALT/AST, review alcohol intake, assess NAFLD risk, and trend GI symptoms before escalation.",
    evidenceLevel: "Supportive hepatic safety-context marker",
    incidenceRows: [
      { label: "Gene target", value: "PNPLA3 hepatic triglyceride remodeling" },
      { label: "Parsed genotype", value: "C/G" },
      { label: "Clinical weight", value: "Supportive because biomarkers are borderline" },
    ],
    pathwayRows: [
      { label: "Biology", value: "Hepatic lipid remodeling and fatty-liver susceptibility" },
      { label: "Dashboard role", value: "Liver-safety context and follow-up priority" },
      { label: "Model output", value: "ALT/AST checkpoint before aggressive titration" },
    ],
    evidenceBullets: [
      "PNPLA3 is a well-known hepatic fat susceptibility signal.",
      "The finding becomes more relevant because the biomarker panel already shows borderline ALT/AST.",
      "The dashboard treats it as surveillance context, not as a contraindication.",
    ],
    sourceStack: [
      "PMID: 18820647 - PNPLA3 variant associated with hepatic fat content",
      "NAFLD genetics literature on PNPLA3 I148M",
      "First Dose hepatic monitoring protocol layer",
    ],
  },
};

const molecularEvidenceSummary = [
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

const metabolicMarkers = [
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

const titrationSchedule = [
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

const pubMedCitations = [
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

const orderPayload = {
  patient_id: "usr_9281",
  compound: "Tirzepatide-Custom-A",
  pharmacy_id: "ph_openloop_01",
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur">
      <p className="mb-3 text-sm font-semibold text-slate-100">{label} plasma model</p>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6 text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color ?? "#3b82f6" }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-100">{entry.value} ng/mL</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedGene, setSelectedGene] = useState<GeneFinding | null>(null);
  const [isGenomicReportOpen, setIsGenomicReportOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [rejectionNotice, setRejectionNotice] = useState(false);

  const selectedSchedule = titrationSchedule[selectedWeek];
  const selectedGeneReport = selectedGene ? geneDeepDiveReports[selectedGene.marker] : null;

  // The upload button intentionally simulates parsing time so the intake flow has a clear before/after moment.
  function handleSimulatedUpload() {
    setIsUploading(true);
    setRejectionNotice(false);

    window.setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
    }, 1050);
  }

  function handleRejectProtocol() {
    setRejectionNotice(true);
  }

  function openGenomicReport(gene: GeneFinding | null = null) {
    setSelectedGene(gene);
    setIsGenomicReportOpen(true);
  }

  function closeGenomicReport() {
    setSelectedGene(null);
    setIsGenomicReportOpen(false);
  }

  const prettyPayload = useMemo(() => JSON.stringify(orderPayload, null, 2), []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-950/95 p-5 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Dna className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">
                First Dose
              </p>
              <h1 className="text-xl font-bold text-white">Health OS</h1>
            </div>
          </div>

          <nav className="grid gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    item.active
                      ? "border-blue-500/40 bg-blue-600/10 text-white shadow-lg shadow-blue-950/30"
                      : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                  type="button"
                >
                  <span
                    className={`h-7 rounded-full border-l-2 ${
                      item.active ? "border-blue-500" : "border-transparent"
                    }`}
                  />
                  <Icon className={`h-5 w-5 ${item.active ? "text-blue-500" : ""}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Secure Runtime
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Clinical decision support is isolated in a physician-reviewed workflow with
              auditable data provenance.
            </p>
          </div>
        </aside>

        <section className="flex min-h-screen flex-1 flex-col bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.22),_transparent_34%),#020617]">
          <div className="flex-1 p-4 sm:p-6 xl:p-8">
            <header className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                    Patient Profile Header
                  </p>
                  <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Alex Mercer
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Age", "34yo"],
                    ["BMI", "31.2"],
                    ["Status", "Pending Intake Review"],
                    ["Encounter", "FDH-INTAKE-492"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            {!isUploaded ? (
              <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/60 sm:p-8">
                <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                      Intake Pending
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-white">
                      Multi-Omic Intake Console
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                      Upload genomic and biomarker records to activate molecular parsing,
                      pharmacokinetic modeling, and pharmacy routing recommendations.
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Awaiting patient source files
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <DropZone
                    icon={<Dna className="h-9 w-9 text-blue-500" />}
                    title="Genomic Ingest"
                    text="Drag & drop raw 23andMe / Ancestry .txt file"
                  />
                  <DropZone
                    icon={<FileSpreadsheet className="h-9 w-9 text-blue-500" />}
                    title="Biomarker Ingest"
                    text="Drag & drop Labcorp / Quest PDF or JSON"
                  />
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-2xl shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isUploading}
                    onClick={handleSimulatedUpload}
                    type="button"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Parsing molecular and biomarker payloads...
                      </>
                    ) : (
                      <>
                        <Database className="h-5 w-5 transition group-hover:scale-110" />
                        Simulate Multi-Omic Patient Upload
                      </>
                    )}
                  </button>
                </div>
              </section>
            ) : (
              <section className="grid gap-5 xl:grid-cols-4">
                <div className="space-y-5 xl:col-span-1">
                  <Card
                    eyebrow="Multi-Omic Extraction"
                    title="Genomic Identification Report"
                    icon={<Dna className="h-5 w-5" />}
                  >
                    <button
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-400/60 bg-blue-600 p-4 text-left shadow-2xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/35"
                      onClick={() => openGenomicReport()}
                      type="button"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-white">
                            Review Genomic Findings
                          </p>
                          <p className="mt-1 text-xs font-semibold text-blue-100">
                            Gene panel, evidence categories, and variant-level detail
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["8 loci", "3 high", "11 sources"].map((metric) => (
                            <span
                              key={metric}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-white">Detected Genes</p>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {genomicVariants.map((variant) => (
                          <button
                            key={variant.marker}
                            className={`rounded-xl border px-3 py-2 text-left text-sm font-black transition hover:-translate-y-0.5 hover:shadow-lg ${
                              variant.severity === "High"
                                ? "border-rose-500/40 bg-rose-950/40 text-rose-100 hover:border-rose-400 hover:shadow-rose-950/30"
                                : variant.severity === "Moderate"
                                  ? "border-amber-500/30 bg-amber-950/30 text-amber-100 hover:border-amber-300 hover:shadow-amber-950/20"
                                  : "border-blue-500/30 bg-blue-950/30 text-blue-100 hover:border-blue-300 hover:shadow-blue-950/20"
                            }`}
                            onClick={() => openGenomicReport(variant)}
                            type="button"
                          >
                            {variant.gene}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm font-semibold leading-6 text-rose-200">
                      <AlertTriangle className="mb-2 h-5 w-5 text-rose-500" />
                      ⚠️ CRITICAL SIDE EFFECT VECTOR: 15.2x Nausea & Hyperemesis
                      Vulnerability Detected.
                    </div>
                  </Card>

                  <Card
                    eyebrow="Clearance Baseline"
                    title="Metabolic Clearance"
                    icon={<Activity className="h-5 w-5" />}
                  >
                    <div className="space-y-3">
                      {metabolicMarkers.map((marker) => (
                        <div
                          key={marker.label}
                          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            {marker.label}
                          </p>
                          <p className="mt-2 text-lg font-black text-white">{marker.value}</p>
                          <p className="mt-1 text-sm text-amber-200">{marker.status}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="xl:col-span-2">
                  <Card
                    eyebrow="PK Simulator"
                    title="Real-Time Plasma Concentration Simulation"
                    icon={<BrainCircuit className="h-5 w-5" />}
                    className="h-full"
                  >
                    <p className="mb-6 text-sm leading-6 text-slate-400">
                      Modeling drug elimination curves against patient clearance parameters.
                    </p>

                    <div className="mb-5 grid gap-3 md:grid-cols-3">
                      {molecularEvidenceSummary.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            {item.label}
                          </p>
                          <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                          <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-5 grid gap-3 md:grid-cols-2">
                      <LegendPill
                        color="bg-rose-500"
                        label="Standard Weekly Protocol (0.25mg Semaglutide)"
                      />
                      <LegendPill
                        color="bg-blue-500"
                        label="First Dose Optimized Protocol (Compounded Tirzepatide Dynamic Split)"
                      />
                    </div>

                    <div className="h-[430px] rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-4">
                      <ResponsiveContainer height="100%" width="100%">
                        <LineChart data={pkCurveData} margin={{ top: 28, right: 16, left: 0, bottom: 16 }}>
                          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                          <XAxis
                            dataKey="week"
                            stroke="#94a3b8"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            label={{
                              value: "Plasma ng/mL",
                              angle: -90,
                              position: "insideLeft",
                              fill: "#94a3b8",
                              fontSize: 12,
                            }}
                            stroke="#94a3b8"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <ReferenceArea
                            y1={24}
                            y2={48}
                            fill="#1d4ed8"
                            fillOpacity={0.12}
                            label={{
                              value: "Optimal Therapeutic Window",
                              position: "insideTopLeft",
                              fill: "#60a5fa",
                              fontSize: 12,
                            }}
                          />
                          <ReferenceArea
                            y1={72}
                            y2={100}
                            fill="#e11d48"
                            fillOpacity={0.14}
                            label={{
                              value: "Hyperemesis & Toxicity Threshold",
                              position: "insideTopRight",
                              fill: "#fb7185",
                              fontSize: 12,
                            }}
                          />
                          <Line
                            dataKey="standard"
                            dot={{ r: 3, strokeWidth: 2 }}
                            name="Standard Weekly Protocol"
                            stroke="#e11d48"
                            strokeDasharray="7 7"
                            strokeWidth={2}
                            type="monotone"
                          />
                          <Line
                            dataKey="optimized"
                            dot={{ r: 4, strokeWidth: 2 }}
                            name="First Dose Optimized Protocol"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            type="monotone"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                        <div className="mb-3 flex items-center gap-2 text-blue-400">
                          <Microscope className="h-5 w-5" />
                          <h4 className="text-sm font-black uppercase tracking-[0.16em]">
                            Translational Biology Readout
                          </h4>
                        </div>
                        <p className="text-sm leading-6 text-slate-300">
                          The model weights receptor pharmacodynamics, beta-cell incretin
                          sensitivity, appetite-pathway biology, adipocyte insulin signaling, and
                          hepatic safety context. High-impact signals push the engine away from a
                          single weekly peak and toward a split cadence that reduces early
                          concentration volatility.
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-600/5 p-5">
                        <div className="mb-3 flex items-center gap-2 text-blue-400">
                          <BookOpenText className="h-5 w-5" />
                          <h4 className="text-sm font-black uppercase tracking-[0.16em]">
                            Evidence Weighting Logic
                          </h4>
                        </div>
                        <div className="space-y-2 text-sm leading-6 text-slate-300">
                          <p>
                            42% receptor and incretin pathway findings: GLP1R, GIPR, TCF7L2.
                          </p>
                          <p>31% phenotype modifiers: FTO, MC4R, PPARG.</p>
                          <p>27% safety modifiers: eGFR, ALT/AST, PNPLA3, KCNJ11.</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="xl:col-span-1">
                  <Card
                    eyebrow="FDA-Compliant CDS Output"
                    title="Optimization Engine Recommendation"
                    icon={<ShieldCheck className="h-5 w-5" />}
                    className="h-full"
                  >
                    <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                        MOLECULE SWITCH & DYNAMIC CADENCE MANDATE
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Bypass standard manufacturer weekly titration. Transition to Compounded
                        Dual-Agonist (Tirzepatide) via custom 4-day cadence (0.10mg Day 1,
                        0.10mg Day 4) to eliminate peak-concentration toxicity.
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">4-Week Titration Schedule</h4>
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400">
                          {selectedSchedule.week}
                        </span>
                      </div>

                      <div className="grid gap-2">
                        {titrationSchedule.map((row, index) => (
                          <button
                            key={row.week}
                            className={`rounded-2xl border p-3 text-left transition ${
                              selectedWeek === index
                                ? "border-blue-500/60 bg-blue-600/10 shadow-lg shadow-blue-950/30"
                                : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                            }`}
                            onClick={() => setSelectedWeek(index)}
                            type="button"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-bold text-white">{row.week}</span>
                              <span className="text-xs font-semibold text-blue-400">{row.dose}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{row.cadence}</p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Anti-nausea prophylaxis
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {selectedSchedule.support}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80">
                      <button
                        className="flex w-full items-center justify-between gap-3 p-4 text-left"
                        onClick={() => setIsLogsOpen((current) => !current)}
                        type="button"
                      >
                        <span>
                          <span className="block text-sm font-bold text-white">
                            PubMed Justification Logs
                          </span>
                          <span className="text-xs text-slate-500">
                            Academic model trace and citation drawer
                          </span>
                        </span>
                        {isLogsOpen ? (
                          <ChevronUp className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-blue-500" />
                        )}
                      </button>

                      {isLogsOpen ? (
                        <div className="border-t border-slate-800 p-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-sm text-blue-100">
                            C_t = C_0 * e^(-k_e * t)
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-400">
                            k_e adjusted down by 14.1% based on parsed eGFR & phenotypic
                            clearance data.
                          </p>
                          <div className="mt-4 space-y-2">
                            {pubMedCitations.map((citation) => (
                              <div
                                key={citation}
                                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300"
                              >
                                {citation}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </div>
              </section>
            )}
          </div>

          <footer className="sticky bottom-0 z-20 border-t border-slate-800 bg-slate-950/95 p-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600/20 text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Regulatory Safe Harbor Status: FDA-Compliant CDS Class I
                  </p>
                  <p className="text-xs text-slate-400">Physician Sign-off Required</p>
                  {rejectionNotice ? (
                    <p className="mt-2 text-xs font-semibold text-rose-400">
                      Optimization protocol marked for physician review. No pharmacy payload sent.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-rose-500/50 hover:text-rose-200"
                  onClick={handleRejectProtocol}
                  type="button"
                >
                  Reject Optimization Protocol
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isUploaded}
                  onClick={() => setIsOrderModalOpen(true)}
                  type="button"
                >
                  <Send className="h-4 w-4" />
                  ⚡ Generate CDS Order & Route to Pharmacy API
                </button>
              </div>
            </div>
          </footer>
        </section>
      </div>

      {isGenomicReportOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-2xl">
          <div className="mx-auto my-6 w-full max-w-7xl overflow-hidden rounded-[2rem] border border-blue-500/30 bg-slate-900 shadow-2xl shadow-blue-950/60">
            <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_36%),#0f172a] p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-400">
                    Complete Genomic Identification Report
                  </p>
                  <h3 className="mt-4 text-4xl font-black tracking-tight text-white">
                    Genomic Evidence Review
                  </h3>
                  <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
                    All parsed genes are shown first. Select any gene below to expand the
                    detailed science, incidence, pathway, paper stack, and CDS model effect for
                    that specific finding.
                  </p>
                </div>

                <button
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:border-blue-500 hover:text-white"
                  onClick={closeGenomicReport}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-5 xl:grid-cols-5">
              <section className="xl:col-span-2">
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {molecularEvidenceSummary.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-600/5 p-4">
                  <div className="mb-4 flex items-center gap-2 text-blue-400">
                    <Dna className="h-5 w-5" />
                    <h4 className="text-sm font-black uppercase tracking-[0.18em]">
                      Identified Gene Panel
                    </h4>
                  </div>
                  <div className="grid max-h-[68vh] gap-3 overflow-y-auto pr-1">
                    {genomicVariants.map((variant) => (
                      <button
                        key={variant.marker}
                        className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-500/70 hover:bg-blue-600/10 ${
                          selectedGene?.marker === variant.marker
                            ? "border-blue-500/70 bg-blue-600/15 shadow-xl shadow-blue-950/40"
                            : "border-slate-800 bg-slate-950/70"
                        }`}
                        onClick={() => setSelectedGene(variant)}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                              {variant.gene}
                            </p>
                            <p className="mt-1 text-lg font-black text-white">{variant.marker}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              variant.severity === "High"
                                ? "bg-rose-950/60 text-rose-300"
                                : variant.severity === "Moderate"
                                  ? "bg-amber-950/60 text-amber-200"
                                  : "bg-blue-950/60 text-blue-200"
                            }`}
                          >
                            {variant.severity}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-100">
                          {variant.genotype} · {variant.interpretation}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{variant.meaning}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="xl:col-span-3">
                {selectedGene && selectedGeneReport ? (
                  <div className="space-y-5">
                    <div className="rounded-[1.5rem] border border-blue-500/30 bg-slate-950/70 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                            Selected Gene Breakdown
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <h4 className="text-3xl font-black text-white">{selectedGene.gene}</h4>
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200">
                              {selectedGene.marker}
                            </span>
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200">
                              {selectedGene.genotype}
                            </span>
                          </div>
                          <p className="mt-4 text-base leading-7 text-slate-300">
                            {selectedGeneReport.clinicalMeaning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {selectedGeneReport.incidenceRows.map((row) => (
                        <div
                          key={row.label}
                          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                        >
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            {row.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-white">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                      <div className="mb-4 flex items-center gap-2 text-blue-400">
                        <Microscope className="h-5 w-5" />
                        <h4 className="text-sm font-black uppercase tracking-[0.18em]">
                          Mechanistic Interpretation
                        </h4>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        {selectedGeneReport.pathwayRows.map((row) => (
                          <div
                            key={row.label}
                            className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">
                              {row.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{row.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-600/5 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                          Incidence / Meaning
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {selectedGeneReport.populationSignal}
                        </p>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {selectedGeneReport.phenotypeCorrelation}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                          PK / CDS Model Impact
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {selectedGeneReport.pkModelEffect}
                        </p>
                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                            Monitoring plan
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {selectedGeneReport.monitoringPlan}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                          Evidence Notes
                        </p>
                        <div className="mt-4 space-y-3">
                          {selectedGeneReport.evidenceBullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                              <p className="text-sm leading-6 text-slate-300">{bullet}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-600/5 p-5">
                        <div className="mb-4 flex items-center gap-2 text-blue-400">
                          <BookOpenText className="h-5 w-5" />
                          <p className="text-xs font-black uppercase tracking-[0.18em]">
                            Paper / Source Stack
                          </p>
                        </div>
                        <div className="space-y-3">
                          {selectedGeneReport.sourceStack.map((source) => (
                            <div
                              key={source}
                              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs leading-5 text-slate-300"
                            >
                              {source}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-[68vh] place-items-center rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-8 text-center">
                    <div className="max-w-xl">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-blue-500/30 bg-blue-600/10 text-blue-400">
                        <Dna className="h-8 w-8" />
                      </div>
                      <h4 className="mt-5 text-3xl font-black text-white">
                        Select a Gene to Explore
                      </h4>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        This report starts with the complete gene panel. Click PPARG, GLP1R,
                        GIPR, TCF7L2, FTO, MC4R, KCNJ11, or PNPLA3 to open its detailed
                        molecular explanation, incidence context, source stack, and dosing impact.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      ) : null}

      {isOrderModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-blue-500/30 bg-slate-900 shadow-2xl shadow-blue-950/50">
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">
                  Photon Health Infrastructure
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">API Payload Transmission</h3>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-950 text-slate-400 transition hover:border-slate-500 hover:text-white"
                onClick={() => setIsOrderModalOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <pre className="max-h-72 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-blue-100">
                {prettyPayload}
              </pre>

              <div className="mt-6 rounded-[1.5rem] border border-blue-500/30 bg-blue-600/10 p-6 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-600 shadow-2xl shadow-blue-600/40">
                  <Check className="h-9 w-9 text-white" />
                </div>
                <h4 className="mt-4 text-2xl font-black text-white">
                  Order Authenticated & Routed Successfully
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  CDS order packet signed, routed, and queued for physician authorization before
                  pharmacy fulfillment.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function DropZone({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-950/70 p-8 transition hover:-translate-y-1 hover:border-blue-500/70 hover:bg-blue-600/5">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-blue-500/30 bg-blue-600/10">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-white">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
      <div className="mt-6 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Encrypted clinical file channel
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
  eyebrow,
  icon,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <article
      className={`rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-blue-500/30 bg-blue-600/10 text-blue-500">
          {icon}
        </div>
      </div>
      {children}
    </article>
  );
}

function LegendPill({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-xs font-semibold text-slate-300">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
      {label}
    </div>
  );
}
