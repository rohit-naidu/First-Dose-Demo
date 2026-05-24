/**
 * Fixed pharmacogenomic panel — 8 SNPs used for First Dose CDS demo.
 * Only these rsids are scored; other variants in the upload file are ignored.
 */

export const PANEL_RSIDS = [
  "rs1801282", // PPARG
  "rs10305492", // GLP1R
  "rs10423928", // GIPR
  "rs7903146", // TCF7L2
  "rs9939609", // FTO
  "rs17782313", // MC4R
  "rs5219", // KCNJ11
  "rs738409", // PNPLA3
] as const;

export type PanelRsid = (typeof PANEL_RSIDS)[number];

/** Quick lookup: rsid → default gene symbol from our KB. */
export const PANEL_GENE_MAP: Record<PanelRsid, string> = {
  rs1801282: "PPARG",
  rs10305492: "GLP1R",
  rs10423928: "GIPR",
  rs7903146: "TCF7L2",
  rs9939609: "FTO",
  rs17782313: "MC4R",
  rs5219: "KCNJ11",
  rs738409: "PNPLA3",
};

/** Returns true when an rsid is part of the active scoring panel. */
export function isPanelRsid(rsid: string): rsid is PanelRsid {
  return (PANEL_RSIDS as readonly string[]).includes(rsid);
}
