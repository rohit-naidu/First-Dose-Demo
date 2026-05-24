"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Dna,
  FileSpreadsheet,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";
import { ClinicalBrief } from "@/components/clinical/ClinicalBrief";
import { DemoGuideBanner } from "@/components/clinical/DemoGuideBanner";
import { GenomicFileStatusBar } from "@/components/clinical/GenomicFileStatusBar";
import { GeneReportModal } from "@/components/clinical/GeneReportModal";
import { PatientChartBanner } from "@/components/clinical/PatientChartBanner";
import { PatientDemographicsPanel } from "@/components/clinical/PatientDemographicsPanel";
import { PrescriptionPlanPanel } from "@/components/clinical/PrescriptionPlanPanel";
import { PrescriptionProtocolDivider } from "@/components/clinical/PrescriptionProtocolDivider";
import { ScienceReviewPanel } from "@/components/clinical/ScienceReviewPanel";
import { SupportingEvidenceSection } from "@/components/clinical/SupportingEvidenceSection";
import type { ClinicalCase } from "@/lib/cases/types";
import { adaptPipelineToUi } from "@/lib/clinical/pipelineAdapter";
import { orderPayload } from "@/lib/clinical/constants";
import { ui } from "@/lib/ui/clinicalTheme";

const GLP1R_MARKER = "rs10305492";

/**
 * Case workstation — upload genomic file, run pipeline, review CDS output.
 */
export default function CaseWorkstationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.id as string;
  const isDemoMode = searchParams.get("demo") === "1" || caseId === "demo-alex-mercer";

  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isGenomicReportOpen, setIsGenomicReportOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [rejectionNotice, setRejectionNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCase = useCallback(async () => {
    const res = await fetch(`/api/cases/${caseId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load case");
    setClinicalCase(data.case);
    setRejectionNotice(data.case.status === "rejected");
  }, [caseId]);

  const uiBundle = useMemo(() => {
    if (!clinicalCase?.pipelineSnapshot || !clinicalCase.composedPlan) return null;
    return adaptPipelineToUi(clinicalCase.pipelineSnapshot, clinicalCase.composedPlan);
  }, [clinicalCase]);

  const hasPipeline = clinicalCase?.status === "pipeline_complete" || clinicalCase?.status === "approved";

  function jumpToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openGlp1rDeepDive() {
    setSelectedMarker(GLP1R_MARKER);
    setIsGenomicReportOpen(true);
    jumpToSection("demo-science-review");
  }

  useEffect(() => {
    loadCase()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [loadCase]);

  /** Demo mode: scroll to the science panel once pipeline results are visible. */
  useEffect(() => {
    if (!isDemoMode || loading || !hasPipeline) return;
    const timer = window.setTimeout(() => {
      document.getElementById("demo-science-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isDemoMode, loading, hasPipeline]);
  const prettyPayload = useMemo(
    () =>
      JSON.stringify(
        {
          ...orderPayload,
          patient_id: caseId,
          compound: clinicalCase?.targetDrug ?? "retatrutide",
        },
        null,
        2,
      ),
    [caseId, clinicalCase?.targetDrug],
  );

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch(`/api/cases/${caseId}/upload`, { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      setIsRunningPipeline(true);
      const pipeRes = await fetch(`/api/cases/${caseId}/run-pipeline`, { method: "POST" });
      const pipeData = await pipeRes.json();
      if (!pipeRes.ok) throw new Error(pipeData.error ?? "Pipeline failed");

      setClinicalCase(pipeData.case);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsUploading(false);
      setIsRunningPipeline(false);
    }
  }

  async function handleReject() {
    const res = await fetch(`/api/cases/${caseId}/reject`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setClinicalCase(data.case);
      setRejectionNotice(true);
    }
  }

  async function handleApprove() {
    const res = await fetch(`/api/cases/${caseId}/approve`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setClinicalCase(data.case);
      setRejectionNotice(false);
    }
  }

  if (loading) {
    return (
      <main className={ui.app}>
        <p className="p-4">Loading case…</p>
      </main>
    );
  }

  if (!clinicalCase) {
    return (
      <main className={ui.app}>
        <p className="p-4 text-[#800000]">{error ?? "Case not found"}</p>
        <Link className={`${ui.btn} m-4 inline-flex`} href="/">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className={ui.app}>
      <div className={ui.layout}>
        <aside className={ui.sidebar}>
          <div className={ui.sidebarBrand}>
            <Dna className="h-5 w-5 text-[#003366]" />
            <div>
              <p className={ui.sidebarTitle}>First Dose Health</p>
              <h1 className="text-sm font-bold">Case workstation</h1>
            </div>
          </div>
          <Link className={ui.navItem} href="/">
            ← All cases
          </Link>
          <div className={ui.sidebarNote}>
            <ShieldCheck className="mb-1 inline h-4 w-4 text-[#003366]" /> Target:{" "}
            {clinicalCase.targetDrug}
          </div>
        </aside>

        <section className={ui.workArea}>
          <div className={ui.content}>
            <PatientChartBanner
              caseId={clinicalCase.id}
              intake={clinicalCase.intake}
              status={clinicalCase.status}
              targetDrug={clinicalCase.targetDrug}
            />

            {isDemoMode && hasPipeline && clinicalCase.pipelineSnapshot ? (
              <DemoGuideBanner
                kbVersion={clinicalCase.pipelineSnapshot.kbVersion}
                onJumpTo={jumpToSection}
                onOpenGlp1r={openGlp1rDeepDive}
                panelFound={clinicalCase.pipelineSnapshot.panelFoundCount}
                panelTotal={clinicalCase.pipelineSnapshot.panelTotal}
              />
            ) : null}

            {!hasPipeline ? (
              <div className="space-y-2">
                <PatientDemographicsPanel
                  caseId={clinicalCase.id}
                  intake={clinicalCase.intake}
                  status={clinicalCase.status}
                  variant="intake"
                />

                <div className={ui.panel}>
                  <div className={ui.panelTitle}>Genomic intake — upload 23andMe file</div>
                  <div className={ui.panelBody}>
                    <p className={ui.bodyText}>
                      Upload 23andMe raw data (.txt) or a zip export from Wormhole — we extract the
                      .txt automatically. The science engine scans 8 GLP-1–related genes, matches
                      curated research, merges reported symptoms, and drafts a retatrutide plan.
                    </p>
                    <label className={`${ui.dropZone} mt-3 block cursor-pointer`}>
                      <FileSpreadsheet className="mb-2 h-6 w-6 text-[#003366]" />
                      <p className="font-bold">Genomic ingest</p>
                      <p className="text-xs text-[#555]">23andMe .txt or .zip (Wormhole export)</p>
                      <input
                        accept=".txt,.zip"
                        className="hidden"
                        disabled={isUploading || isRunningPipeline}
                        onChange={handleFileUpload}
                        type="file"
                      />
                    </label>
                    {(isUploading || isRunningPipeline) && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUploading ? "Uploading…" : "Running 5-stage pipeline…"}
                      </div>
                    )}
                    {error ? <p className="mt-2 text-sm text-[#800000]">{error}</p> : null}
                    <p className={`mt-2 ${ui.muted}`}>
                      Tip: use <code>fixtures/sample-23andme.txt</code> for testing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <PatientDemographicsPanel
                  caseId={clinicalCase.id}
                  intake={clinicalCase.intake}
                  status={clinicalCase.status}
                  variant="chart"
                />

                <GenomicFileStatusBar
                  clinicalCase={clinicalCase}
                  snapshot={clinicalCase.pipelineSnapshot}
                />

                {clinicalCase.pipelineSnapshot ? (
                  <ScienceReviewPanel
                    demoMode={isDemoMode}
                    intake={clinicalCase.intake}
                    onSelectGene={(m) => {
                      setSelectedMarker(m);
                      setIsGenomicReportOpen(true);
                    }}
                    snapshot={clinicalCase.pipelineSnapshot}
                    targetDrug={clinicalCase.targetDrug}
                  />
                ) : null}

                {uiBundle ? (
                  <>
                    <div id="demo-clinical-brief">
                      <ClinicalBrief
                        hasGenomicData={uiBundle.hasGenomicData}
                        onOpenFullReport={() => setIsGenomicReportOpen(true)}
                        onSelectGene={setSelectedMarker}
                        sideEffects={uiBundle.sideEffects}
                        variants={uiBundle.variants}
                      />
                    </div>

                    <PrescriptionProtocolDivider approved={clinicalCase.status === "approved"} />

                    <div id="demo-prescription-plan">
                      {clinicalCase.composedPlan ? (
                        <PrescriptionPlanPanel
                          onSelectGene={setSelectedMarker}
                          plan={clinicalCase.composedPlan}
                        />
                      ) : null}
                      <SupportingEvidenceSection
                        onSelectWeek={setSelectedWeek}
                        selectedWeek={selectedWeek}
                        titrationSchedule={uiBundle.titrationSchedule}
                      />
                    </div>
                  </>
                ) : null}

                {!isDemoMode ? (
                  <div className={ui.panel}>
                    <div className={ui.panelTitle}>Re-upload genomic file</div>
                    <div className={ui.panelBody}>
                      <label className={`${ui.dropZone} block cursor-pointer`}>
                        <FileSpreadsheet className="mb-2 h-6 w-6 text-[#003366]" />
                        <p className="font-bold">Replace genomic file</p>
                        <p className="text-xs text-[#555]">.txt or .zip</p>
                        <input
                          accept=".txt,.zip"
                          className="hidden"
                          disabled={isUploading || isRunningPipeline}
                          onChange={handleFileUpload}
                          type="file"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <footer className={ui.footer}>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className={ui.footerStatus}>
                <strong>FDA CDS Class I</strong> — physician sign-off required
                {rejectionNotice ? (
                  <p className="mt-1 font-semibold text-[#800000]">
                    Protocol rejected. No pharmacy transmission.
                  </p>
                ) : null}
                {clinicalCase.status === "approved" ? (
                  <p className="mt-1 font-semibold text-[#006600]">Protocol approved.</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {hasPipeline ? (
                  <a
                    className={ui.btn}
                    href={`/api/cases/${caseId}/export`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Export HTML
                  </a>
                ) : null}
                <button className={ui.btnDanger} onClick={handleReject} type="button">
                  Reject protocol
                </button>
                <button
                  className={ui.btnPrimary}
                  disabled={!hasPipeline}
                  onClick={() => {
                    handleApprove();
                    setIsOrderModalOpen(true);
                  }}
                  type="button"
                >
                  <Send className="h-4 w-4" />
                  Approve & route
                </button>
              </div>
            </div>
          </footer>
        </section>
      </div>

      {isGenomicReportOpen && uiBundle && uiBundle.geneProfiles.length > 0 ? (
        <GeneReportModal
          molecularSummary={uiBundle.molecularSummary}
          onClose={() => {
            setSelectedMarker(null);
            setIsGenomicReportOpen(false);
          }}
          onSelectMarker={setSelectedMarker}
          profiles={uiBundle.geneProfiles}
          selectedMarker={selectedMarker}
        />
      ) : null}

      {isOrderModalOpen ? (
        <div className={ui.modalOverlay}>
          <div className="mx-auto w-full max-w-lg border-2 border-[#404040] bg-[#f5f5f5]">
            <div className={ui.modalTitleBar}>
              <div>
                <p className={ui.modalSubtitle}>Photon Health interface</p>
                <h3 className={ui.modalTitle}>Pharmacy order transmission</h3>
              </div>
              <button
                className={ui.modalClose}
                onClick={() => setIsOrderModalOpen(false)}
                type="button"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-2">
              <pre className={ui.pre}>{prettyPayload}</pre>
              <div className="mt-2 border border-[#008000] bg-[#e8ffe8] p-3 text-center">
                <Check className="mx-auto h-8 w-8 text-[#006600]" />
                <p className="mt-2 font-bold text-[#006600]">Transmission OK</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
