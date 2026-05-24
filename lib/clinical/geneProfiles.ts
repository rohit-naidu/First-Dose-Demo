/**
 * All parsed gene clinical profiles for the Alex Mercer demo patient.
 * Each profile links variants → side effects → prescribing actions → CPIC detail.
 */

import type { GeneClinicalProfile } from "./types";

export const geneProfiles: GeneClinicalProfile[] = [
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
    contributesTo: ["titration_caution", "metabolic_response", "nausea_risk"],
    sideEffects: [
      {
        event: "GI intolerance during escalation",
        likelihood: "Moderate",
        mechanism: "Metabolic context and adiposity signal increase sensitivity to concentration spikes",
        onsetWindow: "Week 1-4",
      },
      {
        event: "Dyslipidemia / weight plateau",
        likelihood: "Moderate",
        mechanism: "PPARG biology links to lipid handling and adipocyte insulin sensitivity",
        onsetWindow: "Week 4-12",
      },
    ],
    prescribingActions: [
      {
        action: "Use tolerability-first titration; avoid rapid weekly peak",
        rationale: "PPARG + concordant BMI/liver markers support slower escalation",
        priority: "Required",
      },
      {
        action: "Track waist circumference, lipids, and ALT/AST before week-five escalation",
        rationale: "Metabolic-risk amplification from PPARG context",
        priority: "Recommended",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Moderate",
      recommendation:
        "Prefer gradual exposure and split cadence when metabolic-risk markers are concordant; do not accelerate on manufacturer-default schedule alone.",
      alternatives: [
        "Extended week-1-2 observation before dose increase",
        "Enhanced lifestyle and lipid monitoring alongside pharmacotherapy",
      ],
    },
    deepDive: {
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
    contributesTo: ["nausea_risk", "gi_intolerance", "titration_caution"],
    sideEffects: [
      {
        event: "Nausea / vomiting",
        likelihood: "High",
        mechanism: "Receptor-level variability may increase symptom sensitivity during peak exposure",
        onsetWindow: "Week 1-3",
      },
      {
        event: "Early satiety / reduced intake",
        likelihood: "Moderate",
        mechanism: "Altered GLP-1 signaling can change gastric tolerance",
        onsetWindow: "Week 1-4",
      },
      {
        event: "Delayed gastric emptying symptoms",
        likelihood: "Moderate",
        mechanism: "GLP-1 receptor agonism affects gastric motility; variant may amplify response",
        onsetWindow: "Week 1-3",
      },
    ],
    prescribingActions: [
      {
        action: "Avoid manufacturer-default weekly peak in weeks 1-3",
        rationale: "GLP1R variant increases early intolerance risk at target receptor",
        priority: "Required",
      },
      {
        action: "Use split tirzepatide cadence (Day 1 + Day 4)",
        rationale: "Smooth plasma exposure reduces concentration spikes",
        priority: "Required",
      },
      {
        action: "PRN antiemetic + hydration protocol after each split dose",
        rationale: "Receptor-level uncertainty warrants proactive GI prophylaxis",
        priority: "Recommended",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1 receptor agonists"],
      strength: "Moderate",
      recommendation:
        "Prefer gradual exposure; consider split dosing and enhanced antiemetic prophylaxis during initiation.",
      alternatives: [
        "Slower semaglutide titration with enhanced monitoring",
        "Delay escalation until GI tolerance confirmed",
      ],
    },
    deepDive: {
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
    contributesTo: ["dual_agonist", "postprandial_symptoms"],
    sideEffects: [
      {
        event: "Post-prandial GI discomfort",
        likelihood: "Moderate",
        mechanism: "GIP pathway variability may shift post-meal insulinotropic and GI response",
        onsetWindow: "Week 1-4",
      },
      {
        event: "Variable satiety durability",
        likelihood: "Moderate",
        mechanism: "GIPR influences post-prandial metabolic signaling",
        onsetWindow: "Week 2-8",
      },
    ],
    prescribingActions: [
      {
        action: "Prefer dual-agonist (tirzepatide) over GLP-1-only weekly protocol",
        rationale: "GIPR signal supports pathway coverage for visceral-fat and insulin context",
        priority: "Recommended",
      },
      {
        action: "Trend fasting glucose and post-prandial symptoms weekly",
        rationale: "GIP axis variability affects metabolic response tracking",
        priority: "Monitor",
      },
    ],
    cpic: {
      drugs: ["Tirzepatide", "Semaglutide", "GLP-1/GIP agonists"],
      strength: "Optional",
      recommendation:
        "Consider dual-agonist therapy when GIP pathway biology is relevant to metabolic phenotype; not a standalone contraindication signal.",
      alternatives: [
        "GLP-1-only agonist with enhanced metabolic monitoring",
        "Behavioral support for post-prandial symptom tracking",
      ],
    },
    deepDive: {
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
    contributesTo: ["nausea_risk", "glycemic_variability", "titration_caution"],
    sideEffects: [
      {
        event: "Nausea / hyperemesis vulnerability",
        likelihood: "High",
        mechanism: "Reduced incretin effect plus peak exposure increases early intolerance risk",
        onsetWindow: "Week 1-3",
      },
      {
        event: "Fatigue / inconsistent glycemic response",
        likelihood: "Moderate",
        mechanism: "Beta-cell incretin sensitivity is blunted; response less predictable",
        onsetWindow: "Week 1-6",
      },
      {
        event: "Hypoglycemia awareness changes",
        likelihood: "Low",
        mechanism: "Altered insulin secretion dynamics during titration",
        onsetWindow: "Week 2-8",
      },
    ],
    prescribingActions: [
      {
        action: "Use adaptive split cadence; physician checkpoint before week-five escalation",
        rationale: "TCF7L2 makes dose response less predictable on rigid weekly protocol",
        priority: "Required",
      },
      {
        action: "Trend fasting and post-prandial glucose before each escalation",
        rationale: "Beta-cell incretin sensitivity is reduced in carriers",
        priority: "Required",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Moderate",
      recommendation:
        "Avoid assuming standard weekly titration will produce predictable metabolic response; use trend-based monitoring and split dosing.",
      alternatives: [
        "Lower starting exposure with extended observation",
        "CGM-assisted titration if available",
      ],
    },
    deepDive: {
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
    sourceDetail: "Used as a phenotype modifier, not as a standalone medication-selection rule.",
    contributesTo: ["appetite_adherence"],
    sideEffects: [
      {
        event: "Appetite rebound / craving",
        likelihood: "Moderate",
        mechanism: "FTO-associated appetite regulation may blunt perceived satiety benefit",
        onsetWindow: "Week 2-8",
      },
      {
        event: "Adherence friction (missed doses)",
        likelihood: "Moderate",
        mechanism: "Variable satiety and hunger cues can reduce protocol compliance",
        onsetWindow: "Week 1-4",
      },
    ],
    prescribingActions: [
      {
        action: "Add protein preload and appetite-score instrumentation",
        rationale: "FTO homozygous state supports behavioral monitoring over PK change",
        priority: "Recommended",
      },
      {
        action: "Distinguish medication failure from hunger-pathway biology before escalation",
        rationale: "Appetite phenotype may mask drug response",
        priority: "Monitor",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Optional",
      recommendation:
        "Enhance behavioral support and appetite tracking; does not alone change drug class selection.",
      alternatives: [
        "Nutrition coaching alongside pharmacotherapy",
        "Extended behavioral observation before dose acceleration",
      ],
    },
    deepDive: {
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
    mechanism: "MC4R pathway regulates hypothalamic satiety signaling and energy homeostasis.",
    source: "PMID: 18454148 - Common variants near MC4R associated with fat mass and obesity",
    sourceDetail:
      "Used to explain why the CDS plan includes protein preload and satiety-score follow-up.",
    contributesTo: ["appetite_adherence"],
    sideEffects: [
      {
        event: "Hunger rebound between doses",
        likelihood: "Moderate",
        mechanism: "Melanocortin satiety pathway may counteract early pharmacologic satiety",
        onsetWindow: "Week 1-4",
      },
      {
        event: "Craving / night eating",
        likelihood: "Moderate",
        mechanism: "Hypothalamic energy-homeostasis signal affects adherence",
        onsetWindow: "Week 2-6",
      },
    ],
    prescribingActions: [
      {
        action: "Week-by-week satiety checkpoints before escalation",
        rationale: "MC4R supports higher-touch appetite monitoring",
        priority: "Recommended",
      },
      {
        action: "Protein compliance and meal-timing coaching",
        rationale: "Distinguish pathway biology from inadequate drug exposure",
        priority: "Monitor",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Optional",
      recommendation:
        "Prioritize appetite and adherence monitoring during initiation; not a dose-selection driver alone.",
      alternatives: ["Behavioral satiety protocol", "Delayed escalation if cravings persist"],
    },
    deepDive: {
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
    contributesTo: ["glycemic_variability"],
    sideEffects: [
      {
        event: "Glycemic variability",
        likelihood: "Moderate",
        mechanism: "Beta-cell channel biology may blunt predictable insulin secretion response",
        onsetWindow: "Week 1-8",
      },
      {
        event: "Fatigue / dizziness",
        likelihood: "Low",
        mechanism: "Less predictable glucose excursions during titration",
        onsetWindow: "Week 2-6",
      },
    ],
    prescribingActions: [
      {
        action: "Trend glucose response before dose acceleration",
        rationale: "KCNJ11 adds beta-cell response uncertainty",
        priority: "Monitor",
      },
      {
        action: "Use CGM if available for objective trending",
        rationale: "Supportive marker strengthens case for measured response",
        priority: "Monitor",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Optional",
      recommendation: "Monitor glycemic response; variant supports trending, not dose change alone.",
      alternatives: ["Standard monitoring without CGM if unavailable"],
    },
    deepDive: {
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
    sourceDetail: "Included as a safety-context variant, not as a direct contraindication.",
    contributesTo: ["hepatic_safety"],
    sideEffects: [
      {
        event: "ALT/AST elevation",
        likelihood: "Moderate",
        mechanism: "Hepatic fat susceptibility plus borderline baseline enzymes",
        onsetWindow: "Week 2-12",
      },
      {
        event: "NAFLD progression concern",
        likelihood: "Low",
        mechanism: "PNPLA3 I148M-region associated with hepatic triglyceride remodeling",
        onsetWindow: "Ongoing surveillance",
      },
    ],
    prescribingActions: [
      {
        action: "Repeat ALT/AST before week-five escalation",
        rationale: "PNPLA3 + borderline enzymes raise hepatic surveillance priority",
        priority: "Required",
      },
      {
        action: "Hold escalation if ALT/AST rise >2x baseline",
        rationale: "Hepatic safety context from genotype and biomarkers",
        priority: "Required",
      },
    ],
    cpic: {
      drugs: ["Semaglutide", "Tirzepatide", "GLP-1/GIP agonists"],
      strength: "Moderate",
      recommendation:
        "Surveillance for hepatic enzymes during initiation; not a contraindication but raises follow-up priority.",
      alternatives: ["Defer escalation pending liver panel", "Lifestyle review for alcohol/NAFLD risk"],
    },
    deepDive: {
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
  },
];

/** Lookup deep-dive / profile by rsID marker. */
export function getGeneProfileByMarker(marker: string): GeneClinicalProfile | undefined {
  return geneProfiles.find((p) => p.marker === marker);
}
