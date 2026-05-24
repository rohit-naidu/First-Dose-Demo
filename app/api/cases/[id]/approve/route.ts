/**
 * POST /api/cases/[id]/approve — physician approves the composed plan
 */

import { NextResponse } from "next/server";
import { getCase, updateCase } from "@/lib/cases/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getCase(id);
  if (!existing) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  if (existing.status !== "pipeline_complete" && existing.status !== "rejected") {
    return NextResponse.json({ error: "Pipeline must complete before approval" }, { status: 400 });
  }

  const updated = await updateCase(id, {
    status: "approved",
    approvedAt: new Date().toISOString(),
    rejectionNote: undefined,
    rejectedAt: undefined,
  });

  return NextResponse.json({ case: updated });
}
