"use client";

import type { PatientIntake } from "@/lib/cases/types";
import { ui } from "@/lib/ui/clinicalTheme";

type DemographicField = {
  label: string;
  value: string;
  cdsNote?: string;
};

type PatientDemographicsPanelProps = {
  variant: "intake" | "chart";
  /** Live intake from case record. */
  intake: PatientIntake;
  caseId?: string;
  status?: string;
};

/**
 * Patient registration / demographics — EMR-style tables wired to case intake data.
 */
export function PatientDemographicsPanel({
  variant,
  intake,
  caseId,
  status,
}: PatientDemographicsPanelProps) {
  const isIntake = variant === "intake";
  const sections = buildSections(intake, caseId, status);

  return (
    <div className={ui.panel}>
      <div className={ui.panelTitle}>
        {isIntake ? "Patient registration & demographics" : "Patient demographics (chart)"}
      </div>
      <div className={ui.panelBody}>
        <p className={`mb-2 ${ui.muted}`}>
          {intake.lastName}, {intake.firstName}
          {intake.preferredName && intake.preferredName !== intake.firstName
            ? ` (${intake.preferredName})`
            : ""}{" "}
          — verify before molecular file processing.
        </p>

        <div className={isIntake ? "space-y-2" : "grid gap-2 lg:grid-cols-2"}>
          {sections.map((section) => (
            <div key={section.title} className={ui.insetBox}>
              <p className="mb-1 border-b border-[#c0c0c0] pb-1 text-xs font-bold uppercase text-[#003366]">
                {section.title}
              </p>
              <table className={`${ui.table} min-w-0`}>
                <tbody>
                  {section.fields.map((field) => (
                    <tr key={field.label} className="odd:bg-white even:bg-[#fafafa]">
                      <td className={`${ui.td} w-36 align-top font-semibold text-[#333]`}>
                        {field.label}
                      </td>
                      <td className={ui.td}>
                        <span className="block border border-[#c0c0c0] bg-[#fafafa] px-1 py-0.5">
                          {field.value || "—"}
                        </span>
                        {isIntake && field.cdsNote ? (
                          <p className="mt-1 text-[10px] italic text-[#665500]">
                            CDS: {field.cdsNote}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildSections(
  intake: PatientIntake,
  caseId?: string,
  status?: string,
): { title: string; fields: DemographicField[] }[] {
  const bmi =
    intake.bmi ??
    (intake.heightCm && intake.weightKg
      ? Math.round((intake.weightKg / (intake.heightCm / 100) ** 2) * 10) / 10
      : undefined);

  return [
    {
      title: "Patient identifiers",
      fields: [
        { label: "Case ID", value: caseId ?? "—" },
        { label: "Status", value: status?.replace(/_/g, " ") ?? "—" },
        { label: "Date of birth", value: intake.dateOfBirth },
      ],
    },
    {
      title: "Demographics",
      fields: [
        {
          label: "Sex at birth",
          value: intake.sexAtBirth,
          cdsNote: "Guides population reference ranges.",
        },
        { label: "Gender identity", value: intake.genderIdentity ?? "—" },
        {
          label: "Ancestry",
          value: intake.ancestry ?? "—",
          cdsNote: "Allele frequencies vary by ancestry.",
        },
      ],
    },
    {
      title: "Anthropometrics & labs",
      fields: [
        { label: "Height (cm)", value: intake.heightCm ? String(intake.heightCm) : "—" },
        { label: "Weight (kg)", value: intake.weightKg ? String(intake.weightKg) : "—" },
        {
          label: "BMI",
          value: bmi ? `${bmi} kg/m²` : "—",
          cdsNote: "Primary phenotype driver in dosing model.",
        },
        { label: "eGFR", value: intake.eGFR ?? "—" },
        { label: "ALT/AST", value: intake.altAst ?? "—" },
      ],
    },
    {
      title: "Clinical context",
      fields: [
        { label: "Primary indication", value: intake.primaryIndication ?? "—" },
        { label: "Diagnoses", value: intake.diagnoses ?? "—" },
        { label: "Medications", value: intake.currentMedications ?? "—" },
        { label: "Allergies", value: intake.allergies ?? "—" },
      ],
    },
  ];
}
