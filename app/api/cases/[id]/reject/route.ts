/**
 * POST /api/cases/[id]/reject — physician rejects the protocol
 */

import { NextResponse } from "next/server";
import { getCase, updateCase } from "@/lib/cases/store";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getCase(id);
  if (!existing) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  let note = "Protocol rejected by physician";
  try {
    const body = await request.json();
    if (body?.note) note = String(body.note);
  } catch {
    // body optional
  }

  const updated = await updateCase(id, {
    status: "rejected",
    rejectedAt: new Date().toISOString(),
    rejectionNote: note,
  });

  return NextResponse.json({ case: updated });
}
