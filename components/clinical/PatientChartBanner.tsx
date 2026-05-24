"use client";

import type { PatientIntake } from "@/lib/cases/types";
import { ui } from "@/lib/ui/clinicalTheme";

type PatientChartBannerProps = {
  intake: PatientIntake;
  caseId: string;
  status: string;
  targetDrug: string;
};

/**
 * Top-of-chart banner with name and key demographic highlights from live case data.
 */
export function PatientChartBanner({
  intake,
  caseId,
  status,
  targetDrug,
}: PatientChartBannerProps) {
  const bmi =
    intake.bmi ??
    (intake.heightCm && intake.weightKg
      ? Math.round((intake.weightKg / (intake.heightCm / 100) ** 2) * 10) / 10
      : undefined);

  const therapyLine = [
    intake.currentDose ? `Dose ${intake.currentDose}` : null,
    intake.weeksOnTherapy != null ? `Week ${intake.weeksOnTherapy}` : null,
    intake.reportedSideEffects && intake.reportedSideEffects.length > 0
      ? `Sx: ${intake.reportedSideEffects.map((s) => s.symptom).join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const highlights = [
    { label: "DOB", value: intake.dateOfBirth },
    { label: "Sex", value: intake.sexAtBirth },
    { label: "BMI", value: bmi ? String(bmi) : "—" },
    { label: "eGFR", value: intake.eGFR ?? "—" },
    { label: "Drug", value: targetDrug },
    { label: "Status", value: status.replace(/_/g, " ") },
    { label: "Case", value: caseId.slice(0, 8) },
    { label: "Module", value: "PGx CDS" },
  ];

  return (
    <header className={ui.banner}>
      <div className={ui.bannerInner}>
        <div>
          <p className={ui.bannerLabel}>Patient chart</p>
          <h2 className={ui.bannerTitle}>
            {intake.lastName}, {intake.firstName} — {caseId.slice(0, 8).toUpperCase()}
          </h2>
          <p className="mt-0.5 text-xs text-[#b8d4f0]">
            Target {targetDrug} · {status.replace(/_/g, " ")}
            {therapyLine ? ` · ${therapyLine}` : ""}
          </p>
        </div>
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {highlights.map((item) => (
            <div key={item.label} className={ui.statCell}>
              <p className={ui.statLabel}>{item.label}</p>
              <p className={ui.statValue}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
