/**
 * POST /api/demo/launch — create or refresh the pre-built demo case and return its URL.
 */

import { NextResponse } from "next/server";
import { DEMO_CASE_ID } from "@/lib/demo/constants";
import { ensureDemoCase } from "@/lib/demo/ensureDemoCase";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const force = Boolean((body as { force?: boolean }).force);

    const clinicalCase = await ensureDemoCase(force);

    return NextResponse.json({
      case: clinicalCase,
      caseId: DEMO_CASE_ID,
      url: `/cases/${DEMO_CASE_ID}?demo=1`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Demo launch failed" },
      { status: 500 },
    );
  }
}
