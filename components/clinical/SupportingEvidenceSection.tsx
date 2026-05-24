"use client";

import { useState } from "react";
import { metabolicMarkers, pubMedCitations, pkGeneBridgeCopy } from "@/lib/clinical/constants";
import type { TitrationWeek } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";
import { PkEvidencePanel } from "./PkEvidencePanel";

type SupportingEvidenceSectionProps = {
  selectedWeek: number;
  onSelectWeek: (index: number) => void;
  /** Live titration schedule from composed plan. */
  titrationSchedule?: TitrationWeek[];
};

export function SupportingEvidenceSection({
  selectedWeek,
  onSelectWeek,
  titrationSchedule = [],
}: SupportingEvidenceSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPubMedOpen, setIsPubMedOpen] = useState(false);
  const schedule = titrationSchedule[selectedWeek];

  return (
    <section className={ui.panel}>
      <button
        className={`${ui.panelTitle} flex w-full items-center justify-between hover:bg-[#c8c4bc]`}
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <span>Supporting evidence (PK, clearance, titration, references)</span>
        <span className="font-normal normal-case">{isOpen ? "[−]" : "[+]"}</span>
      </button>

      {isOpen ? (
        <div className={`${ui.panelBody} space-y-2`}>
          <PkEvidencePanel bridgeCopy={pkGeneBridgeCopy} />

          <div className="grid gap-2 lg:grid-cols-2">
            <div className={ui.panel}>
              <div className={ui.panelTitle}>Non-genomic modifiers (clearance)</div>
              <table className={ui.table}>
                <thead className={ui.tableHead}>
                  <tr>
                    <th className={ui.th}>Test</th>
                    <th className={ui.th}>Result</th>
                    <th className={ui.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metabolicMarkers.map((marker) => (
                    <tr key={marker.label} className="odd:bg-white even:bg-[#f7f7f7]">
                      <td className={ui.td}>{marker.label}</td>
                      <td className={`${ui.td} font-semibold`}>{marker.value}</td>
                      <td className={`${ui.td} font-semibold text-[#665500]`}>{marker.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={ui.panel}>
              <div className={ui.panelTitle}>4-week titration schedule</div>
              <div className={ui.panelBody}>
                {titrationSchedule.length === 0 ? (
                  <p className={ui.muted}>Run pipeline to generate titration schedule.</p>
                ) : (
                  <>
                    <table className={ui.table}>
                      <thead className={ui.tableHead}>
                        <tr>
                          <th className={ui.th}>Week</th>
                          <th className={ui.th}>Cadence</th>
                          <th className={ui.th}>Dose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {titrationSchedule.map((row, index) => (
                          <tr
                            key={row.week}
                            className={`cursor-pointer odd:bg-white even:bg-[#f7f7f7] ${
                              selectedWeek === index ? "bg-[#e8f4ff] font-semibold" : ""
                            }`}
                            onClick={() => onSelectWeek(index)}
                          >
                            <td className={ui.td}>{row.week}</td>
                            <td className={ui.td}>{row.cadence}</td>
                            <td className={ui.td}>{row.dose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {schedule ? (
                      <>
                        <p className="mt-2 text-xs font-bold">Prophylaxis ({schedule.week})</p>
                        <p className="text-sm">{schedule.support}</p>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={ui.panel}>
            <button
              className={`${ui.panelTitle} flex w-full justify-between hover:bg-[#c8c4bc]`}
              onClick={() => setIsPubMedOpen((v) => !v)}
              type="button"
            >
              <span>Evidence appendix (PubMed)</span>
              <span className="font-normal normal-case">{isPubMedOpen ? "[−]" : "[+]"}</span>
            </button>
            {isPubMedOpen ? (
              <div className={ui.panelBody}>
                <p className={`${ui.pre} mb-2`}>C_t = C_0 * e^(-k_e * t)</p>
                <p className={`mb-2 ${ui.muted}`}>
                  k_e adjusted −14.1% from eGFR and phenotypic clearance.
                </p>
                <ul className="list-inside list-disc text-xs text-[#333]">
                  {pubMedCitations.map((citation) => (
                    <li key={citation} className="mb-1">
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
