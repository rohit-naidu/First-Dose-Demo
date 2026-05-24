/**
 * Creates or refreshes the pre-built hackathon demo case.
 * Loads fixtures/sample-23andme.txt, runs the real 5-stage pipeline, and persists results.
 */

import fs from "fs/promises";
import path from "path";
import { composePlan } from "@/lib/planning/composer";
import {
  getCase,
  readGenomicFile,
  saveCase,
  saveGenomicFile,
  updateCase,
} from "@/lib/cases/store";
import type { ClinicalCase } from "@/lib/cases/types";
import { runPipeline } from "@/lib/science/pipeline/runPipeline";
import { DEMO_CASE_ID, DEMO_GENOMIC_FIXTURE } from "./constants";
import { demoIntake } from "./demoIntake";

/** Read the curated genomic fixture from disk. */
async function readDemoGenomicFixture(): Promise<string> {
  const fixturePath = path.join(process.cwd(), DEMO_GENOMIC_FIXTURE);
  return fs.readFile(fixturePath, "utf8");
}

/**
 * Build a fresh demo case record (intake + metadata only).
 */
function buildDemoCaseShell(now: string): ClinicalCase {
  return {
    id: DEMO_CASE_ID,
    createdAt: now,
    updatedAt: now,
    status: "intake_complete",
    targetDrug: "retatrutide",
    intake: demoIntake,
    isDemo: true,
  };
}

/**
 * Ensure the demo case exists with a completed pipeline snapshot.
 * @param force When true, re-runs pipeline even if results already exist.
 */
export async function ensureDemoCase(force = false): Promise<ClinicalCase> {
  const existing = await getCase(DEMO_CASE_ID);

  if (
    !force &&
    existing?.pipelineSnapshot &&
    existing.composedPlan &&
    existing.status === "pipeline_complete"
  ) {
    const stored = await readGenomicFile(DEMO_CASE_ID);
    if (stored) return existing;
  }

  const now = new Date().toISOString();
  const shell = existing
    ? {
        ...existing,
        intake: demoIntake,
        targetDrug: "retatrutide" as const,
        status: "intake_complete" as const,
        isDemo: true,
        approvedAt: undefined,
        rejectedAt: undefined,
        rejectionNote: undefined,
        pipelineSnapshot: undefined,
        composedPlan: undefined,
      }
    : buildDemoCaseShell(now);

  await saveCase(shell);

  const genomicContent = await readDemoGenomicFixture();
  await saveGenomicFile(DEMO_CASE_ID, "sample-23andme.txt", genomicContent);

  await updateCase(DEMO_CASE_ID, {
    status: "pipeline_running",
    genomicFileName: "sample-23andme.txt",
    genomicUploadedAt: now,
  });

  const snapshot = await runPipeline(genomicContent, {
    drug: "retatrutide",
    intake: {
      bmi: demoIntake.bmi,
      eGFR: demoIntake.eGFR,
      altAst: demoIntake.altAst,
      reportedSideEffects: demoIntake.reportedSideEffects,
    },
  });

  const plan = composePlan(snapshot);

  const updated = await updateCase(DEMO_CASE_ID, {
    status: "pipeline_complete",
    pipelineSnapshot: snapshot,
    composedPlan: plan,
  });

  if (!updated) {
    throw new Error("Failed to persist demo case after pipeline run");
  }

  return updated;
}
