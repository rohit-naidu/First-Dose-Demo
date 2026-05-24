/**
 * GET   /api/cases/[id] — fetch one case
 * PATCH /api/cases/[id] — update intake or status
 */

import { NextResponse } from "next/server";
import { getCase, updateCase } from "@/lib/cases/store";
import { DEMO_CASE_ID } from "@/lib/demo/constants";
import { ensureDemoCase } from "@/lib/demo/ensureDemoCase";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (id === DEMO_CASE_ID) {
    const record = await ensureDemoCase();
    return NextResponse.json({ case: record });
  }

  const record = await getCase(id);
  if (!record) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  return NextResponse.json({ case: record });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = await updateCase(id, body);
    if (!updated) return NextResponse.json({ error: "Case not found" }, { status: 404 });
    return NextResponse.json({ case: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 },
    );
  }
}
