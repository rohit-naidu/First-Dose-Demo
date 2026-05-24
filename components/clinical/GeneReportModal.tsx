"use client";

import { impactTierClasses } from "@/lib/clinical/severityStyles";
import type { GeneClinicalProfile } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";
import { GeneCpicPanel } from "./GeneCpicPanel";

type GeneReportModalProps = {
  selectedMarker: string | null;
  onSelectMarker: (marker: string) => void;
  onClose: () => void;
  /** Live gene profiles from pipeline adapter. */
  profiles: GeneClinicalProfile[];
  /** Summary stats for the modal header table. */
  molecularSummary?: { label: string; value: string }[];
};

export function GeneReportModal({
  selectedMarker,
  onSelectMarker,
  onClose,
  profiles,
  molecularSummary = [],
}: GeneReportModalProps) {
  const selectedProfile = selectedMarker
    ? profiles.find((p) => p.marker === selectedMarker)
    : null;

  const summary =
    molecularSummary.length > 0
      ? molecularSummary
      : [
          { label: "Parsed loci", value: String(profiles.length) },
          {
            label: "High-impact",
            value: String(profiles.filter((p) => p.severity === "High").length),
          },
          { label: "Evidence", value: "Live pipeline" },
        ];

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modal}>
        <div className={ui.modalTitleBar}>
          <div>
            <p className={ui.modalSubtitle}>Genomic identification report</p>
            <h3 className={ui.modalTitle}>Genomic evidence review</h3>
          </div>
          <button className={ui.modalClose} onClick={onClose} type="button" aria-label="Close">
            ×
          </button>
        </div>

        <div className="grid gap-2 p-2 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <table className={`${ui.table} mb-2`}>
              <thead className={ui.tableHead}>
                <tr>
                  {summary.map((item) => (
                    <th key={item.label} className={ui.th}>
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {summary.map((item) => (
                    <td key={item.label} className={`${ui.td} font-bold`}>
                      {item.value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <GenePanelList
              onSelect={onSelectMarker}
              profiles={profiles}
              selectedMarker={selectedMarker}
            />
          </section>

          <section className="lg:col-span-3">
            {selectedProfile ? (
              <GeneDetailPanel profile={selectedProfile} />
            ) : (
              <div className={`${ui.insetBox} min-h-[50vh] text-center`}>
                <p className="font-bold">Select a variant from the list</p>
                <p className={`mt-2 ${ui.muted}`}>
                  CPIC detail, pathway notes, and references appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function GenePanelList({
  profiles,
  selectedMarker,
  onSelect,
}: {
  profiles: GeneClinicalProfile[];
  selectedMarker: string | null;
  onSelect: (marker: string) => void;
}) {
  return (
    <div className={ui.panel}>
      <div className={ui.panelTitle}>Identified gene panel</div>
      <div className="max-h-[65vh] overflow-y-auto">
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.th}>Gene</th>
              <th className={ui.th}>rsID</th>
              <th className={ui.th}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((variant) => {
              const styles = impactTierClasses(variant.severity);
              const selected = selectedMarker === variant.marker;
              return (
                <tr
                  key={variant.marker}
                  className={`cursor-pointer ${selected ? "bg-[#e8f4ff]" : "odd:bg-white even:bg-[#f7f7f7]"} hover:bg-[#ddeeff]`}
                  onClick={() => onSelect(variant.marker)}
                >
                  <td className={ui.td}>
                    <strong>{variant.gene}</strong>
                    <br />
                    <span className="text-xs">
                      {variant.genotype} — {variant.interpretation}
                    </span>
                  </td>
                  <td className={`${ui.td} font-mono text-xs`}>{variant.marker}</td>
                  <td className={ui.td}>
                    <span className={styles.badge}>{variant.severity}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GeneDetailPanel({ profile }: { profile: GeneClinicalProfile }) {
  const report = profile.deepDive;

  return (
    <div className="space-y-2">
      <GeneCpicPanel profile={profile} />

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Clinical meaning</div>
        <p className={ui.panelBody}>{report.clinicalMeaning}</p>
      </div>

      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {report.incidenceRows.map((row) => (
              <th key={row.label} className={ui.th}>
                {row.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {report.incidenceRows.map((row) => (
              <td key={row.label} className={ui.td}>
                {row.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Mechanistic interpretation</div>
        <table className={ui.table}>
          <tbody>
            {report.pathwayRows.map((row) => (
              <tr key={row.label} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={`${ui.td} w-28 font-bold`}>{row.label}</td>
                <td className={ui.td}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <table className={ui.table}>
        <tbody>
          <tr className="bg-[#f8fbff]">
            <td className={`${ui.td} align-top font-bold`}>PK / model impact</td>
            <td className={ui.td}>{report.pkModelEffect}</td>
          </tr>
          <tr>
            <td className={`${ui.td} font-bold`}>Monitoring</td>
            <td className={ui.td}>{report.monitoringPlan}</td>
          </tr>
        </tbody>
      </table>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Evidence notes</div>
        <ul className={`${ui.panelBody} list-inside list-disc text-sm`}>
          {report.evidenceBullets.map((bullet) => (
            <li key={bullet} className="mb-1">
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      <div className={ui.panel}>
        <div className={ui.panelTitle}>Source stack</div>
        <ul className={`${ui.panelBody} list-inside list-decimal text-xs`}>
          {report.sourceStack.map((source) => (
            <li key={source} className="mb-1">
              {source}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
