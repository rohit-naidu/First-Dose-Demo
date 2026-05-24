"use client";

/**
 * Shows upload filename, extraction note, and panel SNP coverage (X/8).
 */

import type { ClinicalCase } from "@/lib/cases/types";
import type { PipelineSnapshot } from "@/lib/science/types";
import { ui } from "@/lib/ui/clinicalTheme";

type GenomicFileStatusBarProps = {
  clinicalCase: ClinicalCase;
  snapshot?: PipelineSnapshot;
};

export function GenomicFileStatusBar({ clinicalCase, snapshot }: GenomicFileStatusBarProps) {
  const hasFile = Boolean(clinicalCase.genomicFileName);
  const found = snapshot?.panelFoundCount ?? 0;
  const total = snapshot?.panelTotal ?? 8;
  const ok = found > 0 && snapshot?.fileLooksValid !== false;

  let statusMessage: string;
  let statusClass: string;

  if (!hasFile) {
    statusMessage = "No genomic file uploaded yet.";
    statusClass = "border-[#a0a0a0] bg-[#f5f5f5]";
  } else if (!snapshot) {
    statusMessage = `File uploaded: ${clinicalCase.genomicFileName}. Run pipeline to analyze.`;
    statusClass = "border-[#665500] bg-[#fff8dc]";
  } else if (!snapshot.fileLooksValid) {
    statusMessage =
      "File uploaded but content does not look like 23andMe raw data. Re-upload the .txt from inside the zip.";
    statusClass = "border-[#800000] bg-[#ffe8e8]";
  } else if (found === 0) {
    statusMessage = `0/${total} panel SNPs found. Upload the raw .txt export (not the zip). We scan 8 GLP-1–related genes.`;
    statusClass = "border-[#800000] bg-[#ffe8e8]";
  } else if (found < total) {
    statusMessage = `${found}/${total} panel SNPs found — partial chip coverage. Science review shows available loci.`;
    statusClass = "border-[#665500] bg-[#fff8dc]";
  } else {
    statusMessage = `${found}/${total} panel SNPs found — ready for science review.`;
    statusClass = "border-[#008000] bg-[#e8ffe8]";
  }

  return (
    <div className={`border-2 p-3 text-sm ${statusClass}`}>
      <p className="font-bold text-[#003366]">Genomic file status</p>
      <p className="mt-1">{statusMessage}</p>
      {hasFile ? (
        <ul className={`mt-2 list-inside list-disc ${ui.muted}`}>
          <li>File: {clinicalCase.genomicFileName}</li>
          {clinicalCase.genomicExtractNote ? (
            <li>{clinicalCase.genomicExtractNote}</li>
          ) : null}
          {snapshot ? (
            <li>
              {snapshot.totalRsLinesInFile.toLocaleString()} rsID lines in file · KB {snapshot.kbVersion}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
