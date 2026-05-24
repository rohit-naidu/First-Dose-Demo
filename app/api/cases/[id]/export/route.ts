/**
 * GET /api/cases/[id]/export — printable HTML clinical summary
 */

import { NextResponse } from "next/server";
import { getCase } from "@/lib/cases/store";
import { adaptPipelineToUi } from "@/lib/clinical/pipelineAdapter";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const record = await getCase(id);
  if (!record) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  if (!record.pipelineSnapshot || !record.composedPlan) {
    return NextResponse.json({ error: "No pipeline results to export" }, { status: 400 });
  }

  const ui = adaptPipelineToUi(record.pipelineSnapshot, record.composedPlan);
  const { intake } = record;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>First Dose Export — ${intake.lastName}, ${intake.firstName}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 24px; color: #1a1a1a; }
    h1 { color: #003366; font-size: 18px; }
    h2 { color: #003366; font-size: 14px; margin-top: 20px; border-bottom: 1px solid #808080; }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; }
    th, td { border: 1px solid #ccc; padding: 4px 8px; text-align: left; }
    th { background: #d4d0c8; }
    .warn { background: #fff8dc; padding: 8px; border: 1px solid #996600; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>First Dose Health — Clinical Summary</h1>
  <p><strong>Patient:</strong> ${intake.lastName}, ${intake.firstName} · DOB ${intake.dateOfBirth}</p>
  <p><strong>Drug:</strong> ${record.targetDrug} · <strong>Status:</strong> ${record.status}</p>
  <p class="warn">FDA CDS Class I — physician verification required. Demonstration export only.</p>

  <h2>Prescribing plan</h2>
  <table>
    <tr><th>Molecule</th><td>${ui.prescribingPlan.molecule}</td></tr>
    <tr><th>Cadence</th><td>${ui.prescribingPlan.cadence}</td></tr>
    <tr><th>Starting dose</th><td>${ui.prescribingPlan.startingDose}</td></tr>
    <tr><th>Escalation</th><td>${ui.prescribingPlan.escalationRule}</td></tr>
    <tr><th>Hold criteria</th><td>${ui.prescribingPlan.holdCriteria}</td></tr>
  </table>

  <h2>Identified variants (${ui.variants.length})</h2>
  <table>
    <thead><tr><th>Gene</th><th>rsID</th><th>Genotype</th><th>Interpretation</th><th>Impact</th></tr></thead>
    <tbody>
      ${ui.variants
        .map(
          (v) =>
            `<tr><td>${v.gene}</td><td>${v.marker}</td><td>${v.genotype}</td><td>${v.clinicalTag}</td><td>${v.impactTier}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>Side-effect profile</h2>
  <table>
    <thead><tr><th>Event</th><th>Likelihood</th><th>Onset</th><th>Driven by</th></tr></thead>
    <tbody>
      ${ui.sideEffects
        .map(
          (se) =>
            `<tr><td>${se.event}</td><td>${se.likelihood}</td><td>${se.onsetWindow}</td><td>${se.drivenBy.map((d) => d.gene).join(", ")}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <p><em>Generated ${new Date().toISOString()} · KB ${record.pipelineSnapshot.kbVersion}</em></p>
  <button onclick="window.print()">Print</button>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
