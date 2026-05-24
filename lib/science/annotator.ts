/**
 * Stage 2 — Annotate parsed variants with gene symbols.
 * Uses local KB first; optionally queries Ensembl REST for unknown rsids.
 */

import { getKbGeneMap, getKbEntryByRsid } from "./evidence/loader";
import { PANEL_GENE_MAP, isPanelRsid } from "./evidence/panel";
import { formatGenotype } from "./parser";
import type { AnnotatedVariant, ParsedVariant } from "./types";

/** Population context notes for panel SNPs (reference layer — not side-effect claims). */
const POPULATION_NOTES: Record<string, string> = {
  rs1801282: "Common Pro12Ala-region variant; frequency varies by ancestry",
  rs10305492: "GLP1R missense signal; enriched in some European cohorts",
  rs10423928: "Common GIPR SNV in metabolic-health cohorts",
  rs7903146: "Highly replicated T2D risk locus",
  rs9939609: "Classic FTO obesity-risk marker",
  rs17782313: "MC4R downstream obesity-associated variant",
  rs5219: "KCNJ11 E23K; beta-cell excitability modifier",
  rs738409: "PNPLA3 I148M; hepatic fat risk allele",
};

/** Local KB gene lookup — fast and works offline. */
function annotateFromKb(variant: ParsedVariant): AnnotatedVariant {
  const kbMap = getKbGeneMap();
  const entry = getKbEntryByRsid(variant.rsid);
  const gene =
    kbMap[variant.rsid] ??
    (isPanelRsid(variant.rsid) ? PANEL_GENE_MAP[variant.rsid] : "UNKNOWN");

  return {
    ...variant,
    gene,
    displayGenotype: formatGenotype(variant.genotype),
    annotationSource: gene === "UNKNOWN" ? "unknown" : "kb",
    variantLabel: entry?.interpretation ?? "Panel variant",
    populationNote: POPULATION_NOTES[variant.rsid] ?? "See gnomAD for population frequency",
  };
}

/**
 * Optional Ensembl REST lookup (best-effort, non-blocking on failure).
 * Docs: https://rest.ensembl.org/
 */
async function annotateFromEnsembl(variant: ParsedVariant): Promise<string | null> {
  try {
    const url = `https://rest.ensembl.org/variation/human/${variant.rsid}?content-type=application/json`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      mappings?: { seq_region_name?: string; gene_symbol?: string }[];
    };
    const mapping = data.mappings?.[0];
    return mapping?.gene_symbol ?? null;
  } catch {
    return null;
  }
}

/**
 * Annotate all parsed variants.
 * @param variants Parsed panel SNPs
 * @param useEnsembl When true, attempt REST enrichment for UNKNOWN genes
 */
export async function annotateVariants(
  variants: ParsedVariant[],
  useEnsembl = false,
): Promise<AnnotatedVariant[]> {
  const annotated = variants.map(annotateFromKb);

  if (!useEnsembl) return annotated;

  const enriched: AnnotatedVariant[] = [];
  for (const v of annotated) {
    if (v.gene !== "UNKNOWN") {
      enriched.push(v);
      continue;
    }
    const symbol = await annotateFromEnsembl(v);
    enriched.push(
      symbol
        ? { ...v, gene: symbol, annotationSource: "ensembl" }
        : v,
    );
  }
  return enriched;
}
