/**
 * POST /api/cases/[id]/upload — multipart genomic file upload (.txt or .zip)
 */

import { NextResponse } from "next/server";
import { extractGenomicContent } from "@/lib/cases/extractGenomicFile";
import { getCase, saveGenomicFile, updateCase } from "@/lib/cases/store";
import { looksLikeGenomicText } from "@/lib/science/parser";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await getCase(id);
  if (!existing) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file field required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extracted = extractGenomicContent(buffer, file.name);

    if (!looksLikeGenomicText(extracted.content)) {
      return NextResponse.json(
        {
          error:
            "File does not look like 23andMe raw data. Upload the .txt export (or a zip containing it), not a PDF or other format.",
        },
        { status: 400 },
      );
    }

    await saveGenomicFile(id, extracted.fileName, extracted.content);

    const updated = await updateCase(id, {
      status: "genomic_uploaded",
      genomicFileName: extracted.fileName,
      genomicUploadedAt: new Date().toISOString(),
      genomicExtractedFrom: extracted.extractedFrom,
      genomicExtractNote: extracted.note,
    });

    return NextResponse.json({
      case: updated,
      bytes: extracted.content.length,
      fileName: extracted.fileName,
      extractedFrom: extracted.extractedFrom,
      note: extracted.note,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 },
    );
  }
}
