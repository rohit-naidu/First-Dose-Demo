/**
 * Science engine orchestrator — runs all 5 pipeline stages in order.
 */

import { annotateVariants } from "../annotator";
import { matchEvidence } from "../evidence/matcher";
import { PANEL_RSIDS } from "../evidence/panel";
import { loadEvidenceKb } from "../evidence/loader";
import { planTriggers } from "../planning/planTriggers";
import {
  countPanelCoverage,
  countTotalRsLines,
  getFullPanelRows,
  looksLikeGenomicText,
  parse23andMeFile,
} from "../parser";
import { reconcileSideEffects } from "../synthesis/reconcileSideEffects";
import { synthesizeSideEffects } from "../synthesis/sideEffects";
import type { PipelineOptions, PipelineSnapshot } from "../types";

/**
 * Run the full genomic CDS pipeline on raw file content.
 * @param content 23andMe-style file text
 * @param options drug target, optional Ensembl, intake context
 */
export async function runPipeline(
  content: string,
  options: PipelineOptions = {},
): Promise<PipelineSnapshot> {
  const drug = options.drug ?? "retatrutide";
  const kb = loadEvidenceKb();

  const panelRows = getFullPanelRows(content);
  const coverage = countPanelCoverage(panelRows);

  // Stage 1: parse panel SNPs found in file
  const parsedVariants = parse23andMeFile(content);

  // Stage 2: annotate
  const annotatedVariants = await annotateVariants(parsedVariants, options.useEnsembl ?? false);

  // Stage 3: match evidence KB
  const evidenceMatches = matchEvidence(annotatedVariants);

  // Stage 4: synthesize + reconcile with reported symptoms
  const synthesizedProfiles = synthesizeSideEffects(evidenceMatches);
  const reconciledSideEffects = reconcileSideEffects(
    synthesizedProfiles,
    options.intake?.reportedSideEffects ?? [],
  );

  // Stage 5: plan triggers
  const triggers = planTriggers(synthesizedProfiles, drug, options.intake);

  return {
    runAt: new Date().toISOString(),
    kbVersion: kb.version,
    panelRsids: [...PANEL_RSIDS],
    parsedCount: parsedVariants.length,
    matchedCount: evidenceMatches.length,
    panelFoundCount: coverage.found,
    panelTotal: coverage.total,
    totalRsLinesInFile: countTotalRsLines(content),
    fileLooksValid: looksLikeGenomicText(content),
    panelRows,
    parsedVariants,
    annotatedVariants,
    evidenceMatches,
    synthesizedProfiles,
    reconciledSideEffects,
    planTriggers: triggers,
    drug,
  };
}
