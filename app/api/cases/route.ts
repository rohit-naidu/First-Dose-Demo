/**
 * GET  /api/cases — list all cases
 * POST /api/cases — create a new case from intake form
 */

import { NextResponse } from "next/server";
import { createCase, listCases } from "@/lib/cases/store";
import type { CreateCasePayload } from "@/lib/cases/types";

export async function GET() {
  const cases = await listCases();
  return NextResponse.json({ cases });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCasePayload;
    if (!body.intake?.firstName || !body.intake?.lastName) {
      return NextResponse.json({ error: "firstName and lastName required" }, { status: 400 });
    }
    const record = await createCase(body);
    return NextResponse.json({ case: record }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create case" },
      { status: 500 },
    );
  }
}
