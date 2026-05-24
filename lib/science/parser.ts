/**
 * Stage 1 — Parse 23andMe / Ancestry-style raw genomic files.
 * Reads tab-separated rsid rows and filters to our 8-SNP panel.
 */

import { PANEL_GENE_MAP, PANEL_RSIDS, isPanelRsid } from "./evidence/panel";
import type { PanelRow, ParsedVariant } from "./types";

/** Convert compact genotype (e.g. "AG") to display form "A/G". */
export function formatGenotype(raw: string): string {
  const g = raw.trim().toUpperCase();
  if (g === "--" || g === "" || g === "NN") return "—";
  if (g.length === 1) return `${g}/${g}`;
  if (g.length === 2 && g[0] === g[1]) return `${g[0]}/${g[1]}`;
  if (g.length === 2) return `${g[0]}/${g[1]}`;
  if (g.includes("/")) return g;
  if (g.includes("-")) return g.replace("-", "/");
  return g;
}

/**
 * Parse entire file into rsid index (all rsids, not just panel).
 * Used internally before panel extraction.
 */
function parseAllVariants(content: string): Map<string, ParsedVariant> {
  const index = new Map<string, ParsedVariant>();

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const parts = trimmed.split(/\t/);
    if (parts.length < 4) continue;

    const rsid = parts[0].trim();
    if (!rsid.startsWith("rs")) continue;
    if (index.has(rsid)) continue;

    const rawGeno = parts[3].trim();
    index.set(rsid, {
      rsid,
      chromosome: parts[1].trim(),
      position: parts[2].trim(),
      genotype: rawGeno,
    });
  }

  return index;
}

/**
 * Parse file text into panel SNP rows only (legacy helper for pipeline).
 */
export function parse23andMeFile(content: string): ParsedVariant[] {
  const index = parseAllVariants(content);
  const variants: ParsedVariant[] = [];

  for (const rsid of PANEL_RSIDS) {
    const hit = index.get(rsid);
    if (hit) variants.push(hit);
  }

  return variants;
}

/**
 * Full 8-SNP panel view — includes missing loci so clinicians see X/8 coverage.
 */
export function getFullPanelRows(content: string): PanelRow[] {
  const index = parseAllVariants(content);

  return PANEL_RSIDS.map((rsid) => {
    const gene = PANEL_GENE_MAP[rsid];
    const hit = index.get(rsid);

    if (!hit) {
      return {
        rsid,
        gene,
        chromosome: "",
        position: "",
        genotype: "—",
        displayGenotype: "—",
        status: "not_on_chip" as const,
      };
    }

    const display = formatGenotype(hit.genotype);
    const status =
      display === "—" || hit.genotype === "--" ? ("no_call" as const) : ("found" as const);

    return {
      rsid,
      gene,
      chromosome: hit.chromosome,
      position: hit.position,
      genotype: hit.genotype,
      displayGenotype: display,
      status,
    };
  });
}

/** Count how many panel SNPs were found in the upload. */
export function countPanelCoverage(rows: PanelRow[]): { found: number; total: number } {
  const found = rows.filter((r) => r.status === "found").length;
  return { found, total: PANEL_RSIDS.length };
}

/** Returns true when file content looks like raw genomic text (not binary zip garbage). */
export function looksLikeGenomicText(content: string): boolean {
  const sample = content.slice(0, 4000);
  if (sample.includes("\0")) return false;
  return /#.*rsid|rs\d+\s/i.test(sample) || /^rs\d+\t/m.test(sample);
}

/** Count total rs lines in file (informational for Stage 1). */
export function countTotalRsLines(content: string): number {
  let n = 0;
  for (const line of content.split(/\r?\n/)) {
    if (line.trim().startsWith("rs")) n += 1;
  }
  return n;
}
