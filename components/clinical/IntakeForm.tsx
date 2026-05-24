"use client";

/**
 * Patient intake form — demographics, therapy context, reported side effects.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PatientIntake, ReportedSideEffect } from "@/lib/cases/types";
import { ui } from "@/lib/ui/clinicalTheme";

const SIDE_EFFECT_OPTIONS = [
  "Nausea / vomiting",
  "Constipation",
  "Diarrhea",
  "Fatigue",
  "Hypoglycemia",
  "Injection site reaction",
  "Headache",
  "Early satiety / reduced appetite",
];

const emptyIntake: PatientIntake = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sexAtBirth: "Female",
  genderIdentity: "",
  ancestry: "",
  heightCm: undefined,
  weightKg: undefined,
  eGFR: "",
  altAst: "",
  primaryIndication: "Obesity management / metabolic syndrome",
  diagnoses: "",
  currentMedications: "",
  allergies: "NKDA",
  pregnancyStatus: "",
  phone: "",
  email: "",
  currentDose: "",
  weeksOnTherapy: undefined,
  reportedSideEffects: [],
};

export function IntakeForm() {
  const router = useRouter();
  const [intake, setIntake] = useState<PatientIntake>(emptyIntake);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, ReportedSideEffect["severity"]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof PatientIntake>(key: K, value: PatientIntake[K]) {
    setIntake((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) => {
      const next = { ...prev };
      if (next[symptom]) delete next[symptom];
      else next[symptom] = "moderate";
      return next;
    });
  }

  function setSymptomSeverity(symptom: string, severity: ReportedSideEffect["severity"]) {
    setSelectedSymptoms((prev) => ({ ...prev, [symptom]: severity }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const reportedSideEffects: ReportedSideEffect[] = Object.entries(selectedSymptoms).map(
      ([symptom, severity]) => ({ symptom, severity }),
    );

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intake: {
            ...intake,
            heightCm: intake.heightCm ? Number(intake.heightCm) : undefined,
            weightKg: intake.weightKg ? Number(intake.weightKg) : undefined,
            weeksOnTherapy: intake.weeksOnTherapy ? Number(intake.weeksOnTherapy) : undefined,
            reportedSideEffects,
          },
          targetDrug: "retatrutide",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      router.push(`/cases/${data.case.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className={ui.panel}>
        <div className={ui.panelTitle}>Patient identifiers</div>
        <div className={`${ui.panelBody} grid gap-2 lg:grid-cols-2`}>
          <Field label="First name *" required>
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("firstName", e.target.value)}
              required
              value={intake.firstName}
            />
          </Field>
          <Field label="Last name *" required>
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("lastName", e.target.value)}
              required
              value={intake.lastName}
            />
          </Field>
          <Field label="Date of birth *" required>
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              placeholder="14 Mar 1992"
              required
              type="text"
              value={intake.dateOfBirth}
            />
          </Field>
          <Field label="Sex at birth">
            <select
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("sexAtBirth", e.target.value)}
              value={intake.sexAtBirth}
            >
              <option>Female</option>
              <option>Male</option>
              <option>Intersex</option>
            </select>
          </Field>
        </div>
      </div>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Therapy context (retatrutide)</div>
        <div className={`${ui.panelBody} grid gap-2 lg:grid-cols-2`}>
          <Field label="Current dose">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("currentDose", e.target.value)}
              placeholder="e.g. 4 mg weekly"
              value={intake.currentDose ?? ""}
            />
          </Field>
          <Field label="Weeks on therapy">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              min={0}
              onChange={(e) =>
                updateField("weeksOnTherapy", e.target.value ? Number(e.target.value) : undefined)
              }
              type="number"
              value={intake.weeksOnTherapy ?? ""}
            />
          </Field>
        </div>
      </div>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Reported side effects</div>
        <div className={ui.panelBody}>
          <p className={`mb-2 ${ui.muted}`}>
            Select symptoms the patient is experiencing — merged with genetics in science Stage 4.
          </p>
          <div className="space-y-2">
            {SIDE_EFFECT_OPTIONS.map((symptom) => {
              const checked = Boolean(selectedSymptoms[symptom]);
              return (
                <div key={symptom} className="flex flex-wrap items-center gap-2 border border-[#ddd] p-2">
                  <label className="flex min-w-[200px] items-center gap-2 text-sm">
                    <input
                      checked={checked}
                      onChange={() => toggleSymptom(symptom)}
                      type="checkbox"
                    />
                    {symptom}
                  </label>
                  {checked ? (
                    <select
                      className="border border-[#a0a0a0] px-2 py-0.5 text-sm"
                      onChange={(e) =>
                        setSymptomSeverity(symptom, e.target.value as ReportedSideEffect["severity"])
                      }
                      value={selectedSymptoms[symptom]}
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Anthropometrics &amp; labs</div>
        <div className={`${ui.panelBody} grid gap-2 lg:grid-cols-2`}>
          <Field label="Height (cm)">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("heightCm", Number(e.target.value) || undefined)}
              type="number"
              value={intake.heightCm ?? ""}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("weightKg", Number(e.target.value) || undefined)}
              type="number"
              value={intake.weightKg ?? ""}
            />
          </Field>
          <Field label="eGFR">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("eGFR", e.target.value)}
              placeholder="74 mL/min/1.73m²"
              value={intake.eGFR ?? ""}
            />
          </Field>
          <Field label="ALT/AST">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("altAst", e.target.value)}
              placeholder="38/41 U/L"
              value={intake.altAst ?? ""}
            />
          </Field>
        </div>
      </div>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Clinical context</div>
        <div className={`${ui.panelBody} grid gap-2`}>
          <Field label="Primary indication">
            <input
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("primaryIndication", e.target.value)}
              value={intake.primaryIndication ?? ""}
            />
          </Field>
          <Field label="Current medications">
            <textarea
              className="w-full border border-[#a0a0a0] px-2 py-1"
              onChange={(e) => updateField("currentMedications", e.target.value)}
              rows={2}
              value={intake.currentMedications ?? ""}
            />
          </Field>
        </div>
      </div>

      {error ? <p className="text-sm text-[#800000]">{error}</p> : null}

      <button className={ui.btnPrimary} disabled={submitting} type="submit">
        {submitting ? "Creating…" : "Create case & open workstation"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}
