"use client";

/**
 * Full 5-stage genomic science review — mirrors the science engine pipeline.
 * Clinicians review facts (Stages 1–2) before conclusions (3–5), before the Rx plan.
 */

import { useState } from "react";
import type { PatientIntake } from "@/lib/cases/types";
import type {
  EvidenceMatch,
  PanelRow,
  PipelineSnapshot,
  ReconciledSideEffect,
} from "@/lib/science/types";
import { likelihoodClasses } from "@/lib/clinical/severityStyles";
import { ui } from "@/lib/ui/clinicalTheme";

type ScienceReviewPanelProps = {
  snapshot: PipelineSnapshot;
  intake: PatientIntake;
  targetDrug: string;
  onSelectGene?: (rsid: string) => void;
  /** Hackathon demo: expand all 5 stages and show science-engine callout. */
  demoMode?: boolean;
};

const STAGES = [
  { id: "stage1", label: "1 Parse", key: "parse" },
  { id: "stage2", label: "2 Annotate", key: "annotate" },
  { id: "stage3", label: "3 Match", key: "match" },
  { id: "stage4", label: "4 Synthesize", key: "synthesize" },
  { id: "stage5", label: "5 Triggers", key: "triggers" },
] as const;

function confidenceBadge(confidence: string) {
  const map: Record<string, string> = {
    Established: "bg-[#e8ffe8] text-[#006600] border-[#008000]",
    Supported: "bg-[#e8f4ff] text-[#003366] border-[#003366]",
    Exploratory: "bg-[#fff8dc] text-[#665500] border-[#665500]",
    "Needs review": "bg-[#f5f5f5] text-[#555] border-[#a0a0a0]",
  };
  return map[confidence] ?? map["Needs review"];
}

function stageStatus(snapshot: PipelineSnapshot, key: string): "ok" | "warn" | "fail" {
  if (key === "parse") {
    if (snapshot.panelFoundCount === 0) return "fail";
    if (snapshot.panelFoundCount < snapshot.panelTotal) return "warn";
    return "ok";
  }
  if (key === "match") return snapshot.matchedCount > 0 ? "ok" : snapshot.panelFoundCount > 0 ? "warn" : "fail";
  if (key === "synthesize") return snapshot.reconciledSideEffects.length > 0 ? "ok" : "warn";
  return "ok";
}

export function ScienceReviewPanel({
  snapshot,
  intake,
  targetDrug,
  onSelectGene,
  demoMode = false,
}: ScienceReviewPanelProps) {
  const [openStage, setOpenStage] = useState<string>(demoMode ? "all" : "stage1");

  function isStageOpen(id: string): boolean {
    return demoMode || openStage === id;
  }

  function toggleStage(id: string) {
    if (demoMode) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setOpenStage(openStage === id ? "" : id);
  }

  function scrollTo(id: string) {
    if (!demoMode) setOpenStage(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const reportedSummary =
    intake.reportedSideEffects && intake.reportedSideEffects.length > 0
      ? intake.reportedSideEffects.map((s) => `${s.symptom} (${s.severity})`).join(", ")
      : "None documented at intake";

  return (
    <section className={ui.panel} id="demo-science-review">
      <div className={ui.panelTitle}>
        Genomic science review · Evidence KB {snapshot.kbVersion}
        {demoMode ? (
          <span className="ml-2 border border-[#008000] bg-[#e8ffe8] px-1.5 py-0.5 text-xs font-semibold text-[#006600]">
            5-stage engine · all stages expanded
          </span>
        ) : null}
      </div>
      <div className={ui.panelBody}>
        {demoMode ? (
          <div className="mb-3 rounded border border-[#003366] bg-[#e8f4ff] px-3 py-2 text-sm">
            <strong className="text-[#003366]">Science we built:</strong> deterministic pipeline —{" "}
            <code className="text-xs">lib/science/pipeline/runPipeline.ts</code> orchestrates parse →
            annotate → evidence KB match → side-effect synthesis + symptom reconciliation → plan
            triggers. Curated{" "}
            <strong>{snapshot.matchedCount} PubMed/DOI entries</strong> across{" "}
            <strong>{snapshot.panelTotal} PGx loci</strong> (GLP1R, GIPR, TCF7L2, PPARG, FTO, MC4R,
            KCNJ11, PNPLA3). No LLM hallucination — every recommendation traces to rsID + citation.
          </div>
        ) : null}
        <p className={`mb-3 ${ui.muted}`}>
          We read {snapshot.panelTotal} genotypes from the patient file, annotate them, match curated{" "}
          {targetDrug} / GLP-1 research, merge with reported symptoms, and draft plan triggers. Genetics
          inform the plan — they are not diagnostic.
        </p>

        {intake.reportedSideEffects && intake.reportedSideEffects.length > 0 ? (
          <p className="mb-3 rounded border border-[#665500] bg-[#fff8dc] px-2 py-1 text-sm">
            <strong>Reported symptoms:</strong> {reportedSummary}
            {intake.currentDose ? ` · Current dose: ${intake.currentDose}` : ""}
            {intake.weeksOnTherapy != null ? ` · Week ${intake.weeksOnTherapy} on therapy` : ""}
          </p>
        ) : null}

        {/* Progress strip */}
        <div className="mb-4 flex flex-wrap gap-1">
          {STAGES.map((s) => {
            const st = stageStatus(snapshot, s.key);
            const icon = st === "ok" ? "✓" : st === "warn" ? "!" : "✗";
            const color =
              st === "ok"
                ? "border-[#008000] bg-[#e8ffe8]"
                : st === "warn"
                  ? "border-[#665500] bg-[#fff8dc]"
                  : "border-[#800000] bg-[#ffe8e8]";
            return (
              <button
                key={s.id}
                className={`border px-2 py-1 text-xs font-semibold ${color}`}
                onClick={() => scrollTo(s.id)}
                type="button"
              >
                {icon} {s.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <Stage1Panel
            id="stage1"
            open={isStageOpen("stage1")}
            onToggle={() => toggleStage("stage1")}
            rows={snapshot.panelRows}
            onSelectGene={onSelectGene}
            found={snapshot.panelFoundCount}
            total={snapshot.panelTotal}
          />
          <Stage2Panel
            annotated={snapshot.annotatedVariants}
            id="stage2"
            open={isStageOpen("stage2")}
            onSelectGene={onSelectGene}
            onToggle={() => toggleStage("stage2")}
          />
          <Stage3Panel
            drug={targetDrug}
            id="stage3"
            matches={snapshot.evidenceMatches}
            onSelectGene={onSelectGene}
            open={isStageOpen("stage3")}
            onToggle={() => toggleStage("stage3")}
          />
          <Stage4Panel
            effects={snapshot.reconciledSideEffects}
            id="stage4"
            onSelectGene={onSelectGene}
            open={isStageOpen("stage4")}
            onToggle={() => toggleStage("stage4")}
          />
          <Stage5Panel
            id="stage5"
            open={isStageOpen("stage5")}
            onToggle={() => toggleStage("stage5")}
            triggers={snapshot.planTriggers}
          />
        </div>
      </div>
    </section>
  );
}

function StageShell({
  id,
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="border border-[#c0c0c0]">
      <button
        className="flex w-full items-center justify-between bg-[#e8e8e8] px-3 py-2 text-left text-sm font-bold hover:bg-[#ddd]"
        onClick={onToggle}
        type="button"
      >
        <span>{title}</span>
        <span className="font-normal text-xs text-[#555]">{open ? "[−]" : "[+]"} {subtitle}</span>
      </button>
      {open ? <div className="p-3">{children}</div> : null}
    </div>
  );
}

function Stage1Panel({
  id,
  open,
  onToggle,
  rows,
  found,
  total,
  onSelectGene,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  rows: PanelRow[];
  found: number;
  total: number;
  onSelectGene?: (rsid: string) => void;
}) {
  return (
    <StageShell
      id={id}
      onToggle={onToggle}
      open={open}
      subtitle={`${found}/${total} panel SNPs`}
      title="Stage 1 — What we read from the file (facts only)"
    >
      <p className={`mb-2 text-xs ${ui.muted}`}>
        No clinical conclusions at this step — only genotypes observed in the upload.
      </p>
      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {["Gene", "rsID", "Genotype", "Status"].map((h) => (
              <th key={h} className={ui.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rsid} className="odd:bg-white even:bg-[#f7f7f7]">
              <td className={ui.td}>{row.gene}</td>
              <td className={ui.td}>
                {onSelectGene && row.status === "found" ? (
                  <button className={ui.geneChip} onClick={() => onSelectGene(row.rsid)} type="button">
                    {row.rsid}
                  </button>
                ) : (
                  row.rsid
                )}
              </td>
              <td className={`${ui.td} font-semibold`}>{row.displayGenotype}</td>
              <td className={ui.td}>
                {row.status === "found" ? (
                  <span className="text-[#006600]">Found</span>
                ) : row.status === "no_call" ? (
                  <span className="text-[#665500]">No call</span>
                ) : (
                  <span className="text-[#800000]">Not on chip</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StageShell>
  );
}

function Stage2Panel({
  id,
  open,
  onToggle,
  annotated,
  onSelectGene,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  annotated: PipelineSnapshot["annotatedVariants"];
  onSelectGene?: (rsid: string) => void;
}) {
  return (
    <StageShell
      id={id}
      onToggle={onToggle}
      open={open}
      subtitle={`${annotated.length} annotated`}
      title="Stage 2 — What these variants are (reference data)"
    >
      <p className={`mb-2 text-xs ${ui.muted}`}>
        Reference annotations — GWAS/population notes are context only, not side-effect predictions.
      </p>
      {annotated.length === 0 ? (
        <p className="text-sm text-[#800000]">No variants to annotate — check file upload.</p>
      ) : (
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              {["Gene", "rsID", "Genotype", "Label", "Population note"].map((h) => (
                <th key={h} className={ui.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {annotated.map((v) => (
              <tr key={v.rsid} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={ui.td}>{v.gene}</td>
                <td className={ui.td}>
                  {onSelectGene ? (
                    <button className={ui.geneChip} onClick={() => onSelectGene(v.rsid)} type="button">
                      {v.rsid}
                    </button>
                  ) : (
                    v.rsid
                  )}
                </td>
                <td className={`${ui.td} font-semibold`}>{v.displayGenotype}</td>
                <td className={ui.td}>{v.variantLabel ?? "—"}</td>
                <td className={`${ui.td} text-xs text-[#555]`}>{v.populationNote ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StageShell>
  );
}

function Stage3Panel({
  id,
  open,
  onToggle,
  matches,
  drug,
  onSelectGene,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  matches: EvidenceMatch[];
  drug: string;
  onSelectGene?: (rsid: string) => void;
}) {
  return (
    <StageShell
      id={id}
      onToggle={onToggle}
      open={open}
      subtitle={`${matches.length} evidence matches`}
      title="Stage 3 — What the research says"
    >
      <p className={`mb-2 text-xs ${ui.muted}`}>
        Each card links observed genotype → literature → mechanism → side-effect hypothesis for{" "}
        {drug}.
      </p>
      {matches.length === 0 ? (
        <p className="text-sm text-[#800000]">
          No evidence matches — 0 panel SNPs matched the knowledge base. Re-upload raw .txt or expand
          the Evidence KB.
        </p>
      ) : (
        <div className="space-y-2">
          {matches.map((m) => (
            <div key={m.rsid} className="border border-[#c0c0c0] bg-white p-3 text-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold">
                  {m.gene} · {m.rsid} · {m.displayGenotype}
                  {onSelectGene ? (
                    <button
                      className={`${ui.geneChip} ml-2`}
                      onClick={() => onSelectGene(m.rsid)}
                      type="button"
                    >
                      Detail
                    </button>
                  ) : null}
                </p>
                <span
                  className={`border px-2 py-0.5 text-xs font-bold ${confidenceBadge(m.confidence)}`}
                >
                  {m.confidence}
                </span>
              </div>
              <dl className="grid gap-1 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-[#003366]">Observed</dt>
                  <dd>Genotype {m.displayGenotype} from patient file</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#003366]">Literature</dt>
                  <dd>{m.source}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#003366]">Mechanism</dt>
                  <dd>{m.mechanism}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[#003366]">Side effect (hypothesis)</dt>
                  <dd>
                    {m.primarySideEffect ?? "See gene profile"} — {m.primaryLikelihood ?? "—"} likelihood
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-bold text-[#003366]">Drug link</dt>
                  <dd>
                    {drug} (GLP-1 class — may be Exploratory where retatrutide-specific data is limited)
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </StageShell>
  );
}

function Stage4Panel({
  id,
  open,
  onToggle,
  effects,
  onSelectGene,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  effects: ReconciledSideEffect[];
  onSelectGene?: (rsid: string) => void;
}) {
  return (
    <StageShell
      id={id}
      onToggle={onToggle}
      open={open}
      subtitle={`${effects.length} side-effect rows`}
      title="Stage 4 — Side effects for this patient"
    >
      <p className={`mb-2 text-xs ${ui.muted}`}>
        Merges genetic predictions with symptoms reported at intake.
      </p>
      {effects.length === 0 ? (
        <p className="text-sm text-[#800000]">No side-effect signals — add reported symptoms at intake or check genetics.</p>
      ) : (
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              {[
                "Side effect",
                "Likelihood",
                "Reported?",
                "Reconciliation",
                "Plan priority",
                "Drivers",
              ].map((h) => (
                <th key={h} className={ui.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {effects.map((e) => (
              <tr key={e.event} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={ui.td}>
                  <span className="font-semibold">{e.event}</span>
                  <p className="text-xs text-[#555]">{e.mechanism}</p>
                </td>
                <td className={`${ui.td} ${likelihoodClasses(e.likelihood)}`}>{e.likelihood}</td>
                <td className={ui.td}>
                  {e.reported ? `Yes (${e.reportedSeverity ?? "—"})` : "No"}
                </td>
                <td className={ui.td}>{e.reconciliationLabel}</td>
                <td className={ui.td}>{e.planPriority}</td>
                <td className={ui.td}>
                  <div className="flex flex-wrap gap-1">
                    {e.drivenBy.map((d) => (
                      <button
                        key={d.rsid}
                        className={ui.geneChip}
                        onClick={() => onSelectGene?.(d.rsid)}
                        type="button"
                      >
                        {d.gene}
                      </button>
                    ))}
                    {e.drivenBy.length === 0 ? "—" : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StageShell>
  );
}

function Stage5Panel({
  id,
  open,
  onToggle,
  triggers,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  triggers: PipelineSnapshot["planTriggers"];
}) {
  return (
    <StageShell
      id={id}
      onToggle={onToggle}
      open={open}
      subtitle={`${triggers.length} triggers`}
      title="Stage 5 — What this means for the plan"
    >
      <p className={`mb-2 text-xs ${ui.muted}`}>
        These rules feed the prescription protocol below — not final orders until clinician approval.
      </p>
      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {["Category", "Rule / intervention", "Priority", "Because (gene · rsID)"].map((h) => (
              <th key={h} className={ui.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {triggers.map((t) => (
            <tr key={t.triggerId} className="odd:bg-white even:bg-[#f7f7f7]">
              <td className={`${ui.td} font-semibold capitalize`}>{t.category}</td>
              <td className={ui.td}>{t.detail}</td>
              <td className={ui.td}>{t.priority}</td>
              <td className={ui.td}>
                {t.because.length > 0
                  ? t.because.map((b) => `${b.gene} · ${b.rsid}`).join("; ")
                  : "Intake / default protocol"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StageShell>
  );
}
