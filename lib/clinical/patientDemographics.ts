/**
 * Demo patient demographics for Alex Mercer.
 * Fields chosen for pharmacogenomics / incretin CDS (ancestry, sex, BMI, comorbidities, etc.).
 */

export type DemographicField = {
  label: string;
  value: string;
  /** Short note on why this field matters for CDS (shown on intake view). */
  cdsNote?: string;
};

export type DemographicSection = {
  title: string;
  fields: DemographicField[];
};

export const patientRecord = {
  lastName: "Mercer",
  firstName: "Alex",
  preferredName: "Alex",
  mrn: "FDH-9281",
  encounterId: "FDH-INTAKE-492",
  chartStatus: "Pending intake review",
};

/** Grouped sections for the registration / chart header panel. */
export const patientDemographicSections: DemographicSection[] = [
  {
    title: "Patient identifiers",
    fields: [
      { label: "MRN", value: patientRecord.mrn },
      { label: "Encounter", value: patientRecord.encounterId },
      { label: "Chart status", value: patientRecord.chartStatus },
      { label: "Attending", value: "Dr. S. Okonkwo, MD" },
      { label: "Site", value: "First Dose — Telehealth intake" },
    ],
  },
  {
    title: "Demographics",
    fields: [
      {
        label: "Date of birth",
        value: "14 Mar 1992 (34 y)",
        cdsNote: "Age guides titration caution and renal dosing context.",
      },
      {
        label: "Sex assigned at birth",
        value: "Female",
        cdsNote: "Documented for population reference ranges and pregnancy screening.",
      },
      {
        label: "Gender identity",
        value: "Woman",
      },
      {
        label: "Ancestry / ethnicity",
        value: "Non-Hispanic White (self-report); genotyping EUR-enriched panel",
        cdsNote: "Allele frequencies for GLP1R and other loci vary by ancestry.",
      },
      {
        label: "Preferred language",
        value: "English",
      },
    ],
  },
  {
    title: "Anthropometrics & vitals",
    fields: [
      { label: "Height", value: "5 ft 7 in (170 cm)" },
      { label: "Weight", value: "198 lb (89.8 kg)" },
      { label: "BMI", value: "31.2 kg/m² (Class I obesity)", cdsNote: "Primary phenotype driver in dosing model." },
      { label: "Blood pressure", value: "128 / 82 mmHg (clinic, 12 May 2026)" },
      { label: "Heart rate", value: "72 bpm" },
    ],
  },
  {
    title: "Clinical context",
    fields: [
      {
        label: "Primary indication",
        value: "Obesity management / metabolic syndrome",
      },
      {
        label: "Relevant diagnoses",
        value: "Prediabetes (A1c 6.1%), borderline dyslipidemia, suspected NAFLD",
      },
      {
        label: "Current medications",
        value: "Metformin 500 mg BID; atorvastatin 10 mg daily; omeprazole 20 mg daily",
        cdsNote: "Drug–drug and GI tolerability context for incretin initiation.",
      },
      {
        label: "Allergies",
        value: "NKDA (no known drug allergies)",
      },
      {
        label: "Pregnancy status",
        value: "Not pregnant — LMP documented; contraception: OCP",
        cdsNote: "Required safety field before GLP-1 / GIP agonist therapy.",
      },
      {
        label: "Tobacco / alcohol",
        value: "Non-smoker; alcohol 0–2 drinks/week",
      },
    ],
  },
  {
    title: "Contact & coverage",
    fields: [
      { label: "Phone", value: "(555) 014-2291" },
      { label: "Email", value: "a.mercer@email.example" },
      { label: "Address", value: "Boston, MA 02108" },
      { label: "Insurance", value: "Commercial PPO — member ID on file" },
      { label: "Emergency contact", value: "Jordan Mercer (spouse) — (555) 014-2290" },
    ],
  },
];

/** Quick-scan values for the navy chart banner. */
export const patientBannerHighlights: DemographicField[] = [
  { label: "Age", value: "34 y" },
  { label: "Sex (ASAB)", value: "Female" },
  { label: "Gender", value: "Woman" },
  { label: "BMI", value: "31.2" },
  { label: "Ancestry", value: "NHW / EUR panel" },
  { label: "eGFR", value: "74 mL/min/1.73m²" },
  { label: "Status", value: "Pending review" },
  { label: "Module", value: "PGx CDS" },
];
