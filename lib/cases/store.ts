/**
 * JSON file storage for clinical cases.
 * Each case lives at data/cases/{id}.json (gitignored).
 */

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { CaseListItem, ClinicalCase, CreateCasePayload, PatientIntake } from "./types";

/** Directory where case JSON files are stored. */
const DATA_DIR = path.join(process.cwd(), "data", "cases");

/** Ensure the storage folder exists before read/write. */
async function ensureDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/** Build a filesystem-safe path for one case id. */
function casePath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

/** Read one case from disk; returns null if missing. */
export async function getCase(id: string): Promise<ClinicalCase | null> {
  await ensureDir();
  try {
    const raw = await fs.readFile(casePath(id), "utf8");
    return JSON.parse(raw) as ClinicalCase;
  } catch {
    return null;
  }
}

/** Write the full case record back to disk. */
export async function saveCase(record: ClinicalCase): Promise<void> {
  await ensureDir();
  record.updatedAt = new Date().toISOString();
  await fs.writeFile(casePath(record.id), JSON.stringify(record, null, 2), "utf8");
}

/** List all cases sorted newest-first. */
export async function listCases(): Promise<CaseListItem[]> {
  await ensureDir();
  const files = await fs.readdir(DATA_DIR);
  const items: CaseListItem[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    const c = JSON.parse(raw) as ClinicalCase;
    items.push({
      id: c.id,
      patientName: `${c.intake.lastName}, ${c.intake.firstName}`,
      status: c.status,
      targetDrug: c.targetDrug,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      isDemo: c.isDemo,
    });
  }

  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Create a new draft case from intake form data. */
export async function createCase(payload: CreateCasePayload): Promise<ClinicalCase> {
  const now = new Date().toISOString();
  const record: ClinicalCase = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: "intake_complete",
    targetDrug: payload.targetDrug ?? "retatrutide",
    intake: computeBmi(payload.intake),
  };
  await saveCase(record);
  return record;
}

/** Partial update helper for PATCH routes. */
export async function updateCase(
  id: string,
  patch: Partial<
    Pick<ClinicalCase, "status" | "intake" | "targetDrug" | "rejectionNote">
  > & {
    pipelineSnapshot?: ClinicalCase["pipelineSnapshot"];
    composedPlan?: ClinicalCase["composedPlan"];
    genomicFileName?: string;
    genomicUploadedAt?: string;
    genomicExtractedFrom?: string;
    genomicExtractNote?: string;
    approvedAt?: string;
    rejectedAt?: string;
  },
): Promise<ClinicalCase | null> {
  const existing = await getCase(id);
  if (!existing) return null;
  const merged: ClinicalCase = {
    ...existing,
    ...patch,
    intake: patch.intake ? { ...existing.intake, ...patch.intake } : existing.intake,
  };
  await saveCase(merged);
  return merged;
}

/** Save uploaded genomic file bytes under data/cases/{id}/genomic.txt */
export async function saveGenomicFile(
  id: string,
  _fileName: string,
  content: string,
): Promise<string> {
  const dir = path.join(process.cwd(), "data", "cases", id);
  await fs.mkdir(dir, { recursive: true });
  const stored = path.join(dir, "genomic.txt");
  await fs.writeFile(stored, content, "utf8");
  return stored;
}

/** Read stored genomic file for pipeline processing. */
export async function readGenomicFile(id: string): Promise<string | null> {
  try {
    return await fs.readFile(
      path.join(process.cwd(), "data", "cases", id, "genomic.txt"),
      "utf8",
    );
  } catch {
    return null;
  }
}

/** Compute BMI when height/weight provided at intake. */
export function computeBmi(intake: PatientIntake): PatientIntake {
  const copy = { ...intake };
  if (copy.heightCm && copy.weightKg && !copy.bmi) {
    const m = copy.heightCm / 100;
    copy.bmi = Math.round((copy.weightKg / (m * m)) * 10) / 10;
  }
  return copy;
}
