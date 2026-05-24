"use client";

import { ui } from "@/lib/ui/clinicalTheme";
import type { CompositeSideEffect, VariantTableRow } from "@/lib/clinical/types";
import { SideEffectProfile } from "./SideEffectProfile";
import { VariantTable } from "./VariantTable";

type ClinicalBriefProps = {
  onSelectGene: (marker: string) => void;
  onOpenFullReport: () => void;
  variants: VariantTableRow[];
  sideEffects: CompositeSideEffect[];
  /** When false, show science-review empty guidance instead of hiding everything. */
  hasGenomicData: boolean;
};

/**
 * Compact variant + side-effect summary (science sections 1 & 4 condensed).
 * Full 5-stage detail lives in ScienceReviewPanel above this component.
 */
export function ClinicalBrief({
  onSelectGene,
  onOpenFullReport,
  variants,
  sideEffects,
  hasGenomicData,
}: ClinicalBriefProps) {
  if (!hasGenomicData) {
    return (
      <section className={ui.panel}>
        <div className={ui.panelTitle}>Genomic summary</div>
        <div className={ui.panelBody}>
          <p className="text-sm text-[#800000]">
            No panel SNPs were parsed from the uploaded file. Review the genomic file status bar and
            science review Stage 1 — upload the raw .txt from inside the zip, not the zip itself.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className={ui.panel}>
        <div className={`${ui.panelTitle} flex flex-wrap items-center justify-between gap-2`}>
          <span>Genomic summary — variants &amp; side effects</span>
          <button className={ui.btnPrimary} onClick={onOpenFullReport} type="button">
            Full genomic report…
          </button>
        </div>
        <div className={ui.panelBody}>
          <p className={ui.muted}>
            Condensed view — see Genomic science review above for the full 5-stage evidence chain.
          </p>
        </div>
      </div>

      <div>
        <p className={ui.sectionHeading}>Identified variants</p>
        <VariantTable onSelectGene={onSelectGene} rows={variants} />
      </div>

      <div>
        <p className={ui.sectionHeading}>Side-effect profile</p>
        <SideEffectProfile effects={sideEffects} onSelectGene={onSelectGene} />
      </div>
    </section>
  );
}
