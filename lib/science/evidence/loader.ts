/**
 * Loads the bundled evidence knowledge base JSON.
 * Server-side only — imported by matcher and pipeline.
 */

import kbJson from "./kb/evidence-kb.json";
import { EVIDENCE_KB_VERSION } from "./kb-version";

/** Shape of one KB entry (mirrors evidence-kb.json). */
export type EvidenceKbEntry = {
  id: string;
  rsid: string;
  gene: string;
  impactTier: "High" | "Moderate" | "Supportive";
  interpretation: string;
  mechanism: string;
  source: string;
  contributesTo: string[];
  sideEffects: {
    event: string;
    likelihood: "High" | "Moderate" | "Low";
    mechanism: string;
    onsetWindow: string;
  }[];
  prescribingActions: {
    action: string;
    rationale: string;
    priority: "Required" | "Recommended" | "Monitor";
  }[];
  planTriggers: {
    triggerId: string;
    category: "molecule" | "cadence" | "dose" | "escalation" | "monitoring" | "hold";
    detail: string;
    priority: "Required" | "Recommended" | "Monitor";
    weight: number;
  }[];
};

export type EvidenceKb = {
  version: string;
  entries: EvidenceKbEntry[];
};

/** Cached KB object loaded once at module init. */
let cached: EvidenceKb | null = null;

/** Return the full evidence KB with version metadata. */
export function loadEvidenceKb(): EvidenceKb {
  if (!cached) {
    cached = {
      version: kbJson.version ?? EVIDENCE_KB_VERSION,
      entries: kbJson.entries as EvidenceKbEntry[],
    };
  }
  return cached;
}

/** Lookup a single KB row by rsid. */
export function getKbEntryByRsid(rsid: string): EvidenceKbEntry | undefined {
  return loadEvidenceKb().entries.find((e) => e.rsid === rsid);
}

/** Static gene symbol map from KB (fallback for annotator). */
export function getKbGeneMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of loadEvidenceKb().entries) {
    map[entry.rsid] = entry.gene;
  }
  return map;
}
