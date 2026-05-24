/**
 * POST /api/cases/[id]/run-pipeline — execute 5-stage science engine
 */

import { NextResponse } from "next/server";
import { getCase, readGenomicFile, updateCase } from "@/lib/cases/store";
import { composePlan } from "@/lib/planning/composer";
import { runPipeline } from "@/lib/science/pipeline/runPipeline";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getCase(id);
  if (!existing) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const content = await readGenomicFile(id);
  if (!content) {
    return NextResponse.json({ error: "No genomic file uploaded" }, { status: 400 });
  }

  try {
    await updateCase(id, { status: "pipeline_running" });

    const snapshot = await runPipeline(content, {
      drug: existing.targetDrug,
      intake: {
        bmi: existing.intake.bmi,
        eGFR: existing.intake.eGFR,
        altAst: existing.intake.altAst,
        reportedSideEffects: existing.intake.reportedSideEffects,
      },
    });

    const plan = composePlan(snapshot);

    const updated = await updateCase(id, {
      status: "pipeline_complete",
      pipelineSnapshot: snapshot,
      composedPlan: plan,
    });

    return NextResponse.json({ case: updated, snapshot, plan });
  } catch (err) {
    await updateCase(id, { status: "genomic_uploaded" });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pipeline failed" },
      { status: 500 },
    );
  }
}
