/**
 * Pre-built intake for Alex Mercer — matches fixtures/sample-23andme.txt genotypes
 * and the deep-dive narratives in lib/clinical/geneProfiles.ts.
 */

import type { PatientIntake } from "@/lib/cases/types";
import { computeBmi } from "@/lib/cases/store";

/** Raw intake fields before BMI is computed. */
const alexMercerRaw: PatientIntake = {
  firstName: "Alex",
  lastName: "Mercer",
  preferredName: "Alex",
  dateOfBirth: "14 Mar 1992",
  sexAtBirth: "Female",
  genderIdentity: "Woman",
  ancestry: "Non-Hispanic White (self-report); EUR-enriched panel",
  heightCm: 170,
  weightKg: 89.8,
  eGFR: "74 mL/min/1.73m²",
  altAst: "38/41 U/L",
  primaryIndication: "Obesity management / metabolic syndrome",
  diagnoses: "Prediabetes (A1c 6.1%), borderline dyslipidemia, suspected NAFLD",
  currentMedications: "Metformin 500 mg BID; atorvastatin 10 mg daily; omeprazole 20 mg daily",
  allergies: "NKDA",
  pregnancyStatus: "Not pregnant — LMP documented; contraception: OCP",
  phone: "(555) 014-2291",
  email: "a.mercer@email.example",
  currentDose: "",
  weeksOnTherapy: 0,
  reportedSideEffects: [
    { symptom: "Nausea / vomiting", severity: "moderate" },
    { symptom: "Early satiety / reduced appetite", severity: "mild" },
  ],
};

/** Intake with BMI computed (31.2 at 170 cm / 89.8 kg). */
export const demoIntake: PatientIntake = computeBmi(alexMercerRaw);
