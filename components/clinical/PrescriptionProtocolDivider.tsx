"use client";

/**
 * Visual divider between science review and prescription protocol sections.
 */

import { ui } from "@/lib/ui/clinicalTheme";

type PrescriptionProtocolDividerProps = {
  approved?: boolean;
};

export function PrescriptionProtocolDivider({ approved }: PrescriptionProtocolDividerProps) {
  return (
    <div className="my-4 border-y-2 border-[#003366] bg-[#e8f0f8] px-4 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-[#003366]">
        — Prescription protocol {approved ? "(approved)" : "(draft — pending physician approval)"} —
      </p>
      <p className={`mt-1 ${ui.muted}`}>
        Generated from the genomic science review above. Genetics inform the plan; clinician approval
        finalizes it.
      </p>
    </div>
  );
}
