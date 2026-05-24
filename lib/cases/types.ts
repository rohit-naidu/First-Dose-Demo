/**
 * Case management types for First Dose Health.
 * A "case" is one patient intake + genomic file + pipeline results.
 */

/** Lifecycle status tracked on each case file in data/cases/. */
export type CaseStatus =
  | "draft"
  | "intake_complete"
  | "genomic_uploaded"
  | "pipeline_running"
  | "pipeline_complete"
  | "approved"
  | "rejected";

/** One side effect the patient reported at intake. */
export type ReportedSideEffect = {
  symptom: string;
  severity: "mild" | "moderate" | "severe";
};

/** Demographics and clinical context collected at intake. */
export type PatientIntake = {
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  sexAtBirth: string;
  genderIdentity?: string;
  ancestry?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  eGFR?: string;
  altAst?: string;
  primaryIndication?: string;
  diagnoses?: string;
  currentMedications?: string;
  allergies?: string;
  pregnancyStatus?: string;
  phone?: string;
  email?: string;
  /** Current GLP therapy dose (e.g. "4 mg weekly"). */
  currentDose?: string;
  /** Weeks on current therapy — helps contextualize side effects. */
  weeksOnTherapy?: number;
  /** Symptoms reported at intake — merged with genetics in Stage 4. */
  reportedSideEffects?: ReportedSideEffect[];
};

/** Full persisted case record (one JSON file per case). */
export type ClinicalCase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  /** Target molecule — defaults to retatrutide (triple agonist demo). */
  targetDrug: string;
  intake: PatientIntake;
  genomicFileName?: string;
  genomicUploadedAt?: string;
  /** Original upload name when a zip was extracted server-side. */
  genomicExtractedFrom?: string;
  genomicExtractNote?: string;
  pipelineSnapshot?: import("../science/types").PipelineSnapshot;
  composedPlan?: import("../planning/types").ComposedPlan;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionNote?: string;
  /** True for the one-click hackathon demo case (demo-alex-mercer). */
  isDemo?: boolean;
};

/** Lightweight row for the case list home page. */
export type CaseListItem = {
  id: string;
  patientName: string;
  status: CaseStatus;
  targetDrug: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
};

/** Payload when creating a new case from the intake form. */
export type CreateCasePayload = {
  intake: PatientIntake;
  targetDrug?: string;
};
