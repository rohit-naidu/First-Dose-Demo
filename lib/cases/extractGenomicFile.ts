/**
 * Extract raw genomic text from an upload (.txt or .zip containing a .txt).
 * Zip support handles Wormhole / 23andMe full export downloads.
 */

import AdmZip from "adm-zip";

export type GenomicExtractResult = {
  content: string;
  /** Final logical filename used for display. */
  fileName: string;
  /** When a zip was unpacked, name of the inner .txt file. */
  extractedFrom?: string;
  /** Human-readable note for the UI status bar. */
  note?: string;
};

/** True when buffer looks like a ZIP archive (PK header). */
function isZipBuffer(buffer: Buffer): boolean {
  return buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

/**
 * Read upload bytes and return 23andMe-style text content.
 * @throws Error when zip has no .txt or content is empty
 */
export function extractGenomicContent(buffer: Buffer, originalName: string): GenomicExtractResult {
  const lower = originalName.toLowerCase();
  const isZip = lower.endsWith(".zip") || isZipBuffer(buffer);

  if (!isZip) {
    const content = buffer.toString("utf8");
    if (!content.trim()) throw new Error("Uploaded file is empty.");
    return { content, fileName: originalName };
  }

  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().filter((e) => !e.isDirectory && e.entryName.toLowerCase().endsWith(".txt"));

  if (entries.length === 0) {
    throw new Error(
      "Zip file contains no .txt genomic export. Unzip manually and upload the raw 23andMe .txt file.",
    );
  }

  // Prefer filenames that look like 23andMe full exports
  const preferred =
    entries.find((e) => /genome_.*full/i.test(e.entryName)) ??
    entries.find((e) => /23andme|genome|ancestry/i.test(e.entryName)) ??
    entries[0];

  const content = preferred.getData().toString("utf8");
  if (!content.trim()) throw new Error("Extracted .txt file is empty.");

  const innerName = preferred.entryName.split("/").pop() ?? preferred.entryName;
  return {
    content,
    fileName: innerName,
    extractedFrom: originalName,
    note: `Extracted ${innerName} from ${originalName}`,
  };
}
